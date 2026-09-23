import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SEOHead from "../components/SEOHead";
import "../styles/cvAts.css";
import {
  CV_MODE_KEY, CV_STORAGE_KEY, EMPTY_CV, EXAMPLE_CV, analyzeAts, createCvPdf, createLatex, downloadText, evaluateCvProgress,
  exportCvPdf, normaliseCv, readLocalCv, toPortableCvb,
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

const STEPS = [
  ["job", "1", "Vacante"], ["personal", "2", "Perfil"], ["experience", "3", "Experiencia"],
  ["skills", "4", "Habilidades"], ["assistant", "5", "Asistente"], ["review", "6", "Revisión"], ["applications", "7", "Versiones"], ["export", "8", "Exportar"],
];

const STAGES = [
  { key: "objective", number: "1", label: "Objetivo", steps: ["job"] },
  { key: "content", number: "2", label: "Contenido", steps: ["personal", "experience", "skills"] },
  { key: "optimization", number: "3", label: "Optimización", steps: ["assistant", "review"] },
  { key: "download", number: "4", label: "Descargar", steps: ["applications", "export"] },
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
  const [cv, setCv] = useState(readLocalCv);
  const [isDemo, setIsDemo] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedMode = window.localStorage.getItem(CV_MODE_KEY);
    if (savedMode) return savedMode === "demo";
    return false;
  });
  const [activeStep, setActiveStep] = useState("job");
  const [notice, setNotice] = useState("Borrador local activo: este navegador es el único que conserva los cambios.");
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
    setNotice("Último cambio deshecho.");
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
    if (!window.confirm(`¿Eliminar ${label}? Esta acción puede deshacerse.`)) return;
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
    if (!window.confirm(`¿Eliminar la experiencia ${index + 1}? Esta acción puede deshacerse.`)) return;
    updateCv((current) => ({ ...current, experience: current.experience.filter((_, itemIndex) => itemIndex !== index) }));
  };
  const resetLocal = () => {
    if (!window.confirm("¿Borrar todo el borrador guardado en este navegador?")) return;
    setCv(EMPTY_CV);
    setIsDemo(false);
    history.current = [];
    window.localStorage.removeItem(CV_STORAGE_KEY);
    setNotice("Borrador local eliminado. No se eliminó ningún archivo de tu computador.");
    setActiveStep("job");
  };
  const importCv = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      updateCv(normaliseCv(JSON.parse(await file.text())));
      setIsDemo(false);
      setNotice(`Perfil importado: ${file.name}. Se guardó una copia local en este navegador.`);
    } catch {
      setNotice("No fue posible leer el archivo. Selecciona un .cvb o .json válido.");
    }
    event.target.value = "";
  };
  const exportProject = () => {
    if (isDemo && !window.confirm("Este proyecto contiene datos ficticios de demostración. ¿Deseas descargarlo igualmente como ejemplo?")) return;
    downloadText(`${safeFilename(cv.projectName)}.cvb`, JSON.stringify(toPortableCvb(cv), null, 2), "application/json;charset=utf-8");
    setNotice("Proyecto descargado. Guárdalo para abrirlo en otro navegador o en la app de escritorio.");
  };
  const guardExport = (action) => {
    if (isDemo && !window.confirm("Estás viendo un CV de demostración con información ficticia. ¿Deseas descargar este ejemplo?")) {
      setNotice("Exportación cancelada. Usa el ejemplo como plantilla o crea un CV desde cero.");
      return;
    }
    const errors = validateCvForExport(cv);
    setExportErrors(errors);
    if (errors.length) {
      setActiveStep("export");
      setNotice("Corrige los campos obligatorios antes de exportar.");
      return;
    }
    action();
  };
  const exportPdf = () => guardExport(() => { createCvPdf(cv).save(`${safeFilename(cv.projectName)}.pdf`); trackLocalEvent("pdf_exported"); });
  const exportLatex = () => guardExport(() => { downloadText(`${safeFilename(cv.projectName)}.tex`, createLatex(cv)); trackLocalEvent("latex_exported"); });
  const exportDocx = () => guardExport(async () => { downloadBlob(`${safeFilename(cv.projectName)}.docx`, await createCvDocxBlob(cv)); trackLocalEvent("docx_exported"); });
  const importResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setNotice(`Analizando ${file.name} localmente…`);
      setImportReview(await importResumeFile(file));
      setNotice("Revisa los datos detectados antes de incorporarlos.");
    } catch {
      setNotice("No fue posible extraer texto del archivo. Comprueba que sea un PDF con texto o un DOCX válido.");
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
    setNotice("Datos importados. Revisa cada sección antes de exportar.");
  };

  const openOnboarding = (intent) => setOnboarding({ intent, title: cv.targetJob?.title || "", experienceLevel: "mid", country: "Chile" });

  const loadExampleCv = () => {
    updateCv(normaliseCv(EXAMPLE_CV));
    setIsDemo(true);
    setActiveStep("job");
    setNotice("CV ficticio cargado. Explora sus datos o úsalo como referencia antes de crear el tuyo.");
    window.scrollTo({ top: document.querySelector(".cv-ats-workspace")?.offsetTop || 0, behavior: "smooth" });
  };

  const completeOnboarding = () => {
    const profile = { title: onboarding.title.trim(), experienceLevel: onboarding.experienceLevel, country: onboarding.country };
    window.localStorage.setItem(ONBOARDING_KEY, JSON.stringify(profile));
    if (onboarding.intent === "template") {
      updateCv(normaliseCv({ ...EXAMPLE_CV, locale: { country: profile.country, language: "es" }, pageFormat: profile.country === "Estados Unidos" ? "letter" : "a4", targetJob: { ...EXAMPLE_CV.targetJob, title: profile.title || EXAMPLE_CV.targetJob.title } }));
      setActiveStep("personal");
      setNotice("Plantilla activada. Reemplaza todos los datos ficticios por tu información real.");
    } else {
      updateCv(normaliseCv({ ...EMPTY_CV, locale: { country: profile.country, language: "es" }, pageFormat: profile.country === "Estados Unidos" ? "letter" : "a4", targetJob: { ...EMPTY_CV.targetJob, title: profile.title } }));
      setActiveStep("job");
      setNotice("Nuevo CV iniciado. Tus cambios se guardarán localmente en este navegador.");
    }
    setIsDemo(false);
    trackLocalEvent("cv_started");
    const shouldImport = onboarding.intent === "import";
    setOnboarding(null);
    if (shouldImport) window.setTimeout(() => resumeInput.current?.click(), 0);
  };

  const currentStageIndex = Math.max(0, STAGES.findIndex((stage) => stage.steps.includes(activeStep)));
  const currentStage = STAGES[currentStageIndex];
  const navigateStage = (direction) => {
    const nextIndex = Math.max(0, Math.min(STAGES.length - 1, currentStageIndex + direction));
    setActiveStep(STAGES[nextIndex].steps[0]);
  };

  const duplicateCv = () => {
    setWorkspace((current) => {
      const result = createDraftCopy(current, cv);
      updateCv(result.copy);
      return result.workspace;
    });
    setNotice("CV duplicado. El original quedó disponible en Versiones.");
  };

  const shareTool = async () => {
    const shareData = { title: "Creador de CV ATS gratis", text: "Crea, adapta y descarga un CV compatible con ATS directamente en tu navegador.", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(window.location.href); setNotice("Enlace copiado. Ya puedes compartir la herramienta."); }
      trackLocalEvent("tool_shared");
    } catch (error) {
      if (error?.name !== "AbortError") setNotice("No fue posible compartir automáticamente. Copia la URL del navegador.");
    }
  };

  const chooseAnalytics = (value) => {
    setAnalyticsConsent(value);
    setAnalyticsConsentState(value);
    if (value === "accepted") trackLocalEvent("consent_accepted");
  };

  const deleteAllLocalData = () => {
    if (!window.confirm("¿Eliminar todos los CV, copias, postulaciones, cartas, preferencias y métricas guardadas en este navegador? Esta acción no se puede deshacer.")) return;
    [CV_STORAGE_KEY, CV_WORKSPACE_KEY, CV_MODE_KEY, ONBOARDING_KEY, "atelijudesign.cv-ats-command-center.v1", "atelijudesign.cv-ats-mode.v1", "atelijudesign.cv-ats-workspace.v1", "atelijudesign.cv-ats-onboarding.v1", "atelijudesign.cv-ats-analytics.v1", "atelijudesign.cv-ats-analytics-consent.v1"].forEach((key) => window.localStorage.removeItem(key));
    clearLocalAnalytics();
    setCv(normaliseCv(EMPTY_CV));
    setWorkspace(EMPTY_WORKSPACE);
    setIsDemo(false);
    setAnalyticsConsentState("unknown");
    history.current = [];
    setActiveStep("job");
    setNotice("Todos los datos locales de la herramienta fueron eliminados.");
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
      <section className="space-y-5"><div><h1 className="text-2xl font-bold text-white">Perfil profesional</h1><p className="mt-1 text-sm text-slate-400">Información de contacto esencial para un CV ATS; no se admiten fotografías.</p></div>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Nombre" value={cv.personal.name} onChange={(value) => updatePersonal("name", value)} placeholder="Nombre completo" /><Field label="Cargo / título" value={cv.personal.title} onChange={(value) => updatePersonal("title", value)} placeholder="Proyectista Estructural Senior" /><Field label="Email" type="email" value={cv.personal.email} onChange={(value) => updatePersonal("email", value)} placeholder="nombre@email.com" /><Field label="Teléfono" value={cv.personal.phone} onChange={(value) => updatePersonal("phone", value)} placeholder="+56 9…" /><Field label="Ubicación" value={cv.personal.location} onChange={(value) => updatePersonal("location", value)} placeholder="Santiago, Chile" /><Field label="LinkedIn" value={cv.personal.linkedin} onChange={(value) => updatePersonal("linkedin", value)} placeholder="linkedin.com/in/…" /></div>
        <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Resumen orientado a resultados</span><textarea value={cv.summary} onChange={(event) => updateCv((current) => ({ ...current, summary: event.target.value }))} rows="7" placeholder="Describe especialidad, experiencia relevante y resultados medibles." className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" /></label>
        <ProfileExtrasEditor cv={cv} updateItem={updateCollectionItem} addItem={addCollectionItem} duplicateItem={duplicateCollectionItem} removeItem={removeCollectionItem} moveItem={moveItem} />
      </section>
    );
    if (activeStep === "job") return (
      <section className="space-y-5"><div><h1 className="text-2xl font-bold text-white">Analiza la oferta de trabajo</h1><p className="mt-1 text-sm text-slate-400">El texto se analiza solo en tu navegador; no se envía a ningún servicio.</p></div>
        <Field label="Cargo objetivo" value={cv.targetJob.title} onChange={(value) => updateJob("title", value)} placeholder="Proyectista Estructural Senior" />
        <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Descripción de la oferta</span><textarea value={cv.targetJob.description} onChange={(event) => updateJob("description", event.target.value)} rows="12" placeholder="Pega aquí los requisitos, responsabilidades y tecnologías solicitadas…" className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm leading-relaxed text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" /></label>
        <KeywordBlock title="Palabras clave identificadas" terms={analysis.keywords} empty="Pega una oferta para identificar sus términos técnicos." tone="cyan" />
      </section>
    );
    if (activeStep === "experience") return (
      <section className="space-y-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-bold text-white">Experiencia profesional</h1><p className="mt-1 text-sm text-slate-400">Un logro verificable por línea mejora la lectura del reclutador y del ATS.</p></div><button onClick={() => updateCv((current) => ({ ...current, experience: [...current.experience, emptyExperience()] }))} className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/20">+ Añadir experiencia</button></div>
        {!cv.experience.length && <EmptyState text="Aún no has añadido experiencia. Agrega cada cargo relevante para la vacante." />}
        {cv.experience.map((entry, index) => <article key={`experience-${index}`} className="space-y-4 rounded-xl border border-slate-700 bg-slate-900/60 p-4"><div className="flex flex-wrap justify-between gap-3"><h2 className="font-semibold text-slate-200">Experiencia {index + 1}</h2><div className="cv-ats-card-actions"><button disabled={index === 0} onClick={() => moveItem("experience", index, -1)} aria-label="Mover experiencia hacia arriba">↑</button><button disabled={index === cv.experience.length - 1} onClick={() => moveItem("experience", index, 1)} aria-label="Mover experiencia hacia abajo">↓</button><button onClick={() => duplicateExperience(index)}>Duplicar</button><button onClick={() => removeExperience(index)} className="is-danger">Eliminar</button></div></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Cargo" value={entry.position || ""} onChange={(value) => updateExperience(index, "position", value)} /><Field label="Empresa" value={entry.company || ""} onChange={(value) => updateExperience(index, "company", value)} /><DateField label="Inicio" value={entry.start_date || ""} onChange={(value) => updateExperience(index, "start_date", value)} /><DateField label="Fin" value={entry.end_date || ""} disabled={entry.current === true} onChange={(value) => updateExperience(index, "end_date", value)} /></div><label className="cv-ats-current"><input type="checkbox" checked={entry.current === true} onChange={(event) => updateCv((current) => ({ ...current, experience: current.experience.map((item, itemIndex) => itemIndex === index ? { ...item, current: event.target.checked, end_date: event.target.checked ? "Actualidad" : "" } : item) }))} /> Actualmente trabajo aquí</label><label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Logros y responsabilidades</span><textarea value={entry.description || ""} onChange={(event) => updateExperience(index, "description", event.target.value)} rows="5" placeholder="• Coordiné…&#10;• Reduje…" className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" /></label></article>)}
      </section>
    );
    if (activeStep === "skills") return (
      <section className="space-y-5"><div><h1 className="text-2xl font-bold text-white">Habilidades relevantes</h1><p className="mt-1 text-sm text-slate-400">Una habilidad por línea. Prioriza las que realmente dominas y que aparecen en la vacante.</p></div>
        <textarea value={cv.skills.map((skill) => skill.name || skill).join("\n")} onChange={(event) => updateCv((current) => ({ ...current, skills: event.target.value.split("\n").map((name) => name.trim()).filter(Boolean).map((name) => ({ name, level: 3, category: "" })) }))} rows="13" placeholder="Revit Structures&#10;Tekla Structures&#10;Navisworks Manage" className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 font-mono text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
        <KeywordBlock title="Coincidencias actuales" terms={analysis.matched} empty="Agrega una vacante para comparar habilidades." tone="emerald" />
      </section>
    );
    if (activeStep === "assistant") return <AssistantPanel cv={cv} insights={assistant} updateCv={updateCv} setNotice={setNotice} />;
    if (activeStep === "review") return (
      <section className="space-y-5"><div><h1 className="text-2xl font-bold text-white">Revisión ATS</h1><p className="mt-1 text-sm text-slate-400">Una guía de redacción: incorpora solo términos que representen experiencia real.</p></div>
        <AtsScore analysis={analysis} />
        <AtsCategories categories={analysis.categories} />
        <AtsRecommendations recommendations={analysis.recommendations} />
        <AtsEvidenceMap evidence={analysis.evidence} />
        <AtsQualityAudit unsupportedSkills={analysis.unsupportedSkills} issues={analysis.qualityIssues} />
        {analysis.keywords.length ? <><KeywordBlock title="Términos presentes en tu CV" terms={analysis.matched} empty="Aún no se detectan coincidencias." tone="emerald" /><KeywordBlock title="Términos por revisar" terms={analysis.missing} empty="No hay términos pendientes en el conjunto analizado." tone="amber" /></> : <EmptyState text="Pega la descripción de la vacante para activar la comparación de palabras clave." />}
      </section>
    );
    if (activeStep === "applications") return progress.completed < 3 && !workspace.applications.length ? <ApplicationsLocked onContinue={() => setActiveStep("personal")} /> : <><ApplicationsWorkspaceClean cv={cv} workspace={workspace} setWorkspace={setWorkspace} updateCv={updateCv} activeApplicationId={activeApplicationId} setActiveApplicationId={setActiveApplicationId} setNotice={setNotice} /><ApplicationFollowUp cv={cv} workspace={workspace} setWorkspace={setWorkspace} setNotice={setNotice} /></>;
    return (
      <section className="space-y-5"><div><h1 className="text-2xl font-bold text-white">Exporta y conserva tu proyecto</h1><p className="mt-1 text-sm text-slate-400">Tus datos quedan en este navegador hasta que los descargues o borres.</p></div>
        {exportErrors.length > 0 && <ExportValidation errors={exportErrors} onNavigate={setActiveStep} />}
        <ExportSettings cv={cv} updateCv={updateCv} />
        <div className="grid gap-3 sm:grid-cols-2"><ActionButton title="Descargar PDF" detail="Documento final con el diseño seleccionado." onClick={exportPdf} /><ActionButton title="Descargar DOCX" detail="Documento editable con secciones compatibles con ATS." onClick={exportDocx} /><ActionButton title="Importar CV existente" detail="Extrae texto desde PDF o DOCX para revisarlo." onClick={() => resumeInput.current?.click()} /><ActionButton title="Guardar proyecto" detail="Archivo .cvb para continuar después." onClick={exportProject} /><ActionButton title="Importar proyecto" detail="Compatible con archivos .cvb de escritorio." onClick={() => fileInput.current?.click()} /></div>
        <details className="cv-ats-advanced-export"><summary>Opciones avanzadas</summary><p>LaTeX está dirigido a usuarios técnicos que desean editar el código fuente.</p><button onClick={exportLatex}>Descargar código LaTeX</button></details>
        <PlainTextPreview text={createPlainTextCv(cv)} />
        <button onClick={resetLocal} className="text-sm font-semibold text-rose-300 hover:text-rose-200">Borrar solo el borrador de este navegador</button>
      </section>
    );
  };

  return <div className="cv-ats-page min-h-screen bg-[#07111d] pt-24 text-slate-100"><SEOHead title="Creador de CV ATS gratis | Adapta y descarga tu CV" description="Crea un CV compatible con ATS, compáralo con una oferta y descárgalo en PDF o DOCX. Funciona localmente en tu navegador." path="/herramientas/cv-ats" />
    <div className="mx-auto max-w-[1640px] px-4 pb-14 sm:px-6"><div className="cv-ats-hero"><div><p>Herramienta gratuita · privacidad local</p><h1>Crea tu <span>CV ATS</span> en minutos</h1><p className="cv-ats-hero-copy">Adapta tu CV a una oferta, encuentra palabras clave, mejora tus logros y descarga un documento profesional sin subir datos personales.</p><div className="cv-ats-hero-actions"><button onClick={() => openOnboarding("blank")}>Crear mi CV ATS gratis</button><button onClick={loadExampleCv}>Cargar CV de ejemplo</button><button onClick={shareTool}>Compartir herramienta</button></div></div><div className="cv-ats-notice" aria-live="polite">{notice}</div></div>
      {isDemo && <section className="cv-ats-demo-banner" aria-label="CV de demostración"><div><span>Ejemplo interactivo</span><h2>Mira un CV completo antes de crear el tuyo</h2><p>Todos los datos de Valentina Rojas son ficticios. Puedes explorar el resultado sin riesgo.</p></div><div className="cv-ats-demo-actions"><button onClick={() => openOnboarding("blank")}>Empezar desde cero</button><button onClick={() => openOnboarding("template")} className="is-primary">Usar este ejemplo</button><button onClick={() => openOnboarding("import")}>Mejorar mi CV actual</button></div></section>}
      <section className="cv-ats-benefits" aria-label="Beneficios principales"><article><strong>1</strong><div><h2>Pega la oferta</h2><p>Identifica requisitos y palabras clave.</p></div></article><article><strong>2</strong><div><h2>Mejora el contenido</h2><p>Convierte tareas en logros verificables.</p></div></article><article><strong>3</strong><div><h2>Descarga y postula</h2><p>Exporta en PDF o DOCX.</p></div></article></section>
      <details className="cv-ats-ats-explainer"><summary>¿Qué es un ATS y por qué puede afectar tu postulación?</summary><p>Un ATS es un sistema que organiza y filtra postulaciones. Una estructura clara, datos reconocibles y palabras relacionadas con la oferta facilitan la lectura automática. Esta herramienta ayuda a preparar el CV, pero no garantiza una entrevista ni reemplaza la revisión humana.</p></details>
      {onboarding && <OnboardingPanel value={onboarding} onChange={setOnboarding} onCancel={() => setOnboarding(null)} onComplete={completeOnboarding} />}
      <ProgressPanel progress={progress} /><div className="cv-ats-project-bar"><label><span>Nombre del CV</span><input value={cv.projectName || ""} onChange={(event) => updateCv((current) => ({ ...current, projectName: event.target.value }))} placeholder="Mi CV ATS" aria-label="Nombre del CV" /></label><p aria-live="polite">{lastSavedAt ? `Guardado automáticamente a las ${lastSavedAt.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}` : "Preparando guardado local…"}</p><button onClick={duplicateCv}>Duplicar CV</button></div><div className="cv-ats-quick-actions"><span className="cv-ats-project-label">Acciones</span><div className="cv-ats-action-buttons"><button title="Deshacer el último cambio" onClick={undo} disabled={!history.current.length} className="cv-ats-action-button cv-ats-action-secondary">Deshacer</button><button title="Importar un CV PDF o DOCX" onClick={() => resumeInput.current?.click()} className="cv-ats-action-button cv-ats-action-secondary">Importar CV</button><button title="Importar un proyecto CVB o JSON" onClick={() => fileInput.current?.click()} className="cv-ats-action-button cv-ats-action-secondary">Importar proyecto</button><button title="Guardar el proyecto para abrirlo después" onClick={exportProject} className="cv-ats-action-button cv-ats-action-secondary">Guardar</button><button title="Exportar el CV como PDF" onClick={exportPdf} className="cv-ats-action-button cv-ats-action-primary">PDF</button><button title="Exportar el CV como DOCX" onClick={exportDocx} className="cv-ats-action-button cv-ats-action-secondary">DOCX</button><button title="Exportar el código fuente LaTeX" onClick={exportLatex} className="cv-ats-action-button cv-ats-action-secondary">LaTeX</button><label className="cv-ats-template">Plantilla<select value={cv.template} onChange={(event) => updateCv((current) => ({ ...current, template: event.target.value }))}><option value="ats">ATS · una columna</option><option value="executive">Executive · header oscuro</option><option value="minimal">Minimal · limpio</option><option value="technical">Technical · sidebar</option><option value="latex">LaTeX · fuente</option></select></label><label className="cv-ats-page-format">Hoja<select value={cv.pageFormat} onChange={(event) => updateCv((current) => ({ ...current, pageFormat: event.target.value }))}><option value="a4">A4</option><option value="letter">US Letter</option></select></label></div></div>
      {workspace.drafts?.length > 0 && <div className="cv-ats-saved-copies"><span>Copias locales</span><select defaultValue="" aria-label="Abrir una copia guardada" onChange={(event) => { const draft = workspace.drafts.find((item) => item.id === event.target.value); if (draft) { updateCv(draft.cv); setNotice(`Copia abierta: ${draft.name}.`); } event.target.value = ""; }}><option value="">Selecciona una copia…</option>{workspace.drafts.map((draft) => <option key={draft.id} value={draft.id}>{draft.name}</option>)}</select></div>}
      <input ref={fileInput} onChange={importCv} type="file" accept=".cvb,.json,application/json" className="hidden" />
      <input ref={resumeInput} onChange={importResume} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" />
      {importReview && <ImportReview draft={importReview} onChange={setImportReview} onCancel={() => setImportReview(null)} onApply={applyImportedResume} />}
      <div className="cv-ats-workspace overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-2xl shadow-black/30"><div className="cv-ats-layout"><aside className="cv-ats-sidebar bg-slate-950/70 p-4" aria-label="Etapas del CV">{STAGES.map((stage, index) => { const isActive = stage.key === currentStage.key; const isComplete = index < currentStageIndex; return <button key={stage.key} onClick={() => setActiveStep(stage.steps[0])} className={`cv-ats-step mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${isActive ? "is-active" : ""}`}><span className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-bold ${isComplete ? "is-complete" : ""} ${isActive ? "border-cyan-300 bg-cyan-400 text-slate-950" : "border-slate-600"}`}>{isComplete ? "✓" : stage.number}</span><span className="font-semibold">{stage.label}</span></button>; })}<button onClick={loadExampleCv} className="cv-ats-load-example">Cargar CV de ejemplo</button><div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs leading-relaxed text-slate-400"><strong className="text-cyan-300">Privacidad</strong><br />La oferta y el CV se analizan localmente. No hay fotos ni subida automática de archivos.</div></aside>
        <main className="cv-ats-editor min-w-0 p-5 sm:p-7"><div className="cv-ats-substeps" aria-label={`Secciones de ${currentStage.label}`}>{currentStage.steps.map((step) => { const config = STEPS.find(([key]) => key === step); return <button key={step} onClick={() => setActiveStep(step)} className={activeStep === step ? "is-active" : ""}>{config[2]}</button>; })}</div>{renderEditor()}<div className="mt-8 flex items-center justify-between border-t border-slate-700 pt-5"><button onClick={() => navigateStage(-1)} disabled={currentStageIndex === 0} className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-40">← Etapa anterior</button><button onClick={() => navigateStage(1)} disabled={currentStageIndex === STAGES.length - 1} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40">Siguiente etapa →</button></div></main>
        <aside className="cv-ats-preview bg-slate-950/40 p-5 sm:p-7"><CvPreview cv={cv} isDemo={isDemo} /></aside>
      </div></div>{analyticsConsent === "unknown" && <AnalyticsConsent onChoose={chooseAnalytics} />}<TrustCenter consent={analyticsConsent} analytics={readLocalAnalytics()} onConsentChange={chooseAnalytics} onDeleteAll={deleteAllLocalData} /></div></div>;
}

function AnalyticsConsent({ onChoose }) {
  return <section className="cv-ats-consent" role="region" aria-label="Preferencias de métricas"><div><strong>Métricas locales opcionales</strong><p>¿Permites contar eventos como CV iniciado, completado o exportado? No registramos nombres, contenido, empresas, correos ni archivos; los contadores permanecen en este navegador.</p></div><div><button onClick={() => onChoose("declined")}>No permitir</button><button onClick={() => onChoose("accepted")} className="is-primary">Permitir métricas locales</button></div></section>;
}

const ATS_FAQ = [
  ["¿La herramienta envía mi CV a un servidor?", "No. El análisis, la vista previa y el guardado funcionan localmente en este navegador."],
  ["¿Un resultado alto garantiza superar cualquier ATS?", "No. Es una guía de preparación. Cada empresa configura sus propios filtros, formatos y criterios."],
  ["¿Debo copiar todas las palabras de la oferta?", "No. Incluye únicamente términos que describan experiencia, conocimientos o resultados reales."],
  ["¿Qué plantilla es más segura?", "ATS y Minimal usan estructura lineal. Las plantillas visuales pueden ser adecuadas para envío directo, pero conviene verificar el sistema de destino."],
  ["¿Cuántas páginas debería tener?", "Generalmente una o dos páginas, priorizando información reciente y relevante. La vista previa muestra el número real."],
];

function TrustCenter({ consent, analytics, onConsentChange, onDeleteAll }) {
  const events = analytics.events || {};
  return <section className="cv-ats-trust"><div className="cv-ats-trust-heading"><div><span>Privacidad y confianza</span><h2>Tus datos profesionales permanecen bajo tu control</h2><p>No existe subida automática del CV, la oferta o tus datos personales.</p></div><button onClick={onDeleteAll}>Eliminar todos mis datos locales</button></div><div className="cv-ats-trust-grid"><article><h3>Almacenamiento</h3><p>CV, copias, postulaciones, cartas y preferencias se guardan únicamente mediante `localStorage` en este navegador.</p></article><article><h3>Métricas</h3><p>{consent === "accepted" ? "Consentimiento activo. Solo se cuentan nombres de eventos; nunca contenido personal." : "Métricas desactivadas. No se conserva ningún contador de uso."}</p><button onClick={() => onConsentChange(consent === "accepted" ? "declined" : "accepted")}>{consent === "accepted" ? "Desactivar métricas" : "Activar métricas locales"}</button></article><article><h3>Contadores locales</h3><ul><li>CV iniciados: {events.cv_started?.count || 0}</li><li>CV completados: {events.cv_completed?.count || 0}</li><li>PDF exportados: {events.pdf_exported?.count || 0}</li><li>DOCX exportados: {events.docx_exported?.count || 0}</li></ul></article></div><div className="cv-ats-faq"><h2>Preguntas frecuentes y consejos ATS</h2>{ATS_FAQ.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>;
}

function OnboardingPanel({ value, onChange, onCancel, onComplete }) {
  const intentLabels = { blank: "Crear un CV desde cero", template: "Personalizar el ejemplo", import: "Importar y mejorar mi CV" };
  return <section className="cv-ats-onboarding" aria-labelledby="cv-onboarding-title">
    <div className="cv-ats-onboarding-heading"><div><span>Configuración inicial</span><h2 id="cv-onboarding-title">Cuéntanos qué CV quieres crear</h2><p>Usaremos estas preferencias para preparar tu espacio de trabajo. Todo permanece en este navegador.</p></div><button onClick={onCancel} aria-label="Cerrar configuración">×</button></div>
    <div className="cv-ats-onboarding-intent"><strong>Ruta seleccionada</strong><span>{intentLabels[value.intent]}</span></div>
    <div className="cv-ats-onboarding-grid">
      <Field label="Cargo objetivo" value={value.title} onChange={(title) => onChange((current) => ({ ...current, title }))} placeholder="Ej. Analista de datos" />
      <label><span>Nivel de experiencia</span><select value={value.experienceLevel} onChange={(event) => onChange((current) => ({ ...current, experienceLevel: event.target.value }))}><option value="first">Primer empleo</option><option value="junior">Junior · hasta 2 años</option><option value="mid">Intermedio · 3 a 6 años</option><option value="senior">Senior · más de 6 años</option><option value="executive">Liderazgo / ejecutivo</option></select></label>
      <label><span>País o mercado</span><select value={value.country} onChange={(event) => onChange((current) => ({ ...current, country: event.target.value }))}><option>Chile</option><option>Argentina</option><option>Colombia</option><option>España</option><option>México</option><option>Perú</option><option>Estados Unidos</option><option>Otro</option></select></label>
    </div>
    <div className="cv-ats-onboarding-footer"><p><strong>Privacidad:</strong> no enviamos tu CV ni la oferta de trabajo a servidores externos.</p><div><button onClick={onCancel}>Volver al ejemplo</button><button onClick={onComplete} className="is-primary">Continuar</button></div></div>
  </section>;
}

const PROFILE_SECTIONS = [
  { key: "education", title: "Educación", addLabel: "Añadir formación", empty: "Añade estudios relevantes para el cargo.", fields: [{ key: "degree", label: "Título o programa", placeholder: "Ingeniería en Construcción" }, { key: "institution", label: "Institución", placeholder: "Universidad o instituto" }, { key: "start_date", label: "Inicio", type: "month" }, { key: "end_date", label: "Fin", type: "month" }] },
  { key: "certifications", title: "Certificaciones", addLabel: "Añadir certificación", empty: "Agrega certificaciones vigentes y relacionadas con la vacante.", fields: [{ key: "name", label: "Certificación", placeholder: "Nombre de la certificación" }, { key: "issuer", label: "Entidad emisora", placeholder: "Entidad" }, { key: "date", label: "Fecha", type: "month" }, { key: "credential", label: "Credencial o URL", placeholder: "ID o enlace verificable" }] },
  { key: "languages", title: "Idiomas", addLabel: "Añadir idioma", empty: "Indica idiomas y niveles que puedas demostrar.", fields: [{ key: "name", label: "Idioma", placeholder: "Inglés" }, { key: "level", label: "Nivel", type: "select", options: ["Básico", "A1", "A2", "B1 Intermedio", "B2 Intermedio alto", "C1 Avanzado", "C2 Competente", "Nativo"] }] },
  { key: "projects", title: "Proyectos destacados", addLabel: "Añadir proyecto", empty: "Incluye proyectos que demuestren experiencia relevante.", fields: [{ key: "name", label: "Nombre", placeholder: "Proyecto destacado" }, { key: "date", label: "Fecha", type: "month" }, { key: "url", label: "Enlace", placeholder: "https://…" }, { key: "description", label: "Descripción y resultados", placeholder: "Explica tu aporte y el resultado obtenido.", type: "textarea", wide: true }] },
];

function ProfileExtrasEditor({ cv, updateItem, addItem, duplicateItem, removeItem, moveItem }) {
  return <div className="cv-ats-profile-sections"><div><h2>Formación y antecedentes adicionales</h2><p>Completa cada dato en su campo. Solo agrega información relevante y verificable.</p></div>{PROFILE_SECTIONS.map((section) => <StructuredCollection key={section.key} section={section} items={cv[section.key] || []} updateItem={updateItem} addItem={addItem} duplicateItem={duplicateItem} removeItem={removeItem} moveItem={moveItem} />)}</div>;
}

function StructuredCollection({ section, items, updateItem, addItem, duplicateItem, removeItem, moveItem }) {
  return <section className="cv-ats-collection"><div className="cv-ats-collection-heading flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-base font-bold text-slate-200">{section.title}</h3><span className="text-xs text-slate-400">{items.length} {items.length === 1 ? "entrada" : "entradas"}</span></div><button onClick={() => addItem(section.key)} className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/20">+ {section.addLabel}</button></div>
    {!items.length && <EmptyState text={section.empty} />}
    {items.map((item, index) => <article key={`${section.key}-${index}`} className="cv-ats-collection-card"><div className="cv-ats-collection-card-heading flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3"><strong className="min-w-0 flex-1 truncate font-semibold text-slate-200">{item[section.fields[0].key] || `${section.title} ${index + 1}`}</strong><div className="cv-ats-card-actions flex flex-wrap items-center gap-1.5 flex-shrink-0"><button disabled={index === 0} onClick={() => moveItem(section.key, index, -1)} aria-label={`Mover ${section.title} hacia arriba`}>↑</button><button disabled={index === items.length - 1} onClick={() => moveItem(section.key, index, 1)} aria-label={`Mover ${section.title} hacia abajo`}>↓</button><button onClick={() => duplicateItem(section.key, index)}>Duplicar</button><button onClick={() => removeItem(section.key, index, `${section.title.toLowerCase()} ${index + 1}`)} className="is-danger">Eliminar</button></div></div><div className="cv-ats-collection-grid mt-3 grid gap-3 sm:grid-cols-2">{section.fields.map((field) => <StructuredField key={field.key} field={field} value={item[field.key] || ""} onChange={(value) => updateItem(section.key, index, field.key, value)} />)}</div></article>)}
  </section>;
}

function StructuredField({ field, value, onChange }) {
  if (field.type === "textarea") return <label className={`block min-w-0 ${field.wide ? "is-wide col-span-full" : ""}`}><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{field.label}</span><textarea rows="3" value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder || ""} className="w-full min-w-0 max-w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 box-border" /></label>;
  if (field.type === "select") return <label className={`block min-w-0 ${field.wide ? "is-wide col-span-full" : ""}`}><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{field.label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full min-w-0 max-w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 box-border"><option value="">Selecciona un nivel</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select></label>;
  return <label className={`block min-w-0 ${field.wide ? "is-wide col-span-full" : ""}`}><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{field.label}</span><input type={field.type || "text"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder || ""} className="w-full min-w-0 max-w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 box-border" /></label>;
}

function KeywordBlock({ title, terms, empty, tone }) {
  const colors = { cyan: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200", emerald: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200", amber: "border-amber-400/40 bg-amber-400/10 text-amber-100" };
  return <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h2 className="font-semibold text-white">{title}</h2>{terms.length ? <div className="mt-3 flex flex-wrap gap-2">{terms.map((term) => <span key={term} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${colors[tone]}`}>{term}</span>)}</div> : <p className="mt-2 text-sm text-slate-500">{empty}</p>}</div>;
}

