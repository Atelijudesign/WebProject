const SECTION_PATTERN = /^(perfil|resumen|experiencia|educaci[oó]n|formaci[oó]n|habilidades|competencias|idiomas|proyectos)/i;
const EMAIL_PATTERN = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/;
const PHONE_PATTERN = /(?:\+?\d[\d\s()-]{7,}\d)/;
const LINKEDIN_PATTERN = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s|]+/i;

function cleanLines(text) {
  return String(text || "").replace(/\r/g, "").split("\n").map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
}

export function parseResumeText(text) {
  const lines = cleanLines(text);
  const email = text.match(EMAIL_PATTERN)?.[0] || "";
  const phone = text.match(PHONE_PATTERN)?.[0] || "";
  const linkedin = text.match(LINKEDIN_PATTERN)?.[0] || "";
  const headerLines = lines.slice(0, 8).filter((line) => !line.includes(email) && !line.includes(phone) && !LINKEDIN_PATTERN.test(line));
  const name = headerLines.find((line) => line.length >= 3 && line.length <= 70 && !SECTION_PATTERN.test(line)) || "";
  const title = headerLines.find((line) => line !== name && line.length <= 90 && !SECTION_PATTERN.test(line)) || "";
  const summaryStart = lines.findIndex((line) => /^(perfil|resumen)/i.test(line));
  const summaryLines = summaryStart >= 0
    ? lines.slice(summaryStart + 1).findIndex((line) => SECTION_PATTERN.test(line))
    : -1;
  const summary = summaryStart >= 0
    ? lines.slice(summaryStart + 1, summaryLines >= 0 ? summaryStart + 1 + summaryLines : summaryStart + 5).join(" ")
    : "";
  const skillStart = lines.findIndex((line) => /^(habilidades|competencias)/i.test(line));
  const skills = skillStart >= 0
    ? lines.slice(skillStart + 1, skillStart + 8).filter((line) => !SECTION_PATTERN.test(line)).flatMap((line) => line.split(/[,;•·|]/)).map((name) => name.trim()).filter(Boolean).slice(0, 20).map((name) => ({ name, level: 3, category: "" }))
    : [];
  return {
    personal: { name, title, email, phone, location: "", linkedin },
    summary,
    skills,
    sourceText: lines.join("\n"),
  };
}

