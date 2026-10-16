# -*- coding: utf-8 -*-
"""
Script de generación de CV en formato ATS y .cvb para Andrés Gallo Parra.
Genera versiones:
  1. Consolidada por Eras Estratégicas (Óptima 2 Páginas ATS).
  2. Cronológica Optimizada (10 empresas sin textos repetitivos).
"""
import os
import sys
import json
from pathlib import Path

WEB_PROJECT_DIR = Path(r"c:\Users\andre\Documents\Proyectos26\proyectos\WebProject")
sys.path.insert(0, str(WEB_PROJECT_DIR / "cv_builder"))

from core.models import (
    CVData, PersonalInfo, SummarySection, TargetJob,
    ExperienceEntry, EducationEntry, SkillEntry,
    LanguageEntry, CertificationEntry, ProjectEntry
)

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
        "Tekla Structures, Advance Steel, AutoCAD y Navisworks. Experiencia en modelado y detallamiento "
        "estructural de hormigón armado y acero estructural, conexiones metálicas, enfierraduras (Rebar), "
        "planos de taller y montaje, cubicación (BOM) y automatización con Python, Dynamo, pyRevit y AutoLISP."
    ),
)

# Resumen conciso y de alto impacto (entre 80 y 500 caracteres para máxima legibilidad ATS)
SUMMARY_TEXT = (
    "Diseñador Estructural y Modelador BIM Senior con más de 15 años de experiencia en proyectos industriales, "
    "mineros, de infraestructura vial, aeroportuarios, celulosa y salud en Chile, México y Argentina. "
    "Especialista en modelado 3D y detallamiento de estructuras de acero y hormigón armado, conexiones metálicas, "
    "enfierraduras (Rebar), cubicación automatizada (BOM) y planos de ingeniería de detalle con Revit Structures "
    "y Tekla Structures bajo ISO 19650. Desarrollador de automatizaciones con Python, Dynamo, pyRevit y AutoLISP."
)

SKILLS_LIST = [
    SkillEntry(name="Revit Structures", level=5, category="Software BIM & CAD"),
    SkillEntry(name="Tekla Structures", level=5, category="Software BIM & CAD"),
    SkillEntry(name="Navisworks Manage", level=5, category="Software BIM & CAD"),
    SkillEntry(name="Advance Steel", level=4, category="Software BIM & CAD"),
    SkillEntry(name="AutoCAD", level=5, category="Software BIM & CAD"),
    SkillEntry(name="Autodesk Construction Cloud", level=5, category="Software BIM & CAD"),

    SkillEntry(name="Conexiones Metálicas", level=5, category="Especialidad Estructural"),
    SkillEntry(name="Hormigón Armado y Enfierraduras", level=5, category="Especialidad Estructural"),
    SkillEntry(name="Planos de Taller y Montaje", level=5, category="Especialidad Estructural"),
    SkillEntry(name="Cubicación y Listados BOM", level=5, category="Especialidad Estructural"),
    SkillEntry(name="Bancos de Ductos y Obras Civiles", level=4, category="Especialidad Estructural"),

    SkillEntry(name="Metodología BIM (ISO 19650)", level=5, category="Metodología & Gestión"),
    SkillEntry(name="Clash Detection", level=5, category="Metodología & Gestión"),
    SkillEntry(name="Coordinación Interdisciplinaria", level=5, category="Metodología & Gestión"),
    SkillEntry(name="Entornos Comunes CDE", level=5, category="Metodología & Gestión"),

    SkillEntry(name="Python & pyRevit", level=4, category="Automatización & Código"),
    SkillEntry(name="Revit API", level=4, category="Automatización & Código"),
    SkillEntry(name="SQL & Bases de Datos", level=4, category="Automatización & Código"),
    SkillEntry(name="Git", level=4, category="Automatización & Código"),
    SkillEntry(name="Microsoft Excel Avanzado", level=5, category="Automatización & Código"),
]

