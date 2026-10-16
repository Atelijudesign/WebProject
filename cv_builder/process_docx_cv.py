# -*- coding: utf-8 -*-
r"""
Generador Maestro del CV de Andrés Gallo a partir de CV_Andres_Gallo.docx
Enfoque estricto: Diseñador Estructural / Modelador BIM (Acero y Hormigón).
Elimina cualquier designación de "Coordinador" para centrarse en:
  - Diseño y modelado estructural 3D en Revit Structures y Tekla Structures
  - Detallamiento de conexiones de acero y enfierraduras (Rebar)
  - Planos de taller (Singles, Assemblies) y montaje
  - Cubicaciones (BOM) y automatización con Python, Dynamo, pyRevit y AutoLISP
  - Unificación de empresas con países explícitos (Chile, México, Argentina)
"""
import os
import sys
import json
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

WEB_PROJECT_DIR = Path(r"c:\Users\andre\Documents\Proyectos26\proyectos\WebProject")
sys.path.insert(0, str(WEB_PROJECT_DIR / "cv_builder"))

from core.models import (
    CVData, PersonalInfo, SummarySection, TargetJob,
    ExperienceEntry, EducationEntry, SkillEntry,
    LanguageEntry, CertificationEntry, ProjectEntry
)
from core.exporter import _get_jinja_env

DESTINATIONS = [
    Path(r"C:\Users\andre\Downloads"),
    WEB_PROJECT_DIR / "public" / "cv",
    Path.home() / ".cvbuilder",
]

for d in DESTINATIONS:
    d.mkdir(parents=True, exist_ok=True)

# ─── 1. DATOS PERSONALES Y CONTACTO ──────────────────────────────────────────
PERSONAL_INFO = PersonalInfo(
    name="Andrés Gallo Parra",
    title="Diseñador Estructural  |  Modelador BIM  |  Acero y Hormigón",
    email="andresgallo@pm.me",
    phone="+56 9 4060 0861",
    location="Santiago, Chile",
    linkedin="https://www.linkedin.com/in/andresgallop/",
    github="https://github.com/Atelijudesign",
    website="https://ateliju.com",
)

TARGET_JOB = TargetJob(
    title="Diseñador Estructural / Modelador BIM",
    description=(
        "Se busca Diseñador Estructural y Modelador BIM Senior con dominio de Revit Structures, "
        "Tekla Structures, SmartPlant 3D, Advance Steel, AutoCAD, Navisworks Manage e ISO 19650. Experiencia en modelado y "
        "detallamiento estructural de hormigón armado y acero estructural, conexiones metálicas, enfierraduras "
        "(Rebar), planos de taller y montaje, cubicación (BOM) y automatización con Python, Dynamo, pyRevit y AutoLISP."
    ),
)

# Resumen conciso y enfocado estrictamente como Diseñador Estructural / Modelador BIM
SUMMARY_TEXT = (
    "Diseñador Estructural y Modelador BIM Senior con más de 15 años de trayectoria y dominio en minería, "
    "vialidad, aeropuertos, celulosa e industria en Chile, México y Argentina. "
    "Especialista en modelado 3D y detalle de estructuras de acero estructural y hormigón armado, conexiones metálicas, "
    "enfierraduras (Rebar), cubicación (BOM) y planos con Revit Structures, "
    "Tekla Structures, SmartPlant 3D y Navisworks bajo ISO 19650. Automatizaciones con Python, pyRevit, Revit API, Dynamo y AutoLISP."
)