async function extractPdfText(file) {
  const [pdfjs, workerModule] = await Promise.all([
    import("pdfjs-dist/legacy/build/pdf.mjs"),
    import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default;
  const document = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }
  return pages.join("\n");
}

async function extractDocxText(file) {
  const { default: mammoth } = await import("mammoth/mammoth.browser");
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

export async function importResumeFile(file) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return { ...parseResumeText(await extractPdfText(file)), sourceType: "PDF", filename: file.name };
  if (extension === "docx") return { ...parseResumeText(await extractDocxText(file)), sourceType: "DOCX", filename: file.name };
  throw new Error("Formato no compatible");
}

export function createPlainTextCv(cv) {
  const personal = cv.personal || {};
  const sections = [
    [personal.name, personal.title, [personal.location, personal.phone, personal.email, personal.linkedin].filter(Boolean).join(" | ")].filter(Boolean).join("\n"),
    cv.summary ? `PERFIL PROFESIONAL\n${cv.summary}` : "",
    cv.experience?.length ? `EXPERIENCIA PROFESIONAL\n${cv.experience.map((entry) => `${entry.position || "Cargo"} | ${entry.company || "Empresa"}\n${[entry.start_date, entry.end_date || "Actualidad", entry.location].filter(Boolean).join(" - ")}\n${entry.description || ""}`).join("\n\n")}` : "",
    cv.skills?.length ? `HABILIDADES\n${cv.skills.map((skill) => skill.name || skill).join(" | ")}` : "",
    cv.education?.length ? `EDUCACIÓN\n${cv.education.map((entry) => `${entry.degree || ""} | ${entry.institution || ""}`).join("\n")}` : "",
    cv.certifications?.length ? `CERTIFICACIONES\n${cv.certifications.map((entry) => `${entry.name || ""} | ${entry.issuer || ""}${entry.date ? ` | ${entry.date}` : ""}${entry.credential ? ` | ${entry.credential}` : ""}`).join("\n")}` : "",
    cv.languages?.length ? `IDIOMAS\n${cv.languages.map((entry) => `${entry.name || entry}${entry.level ? ` | ${entry.level}` : ""}`).join("\n")}` : "",
    cv.projects?.length ? `PROYECTOS\n${cv.projects.map((entry) => `${entry.name || "Proyecto"}${entry.date ? ` | ${entry.date}` : ""}\n${entry.description || ""}`).join("\n\n")}` : "",
  ];
  return sections.filter(Boolean).join("\n\n").trim();
}

export function validateCvForExport(cv) {
  const errors = [];
  if (!cv.personal?.name?.trim()) errors.push({ id: "name", section: "personal", message: "Falta el nombre profesional." });
  if (!EMAIL_PATTERN.test(cv.personal?.email || "")) errors.push({ id: "email", section: "personal", message: "El email no es válido." });
  if (!cv.summary?.trim()) errors.push({ id: "summary", section: "personal", message: "Falta el resumen profesional." });
  if (!cv.experience?.some((entry) => entry.position?.trim() && entry.company?.trim() && entry.description?.trim())) errors.push({ id: "experience", section: "experience", message: "Añade una experiencia completa." });
  return errors;
}

export async function createCvDocxBlob(cv) {
  const { Document, HeadingLevel, Packer, Paragraph, TextRun } = await import("docx");
  const textParagraph = (text, options = {}) => new Paragraph({ ...options, children: [new TextRun({ text: String(text || ""), bold: options.bold })] });
  const personal = cv.personal || {};
  const children = [
    textParagraph(personal.name || "Nombre profesional", { heading: HeadingLevel.TITLE, bold: true }),
    textParagraph(personal.title || ""),
    textParagraph([personal.location, personal.phone, personal.email, personal.linkedin].filter(Boolean).join(" | ")),
  ];
  const english = cv.locale?.language === "en";
  const labels = english ? { profile: "Professional summary", experience: "Professional experience", skills: "Skills", education: "Education", certifications: "Certifications", languages: "Languages", projects: "Projects" } : { profile: "Perfil profesional", experience: "Experiencia profesional", skills: "Habilidades", education: "Educación", certifications: "Certificaciones", languages: "Idiomas", projects: "Proyectos" };
  const addSection = (title, paragraphs) => {
    if (!paragraphs.length) return;
    children.push(new Paragraph({ text: title, heading: HeadingLevel.HEADING_1 }));
    children.push(...paragraphs);
  };
  addSection(labels.profile, cv.summary ? [textParagraph(cv.summary)] : []);
  addSection(labels.experience, (cv.experience || []).flatMap((entry) => [
    textParagraph(`${entry.position || "Cargo"} — ${entry.company || "Empresa"}`, { bold: true }),
    textParagraph([entry.start_date, entry.end_date || "Actualidad", entry.location].filter(Boolean).join(" | ")),
    textParagraph(entry.description || ""),
  ]));
  addSection(labels.skills, cv.skills?.length ? [textParagraph(cv.skills.map((skill) => skill.name || skill).join(" | "))] : []);
  addSection(labels.education, (cv.education || []).map((entry) => textParagraph(`${entry.degree || ""} — ${entry.institution || ""}`)));
  addSection(labels.certifications, (cv.certifications || []).flatMap((entry) => [textParagraph(`${entry.name || "Certificación"} — ${entry.issuer || "Entidad"}${entry.date ? ` · ${entry.date}` : ""}`, { bold: true }), ...(entry.credential ? [textParagraph(entry.credential)] : [])]));
  addSection(labels.languages, cv.languages?.length ? [textParagraph(cv.languages.map((entry) => `${entry.name || entry}${entry.level ? ` (${entry.level})` : ""}`).join(" | "))] : []);
  addSection(labels.projects, (cv.projects || []).flatMap((entry) => [textParagraph(`${entry.name || "Proyecto"}${entry.date ? ` — ${entry.date}` : ""}`, { bold: true }), textParagraph(entry.description || "")]));
  return Packer.toBlob(new Document({ sections: [{ properties: {}, children }] }));
}

export function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
