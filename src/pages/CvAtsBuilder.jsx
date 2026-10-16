import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SEOHead from "../components/SEOHead";
import { useTranslation } from "../context/LanguageContext";
import "../styles/cvAts.css";
import {
  CV_MODE_KEY, CV_STORAGE_KEY, EMPTY_CV, EXAMPLE_CV, analyzeAts, createCvPdf, createLatex, downloadText, evaluateCvProgress,
  exportCvPdf, normaliseCv, normaliseText, readLocalCv, toPortableCvb,
} from "../utils/cvAts";
import {
  createCvDocxBlob, createPlainTextCv, downloadBlob, importResumeFile, validateCvForExport,
} from "../utils/cvDocuments";
import {
  APPLICATION_STATUSES, CV_WORKSPACE_KEY, EMPTY_WORKSPACE, compareCvVersions, createApplication, createDraftCopy, generateCoverLetter, readCvWorkspace,
  saveApplicationRevision, updateApplicationMetadata,
} from "../utils/cvWorkspace";
import { getAssistantInsights } from "../utils/cvAssistant";
import { clearLocalAnalytics, readAnalyticsConsent, readLocalAnalytics, setAnalyticsConsent, trackLocalEvent } from "../utils/cvTelemetry";
import { trackCvDownload } from "../utils/analytics";

const getSteps = (isEn) => [
  ["job", "1", isEn ? "Job Post" : "Vacante"],
  ["personal", "2", isEn ? "Profile" : "Perfil"],
  ["experience", "3", isEn ? "Experience" : "Experiencia"],
  ["skills", "4", isEn ? "Skills" : "Habilidades"],
  ["assistant", "5", isEn ? "Assistant" : "Asistente"],
  ["review", "6", isEn ? "Review" : "Revisión"],
  ["applications", "7", isEn ? "Versions" : "Versiones"],
  ["export", "8", isEn ? "Export" : "Exportar"],
];

const getStages = (isEn) => [
  { key: "objective", number: "1", label: isEn ? "Objective" : "Objetivo", steps: ["job"] },
  { key: "content", number: "2", label: isEn ? "Content" : "Contenido", steps: ["personal", "experience", "skills"] },
  { key: "optimization", number: "3", label: isEn ? "Optimization" : "Optimización", steps: ["assistant", "review"] },
  { key: "download", number: "4", label: isEn ? "Download" : "Descargar", steps: ["applications", "export"] },
];

const ONBOARDING_KEY = "cvats.builder.onboarding.v2";
const safeFilename = (value = "Mi CV ATS") => value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "mi-cv-ats";

const Field = ({ label, value, onChange, placeholder = "", type = "text" }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder}
      className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
  </label>
);

const DateField = ({ label, value, onChange, disabled = false }) => <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span><input type="month" value={/^\d{4}-\d{2}$/.test(value || "") ? value : ""} onChange={(event) => onChange(event.target.value)} disabled={disabled} className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-45" /></label>;

const emptyExperience = () => ({ company: "", position: "", start_date: "", end_date: "", location: "", description: "" });
const EMPTY_PROFILE_ENTRY = {
  education: () => ({ degree: "", institution: "", start_date: "", end_date: "" }),
  certifications: () => ({ name: "", issuer: "", date: "", credential: "" }),
  languages: () => ({ name: "", level: "" }),
  projects: () => ({ name: "", date: "", description: "", url: "" }),
};

