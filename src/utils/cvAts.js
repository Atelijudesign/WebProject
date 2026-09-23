import { jsPDF } from "jspdf";

export const CV_STORAGE_KEY = "cvats.builder.cv.v2";
export const CV_MODE_KEY = "cvats.builder.mode.v2";
const LEGACY_CV_KEYS = ["atelijudesign.cv-ats-command-center.v1", "atelijudesign.cv-ats-mode.v1"];

export const EMPTY_CV = {
  version: 1,
  projectName: "Mi CV ATS",
  locale: { country: "Chile", language: "es" },
  pageFormat: "a4",
  template: "ats",
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
  },
  targetJob: { title: "", description: "" },
  summary: "",
  experience: [],
  education: [],
  certifications: [],
  skills: [],
  languages: [],
  projects: [],
};

export const EXAMPLE_CV = {
  version: 1,
  projectName: "Ejemplo · Coordinadora BIM Estructural",
  locale: { country: "Chile", language: "es" },
  pageFormat: "a4",
  template: "ats",
  personal: {
    name: "Valentina Rojas Méndez",
    title: "Coordinadora BIM Estructural",
    email: "valentina.rojas@example.com",
    phone: "+56 9 5555 0142",
    location: "Santiago, Chile",
    linkedin: "https://example.com/perfil-valentina-rojas",
  },
  targetJob: {
    title: "Coordinadora BIM Estructural",
    description: "Se requiere Coordinadora BIM Estructural con dominio obligatorio de Revit Structures, Navisworks Manage, Autodesk Construction Cloud y Coordinación BIM. Debe contar con experiencia en Modelado BIM de estructuras de hormigón armado y acero estructural, Clash Detection, elaboración de BEP y gestión de información bajo ISO 19650. Se valora conocimiento de Dynamo, pyRevit, AutoCAD, Tekla Structures, NCh433, NCh2369, AISC y ACI. Responsable de coordinar especialidades, supervisar modelos, controlar entregables y liderar reuniones de coordinación multidisciplinaria. Inglés intermedio deseable.",
  },
  summary: "Coordinadora BIM Estructural con experiencia en modelado, coordinación multidisciplinaria y gestión de información para proyectos industriales y de edificación. Especialista en Revit Structures, Navisworks Manage, Autodesk Construction Cloud e ISO 19650, con resultados verificables en reducción de interferencias, automatización de controles y cumplimiento de entregables.",
  experience: [
    { company: "Andes Digital Engineering SpA", position: "Coordinadora BIM Estructural", start_date: "2023-03", end_date: "Actualidad", current: true, location: "Santiago, Chile", description: "Lideré la coordinación BIM de 14 proyectos industriales, integrando modelos estructurales, arquitectura y MEP en Navisworks Manage. Reduje en 38% las interferencias críticas antes de construcción mediante Clash Detection y reuniones ICE semanales. Implementé flujos de revisión en Autodesk Construction Cloud, logrando 96% de entregables aprobados en primera revisión." },
    { company: "Estructuras del Pacífico Ltda.", position: "Modeladora BIM Estructural Senior", start_date: "2020-01", end_date: "2023-02", location: "Valparaíso, Chile", description: "Modelé más de 85.000 m2 de estructuras de hormigón armado y acero estructural en Revit Structures. Automaticé 12 controles de calidad con Dynamo y pyRevit, reduciendo 22 horas mensuales de revisión manual. Coordiné planos, cubicaciones y modelos conforme a NCh433, NCh2369, ACI y AISC." },
    { company: "BIM Norte Consultores", position: "Proyectista Estructural BIM", start_date: "2017-06", end_date: "2019-12", location: "Antofagasta, Chile", description: "Desarrollé modelos y planos estructurales para 9 instalaciones mineras utilizando Revit, AutoCAD y Tekla Structures. Coordiné la emisión de 420 planos con trazabilidad documental y disminuí 30% las observaciones por inconsistencias entre vistas, detalles y cubicaciones." },
  ],
  education: [
    { degree: "Ingeniería en Construcción", institution: "Instituto Profesional Metropolitano" },
    { degree: "Diplomado en Coordinación BIM", institution: "Academia Digital de Construcción" },
  ],
  certifications: [
    { name: "Autodesk Certified Professional: Revit for Structural Design", issuer: "Autodesk", date: "2024", credential: "Credencial ficticia de demostración" },
  ],
  skills: ["Revit Structures", "Navisworks Manage", "Autodesk Construction Cloud", "Coordinación BIM", "Modelado BIM", "Clash Detection", "ISO 19650", "Dynamo", "pyRevit", "Tekla Structures", "AutoCAD", "NCh433", "NCh2369", "AISC", "ACI", "Hormigón Armado", "Acero Estructural"].map((name) => ({ name, level: 4, category: "" })),
  languages: [{ name: "Español", level: "Nativo" }, { name: "Inglés", level: "B2 Intermedio alto" }],
  projects: [{ name: "Centro Logístico Cordillera", date: "2025", description: "Coordinación BIM estructural de 42.000 m2, federación de modelos y gestión de 680 incidencias en Autodesk Construction Cloud." }],
};

