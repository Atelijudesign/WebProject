import { normaliseText } from "./cvAts";

export const BIM_KNOWLEDGE = [
  { canonical: "Revit", category: "Software BIM", aliases: ["autodesk revit", "revit structures", "revit structure"] },
  { canonical: "Tekla Structures", category: "Software BIM", aliases: ["tekla", "tekla structure"] },
  { canonical: "Navisworks", category: "Coordinación", aliases: ["navisworks manage", "clash detection", "deteccion de interferencias"] },
  { canonical: "Autodesk Construction Cloud", category: "CDE", aliases: ["acc", "bim 360", "autodesk docs"] },
  { canonical: "Coordinación BIM", category: "Metodología", aliases: ["bim coordination", "coordinacion multidisciplinaria", "coordinacion de especialidades"] },
  { canonical: "ISO 19650", category: "Normativa", aliases: ["iso19650", "gestion de informacion bim"] },
  { canonical: "Dynamo", category: "Automatización", aliases: ["dynamo for revit", "programacion visual"] },
  { canonical: "pyRevit", category: "Automatización", aliases: ["pyrevit", "revit python"] },
  { canonical: "AutoCAD", category: "CAD", aliases: ["autocad", "dibujo cad"] },
  { canonical: "AISC", category: "Normativa estructural", aliases: ["aisc 360", "aisc 341"] },
  { canonical: "ACI", category: "Normativa estructural", aliases: ["aci 318"] },
  { canonical: "NCh2369", category: "Normativa chilena", aliases: ["nch 2369"] },
  { canonical: "NCh433", category: "Normativa chilena", aliases: ["nch 433"] },
  { canonical: "Acero estructural", category: "Disciplina", aliases: ["estructuras de acero", "steel structures"] },
  { canonical: "Hormigón armado", category: "Disciplina", aliases: ["concreto armado", "reinforced concrete"] },
];

export const GENERAL_KNOWLEDGE = [
  { canonical: "Microsoft Excel", category: "Productividad", aliases: ["excel", "tablas dinamicas", "power query"] },
  { canonical: "Power BI", category: "Analítica", aliases: ["powerbi", "business intelligence"] },
  { canonical: "SQL", category: "Datos", aliases: ["sql server", "mysql", "postgresql", "consultas sql"] },
  { canonical: "Python", category: "Tecnología", aliases: ["python", "pandas", "automatizacion con python"] },
  { canonical: "JavaScript", category: "Tecnología", aliases: ["javascript", "typescript", "node.js", "react"] },
  { canonical: "Gestión de proyectos", category: "Gestión", aliases: ["project management", "gestion de proyectos", "planificacion de proyectos"] },
  { canonical: "Metodologías ágiles", category: "Gestión", aliases: ["agile", "scrum", "kanban", "metodologias agiles"] },
  { canonical: "Atención al cliente", category: "Servicio", aliases: ["customer service", "servicio al cliente", "experiencia de cliente"] },
  { canonical: "Ventas B2B", category: "Comercial", aliases: ["b2b", "venta consultiva", "ventas corporativas"] },
  { canonical: "CRM", category: "Comercial", aliases: ["salesforce", "hubspot", "customer relationship management"] },
  { canonical: "Marketing digital", category: "Marketing", aliases: ["seo", "sem", "google ads", "meta ads", "email marketing"] },
  { canonical: "Recursos humanos", category: "Personas", aliases: ["rrhh", "seleccion de personal", "talent acquisition"] },
  { canonical: "Inglés", category: "Idioma", aliases: ["ingles", "english", "bilingue"] },
];

const PROFESSIONAL_KNOWLEDGE = [...BIM_KNOWLEDGE, ...GENERAL_KNOWLEDGE];