# ─── 2. HABILIDADES TÉCNICAS CATEGORIZADAS ───────────────────────────────────
SKILLS_LIST = [
    # Modelado BIM
    SkillEntry(name="SmartPlant 3D", level=5, category="Modelado BIM"),
    SkillEntry(name="Revit Structures", level=5, category="Modelado BIM"),
    SkillEntry(name="Tekla Structures", level=5, category="Modelado BIM"),
    SkillEntry(name="Advance Steel", level=4, category="Modelado BIM"),
    SkillEntry(name="AutoCAD", level=5, category="Modelado BIM"),

    # Revisión & Entornos BIM
    SkillEntry(name="Navisworks Manage", level=5, category="Revisión & Entornos BIM"),
    SkillEntry(name="Autodesk Construction Cloud (ACC)", level=5, category="Revisión & Entornos BIM"),
    SkillEntry(name="Tekla Model Sharing", level=5, category="Revisión & Entornos BIM"),
    SkillEntry(name="Metodología BIM (ISO 19650)", level=5, category="Revisión & Entornos BIM"),
    SkillEntry(name="ReCap", level=4, category="Revisión & Entornos BIM"),

    # Especialidades Estructurales
    SkillEntry(name="Conexiones de Acero (AISC/NCh)", level=5, category="Especialidad Estructural"),
    SkillEntry(name="Hormigón Armado y Enfierraduras (Rebar)", level=5, category="Especialidad Estructural"),
    SkillEntry(name="Planos de Fabricación y Montaje", level=5, category="Especialidad Estructural"),
    SkillEntry(name="Cuantificación de Materiales (BOM)", level=5, category="Especialidad Estructural"),
    SkillEntry(name="Bancos de Ductos y Obras Civiles", level=4, category="Especialidad Estructural"),

    # Automatización y Desarrollo
    SkillEntry(name="Python & pyRevit", level=4, category="Automatización & Desarrollo"),
    SkillEntry(name="Dynamo", level=4, category="Automatización & Desarrollo"),
    SkillEntry(name="Revit API", level=4, category="Automatización & Desarrollo"),
    SkillEntry(name="AutoLISP", level=4, category="Automatización & Desarrollo"),
    SkillEntry(name="Git & SQL", level=4, category="Automatización & Desarrollo"),
    SkillEntry(name="HTML5 & CSS3", level=4, category="Automatización & Desarrollo"),
    SkillEntry(name="Microsoft Excel Avanzado", level=5, category="Automatización & Desarrollo"),
]

# ─── 3. EXPERIENCIA PROFESIONAL UNIFICADA POR ERAS Y PAÍSES ──────────────────
EXPERIENCE_UNIFICADA = [
    ExperienceEntry(
        company="GHD",
        position="Diseñador Estructural / Modelador BIM Senior — Minería, Industria e Infraestructura",
        start_date="2024-12",
        end_date="Actualidad",
        is_current=True,
        location="Chile · Canadá · Internacional",
        description=(
            "• Modele en Revit Structures y Tekla obras de minería y litio: piscinas de concentrado (Minera Los Pelambres - MLP), piscinas de refino (BHP), remoción Tranque Pérez Caldera PCTR (12.000 m3) y fundaciones para centrífuga (Albemarle).\n"
            "• Desarrolle ingeniería de detalle y refuerzo de vigas carrilera de acero estructural para Normalización Puentes Grúa DSAL (Codelco) bajo normas CMAA-70.\n"
            "• Diseñe andenes de estaciones ferroviarias Tren Santiago-Batuco (EFE) y viaducto Garden City Skyway [Canadá] en hormigón armado y acero, federando en Navisworks Manage.\n"
            "• Coordino obras civiles de subestación eléctrica (filtro de armónicos 23 kV) y protección contra socavación, procesando nubes de puntos ReCap y CDE en Autodesk Construction Cloud (ACC)."
        ),
    ),
    ExperienceEntry(
        company="Arcadis · AFRY",
        position="Diseñador Estructural / Modelador BIM Senior — Minería, Celulosa e Industria",
        start_date="2022-12",
        end_date="2024-11",
        is_current=False,
        location="Chile · México · Argentina",
        description=(
            "• Minera Arqueros [Chile]: Modelé en Revit Structures, Advance Steel y SmartPlant 3D chancador primario y Conexiones de Acero (AISC/NCh) con Planos de Fabricación y Montaje.\n"
            "• MP05 Absormex [México] y CMPC [Chile]: Desarrollé ingeniería de detalle en acero estructural para 8.000 m2 de nave industrial papelera bajo Metodología BIM (ISO 19650).\n"
            "• Softys Zárate [Argentina]: Modelé Bancos de Ductos y Obras Civiles pesadas y plataformas industriales.\n"
            "• Automatización: Desarrollé scripts en Python & pyRevit y macros en Microsoft Excel Avanzado para Cuantificación de Materiales (BOM)."
        ),
    ),
    ExperienceEntry(
        company="Sincal · CJV Construction · Sirve S.A.",
        position="Diseñador Estructural / Modelador BIM Senior — Aviación, Vialidad y Salud",
        start_date="2015-05",
        end_date="2022-12",
        is_current=False,
        location="Chile",
        description=(
            "• Aeropuerto AMB [Chile]: Modelé 320.000 m2 de acero estructural para Terminal T2 y espigones en Revit y Navisworks Manage, resolviendo colisiones críticas con redes MEP.\n"
            "• 9 Pasarelas Peatonales y Puentes [Chile]: Modelé en Tekla Structures pasarelas viales en Hormigón Armado y Enfierraduras (Rebar), con uniones y cubicación de materiales.\n"
            "• Complejo Los Libertadores y Red Hospitalaria [Chile]: Modelé 35.000 m2 con aisladores sísmicos y hospitales Dr. Fricke, Marga Marga y Félix Bulnes con Tekla y Revit.\n"
            "• Trabajo Colaborativo: Coordiné modelos multiusuario con Tekla Model Sharing y Autodesk Construction Cloud (ACC)."
        ),
    ),
    ExperienceEntry(
        company="Typsa · JQ Proyectos · Fusi",
        position="Diseñador Estructural & Detallador Tekla Structures — Metro y Edificación",
        start_date="2010-01",
        end_date="2015-03",
        is_current=False,
        location="Chile",
        description=(
            "• Metro de Santiago (L3 y L6) [Chile]: Modelé obras civiles y talleres técnicos en Tekla Structures y AutoCAD, emitiendo más de 450 planos de armaduras y hormigones para TYPSA.\n"
            "• Fabricación Metálica [Chile]: Detallé estructuras en acero estructural generando Planos de Fabricación y Montaje y listas de corte CNC para más de 12 proyectos.\n"
            "• Gestión Técnica & Automatización: Implementé rutinas en AutoLISP y Revit API, administré bases de datos con Git & SQL y desarrollé visores con HTML5 & CSS3.\n"
            "• Supervisión: Controlé tolerancias dimensionales en maestranza y montaje estructural en terreno."
        ),
    ),
]