LANGUAGES_LIST = [
    LanguageEntry(name="Español", level="Nativo"),
    LanguageEntry(name="Inglés", level="Técnico A1 (Lectura de normas AISC/ACI y manuales de ingeniería)"),
]

EDUCATION_LIST = [
    EducationEntry(
        institution="Liceo Politécnico Galvarino N°2",
        degree="Técnico de Nivel Medio en Dibujo Técnico",
        field_of_study="Dibujo y Geometría Técnica",
        start_date="2003",
        end_date="2005",
        description="Especialización en dibujo técnico, geometría descriptiva y normalización de planos.",
    ),
]

CERTIFICATIONS_LIST = [
    CertificationEntry(
        name="Especialización Avanzada en Revit Structures & Entornos BIM",
        issuer="Autodesk / KonstruEDU / AEC Collection",
        date="2021 – 2024",
        credential_id="Revit Structures · Modelado Avanzado · Plantillas y Colaboración",
    ),
    CertificationEntry(
        name="Gestión BIM ISO 19650, Coordinación & Clash Detection",
        issuer="Capacitación Profesional BIM",
        date="2022 – 2023",
        credential_id="ISO 19650 Infraestructuras Lineales · Navisworks Advanced Clash & Timeliner 4D",
    ),
    CertificationEntry(
        name="Automatización de Procesos con Revit API & Programación Técnica",
        issuer="Academia de Automatización BIM",
        date="2022 – 2023",
        credential_id="Revit API · pyRevit · Python · SQL · Git",
    ),
]

PROJECTS_LIST = [
    ProjectEntry(
        name="Ampliación Aeropuerto Internacional AMB",
        date="2018 – 2019",
        technologies="Revit Structures, Navisworks",
        description="Modelado BIM estructural de 320.000 m² de infraestructura: Terminal 2 (T2M), Espigones T2D/T2F y estacionamientos.",
    ),
    ProjectEntry(
        name="Máquina Papelera MP5 — ABSORMEX (México)",
        date="2022 – 2024",
        technologies="Revit Structures, ACC, Navisworks",
        description="Ingeniería de detalle estructural y arquitectura para 8.000 m² de nave industrial pesada.",
    ),
    ProjectEntry(
        name="Paso Fronterizo Los Libertadores (Alta Cordillera)",
        date="2015 – 2017",
        technologies="Revit, Tekla Structures, Navisworks",
        description="Modelado y coordinación BIM para 35.000 m² de complejo sismorresistente con aisladores sísmicos.",
    ),
    ProjectEntry(
        name="Metro de Santiago — Líneas 3 y 6",
        date="2014 – 2015",
        technologies="AutoCAD, Revit, Cubicaciones",
        description="Planos estructurales y cubicación de obras civiles para 10 instalaciones técnicas (talleres, casetas y recintos técnicos).",
    ),
]