const REQUIRED_MARKERS = ["excluyente", "obligatorio", "indispensable", "requisito", "debe", "se requiere", "minimo", "mínimo"];
const DESIRABLE_MARKERS = ["deseable", "ideal", "se valora", "plus", "preferente", "no excluyente"];
const ACTION_VERBS = ["analice", "aumente", "automatice", "coordine", "cree", "disene", "desarrolle", "gestione", "implemente", "lidere", "mejore", "modele", "negocie", "optimice", "reduje", "resolvi", "supervise", "vendi"];
const NUMBER_PATTERN = /\d+[.,]?\d*\s?(?:%|m2|m3|kg|t|ton|horas?|dias?|semanas?|meses?|personas?|planos?|modelos?|proyectos?)/i;
const WEAK_PHRASES = [
  { phrase: "responsable de", suggestion: "Reemplaza “Responsable de” por un verbo que muestre tu acción concreta." },
  { phrase: "encargado de", suggestion: "Reemplaza “Encargado de” por Coordiné, Gestioné, Implementé u otro verbo preciso." },
  { phrase: "ayude a", suggestion: "Explica qué hiciste directamente y qué cambió como resultado." },
  { phrase: "participe en", suggestion: "Aclara tu aporte individual, la herramienta utilizada y el resultado." },
  { phrase: "diversas tareas", suggestion: "Sustituye “diversas tareas” por actividades y resultados específicos." },
  { phrase: "trabaje en", suggestion: "Describe la acción concreta realizada, no solo el contexto de trabajo." },
];

function cvSearchText(cv) {
  return normaliseText(JSON.stringify({ summary: cv.summary, experience: cv.experience, education: cv.education, skills: cv.skills, projects: cv.projects, languages: cv.languages }));
}

function detectConcepts(text) {
  const normalized = normaliseText(text);
  return PROFESSIONAL_KNOWLEDGE.filter((concept) => [concept.canonical, ...concept.aliases].some((term) => normalized.includes(normaliseText(term))));
}

export function classifyJobRequirements(description = "") {
  const fragments = description.split(/\n|(?<=[.!?;])\s+/).map((fragment) => fragment.replace(/^[-•*]\s*/, "").trim()).filter((fragment) => fragment.length >= 8);
  return fragments.map((text, index) => {
    const normalized = normaliseText(text);
    const priority = DESIRABLE_MARKERS.some((marker) => normalized.includes(normaliseText(marker)))
      ? "desirable"
      : REQUIRED_MARKERS.some((marker) => normalized.includes(normaliseText(marker))) ? "required" : "context";
    return { id: `${priority}-${index}`, text, priority, concepts: detectConcepts(text).map((concept) => concept.canonical) };
  });
}

export function analyzeSemanticMatch(cv) {
  const requirements = classifyJobRequirements(cv.targetJob?.description || "");
  const text = cvSearchText(cv);
  const relevantConcepts = [...new Map(requirements.flatMap((requirement) => requirement.concepts).map((canonical) => [canonical, PROFESSIONAL_KNOWLEDGE.find((concept) => concept.canonical === canonical)])).values()].filter(Boolean);
  const concepts = relevantConcepts.map((concept) => {
    const matchedAlias = [concept.canonical, ...concept.aliases].find((term) => text.includes(normaliseText(term))) || "";
    return { ...concept, matched: Boolean(matchedAlias), matchedAlias };
  });
  const required = requirements.filter((requirement) => requirement.priority === "required");
  const desirable = requirements.filter((requirement) => requirement.priority === "desirable");
  return {
    requirements,
    required,
    desirable,
    concepts,
    matchedConcepts: concepts.filter((concept) => concept.matched),
    missingConcepts: concepts.filter((concept) => !concept.matched),
  };
}