const PRIORITY_TERMS = [
  "Revit Structures", "Tekla Structures", "AutoCAD", "Navisworks Manage",
  "Autodesk Construction Cloud", "BIM 360", "ISO 19650", "AISC", "ACI",
  "NCh2369", "NCh433", "Python", "pyRevit", "Rebar", "Hormigón Armado",
  "Acero Estructural", "Clash Detection", "Coordinación BIM", "Modelado BIM",
];

const STOP_WORDS = new Set([
  "de", "del", "la", "las", "el", "los", "un", "una", "unos", "unas", "y", "o", "en", "con", "sin", "se", "su", "sus",
  "para", "como", "desde", "entre", "sobre", "esta", "este", "estos", "estas",
  "donde", "debe", "deben", "ser", "tener", "contar", "trabajo", "oferta",
  "cargo", "equipo", "proyecto", "proyectos", "experiencia", "profesional",
  "requisito", "requisitos", "requiere", "requieren", "requerido", "requerida",
  "responsable", "personas", "empresa", "través", "todas", "todos", "cada",
  "también", "nivel", "forma", "parte", "busca", "buscamos", "funciones",
  "conocimiento", "conocimientos", "capacidad", "habilidad", "habilidades",
]);

const COMMON_TYPOS = [
  ["experienciaa", "experiencia"], ["proffesional", "profesional"], ["profecional", "profesional"],
  ["responsavilidad", "responsabilidad"], ["coordinacionn", "coordinación"], ["implementacionn", "implementación"],
];