# ─── EXPERIENCIA CONSOLIDADA (3 ERAS ESTRATÉGICAS - OPTIMIZADA ATS 2 PÁGINAS) ──
EXPERIENCE_CONSOLIDADA = [
    ExperienceEntry(
        company="GHD · ARCADIS · AFRY",
        position="Diseñador Estructural / Modelador BIM Senior — Minería, Celulosa e Industria",
        start_date="2022-12",
        end_date="Actualidad",
        is_current=True,
        location="Chile · México · Argentina",
        description=(
            "Desarrolle el modelado BIM estructural avanzado y la emision de planos de detalle para megaproyectos industriales, mineros y de celulosa.\n"
            "• Minería: Modele estructuras de hormigon armado y acero estructural pesado para el Chancador Primario en Proyecto Arqueros (ARCADIS) y tranque PCTR (GHD).\n"
            "• Celulosa: Desarrolle ingenieria de detalle para 8.000 m2 de la Maquina Papelera MP5 (ABSORMEX Mexico), planta Softys Zarate (Argentina) y CMPC Laja.\n"
            "• Detallamiento: Modele conexiones metalicas parametricas, bancos de ductos y cubicacion de materiales con cero discrepancias entre modelo y planos.\n"
            "• CDE: Implemente flujos colaborativos en Autodesk Construction Cloud (ACC) y Navisworks Manage bajo estandar ISO 19650."
        ),
    ),
    ExperienceEntry(
        company="SINCAL · CJV CONSTRUCTION · SIRVE S.A.",
        position="Diseñador Estructural / Modelador BIM Senior — Aviación, Vialidad y Salud",
        start_date="2015-05",
        end_date="2022-12",
        is_current=False,
        location="Chile",
        description=(
            "Modele estructuras complejas y elabore planimetria de detalle para megaproyectos de infraestructura publica, vial y salud en Chile.\n"
            "• Aeropuerto AMB: Modele 320.000 m2 de estructura metalica para Terminal 2 (T2M), espigones T2D/T2F, estacionamientos y logistica de izaje en Revit.\n"
            "• Puentes y Pasarelas: Modele en Tekla Structures 9 pasarelas viales y puentes en hormigon armado y acero con detallado de armaduras y cubicacion exhaustiva.\n"
            "• Megaproyectos: Desarrolle modelos BIM para Paso Fronterizo Los Libertadores (35.000 m2) y hospitales Marga Marga, Gustavo Fricke y Felix Bulnes (SIRVE).\n"
            "• Deteccion de Interferencias: Desarrolle analisis de colisiones (Clash Detection) en Navisworks entre estructuras sismorresistentes y redes MEP para asegurar calce en obra."
        ),
    ),
    ExperienceEntry(
        company="TYPSA · JQ PROYECTOS · FUSI",
        position="Diseñador Estructural & Detallador Tekla Structures — Metro y Edificación",
        start_date="2010-01",
        end_date="2015-03",
        is_current=False,
        location="Chile",
        description=(
            "Desarrolle ingenieria de detalle, planos de fabricacion en Tekla Structures y cubicaciones de obras civiles para metro y edificaciones industriales.\n"
            "• Metro de Santiago: Modele y cubique obras civiles para 10 instalaciones tecnicas de Linea 3 y Linea 6 (TYPSA) y Central Hidroelectrica Los Condores.\n"
            "• Fabricación Metálica: Modele en Tekla Structures proyectos industriales y comerciales (Edificio Quitmetal, Atrio Sur, Casino Costanera Norte y Vigas Puente).\n"
            "• Planimetría: Emita planos de singles, conjuntos (Assemblies), montaje (Erection Drawings) y listas automaticas de materiales (BOM) para maestranza.\n"
            "• Terreno: Supervise tolerancias geometricas en taller de maestranza y montaje de estructuras en terreno."
        ),
    ),
]