function EmptyState({ text }) { return <div className="rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-500">{text}</div>; }
function ActionButton({ title, detail, onClick }) { return <button onClick={onClick} className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-cyan-400/60 hover:bg-slate-800"><span className="block font-bold text-white">{title}</span><span className="mt-1 block text-xs leading-relaxed text-slate-400">{detail}</span></button>; }

function AssistantPanel({ cv, insights, updateCv, setNotice }) {
  const addConfirmedSkill = (concept) => {
    const exists = cv.skills.some((skill) => (skill.name || skill).toLocaleLowerCase("es-CL") === concept.canonical.toLocaleLowerCase("es-CL"));
    if (exists) return;
    updateCv((current) => ({ ...current, skills: [...current.skills, { name: concept.canonical, level: 3, category: concept.category }] }));
    setNotice(`${concept.canonical} añadido tras tu confirmación.`);
  };
  const applySummary = (text) => {
    if (cv.summary && !window.confirm("¿Reemplazar el resumen actual por este borrador basado en tus datos?")) return;
    updateCv((current) => ({ ...current, summary: text }));
    setNotice("Borrador aplicado. Revísalo y ajusta cualquier afirmación antes de exportar.");
  };
  const required = insights.semantic.required;
  const desirable = insights.semantic.desirable;
  return <section className="space-y-5"><div><h1 className="text-2xl font-bold text-white">Asistente profesional de contenido</h1><p className="mt-1 text-sm text-slate-400">Interpreta cualquier oferta localmente y propone mejoras basadas solo en la información que ya proporcionaste.</p></div><div className="cv-ats-ai-guardrail"><strong>Control de veracidad</strong><p>Las sugerencias son borradores. La aplicación nunca inventa experiencia, cifras ni habilidades: tú confirmas cada cambio.</p></div><div className="cv-ats-requirements"><RequirementColumn title="Requisitos obligatorios" items={required} empty="No se detectaron marcadores obligatorios explícitos." tone="required" /><RequirementColumn title="Requisitos deseables" items={desirable} empty="No se detectaron requisitos deseables explícitos." tone="desirable" /></div><div className="cv-ats-semantic"><div><h2>Equivalencias profesionales</h2><p>Reconoce herramientas y competencias aunque la oferta y tu CV usen nombres diferentes.</p></div>{insights.semantic.concepts.length ? <div className="cv-ats-semantic-list">{insights.semantic.concepts.map((concept) => <article key={concept.canonical} className={concept.matched ? "is-matched" : "is-missing"}><div><span>{concept.category}</span><strong>{concept.canonical}</strong><p>{concept.matched ? `Coincidencia mediante “${concept.matchedAlias}”` : "No detectado en tu CV"}</p></div>{!concept.matched && <button onClick={() => addConfirmedSkill(concept)}>Confirmo que lo domino · añadir</button>}</article>)}</div> : <EmptyState text="Pega una oferta con herramientas o competencias para analizar equivalencias." />}</div><div className="cv-ats-summary-assistant"><div><h2>Variantes del perfil profesional</h2><p>Elige un enfoque construido exclusivamente desde tu cargo y habilidades registradas.</p></div>{insights.summaryVariants.length ? <div className="cv-ats-summary-variants">{insights.summaryVariants.map((variant) => <article key={variant.id}><span>{variant.label}</span><blockquote>{variant.text}</blockquote><button onClick={() => applySummary(variant.text)}>{cv.summary ? "Usar y reemplazar resumen" : "Usar como resumen"}</button></article>)}</div> : <EmptyState text="Añade un cargo y habilidades para generar borradores fundamentados." />}</div><WritingIssues issues={insights.writingIssues} /><div className="cv-ats-achievement-coach"><div><h2>Entrenador de logros STAR/CAR</h2><p>Completa datos reales y la herramienta los ordenará sin crear cifras por ti.</p></div>{insights.achievements.length ? insights.achievements.map((achievement) => <article key={achievement.index}><div><strong>{achievement.label}</strong><span className={achievement.hasActionVerb ? "is-ok" : "is-pending"}>{achievement.hasActionVerb ? "Verbo ✓" : "Falta verbo"}</span><span className={achievement.hasMetric ? "is-ok" : "is-pending"}>{achievement.hasMetric ? "Métrica ✓" : "Falta métrica"}</span></div>{achievement.prompts.map((prompt) => <p key={prompt}>• {prompt}</p>)}<AchievementBuilder index={achievement.index} currentText={cv.experience[achievement.index]?.description || ""} updateCv={updateCv} setNotice={setNotice} /></article>) : <EmptyState text="Añade experiencias para recibir orientación de redacción." />}</div></section>;
}

function WritingIssues({ issues }) {
  return <div className="cv-ats-writing-issues"><div><h2>Claridad de redacción</h2><p>Detecta expresiones genéricas o bloques demasiado extensos.</p></div>{issues.length ? <div>{issues.map((issue, index) => <article key={`${issue.section}-${issue.phrase}-${index}`}><strong>{issue.section}</strong><span>“{issue.phrase}”</span><p>{issue.suggestion}</p></article>)}</div> : <p className="is-clear">No se detectaron frases genéricas prioritarias.</p>}</div>;
}

function AchievementBuilder({ index, currentText, updateCv, setNotice }) {
  const [draft, setDraft] = useState({ context: "", action: "", method: "", result: "" });
  const composed = [draft.context && `Ante ${draft.context.trim()},`, draft.action.trim(), draft.method && `usando ${draft.method.trim()}`, draft.result && `y logré ${draft.result.trim()}.`].filter(Boolean).join(" ");
  const apply = () => {
    if (!draft.action.trim() || !draft.result.trim()) {
      setNotice("Describe al menos tu acción y un resultado real antes de aplicar el logro.");
      return;
    }
    updateCv((current) => ({ ...current, experience: current.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, description: currentText.trim() ? `${currentText.trim()}\n${composed}` : composed } : entry) }));
    setDraft({ context: "", action: "", method: "", result: "" });
    setNotice("Logro añadido a la experiencia. Revisa que cada afirmación sea exacta.");
  };
  return <div className="cv-ats-achievement-builder"><label><span>Situación o desafío</span><input value={draft.context} onChange={(event) => setDraft((current) => ({ ...current, context: event.target.value }))} placeholder="Ej. retrasos en reportes mensuales" /></label><label><span>Acción realizada</span><input value={draft.action} onChange={(event) => setDraft((current) => ({ ...current, action: event.target.value }))} placeholder="Ej. Automaticé la consolidación de datos" /></label><label><span>Herramienta o método</span><input value={draft.method} onChange={(event) => setDraft((current) => ({ ...current, method: event.target.value }))} placeholder="Ej. Power Query y Excel" /></label><label><span>Resultado verificable</span><input value={draft.result} onChange={(event) => setDraft((current) => ({ ...current, result: event.target.value }))} placeholder="Ej. reducir 8 horas de trabajo mensual" /></label>{composed && <blockquote>{composed}</blockquote>}<button onClick={apply}>Añadir este logro a la experiencia</button></div>;
}

