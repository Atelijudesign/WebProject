import { analyzeAts, normaliseCv } from "./cvAts";

export const CV_WORKSPACE_KEY = "cvats.builder.workspace.v2";
const LEGACY_WORKSPACE_KEY = "atelijudesign.cv-ats-workspace.v1";
export const APPLICATION_STATUSES = ["Borrador", "Postulado", "Entrevista", "Oferta", "Descartado"];

export const EMPTY_WORKSPACE = {
  version: 1,
  drafts: [],
  applications: [],
};

function cloneCv(cv) {
  return normaliseCv(JSON.parse(JSON.stringify(cv)));
}

export function normaliseWorkspace(raw = {}) {
  const { master: discardedMaster, ...safeRaw } = raw;
  return {
    ...EMPTY_WORKSPACE,
    ...safeRaw,
    drafts: Array.isArray(raw.drafts) ? raw.drafts.map((draft) => ({
      id: String(draft.id || ""),
      name: String(draft.name || "CV sin nombre"),
      updatedAt: String(draft.updatedAt || ""),
      cv: cloneCv(draft.cv || {}),
    })) : [],
    applications: Array.isArray(raw.applications) ? raw.applications.map((application) => ({
      id: String(application.id || ""),
      company: String(application.company || ""),
      title: String(application.title || ""),
      url: String(application.url || ""),
      date: String(application.date || ""),
      status: APPLICATION_STATUSES.includes(application.status) ? application.status : "Borrador",
      nextActionDate: String(application.nextActionDate || ""),
      nextAction: String(application.nextAction || ""),
      coverLetter: String(application.coverLetter || ""),
      checklist: {
        cvReviewed: Boolean(application.checklist?.cvReviewed),
        coverLetterReady: Boolean(application.checklist?.coverLetterReady),
        linksChecked: Boolean(application.checklist?.linksChecked),
        applicationSent: Boolean(application.checklist?.applicationSent),
        followUpScheduled: Boolean(application.checklist?.followUpScheduled),
      },
      updatedAt: application.updatedAt || "",
      cv: cloneCv(application.cv || {}),
      revisions: Array.isArray(application.revisions) ? application.revisions.slice(-10).map((revision) => ({ ...revision, cv: cloneCv(revision.cv || {}) })) : [],
    })) : [],
  };
}

export function createDraftCopy(workspace, cv, now = new Date().toISOString()) {
  const originalName = cv.projectName?.trim() || "Mi CV ATS";
  const copyName = originalName.toLocaleLowerCase("es-CL").startsWith("copia de") ? `${originalName} 2` : `Copia de ${originalName}`;
  const original = { id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-original`, name: originalName, updatedAt: now, cv: cloneCv(cv) };
  const copy = cloneCv({ ...cv, projectName: copyName });
  return { workspace: { ...workspace, drafts: [original, ...workspace.drafts].slice(0, 20) }, copy };
}

export function readCvWorkspace() {
  if (typeof window === "undefined") return EMPTY_WORKSPACE;
  try {
    window.localStorage.removeItem(LEGACY_WORKSPACE_KEY);
    const saved = window.localStorage.getItem(CV_WORKSPACE_KEY);
    return saved ? normaliseWorkspace(JSON.parse(saved)) : EMPTY_WORKSPACE;
  } catch {
    return EMPTY_WORKSPACE;
  }
}

export function createApplication(workspace, cv, metadata, now = new Date().toISOString()) {
  const application = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    company: metadata.company.trim(),
    title: metadata.title.trim(),
    url: metadata.url.trim(),
    date: metadata.date,
    status: APPLICATION_STATUSES.includes(metadata.status) ? metadata.status : "Borrador",
    nextActionDate: "",
    nextAction: "",
    coverLetter: "",
    checklist: { cvReviewed: false, coverLetterReady: false, linksChecked: false, applicationSent: false, followUpScheduled: false },
    updatedAt: now,
    cv: cloneCv(cv),
    revisions: [],
  };
  return { workspace: { ...workspace, applications: [application, ...workspace.applications] }, application };
}

export function generateCoverLetter(cv, application) {
  const name = cv.personal?.name?.trim() || "Nombre profesional";
  const title = application.title?.trim() || cv.targetJob?.title?.trim() || "el cargo publicado";
  const company = application.company?.trim() || "su organización";
  const skills = (cv.skills || []).map((skill) => skill.name || skill).filter(Boolean).slice(0, 3);
  const achievement = (cv.experience || []).map((entry) => entry.description || "").find((description) => /\d/.test(description));
  const strength = skills.length ? `Mi experiencia en ${skills.join(", ")} se relaciona directamente con los desafíos del cargo.` : "Mi experiencia profesional se relaciona con los desafíos descritos para el cargo.";
  const evidence = achievement ? ` Como referencia, uno de mis logros registrados es: ${achievement.split(/\n|\.(?:\s|$)/)[0].trim()}.` : "";
  return `Estimado equipo de ${company}:\n\nMe interesa postular al cargo de ${title}. ${strength}${evidence}\n\nAdjunto mi CV adaptado para su revisión. Quedo disponible para conversar sobre cómo mi experiencia puede aportar a sus objetivos.\n\nAtentamente,\n${name}`;
}

export function saveApplicationRevision(workspace, applicationId, cv, now = new Date().toISOString()) {
  return {
    ...workspace,
    applications: workspace.applications.map((application) => application.id === applicationId ? {
      ...application,
      updatedAt: now,
      revisions: [...application.revisions, { savedAt: application.updatedAt || now, cv: cloneCv(application.cv) }].slice(-10),
      cv: cloneCv(cv),
    } : application),
  };
}

export function updateApplicationMetadata(workspace, applicationId, patch) {
  return {
    ...workspace,
    applications: workspace.applications.map((application) => application.id === applicationId ? { ...application, ...patch } : application),
  };
}

export function compareCvVersions(left, right) {
  const leftAnalysis = analyzeAts(left);
  const rightAnalysis = analyzeAts(right);
  const leftSkills = new Set((left.skills || []).map((skill) => skill.name || skill));
  const rightSkills = new Set((right.skills || []).map((skill) => skill.name || skill));
  return {
    score: { left: leftAnalysis.score, right: rightAnalysis.score, delta: rightAnalysis.score - leftAnalysis.score },
    experiences: { left: left.experience?.length || 0, right: right.experience?.length || 0 },
    skills: { left: leftSkills.size, right: rightSkills.size },
    addedSkills: [...rightSkills].filter((skill) => !leftSkills.has(skill)),
    removedSkills: [...leftSkills].filter((skill) => !rightSkills.has(skill)),
    matchedKeywords: { left: leftAnalysis.matched.length, right: rightAnalysis.matched.length },
  };
}