# ─── 4. FORMACIÓN ACADÉMICA ──────────────────────────────────────────────────
EDUCATION_LIST = [
    EducationEntry(
        institution="Instituto Profesional Iplacex",
        degree="Ingeniería en Construcción",
        field_of_study="Construcción e Ingeniería Civil",
        start_date="2023",
        end_date="En curso",
        description="Formación en gestión de obras, cálculo estructural, tecnología de materiales y administración de proyectos.",
    ),
    EducationEntry(
        institution="Liceo Politécnico Galvarino N°2",
        degree="Técnico de Nivel Medio en Dibujo Técnico",
        field_of_study="Dibujo y Geometría Técnica",
        start_date="2003",
        end_date="2005",
        description="Planimetría normalizada, geometría descriptiva, proyecciones axonométricas y dibujo de ingeniería. Práctica en Ilustre Municipalidad de Lampa (2006).",
    ),
]

# ─── 5. CURSOS Y CAPACITACIÓN CLAVE ──────────────────────────────────────────
CERTIFICATIONS_LIST = [
    CertificationEntry(
        name="Especialización Avanzada en Revit Structures & BIM",
        issuer="Autodesk / KonstruEDU / AEC Collection",
        date="2017 – 2024",
        credential_id="Revit Structures 2021 · Colaboración · Plantillas · Plantas Industriales AEC Collection",
    ),
    CertificationEntry(
        name="Metodología BIM ISO 19650 & Detección de Interferencias",
        issuer="Capacitación Profesional BIM",
        date="2021 – 2023",
        credential_id="ISO 19650 Infraestructuras Lineales · Navisworks Advanced Clash Detection & Timeliner 4D",
    ),
    CertificationEntry(
        name="Automatización de Procesos & Programación Técnica",
        issuer="Academia de Automatización BIM",
        date="2021 – 2023",
        credential_id="Revit API · pyRevit · Dynamo · AutoLISP · Python · Git · SQL",
    ),
]

