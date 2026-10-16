# -*- coding: utf-8 -*-
r"""
Generador Maestro de CV ATS para Andrés Gallo Parra
Genera todos los formatos: .cvb, .docx, .txt, .html, .pdf
Ubicaciones de guardado:
  - C:\Users\andre\Downloads
  - c:\Users\andre\Documents\Proyectos26\proyectos\WebProject\public\cv
  - C:\Users\andre\.cvbuilder
"""
import os
import sys
import json
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

# ReportLab para PDF
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether, ListFlowable, ListItem
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# Importar modelos y datos base
WEB_PROJECT_DIR = Path(r"c:\Users\andre\Documents\Proyectos26\proyectos\WebProject")
sys.path.insert(0, str(WEB_PROJECT_DIR / "cv_builder"))

from scratch_generator import (
    build_cv_data, to_web_portable_cvb,
    EXPERIENCE_CONSOLIDADA, EXPERIENCE_CRONOLOGICA,
    PERSONAL_INFO, SUMMARY_TEXT, SKILLS_LIST,
    EDUCATION_LIST, CERTIFICATIONS_LIST, PROJECTS_LIST,
    LANGUAGES_LIST, TARGET_JOB
)
from core.exporter import _get_jinja_env
from core.storage import save as save_cvb_desktop

DESTINATIONS = [
    Path(r"C:\Users\andre\Downloads"),
    WEB_PROJECT_DIR / "public" / "cv",
    Path.home() / ".cvbuilder",
]

for d in DESTINATIONS:
    d.mkdir(parents=True, exist_ok=True)