export default function CvAtsBuilder() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const steps = useMemo(() => getSteps(isEn), [isEn]);
  const stages = useMemo(() => getStages(isEn), [isEn]);

  const [cv, setCv] = useState(readLocalCv);
  const [isDemo, setIsDemo] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedMode = window.localStorage.getItem(CV_MODE_KEY);
    if (savedMode) return savedMode === "demo";
    return false;
  });
  const [activeStep, setActiveStep] = useState("job");
  const [notice, setNotice] = useState(() => isEn ? "Active local draft: changes are stored exclusively in this browser." : "Borrador local activo: este navegador es el único que conserva los cambios.");
  const [importReview, setImportReview] = useState(null);
  const [exportErrors, setExportErrors] = useState([]);
  const [workspace, setWorkspace] = useState(readCvWorkspace);
  const [activeApplicationId, setActiveApplicationId] = useState("");
  const [onboarding, setOnboarding] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [analyticsConsent, setAnalyticsConsentState] = useState(readAnalyticsConsent);
  const completionTracked = useRef(false);
  const fileInput = useRef(null);
  const resumeInput = useRef(null);
  const history = useRef([]);
  const analysis = useMemo(() => analyzeAts(cv), [cv]);
  const progress = useMemo(() => evaluateCvProgress(cv), [cv]);
  const assistant = useMemo(() => getAssistantInsights(cv), [cv]);

  const updateCv = useCallback((updater) => {
    setCv((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      if (next === current) return current;
      history.current = [...history.current.slice(-24), current];
      return next;
    });
  }, []);

  const undo = () => {
    const previous = history.current.at(-1);
    if (!previous) return;
    history.current = history.current.slice(0, -1);
    setCv(previous);
    setNotice(isEn ? "Last change undone." : "Último cambio deshecho.");
  };

  useEffect(() => {
    window.localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cv));
    setLastSavedAt(new Date());
  }, [cv]);

  useEffect(() => {
    window.localStorage.setItem(CV_MODE_KEY, isDemo ? "demo" : "draft");
  }, [isDemo]);

  useEffect(() => {
    window.localStorage.setItem(CV_WORKSPACE_KEY, JSON.stringify(workspace));
  }, [workspace]);

  useEffect(() => {
    if (progress.percentage === 100 && !completionTracked.current) {
      trackLocalEvent("cv_completed");
      completionTracked.current = true;
    }
  }, [progress.percentage]);

  const updatePersonal = (key, value) => updateCv((current) => ({ ...current, personal: { ...current.personal, [key]: value } }));
  const updateJob = (key, value) => updateCv((current) => ({ ...current, targetJob: { ...current.targetJob, [key]: value } }));
  const updateExperience = (index, key, value) => updateCv((current) => ({
    ...current,
    experience: current.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, [key]: value } : entry),
  }));
  const updateCollectionItem = (collection, index, key, value) => updateCv((current) => ({
    ...current,
    [collection]: current[collection].map((entry, entryIndex) => entryIndex === index ? { ...entry, [key]: value } : entry),
  }));
  const addCollectionItem = (collection) => updateCv((current) => ({ ...current, [collection]: [...current[collection], EMPTY_PROFILE_ENTRY[collection]()] }));
  const duplicateCollectionItem = (collection, index) => updateCv((current) => ({ ...current, [collection]: [...current[collection].slice(0, index + 1), { ...current[collection][index] }, ...current[collection].slice(index + 1)] }));
  const removeCollectionItem = (collection, index, label) => {
    if (!window.confirm(isEn ? `Delete ${label}? This action can be undone.` : `¿Eliminar ${label}? Esta acción puede deshacerse.`)) return;
    updateCv((current) => ({ ...current, [collection]: current[collection].filter((_, entryIndex) => entryIndex !== index) }));
  };
  const moveItem = (collection, index, direction) => updateCv((current) => {
    const target = index + direction;
    if (target < 0 || target >= current[collection].length) return current;
    const items = [...current[collection]];
    [items[index], items[target]] = [items[target], items[index]];
    return { ...current, [collection]: items };
  });
  const duplicateExperience = (index) => updateCv((current) => ({ ...current, experience: [...current.experience.slice(0, index + 1), { ...current.experience[index] }, ...current.experience.slice(index + 1)] }));
  const removeExperience = (index) => {
    if (!window.confirm(isEn ? `Delete experience ${index + 1}? This action can be undone.` : `¿Eliminar la experiencia ${index + 1}? Esta acción puede deshacerse.`)) return;
    updateCv((current) => ({ ...current, experience: current.experience.filter((_, itemIndex) => itemIndex !== index) }));
  };
  const resetLocal = () => {
    if (!window.confirm(isEn ? "Delete all draft data saved in this browser?" : "¿Borrar todo el borrador guardado en este navegador?")) return;
    setCv(EMPTY_CV);
    setIsDemo(false);
    history.current = [];
    window.localStorage.removeItem(CV_STORAGE_KEY);
    setNotice(isEn ? "Local draft removed. No files were deleted from your computer." : "Borrador local eliminado. No se eliminó ningún archivo de tu computador.");
    setActiveStep("job");
  };
  const importCv = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      updateCv(normaliseCv(JSON.parse(await file.text())));
      setIsDemo(false);
      setNotice(isEn ? `Profile imported: ${file.name}. Saved locally in this browser.` : `Perfil importado: ${file.name}. Se guardó una copia local en este navegador.`);
    } catch {
      setNotice(isEn ? "Could not read file. Please select a valid .cvb or .json file." : "No fue posible leer el archivo. Selecciona un .cvb o .json válido.");
    }
    event.target.value = "";
  };
  const exportProject = () => {
    if (isDemo && !window.confirm(isEn ? "This project contains fictional demonstration data. Download anyway as an example?" : "Este proyecto contiene datos ficticios de demostración. ¿Deseas descargarlo igualmente como ejemplo?")) return;
    downloadText(`${safeFilename(cv.projectName)}.cvb`, JSON.stringify(toPortableCvb(cv), null, 2), "application/json;charset=utf-8");
    setNotice(isEn ? "Project downloaded. Keep it safe to restore in another browser." : "Proyecto descargado. Guárdalo para abrirlo en otro navegador o en la app de escritorio.");
  };
  const guardExport = (action) => {
    if (isDemo && !window.confirm(isEn ? "You are viewing a demonstration CV with fictional info. Download this sample?" : "Estás viendo un CV de demostración con información ficticia. ¿Deseas descargar este ejemplo?")) {
      setNotice(isEn ? "Export canceled. Use the sample as a template or start from scratch." : "Exportación cancelada. Usa el ejemplo como plantilla o crea un CV desde cero.");
      return;
    }
    const errors = validateCvForExport(cv);
    setExportErrors(errors);
    if (errors.length) {
      setActiveStep("export");
      setNotice(isEn ? "Please fill in all required fields before exporting." : "Corrige los campos obligatorios antes de exportar.");
      return;
    }
    action();
  };
  const exportPdf = () => guardExport(() => {
    createCvPdf(cv).save(`${safeFilename(cv.projectName)}.pdf`);
    trackLocalEvent("pdf_exported");
    trackCvDownload("pdf", isEn ? "en" : "es");
  });
  const exportLatex = () => guardExport(() => {
    downloadText(`${safeFilename(cv.projectName)}.tex`, createLatex(cv));
    trackLocalEvent("latex_exported");
    trackCvDownload("latex", isEn ? "en" : "es");
  });
  const exportDocx = () => guardExport(async () => {
    downloadBlob(`${safeFilename(cv.projectName)}.docx`, await createCvDocxBlob(cv));
    trackLocalEvent("docx_exported");
    trackCvDownload("docx", isEn ? "en" : "es");
  });
  const importResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setNotice(isEn ? `Analyzing ${file.name} locally…` : `Analizando ${file.name} localmente…`);
      setImportReview(await importResumeFile(file));
      setNotice(isEn ? "Review detected information before applying." : "Revisa los datos detectados antes de incorporarlos.");
    } catch {
      setNotice(isEn ? "Could not extract text. Ensure it is a text-based PDF or valid DOCX." : "No fue posible extraer texto del archivo. Comprueba que sea un PDF con texto o un DOCX válido.");
    }
    event.target.value = "";
  };
  const applyImportedResume = () => {
    updateCv((current) => normaliseCv({
      ...current,
      personal: { ...current.personal, ...Object.fromEntries(Object.entries(importReview.personal).filter(([, value]) => value)) },
      summary: importReview.summary || current.summary,
      skills: importReview.skills.length ? importReview.skills : current.skills,
    }));
    setImportReview(null);
    setIsDemo(false);
    trackLocalEvent("cv_started");
    setActiveStep("personal");
    setNotice(isEn ? "Data imported. Review each section before exporting." : "Datos importados. Revisa cada sección antes de exportar.");
  };

  const openOnboarding = (intent) => setOnboarding({ intent, title: cv.targetJob?.title || "", experienceLevel: "mid", country: isEn ? "United States" : "Chile" });

  const loadExampleCv = () => {
    updateCv(normaliseCv(EXAMPLE_CV));
    setIsDemo(true);
    setActiveStep("job");
    setNotice(isEn ? "Sample CV loaded. Inspect data or use as a reference before creating yours." : "CV ficticio cargado. Explora sus datos o úsalo como referencia antes de crear el tuyo.");
    window.scrollTo({ top: document.querySelector(".cv-ats-workspace")?.offsetTop || 0, behavior: "smooth" });
  };

  const completeOnboarding = () => {
    const profile = { title: onboarding.title.trim(), experienceLevel: onboarding.experienceLevel, country: onboarding.country };
    window.localStorage.setItem(ONBOARDING_KEY, JSON.stringify(profile));
    if (onboarding.intent === "template") {
      updateCv(normaliseCv({ ...EXAMPLE_CV, locale: { country: profile.country, language: isEn ? "en" : "es" }, pageFormat: profile.country === "Estados Unidos" || profile.country === "United States" ? "letter" : "a4", targetJob: { ...EXAMPLE_CV.targetJob, title: profile.title || EXAMPLE_CV.targetJob.title } }));
      setActiveStep("personal");
      setNotice(isEn ? "Template activated. Replace all fictional data with your real experience." : "Plantilla activada. Reemplaza todos los datos ficticios por tu información real.");
    } else {
      updateCv(normaliseCv({ ...EMPTY_CV, locale: { country: profile.country, language: isEn ? "en" : "es" }, pageFormat: profile.country === "Estados Unidos" || profile.country === "United States" ? "letter" : "a4", targetJob: { ...EMPTY_CV.targetJob, title: profile.title } }));
      setActiveStep("job");
      setNotice(isEn ? "New CV started. Your progress is saved locally in this browser." : "Nuevo CV iniciado. Tus cambios se guardarán localmente en este navegador.");
    }
    setIsDemo(false);
    trackLocalEvent("cv_started");
    const shouldImport = onboarding.intent === "import";
    setOnboarding(null);
    if (shouldImport) window.setTimeout(() => resumeInput.current?.click(), 0);
  };

  const currentStageIndex = Math.max(0, stages.findIndex((stage) => stage.steps.includes(activeStep)));
  const currentStage = stages[currentStageIndex];
  const navigateStage = (direction) => {
    const nextIndex = Math.max(0, Math.min(stages.length - 1, currentStageIndex + direction));
    setActiveStep(stages[nextIndex].steps[0]);
  };

  const duplicateCv = () => {
    setWorkspace((current) => {
      const result = createDraftCopy(current, cv);
      updateCv(result.copy);
      return result.workspace;
    });
    setNotice(isEn ? "CV duplicated. Original is preserved under Versions." : "CV duplicado. El original quedó disponible en Versiones.");
  };

  const shareTool = async () => {
    const shareData = {
      title: isEn ? "Free ATS Resume Builder" : "Creador de CV ATS gratis",
      text: isEn ? "Build, optimize and download ATS-compliant resumes directly in your browser." : "Crea, adapta y descarga un CV compatible con ATS directamente en tu navegador.",
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setNotice(isEn ? "Link copied to clipboard. You can now share this tool." : "Enlace copiado. Ya puedes compartir la herramienta.");
      }
      trackLocalEvent("tool_shared");
    } catch (error) {
      if (error?.name !== "AbortError") setNotice(isEn ? "Automatic sharing failed. Please copy the URL from your browser address bar." : "No fue posible compartir automáticamente. Copia la URL del navegador.");
    }
  };

  const chooseAnalytics = (value) => {
    setAnalyticsConsent(value);
    setAnalyticsConsentState(value);
    if (value === "accepted") trackLocalEvent("consent_accepted");
  };

  const deleteAllLocalData = () => {
    if (!window.confirm(isEn ? "Delete all resumes, copies, applications, cover letters, preferences and metrics stored in this browser? This action cannot be undone." : "¿Eliminar todos los CV, copias, postulaciones, cartas, preferencias y métricas guardadas en este navegador? Esta acción no se puede deshacer.")) return;
    [CV_STORAGE_KEY, CV_WORKSPACE_KEY, CV_MODE_KEY, ONBOARDING_KEY, "atelijudesign.cv-ats-command-center.v1", "atelijudesign.cv-ats-mode.v1", "atelijudesign.cv-ats-workspace.v1", "atelijudesign.cv-ats-onboarding.v1", "atelijudesign.cv-ats-analytics.v1", "atelijudesign.cv-ats-analytics-consent.v1"].forEach((key) => window.localStorage.removeItem(key));
    clearLocalAnalytics();
    setCv(normaliseCv(EMPTY_CV));
    setWorkspace(EMPTY_WORKSPACE);
    setIsDemo(false);
    setAnalyticsConsentState("unknown");
    history.current = [];
    setActiveStep("job");
    setNotice(isEn ? "All local data for this tool has been wiped." : "Todos los datos locales de la herramienta fueron eliminados.");
  };

  useEffect(() => {
    const handleShortcut = (event) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      if (event.key.toLowerCase() === "s") { event.preventDefault(); exportProject(); }
      if (event.key.toLowerCase() === "z" && !event.shiftKey) { event.preventDefault(); undo(); }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });

  const renderEditor = () => {
    if (activeStep === "personal") return (
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-white">{isEn ? "Professional Profile" : "Perfil profesional"}</h1>
          <p className="mt-1 text-sm text-slate-400">{isEn ? "Essential contact information for an ATS resume; photographs are excluded." : "Información de contacto esencial para un CV ATS; no se admiten fotografías."}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={isEn ? "Full Name" : "Nombre"} value={cv.personal.name} onChange={(value) => updatePersonal("name", value)} placeholder={isEn ? "Full Name" : "Nombre completo"} />
          <Field label={isEn ? "Target Role / Title" : "Cargo / título"} value={cv.personal.title} onChange={(value) => updatePersonal("title", value)} placeholder={isEn ? "Senior Structural Designer" : "Diseñador Estructural Senior"} />
          <Field label="Email" type="email" value={cv.personal.email} onChange={(value) => updatePersonal("email", value)} placeholder="name@email.com" />
          <Field label={isEn ? "Phone" : "Teléfono"} value={cv.personal.phone} onChange={(value) => updatePersonal("phone", value)} placeholder="+1 (555) …" />
          <Field label={isEn ? "Location" : "Ubicación"} value={cv.personal.location} onChange={(value) => updatePersonal("location", value)} placeholder={isEn ? "City, Country" : "Santiago, Chile"} />
          <Field label="LinkedIn" value={cv.personal.linkedin} onChange={(value) => updatePersonal("linkedin", value)} placeholder="linkedin.com/in/…" />
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{isEn ? "Results-Oriented Professional Summary" : "Resumen orientado a resultados"}</span>
          <textarea value={cv.summary} onChange={(event) => updateCv((current) => ({ ...current, summary: event.target.value }))} rows="7" placeholder={isEn ? "Describe your specialization, relevant track record, and measurable achievements." : "Describe especialidad, experiencia relevante y resultados medibles."} className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
        </label>
        <ProfileExtrasEditor isEn={isEn} cv={cv} updateItem={updateCollectionItem} addItem={addCollectionItem} duplicateItem={duplicateCollectionItem} removeItem={removeCollectionItem} moveItem={moveItem} />
      </section>
    );
    if (activeStep === "job") return (
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-white">{isEn ? "Analyze Job Opening" : "Analiza la oferta de trabajo"}</h1>
          <p className="mt-1 text-sm text-slate-400">{isEn ? "Text is analyzed entirely in your browser; never transmitted to any external server." : "El texto se analiza solo en tu navegador; no se envía a ningún servicio."}</p>
        </div>
        <Field label={isEn ? "Target Job Title" : "Cargo objetivo"} value={cv.targetJob.title} onChange={(value) => updateJob("title", value)} placeholder={isEn ? "Senior Structural Designer" : "Diseñador Estructural Senior"} />
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{isEn ? "Job Description" : "Descripción de la oferta"}</span>
          <textarea value={cv.targetJob.description} onChange={(event) => updateJob("description", event.target.value)} rows="12" placeholder={isEn ? "Paste requirements, core responsibilities, and desired technical skills here…" : "Pega aquí los requisitos, responsabilidades y tecnologías solicitadas…"} className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm leading-relaxed text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
        </label>
        <KeywordBlock title={isEn ? "Identified Keywords" : "Palabras clave identificadas"} terms={analysis.keywords} empty={isEn ? "Paste a job description to identify technical keywords." : "Pega una oferta para identificar sus términos técnicos."} tone="cyan" />
      </section>
    );
    if (activeStep === "experience") return (
      <section className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{isEn ? "Professional Experience" : "Experiencia profesional"}</h1>
            <p className="mt-1 text-sm text-slate-400">{isEn ? "One verifiable achievement per bullet point enhances recruiter readability and ATS parsing." : "Un logro verificable por línea mejora la lectura del reclutador y del ATS."}</p>
          </div>
          <button onClick={() => updateCv((current) => ({ ...current, experience: [...current.experience, emptyExperience()] }))} className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/20">
            {isEn ? "+ Add Experience" : "+ Añadir experiencia"}
          </button>
        </div>
        {!cv.experience.length && <EmptyState text={isEn ? "No experience added yet. Add positions relevant to the job opening." : "Aún no has añadido experiencia. Agrega cada cargo relevante para la vacante."} />}
        {cv.experience.map((entry, index) => (
          <article key={`experience-${index}`} className="space-y-4 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <h2 className="font-semibold text-slate-200">{isEn ? `Experience ${index + 1}` : `Experiencia ${index + 1}`}</h2>
              <div className="cv-ats-card-actions">
                <button disabled={index === 0} onClick={() => moveItem("experience", index, -1)} aria-label={isEn ? "Move experience up" : "Mover experiencia hacia arriba"}>↑</button>
                <button disabled={index === cv.experience.length - 1} onClick={() => moveItem("experience", index, 1)} aria-label={isEn ? "Move experience down" : "Mover experiencia hacia abajo"}>↓</button>
                <button onClick={() => duplicateExperience(index)}>{isEn ? "Duplicate" : "Duplicar"}</button>
                <button onClick={() => removeExperience(index)} className="is-danger">{isEn ? "Delete" : "Eliminar"}</button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={isEn ? "Role / Position" : "Cargo"} value={entry.position || ""} onChange={(value) => updateExperience(index, "position", value)} />
              <Field label={isEn ? "Company" : "Empresa"} value={entry.company || ""} onChange={(value) => updateExperience(index, "company", value)} />
              <DateField label={isEn ? "Start Date" : "Inicio"} value={entry.start_date || ""} onChange={(value) => updateExperience(index, "start_date", value)} />
              <DateField label={isEn ? "End Date" : "Fin"} value={entry.end_date || ""} disabled={entry.current === true} onChange={(value) => updateExperience(index, "end_date", value)} />
            </div>
            <label className="cv-ats-current">
              <input type="checkbox" checked={entry.current === true} onChange={(event) => updateCv((current) => ({ ...current, experience: current.experience.map((item, itemIndex) => itemIndex === index ? { ...item, current: event.target.checked, end_date: event.target.checked ? (isEn ? "Present" : "Actualidad") : "" } : item) }))} />
              {isEn ? " Currently working here" : " Actualmente trabajo aquí"}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{isEn ? "Achievements and Responsibilities" : "Logros y responsabilidades"}</span>
              <textarea value={entry.description || ""} onChange={(event) => updateExperience(index, "description", event.target.value)} rows="5" placeholder={isEn ? "• Coordinated…&#10;• Reduced…" : "• Coordiné…&#10;• Reduje…"} className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
            </label>
          </article>
        ))}
      </section>
    );
    if (activeStep === "skills") return (
      <SkillsManager
        isEn={isEn}
        cv={cv}
        updateCv={updateCv}
        analysis={analysis}
        setNotice={setNotice}
      />
    );
    if (activeStep === "assistant") return <AssistantPanel isEn={isEn} cv={cv} insights={assistant} updateCv={updateCv} setNotice={setNotice} />;
    if (activeStep === "review") return (
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-white">{isEn ? "ATS Review & Scoring" : "Revisión ATS"}</h1>
          <p className="mt-1 text-sm text-slate-400">{isEn ? "An editorial guide: incorporate only terms that represent authentic experience." : "Una guía de redacción: incorpora solo términos que representen experiencia real."}</p>
        </div>
        <AtsScore isEn={isEn} analysis={analysis} />
        <AtsCategories isEn={isEn} categories={analysis.categories} />
        <AtsRecommendations isEn={isEn} recommendations={analysis.recommendations} />
        <AtsEvidenceMap isEn={isEn} evidence={analysis.evidence} />
        <AtsQualityAudit isEn={isEn} unsupportedSkills={analysis.unsupportedSkills} issues={analysis.qualityIssues} />
        {analysis.keywords.length ? (
          <>
            <KeywordBlock title={isEn ? "Terms Found in Your CV" : "Términos presentes en tu CV"} terms={analysis.matched} empty={isEn ? "No matches detected yet." : "Aún no se detectan coincidencias."} tone="emerald" />
            <KeywordBlock title={isEn ? "Terms to Review" : "Términos por revisar"} terms={analysis.missing} empty={isEn ? "No pending terms in the analyzed set." : "No hay términos pendientes en el conjunto analizado."} tone="amber" />
          </>
        ) : (
          <EmptyState text={isEn ? "Paste the job description to activate keyword comparison." : "Pega la descripción de la vacante para activar la comparación de palabras clave."} />
        )}
      </section>
    );
    if (activeStep === "applications") return progress.completed < 3 && !workspace.applications.length ? (
      <ApplicationsLocked isEn={isEn} onContinue={() => setActiveStep("personal")} />
    ) : (
      <>
        <ApplicationsWorkspaceClean isEn={isEn} cv={cv} workspace={workspace} setWorkspace={setWorkspace} updateCv={updateCv} activeApplicationId={activeApplicationId} setActiveApplicationId={setActiveApplicationId} setNotice={setNotice} />
        <ApplicationFollowUp isEn={isEn} cv={cv} workspace={workspace} setWorkspace={setWorkspace} setNotice={setNotice} />
      </>
    );
    return (
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-white">{isEn ? "Export & Preserve Your Project" : "Exporta y conserva tu proyecto"}</h1>
          <p className="mt-1 text-sm text-slate-400">{isEn ? "Your data remains in this browser until you download or erase it." : "Tus datos quedan en este navegador hasta que los descargues o borres."}</p>
        </div>
        {exportErrors.length > 0 && <ExportValidation isEn={isEn} errors={exportErrors} onNavigate={setActiveStep} />}
        <ExportSettings isEn={isEn} cv={cv} updateCv={updateCv} />
        <div className="grid gap-3 sm:grid-cols-2">
          <ActionButton title={isEn ? "Download PDF" : "Descargar PDF"} detail={isEn ? "Final document with chosen formatting." : "Documento final con el diseño seleccionado."} onClick={exportPdf} />
          <ActionButton title={isEn ? "Download DOCX" : "Descargar DOCX"} detail={isEn ? "Editable Word file with ATS-compliant sections." : "Documento editable con secciones compatibles con ATS."} onClick={exportDocx} />
          <ActionButton title={isEn ? "Import Existing Resume" : "Importar CV existente"} detail={isEn ? "Extract text from PDF or DOCX to review." : "Extrae texto desde PDF o DOCX para revisarlo."} onClick={() => resumeInput.current?.click()} />
          <ActionButton title={isEn ? "Save Project (.cvb)" : "Guardar proyecto"} detail={isEn ? "Portable .cvb file to resume anytime." : "Archivo .cvb para continuar después."} onClick={exportProject} />
          <ActionButton title={isEn ? "Import Project (.cvb)" : "Importar proyecto"} detail={isEn ? "Compatible with desktop .cvb files." : "Compatible con archivos .cvb de escritorio."} onClick={() => fileInput.current?.click()} />
        </div>
        <details className="cv-ats-advanced-export">
          <summary>{isEn ? "Advanced Options" : "Opciones avanzadas"}</summary>
          <p>{isEn ? "LaTeX is aimed at technical users wishing to edit the exact source markup." : "LaTeX está dirigido a usuarios técnicos que desean editar el código fuente."}</p>
          <button onClick={exportLatex}>{isEn ? "Download LaTeX Code" : "Descargar código LaTeX"}</button>
        </details>
        <PlainTextPreview isEn={isEn} text={createPlainTextCv(cv)} />
        <button onClick={resetLocal} className="text-sm font-semibold text-rose-300 hover:text-rose-200">
          {isEn ? "Clear only this browser's local draft" : "Borrar solo el borrador de este navegador"}
        </button>
      </section>
    );
  };

  return (
    <div className="cv-ats-page min-h-screen bg-[#07111d] pt-24 text-slate-100">
      <SEOHead
        title={isEn ? "Free ATS Resume Builder | Tailor and Download Your CV" : "Creador de CV ATS gratis | Adapta y descarga tu CV"}
        description={isEn ? "Build an ATS-compliant resume, compare against job descriptions, and export to PDF or DOCX. Works 100% locally in your browser." : "Crea un CV compatible con ATS, compáralo con una oferta y descárgalo en PDF o DOCX. Funciona localmente en tu navegador."}
        path="/herramientas/cv-ats"
      />
      <div className="mx-auto max-w-[1640px] px-4 pb-14 sm:px-6">
        <div className="cv-ats-hero">
          <div>
            <p>{isEn ? "Free tool · 100% local privacy" : "Herramienta gratuita · privacidad local"}</p>
            <h1>{isEn ? <>Build your <span>ATS Resume</span> in minutes</> : <>Crea tu <span>CV ATS</span> en minutos</>}</h1>
            <p className="cv-ats-hero-copy">
              {isEn
                ? "Tailor your resume to any job opening, detect keywords, strengthen achievements, and export a clean document without sending personal data."
                : "Adapta tu CV a una oferta, encuentra palabras clave, mejora tus logros y descarga un documento profesional sin subir datos personales."}
            </p>
            <div className="cv-ats-hero-actions">
              <button onClick={() => openOnboarding("blank")}>{isEn ? "Build my free ATS Resume" : "Crear mi CV ATS gratis"}</button>
              <button onClick={loadExampleCv}>{isEn ? "Load sample Resume" : "Cargar CV de ejemplo"}</button>
              <button onClick={shareTool}>{isEn ? "Share tool" : "Compartir herramienta"}</button>
            </div>
          </div>
          <div className="cv-ats-notice" aria-live="polite">{notice}</div>
        </div>

        {isDemo && (
          <section className="cv-ats-demo-banner" aria-label={isEn ? "Demo Resume" : "CV de demostración"}>
            <div>
              <span>{isEn ? "Interactive Example" : "Ejemplo interactivo"}</span>
              <h2>{isEn ? "See a complete resume before creating yours" : "Mira un CV completo antes de crear el tuyo"}</h2>
              <p>{isEn ? "All data for Valentina Rojas is fictional. You can explore safely without losing any work." : "Todos los datos de Valentina Rojas son ficticios. Puedes explorar el resultado sin riesgo."}</p>
            </div>
            <div className="cv-ats-demo-actions">
              <button onClick={() => openOnboarding("blank")}>{isEn ? "Start from scratch" : "Empezar desde cero"}</button>
              <button onClick={() => openOnboarding("template")} className="is-primary">{isEn ? "Use this template" : "Usar este ejemplo"}</button>
              <button onClick={() => openOnboarding("import")}>{isEn ? "Improve my current resume" : "Mejorar mi CV actual"}</button>
            </div>
          </section>
        )}

        <section className="cv-ats-benefits" aria-label={isEn ? "Key benefits" : "Beneficios principales"}>
          <article>
            <strong>1</strong>
            <div>
              <h2>{isEn ? "Paste the Job Post" : "Pega la oferta"}</h2>
              <p>{isEn ? "Identify requirements and keywords." : "Identifica requisitos y palabras clave."}</p>
            </div>
          </article>
          <article>
            <strong>2</strong>
            <div>
              <h2>{isEn ? "Refine Content" : "Mejora el contenido"}</h2>
              <p>{isEn ? "Turn tasks into verifiable accomplishments." : "Convierte tareas en logros verificables."}</p>
            </div>
          </article>
          <article>
            <strong>3</strong>
            <div>
              <h2>{isEn ? "Download & Apply" : "Descarga y postula"}</h2>
              <p>{isEn ? "Export in PDF or DOCX format." : "Exporta en PDF o DOCX."}</p>
            </div>
          </article>
        </section>

        <details className="cv-ats-ats-explainer">
          <summary>{isEn ? "What is an ATS and why does it affect your application?" : "¿Qué es un ATS y por qué puede afectar tu postulación?"}</summary>
          <p>
            {isEn
              ? "An ATS (Applicant Tracking System) organizes and filters job applications. Clear structure, standard headings, and relevant job keywords ensure automatic readability. This tool assists your preparation but does not replace human recruiter review."
              : "Un ATS es un sistema que organiza y filtra postulaciones. Una estructura clara, datos reconocibles y palabras relacionadas con la oferta facilitan la lectura automática. Esta herramienta ayuda a preparar el CV, pero no garantiza una entrevista ni reemplaza la revisión humana."}
          </p>
        </details>

        {onboarding && <OnboardingPanel isEn={isEn} value={onboarding} onChange={setOnboarding} onCancel={() => setOnboarding(null)} onComplete={completeOnboarding} />}

        <ProgressPanel isEn={isEn} progress={progress} />

        <div className="cv-ats-project-bar">
          <label>
            <span>{isEn ? "Resume Name" : "Nombre del CV"}</span>
            <input value={cv.projectName || ""} onChange={(event) => updateCv((current) => ({ ...current, projectName: event.target.value }))} placeholder={isEn ? "My ATS Resume" : "Mi CV ATS"} aria-label={isEn ? "Resume Name" : "Nombre del CV"} />
          </label>
          <p aria-live="polite">
            {lastSavedAt
              ? (isEn
                  ? `Saved automatically at ${lastSavedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
                  : `Guardado automáticamente a las ${lastSavedAt.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`)
              : (isEn ? "Preparing local save…" : "Preparando guardado local…")}
          </p>
          <button onClick={duplicateCv}>{isEn ? "Duplicate CV" : "Duplicar CV"}</button>
        </div>

        <div className="cv-ats-quick-actions">
          <span className="cv-ats-project-label">{isEn ? "Actions" : "Acciones"}</span>
          <div className="cv-ats-action-buttons">
            <button title={isEn ? "Undo last change" : "Deshacer el último cambio"} onClick={undo} disabled={!history.current.length} className="cv-ats-action-button cv-ats-action-secondary">{isEn ? "Undo" : "Deshacer"}</button>
            <button title={isEn ? "Import a PDF or DOCX resume" : "Importar un CV PDF o DOCX"} onClick={() => resumeInput.current?.click()} className="cv-ats-action-button cv-ats-action-secondary">{isEn ? "Import CV" : "Importar CV"}</button>
            <button title={isEn ? "Import a CVB or JSON project" : "Importar un proyecto CVB o JSON"} onClick={() => fileInput.current?.click()} className="cv-ats-action-button cv-ats-action-secondary">{isEn ? "Import project" : "Importar proyecto"}</button>
            <button title={isEn ? "Save project file for later" : "Guardar el proyecto para abrirlo después"} onClick={exportProject} className="cv-ats-action-button cv-ats-action-secondary">{isEn ? "Save" : "Guardar"}</button>
            <button title={isEn ? "Export CV as PDF" : "Exportar el CV como PDF"} onClick={exportPdf} className="cv-ats-action-button cv-ats-action-primary">PDF</button>
            <button title={isEn ? "Export CV as DOCX" : "Exportar el CV como DOCX"} onClick={exportDocx} className="cv-ats-action-button cv-ats-action-secondary">DOCX</button>
            <button title={isEn ? "Export LaTeX source code" : "Exportar el código fuente LaTeX"} onClick={exportLatex} className="cv-ats-action-button cv-ats-action-secondary">LaTeX</button>
            <label className="cv-ats-template">
              {isEn ? "Template" : "Plantilla"}
              <select value={cv.template} onChange={(event) => updateCv((current) => ({ ...current, template: event.target.value }))}>
                <option value="ats">{isEn ? "ATS · single column" : "ATS · una columna"}</option>
                <option value="executive">{isEn ? "Executive · dark header" : "Executive · header oscuro"}</option>
                <option value="minimal">{isEn ? "Minimal · clean" : "Minimal · limpio"}</option>
                <option value="technical">{isEn ? "Technical · sidebar" : "Technical · sidebar"}</option>
                <option value="latex">{isEn ? "LaTeX · source" : "LaTeX · fuente"}</option>
              </select>
            </label>
            <label className="cv-ats-page-format">
              {isEn ? "Paper" : "Hoja"}
              <select value={cv.pageFormat} onChange={(event) => updateCv((current) => ({ ...current, pageFormat: event.target.value }))}>
                <option value="a4">A4</option>
                <option value="letter">US Letter</option>
              </select>
            </label>
          </div>
        </div>

        {workspace.drafts?.length > 0 && (
          <div className="cv-ats-saved-copies">
            <span>{isEn ? "Saved copies" : "Copias locales"}</span>
            <select defaultValue="" aria-label={isEn ? "Open a saved copy" : "Abrir una copia guardada"} onChange={(event) => { const draft = workspace.drafts.find((item) => item.id === event.target.value); if (draft) { updateCv(draft.cv); setNotice(isEn ? `Copy opened: ${draft.name}.` : `Copia abierta: ${draft.name}.`); } event.target.value = ""; }}>
              <option value="">{isEn ? "Select a copy…" : "Selecciona una copia…"}</option>
              {workspace.drafts.map((draft) => <option key={draft.id} value={draft.id}>{draft.name}</option>)}
            </select>
          </div>
        )}

        <input ref={fileInput} onChange={importCv} type="file" accept=".cvb,.json,application/json" className="hidden" />
        <input ref={resumeInput} onChange={importResume} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" />
        {importReview && <ImportReview isEn={isEn} draft={importReview} onChange={setImportReview} onCancel={() => setImportReview(null)} onApply={applyImportedResume} />}

        <div className="cv-ats-workspace overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-2xl shadow-black/30">
          <header className="cv-ats-top-nav" aria-label={isEn ? "Resume stages" : "Etapas del CV"}>
            <div className="cv-ats-stages-nav" role="tablist">
              {stages.map((stage, index) => {
                const isActive = stage.key === currentStage.key;
                const isComplete = index < currentStageIndex;
                return (
                  <button
                    key={stage.key}
                    type="button"
                    onClick={() => setActiveStep(stage.steps[0])}
                    className={`cv-ats-stage-pill ${isActive ? "is-active" : ""}`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span className={`cv-ats-stage-badge ${isComplete ? "is-complete" : ""} ${isActive ? "is-active" : ""}`}>
                      {isComplete ? "✓" : stage.number}
                    </span>
                    <span className="cv-ats-stage-text">{stage.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="cv-ats-top-actions">
              <button
                type="button"
                onClick={loadExampleCv}
                className="cv-ats-load-example-btn"
                title={isEn ? "Load sample CV data" : "Cargar datos de ejemplo de CV"}
              >
                <svg className="h-4 w-4 shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>{isEn ? "Load sample Resume" : "Cargar CV de ejemplo"}</span>
              </button>

              <div
                className="cv-ats-privacy-pill"
                title={isEn ? "Job posts and resumes are processed locally. No photos, tracking cookies, or automated file uploads." : "La oferta y el CV se analizan localmente. No hay fotos ni subida automática de archivos."}
              >
                <span className="cv-ats-privacy-dot" />
                <span className="cv-ats-privacy-label">{isEn ? "Privacy:" : "Privacidad:"}</span>
                <span className="cv-ats-privacy-note">
                  {isEn ? "100% Local processing" : "100% local, sin subida de archivos"}
                </span>
              </div>
            </div>
          </header>

          <div className="cv-ats-layout">
            <main className="cv-ats-editor min-w-0 p-5 sm:p-7">
              <div className="cv-ats-substeps" aria-label={isEn ? `Sections of ${currentStage.label}` : `Secciones de ${currentStage.label}`}>
                {currentStage.steps.map((step) => {
                  const config = steps.find(([key]) => key === step);
                  return <button key={step} onClick={() => setActiveStep(step)} className={activeStep === step ? "is-active" : ""}>{config ? config[2] : step}</button>;
                })}
              </div>
              {renderEditor()}
              <div className="mt-8 flex items-center justify-between border-t border-slate-700 pt-5">
                <button onClick={() => navigateStage(-1)} disabled={currentStageIndex === 0} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-40">
                  {isEn ? "← Previous stage" : "← Etapa anterior"}
                </button>
                <button onClick={() => navigateStage(1)} disabled={currentStageIndex === stages.length - 1} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40">
                  {isEn ? "Next stage →" : "Siguiente etapa →"}
                </button>
              </div>
            </main>
            <aside className="cv-ats-preview bg-slate-950/40 p-5 sm:p-7">
              <CvPreview isEn={isEn} cv={cv} isDemo={isDemo} />
            </aside>
          </div>
        </div>
        {analyticsConsent === "unknown" && <AnalyticsConsent isEn={isEn} onChoose={chooseAnalytics} />}
        <TrustCenter isEn={isEn} consent={analyticsConsent} analytics={readLocalAnalytics()} onConsentChange={chooseAnalytics} onDeleteAll={deleteAllLocalData} />
      </div>
    </div>
  );
}

const PRESET_SKILL_CATEGORIES = [
  {
    id: "bim",
    labelEs: "Modelado BIM & Plantas 3D",
    labelEn: "BIM & 3D Plants",
    icon: "🏭",
    skills: [
      { name: "SmartPlant 3D", isStar: true },
      { name: "Revit Structures" },
      { name: "Tekla Structures" },
      { name: "Advance Steel" },
      { name: "AutoCAD" },
      { name: "Navisworks Manage" },
      { name: "ReCap" },
      { name: "Autodesk Construction Cloud (ACC)" },
      { name: "Tekla Model Sharing" },
      { name: "Metodología BIM (ISO 19650)" },
    ],
  },
  {
    id: "structures",
    labelEs: "Ingeniería Estructural & Detalle",
    labelEn: "Structural & Detailing",
    icon: "🏗️",
    skills: [
      { name: "Conexiones de Acero (AISC/NCh)" },
      { name: "Hormigón Armado y Enfierraduras (Rebar)" },
      { name: "Planos de Fabricación y Montaje" },
      { name: "Cuantificación de Materiales (BOM)" },
      { name: "Bancos de Ductos y Obras Civiles" },
      { name: "Normalización Puentes Grúa" },
      { name: "Aisladores Sísmicos" },
      { name: "Refuerzo de Vigas y Estructuras Existentes" },
    ],
  },
  {
    id: "automation",
    labelEs: "Automatización & Software",
    labelEn: "Automation & Code",
    icon: "⚡",
    skills: [
      { name: "Python & pyRevit" },
      { name: "Dynamo" },
      { name: "Revit API" },
      { name: "AutoLISP" },
      { name: "Microsoft Excel Avanzado" },
      { name: "Git & Control de Versiones" },
      { name: "SQL" },
      { name: "HTML5 & CSS3" },
    ],
  },
  {
    id: "standards",
    labelEs: "Normas & Códigos Técnicos",
    labelEn: "Codes & Standards",
    icon: "📐",
    skills: [
      { name: "AISC 360" },
      { name: "ACI 318" },
      { name: "NCh433 (Diseño Sísmico)" },
      { name: "NCh2369 (Sísmico Industrial)" },
      { name: "CMAA-70 (Puentes Grúa)" },
      { name: "Normas Codelco" },
    ],
  },
];

function SkillsManager({ isEn, cv, updateCv, analysis, setNotice }) {
  const [editorMode, setEditorMode] = useState("interactive");
  const [quickInput, setQuickInput] = useState("");
  const [quickLevel, setQuickLevel] = useState(4);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");

  const currentSkills = useMemo(() => {
    return (cv.skills || [])
      .map((item) => {
        if (typeof item === "string") return { name: item, level: 4, category: "" };
        return { name: item.name || "", level: item.level || 4, category: item.category || "" };
      })
      .filter((item) => Boolean(item.name.trim()));
  }, [cv.skills]);

  const hasSkill = useCallback(
    (skillName) => {
      const target = normaliseText(skillName);
      return currentSkills.some((s) => normaliseText(s.name) === target);
    },
    [currentSkills]
  );

  const addSkill = useCallback(
    (skillName, level = 4, category = "") => {
      const trimmed = skillName.trim();
      if (!trimmed) return;
      if (hasSkill(trimmed)) {
        setNotice(isEn ? `"${trimmed}" is already in your skills.` : `"${trimmed}" ya está en tus habilidades.`);
        return;
      }
      updateCv((current) => ({
        ...current,
        skills: [...(current.skills || []), { name: trimmed, level, category }],
      }));
      setNotice(isEn ? `Added "${trimmed}".` : `"${trimmed}" agregada.`);
      setQuickInput("");
    },
    [hasSkill, isEn, setNotice, updateCv]
  );

  const removeSkill = useCallback(
    (skillName) => {
      const target = normaliseText(skillName);
      updateCv((current) => ({
        ...current,
        skills: (current.skills || []).filter((s) => normaliseText(typeof s === "string" ? s : s.name) !== target),
      }));
      setNotice(isEn ? `Removed "${skillName}".` : `"${skillName}" eliminada.`);
    },
    [isEn, setNotice, updateCv]
  );

  const toggleSkill = useCallback(
    (skillName, category = "") => {
      if (hasSkill(skillName)) {
        removeSkill(skillName);
        return;
      }
      addSkill(skillName, 4, category);
    },
    [hasSkill, removeSkill, addSkill]
  );

  const updateSkillLevel = useCallback(
    (skillIndex, newLevel) => {
      updateCv((current) => ({
        ...current,
        skills: (current.skills || []).map((s, idx) => {
          if (idx !== skillIndex) return s;
          const base = typeof s === "string" ? { name: s, category: "" } : s;
          return { ...base, level: newLevel };
        }),
      }));
    },
    [updateCv]
  );

  const sortAlphabetical = useCallback(() => {
    updateCv((current) => ({
      ...current,
      skills: [...(current.skills || [])].sort((a, b) => {
        const nameA = (typeof a === "string" ? a : a.name || "").toLocaleLowerCase("es-CL");
        const nameB = (typeof b === "string" ? b : b.name || "").toLocaleLowerCase("es-CL");
        return nameA.localeCompare(nameB, "es-CL");
      }),
    }));
    setNotice(isEn ? "Skills sorted A-Z." : "Habilidades ordenadas de la A a la Z.");
  }, [isEn, setNotice, updateCv]);

  const clearAll = useCallback(() => {
    if (!window.confirm(isEn ? "Remove all skills from your resume?" : "¿Eliminar todas las habilidades de tu CV?")) return;
    updateCv((current) => ({ ...current, skills: [] }));
    setNotice(isEn ? "All skills removed." : "Todas las habilidades fueron eliminadas.");
  }, [isEn, setNotice, updateCv]);

  const vacancySuggestions = useMemo(() => {
    const list = analysis?.keywords || [];
    return list.filter((keyword) => !hasSkill(keyword)).slice(0, 8);
  }, [analysis?.keywords, hasSkill]);

  const filteredCurrentSkills = useMemo(() => {
    if (!searchFilter.trim()) return currentSkills;
    const query = normaliseText(searchFilter);
    return currentSkills.filter((s) => normaliseText(s.name).includes(query));
  }, [currentSkills, searchFilter]);

  const displayedCatalogCategories = useMemo(() => {
    if (categoryFilter === "all") return PRESET_SKILL_CATEGORIES;
    return PRESET_SKILL_CATEGORIES.filter((cat) => cat.id === categoryFilter);
  }, [categoryFilter]);

  const handleQuickAdd = (event) => {
    event.preventDefault();
    if (!quickInput.trim()) return;
    addSkill(quickInput, quickLevel);
  };

  const handleBulkChange = (event) => {
    const lines = event.target.value.split("\n").map((line) => line.trim()).filter(Boolean);
    updateCv((current) => ({
      ...current,
      skills: lines.map((name) => ({ name, level: 4, category: "" })),
    }));
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{isEn ? "Skills & Technologies" : "Habilidades y Tecnologías"}</h1>
            <span className="rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-400/30">
              {currentSkills.length} {isEn ? "skills" : "habilidades"}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {isEn
              ? "Add tools, software, standards, and technical competencies. Tap preset badges to add or remove instantly."
              : "Añade software, normativas y competencias técnicas. Toca los botones del catálogo para agregar o quitar en 1 clic."}
          </p>
        </div>

        <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950/80 p-1">
          <button
            type="button"
            onClick={() => setEditorMode("interactive")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              editorMode === "interactive"
                ? "bg-cyan-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isEn ? "Interactive Chips" : "Modo Interactivo"}
          </button>
          <button
            type="button"
            onClick={() => setEditorMode("bulk")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              editorMode === "bulk"
                ? "bg-cyan-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isEn ? "Bulk Text" : "Texto en Bloque"}
          </button>
        </div>
      </div>

      {editorMode === "bulk" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{isEn ? "One skill per line:" : "Una habilidad por línea:"}</span>
            <button
              type="button"
              onClick={() => setEditorMode("interactive")}
              className="text-cyan-400 hover:underline"
            >
              {isEn ? "Switch to interactive chips →" : "Volver al modo interactivo →"}
            </button>
          </div>
          <textarea
            value={currentSkills.map((s) => s.name).join("\n")}
            onChange={handleBulkChange}
            rows={12}
            placeholder={"SmartPlant 3D\nRevit Structures\nTekla Structures\nAdvance Steel\nPython & pyRevit"}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 font-mono text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <form onSubmit={handleQuickAdd} className="rounded-xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-sm">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
              {isEn ? "Quick Add Skill / Technology" : "Agregar Habilidad o Tecnología"}
            </span>
            <div className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder={isEn ? "e.g. SmartPlant 3D, Tekla, Python..." : "Ej: SmartPlant 3D, Tekla, Python..."}
                className="flex-1 min-w-0 rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
              <select
                value={quickLevel}
                onChange={(e) => setQuickLevel(Number(e.target.value))}
                aria-label={isEn ? "Skill Level" : "Nivel de dominio"}
                className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-cyan-400"
              >
                <option value={5}>{isEn ? "★★★★★ Expert" : "★★★★★ Experto"}</option>
                <option value={4}>{isEn ? "★★★★☆ Advanced" : "★★★★☆ Avanzado"}</option>
                <option value={3}>{isEn ? "★★★☆☆ Intermediate" : "★★★☆☆ Intermedio"}</option>
                <option value={2}>{isEn ? "★★☆☆☆ Basic" : "★★☆☆☆ Básico"}</option>
              </select>
              <button
                type="submit"
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 shrink-0"
              >
                + {isEn ? "Add" : "Agregar"}
              </button>
            </div>
          </form>

          {vacancySuggestions.length > 0 && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2.5">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                {isEn ? "Detected in Job Opening (1-Click to add):" : "Detectadas en la Vacante (1-Clic para añadir):"}
              </div>
              <div className="flex flex-wrap gap-2">
                {vacancySuggestions.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => addSkill(term, 4)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-slate-900/80 px-3 py-1 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/20 hover:text-white"
                  >
                    <span className="text-cyan-400 font-bold group-hover:scale-125 transition-transform">+</span>
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{isEn ? "Technical Skills Catalog (1-Touch Add/Remove)" : "Catálogo Técnico de 1-Toque (Añadir / Quitar)"}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEn
                    ? "Green pills (✓) are already in your CV. Click any item to toggle."
                    : "Los botones en verde (✓) ya están en tu CV. Toca cualquiera para agregarlo o removerlo."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCategoryFilter("all")}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                    categoryFilter === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isEn ? "All" : "Todas"}
                </button>
                {PRESET_SKILL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                      categoryFilter === cat.id ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat.icon} {isEn ? cat.labelEn : cat.labelEs}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              {displayedCatalogCategories.map((category) => (
                <div key={category.id} className="border-t border-slate-800/80 pt-2.5">
                  <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <span>{category.icon}</span>
                    <span>{isEn ? category.labelEn : category.labelEs}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((item) => {
                      const isAdded = hasSkill(item.name);
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => toggleSkill(item.name, category.id)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                            isAdded
                              ? "border border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold shadow-sm"
                              : item.isStar
                              ? "border border-cyan-400/80 bg-cyan-950/40 text-cyan-200 hover:border-cyan-300 hover:bg-cyan-900/60"
                              : "border border-slate-700 bg-slate-950/70 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-800"
                          }`}
                          title={isAdded ? (isEn ? "Tap to remove" : "Toca para quitar") : (isEn ? "Tap to add" : "Toca para agregar")}
                        >
                          <span className={`text-xs ${isAdded ? "text-emerald-400 font-bold" : "text-slate-400"}`}>
                            {isAdded ? "✓" : "+"}
                          </span>
                          <span>{item.name}</span>
                          {item.isStar && !isAdded && (
                            <span className="rounded bg-cyan-400/20 px-1 py-0.2 text-[10px] font-bold text-cyan-300">
                              ★ Destacada
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white">
                  {isEn ? "Your Added Skills" : "Tus Habilidades Agregadas"} ({currentSkills.length})
                </h2>
                <p className="text-xs text-slate-400">
                  {isEn ? "Adjust proficiency or tap × to remove" : "Ajusta el nivel o toca × para quitar"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="search"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isEn ? "Filter added skills…" : "Filtrar en tu lista…"}
                  className="rounded-md border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-xs text-white outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={sortAlphabetical}
                  className="rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
                >
                  A-Z
                </button>
                {currentSkills.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
                  >
                    {isEn ? "Clear all" : "Limpiar todas"}
                  </button>
                )}
              </div>
            </div>

            {filteredCurrentSkills.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                {searchFilter
                  ? (isEn ? "No skills match your search filter." : "No hay habilidades que coincidan con la búsqueda.")
                  : (isEn ? "No skills added yet. Use the quick add input or tap preset badges above." : "Aún no tienes habilidades agregadas. Escribe arriba o toca los botones del catálogo.")}
              </div>
            ) : (
              <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCurrentSkills.map((skill) => {
                  const originalIndex = (cv.skills || []).findIndex(
                    (s) => normaliseText(typeof s === "string" ? s : s.name) === normaliseText(skill.name)
                  );
                  return (
                    <div
                      key={skill.name}
                      className="group flex items-center justify-between gap-2 rounded-lg border border-slate-700/80 bg-slate-950/60 p-2.5 transition hover:border-slate-600 hover:bg-slate-900"
                    >
                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-xs font-semibold text-slate-200">
                          {skill.name}
                        </strong>
                        <div className="mt-1 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => originalIndex >= 0 && updateSkillLevel(originalIndex, lvl)}
                              title={isEn ? `Set level ${lvl}/5` : `Fijar nivel ${lvl}/5`}
                              className={`h-2.5 w-2.5 rounded-full transition ${
                                lvl <= (skill.level || 4)
                                  ? "bg-cyan-400 hover:bg-cyan-300"
                                  : "bg-slate-700 hover:bg-slate-600"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-[10px] text-slate-400">
                            {skill.level || 4}/5
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.name)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-300"
                        title={isEn ? `Remove ${skill.name}` : `Eliminar ${skill.name}`}
                        aria-label={isEn ? `Remove ${skill.name}` : `Eliminar ${skill.name}`}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {analysis?.matched && (
        <KeywordBlock
          title={isEn ? "Current Matches with Job Post" : "Coincidencias actuales con la Vacante"}
          terms={analysis.matched}
          empty={isEn ? "Add a job post to compare your skills." : "Agrega una vacante para comparar habilidades."}
          tone="emerald"
        />
      )}

      <AtsQualityAudit
        isEn={isEn}
        unsupportedSkills={analysis?.unsupportedSkills || []}
        issues={analysis?.qualityIssues || []}
      />
    </section>
  );
}

function AnalyticsConsent({ isEn, onChoose }) {
  return (
    <section className="cv-ats-consent" role="region" aria-label={isEn ? "Metrics preferences" : "Preferencias de métricas"}>
      <div>
        <strong>{isEn ? "Optional Local Metrics" : "Métricas locales opcionales"}</strong>
        <p>
          {isEn
            ? "Allow counting usage events such as resume started, completed, or exported? We never track names, text, companies, emails, or files; counters stay purely inside this browser."
            : "¿Permites contar eventos como CV iniciado, completado o exportado? No registramos nombres, contenido, empresas, correos ni archivos; los contadores permanecen en este navegador."}
        </p>
      </div>
      <div>
        <button onClick={() => onChoose("declined")}>{isEn ? "Decline" : "No permitir"}</button>
        <button onClick={() => onChoose("accepted")} className="is-primary">{isEn ? "Allow local metrics" : "Permitir métricas locales"}</button>
      </div>
    </section>
  );
}

const getAtsFaq = (isEn) => [
  [
    isEn ? "Does this tool send my resume to any remote server?" : "¿La herramienta envía mi CV a un servidor?",
    isEn ? "No. Parsing, preview rendering, and storage occur entirely locally inside your browser." : "No. El análisis, la vista previa y el guardado funcionan localmente en este navegador.",
  ],
  [
    isEn ? "Does a high score guarantee passing every ATS?" : "¿Un resultado alto garantiza superar cualquier ATS?",
    isEn ? "No. It is an editorial guide. Each employer configures distinct ranking filters, criteria, and formats." : "No. Es una guía de preparación. Cada empresa configura sus propios filtros, formatos y criterios.",
  ],
  [
    isEn ? "Should I copy every keyword from the job post?" : "¿Debo copiar todas las palabras de la oferta?",
    isEn ? "No. Include only skills and terms representing authentic experience and verifiable achievements." : "No. Incluye únicamente términos que describan experiencia, conocimientos o resultados reales.",
  ],
  [
    isEn ? "Which template is the safest for ATS?" : "¿Qué plantilla es más segura?",
    isEn ? "ATS and Minimal use a single-column linear layout. Visual designs work well for direct submission, but linear is optimal for automated parsers." : "ATS y Minimal usan estructura lineal. Las plantillas visuales pueden ser adecuadas para envío directo, pero conviene verificar el sistema de destino.",
  ],
  [
    isEn ? "How many pages should my resume have?" : "¿Cuántas páginas debería tener?",
    isEn ? "Typically one or two pages, emphasizing recent and relevant achievements. The live preview reflects the exact page count." : "Generalmente una o dos páginas, priorizando información reciente y relevante. La vista previa muestra el número real.",
  ],
];

function TrustCenter({ isEn, consent, analytics, onConsentChange, onDeleteAll }) {
  const events = analytics.events || {};
  const faq = useMemo(() => getAtsFaq(isEn), [isEn]);

  return (
    <section className="cv-ats-trust">
      <div className="cv-ats-trust-heading">
        <div>
          <span>{isEn ? "Privacy & Confidence" : "Privacidad y confianza"}</span>
          <h2>{isEn ? "Your career data remains under your full control" : "Tus datos profesionales permanecen bajo tu control"}</h2>
          <p>{isEn ? "There is zero automated upload of resumes, job posts, or personal records." : "No existe subida automática del CV, la oferta o tus datos personales."}</p>
        </div>
        <button onClick={onDeleteAll}>{isEn ? "Delete all my local data" : "Eliminar todos mis datos locales"}</button>
      </div>
      <div className="cv-ats-trust-grid">
        <article>
          <h3>{isEn ? "Local Storage" : "Almacenamiento"}</h3>
          <p>{isEn ? "Resumes, copies, applications, letters, and preferences are stored exclusively via localStorage in this browser." : "CV, copias, postulaciones, cartas y preferencias se guardan únicamente mediante `localStorage` en este navegador."}</p>
        </article>
        <article>
          <h3>{isEn ? "Usage Metrics" : "Métricas"}</h3>
          <p>
            {consent === "accepted"
              ? (isEn ? "Active consent. Only anonymous event names are counted; never personal contents." : "Consentimiento activo. Solo se cuentan nombres de eventos; nunca contenido personal.")
              : (isEn ? "Metrics disabled. No usage telemetry is preserved." : "Métricas desactivadas. No se conserva ningún contador de uso.")}
          </p>
          <button onClick={() => onConsentChange(consent === "accepted" ? "declined" : "accepted")}>
            {consent === "accepted" ? (isEn ? "Disable metrics" : "Desactivar métricas") : (isEn ? "Enable local metrics" : "Activar métricas locales")}
          </button>
        </article>
        <article>
          <h3>{isEn ? "Local Counters" : "Contadores locales"}</h3>
          <ul>
            <li>{isEn ? "Resumes started:" : "CV iniciados:"} {events.cv_started?.count || 0}</li>
            <li>{isEn ? "Resumes completed:" : "CV completados:"} {events.cv_completed?.count || 0}</li>
            <li>{isEn ? "PDFs exported:" : "PDF exportados:"} {events.pdf_exported?.count || 0}</li>
            <li>{isEn ? "DOCX exported:" : "DOCX exportados:"} {events.docx_exported?.count || 0}</li>
          </ul>
        </article>
      </div>
      <div className="cv-ats-faq">
        <h2>{isEn ? "Frequently Asked Questions & ATS Advice" : "Preguntas frecuentes y consejos ATS"}</h2>
        {faq.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function OnboardingPanel({ isEn, value, onChange, onCancel, onComplete }) {
  const intentLabels = {
    blank: isEn ? "Build a resume from scratch" : "Crear un CV desde cero",
    template: isEn ? "Customize the sample template" : "Personalizar el ejemplo",
    import: isEn ? "Import and enhance my resume" : "Importar y mejorar mi CV",
  };
  return (
    <section className="cv-ats-onboarding" aria-labelledby="cv-onboarding-title">
      <div className="cv-ats-onboarding-heading">
        <div>
          <span>{isEn ? "Initial Setup" : "Configuración inicial"}</span>
          <h2 id="cv-onboarding-title">{isEn ? "Tell us what resume you want to create" : "Cuéntanos qué CV quieres crear"}</h2>
          <p>{isEn ? "We'll use these settings to initialize your workspace. Everything stays in your browser." : "Usaremos estas preferencias para preparar tu espacio de trabajo. Todo permanece en este navegador."}</p>
        </div>
        <button onClick={onCancel} aria-label={isEn ? "Close setup" : "Cerrar configuración"}>×</button>
      </div>
      <div className="cv-ats-onboarding-intent">
        <strong>{isEn ? "Selected pathway" : "Ruta seleccionada"}</strong>
        <span>{intentLabels[value.intent]}</span>
      </div>
      <div className="cv-ats-onboarding-grid">
        <Field label={isEn ? "Target Role / Title" : "Cargo objetivo"} value={value.title} onChange={(title) => onChange((current) => ({ ...current, title }))} placeholder={isEn ? "e.g. Data Analyst" : "Ej. Analista de datos"} />
        <label>
          <span>{isEn ? "Experience Level" : "Nivel de experiencia"}</span>
          <select value={value.experienceLevel} onChange={(event) => onChange((current) => ({ ...current, experienceLevel: event.target.value }))}>
            <option value="first">{isEn ? "Entry level / First job" : "Primer empleo"}</option>
            <option value="junior">{isEn ? "Junior · up to 2 years" : "Junior · hasta 2 años"}</option>
            <option value="mid">{isEn ? "Mid · 3 to 6 years" : "Intermedio · 3 a 6 años"}</option>
            <option value="senior">{isEn ? "Senior · 6+ years" : "Senior · más de 6 años"}</option>
            <option value="executive">{isEn ? "Leadership / Executive" : "Liderazgo / ejecutivo"}</option>
          </select>
        </label>
        <label>
          <span>{isEn ? "Country or Market" : "País o mercado"}</span>
          <select value={value.country} onChange={(event) => onChange((current) => ({ ...current, country: event.target.value }))}>
            <option>Chile</option>
            <option>United States</option>
            <option>Estados Unidos</option>
            <option>Argentina</option>
            <option>Colombia</option>
            <option>España</option>
            <option>México</option>
            <option>Perú</option>
            <option>{isEn ? "Other" : "Otro"}</option>
          </select>
        </label>
      </div>
      <div className="cv-ats-onboarding-footer">
        <p><strong>{isEn ? "Privacy:" : "Privacidad:"}</strong> {isEn ? "we never send your resume or job descriptions to remote servers." : "no enviamos tu CV ni la oferta de trabajo a servidores externos."}</p>
        <div>
          <button onClick={onCancel}>{isEn ? "Back to sample" : "Volver al ejemplo"}</button>
          <button onClick={onComplete} className="is-primary">{isEn ? "Continue" : "Continuar"}</button>
        </div>
      </div>
    </section>
  );
}

const getProfileSections = (isEn) => [
  {
    key: "education",
    title: isEn ? "Education" : "Educación",
    addLabel: isEn ? "Add education" : "Añadir formación",
    empty: isEn ? "Add education relevant to the position." : "Añade estudios relevantes para el cargo.",
    fields: [
      { key: "degree", label: isEn ? "Degree or Program" : "Título o programa", placeholder: isEn ? "B.S. in Civil Engineering" : "Ingeniería en Construcción" },
      { key: "institution", label: isEn ? "Institution" : "Institución", placeholder: isEn ? "University or Institute" : "Universidad o instituto" },
      { key: "start_date", label: isEn ? "Start Date" : "Inicio", type: "text", placeholder: isEn ? "e.g. 2023" : "Ej. 2023" },
      { key: "end_date", label: isEn ? "End Date" : "Fin", type: "text", placeholder: isEn ? "e.g. 2025 or In progress" : "Ej. 2025 o En curso" },
    ],
  },
  {
    key: "certifications",
    title: isEn ? "Certifications" : "Certificaciones",
    addLabel: isEn ? "Add certification" : "Añadir certificación",
    empty: isEn ? "Add active certifications related to the vacancy." : "Agrega certificaciones vigentes y relacionadas con la vacante.",
    fields: [
      { key: "name", label: isEn ? "Certification" : "Certificación", placeholder: isEn ? "Certification Name" : "Nombre de la certificación" },
      { key: "issuer", label: isEn ? "Issuing Organization" : "Entidad emisora", placeholder: isEn ? "Issuing body" : "Entidad" },
      { key: "date", label: isEn ? "Date" : "Fecha", type: "month" },
      { key: "credential", label: isEn ? "Credential ID or URL" : "Credencial o URL", placeholder: isEn ? "ID or verifiable link" : "ID o enlace verificable" },
    ],
  },
  {
    key: "languages",
    title: isEn ? "Languages" : "Idiomas",
    addLabel: isEn ? "Add language" : "Añadir idioma",
    empty: isEn ? "Specify languages and proficiency levels you can demonstrate." : "Indica idiomas y niveles que puedas demostrar.",
    fields: [
      { key: "name", label: isEn ? "Language" : "Idioma", placeholder: isEn ? "English" : "Inglés" },
      {
        key: "level",
        label: isEn ? "Level" : "Nivel",
        type: "select",
        options: isEn
          ? ["Basic", "A1", "A2", "B1 Intermediate", "B2 Upper Intermediate", "C1 Advanced", "C2 Proficient", "Native"]
          : ["Básico", "A1", "A2", "B1 Intermedio", "B2 Intermedio alto", "C1 Avanzado", "C2 Competente", "Nativo"],
      },
    ],
  },
  {
    key: "projects",
    title: isEn ? "Featured Projects" : "Proyectos destacados",
    addLabel: isEn ? "Add project" : "Añadir proyecto",
    empty: isEn ? "Include projects demonstrating relevant competencies." : "Incluye proyectos que demuestren experiencia relevante.",
    fields: [
      { key: "name", label: isEn ? "Project Name" : "Nombre", placeholder: isEn ? "Featured Project" : "Proyecto destacado" },
      { key: "date", label: isEn ? "Date" : "Fecha", type: "month" },
      { key: "url", label: isEn ? "Link" : "Enlace", placeholder: "https://…" },
      { key: "description", label: isEn ? "Description and Results" : "Descripción y resultados", placeholder: isEn ? "Explain your contributions and quantifiable results." : "Explica tu aporte y el resultado obtenido.", type: "textarea", wide: true },
    ],
  },
];

function ProfileExtrasEditor({ isEn, cv, updateItem, addItem, duplicateItem, removeItem, moveItem }) {
  const sections = useMemo(() => getProfileSections(isEn), [isEn]);
  return (
    <div className="cv-ats-profile-sections">
      <div>
        <h2>{isEn ? "Education & Additional Credentials" : "Formación y antecedentes adicionales"}</h2>
        <p>{isEn ? "Fill in verified, relevant information for each field." : "Completa cada dato en su campo. Solo agrega información relevante y verificable."}</p>
      </div>
      {sections.map((section) => (
        <StructuredCollection key={section.key} isEn={isEn} section={section} items={cv[section.key] || []} updateItem={updateItem} addItem={addItem} duplicateItem={duplicateItem} removeItem={removeItem} moveItem={moveItem} />
      ))}
    </div>
  );
}

function StructuredCollection({ isEn, section, items, updateItem, addItem, duplicateItem, removeItem, moveItem }) {
  return (
    <section className="cv-ats-collection">
      <div className="cv-ats-collection-heading flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-200">{section.title}</h3>
          <span className="text-xs text-slate-400">{items.length} {items.length === 1 ? (isEn ? "entry" : "entrada") : (isEn ? "entries" : "entradas")}</span>
        </div>
        <button onClick={() => addItem(section.key)} className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/20">
          + {section.addLabel}
        </button>
      </div>
      {!items.length && <EmptyState text={section.empty} />}
      {items.map((item, index) => (
        <article key={`${section.key}-${index}`} className="cv-ats-collection-card">
          <div className="cv-ats-collection-card-heading flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <strong className="min-w-0 flex-1 truncate font-semibold text-slate-200">{item[section.fields[0].key] || `${section.title} ${index + 1}`}</strong>
            <div className="cv-ats-card-actions flex flex-wrap items-center gap-1.5 flex-shrink-0">
              <button disabled={index === 0} onClick={() => moveItem(section.key, index, -1)} aria-label={isEn ? `Move ${section.title} up` : `Mover ${section.title} hacia arriba`}>↑</button>
              <button disabled={index === items.length - 1} onClick={() => moveItem(section.key, index, 1)} aria-label={isEn ? `Move ${section.title} down` : `Mover ${section.title} hacia abajo`}>↓</button>
              <button onClick={() => duplicateItem(section.key, index)}>{isEn ? "Duplicate" : "Duplicar"}</button>
              <button onClick={() => removeItem(section.key, index, `${section.title.toLowerCase()} ${index + 1}`)} className="is-danger">{isEn ? "Delete" : "Eliminar"}</button>
            </div>
          </div>
          <div className="cv-ats-collection-grid mt-3 grid gap-3 sm:grid-cols-2">
            {section.fields.map((field) => (
              <StructuredField key={field.key} isEn={isEn} field={field} value={item[field.key] || ""} onChange={(value) => updateItem(section.key, index, field.key, value)} />
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

function StructuredField({ isEn, field, value, onChange }) {
  if (field.type === "textarea") return (
    <label className={`block min-w-0 ${field.wide ? "is-wide col-span-full" : ""}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{field.label}</span>
      <textarea rows="3" value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder || ""} className="w-full min-w-0 max-w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 box-border" />
    </label>
  );
  if (field.type === "select") return (
    <label className={`block min-w-0 ${field.wide ? "is-wide col-span-full" : ""}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{field.label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full min-w-0 max-w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 box-border">
        <option value="">{isEn ? "Select level" : "Selecciona un nivel"}</option>
        {field.options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
  return (
    <label className={`block min-w-0 ${field.wide ? "is-wide col-span-full" : ""}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{field.label}</span>
      <input type={field.type || "text"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder || ""} className="w-full min-w-0 max-w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 box-border" />
    </label>
  );
}

function KeywordBlock({ title, terms, empty, tone }) {
  const colors = {
    cyan: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
    emerald: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    amber: "border-amber-400/40 bg-amber-400/10 text-amber-100",
  };
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
      <h2 className="font-semibold text-white">{title}</h2>
      {terms.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {terms.map((term) => <span key={term} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${colors[tone]}`}>{term}</span>)}
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-500">{empty}</p>
      )}
    </div>
  );
}

function EmptyState({ text }) { return <div className="rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-500">{text}</div>; }
function ActionButton({ title, detail, onClick }) { return <button onClick={onClick} className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-cyan-400/60 hover:bg-slate-800"><span className="block font-bold text-white">{title}</span><span className="mt-1 block text-xs leading-relaxed text-slate-400">{detail}</span></button>; }

function AssistantPanel({ isEn, cv, insights, updateCv, setNotice }) {
  const addConfirmedSkill = (concept) => {
    const exists = cv.skills.some((skill) => (skill.name || skill).toLocaleLowerCase("es-CL") === concept.canonical.toLocaleLowerCase("es-CL"));
    if (exists) return;
    updateCv((current) => ({ ...current, skills: [...current.skills, { name: concept.canonical, level: 3, category: concept.category }] }));
    setNotice(isEn ? `${concept.canonical} added upon confirmation.` : `${concept.canonical} añadido tras tu confirmación.`);
  };
  const applySummary = (text) => {
    if (cv.summary && !window.confirm(isEn ? "Replace current summary with this draft generated from your data?" : "¿Reemplazar el resumen actual por este borrador basado en tus datos?")) return;
    updateCv((current) => ({ ...current, summary: text }));
    setNotice(isEn ? "Draft applied. Review and refine any claims before exporting." : "Borrador aplicado. Revísalo y ajusta cualquier afirmación antes de exportar.");
  };
  const required = insights.semantic.required;
  const desirable = insights.semantic.desirable;
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{isEn ? "Professional Content Assistant" : "Asistente profesional de contenido"}</h1>
        <p className="mt-1 text-sm text-slate-400">{isEn ? "Parses job openings locally and proposes grounded improvements strictly based on your input." : "Interpreta cualquier oferta localmente y propone mejoras basadas solo en la información que ya proporcionaste."}</p>
      </div>
      <div className="cv-ats-ai-guardrail">
        <strong>{isEn ? "Truthfulness Guardrail" : "Control de veracidad"}</strong>
        <p>{isEn ? "Suggestions are drafts. This app never invents experience, metrics, or false skills: you confirm every addition." : "Las sugerencias son borradores. La aplicación nunca inventa experiencia, cifras ni habilidades: tú confirmas cada cambio."}</p>
      </div>
      <div className="cv-ats-requirements">
        <RequirementColumn isEn={isEn} title={isEn ? "Mandatory Requirements" : "Requisitos obligatorios"} items={required} empty={isEn ? "No explicit mandatory markers detected." : "No se detectaron marcadores obligatorios explícitos."} tone="required" />
        <RequirementColumn isEn={isEn} title={isEn ? "Desirable Requirements" : "Requisitos deseables"} items={desirable} empty={isEn ? "No explicit desirable requirements detected." : "No se detectaron requisitos deseables explícitos."} tone="desirable" />
      </div>
      <div className="cv-ats-semantic">
        <div>
          <h2>{isEn ? "Professional Skill Equivalences" : "Equivalencias profesionales"}</h2>
          <p>{isEn ? "Recognizes tools and competencies even when the posting uses different naming conventions." : "Reconoce herramientas y competencias aunque la oferta y tu CV usen nombres diferentes."}</p>
        </div>
        {insights.semantic.concepts.length ? (
          <div className="cv-ats-semantic-list">
            {insights.semantic.concepts.map((concept) => (
              <article key={concept.canonical} className={concept.matched ? "is-matched" : "is-missing"}>
                <div>
                  <span>{concept.category}</span>
                  <strong>{concept.canonical}</strong>
                  <p>{concept.matched ? (isEn ? `Matched via “${concept.matchedAlias}”` : `Coincidencia mediante “${concept.matchedAlias}”`) : (isEn ? "Not detected in your CV" : "No detectado en tu CV")}</p>
                </div>
                {!concept.matched && <button onClick={() => addConfirmedSkill(concept)}>{isEn ? "I master this · Add skill" : "Confirmo que lo domino · añadir"}</button>}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState text={isEn ? "Paste a job post with tools and competencies to analyze equivalences." : "Pega una oferta con herramientas o competencias para analizar equivalencias."} />
        )}
      </div>
      <div className="cv-ats-summary-assistant">
        <div>
          <h2>{isEn ? "Professional Summary Variants" : "Variantes del perfil profesional"}</h2>
          <p>{isEn ? "Choose an angle synthesized strictly from your registered title and skills." : "Elige un enfoque construido exclusivamente desde tu cargo y habilidades registradas."}</p>
        </div>
        {insights.summaryVariants.length ? (
          <div className="cv-ats-summary-variants">
            {insights.summaryVariants.map((variant) => (
              <article key={variant.id}>
                <span>{variant.label}</span>
                <blockquote>{variant.text}</blockquote>
                <button onClick={() => applySummary(variant.text)}>{cv.summary ? (isEn ? "Use & replace summary" : "Usar y reemplazar resumen") : (isEn ? "Use as summary" : "Usar como resumen")}</button>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState text={isEn ? "Add a role and skills to generate grounded summary drafts." : "Añade un cargo y habilidades para generar borradores fundamentados."} />
        )}
      </div>
      <WritingIssues isEn={isEn} issues={insights.writingIssues} />
      <div className="cv-ats-achievement-coach">
        <div>
          <h2>{isEn ? "STAR/CAR Achievement Coach" : "Entrenador de logros STAR/CAR"}</h2>
          <p>{isEn ? "Input real context and the tool arranges it without fabricating numbers." : "Completa datos reales y la herramienta los ordenará sin crear cifras por ti."}</p>
        </div>
        {insights.achievements.length ? (
          insights.achievements.map((achievement) => (
            <article key={achievement.index}>
              <div>
                <strong>{achievement.label}</strong>
                <span className={achievement.hasActionVerb ? "is-ok" : "is-pending"}>{achievement.hasActionVerb ? (isEn ? "Verb ✓" : "Verbo ✓") : (isEn ? "Missing verb" : "Falta verbo")}</span>
                <span className={achievement.hasMetric ? "is-ok" : "is-pending"}>{achievement.hasMetric ? (isEn ? "Metric ✓" : "Métrica ✓") : (isEn ? "Missing metric" : "Falta métrica")}</span>
              </div>
              {achievement.prompts.map((prompt) => <p key={prompt}>• {prompt}</p>)}
              <AchievementBuilder isEn={isEn} index={achievement.index} currentText={cv.experience[achievement.index]?.description || ""} updateCv={updateCv} setNotice={setNotice} />
            </article>
          ))
        ) : (
          <EmptyState text={isEn ? "Add experiences to receive tailored copywriting guidance." : "Añade experiencias para recibir orientación de redacción."} />
        )}
      </div>
    </section>
  );
}

function WritingIssues({ isEn, issues }) {
  return (
    <div className="cv-ats-writing-issues">
      <div>
        <h2>{isEn ? "Writing Clarity & Red Flags" : "Claridad de redacción"}</h2>
        <p>{isEn ? "Highlights generic expressions or overlong sentence blocks." : "Detecta expresiones genéricas o bloques demasiado extensos."}</p>
      </div>
      {issues.length ? (
        <div>
          {issues.map((issue, index) => (
            <article key={`${issue.section}-${issue.phrase}-${index}`}>
              <strong>{issue.section}</strong>
              <span>“{issue.phrase}”</span>
              <p>{issue.suggestion}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="is-clear">{isEn ? "No high-priority generic phrases detected." : "No se detectaron frases genéricas prioritarias."}</p>
      )}
    </div>
  );
}

function AchievementBuilder({ isEn, index, currentText, updateCv, setNotice }) {
  const [draft, setDraft] = useState({ context: "", action: "", method: "", result: "" });
  const composed = isEn
    ? [draft.context && `Faced with ${draft.context.trim()},`, draft.action.trim(), draft.method && `using ${draft.method.trim()}`, draft.result && `achieving ${draft.result.trim()}.`].filter(Boolean).join(" ")
    : [draft.context && `Ante ${draft.context.trim()},`, draft.action.trim(), draft.method && `usando ${draft.method.trim()}`, draft.result && `y logré ${draft.result.trim()}.`].filter(Boolean).join(" ");

  const apply = () => {
    if (!draft.action.trim() || !draft.result.trim()) {
      setNotice(isEn ? "Please describe at least an action and a real outcome before applying." : "Describe al menos tu acción y un resultado real antes de aplicar el logro.");
      return;
    }
    updateCv((current) => ({
      ...current,
      experience: current.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, description: currentText.trim() ? `${currentText.trim()}\n${composed}` : composed } : entry),
    }));
    setDraft({ context: "", action: "", method: "", result: "" });
    setNotice(isEn ? "Achievement added to experience. Ensure each claim is accurate." : "Logro añadido a la experiencia. Revisa que cada afirmación sea exacta.");
  };

  return (
    <div className="cv-ats-achievement-builder">
      <label>
        <span>{isEn ? "Context or Challenge" : "Situación o desafío"}</span>
        <input value={draft.context} onChange={(event) => setDraft((current) => ({ ...current, context: event.target.value }))} placeholder={isEn ? "e.g. delays in monthly reporting" : "Ej. retrasos en reportes mensuales"} />
      </label>
      <label>
        <span>{isEn ? "Action Taken" : "Acción realizada"}</span>
        <input value={draft.action} onChange={(event) => setDraft((current) => ({ ...current, action: event.target.value }))} placeholder={isEn ? "e.g. Automated data consolidation" : "Ej. Automaticé la consolidación de datos"} />
      </label>
      <label>
        <span>{isEn ? "Tool or Methodology" : "Herramienta o método"}</span>
        <input value={draft.method} onChange={(event) => setDraft((current) => ({ ...current, method: event.target.value }))} placeholder={isEn ? "e.g. Power Query and Excel" : "Ej. Power Query y Excel"} />
      </label>
      <label>
        <span>{isEn ? "Measurable Result" : "Resultado verificable"}</span>
        <input value={draft.result} onChange={(event) => setDraft((current) => ({ ...current, result: event.target.value }))} placeholder={isEn ? "e.g. cutting 8 hours of monthly workload" : "Ej. reducir 8 horas de trabajo mensual"} />
      </label>
      {composed && <blockquote>{composed}</blockquote>}
      <button onClick={apply}>{isEn ? "Add this achievement to experience" : "Añadir este logro a la experiencia"}</button>
    </div>
  );
}

function RequirementColumn({ title, items, empty, tone }) {
  return (
    <div className={`cv-ats-requirement-column is-${tone}`}>
      <h2>{title}</h2>
      {items.length ? (
        <ul>
          {items.map((item) => <li key={item.id}>{item.text}{item.concepts.length > 0 && <span>{item.concepts.join(" · ")}</span>}</li>)}
        </ul>
      ) : (
        <p>{empty}</p>
      )}
    </div>
  );
}

function ApplicationsLocked({ isEn, onContinue }) {
  return (
    <section className="cv-ats-applications-locked">
      <span>{isEn ? "Available after creating your resume" : "Disponible después de crear tu CV"}</span>
      <h1>{isEn ? "Complete essential content first" : "Completa primero el contenido esencial"}</h1>
      <p>{isEn ? "Add profile, experience, and skills to unlock targeted job versions, cover letters, and follow-up." : "Agrega perfil, experiencia y habilidades para activar versiones por vacante, cartas y seguimiento."}</p>
      <button onClick={onContinue}>{isEn ? "Continue with my CV" : "Continuar con mi CV"}</button>
    </section>
  );
}

const getApplicationChecklist = (isEn) => [
  ["cvReviewed", isEn ? "Tailored & reviewed resume" : "CV adaptado y revisado"],
  ["coverLetterReady", isEn ? "Cover letter prepared" : "Carta de presentación lista"],
  ["linksChecked", isEn ? "Verified contact & portfolio links" : "Enlaces y contacto verificados"],
  ["applicationSent", isEn ? "Application submitted" : "Postulación enviada"],
  ["followUpScheduled", isEn ? "Follow-up scheduled" : "Seguimiento programado"],
];

function ApplicationFollowUp({ isEn, cv, workspace, setWorkspace, setNotice }) {
  const checklist = useMemo(() => getApplicationChecklist(isEn), [isEn]);
  const [selectedId, setSelectedId] = useState(workspace.applications[0]?.id || "");
  const application = workspace.applications.find((item) => item.id === selectedId);
  const update = (patch) => setWorkspace((current) => updateApplicationMetadata(current, selectedId, patch));
  if (!workspace.applications.length) return null;
  const completed = application ? checklist.filter(([key]) => application.checklist?.[key]).length : 0;
  const isOverdue = application?.nextActionDate && application.nextActionDate < new Date().toISOString().slice(0, 10);
  const createLetter = () => {
    update({ coverLetter: generateCoverLetter(cv, application), checklist: { ...application.checklist, coverLetterReady: false } });
    setNotice(isEn ? "Cover letter draft generated strictly from data in your CV." : "Borrador de carta generado únicamente con datos registrados en tu CV.");
  };
  return (
    <section className="cv-ats-followup">
      <div className="cv-ats-followup-heading">
        <div>
          <h2>{isEn ? "Application Follow-Up Hub" : "Centro de seguimiento"}</h2>
          <p>{isEn ? "Checklist, cover letter, and next action for each application." : "Checklist, carta y próxima acción para cada postulación."}</p>
        </div>
        <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          {workspace.applications.map((item) => <option key={item.id} value={item.id}>{item.company} · {item.title}</option>)}
        </select>
      </div>
      {application && (
        <>
          <div className="cv-ats-followup-summary">
            <div>
              <span>{isEn ? "Progress" : "Progreso"}</span>
              <strong>{completed}/{checklist.length}</strong>
            </div>
            <div>
              <span>{isEn ? "Next Action" : "Próxima acción"}</span>
              <strong className={isOverdue ? "is-overdue" : ""}>{application.nextActionDate || (isEn ? "Not scheduled" : "Sin programar")}</strong>
            </div>
          </div>
          <div className="cv-ats-followup-grid">
            <div className="cv-ats-checklist">
              <h3>{isEn ? "Application Checklist" : "Checklist de postulación"}</h3>
              {checklist.map(([key, label]) => (
                <label key={key}>
                  <input type="checkbox" checked={Boolean(application.checklist?.[key])} onChange={(event) => update({ checklist: { ...application.checklist, [key]: event.target.checked } })} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <div className="cv-ats-next-action">
              <h3>{isEn ? "Local Reminder" : "Recordatorio local"}</h3>
              <Field label={isEn ? "Next Action" : "Próxima acción"} value={application.nextAction || ""} onChange={(nextAction) => update({ nextAction })} placeholder={isEn ? "e.g. Send follow-up email" : "Ej. Enviar correo de seguimiento"} />
              <Field label={isEn ? "Date" : "Fecha"} type="date" value={application.nextActionDate || ""} onChange={(nextActionDate) => update({ nextActionDate })} />
              {isOverdue && <p>{isEn ? "The follow-up date has passed." : "La fecha de seguimiento está vencida."}</p>}
            </div>
          </div>
          <div className="cv-ats-cover-letter">
            <div>
              <h3>{isEn ? "Cover Letter" : "Carta de presentación"}</h3>
              <div>
                <button onClick={createLetter}>{application.coverLetter ? (isEn ? "Regenerate draft" : "Regenerar borrador") : (isEn ? "Generate draft" : "Generar borrador")}</button>
                {application.coverLetter && <button onClick={() => downloadText(`${safeFilename(`cover-letter-${application.company}-${application.title}`)}.txt`, application.coverLetter)}>{isEn ? "Download TXT" : "Descargar TXT"}</button>}
              </div>
            </div>
            <textarea rows="12" value={application.coverLetter || ""} onChange={(event) => update({ coverLetter: event.target.value })} placeholder={isEn ? "Generate a draft and customize it before sending." : "Genera un borrador y personalízalo antes de enviarlo."} />
            <p>{isEn ? "The tool does not fabricate experience. Review tone, addressee, and accuracy before using." : "La herramienta no inventa experiencia. Revisa el tono, destinatario y exactitud antes de usarla."}</p>
          </div>
        </>
      )}
    </section>
  );
}

function ApplicationsWorkspaceClean({ isEn, cv, workspace, setWorkspace, updateCv, activeApplicationId, setActiveApplicationId, setNotice }) {
  const [form, setForm] = useState({ company: "", title: cv.targetJob?.title || "", url: "", date: new Date().toISOString().slice(0, 10), status: isEn ? "Draft" : "Borrador" });
  const activeApplication = workspace.applications.find((application) => application.id === activeApplicationId);
  const addApplication = () => {
    if (!form.company.trim() || !form.title.trim()) {
      setNotice(isEn ? "Please specify company and job title to create a version." : "Indica empresa y cargo para crear la versión.");
      return;
    }
    setWorkspace((current) => {
      const result = createApplication(current, cv, form);
      setActiveApplicationId(result.application.id);
      return result.workspace;
    });
    setForm((current) => ({ ...current, company: "", url: "" }));
    setNotice(isEn ? "Version created from your current draft." : "Versión creada desde el CV ficticio o desde tu borrador actual.");
  };
  const loadVersion = (application) => {
    if (!window.confirm(isEn ? `Open version for ${application.company}?` : `¿Abrir la versión para ${application.company}?`)) return;
    updateCv(application.cv);
    setActiveApplicationId(application.id);
    setNotice(isEn ? `Version loaded: ${application.title} · ${application.company}.` : `Versión cargada: ${application.title} · ${application.company}.`);
  };
  const saveVersion = () => {
    if (!activeApplication) return;
    setWorkspace((current) => saveApplicationRevision(current, activeApplication.id, cv));
    setNotice(isEn ? "Version updated; previous revision archived in history." : "Versión actualizada; la revisión anterior quedó en el historial.");
  };
  const removeApplication = (application) => {
    if (!window.confirm(isEn ? `Delete application for ${application.company} and its local history?` : `¿Eliminar la postulación a ${application.company} y su historial local?`)) return;
    setWorkspace((current) => ({ ...current, applications: current.applications.filter((item) => item.id !== application.id) }));
    if (activeApplicationId === application.id) setActiveApplicationId("");
  };
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{isEn ? "Versions per Application" : "Versiones por postulación"}</h1>
        <p className="mt-1 text-sm text-slate-400">{isEn ? "Create a tailored copy for each job vacancy without losing previous versions." : "Crea una copia específica para cada oferta sin usar perfiles personales predefinidos."}</p>
      </div>
      <div className="cv-ats-application-form">
        <h2>{isEn ? "New Target Version" : "Nueva versión por oferta"}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isEn ? "Company" : "Empresa"} value={form.company} onChange={(company) => setForm((current) => ({ ...current, company }))} placeholder={isEn ? "Target Company" : "Empresa objetivo"} />
          <Field label={isEn ? "Job Title" : "Cargo"} value={form.title} onChange={(title) => setForm((current) => ({ ...current, title }))} placeholder={isEn ? "Position Title" : "Cargo de la oferta"} />
          <Field label={isEn ? "Job Posting URL" : "URL de la oferta"} value={form.url} onChange={(url) => setForm((current) => ({ ...current, url }))} placeholder="https://…" />
          <Field label={isEn ? "Date" : "Fecha"} type="date" value={form.date} onChange={(date) => setForm((current) => ({ ...current, date }))} />
        </div>
        <button onClick={addApplication}>{isEn ? "Create version with current CV" : "Crear versión con el CV actual"}</button>
      </div>
      {workspace.applications.length ? (
        <div className="cv-ats-applications-list">
          {workspace.applications.map((application) => (
            <article key={application.id} className={application.id === activeApplicationId ? "is-active" : ""}>
              <div className="cv-ats-application-main">
                <div>
                  <span>{application.status}</span>
                  <h2>{application.title}</h2>
                  <p>{application.company} · {application.date || (isEn ? "No date" : "Sin fecha")}</p>
                </div>
                <select value={application.status} onChange={(event) => setWorkspace((current) => updateApplicationMetadata(current, application.id, { status: event.target.value }))}>
                  {APPLICATION_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
              <div className="cv-ats-application-actions">
                <button onClick={() => loadVersion(application)}>{isEn ? "Open" : "Abrir"}</button>
                <button onClick={() => { setActiveApplicationId(application.id); setNotice(isEn ? "Version selected." : "Versión seleccionada."); }}>{isEn ? "Select" : "Seleccionar"}</button>
                {application.id === activeApplicationId && <button onClick={saveVersion} className="is-primary">{isEn ? "Save revision" : "Guardar revisión"}</button>}
                <button onClick={() => removeApplication(application)} className="is-danger">{isEn ? "Delete" : "Eliminar"}</button>
              </div>
              {application.revisions.length > 0 && (
                <details>
                  <summary>{isEn ? `History · ${application.revisions.length} revisions` : `Historial · ${application.revisions.length} revisiones`}</summary>
                  {[...application.revisions].reverse().map((revision, index) => (
                    <div key={`${revision.savedAt}-${index}`} className="cv-ats-revision">
                      <span>{new Date(revision.savedAt).toLocaleString(isEn ? "en-US" : "es-CL")}</span>
                      <button onClick={() => updateCv(revision.cv)}>{isEn ? "Restore" : "Recuperar"}</button>
                    </div>
                  ))}
                </details>
              )}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState text={isEn ? "No target versions yet." : "Aún no hay versiones por oferta."} />
      )}
    </section>
  );
}

function ExportValidation({ isEn, errors, onNavigate }) {
  return (
    <div className="cv-ats-export-errors">
      <strong>{isEn ? "Missing Required Information" : "Faltan datos obligatorios"}</strong>
      <p>{isEn ? "Select any note to jump directly to the relevant section." : "Selecciona una observación para ir directamente a la sección correspondiente."}</p>
      <ul>
        {errors.map((error) => (
          <li key={error.id}>
            <button onClick={() => onNavigate(error.section)}>{error.message}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExportSettings({ isEn, cv, updateCv }) {
  const safety = isEn
    ? {
        ats: ["ATS Safe", "Single column with clean linear parsing."],
        minimal: ["ATS Safe", "Minimalist layout with standard linear flow."],
        executive: ["Visual Design", "Ideal for direct email sending; test destination ATS first."],
        technical: ["Visual Design", "Sidebar column may affect certain legacy ATS parsers."],
        latex: ["Advanced", "Direct inspection and export of LaTeX markup."],
      }[cv.template] || ["ATS Safe", ""]
    : {
        ats: ["ATS segura", "Una columna y lectura lineal."],
        minimal: ["ATS segura", "Diseño limpio con estructura lineal."],
        executive: ["Visual", "Adecuada para envío directo; verifica el ATS de destino."],
        technical: ["Visual", "La barra lateral puede afectar algunos lectores ATS."],
        latex: ["Avanzada", "Vista del código fuente LaTeX."],
      }[cv.template] || ["ATS segura", ""];

  return (
    <section className="cv-ats-export-settings">
      <div>
        <h2>{isEn ? "Document Configuration" : "Configuración del documento"}</h2>
        <span className={safety[0].includes("Safe") || safety[0].includes("segura") ? "is-safe" : "is-visual"}>{safety[0]}</span>
      </div>
      <p>{safety[1]}</p>
      <div>
        <label>
          <span>{isEn ? "Country / Target Market" : "País o mercado"}</span>
          <select value={cv.locale?.country || "Chile"} onChange={(event) => { const country = event.target.value; updateCv((current) => ({ ...current, locale: { ...current.locale, country }, pageFormat: country === "Estados Unidos" || country === "United States" ? "letter" : current.pageFormat })); }}>
            <option>Chile</option>
            <option>United States</option>
            <option>Estados Unidos</option>
            <option>Argentina</option>
            <option>Colombia</option>
            <option>España</option>
            <option>México</option>
            <option>Perú</option>
            <option>{isEn ? "Other" : "Otro"}</option>
          </select>
        </label>
        <label>
          <span>{isEn ? "Heading Language" : "Idioma de encabezados"}</span>
          <select value={cv.locale?.language || (isEn ? "en" : "es")} onChange={(event) => updateCv((current) => ({ ...current, locale: { ...current.locale, language: event.target.value } }))}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </label>
        <label>
          <span>{isEn ? "Paper Format" : "Formato"}</span>
          <select value={cv.pageFormat} onChange={(event) => updateCv((current) => ({ ...current, pageFormat: event.target.value }))}>
            <option value="a4">A4</option>
            <option value="letter">US Letter</option>
          </select>
        </label>
      </div>
    </section>
  );
}

function PlainTextPreview({ isEn, text }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cv-ats-plain-preview">
      <button onClick={() => setOpen((current) => !current)}>
        {open ? (isEn ? "Hide" : "Ocultar") : (isEn ? "View" : "Ver")} {isEn ? "simulated ATS plain text parser" : "lectura simulada del ATS"}
      </button>
      {open && <pre>{text || (isEn ? "Complete the resume to generate plain text parser output." : "Completa el CV para generar la lectura de texto plano.")}</pre>}
    </div>
  );
}

function ImportReview({ isEn, draft, onChange, onCancel, onApply }) {
  const updatePersonal = (key, value) => onChange({ ...draft, personal: { ...draft.personal, [key]: value } });
  return (
    <div className="cv-ats-import-backdrop" role="dialog" aria-modal="true" aria-label={isEn ? "Review imported resume" : "Revisar CV importado"}>
      <section className="cv-ats-import-dialog">
        <div className="cv-ats-import-heading">
          <div>
            <p>{draft.sourceType} {isEn ? "detected" : "detectado"}</p>
            <h2>{isEn ? "Review Before Importing" : "Revisa antes de importar"}</h2>
            <span>{draft.filename}</span>
          </div>
          <button onClick={onCancel} aria-label={isEn ? "Close review" : "Cerrar revisión"}>×</button>
        </div>
        <div className="cv-ats-import-grid">
          <Field label={isEn ? "Full Name" : "Nombre"} value={draft.personal.name} onChange={(value) => updatePersonal("name", value)} />
          <Field label={isEn ? "Target Role" : "Cargo"} value={draft.personal.title} onChange={(value) => updatePersonal("title", value)} />
          <Field label="Email" value={draft.personal.email} onChange={(value) => updatePersonal("email", value)} />
          <Field label={isEn ? "Phone" : "Teléfono"} value={draft.personal.phone} onChange={(value) => updatePersonal("phone", value)} />
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{isEn ? "Detected Summary" : "Resumen detectado"}</span>
          <textarea rows="5" value={draft.summary} onChange={(event) => onChange({ ...draft, summary: event.target.value })} />
        </label>
        <details>
          <summary>{isEn ? "Full extracted text" : "Texto extraído completo"}</summary>
          <pre>{draft.sourceText}</pre>
        </details>
        <p className="cv-ats-import-note">
          {isEn
            ? `Detected ${draft.skills.length} skills. The system will not overwrite existing non-empty values.`
            : `Se detectaron ${draft.skills.length} habilidades. El sistema no reemplazará campos existentes cuando el valor detectado esté vacío.`}
        </p>
        <div className="cv-ats-import-actions">
          <button onClick={onCancel}>{isEn ? "Cancel" : "Cancelar"}</button>
          <button onClick={onApply} className="is-primary">{isEn ? "Import detected data" : "Incorporar datos"}</button>
        </div>
      </section>
    </div>
  );
}

function ProgressPanel({ isEn, progress }) {
  return (
    <div className="cv-ats-progress">
      <div className="cv-ats-progress-heading">
        <div>
          <span>{isEn ? "Resume Completeness" : "Completitud del CV"}</span>
          <strong>{progress.percentage}%</strong>
        </div>
        <p>
          {isEn
            ? `${progress.completed} of ${progress.total} core sections complete · approx. ${progress.estimatedPages} ${progress.estimatedPages === 1 ? "page" : "pages"}`
            : `${progress.completed} de ${progress.total} secciones esenciales completas · aprox. ${progress.estimatedPages} ${progress.estimatedPages === 1 ? "página" : "páginas"}`}
        </p>
      </div>
      <div className="cv-ats-progress-track" role="progressbar" aria-label={isEn ? "Resume Completeness" : "Completitud del CV"} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress.percentage}>
        <span style={{ width: `${progress.percentage}%` }} />
      </div>
      {progress.pageWarning && <p className="cv-ats-page-warning">{progress.pageWarning}</p>}
    </div>
  );
}

function AtsScore({ isEn, analysis }) {
  return (
    <div className={`cv-ats-score cv-ats-score-${analysis.status.tone}`}>
      <div>
        <p className="cv-ats-score-label">{isEn ? "ATS Readiness Level" : "Nivel de preparación ATS"}</p>
        <p className="cv-ats-score-status">{analysis.status.label}</p>
        <p className="cv-ats-score-copy">{isEn ? "Local and explainable indicator; does not guarantee passing any specific company portal." : "Indicador local y explicable; no garantiza superar un sistema de selección específico."}</p>
      </div>
      <div className="cv-ats-score-value">
        <strong>{analysis.score}</strong>
        <span>/100</span>
      </div>
    </div>
  );
}

function AtsCategories({ categories }) {
  return (
    <div className="cv-ats-category-list">
      {categories.map((category) => (
        <article key={category.id} className="cv-ats-category">
          <div className="cv-ats-category-heading">
            <div>
              <h2>{category.label}</h2>
              <p>{category.detail}</p>
            </div>
            <strong>{category.score}/{category.maximum}</strong>
          </div>
          <div className="cv-ats-category-track" role="progressbar" aria-label={category.label} aria-valuemin="0" aria-valuemax={category.maximum} aria-valuenow={category.score}>
            <span style={{ width: `${(category.score / category.maximum) * 100}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}

function AtsRecommendations({ isEn, recommendations }) {
  if (!recommendations.length) return (
    <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
      <strong>{isEn ? "CV ready for final review." : "CV listo para revisión final."}</strong>
      <p className="mt-1 text-emerald-200/80">{isEn ? "Verify that all claims are accurate and tailored to the job opening." : "Verifica que todos los datos sean verdaderos y estén adaptados a la oferta."}</p>
    </div>
  );
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
      <h2 className="font-semibold text-white">{isEn ? "Recommended Actions" : "Acciones recomendadas"}</h2>
      <div className="mt-3 space-y-2">
        {recommendations.map((item, index) => (
          <div key={`${item.category}-${index}`} className={`cv-ats-recommendation is-${item.priority}`}>
            <span>{item.category}</span>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AtsEvidenceMap({ isEn, evidence }) {
  if (!evidence.length) return null;
  return (
    <section className="cv-ats-evidence">
      <div>
        <h2>{isEn ? "Keyword Evidence Map" : "Mapa de evidencia por palabra clave"}</h2>
        <p>{isEn ? "Shows where recruiters and parsers can locate each term from the posting." : "Muestra dónde puede encontrar el reclutador cada término de la oferta."}</p>
      </div>
      <div className="cv-ats-evidence-list">
        {evidence.map((item) => (
          <article key={item.keyword} className={item.locations.length ? "is-backed" : "is-missing"}>
            <strong>{item.keyword}</strong>
            {item.locations.length ? (
              <div>
                {item.locations.map((location) => <span key={location}>{location}</span>)}
              </div>
            ) : (
              <p>{isEn ? "No evidence in CV" : "Sin evidencia en el CV"}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function AtsQualityAudit({ isEn, unsupportedSkills, issues }) {
  if (!unsupportedSkills.length && !issues.length) return (
    <section className="cv-ats-quality is-clear">
      <strong>{isEn ? "Internal Consistency Verified" : "Coherencia interna verificada"}</strong>
      <p>{isEn ? "No unsupported skills, frequent spelling mistakes, or date gaps detected." : "No se detectaron habilidades aisladas, errores frecuentes ni fechas inconsistentes."}</p>
    </section>
  );
  return (
    <section className="cv-ats-quality">
      <div>
        <h2>{isEn ? "Consistency & Quality Audit" : "Coherencia y calidad"}</h2>
        <p>{isEn ? "Review these notes before downloading." : "Revisa estas observaciones antes de descargar."}</p>
      </div>
      {unsupportedSkills.length > 0 && (
        <div className="cv-ats-unsupported">
          <strong>{isEn ? "Skills without Contextual Evidence" : "Habilidades sin evidencia contextual"}</strong>
          <p>{isEn ? "Only mention them in experience or projects if you genuinely utilized them." : "Inclúyelas dentro de una experiencia o proyecto solo si realmente las utilizaste."}</p>
          <div>
            {unsupportedSkills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </div>
      )}
      {issues.length > 0 && (
        <div className="cv-ats-quality-issues">
          {issues.map((issue, index) => (
            <article key={`${issue.section}-${index}`}>
              <span>{issue.type === "date" ? (isEn ? "Date" : "Fecha") : (isEn ? "Spelling" : "Ortografía")}</span>
              <strong>{issue.section}</strong>
              <p>{issue.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function CvPreview({ isEn, cv, isDemo }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [zoom, setZoom] = useState(85);
  const [pageCount, setPageCount] = useState(1);
  const template = cv.template || "ats";

  useEffect(() => {
    const document = createCvPdf(cv);
    setPageCount(document.getNumberOfPages());
    const url = URL.createObjectURL(document.output("blob"));
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [cv]);

  if (template === "latex") {
    return (
      <article className={`cv-preview-sheet cv-page-${cv.pageFormat || "a4"} cv-template-latex text-slate-800 shadow-xl`}>
        <p className="cv-preview-source-label">{isEn ? "Source view · LaTeX" : "Vista de fuente · LaTeX"}</p>
        <pre>{createLatex(cv)}</pre>
      </article>
    );
  }

  return (
    <>
      <div className="cv-ats-preview-toolbar">
        <div>
          <div className="cv-ats-preview-heading">
            <h2>{isEn ? "Live Preview" : "Vista previa"}</h2>
            {isDemo && <span className="cv-ats-demo-badge">{isEn ? "Sample Demo" : "Ejemplo ficticio"}</span>}
          </div>
          <p>
            {isEn
              ? `${pageCount} ${pageCount === 1 ? "page" : "pages"} · ${cv.pageFormat === "letter" ? "US Letter" : "A4"}`
              : `${pageCount} ${pageCount === 1 ? "página real" : "páginas reales"} · ${cv.pageFormat === "letter" ? "US Letter" : "A4"}`}
          </p>
        </div>
        <div>
          <button onClick={() => setZoom((value) => Math.max(50, value - 10))} aria-label={isEn ? "Zoom out" : "Reducir zoom"}>−</button>
          <output aria-live="polite">{zoom}%</output>
          <button onClick={() => setZoom((value) => Math.min(150, value + 10))} aria-label={isEn ? "Zoom in" : "Aumentar zoom"}>+</button>
        </div>
      </div>
      <div className={`cv-pdf-preview cv-page-${cv.pageFormat || "a4"}`}>
        {previewUrl ? (
          <iframe key={`${previewUrl}-${zoom}`} title={isEn ? `Resume preview, ${pageCount} pages` : `Vista previa del CV, ${pageCount} páginas`} src={`${previewUrl}#toolbar=0&navpanes=0&zoom=${zoom}`} />
        ) : (
          <div className="cv-preview-loading">{isEn ? "Generating live preview…" : "Generando vista previa…"}</div>
        )}
      </div>
    </>
  );
}