# ─── EXPERIENCIA CRONOLÓGICA (10 EMPRESAS SIN BOILERPLATE) ────────────────────
EXPERIENCE_CRONOLOGICA = [
    ExperienceEntry(
        company="GHD",
        position="Proyectista / Modelador BIM Estructural",
        start_date="2024-12",
        end_date="2025-05",
        is_current=True,
        location="Santiago, Chile",
        description=(
            "Lidere el modelado BIM estructural para Remocion de Tranque Perez Caldera (PCTR) en mineria.\n"
            "• Modele fundaciones especiales y conexiones metalicas en Revit Structures con planimetria de detalle."
        ),
    ),
    ExperienceEntry(
        company="ARCADIS",
        position="Proyectista / Modelador BIM Estructural",
        start_date="2024-06",
        end_date="2024-11",
        is_current=False,
        location="Santiago, Chile",
        description=(
            "Modele el edificio del Chancador Primario en hormigon armado masivo y acero estructural pesado en Proyecto Minero Arqueros.\n"
            "• Desarrolle conexiones de acero y emision de planos de detalle para construccion."
        ),
    ),
    ExperienceEntry(
        company="AFRY",
        position="Proyectista / Modelador BIM Estructural",
        start_date="2022-12",
        end_date="2024-05",
        is_current=False,
        location="Santiago, Chile",
        description=(
            "Coordine el modelado BIM estructural de 8.000 m2 de la Maquina Papelera MP5 (ABSORMEX Mexico), Softys Zarate y CMPC Planta Laja.\n"
            "• Detalle conexiones metalicas, bancos de ductos y cubicacion de movimiento de tierras."
        ),
    ),
    ExperienceEntry(
        company="SINCAL",
        position="Proyectista / Modelador BIM Estructural",
        start_date="2021-01",
        end_date="2022-12",
        is_current=False,
        location="Santiago, Chile",
        description=(
            "Modele en Tekla Structures 9 pasarelas peatonales y puentes viales en hormigon y acero.\n"
            "• Detalle refuerzos, uniones metalicas y elabore cubicacion exhaustiva de materiales (BOM)."
        ),
    ),
    ExperienceEntry(
        company="CJV CONSTRUCTION",
        position="Proyectista / Modelador BIM Estructural",
        start_date="2018-01",
        end_date="2019-03",
        is_current=False,
        location="Santiago, Chile",
        description=(
            "Modele 320.000 m2 de estructura metalica para Terminal 2 T2M, espigones T2D/T2F y estacionamientos del Aeropuerto AMB en Revit.\n"
            "• Desarrolle conexiones metalicas, planimetria de fabricacion y visitas a terreno."
        ),
    ),
    ExperienceEntry(
        company="SIRVE S.A.",
        position="Proyectista / Modelador BIM Estructural",
        start_date="2015-05",
        end_date="2017-09",
        is_current=False,
        location="Santiago, Chile",
        description=(
            "Coordine la ingenieria estructural BIM del Paso Fronterizo Los Libertadores (35.000 m2) y hospitales Marga Marga, Fricke y Felix Bulnes.\n"
            "• Detalle estructuras sismorresistentes con aislamiento basal y resolucion de interferencias (Clash Detection)."
        ),
    ),
    ExperienceEntry(
        company="TYPSA",
        position="Proyectista Estructural",
        start_date="2014-03",
        end_date="2015-03",
        is_current=False,
        location="Santiago, Chile",
        description=(
            "Desarrolle planos estructurales y cubicaciones para 10 talleres y recintos tecnicos de Metro de Santiago Linea 3 y Linea 6.\n"
            "• Cubique obras civiles, movimiento de tierras y bancos de ductos para Central Hidroelectrica Los Condores."
        ),
    ),
    ExperienceEntry(
        company="JQ PROYECTOS",
        position="Proyectista Estructural & Detallador Tekla",
        start_date="2012-01",
        end_date="2013-12",
        is_current=False,
        location="Santiago, Chile",
        description=(
            "Modele en Tekla Structures fabricacion de estructuras metalicas para Atrio Sur, Casino Costanera Norte y Viga Puente.\n"
            "• Elabore planos de taller de singles, conjuntos, montaje y listados de materiales."
        ),
    ),
    ExperienceEntry(
        company="FUSI",
        position="Proyectista Estructural & Detallador Tekla",
        start_date="2010-01",
        end_date="2011-12",
        is_current=False,
        location="Santiago, Chile",
        description=(
            "Modele en 3D y elabore planos de fabricacion en Tekla Structures para Edificio Quitmetal.\n"
            "• Emita planos de singles, conjuntos, montaje y control dimensional en maestranza."
        ),
    ),
    ExperienceEntry(
        company="ILUSTRE MUNICIPALIDAD DE LAMPA",
        position="Dibujante Técnico (Práctica Profesional)",
        start_date="2006-01",
        end_date="2006-05",
        is_current=False,
        location="Santiago, Chile",
        description=(
            "Desarrolle planimetria arquitectonica y regularizaciones municipales en practica profesional."
        ),
    ),
]

def build_cv_data(experience_list, project_name):
    return CVData(
        personal=PERSONAL_INFO,
        target_job=TARGET_JOB,
        summary=SummarySection(text=SUMMARY_TEXT),
        experience=experience_list,
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