# ═════════════════════════════════════════════════════════════════════════════
# 1. EXPORTADOR DOCX (MICROSOFT WORD ATS)
# ═════════════════════════════════════════════════════════════════════════════
def add_heading_with_bottom_border(doc, title_text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    
    run = p.add_run(title_text.upper())
    run.font.name = "Calibri"
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = RGBColor(11, 32, 56) # Azul corporativo oscuro

    # Borde inferior nativo en Word XML
    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml(r'<w:pBdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
                     r'<w:bottom w:val="single" w:sz="6" w:space="1" w:color="0B2038"/>'
                     r'</w:pBdr>')
    pPr.append(pBdr)


def generate_docx(cv_data, output_path, is_consolidated=True):
    doc = Document()
    
    # Márgenes compactos de 0.6 pulgadas (1.52 cm) para optimizar a 2 páginas
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.55)
        section.bottom_margin = Inches(0.55)
        section.left_margin = Inches(0.65)
        section.right_margin = Inches(0.65)
        section.page_width = Inches(8.27)  # A4
        section.page_height = Inches(11.69)

    # 1. Encabezado Personal
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(2)
    run_name = p_name.add_run(cv_data.personal.name)
    run_name.font.name = "Calibri"
    run_name.font.size = Pt(18)
    run_name.font.bold = True
    run_name.font.color.rgb = RGBColor(11, 32, 56)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run(cv_data.personal.title)
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(11)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(70, 80, 95)

    p_contact = doc.add_paragraph()
    p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_contact.paragraph_format.space_after = Pt(8)
    contact_parts = [
        cv_data.personal.location,
        cv_data.personal.phone,
        cv_data.personal.email,
        cv_data.personal.linkedin.replace("https://www.", "").replace("https://", ""),
        cv_data.personal.website.replace("https://", "")
    ]
    run_contact = p_contact.add_run("  •  ".join(filter(bool, contact_parts)))
    run_contact.font.name = "Calibri"
    run_contact.font.size = Pt(9.5)
    run_contact.font.color.rgb = RGBColor(60, 70, 85)

    # 2. Resumen Profesional
    add_heading_with_bottom_border(doc, "Resumen Profesional")
    p_sum = doc.add_paragraph()
    p_sum.paragraph_format.space_after = Pt(6)
    p_sum.paragraph_format.line_spacing = 1.15
    run_sum = p_sum.add_run(cv_data.summary.text)
    run_sum.font.name = "Calibri"
    run_sum.font.size = Pt(9.5)

    # 3. Habilidades Técnicas
    add_heading_with_bottom_border(doc, "Habilidades Técnicas")
    cats = {}
    for s in cv_data.skills:
        cat = s.category or "General"
        cats.setdefault(cat, []).append(s.name)
    
    for cat_name, items in cats.items():
        p_sk = doc.add_paragraph()
        p_sk.paragraph_format.space_after = Pt(2)
        p_sk.paragraph_format.line_spacing = 1.1
        run_cat = p_sk.add_run(f"• {cat_name}: ")
        run_cat.font.name = "Calibri"
        run_cat.font.size = Pt(9.5)
        run_cat.font.bold = True
        run_cat.font.color.rgb = RGBColor(25, 35, 45)
        
        run_items = p_sk.add_run(", ".join(items))
        run_items.font.name = "Calibri"
        run_items.font.size = Pt(9.5)

    # 4. Experiencia Profesional
    add_heading_with_bottom_border(doc, "Experiencia Profesional")
    for exp in cv_data.experience:
        p_exp = doc.add_paragraph()
        p_exp.paragraph_format.space_before = Pt(5)
        p_exp.paragraph_format.space_after = Pt(1)
        p_exp.paragraph_format.keep_with_next = True

        run_pos = p_exp.add_run(exp.position)
        run_pos.font.name = "Calibri"
        run_pos.font.size = Pt(10)
        run_pos.font.bold = True
        run_pos.font.color.rgb = RGBColor(11, 32, 56)

        date_str = f"{exp.start_date} – {'Actualidad' if exp.is_current else exp.end_date}"
        run_comp = p_exp.add_run(f"\n{exp.company}  |  {exp.location}  |  {date_str}")
        run_comp.font.name = "Calibri"
        run_comp.font.size = Pt(9)
        run_comp.font.italic = True
        run_comp.font.color.rgb = RGBColor(60, 70, 85)

        for line in exp.description.split("\n"):
            line = line.strip().lstrip("•-* ").strip()
            if not line:
                continue
            p_b = doc.add_paragraph(style="List Bullet")
            p_b.paragraph_format.space_before = Pt(0)
            p_b.paragraph_format.space_after = Pt(1.5)
            p_b.paragraph_format.line_spacing = 1.1
            run_b = p_b.add_run(line)
            run_b.font.name = "Calibri"
            run_b.font.size = Pt(9.2)

    # 5. Educación
    add_heading_with_bottom_border(doc, "Educación")
    for ed in cv_data.education:
        p_ed = doc.add_paragraph()
        p_ed.paragraph_format.space_after = Pt(2)
        run_deg = p_ed.add_run(f"{ed.degree} — {ed.institution} ({ed.start_date} – {ed.end_date})")
        run_deg.font.name = "Calibri"
        run_deg.font.size = Pt(9.5)
        run_deg.font.bold = True
        if ed.description:
            run_ed_desc = p_ed.add_run(f"\n{ed.description}")
            run_ed_desc.font.name = "Calibri"
            run_ed_desc.font.size = Pt(9)
            run_ed_desc.font.italic = True

    # 6. Certificaciones y Especializaciones
    add_heading_with_bottom_border(doc, "Cursos y Certificaciones Clave")
    for c in cv_data.certifications:
        p_c = doc.add_paragraph(style="List Bullet")
        p_c.paragraph_format.space_after = Pt(2)
        run_c_name = p_c.add_run(f"{c.name} ({c.date})")
        run_c_name.font.name = "Calibri"
        run_c_name.font.size = Pt(9.2)
        run_c_name.font.bold = True
        if c.credential_id:
            run_c_cred = p_c.add_run(f" — {c.credential_id}")
            run_c_cred.font.name = "Calibri"
            run_c_cred.font.size = Pt(9)

    # 7. Idiomas
    add_heading_with_bottom_border(doc, "Idiomas")
    p_lang = doc.add_paragraph()
    p_lang.paragraph_format.space_after = Pt(4)
    lang_strs = [f"{l.name}: {l.level}" for l in cv_data.languages]
    run_lang = p_lang.add_run("   •   ".join(lang_strs))
    run_lang.font.name = "Calibri"
    run_lang.font.size = Pt(9.5)

    doc.save(str(output_path))
    print(f"Generated DOCX: {output_path}")


