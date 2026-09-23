import { describe, expect, it } from "vitest";
import { EXAMPLE_CV, analyzeAts, createLatex, evaluateCvProgress, extractKeywords, normaliseCv, toPortableCvb } from "../utils/cvAts";

describe("CV ATS utilities", () => {
  it("incluye un CV ficticio completo para la demostración inicial", () => {
    const example = normaliseCv(EXAMPLE_CV);
    expect(example.personal.name).toBe("Valentina Rojas Méndez");
    expect(example.personal.email).toContain("example.com");
    expect(example.experience.length).toBeGreaterThanOrEqual(3);
    expect(evaluateCvProgress(example).percentage).toBe(100);
    expect(analyzeAts(example).score).toBeGreaterThanOrEqual(85);
  });

  it("prioriza términos técnicos en una oferta", () => {
    expect(extractKeywords("Se requiere Revit Structures, Tekla Structures y NCh2369.")).toEqual(
      expect.arrayContaining(["Revit Structures", "Tekla Structures", "NCh2369"]),
    );
  });

  it("distingue términos presentes y pendientes", () => {
    const cv = normaliseCv({
      target_job: { description: "Revit Structures, Tekla Structures y Navisworks Manage" },
      skills: [{ name: "Revit Structures" }],
    });
    const result = analyzeAts(cv);
    expect(result.matched).toContain("Revit Structures");
    expect(result.missing).toContain("Tekla Structures");
  });

  it("calcula un score ATS explicable con cinco categorías", () => {
    const cv = normaliseCv({
      template: "ats",
      personal: { name: "Ana Pérez", title: "BIM Manager", email: "ana@example.com", phone: "+56 9 1234 5678", location: "Santiago" },
      targetJob: { description: "Se requiere Revit Structures y Coordinación BIM" },
      summary: "BIM Manager con experiencia coordinando proyectos multidisciplinarios y optimizando entregables digitales.",
      experience: [{ position: "BIM Manager", company: "ACME", start_date: "2022", end_date: "Actualidad", description: "Coordiné 12 proyectos BIM y reduje interferencias en 25%." }],
      education: [{ degree: "Arquitectura", institution: "Universidad" }],
      skills: [{ name: "Revit Structures" }, { name: "Coordinación BIM" }, { name: "Navisworks Manage" }],
    });
    const result = analyzeAts(cv);
    expect(result.categories).toHaveLength(5);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.categories.reduce((sum, category) => sum + category.score, 0)).toBe(result.score);
    expect(result.metrics.quantifiedAchievements).toBe(1);
  });

  it("recomienda acciones concretas para un CV incompleto", () => {
    const result = analyzeAts(normaliseCv({ targetJob: { description: "Revit Structures y Tekla Structures" } }));
    expect(result.score).toBeLessThan(50);
    expect(result.status.label).toBe("Incompleto");
    expect(result.recommendations.some((item) => item.category === "Contacto")).toBe(true);
    expect(result.recommendations.some((item) => item.category === "Experiencia")).toBe(true);
  });

  it("limita cada categoría a su puntuación máxima", () => {
    const result = analyzeAts(normaliseCv({
      personal: { name: "A", title: "B", email: "a@b.cl", phone: "+56912345678", location: "Chile" },
      targetJob: { description: "Revit Structures" },
      summary: "Perfil profesional con amplia experiencia técnica, coordinación interdisciplinaria y entrega de resultados medibles para proyectos complejos.",
      experience: [{ position: "BIM", company: "X", start_date: "2020", end_date: "2025", description: "Lideré 100 proyectos y reduje costos en 40%." }],
      education: [{ degree: "Título", institution: "Institución" }],
      skills: [{ name: "Revit Structures" }, { name: "BIM" }, { name: "Coordinación" }],
    }));
    result.categories.forEach((category) => expect(category.score).toBeLessThanOrEqual(category.maximum));
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("calcula el progreso por secciones esenciales", () => {
    const cv = normaliseCv({
      personal: { name: "Ana", email: "ana@example.com" },
      targetJob: { title: "BIM Manager", description: "Descripción completa de una vacante con responsabilidades, requisitos técnicos y experiencia solicitada para coordinación BIM." },
      summary: "Profesional BIM con experiencia suficiente para coordinar especialidades, resolver interferencias y mejorar procesos digitales.",
      experience: [{ position: "BIM Manager", company: "ACME", description: "Coordiné proyectos." }],
      skills: [{ name: "Revit" }, { name: "Navisworks" }, { name: "BIM" }],
    });
    const progress = evaluateCvProgress(cv);
    expect(progress.percentage).toBe(100);
    expect(progress.completed).toBe(4);
    expect(progress.sections.experience).toBe(true);
  });

  it("advierte cuando el contenido estimado supera dos páginas", () => {
    const cv = normaliseCv({ summary: Array.from({ length: 1000 }, () => "experiencia").join(" ") });
    const progress = evaluateCvProgress(cv);
    expect(progress.estimatedPages).toBeGreaterThan(2);
    expect(progress.pageWarning).toContain("páginas");
  });

  it("exporta un archivo compatible con el formato de escritorio", () => {
    const portable = toPortableCvb(normaliseCv({ summary: "Perfil web", targetJob: { title: "BIM" } }));
    expect(portable.summary).toEqual({ text: "Perfil web" });
    expect(portable.target_job.title).toBe("BIM");
  });

  it("conserva el formato de hoja elegido para la exportación", () => {
    const cv = normaliseCv({ pageFormat: "letter" });
    expect(cv.pageFormat).toBe("letter");
    expect(createLatex(cv)).toContain("letterpaper");
  });

  it("conserva país e idioma para exportaciones regionales", () => {
    const cv = normaliseCv({ locale: { country: "Estados Unidos", language: "en" }, pageFormat: "letter" });
    expect(cv.locale).toEqual({ country: "Estados Unidos", language: "en" });
    expect(cv.pageFormat).toBe("letter");
  });

  it("admite las plantillas compartidas con la aplicación de escritorio", () => {
    expect(normaliseCv({ template: "technical" }).template).toBe("technical");
    expect(normaliseCv({ template: "desconocida" }).template).toBe("ats");
  });

  it("normaliza y exporta certificaciones profesionales", () => {
    const cv = normaliseCv({ certifications: [{ name: "Certificación BIM", issuer: "Entidad", date: "2025-03", credential: "ABC-123" }] });
    expect(cv.certifications).toHaveLength(1);
    expect(createLatex(cv)).toContain("Certificaciones");
    expect(createLatex(cv)).toContain("Certificación BIM");
  });

  it("ubica evidencia de palabras clave por sección", () => {
    const result = analyzeAts(normaliseCv({
      targetJob: { description: "Se requiere Power BI y SQL." },
      summary: "Analista con dominio de Power BI.",
      experience: [{ position: "Analista", company: "Empresa", description: "Desarrollé consultas SQL para reportes." }],
    }));
    expect(result.evidence.find((item) => item.keyword === "Power")?.locations).toContain("Perfil profesional");
    expect(result.evidence.find((item) => item.keyword === "SQL")?.locations[0]).toContain("Experiencia");
  });

  it("detecta habilidades sin evidencia en experiencias o proyectos", () => {
    const result = analyzeAts(normaliseCv({ skills: [{ name: "Power BI" }, { name: "SQL" }], experience: [{ position: "Analista", description: "Creé consultas SQL." }] }));
    expect(result.unsupportedSkills).toContain("Power BI");
    expect(result.unsupportedSkills).not.toContain("SQL");
  });

  it("detecta fechas inconsistentes y prioriza su corrección", () => {
    const result = analyzeAts(normaliseCv({ experience: [{ position: "Analista", company: "Empresa", start_date: "2025-05", end_date: "2024-01", description: "Analicé 20 reportes." }] }));
    expect(result.qualityIssues.some((issue) => issue.type === "date")).toBe(true);
    expect(result.recommendations.find((item) => item.category === "Fechas")?.priority).toBe("high");
  });
});
