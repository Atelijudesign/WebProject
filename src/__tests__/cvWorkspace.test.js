import { describe, expect, it } from "vitest";
import { normaliseCv } from "../utils/cvAts";
import {
  EMPTY_WORKSPACE, compareCvVersions, createApplication, createDraftCopy, generateCoverLetter, normaliseWorkspace, saveApplicationRevision,
} from "../utils/cvWorkspace";

const baseCv = normaliseCv({
  personal: { name: "Ana", email: "ana@example.com" },
  targetJob: { description: "Revit Structures y Coordinación BIM" },
  skills: [{ name: "Revit Structures" }],
});

describe("CV workspace", () => {
  it("duplica un CV conservando el original en la biblioteca local", () => {
    const cv = normaliseCv({ projectName: "CV Analista", personal: { name: "Ana" } });
    const result = createDraftCopy(normaliseWorkspace({}), cv, "2026-01-01T10:00:00.000Z");
    expect(result.workspace.drafts).toHaveLength(1);
    expect(result.workspace.drafts[0].name).toBe("CV Analista");
    expect(result.copy.projectName).toBe("Copia de CV Analista");
  });

  it("crea una versión independiente por oferta", () => {
    const result = createApplication(EMPTY_WORKSPACE, baseCv, { company: "ACME", title: "BIM Manager", url: "https://example.com", date: "2026-09-21", status: "Postulado" }, "2026-09-21T12:00:00Z");
    expect(result.workspace.applications).toHaveLength(1);
    expect(result.application.company).toBe("ACME");
    expect(result.application.cv).not.toBe(baseCv);
    expect(result.application.checklist.applicationSent).toBe(false);
    expect(result.application.nextActionDate).toBe("");
  });

  it("genera una carta basada solo en datos registrados", () => {
    const cv = normaliseCv({ personal: { name: "Ana Pérez" }, skills: [{ name: "SQL" }, { name: "Power BI" }], experience: [{ description: "Automaticé 12 reportes mensuales." }] });
    const letter = generateCoverLetter(cv, { company: "ACME", title: "Analista de Datos" });
    expect(letter).toContain("ACME");
    expect(letter).toContain("Analista de Datos");
    expect(letter).toContain("SQL");
    expect(letter).toContain("12 reportes");
    expect(letter).not.toMatch(/\d+ años/);
  });

  it("guarda la versión anterior en el historial", () => {
    const created = createApplication(EMPTY_WORKSPACE, baseCv, { company: "ACME", title: "BIM", url: "", date: "", status: "Borrador" }, "2026-09-20T12:00:00Z");
    const updatedCv = normaliseCv({ ...baseCv, skills: [{ name: "Revit Structures" }, { name: "Navisworks Manage" }] });
    const workspace = saveApplicationRevision(created.workspace, created.application.id, updatedCv, "2026-09-21T12:00:00Z");
    expect(workspace.applications[0].revisions).toHaveLength(1);
    expect(workspace.applications[0].cv.skills).toHaveLength(2);
    expect(workspace.applications[0].revisions[0].cv.skills).toHaveLength(1);
  });

  it("compara habilidades y score entre versiones", () => {
    const tailored = normaliseCv({ ...baseCv, skills: [{ name: "Revit Structures" }, { name: "Coordinación BIM" }] });
    const comparison = compareCvVersions(baseCv, tailored);
    expect(comparison.addedSkills).toContain("Coordinación BIM");
    expect(comparison.skills).toEqual({ left: 1, right: 2 });
  });

  it("normaliza estados desconocidos y limita revisiones", () => {
    const workspace = normaliseWorkspace({ master: { personal: { name: "Dato anterior" } }, applications: [{ id: 1, status: "Desconocido", cv: {}, revisions: Array.from({ length: 15 }, (_, index) => ({ savedAt: String(index), cv: {} })) }] });
    expect(workspace.applications[0].status).toBe("Borrador");
    expect(workspace.applications[0].revisions).toHaveLength(10);
    expect(workspace.applications[0].checklist).toEqual({ cvReviewed: false, coverLetterReady: false, linksChecked: false, applicationSent: false, followUpScheduled: false });
    expect(workspace).not.toHaveProperty("master");
  });
});