# ═════════════════════════════════════════════════════════════════════════════
# 2. EXPORTADOR TEXTO PLANO ATS (.TXT)
# ═════════════════════════════════════════════════════════════════════════════
def generate_plain_text(cv_data, output_path):
    lines = []
    p = cv_data.personal
    lines.append(p.name.upper())
    lines.append(p.title)
    contact_parts = [p.location, p.phone, p.email, p.linkedin, p.website]
    lines.append(" | ".join(filter(bool, contact_parts)))
    lines.append("")

    lines.append("==================================================")
    lines.append("RESUMEN PROFESIONAL")
    lines.append("==================================================")
    lines.append(cv_data.summary.text)
    lines.append("")

    lines.append("==================================================")
    lines.append("HABILIDADES TÉCNICAS")
    lines.append("==================================================")
    cats = {}
    for s in cv_data.skills:
        cat = s.category or "General"
        cats.setdefault(cat, []).append(s.name)
    for cat_name, items in cats.items():
        lines.append(f"* {cat_name}: {', '.join(items)}")
    lines.append("")

    lines.append("==================================================")
    lines.append("EXPERIENCIA PROFESIONAL")
    lines.append("==================================================")
    for exp in cv_data.experience:
        date_str = f"{exp.start_date} - {'Actualidad' if exp.is_current else exp.end_date}"
        lines.append(f"{exp.position.upper()}")
        lines.append(f"{exp.company} | {exp.location} | {date_str}")
        for b in exp.description.split("\n"):
            clean_b = b.strip().lstrip("•-* ").strip()
            if clean_b:
                lines.append(f"  - {clean_b}")
        lines.append("")

    lines.append("==================================================")
    lines.append("EDUCACIÓN")
    lines.append("==================================================")
    for ed in cv_data.education:
        lines.append(f"* {ed.degree} | {ed.institution} ({ed.start_date} - {ed.end_date})")
        if ed.description:
            lines.append(f"  {ed.description}")
    lines.append("")

    lines.append("==================================================")
    lines.append("CURSOS Y CERTIFICACIONES CLAVE")
    lines.append("==================================================")
    for c in cv_data.certifications:
        lines.append(f"* {c.name} ({c.date}) - {c.credential_id}")
    lines.append("")

    lines.append("==================================================")
    lines.append("IDIOMAS")
    lines.append("==================================================")
    for l in cv_data.languages:
        lines.append(f"* {l.name}: {l.level}")
    lines.append("")

    content = "\n".join(lines)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated TXT: {output_path}")


# ═════════════════════════════════════════════════════════════════════════════
# 3. EXPORTADOR HTML ATS
# ═════════════════════════════════════════════════════════════════════════════
def generate_html(cv_data, output_path):
    env = _get_jinja_env()
    template = env.get_template("template_ats.html")
    html_content = template.render(cv=cv_data)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Generated HTML: {output_path}")


