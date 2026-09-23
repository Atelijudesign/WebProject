import { describe, expect, it } from "vitest";
import { normaliseCv } from "../utils/cvAts";
import { analyzeSemanticMatch, buildSummaryDraft, buildSummaryVariants, classifyJobRequirements, coachAchievements, detectWritingIssues } from "../utils/cvAssistant";

describe("BIM CV assistant", () => {
  it("distingue requisitos obligatorios y deseables", () => {
    const requirements = classifyJobRequirements("Es obligatorio dominar Revit Structures. Deseable conocimiento de ISO 19650.");
    expect(requirements.find((item) => item.priority === "required")?.concepts).toContain("Revit");
    expect(requirements.find((item) => item.priority === "desirable")?.concepts).toContain("ISO 19650");
  });

  it("reconoce equivalencias semánticas BIM", () => {
    const cv = normaliseCv({
      targetJob: { description: "Se requiere experiencia en Autodesk Construction Cloud y Clash Detection." },
      skills: [{ name: "BIM 360" }, { name: "Navisworks Manage" }],
    });
    const result = analyzeSemanticMatch(cv);
    expect(result.matchedConcepts.map((concept) => concept.canonical)).toEqual(expect.arrayContaining(["Autodesk Construction Cloud", "Navisworks"]));
    expect(result.missingConcepts).toHaveLength(0);
  });

  it("genera un resumen solo desde datos registrados", () => {
    const draft = buildSummaryDraft(normaliseCv({ personal: { title: "BIM Manager" }, skills: [{ name: "Revit" }, { name: "Dynamo" }] }));
    expect(draft).toContain("BIM Manager");
    expect(draft).toContain("Revit");
    expect(draft).not.toMatch(/\d+ años/);
  });

  it("solicita métricas sin inventarlas", () => {
    const coaching = coachAchievements(normaliseCv({ experience: [{ position: "Modelador BIM", description: "Modelé estructuras en Revit." }] }));
    expect(coaching[0].hasActionVerb).toBe(true);
    expect(coaching[0].hasMetric).toBe(false);
    expect(coaching[0].framework).toContain("[resultado verificable]");
  });

  it("reconoce competencias fuera del ámbito BIM", () => {
    const cv = normaliseCv({
      targetJob: { description: "Se requiere manejo obligatorio de Excel, Power BI y SQL." },
      skills: [{ name: "Microsoft Excel" }, { name: "Power BI" }, { name: "SQL Server" }],
    });
    const result = analyzeSemanticMatch(cv);
    expect(result.matchedConcepts.map((concept) => concept.canonical)).toEqual(expect.arrayContaining(["Microsoft Excel", "Power BI", "SQL"]));
  });

  it("genera variantes de resumen sin inventar años de experiencia", () => {
    const variants = buildSummaryVariants(normaliseCv({ personal: { title: "Analista de Datos" }, skills: [{ name: "SQL" }, { name: "Power BI" }] }));
    expect(variants.map((variant) => variant.id)).toEqual(["brief", "technical", "executive"]);
    expect(variants.every((variant) => variant.text.includes("Analista de Datos"))).toBe(true);
    expect(variants.map((variant) => variant.text).join(" ")).not.toMatch(/\d+ años/);
  });

  it("detecta frases genéricas y propone una corrección", () => {
    const issues = detectWritingIssues(normaliseCv({ experience: [{ position: "Analista", description: "Responsable de diversas tareas y reportes." }] }));
    expect(issues.map((issue) => issue.phrase)).toEqual(expect.arrayContaining(["responsable de", "diversas tareas"]));
    expect(issues.every((issue) => issue.suggestion.length > 20)).toBe(true);
  });
});
