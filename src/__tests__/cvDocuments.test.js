import { describe, expect, it } from "vitest";
import { createPlainTextCv, parseResumeText, validateCvForExport } from "../utils/cvDocuments";
import { normaliseCv } from "../utils/cvAts";

describe("CV document utilities", () => {
  it("incluye certificaciones en la lectura ATS de texto plano", () => {
    const text = createPlainTextCv(normaliseCv({ certifications: [{ name: "ISO 19650", issuer: "Entidad", date: "2025" }] }));
    expect(text).toContain("CERTIFICACIONES");
    expect(text).toContain("ISO 19650");
  });

  it("detecta datos básicos y habilidades desde texto", () => {
    const parsed = parseResumeText(`Ana Pérez\nBIM Manager\nana@example.com | +56 9 1234 5678\n\nPERFIL\nEspecialista en coordinación BIM.\n\nHABILIDADES\nRevit, Navisworks, Dynamo\n\nEXPERIENCIA`);
    expect(parsed.personal.name).toBe("Ana Pérez");
    expect(parsed.personal.email).toBe("ana@example.com");
    expect(parsed.skills.map((skill) => skill.name)).toEqual(["Revit", "Navisworks", "Dynamo"]);
  });

  it("genera una lectura ATS con secciones estándar", () => {
    const text = createPlainTextCv(normaliseCv({
      personal: { name: "Ana Pérez", email: "ana@example.com" },
      summary: "Perfil profesional",
      experience: [{ position: "BIM Manager", company: "ACME", description: "Coordiné modelos." }],
      skills: [{ name: "Revit" }],
    }));
    expect(text).toContain("EXPERIENCIA PROFESIONAL");
    expect(text).toContain("HABILIDADES");
    expect(text).toContain("BIM Manager | ACME");
  });

  it("bloquea exportaciones cuando faltan datos obligatorios", () => {
    const errors = validateCvForExport(normaliseCv({}));
    expect(errors).toHaveLength(4);
    expect(errors.every((error) => error.id && error.section && error.message)).toBe(true);
    expect(errors.find((error) => error.id === "experience")?.section).toBe("experience");
    expect(validateCvForExport(normaliseCv({
      personal: { name: "Ana", email: "ana@example.com" },
      summary: "Perfil",
      experience: [{ position: "BIM", company: "ACME", description: "Coordiné modelos." }],
    }))).toEqual([]);
  });
});