# ─── 6. PROYECTOS DESTACADOS CON PAÍSES ──────────────────────────────────────
PROJECTS_LIST = [
    ProjectEntry(
        name="Ampliación Aeropuerto Internacional Arturo Merino Benítez [Chile]",
        date="2018 – 2019",
        technologies="Revit Structures, Navisworks",
        description="Modelado BIM estructural de 320.000 m² de infraestructura aeroportuaria: Terminal 2 (T2M), espigones T2D/T2F y estacionamientos.",
    ),
    ProjectEntry(
        name="Máquina Papelera MP05 — Absormex [México]",
        date="2022 – 2024",
        technologies="Revit Structures, ACC, Navisworks",
        description="Ingeniería de detalle estructural y arquitectura para 8.000 m² de nave industrial pesada en México.",
    ),
    ProjectEntry(
        name="Nuevo Complejo Fronterizo Los Libertadores [Chile]",
        date="2015 – 2017",
        technologies="Revit, Tekla Structures, Navisworks",
        description="Modelado BIM para 35.000 m² de complejo sismorresistente con aisladores sísmicos en alta cordillera.",
    ),
    ProjectEntry(
        name="Metro de Santiago — Líneas 3 y 6 [Chile]",
        date="2014 – 2015",
        technologies="AutoCAD, Revit, Cubicaciones Civiles",
        description="Planos estructurales y cubicación de obras civiles para 10 instalaciones técnicas de transporte subterráneo.",
    ),
    ProjectEntry(
        name="Planta de Tratamiento de Aguas Softys Zárate [Argentina]",
        date="2023",
        technologies="Revit Structures, BIM 360",
        description="Modelado de sistemas estructurales, bancos de ductos subterráneos y movimiento de tierras para planta en Zárate, Argentina.",
    ),
    ProjectEntry(
        name="Red de 9 Pasarelas Viales y Puentes [Chile]",
        date="2021 – 2022",
        technologies="Tekla Structures, Navisworks",
        description="Modelado 3D, enfierraduras y cuantificación de materiales para 9 pasarelas peatonales y puentes viales en Chile.",
    ),
]

LANGUAGES_LIST = [
    LanguageEntry(name="Español", level="Nativo"),
    LanguageEntry(name="Inglés", level="Técnico A1 (Lectura de normas AISC/ACI y manuales de ingeniería)"),
]

def build_cv_model():
    return CVData(
        personal=PERSONAL_INFO,
        target_job=TARGET_JOB,
        summary=SummarySection(text=SUMMARY_TEXT),
        experience=EXPERIENCE_UNIFICADA,
        education=EDUCATION_LIST,
        skills=SKILLS_LIST,
        languages=LANGUAGES_LIST,
        certifications=CERTIFICATIONS_LIST,
        projects=PROJECTS_LIST,
        template="ats",
        accent_color="#0b2038",
        font_family="Arial",
    )

def to_web_portable_cvb(cv_data: CVData, project_name: str) -> dict:
    raw = cv_data.model_dump()
    return {
        "version": 1,
        "projectName": project_name,
        "locale": {"country": "Chile", "language": "es"},
        "pageFormat": "a4",
        "template": "ats",
        "personal": raw["personal"],
        "targetJob": raw["target_job"],
        "target_job": raw["target_job"],
        "summary": raw["summary"],
        "experience": raw["experience"],
        "education": raw["education"],
        "certifications": raw["certifications"],
        "skills": raw["skills"],
        "languages": raw["languages"],
        "projects": raw["projects"],
    }