function RequirementColumn({ title, items, empty, tone }) {
  return <div className={`cv-ats-requirement-column is-${tone}`}><h2>{title}</h2>{items.length ? <ul>{items.map((item) => <li key={item.id}>{item.text}{item.concepts.length > 0 && <span>{item.concepts.join(" · ")}</span>}</li>)}</ul> : <p>{empty}</p>}</div>;
}

function ApplicationsLocked({ onContinue }) {
  return <section className="cv-ats-applications-locked"><span>Disponible después de crear tu CV</span><h1>Completa primero el contenido esencial</h1><p>Agrega perfil, experiencia y habilidades para activar versiones por vacante, cartas y seguimiento.</p><button onClick={onContinue}>Continuar con mi CV</button></section>;
}

const APPLICATION_CHECKLIST = [
  ["cvReviewed", "CV adaptado y revisado"], ["coverLetterReady", "Carta de presentación lista"],
  ["linksChecked", "Enlaces y contacto verificados"], ["applicationSent", "Postulación enviada"],
  ["followUpScheduled", "Seguimiento programado"],
];

function ApplicationFollowUp({ cv, workspace, setWorkspace, setNotice }) {
  const [selectedId, setSelectedId] = useState(workspace.applications[0]?.id || "");
  const application = workspace.applications.find((item) => item.id === selectedId);
  const update = (patch) => setWorkspace((current) => updateApplicationMetadata(current, selectedId, patch));
  if (!workspace.applications.length) return null;
  const completed = application ? APPLICATION_CHECKLIST.filter(([key]) => application.checklist?.[key]).length : 0;
  const isOverdue = application?.nextActionDate && application.nextActionDate < new Date().toISOString().slice(0, 10);
  const createLetter = () => {
    update({ coverLetter: generateCoverLetter(cv, application), checklist: { ...application.checklist, coverLetterReady: false } });
    setNotice("Borrador de carta generado únicamente con datos registrados en tu CV.");
  };
  return <section className="cv-ats-followup"><div className="cv-ats-followup-heading"><div><h2>Centro de seguimiento</h2><p>Checklist, carta y próxima acción para cada postulación.</p></div><select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{workspace.applications.map((item) => <option key={item.id} value={item.id}>{item.company} · {item.title}</option>)}</select></div>{application && <><div className="cv-ats-followup-summary"><div><span>Progreso</span><strong>{completed}/{APPLICATION_CHECKLIST.length}</strong></div><div><span>Próxima acción</span><strong className={isOverdue ? "is-overdue" : ""}>{application.nextActionDate || "Sin programar"}</strong></div></div><div className="cv-ats-followup-grid"><div className="cv-ats-checklist"><h3>Checklist de postulación</h3>{APPLICATION_CHECKLIST.map(([key, label]) => <label key={key}><input type="checkbox" checked={Boolean(application.checklist?.[key])} onChange={(event) => update({ checklist: { ...application.checklist, [key]: event.target.checked } })} /><span>{label}</span></label>)}</div><div className="cv-ats-next-action"><h3>Recordatorio local</h3><Field label="Próxima acción" value={application.nextAction || ""} onChange={(nextAction) => update({ nextAction })} placeholder="Ej. Enviar correo de seguimiento" /><Field label="Fecha" type="date" value={application.nextActionDate || ""} onChange={(nextActionDate) => update({ nextActionDate })} />{isOverdue && <p>La fecha de seguimiento está vencida.</p>}</div></div><div className="cv-ats-cover-letter"><div><h3>Carta de presentación</h3><div><button onClick={createLetter}>{application.coverLetter ? "Regenerar borrador" : "Generar borrador"}</button>{application.coverLetter && <button onClick={() => downloadText(`${safeFilename(`carta-${application.company}-${application.title}`)}.txt`, application.coverLetter)}>Descargar TXT</button>}</div></div><textarea rows="12" value={application.coverLetter || ""} onChange={(event) => update({ coverLetter: event.target.value })} placeholder="Genera un borrador y personalízalo antes de enviarlo." /><p>La herramienta no inventa experiencia. Revisa el tono, destinatario y exactitud antes de usarla.</p></div></>}</section>;
}