export function buildSummaryDraft(cv) {
  const title = cv.personal?.title?.trim() || cv.targetJob?.title?.trim() || "Profesional";
  const skills = (cv.skills || []).map((skill) => skill.name || skill).filter(Boolean).slice(0, 4);
  const domains = detectConcepts(cvSearchText(cv)).filter((concept) => !skills.some((skill) => normaliseText(skill).includes(normaliseText(concept.canonical)))).slice(0, 2).map((concept) => concept.canonical);
  const strengths = [...skills, ...domains].slice(0, 4);
  if (!strengths.length) return "";
  return `${title} con experiencia demostrable en ${strengths.join(", ")}. Enfocado/a en aportar resultados verificables, coordinación efectiva y mejora continua en proyectos técnicos.`;
}

export function buildSummaryVariants(cv) {
  const title = cv.personal?.title?.trim() || cv.targetJob?.title?.trim() || "Profesional";
  const skills = (cv.skills || []).map((skill) => skill.name || skill).filter(Boolean).slice(0, 4);
  if (!skills.length) return [];
  const strengths = skills.join(", ");
  const evidence = (cv.experience || []).map((entry) => entry.description || "").find((description) => NUMBER_PATTERN.test(description));
  const evidenceSentence = evidence ? " con resultados cuantificables registrados en su experiencia" : " con foco en resultados verificables";
  return [
    { id: "brief", label: "Breve", text: `${title} con experiencia en ${strengths}${evidenceSentence}.` },
    { id: "technical", label: "Técnico", text: `${title} especializado/a en ${strengths}. Experiencia aplicando herramientas y métodos relevantes para entregar resultados verificables, calidad y mejora continua.` },
    { id: "executive", label: "Ejecutivo", text: `${title} orientado/a a resultados, con fortalezas en ${strengths}. Capacidad para coordinar prioridades, colaborar con equipos y convertir objetivos en mejoras medibles.` },
  ];
}

export function detectWritingIssues(cv) {
  const sources = [
    { section: "Resumen", text: cv.summary || "" },
    ...(cv.experience || []).map((entry, index) => ({ section: entry.position || `Experiencia ${index + 1}`, text: entry.description || "" })),
  ];
  const issues = [];
  sources.forEach((source) => {
    const normalized = normaliseText(source.text);
    WEAK_PHRASES.forEach((rule) => {
      if (normalized.includes(rule.phrase)) issues.push({ section: source.section, phrase: rule.phrase, suggestion: rule.suggestion });
    });
    if (source.text.length > 700) issues.push({ section: source.section, phrase: "texto extenso", suggestion: "Reduce el bloque y conserva solo logros relevantes para la vacante." });
  });
  return issues;
}

export function coachAchievements(cv) {
  return (cv.experience || []).map((entry, index) => {
    const description = String(entry.description || "").trim();
    const words = normaliseText(description).split(/[^a-z0-9]+/).filter(Boolean).slice(0, 8);
    const hasActionVerb = ACTION_VERBS.some((verb) => words.includes(verb));
    const hasMetric = NUMBER_PATTERN.test(description);
    const prompts = [];
    if (!hasActionVerb) prompts.push("Empieza con un verbo de acción que describa exactamente tu aporte.");
    if (!hasMetric) prompts.push("Añade una magnitud verificable: cantidad, plazo, porcentaje, superficie o ahorro.");
    if (!description) prompts.push("Describe una tarea real, la herramienta utilizada y el resultado obtenido.");
    return {
      index,
      label: `${entry.position || "Experiencia"}${entry.company ? ` · ${entry.company}` : ""}`,
      hasActionVerb,
      hasMetric,
      prompts,
      framework: `${hasActionVerb ? "[Verbo utilizado]" : "[Verbo de acción]"} [tarea real] usando [herramienta o método] y logré [resultado verificable].`,
    };
  });
}

export function getAssistantInsights(cv) {
  return {
    semantic: analyzeSemanticMatch(cv),
    summaryDraft: buildSummaryDraft(cv),
    summaryVariants: buildSummaryVariants(cv),
    achievements: coachAchievements(cv),
    writingIssues: detectWritingIssues(cv),
  };
}