# ═════════════════════════════════════════════════════════════════════════════
# GENERADOR DOCX PROFESIONAL ATS
# ═════════════════════════════════════════════════════════════════════════════
def add_heading_docx(doc, title_text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(9)
    p.paragraph_format.space_after = Pt(2.5)
    p.paragraph_format.keep_with_next = True
    
    run = p.add_run(title_text.upper())
    run.font.name = "Calibri"
    run.font.size = Pt(10.5)
    run.font.bold = True
    run.font.color.rgb = RGBColor(11, 32, 56)

    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml(r'<w:pBdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
                     r'<w:bottom w:val="single" w:sz="6" w:space="1" w:color="0B2038"/>'
                     r'</w:pBdr>')
    pPr.append(pBdr)

def generate_docx(cv_data, output_path):
    doc = Document()
    for section in doc.sections:
        section.top_margin = Inches(0.5)
        section.bottom_margin = Inches(0.5)
        section.left_margin = Inches(0.6)
        section.right_margin = Inches(0.6)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)

    # 1. Header
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(2)
    run_name = p_name.add_run(cv_data.personal.name)
    run_name.font.name = "Calibri"
    run_name.font.size = Pt(17)
    run_name.font.bold = True
    run_name.font.color.rgb = RGBColor(11, 32, 56)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(3)
    run_title = p_title.add_run(cv_data.personal.title)
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(10.5)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(70, 80, 95)

    p_contact = doc.add_paragraph()
    p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_contact.paragraph_format.space_after = Pt(6)
    contact_parts = [
        cv_data.personal.location,
        cv_data.personal.phone,
        cv_data.personal.email,
        cv_data.personal.linkedin.replace("https://www.", "").replace("https://", ""),
        cv_data.personal.website.replace("https://", "")
    ]
    run_contact = p_contact.add_run("  •  ".join(filter(bool, contact_parts)))
    run_contact.font.name = "Calibri"
    run_contact.font.size = Pt(9)
    run_contact.font.color.rgb = RGBColor(60, 70, 85)

    # 2. Resumen
    add_heading_docx(doc, "Resumen Profesional")
    p_sum = doc.add_paragraph()
    p_sum.paragraph_format.space_after = Pt(5)
    p_sum.paragraph_format.line_spacing = 1.15
    run_sum = p_sum.add_run(cv_data.summary.text)
    run_sum.font.name = "Calibri"
    run_sum.font.size = Pt(9.2)

    # 3. Habilidades Técnicas
    add_heading_docx(doc, "Competencias Técnicas")
    cats = {}
    for s in cv_data.skills:
        cat = s.category or "General"
        cats.setdefault(cat, []).append(s.name)
    for cat_name, items in cats.items():
        p_sk = doc.add_paragraph()
        p_sk.paragraph_format.space_after = Pt(1.5)
        p_sk.paragraph_format.line_spacing = 1.1
        run_cat = p_sk.add_run(f"• {cat_name}: ")
        run_cat.font.name = "Calibri"
        run_cat.font.size = Pt(9)
        run_cat.font.bold = True
        run_cat.font.color.rgb = RGBColor(25, 35, 45)
        run_items = p_sk.add_run(", ".join(items))
        run_items.font.name = "Calibri"
        run_items.font.size = Pt(9)

    # 4. Experiencia Profesional Unificada
    add_heading_docx(doc, "Experiencia Profesional (Diseño & Modelado Estructural)")
    for exp in cv_data.experience:
        p_exp = doc.add_paragraph()
        p_exp.paragraph_format.space_before = Pt(4)
        p_exp.paragraph_format.space_after = Pt(1)
        p_exp.paragraph_format.keep_with_next = True

        run_pos = p_exp.add_run(exp.position)
        run_pos.font.name = "Calibri"
        run_pos.font.size = Pt(9.5)
        run_pos.font.bold = True
        run_pos.font.color.rgb = RGBColor(11, 32, 56)

        date_str = f"{exp.start_date} – {'Actualidad' if exp.is_current else exp.end_date}"
        run_comp = p_exp.add_run(f"\n{exp.company}  |  {exp.location}  |  {date_str}")
        run_comp.font.name = "Calibri"
        run_comp.font.size = Pt(8.8)
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
            run_b.font.size = Pt(8.8)

    # 5. Formación Académica
    add_heading_docx(doc, "Formación Académica")
    for ed in cv_data.education:
        p_ed = doc.add_paragraph()
        p_ed.paragraph_format.space_after = Pt(2)
        run_deg = p_ed.add_run(f"{ed.degree} — {ed.institution} ({ed.start_date} – {ed.end_date})")
        run_deg.font.name = "Calibri"
        run_deg.font.size = Pt(9.2)
        run_deg.font.bold = True
        if ed.description:
            run_ed_desc = p_ed.add_run(f"\n{ed.description}")
            run_ed_desc.font.name = "Calibri"
            run_ed_desc.font.size = Pt(8.6)
            run_ed_desc.font.italic = True

    # 6. Cursos y Certificaciones
    add_heading_docx(doc, "Cursos y Capacitación Clave")
    for c in cv_data.certifications:
        p_c = doc.add_paragraph(style="List Bullet")
        p_c.paragraph_format.space_after = Pt(1.5)
        run_c_name = p_c.add_run(f"{c.name} ({c.date})")
        run_c_name.font.name = "Calibri"
        run_c_name.font.size = Pt(8.8)
        run_c_name.font.bold = True
        if c.credential_id:
            run_c_cred = p_c.add_run(f" — {c.credential_id}")
            run_c_cred.font.name = "Calibri"
            run_c_cred.font.size = Pt(8.6)

    # 7. Idiomas
    add_heading_docx(doc, "Idiomas")
    p_lang = doc.add_paragraph()
    p_lang.paragraph_format.space_after = Pt(3)
    lang_strs = [f"{l.name}: {l.level}" for l in cv_data.languages]
    run_lang = p_lang.add_run("   •   ".join(lang_strs))
    run_lang.font.name = "Calibri"
    run_lang.font.size = Pt(9)

    doc.save(str(output_path))
    print(f"Generated DOCX: {output_path}")