const ACTION_VERBS = [
  "aumente", "automatice", "coordine", "disene", "desarrolle", "implemente",
  "lidere", "modele", "optimice", "reduje", "resolvi", "supervise",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /\d[\d\s()+-]{6,}/;
const NUMBER_PATTERN = /(?:\d+[.,]?\d*\s?(?:%|m2|m3|kg|t|ton|horas?|dias?|semanas?|meses?|personas?|planos?|modelos?|proyectos?)|\$\s?\d+)/i;

export function normaliseText(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("es-CL")
    .trim();
}

export function extractKeywords(jobDescription, limit = 18) {
  const text = normaliseText(jobDescription);
  if (!text) return [];

  const terms = PRIORITY_TERMS.filter((term) => text.includes(normaliseText(term)));
  const words = jobDescription.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9+#.]{2,}/g) || [];
  const frequencies = new Map();
  words.forEach((word) => {
    const label = word.replace(/\.+$/, "");
    const key = normaliseText(label);
    if (key && !STOP_WORDS.has(key)) frequencies.set(key, { label, count: (frequencies.get(key)?.count || 0) + 1 });
  });
  [...frequencies.entries()].sort((left, right) => right[1].count - left[1].count).forEach(([key, value]) => {
    if (!terms.some((term) => normaliseText(term) === key)) terms.push(value.label);
  });
  return terms.slice(0, limit);
}

function buildEvidenceMap(cv, keywords) {
  const sections = [
    ["Perfil profesional", cv.summary || ""],
    ...(cv.experience || []).map((entry, index) => [`Experiencia: ${entry.position || entry.company || index + 1}`, `${entry.position || ""} ${entry.company || ""} ${entry.description || ""}`]),
    ["Educación", JSON.stringify(cv.education || [])],
    ["Certificaciones", JSON.stringify(cv.certifications || [])],
    ["Proyectos", JSON.stringify(cv.projects || [])],
    ["Idiomas", JSON.stringify(cv.languages || [])],
    ["Habilidades", JSON.stringify(cv.skills || [])],
  ];
  return keywords.map((keyword) => ({
    keyword,
    locations: sections.filter(([, content]) => normaliseText(content).includes(normaliseText(keyword))).map(([label]) => label),
  }));
}

function findUnsupportedSkills(cv) {
  const evidenceText = normaliseText(JSON.stringify({ summary: cv.summary, experience: cv.experience, education: cv.education, certifications: cv.certifications, projects: cv.projects }));
  return (cv.skills || []).map((skill) => skill.name || skill).filter(Boolean).filter((skill) => !evidenceText.includes(normaliseText(skill)));
}

function findQualityIssues(cv) {
  const issues = [];
  (cv.experience || []).forEach((entry, index) => {
    const start = /^\d{4}-\d{2}$/.test(entry.start_date || "") ? entry.start_date : "";
    const end = /^\d{4}-\d{2}$/.test(entry.end_date || "") ? entry.end_date : "";
    if (start && end && start > end) issues.push({ type: "date", section: entry.position || `Experiencia ${index + 1}`, text: "La fecha de inicio es posterior a la fecha de término." });
    if (!entry.current && start && !entry.end_date) issues.push({ type: "date", section: entry.position || `Experiencia ${index + 1}`, text: "Falta la fecha de término o marcar el cargo como actual." });
  });
  const completeText = normaliseText(JSON.stringify({ summary: cv.summary, experience: cv.experience, projects: cv.projects }));
  COMMON_TYPOS.forEach(([typo, correction]) => {
    if (completeText.includes(normaliseText(typo))) issues.push({ type: "spelling", section: "Redacción", text: `Posible error: “${typo}”. Revisa si corresponde “${correction}”.` });
  });
  return issues;
}

function cvText(cv) {
  return normaliseText(JSON.stringify({
    personal: cv.personal,
    summary: cv.summary,
    experience: cv.experience,
    education: cv.education,
    certifications: cv.certifications,
    skills: cv.skills,
    languages: cv.languages,
    projects: cv.projects,
  }));
}

function clampScore(value, maximum) {
  return Math.max(0, Math.min(maximum, Math.round(value)));
}

function scoreCategory(id, label, score, maximum, detail) {
  return { id, label, score: clampScore(score, maximum), maximum, detail };
}

function meaningfulEntries(entries, fields) {
  return entries.filter((entry) => fields.some((field) => String(entry?.[field] || "").trim()));
}

function atsStatus(score) {
  if (score >= 85) return { label: "Excelente", tone: "emerald" };
  if (score >= 70) return { label: "Competitivo", tone: "cyan" };
  if (score >= 50) return { label: "Mejorable", tone: "amber" };
  return { label: "Incompleto", tone: "rose" };
}

export function analyzeAts(cv) {
  const keywords = extractKeywords(cv.targetJob?.description || "");
  const text = cvText(cv);
  const matched = keywords.filter((term) => text.includes(normaliseText(term)));
  const missing = keywords.filter((term) => !matched.includes(term));
  const evidence = buildEvidenceMap(cv, keywords);
  const unsupportedSkills = findUnsupportedSkills(cv);
  const qualityIssues = findQualityIssues(cv);
  const experiences = meaningfulEntries(cv.experience || [], ["position", "company", "description"]);
  const skills = meaningfulEntries((cv.skills || []).map((skill) => typeof skill === "string" ? { name: skill } : skill), ["name"]);
  const education = meaningfulEntries(cv.education || [], ["degree", "institution"]);
  const descriptions = experiences.map((entry) => String(entry.description || "")).filter(Boolean);
  const quantifiedAchievements = descriptions.filter((description) => NUMBER_PATTERN.test(description)).length;
  const actionLedAchievements = descriptions.filter((description) => {
    const firstWords = normaliseText(description).split(/[^a-z0-9+#.]+/).filter(Boolean).slice(0, 8);
    return ACTION_VERBS.some((verb) => firstWords.includes(verb));
  }).length;

  const keywordScore = keywords.length ? (matched.length / keywords.length) * 35 : 0;
  const contactChecks = [
    Boolean(cv.personal?.name?.trim()),
    Boolean(cv.personal?.title?.trim()),
    EMAIL_PATTERN.test(cv.personal?.email || ""),
    PHONE_PATTERN.test(cv.personal?.phone || ""),
    Boolean(cv.personal?.location?.trim()),
  ];
  const contactScore = contactChecks.filter(Boolean).length * 3;
  const structureScore = [
    cv.summary?.trim().length >= 80 ? 5 : cv.summary?.trim() ? 2 : 0,
    experiences.length ? 6 : 0,
    skills.length >= 3 ? 4 : skills.length ? 2 : 0,
    education.length ? 3 : 0,
    experiences.some((entry) => entry.start_date && entry.end_date) ? 2 : 0,
  ].reduce((total, value) => total + value, 0);
  const impactScore = experiences.length
    ? (Math.min(1, quantifiedAchievements / experiences.length) * 12)
      + (Math.min(1, actionLedAchievements / experiences.length) * 8)
    : 0;
  const wordCount = text ? text.split(" ").length : 0;
  const readabilityScore = [
    wordCount >= 120 && wordCount <= 900 ? 4 : wordCount >= 60 ? 2 : 0,
    cv.summary?.trim().length >= 80 && cv.summary.trim().length <= 500 ? 2 : 0,
    descriptions.every((description) => description.length <= 900) ? 2 : 0,
    cv.template === "ats" || cv.template === "minimal" ? 2 : 1,
  ].reduce((total, value) => total + value, 0);

  const categories = [
    scoreCategory("keywords", "Coincidencia con la vacante", keywordScore, 35, keywords.length ? `${matched.length} de ${keywords.length} términos detectados` : "Falta la descripción de la vacante"),
    scoreCategory("contact", "Datos de contacto", contactScore, 15, `${contactChecks.filter(Boolean).length} de 5 datos esenciales válidos`),
    scoreCategory("structure", "Estructura y contenido", structureScore, 20, `${experiences.length} experiencias y ${skills.length} habilidades informadas`),
    scoreCategory("impact", "Logros y resultados", impactScore, 20, `${quantifiedAchievements} logros cuantificados y ${actionLedAchievements} con verbo de acción`),
    scoreCategory("readability", "Legibilidad ATS", readabilityScore, 10, `${wordCount} palabras y plantilla ${cv.template || "ats"}`),
  ];
  const score = categories.reduce((total, category) => total + category.score, 0);
  const recommendations = [];
  if (!keywords.length) recommendations.push({ category: "Vacante", priority: "high", text: "Pega la descripción completa de la oferta para medir la coincidencia real." });
  else if (matched.length / keywords.length < 0.65) recommendations.push({ category: "Palabras clave", priority: "high", text: `Revisa los términos faltantes prioritarios: ${missing.slice(0, 5).join(", ")}. Inclúyelos solo si reflejan experiencia real.` });
  if (!EMAIL_PATTERN.test(cv.personal?.email || "") || !PHONE_PATTERN.test(cv.personal?.phone || "")) recommendations.push({ category: "Contacto", priority: "high", text: "Completa un email válido y un teléfono reconocible por los sistemas ATS." });
  if (!experiences.length) recommendations.push({ category: "Experiencia", priority: "high", text: "Añade al menos una experiencia con cargo, empresa, fechas y responsabilidades." });
  if (experiences.length && quantifiedAchievements < experiences.length) recommendations.push({ category: "Impacto", priority: "medium", text: "Añade al menos un resultado medible por experiencia: porcentaje, plazo, cantidad, superficie o ahorro." });
  if (experiences.length && actionLedAchievements < experiences.length) recommendations.push({ category: "Redacción", priority: "medium", text: "Comienza cada experiencia con verbos de acción como Lideré, Coordiné, Modelé, Implementé u Optimicé." });
  if (!cv.summary?.trim() || cv.summary.trim().length < 80) recommendations.push({ category: "Perfil", priority: "medium", text: "Escribe un resumen de 80 a 500 caracteres con especialidad, experiencia y resultados relevantes." });
  if (skills.length < 3) recommendations.push({ category: "Habilidades", priority: "low", text: "Incluye al menos tres habilidades técnicas relevantes para la oferta." });
  if (unsupportedSkills.length) recommendations.push({ category: "Evidencia", priority: "medium", text: `Demuestra estas habilidades dentro de experiencias o proyectos, sin inventar información: ${unsupportedSkills.slice(0, 5).join(", ")}.` });
  if (qualityIssues.some((issue) => issue.type === "date")) recommendations.push({ category: "Fechas", priority: "high", text: "Corrige las fechas inconsistentes antes de exportar; los ATS y reclutadores detectan cronologías poco claras." });
  if (qualityIssues.some((issue) => issue.type === "spelling")) recommendations.push({ category: "Ortografía", priority: "medium", text: "Revisa los posibles errores ortográficos detectados en el resumen y las experiencias." });

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((left, right) => priorityOrder[left.priority] - priorityOrder[right.priority]);

  return {
    keywords, matched, missing, evidence, unsupportedSkills, qualityIssues, score, categories,
    status: atsStatus(score),
    recommendations: recommendations.slice(0, 8),
    metrics: { wordCount, quantifiedAchievements, actionLedAchievements },
  };
}

export function evaluateCvProgress(cv) {
  const experiences = meaningfulEntries(cv.experience || [], ["position", "company", "description"]);
  const skills = meaningfulEntries((cv.skills || []).map((skill) => typeof skill === "string" ? { name: skill } : skill), ["name"]);
  const checks = [
    { section: "job", label: "Vacante", complete: Boolean(cv.targetJob?.title?.trim() && cv.targetJob?.description?.trim().length >= 80) },
    { section: "personal", label: "Perfil", complete: Boolean(cv.personal?.name?.trim() && EMAIL_PATTERN.test(cv.personal?.email || "") && cv.summary?.trim().length >= 80) },
    { section: "experience", label: "Experiencia", complete: Boolean(experiences.length && experiences.every((entry) => entry.position?.trim() && entry.company?.trim() && entry.description?.trim())) },
    { section: "skills", label: "Habilidades", complete: skills.length >= 3 },
  ];
  const completed = checks.filter((check) => check.complete).length;
  const wordCount = cvText(cv).split(" ").filter(Boolean).length;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 450));
  return {
    percentage: Math.round((completed / checks.length) * 100),
    completed,
    total: checks.length,
    sections: Object.fromEntries(checks.map((check) => [check.section, check.complete])),
    estimatedPages,
    pageWarning: estimatedPages > 2 ? `El contenido podría ocupar ${estimatedPages} páginas. Prioriza la información más relevante.` : "",
  };
}

export function normaliseCv(raw = {}) {
  const summary = typeof raw.summary === "string" ? raw.summary : raw.summary?.text || "";
  const target = raw.targetJob || raw.target_job || {};
  const personal = raw.personal || {};
  const template = ["executive", "minimal", "technical", "ats", "latex"].includes(raw.template)
    ? raw.template
    : "ats";
  return {
    ...EMPTY_CV,
    ...raw,
    pageFormat: raw.pageFormat === "letter" ? "letter" : "a4",
    locale: { ...EMPTY_CV.locale, ...(raw.locale || {}) },
    template,
    personal: { ...EMPTY_CV.personal, ...personal },
    targetJob: { ...EMPTY_CV.targetJob, title: target.title || "", description: target.description || "" },
    summary,
    experience: Array.isArray(raw.experience) ? raw.experience : [],
    education: Array.isArray(raw.education) ? raw.education : [],
    certifications: Array.isArray(raw.certifications) ? raw.certifications : [],
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    languages: Array.isArray(raw.languages) ? raw.languages : [],
    projects: Array.isArray(raw.projects) ? raw.projects : [],
  };
}

export function toPortableCvb(cv) {
  const { targetJob, ...rest } = cv;
  return {
    ...rest,
    target_job: { ...targetJob },
    summary: { text: cv.summary || "" },
  };
}

export function readLocalCv() {
  if (typeof window === "undefined") return EMPTY_CV;
  try {
    LEGACY_CV_KEYS.forEach((key) => window.localStorage.removeItem(key));
    const saved = window.localStorage.getItem(CV_STORAGE_KEY);
    return saved ? normaliseCv(JSON.parse(saved)) : normaliseCv(EMPTY_CV);
  } catch {
    return normaliseCv(EMPTY_CV);
  }
}

export function downloadText(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function latexEscape(value = "") {
  return String(value)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([#$%&_{}])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

export function createLatex(cv) {
  const p = cv.personal;
  const lines = [
    `\\documentclass[10pt,${cv.pageFormat === "letter" ? "letterpaper" : "a4paper"}]{article}`,
    "\\usepackage[margin=1.65cm]{geometry}",
    "\\usepackage[T1]{fontenc}",
    "\\usepackage[utf8]{inputenc}",
    "\\usepackage[spanish]{babel}",
    "\\usepackage{enumitem}",
    "\\setlist[itemize]{leftmargin=*,nosep}",
    "\\begin{document}",
    `\\begin{center}{\\LARGE\\textbf{${latexEscape(p.name)}}}\\\\`,
    `${latexEscape(p.title)}\\\\`,
    [p.location, p.phone, p.email, p.linkedin].filter(Boolean).map(latexEscape).join(" $\\cdot$ "),
    "\\end{center}",
  ];
  if (cv.summary) lines.push("\\section*{Perfil profesional}", latexEscape(cv.summary));
  if (cv.experience.length) {
    lines.push("\\section*{Experiencia profesional}");
    cv.experience.forEach((entry) => {
      lines.push(
        `\\textbf{${latexEscape(entry.position)}} --- ${latexEscape(entry.company)} \\hfill ${latexEscape(entry.start_date)}--${latexEscape(entry.end_date || "Actualidad")}\\\\`,
        latexEscape(entry.description || "").replace(/\n/g, "\\\\"),
      );
    });
  }
  if (cv.skills.length) lines.push("\\section*{Habilidades}", latexEscape(cv.skills.map((item) => item.name || item).join(" · ")));
  if (cv.education.length) {
    lines.push("\\section*{Educación}");
    cv.education.forEach((entry) => lines.push(`\\textbf{${latexEscape(entry.degree)}} --- ${latexEscape(entry.institution)}\\\\`));
  }
  if (cv.certifications.length) {
    lines.push("\\section*{Certificaciones}");
    cv.certifications.forEach((entry) => lines.push(`\\textbf{${latexEscape(entry.name)}} --- ${latexEscape(entry.issuer)}${entry.date ? ` \\hfill ${latexEscape(entry.date)}` : ""}\\\\`, entry.credential ? latexEscape(entry.credential) : ""));
  }
  if (cv.languages.length) lines.push("\\section*{Idiomas}", latexEscape(cv.languages.map((item) => `${item.name || item} ${item.level ? `(${item.level})` : ""}`).join(" · ")));
  if (cv.projects.length) {
    lines.push("\\section*{Proyectos destacados}");
    cv.projects.forEach((entry) => lines.push(`\\textbf{${latexEscape(entry.name)}} ${entry.date ? `\\hfill ${latexEscape(entry.date)}` : ""}\\\\`, latexEscape(entry.description || "")));
  }
  lines.push("\\end{document}");
  return lines.join("\n");
}

export function createCvPdf(cv) {
  const doc = new jsPDF({ unit: "mm", format: cv.pageFormat === "letter" ? "letter" : "a4" });
  const english = cv.locale?.language === "en";
  const labels = english ? { profile: "Professional summary", experience: "Professional experience", skills: "Skills", education: "Education", certifications: "Certifications", languages: "Languages", projects: "Projects" } : { profile: "Perfil profesional", experience: "Experiencia profesional", skills: "Habilidades", education: "Educación", certifications: "Certificaciones", languages: "Idiomas", projects: "Proyectos" };
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const template = ["executive", "minimal", "technical", "ats"].includes(cv.template) ? cv.template : "ats";
  const isExecutive = template === "executive";
  const isTechnical = template === "technical";
  const accent = isExecutive ? [15, 52, 77] : isTechnical ? [14, 116, 144] : template === "ats" ? [0, 0, 0] : [17, 94, 130];
  const margin = 16;
  const contentX = isTechnical ? 56 : margin;
  const contentRight = pageWidth - margin;
  let y = isExecutive ? 45 : 18;

  const ensureRoom = (height = 8) => {
    if (y + height > pageHeight - 16) {
      doc.addPage();
      y = 16;
    }
  };
  const paragraph = (text, size = 9, style = "normal") => {
    if (!text) return;
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(45, 55, 72);
    const lines = doc.splitTextToSize(String(text), contentRight - contentX);
    ensureRoom(lines.length * (size * 0.46) + 4);
    doc.text(lines, contentX, y);
    y += lines.length * (size * 0.46) + 4;
  };
  const heading = (text) => {
    ensureRoom(12);
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.4);
    doc.line(contentX, y, contentRight, y);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...accent);
    doc.text(text.toUpperCase(), contentX, y);
    y += 6;
  };

  if (isExecutive) {
    doc.setFillColor(...accent);
    doc.rect(0, 0, pageWidth, 34, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.setTextColor(255, 255, 255);
    doc.text(cv.personal.name || "Nombre profesional", margin, 16);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(226, 232, 240);
    doc.text(cv.personal.title || "", margin, 23);
    doc.setFontSize(7.5);
    doc.text([cv.personal.location, cv.personal.phone, cv.personal.email, cv.personal.linkedin].filter(Boolean).join("  |  "), margin, 29);
  } else if (isTechnical) {
    doc.setFillColor(...accent);
    doc.rect(0, 0, 46, pageHeight, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(255, 255, 255);
    const nameLines = doc.splitTextToSize(cv.personal.name || "Nombre profesional", 34);
    doc.text(nameLines, 6, 16);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(226, 232, 240);
    doc.text(doc.splitTextToSize(cv.personal.title || "Cargo o especialidad", 34), 6, 26 + nameLines.length * 4);
    doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(15, 36, 59);
    doc.text(cv.personal.name || "Nombre profesional", contentX, y);
    y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...accent);
    doc.text(cv.personal.title || "", contentX, y);
    y += 6;
    paragraph([cv.personal.location, cv.personal.phone, cv.personal.email, cv.personal.linkedin].filter(Boolean).join("  |  "), 7.5);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(template === "minimal" ? 21 : 20);
    doc.setTextColor(15, 36, 59);
    doc.text(cv.personal.name || "Nombre profesional", contentX, y);
    y += 7;
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text(cv.personal.title || "", contentX, y);
    y += 7;
    paragraph([cv.personal.location, cv.personal.phone, cv.personal.email, cv.personal.linkedin].filter(Boolean).join("  |  "), 8);
  }

  if (cv.summary) { heading(labels.profile); paragraph(cv.summary); }
  if (cv.experience.length) {
    heading(labels.experience);
    cv.experience.forEach((entry) => {
      ensureRoom(14);
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(26, 43, 60);
      doc.text(`${entry.position || "Cargo"} — ${entry.company || "Empresa"}`, contentX, y); y += 4.5;
      paragraph([entry.start_date, entry.end_date || "Actualidad", entry.location].filter(Boolean).join(" · "), 8);
      paragraph(entry.description, 8.5);
    });
  }
  if (cv.skills.length) { heading(labels.skills); paragraph(cv.skills.map((item) => item.name || item).join(" · ")); }
  if (cv.education.length) {
    heading(labels.education);
    cv.education.forEach((entry) => paragraph(`${entry.degree || "Formación"} — ${entry.institution || "Institución"}`, 9, "bold"));
  }
  if (cv.certifications.length) {
    heading(labels.certifications);
    cv.certifications.forEach((entry) => {
      paragraph(`${entry.name || "Certificación"} — ${entry.issuer || "Entidad"}${entry.date ? ` · ${entry.date}` : ""}`, 9, "bold");
      if (entry.credential) paragraph(entry.credential, 8.5);
    });
  }
  if (cv.languages.length) { heading(labels.languages); paragraph(cv.languages.map((item) => `${item.name || item}${item.level ? ` (${item.level})` : ""}`).join(" · ")); }
  if (cv.projects.length) {
    heading(labels.projects);
    cv.projects.forEach((entry) => { paragraph(`${entry.name || "Proyecto"}${entry.date ? ` · ${entry.date}` : ""}`, 9, "bold"); paragraph(entry.description, 8.5); });
  }
  return doc;
}

export function exportCvPdf(cv) {
  createCvPdf(cv).save("cv-ats.pdf");
}