function ApplicationsWorkspaceClean({ cv, workspace, setWorkspace, updateCv, activeApplicationId, setActiveApplicationId, setNotice }) {
  const [form, setForm] = useState({ company: "", title: cv.targetJob?.title || "", url: "", date: new Date().toISOString().slice(0, 10), status: "Borrador" });
  const activeApplication = workspace.applications.find((application) => application.id === activeApplicationId);
  const addApplication = () => {
    if (!form.company.trim() || !form.title.trim()) { setNotice("Indica empresa y cargo para crear la versión."); return; }
    setWorkspace((current) => {
      const result = createApplication(current, cv, form);
      setActiveApplicationId(result.application.id);
      return result.workspace;
    });
    setForm((current) => ({ ...current, company: "", url: "" }));
    setNotice("Versión creada desde el CV ficticio o desde tu borrador actual.");
  };
  const loadVersion = (application) => {
    if (!window.confirm(`¿Abrir la versión para ${application.company}?`)) return;
    updateCv(application.cv);
    setActiveApplicationId(application.id);
    setNotice(`Versión cargada: ${application.title} · ${application.company}.`);
  };
  const saveVersion = () => {
    if (!activeApplication) return;
    setWorkspace((current) => saveApplicationRevision(current, activeApplication.id, cv));
    setNotice("Versión actualizada; la revisión anterior quedó en el historial.");
  };
  const removeApplication = (application) => {
    if (!window.confirm(`¿Eliminar la postulación a ${application.company} y su historial local?`)) return;
    setWorkspace((current) => ({ ...current, applications: current.applications.filter((item) => item.id !== application.id) }));
    if (activeApplicationId === application.id) setActiveApplicationId("");
  };
  return <section className="space-y-5"><div><h1 className="text-2xl font-bold text-white">Versiones por postulación</h1><p className="mt-1 text-sm text-slate-400">Crea una copia específica para cada oferta sin usar perfiles personales predefinidos.</p></div><div className="cv-ats-application-form"><h2>Nueva versión por oferta</h2><div className="grid gap-3 sm:grid-cols-2"><Field label="Empresa" value={form.company} onChange={(company) => setForm((current) => ({ ...current, company }))} placeholder="Empresa objetivo" /><Field label="Cargo" value={form.title} onChange={(title) => setForm((current) => ({ ...current, title }))} placeholder="Cargo de la oferta" /><Field label="URL de la oferta" value={form.url} onChange={(url) => setForm((current) => ({ ...current, url }))} placeholder="https://…" /><Field label="Fecha" type="date" value={form.date} onChange={(date) => setForm((current) => ({ ...current, date }))} /></div><button onClick={addApplication}>Crear versión con el CV actual</button></div>{workspace.applications.length ? <div className="cv-ats-applications-list">{workspace.applications.map((application) => <article key={application.id} className={application.id === activeApplicationId ? "is-active" : ""}><div className="cv-ats-application-main"><div><span>{application.status}</span><h2>{application.title}</h2><p>{application.company} · {application.date || "Sin fecha"}</p></div><select value={application.status} onChange={(event) => setWorkspace((current) => updateApplicationMetadata(current, application.id, { status: event.target.value }))}>{APPLICATION_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div><div className="cv-ats-application-actions"><button onClick={() => loadVersion(application)}>Abrir</button><button onClick={() => { setActiveApplicationId(application.id); setNotice("Versión seleccionada."); }}>Seleccionar</button>{application.id === activeApplicationId && <button onClick={saveVersion} className="is-primary">Guardar revisión</button>}<button onClick={() => removeApplication(application)} className="is-danger">Eliminar</button></div>{application.revisions.length > 0 && <details><summary>Historial · {application.revisions.length} revisiones</summary>{[...application.revisions].reverse().map((revision, index) => <div key={`${revision.savedAt}-${index}`} className="cv-ats-revision"><span>{new Date(revision.savedAt).toLocaleString("es-CL")}</span><button onClick={() => updateCv(revision.cv)}>Recuperar</button></div>)}</details>}</article>)}</div> : <EmptyState text="Aún no hay versiones por oferta." />}</section>;
}

function ApplicationsWorkspace({ cv, workspace, setWorkspace, updateCv, activeApplicationId, setActiveApplicationId, setNotice }) {
  const [form, setForm] = useState({ company: "", title: cv.targetJob?.title || "", url: "", date: new Date().toISOString().slice(0, 10), status: "Borrador" });
  const [compareId, setCompareId] = useState("");
  const activeApplication = workspace.applications.find((application) => application.id === activeApplicationId);
  const comparisonTarget = workspace.applications.find((application) => application.id === compareId);
  const comparison = comparisonTarget && workspace.master ? compareCvVersions(workspace.master, comparisonTarget.cv) : null;
  const saveMaster = () => {
    setWorkspace((current) => ({ ...current, master: normaliseCv(cv) }));
    setNotice("CV maestro actualizado localmente.");
  };
  const addApplication = () => {
    if (!form.company.trim() || !form.title.trim()) {
      setNotice("Indica empresa y cargo para crear la versión.");
      return;
    }
    setWorkspace((current) => {
      const result = createApplication(current, cv, form);
      setActiveApplicationId(result.application.id);
      return result.workspace;
    });
    setForm((current) => ({ ...current, company: "", url: "" }));
    setNotice("Versión creada desde el CV actual.");
  };
  const loadVersion = (application) => {
    if (!window.confirm(`¿Abrir la versión para ${application.company}? El borrador actual podrá recuperarse con Deshacer.`)) return;
    updateCv(application.cv);
    setActiveApplicationId(application.id);
    setNotice(`Versión cargada: ${application.title} · ${application.company}.`);
  };
  const saveVersion = () => {
    if (!activeApplication) return;
    setWorkspace((current) => saveApplicationRevision(current, activeApplication.id, cv));
    setNotice("Versión actualizada; la revisión anterior quedó en el historial.");
  };
  const restoreRevision = (revision) => {
    updateCv(revision.cv);
    setNotice("Revisión recuperada en el editor. Guarda la versión para conservarla como actual.");
  };
  const removeApplication = (application) => {
    if (!window.confirm(`¿Eliminar la postulación a ${application.company} y todo su historial local?`)) return;
    setWorkspace((current) => ({ ...current, applications: current.applications.filter((item) => item.id !== application.id) }));
    if (activeApplicationId === application.id) setActiveApplicationId("");
  };
  return <section className="space-y-5"><div><h1 className="text-2xl font-bold text-white">CV maestro y postulaciones</h1><p className="mt-1 text-sm text-slate-400">Conserva una base general y crea una versión específica para cada oferta.</p></div><div className="cv-ats-master-card"><div><strong>{workspace.master ? "CV maestro disponible" : "Aún no guardas un CV maestro"}</strong><p>{workspace.master ? `${workspace.master.personal.name || "Perfil"} · ${workspace.master.experience.length} experiencias` : "Usa el CV actual como punto de partida reutilizable."}</p></div><div><button onClick={saveMaster}>{workspace.master ? "Actualizar maestro" : "Guardar como maestro"}</button>{workspace.master && <button onClick={() => updateCv(workspace.master)}>Abrir maestro</button>}</div></div><div className="cv-ats-application-form"><h2>Nueva versión por oferta</h2><div className="grid gap-3 sm:grid-cols-2"><Field label="Empresa" value={form.company} onChange={(company) => setForm((current) => ({ ...current, company }))} placeholder="Empresa objetivo" /><Field label="Cargo" value={form.title} onChange={(title) => setForm((current) => ({ ...current, title }))} placeholder="Cargo de la oferta" /><Field label="URL de la oferta" value={form.url} onChange={(url) => setForm((current) => ({ ...current, url }))} placeholder="https://…" /><Field label="Fecha" type="date" value={form.date} onChange={(date) => setForm((current) => ({ ...current, date }))} /></div><button onClick={addApplication}>Crear versión con el CV actual</button></div>{workspace.applications.length ? <div className="cv-ats-applications-list">{workspace.applications.map((application) => <article key={application.id} className={application.id === activeApplicationId ? "is-active" : ""}><div className="cv-ats-application-main"><div><span>{application.status}</span><h2>{application.title}</h2><p>{application.company} · {application.date || "Sin fecha"}</p></div><select value={application.status} onChange={(event) => setWorkspace((current) => updateApplicationMetadata(current, application.id, { status: event.target.value }))}>{APPLICATION_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div><div className="cv-ats-application-actions"><button onClick={() => loadVersion(application)}>Abrir</button><button onClick={() => { setActiveApplicationId(application.id); setNotice("Versión seleccionada. Puedes editar el CV y guardar una revisión."); }}>Seleccionar</button>{application.id === activeApplicationId && <button onClick={saveVersion} className="is-primary">Guardar revisión</button>}<button onClick={() => removeApplication(application)} className="is-danger">Eliminar</button></div>{application.id === activeApplicationId && application.revisions.length > 0 && <details><summary>Historial · {application.revisions.length} revisiones</summary>{[...application.revisions].reverse().map((revision, index) => <div key={`${revision.savedAt}-${index}`} className="cv-ats-revision"><span>{new Date(revision.savedAt).toLocaleString("es-CL")}</span><button onClick={() => restoreRevision(revision)}>Recuperar</button></div>)}</details>}</article>)}</div> : <EmptyState text="Aún no hay versiones por oferta. Crea una usando el CV actual." />}{workspace.master && workspace.applications.length > 0 && <div className="cv-ats-comparison"><div className="cv-ats-comparison-heading"><div><h2>Comparar con el CV maestro</h2><p>Identifica diferencias de enfoque antes de postular.</p></div><select value={compareId} onChange={(event) => setCompareId(event.target.value)}><option value="">Selecciona una versión</option>{workspace.applications.map((application) => <option key={application.id} value={application.id}>{application.company} · {application.title}</option>)}</select></div>{comparison && <div className="cv-ats-comparison-grid"><ComparisonMetric label="Score ATS" left={comparison.score.left} right={comparison.score.right} detail={`${comparison.score.delta >= 0 ? "+" : ""}${comparison.score.delta} puntos`} /><ComparisonMetric label="Experiencias" left={comparison.experiences.left} right={comparison.experiences.right} /><ComparisonMetric label="Habilidades" left={comparison.skills.left} right={comparison.skills.right} /><ComparisonMetric label="Keywords" left={comparison.matchedKeywords.left} right={comparison.matchedKeywords.right} />{(comparison.addedSkills.length > 0 || comparison.removedSkills.length > 0) && <div className="cv-ats-skill-diff"><p><strong>Añadidas:</strong> {comparison.addedSkills.join(", ") || "Ninguna"}</p><p><strong>Retiradas:</strong> {comparison.removedSkills.join(", ") || "Ninguna"}</p></div>}</div>}</div>}</section>;
}

function ComparisonMetric({ label, left, right, detail = "" }) {
  return <div className="cv-ats-comparison-metric"><span>{label}</span><p><strong>{left}</strong><b>→</b><strong>{right}</strong></p>{detail && <small>{detail}</small>}</div>;
}

function ExportValidation({ errors, onNavigate }) {
  return <div className="cv-ats-export-errors"><strong>Faltan datos obligatorios</strong><p>Selecciona una observación para ir directamente a la sección correspondiente.</p><ul>{errors.map((error) => <li key={error.id}><button onClick={() => onNavigate(error.section)}>{error.message}</button></li>)}</ul></div>;
}

function ExportSettings({ cv, updateCv }) {
  const safety = { ats: ["ATS segura", "Una columna y lectura lineal."], minimal: ["ATS segura", "Diseño limpio con estructura lineal."], executive: ["Visual", "Adecuada para envío directo; verifica el ATS de destino."], technical: ["Visual", "La barra lateral puede afectar algunos lectores ATS."], latex: ["Avanzada", "Vista del código fuente LaTeX."] }[cv.template] || ["ATS segura", ""];
  return <section className="cv-ats-export-settings"><div><h2>Configuración del documento</h2><span className={safety[0] === "ATS segura" ? "is-safe" : "is-visual"}>{safety[0]}</span></div><p>{safety[1]}</p><div><label><span>País o mercado</span><select value={cv.locale?.country || "Chile"} onChange={(event) => { const country = event.target.value; updateCv((current) => ({ ...current, locale: { ...current.locale, country }, pageFormat: country === "Estados Unidos" ? "letter" : current.pageFormat })); }}><option>Chile</option><option>Argentina</option><option>Colombia</option><option>España</option><option>México</option><option>Perú</option><option>Estados Unidos</option><option>Otro</option></select></label><label><span>Idioma de encabezados</span><select value={cv.locale?.language || "es"} onChange={(event) => updateCv((current) => ({ ...current, locale: { ...current.locale, language: event.target.value } }))}><option value="es">Español</option><option value="en">English</option></select></label><label><span>Formato</span><select value={cv.pageFormat} onChange={(event) => updateCv((current) => ({ ...current, pageFormat: event.target.value }))}><option value="a4">A4</option><option value="letter">US Letter</option></select></label></div></section>;
}

function PlainTextPreview({ text }) {
  const [open, setOpen] = useState(false);
  return <div className="cv-ats-plain-preview"><button onClick={() => setOpen((current) => !current)}>{open ? "Ocultar" : "Ver"} lectura simulada del ATS</button>{open && <pre>{text || "Completa el CV para generar la lectura de texto plano."}</pre>}</div>;
}

function ImportReview({ draft, onChange, onCancel, onApply }) {
  const updatePersonal = (key, value) => onChange({ ...draft, personal: { ...draft.personal, [key]: value } });
  return <div className="cv-ats-import-backdrop" role="dialog" aria-modal="true" aria-label="Revisar CV importado"><section className="cv-ats-import-dialog"><div className="cv-ats-import-heading"><div><p>{draft.sourceType} detectado</p><h2>Revisa antes de importar</h2><span>{draft.filename}</span></div><button onClick={onCancel} aria-label="Cerrar revisión">×</button></div><div className="cv-ats-import-grid"><Field label="Nombre" value={draft.personal.name} onChange={(value) => updatePersonal("name", value)} /><Field label="Cargo" value={draft.personal.title} onChange={(value) => updatePersonal("title", value)} /><Field label="Email" value={draft.personal.email} onChange={(value) => updatePersonal("email", value)} /><Field label="Teléfono" value={draft.personal.phone} onChange={(value) => updatePersonal("phone", value)} /></div><label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Resumen detectado</span><textarea rows="5" value={draft.summary} onChange={(event) => onChange({ ...draft, summary: event.target.value })} /></label><details><summary>Texto extraído completo</summary><pre>{draft.sourceText}</pre></details><p className="cv-ats-import-note">Se detectaron {draft.skills.length} habilidades. El sistema no reemplazará campos existentes cuando el valor detectado esté vacío.</p><div className="cv-ats-import-actions"><button onClick={onCancel}>Cancelar</button><button onClick={onApply} className="is-primary">Incorporar datos</button></div></section></div>;
}

function ProgressPanel({ progress }) {
  return <div className="cv-ats-progress"><div className="cv-ats-progress-heading"><div><span>Completitud del CV</span><strong>{progress.percentage}%</strong></div><p>{progress.completed} de {progress.total} secciones esenciales completas · aprox. {progress.estimatedPages} {progress.estimatedPages === 1 ? "página" : "páginas"}</p></div><div className="cv-ats-progress-track" role="progressbar" aria-label="Completitud del CV" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress.percentage}><span style={{ width: `${progress.percentage}%` }} /></div>{progress.pageWarning && <p className="cv-ats-page-warning">{progress.pageWarning}</p>}</div>;
}

function AtsScore({ analysis }) {
  return <div className={`cv-ats-score cv-ats-score-${analysis.status.tone}`}><div><p className="cv-ats-score-label">Nivel de preparación ATS</p><p className="cv-ats-score-status">{analysis.status.label}</p><p className="cv-ats-score-copy">Indicador local y explicable; no garantiza superar un sistema de selección específico.</p></div><div className="cv-ats-score-value"><strong>{analysis.score}</strong><span>/100</span></div></div>;
}

function AtsCategories({ categories }) {
  return <div className="cv-ats-category-list">{categories.map((category) => <article key={category.id} className="cv-ats-category"><div className="cv-ats-category-heading"><div><h2>{category.label}</h2><p>{category.detail}</p></div><strong>{category.score}/{category.maximum}</strong></div><div className="cv-ats-category-track" role="progressbar" aria-label={category.label} aria-valuemin="0" aria-valuemax={category.maximum} aria-valuenow={category.score}><span style={{ width: `${(category.score / category.maximum) * 100}%` }} /></div></article>)}</div>;
}

function AtsRecommendations({ recommendations }) {
  if (!recommendations.length) return <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100"><strong>CV listo para revisión final.</strong><p className="mt-1 text-emerald-200/80">Verifica que todos los datos sean verdaderos y estén adaptados a la oferta.</p></div>;
  return <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><h2 className="font-semibold text-white">Acciones recomendadas</h2><div className="mt-3 space-y-2">{recommendations.map((item, index) => <div key={`${item.category}-${index}`} className={`cv-ats-recommendation is-${item.priority}`}><span>{item.category}</span><p>{item.text}</p></div>)}</div></div>;
}

function AtsEvidenceMap({ evidence }) {
  if (!evidence.length) return null;
  return <section className="cv-ats-evidence"><div><h2>Mapa de evidencia por palabra clave</h2><p>Muestra dónde puede encontrar el reclutador cada término de la oferta.</p></div><div className="cv-ats-evidence-list">{evidence.map((item) => <article key={item.keyword} className={item.locations.length ? "is-backed" : "is-missing"}><strong>{item.keyword}</strong>{item.locations.length ? <div>{item.locations.map((location) => <span key={location}>{location}</span>)}</div> : <p>Sin evidencia en el CV</p>}</article>)}</div></section>;
}

function AtsQualityAudit({ unsupportedSkills, issues }) {
  if (!unsupportedSkills.length && !issues.length) return <section className="cv-ats-quality is-clear"><strong>Coherencia interna verificada</strong><p>No se detectaron habilidades aisladas, errores frecuentes ni fechas inconsistentes.</p></section>;
  return <section className="cv-ats-quality"><div><h2>Coherencia y calidad</h2><p>Revisa estas observaciones antes de descargar.</p></div>{unsupportedSkills.length > 0 && <div className="cv-ats-unsupported"><strong>Habilidades sin evidencia contextual</strong><p>Inclúyelas dentro de una experiencia o proyecto solo si realmente las utilizaste.</p><div>{unsupportedSkills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>}{issues.length > 0 && <div className="cv-ats-quality-issues">{issues.map((issue, index) => <article key={`${issue.section}-${index}`}><span>{issue.type === "date" ? "Fecha" : "Ortografía"}</span><strong>{issue.section}</strong><p>{issue.text}</p></article>)}</div>}</section>;
}

function CvPreview({ cv, isDemo }) {
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
    return <article className={`cv-preview-sheet cv-page-${cv.pageFormat || "a4"} cv-template-latex text-slate-800 shadow-xl`}><p className="cv-preview-source-label">Vista de fuente · LaTeX</p><pre>{createLatex(cv)}</pre></article>;
  }

  return <><div className="cv-ats-preview-toolbar"><div><div className="cv-ats-preview-heading"><h2>Vista previa</h2>{isDemo && <span className="cv-ats-demo-badge">Ejemplo ficticio</span>}</div><p>{pageCount} {pageCount === 1 ? "página real" : "páginas reales"} · {cv.pageFormat === "letter" ? "US Letter" : "A4"}</p></div><div><button onClick={() => setZoom((value) => Math.max(50, value - 10))} aria-label="Reducir zoom">−</button><output aria-live="polite">{zoom}%</output><button onClick={() => setZoom((value) => Math.min(150, value + 10))} aria-label="Aumentar zoom">+</button></div></div><div className={`cv-pdf-preview cv-page-${cv.pageFormat || "a4"}`}>{previewUrl ? <iframe key={`${previewUrl}-${zoom}`} title={`Vista previa del CV, ${pageCount} páginas`} src={`${previewUrl}#toolbar=0&navpanes=0&zoom=${zoom}`} /> : <div className="cv-preview-loading">Generando vista previa…</div>}</div></>;
}