# ═════════════════════════════════════════════════════════════════════════════
# GENERADOR PDF ATS REPORTLAB (EXACTAMENTE 2 PÁGINAS)
# ═════════════════════════════════════════════════════════════════════════════
class NumberedCanvas(canvas.Canvas):
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
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748b"))
        page_text = f"Andrés Gallo Parra — Diseñador Estructural / Modelador BIM  |  Página {self._pageNumber} de {page_count}"
        self.drawRightString(A4[0] - 36, 20, page_text)
        self.restoreState()

def generate_pdf(cv_data, output_path):
    pdf_path = str(output_path)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=28,
        bottomMargin=30
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=17,
        leading=20,
        textColor=colors.HexColor("#0b2038"),
        alignment=1,
        spaceAfter=2,
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#334155"),
        alignment=1,
        spaceAfter=3,
    )
    contact_style = ParagraphStyle(
        "DocContact",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.2,
        leading=10.5,
        textColor=colors.HexColor("#475569"),
        alignment=1,
        spaceAfter=6,
    )
    section_heading_style = ParagraphStyle(
        "DocSectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=11.5,
        textColor=colors.HexColor("#0b2038"),
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True,
    )
    body_style = ParagraphStyle(
        "DocBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.2,
        leading=10.5,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=3,
    )
    job_title_style = ParagraphStyle(
        "DocJobTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.8,
        leading=11,
        textColor=colors.HexColor("#0b2038"),
        spaceBefore=3,
        keepWithNext=True,
    )
    job_meta_style = ParagraphStyle(
        "DocJobMeta",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=7.8,
        leading=9.5,
        textColor=colors.HexColor("#475569"),
        spaceAfter=2,
        keepWithNext=True,
    )
    bullet_style = ParagraphStyle(
        "DocBullet",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1e293b"),
        leftIndent=10,
        firstLineIndent=-10,
        spaceAfter=1.6,
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
        story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#0b2038"), spaceBefore=1, spaceAfter=3))

    # 2. Resumen
    add_section_header("Resumen Profesional")
    story.append(Paragraph(cv_data.summary.text, body_style))

    # 3. Competencias Técnicas
    add_section_header("Competencias Técnicas")
    cats = {}
    for s in cv_data.skills:
        cat = s.category or "General"
        cats.setdefault(cat, []).append(s.name)
    for cat_name, items in cats.items():
        sk_text = f"<b>• {cat_name}:</b> {', '.join(items)}"
        story.append(Paragraph(sk_text, bullet_style))

    # 4. Experiencia Profesional Unificada
    add_section_header("Experiencia Profesional")
    for exp in cv_data.experience:
        date_str = f"{exp.start_date} – {'Actualidad' if exp.is_current else exp.end_date}"
        meta_line = f"{exp.company} &nbsp;|&nbsp; <b>{exp.location}</b> &nbsp;|&nbsp; <b>{date_str}</b>"
        
        entry_flowables = [
            Paragraph(exp.position, job_title_style),
            Paragraph(meta_line, job_meta_style)
        ]
        for line in exp.description.split("\n"):
            clean_b = line.strip().lstrip("•-* ").strip()
            if clean_b:
                entry_flowables.append(Paragraph(f"• {clean_b}", bullet_style))
        entry_flowables.append(Spacer(1, 1.5))
        story.append(KeepTogether(entry_flowables))

    # 5. Formación Académica
    add_section_header("Formación Académica")
    for ed in cv_data.education:
        ed_text = f"<b>{ed.degree}</b> — {ed.institution} ({ed.start_date} – {ed.end_date})"
        if ed.description:
            ed_text += f"<br/><i>{ed.description}</i>"
        story.append(Paragraph(ed_text, body_style))

    # 6. Cursos y Capacitación Clave
    add_section_header("Cursos y Capacitación Clave")
    for c in cv_data.certifications:
        c_text = f"<b>• {c.name} ({c.date})</b>: {c.credential_id}"
        story.append(Paragraph(c_text, bullet_style))

    # 7. Idiomas
    add_section_header("Idiomas")
    lang_strs = [f"<b>{l.name}:</b> {l.level}" for l in cv_data.languages]
    story.append(Paragraph(" &nbsp;&nbsp;•&nbsp;&nbsp; ".join(lang_strs), body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    
    import pypdf
    with open(pdf_path, "rb") as f:
        reader = pypdf.PdfReader(f)
        total_p = len(reader.pages)
    print(f"Generated PDF: {pdf_path} (Total Pages: {total_p})")
    return total_p

# ═════════════════════════════════════════════════════════════════════════════
# GENERADOR TEXTO PLANO (.TXT)
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
    lines.append("COMPETENCIAS TÉCNICAS")
    lines.append("==================================================")
    cats = {}
    for s in cv_data.skills:
        cat = s.category or "General"
        cats.setdefault(cat, []).append(s.name)
    for cat_name, items in cats.items():
        lines.append(f"* {cat_name}: {', '.join(items)}")
    lines.append("")

    lines.append("==================================================")
    lines.append("EXPERIENCIA PROFESIONAL (DISEÑADOR / MODELADOR ESTRUCTURAL)")
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
    lines.append("FORMACIÓN ACADÉMICA")
    lines.append("==================================================")
    for ed in cv_data.education:
        lines.append(f"* {ed.degree} | {ed.institution} ({ed.start_date} - {ed.end_date})")
        if ed.description:
            lines.append(f"  {ed.description}")
    lines.append("")

    lines.append("==================================================")
    lines.append("CURSOS Y CAPACITACIÓN CLAVE")
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
# GENERADOR HTML ATS
# ═════════════════════════════════════════════════════════════════════════════
def generate_html(cv_data, output_path):
    env = _get_jinja_env()
    template = env.get_template("template_ats.html")
    html_content = template.render(cv=cv_data)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Generated HTML: {output_path}")

# ═════════════════════════════════════════════════════════════════════════════
# EJECUCIÓN PRINCIPAL
# ═════════════════════════════════════════════════════════════════════════════
def main():
    print("=== INICIANDO PROCESAMIENTO DE CV: DISEÑADOR ESTRUCTURAL / MODELADOR BIM ===")

    cv_model = build_cv_model()
    portable_dict = to_web_portable_cvb(cv_model, "CV Andrés Gallo P. - Diseñador Estructural / Modelador BIM")

    base_names = [
        "CV_Andres_Gallo",
        "CV_Andres_Gallo_ATS",
        "Andres_Gallo_CV_ATS_Consolidado"
    ]

    for dest in DESTINATIONS:
        for base in base_names:
            cvb_path = dest / f"{base}.cvb"
            with open(cvb_path, "w", encoding="utf-8") as f:
                json.dump(portable_dict, f, ensure_ascii=False, indent=2)
            print(f"Saved: {cvb_path}")

            json_path = dest / f"{base}.json"
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(portable_dict, f, ensure_ascii=False, indent=2)

            docx_path = dest / f"{base}.docx"
            generate_docx(cv_model, docx_path)

            txt_path = dest / f"{base}.txt"
            generate_plain_text(cv_model, txt_path)

            html_path = dest / f"{base}.html"
            generate_html(cv_model, html_path)

            pdf_path = dest / f"{base}.pdf"
            pages = generate_pdf(cv_model, pdf_path)
            print(f"-> {base}.pdf tiene {pages} páginas en {dest}")

    desktop_autosave = Path.home() / ".cvbuilder" / "autosave.cvb"
    with open(desktop_autosave, "w", encoding="utf-8") as f:
        json.dump(portable_dict, f, ensure_ascii=False, indent=2)
    print(f"Default desktop autosave updated: {desktop_autosave}")

    print("\n=== PROCESAMIENTO COMPLETADO EXITOSAMENTE ===")

if __name__ == "__main__":
    main()