# ═════════════════════════════════════════════════════════════════════════════
# 4. EXPORTADOR PDF DE ALTA PRECISIÓN (REPORTLAB)
# ═════════════════════════════════════════════════════════════════════════════
class NumberedCanvas(canvas.Canvas):
    """Agrega números de página 'Página X de Y' discretos en el pie."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        page_text = f"Andrés Gallo Parra — CV ATS  |  Página {self._pageNumber} de {page_count}"
        self.drawRightString(A4[0] - 40, 25, page_text)
        self.restoreState()


def generate_reportlab_pdf(cv_data, output_path, is_consolidated=True):
    pdf_path = str(output_path)
    # Márgenes de 36 pt (0.5 in) a los lados y vertical
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=38,
        rightMargin=38,
        topMargin=32,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Estilos tipográficos precisos para asegurar 2 páginas exactas
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=21,
        textColor=colors.HexColor("#0b2038"),
        alignment=1, # Centro
        spaceAfter=2,
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor("#334155"),
        alignment=1,
        spaceAfter=4,
    )
    contact_style = ParagraphStyle(
        "DocContact",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#475569"),
        alignment=1,
        spaceAfter=8,
    )
    section_heading_style = ParagraphStyle(
        "DocSectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#0b2038"),
        spaceBefore=7,
        spaceAfter=2,
        keepWithNext=True,
    )
    body_style = ParagraphStyle(
        "DocBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=4,
    )
    job_title_style = ParagraphStyle(
        "DocJobTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=11.5,
        textColor=colors.HexColor("#0b2038"),
        spaceBefore=3,
        keepWithNext=True,
    )
    job_meta_style = ParagraphStyle(
        "DocJobMeta",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#475569"),
        spaceAfter=2,
        keepWithNext=True,
    )
    bullet_style = ParagraphStyle(
        "DocBullet",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.2,
        leading=10.5,
        textColor=colors.HexColor("#1e293b"),
        leftIndent=11,
        firstLineIndent=-11,
        spaceAfter=1.8,
    )

    story = []

    # 1. Header
    story.append(Paragraph(cv_data.personal.name, title_style))
    story.append(Paragraph(cv_data.personal.title, subtitle_style))
    contact_parts = [
        cv_data.personal.location,
        cv_data.personal.phone,
        cv_data.personal.email,
        cv_data.personal.linkedin.replace("https://www.", "").replace("https://", ""),
        cv_data.personal.website.replace("https://", "")
    ]
    story.append(Paragraph(" &nbsp;•&nbsp; ".join(filter(bool, contact_parts)), contact_style))

    def add_section_header(title):
        story.append(Paragraph(title.upper(), section_heading_style))
        story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#0b2038"), spaceBefore=1, spaceAfter=4))

    # 2. Resumen
    add_section_header("Resumen Profesional")
    story.append(Paragraph(cv_data.summary.text, body_style))

    # 3. Habilidades Técnicas
    add_section_header("Habilidades Técnicas")
    cats = {}
    for s in cv_data.skills:
        cat = s.category or "General"
        cats.setdefault(cat, []).append(s.name)
    for cat_name, items in cats.items():
        sk_text = f"<b>• {cat_name}:</b> {', '.join(items)}"
        story.append(Paragraph(sk_text, bullet_style))

    # 4. Experiencia Profesional
    add_section_header("Experiencia Profesional")
    for exp in cv_data.experience:
        date_str = f"{exp.start_date} – {'Actualidad' if exp.is_current else exp.end_date}"
        meta_line = f"{exp.company} &nbsp;|&nbsp; {exp.location} &nbsp;|&nbsp; <b>{date_str}</b>"
        
        entry_flowables = [
            Paragraph(exp.position, job_title_style),
            Paragraph(meta_line, job_meta_style)
        ]
        for line in exp.description.split("\n"):
            clean_b = line.strip().lstrip("•-* ").strip()
            if clean_b:
                entry_flowables.append(Paragraph(f"• {clean_b}", bullet_style))
        entry_flowables.append(Spacer(1, 2))
        
        story.append(KeepTogether(entry_flowables))

    # 5. Educación
    add_section_header("Educación")
    for ed in cv_data.education:
        ed_text = f"<b>{ed.degree}</b> — {ed.institution} ({ed.start_date} – {ed.end_date})"
        if ed.description:
            ed_text += f"<br/><i>{ed.description}</i>"
        story.append(Paragraph(ed_text, body_style))

    # 6. Certificaciones
    add_section_header("Cursos y Certificaciones Clave")
    for c in cv_data.certifications:
        c_text = f"<b>• {c.name} ({c.date})</b>: {c.credential_id}"
        story.append(Paragraph(c_text, bullet_style))

    # 7. Idiomas
    add_section_header("Idiomas")
    lang_strs = [f"<b>{l.name}:</b> {l.level}" for l in cv_data.languages]
    story.append(Paragraph(" &nbsp;&nbsp;•&nbsp;&nbsp; ".join(lang_strs), body_style))

    # Construir documento
    doc.build(story, canvasmaker=NumberedCanvas)
    
    # Contar páginas del PDF generado
    import pypdf
    with open(pdf_path, "rb") as f:
        reader = pypdf.PdfReader(f)
        total_p = len(reader.pages)
    print(f"Generated PDF: {pdf_path} (Total Pages: {total_p})")
    return total_p


# ═════════════════════════════════════════════════════════════════════════════
# 5. EJECUCIÓN PRINCIPAL: GENERAR TODOS LOS FORMATOS
# ═════════════════════════════════════════════════════════════════════════════
def main():
    print("=== INICIANDO GENERACIÓN DE CV ATS & .CVB ===")

    # 1. Preparar CV Data
    cv_consolidado = build_cv_data(EXPERIENCE_CONSOLIDADA, "Andrés Gallo P. - CV ATS Consolidado")
    cv_cronologico = build_cv_data(EXPERIENCE_CRONOLOGICA, "Andrés Gallo P. - CV ATS Cronológico")

    portable_consolidado = to_web_portable_cvb(cv_consolidado, "Andrés Gallo P. - CV ATS Consolidado")
    portable_cronologico = to_web_portable_cvb(cv_cronologico, "Andrés Gallo P. - CV ATS Cronológico")

    versions = [
        ("Andres_Gallo_CV_ATS_Consolidado", cv_consolidado, portable_consolidado, True),
        ("Andres_Gallo_CV_ATS_Cronologico", cv_cronologico, portable_cronologico, False),
    ]

    for base_name, cv_model, portable_dict, is_consolidated in versions:
        print(f"\n--- Procesando: {base_name} ---")
        
        for dest in DESTINATIONS:
            # A. Archivo .cvb (JSON portable para Web y Desktop)
            cvb_path = dest / f"{base_name}.cvb"
            with open(cvb_path, "w", encoding="utf-8") as f:
                json.dump(portable_dict, f, ensure_ascii=False, indent=2)
            print(f"Saved .cvb: {cvb_path}")

            # B. Archivo .json estándar
            json_path = dest / f"{base_name}.json"
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(portable_dict, f, ensure_ascii=False, indent=2)

            # C. Archivo .docx (Word)
            docx_path = dest / f"{base_name}.docx"
            generate_docx(cv_model, docx_path, is_consolidated)

            # D. Archivo .txt (Texto Plano)
            txt_path = dest / f"{base_name}.txt"
            generate_plain_text(cv_model, txt_path)

            # E. Archivo .html
            html_path = dest / f"{base_name}.html"
            generate_html(cv_model, html_path)

            # F. Archivo .pdf
            pdf_path = dest / f"{base_name}.pdf"
            pages = generate_reportlab_pdf(cv_model, pdf_path, is_consolidated)
            print(f"-> {base_name}.pdf tiene {pages} páginas en {dest}")

    # Guardar también como autosave.cvb en ~/.cvbuilder para carga automática en la app de escritorio
    desktop_autosave = Path.home() / ".cvbuilder" / "autosave.cvb"
    with open(desktop_autosave, "w", encoding="utf-8") as f:
        json.dump(portable_consolidado, f, ensure_ascii=False, indent=2)
    print(f"Saved default autosave.cvb for Desktop App: {desktop_autosave}")

    print("\n=== GENERACIÓN COMPLETADA CON ÉXITO ===")


if __name__ == "__main__":
    main()
