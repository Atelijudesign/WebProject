import json
import os

cv_data = {
  "version": 1,
  "projectName": "CV Andrés Gallo P. - Diseñador Estructural / Modelador BIM",
  "locale": {
    "country": "Chile",
    "language": "es"
  },
  "pageFormat": "a4",
  "template": "ats",
  "personal": {
    "name": "Andrés Gallo Parra",
    "title": "Diseñador Estructural  |  Modelador BIM  |  Acero y Hormigón",
    "email": "andresgallo@pm.me",
    "phone": "+56 9 4060 0861",
    "location": "Santiago, Chile",
    "linkedin": "https://www.linkedin.com/in/andresgallop/",
    "github": "https://github.com/Atelijudesign",
    "website": "https://ateliju.com"
  },
  "targetJob": {
    "title": "Diseñador Estructural / Modelador BIM",
    "description": "Se busca Diseñador Estructural y Modelador BIM Senior con dominio de Revit Structures, Tekla Structures, SmartPlant 3D, Advance Steel, AutoCAD, Navisworks Manage e ISO 19650. Experiencia en modelado y detallamiento estructural de hormigón armado y acero estructural, conexiones metálicas, enfierraduras (Rebar), planos de taller y montaje, cubicación (BOM) y automatización con Python, Dynamo, pyRevit y AutoLISP."
  },
  "target_job": {
    "title": "Diseñador Estructural / Modelador BIM",
    "description": "Se busca Diseñador Estructural y Modelador BIM Senior con dominio de Revit Structures, Tekla Structures, SmartPlant 3D, Advance Steel, AutoCAD, Navisworks Manage e ISO 19650. Experiencia en modelado y detallamiento estructural de hormigón armado y acero estructural, conexiones metálicas, enfierraduras (Rebar), planos de taller y montaje, cubicación (BOM) y automatización con Python, Dynamo, pyRevit y AutoLISP."
  },
  "summary": {
    "text": "Diseñador Estructural y Modelador BIM Senior con más de 15 años de trayectoria y dominio en minería, vialidad, aeropuertos, celulosa e industria en Chile, México y Argentina. Especialista en modelado 3D y detalle de estructuras de acero estructural y hormigón armado, conexiones metálicas, enfierraduras (Rebar), cubicación (BOM) y planos con Revit Structures, Tekla Structures, SmartPlant 3D y Navisworks bajo ISO 19650. Automatizaciones con Python, pyRevit, Revit API, Dynamo y AutoLISP."
  },
  "experience": [
    {
      "company": "GHD",
      "position": "Diseñador Estructural / Modelador BIM Senior — Minería, Industria e Infraestructura",
      "start_date": "2024-12",
      "end_date": "Actualidad",
      "is_current": True,
      "location": "Chile · Canadá · Internacional",
      "description": "• Modele en Revit Structures y Tekla obras de minería y litio: piscinas de concentrado (Minera Los Pelambres - MLP), piscinas de refino (BHP), remoción Tranque Pérez Caldera PCTR (12.000 m3) y fundaciones para centrífuga (Albemarle).\n• Desarrolle ingeniería de detalle y refuerzo de vigas carrilera de acero estructural para Normalización Puentes Grúa DSAL (Codelco) bajo normas CMAA-70.\n• Diseñe andenes de estaciones ferroviarias Tren Santiago-Batuco (EFE) y viaducto Garden City Skyway [Canadá] en hormigón armado y acero, federando en Navisworks Manage.\n• Coordino obras civiles de subestación eléctrica (filtro de armónicos 23 kV) y protección contra socavación, procesando nubes de puntos ReCap y CDE en Autodesk Construction Cloud (ACC)."
    },
    {
      "company": "Arcadis · AFRY",
      "position": "Diseñador Estructural / Modelador BIM Senior — Minería, Celulosa e Industria",
      "start_date": "2022-12",
      "end_date": "2024-11",
      "is_current": False,
      "location": "Chile · México · Argentina",
      "description": "• Minera Arqueros [Chile]: Modelé en Revit Structures, Advance Steel y SmartPlant 3D chancador primario y Conexiones de Acero (AISC/NCh) con Planos de Fabricación y Montaje.\n• MP05 Absormex [México] y CMPC [Chile]: Desarrollé ingeniería de detalle en acero estructural para 8.000 m2 de nave industrial papelera bajo Metodología BIM (ISO 19650).\n• Softys Zárate [Argentina]: Modelé Bancos de Ductos y Obras Civiles pesadas y plataformas industriales.\n• Automatización: Desarrollé scripts en Python & pyRevit y macros en Microsoft Excel Avanzado para Cuantificación de Materiales (BOM)."
    },
    {
      "company": "Sincal · CJV Construction · Sirve S.A.",
      "position": "Diseñador Estructural / Modelador BIM Senior — Aviación, Vialidad y Salud",
      "start_date": "2015-05",
      "end_date": "2022-12",
      "is_current": False,
      "location": "Chile",
      "description": "• Aeropuerto AMB [Chile]: Modelé 320.000 m2 de acero estructural para Terminal T2 y espigones en Revit y Navisworks Manage, resolviendo colisiones críticas con redes MEP.\n• 9 Pasarelas Peatonales y Puentes [Chile]: Modelé en Tekla Structures pasarelas viales en Hormigón Armado y Enfierraduras (Rebar), con uniones y cubicación de materiales.\n• Complejo Los Libertadores y Red Hospitalaria [Chile]: Modelé 35.000 m2 con aisladores sísmicos y hospitales Dr. Fricke, Marga Marga y Félix Bulnes con Tekla y Revit.\n• Trabajo Colaborativo: Coordiné modelos multiusuario con Tekla Model Sharing y Autodesk Construction Cloud (ACC)."
    },
    {
      "company": "Typsa · JQ Proyectos · Fusi",
      "position": "Diseñador Estructural & Detallador Tekla Structures — Metro y Edificación",
      "start_date": "2010-01",
      "end_date": "2015-03",
      "is_current": False,
      "location": "Chile",
      "description": "• Metro de Santiago (L3 y L6) [Chile]: Modelé obras civiles y talleres técnicos en Tekla Structures y AutoCAD, emitiendo más de 450 planos de armaduras y hormigones para TYPSA.\n• Fabricación Metálica [Chile]: Detallé estructuras en acero estructural generando Planos de Fabricación y Montaje y listas de corte CNC para más de 12 proyectos.\n• Gestión Técnica & Automatización: Implementé rutinas en AutoLISP y Revit API, administré bases de datos con Git & SQL y desarrollé visores con HTML5 & CSS3.\n• Supervisión: Controlé tolerancias dimensionales en maestranza y montaje estructural en terreno."
    }
  ],
  "education": [
    {
      "institution": "Instituto Profesional Iplacex",
      "degree": "Ingeniería en Construcción",
      "field_of_study": "Construcción e Ingeniería Civil",
      "start_date": "2023",
      "end_date": "En curso",
      "gpa": "",
      "description": "Formación en gestión de obras, cálculo estructural, tecnología de materiales y administración de proyectos."
    },
    {
      "institution": "Liceo Politécnico Galvarino N°2",
      "degree": "Técnico de Nivel Medio en Dibujo Técnico",
      "field_of_study": "Dibujo y Geometría Técnica",
      "start_date": "2003",
      "end_date": "2005",
      "gpa": "",
      "description": "Planimetría normalizada, geometría descriptiva, proyecciones axonométricas y dibujo de ingeniería. Práctica en Ilustre Municipalidad de Lampa (2006)."
    }
  ],
  "certifications": [
    {
      "name": "Especialización Avanzada en Revit Structures & BIM",
      "issuer": "Autodesk / KonstruEDU / AEC Collection",
      "date": "2017 – 2024",
      "credential_id": "Revit Structures 2021 · Colaboración · Plantillas · Plantas Industriales AEC Collection",
      "url": ""
    },
    {
      "name": "Metodología BIM ISO 19650 & Detección de Interferencias",
      "issuer": "Capacitación Profesional BIM",
      "date": "2021 – 2023",
      "credential_id": "ISO 19650 Infraestructuras Lineales · Navisworks Advanced Clash Detection & Timeliner 4D",
      "url": ""
    },
    {
      "name": "Automatización de Procesos & Programación Técnica",
      "issuer": "Academia de Automatización BIM",
      "date": "2021 – 2023",
      "credential_id": "Revit API · pyRevit · Dynamo · AutoLISP · Python · Git · SQL",
      "url": ""
    }
  ],
  "skills": [
    { "name": "SmartPlant 3D", "level": 5, "category": "Modelado BIM" },
    { "name": "Revit Structures", "level": 5, "category": "Modelado BIM" },
    { "name": "Tekla Structures", "level": 5, "category": "Modelado BIM" },
    { "name": "Advance Steel", "level": 4, "category": "Modelado BIM" },
    { "name": "AutoCAD", "level": 5, "category": "Modelado BIM" },
    { "name": "Navisworks Manage", "level": 5, "category": "Revisión & Entornos BIM" },
    { "name": "Autodesk Construction Cloud (ACC)", "level": 5, "category": "Revisión & Entornos BIM" },
    { "name": "Tekla Model Sharing", "level": 5, "category": "Revisión & Entornos BIM" },
    { "name": "Metodología BIM (ISO 19650)", "level": 5, "category": "Revisión & Entornos BIM" },
    { "name": "ReCap", "level": 4, "category": "Revisión & Entornos BIM" },
    { "name": "Conexiones de Acero (AISC/NCh)", "level": 5, "category": "Especialidad Estructural" },
    { "name": "Hormigón Armado y Enfierraduras (Rebar)", "level": 5, "category": "Especialidad Estructural" },
    { "name": "Planos de Fabricación y Montaje", "level": 5, "category": "Especialidad Estructural" },
    { "name": "Cuantificación de Materiales (BOM)", "level": 5, "category": "Especialidad Estructural" },
    { "name": "Bancos de Ductos y Obras Civiles", "level": 4, "category": "Especialidad Estructural" },
    { "name": "Python & pyRevit", "level": 4, "category": "Automatización & Desarrollo" },
    { "name": "Dynamo", "level": 4, "category": "Automatización & Desarrollo" },
    { "name": "Revit API", "level": 4, "category": "Automatización & Desarrollo" },
    { "name": "AutoLISP", "level": 4, "category": "Automatización & Desarrollo" },
    { "name": "Git & SQL", "level": 4, "category": "Automatización & Desarrollo" },
    { "name": "HTML5 & CSS3", "level": 4, "category": "Automatización & Desarrollo" },
    { "name": "Microsoft Excel Avanzado", "level": 5, "category": "Automatización & Desarrollo" }
  ],
  "languages": [
    { "name": "Español", "level": "Nativo" },
    { "name": "Inglés", "level": "Técnico A1 (Lectura de normas AISC/ACI y manuales de ingeniería)" }
  ],
  "projects": []
}

# Destinations to write .cvb and .json
targets_cvb = [
    r"c:\Users\andre\Documents\Proyectos26\proyectos\WebProject\public\cv\CV_Andres_Gallo_ATS.cvb",
    r"c:\Users\andre\Documents\Proyectos26\proyectos\WebProject\public\cv\Andres_Gallo_CV_ATS_Consolidado.cvb",
    r"C:\Users\andre\Downloads\CV_Andres_Gallo_ATS.cvb",
    r"C:\Users\andre\Downloads\Andres_Gallo_CV_ATS_Consolidado.cvb",
    r"C:\Users\andre\Downloads\CV_Andres_Gallo.cvb"
]

targets_json = [
    r"c:\Users\andre\Documents\Proyectos26\proyectos\WebProject\public\cv\CV_Andres_Gallo_ATS.json",
    r"c:\Users\andre\Documents\Proyectos26\proyectos\WebProject\public\cv\Andres_Gallo_CV_ATS_Consolidado.json",
    r"C:\Users\andre\Downloads\CV_Andres_Gallo_ATS.json"
]

json_str = json.dumps(cv_data, indent=2, ensure_ascii=False)

for p in targets_cvb:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(json_str)
    print(f"Written CVB: {p}")

for p in targets_json:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(json_str)
    print(f"Written JSON: {p}")

# Also generate plain text
txt_content = f"""ANDRÉS GALLO PARRA
Diseñador Estructural | Modelador BIM | Acero y Hormigón
Email: andresgallo@pm.me | Teléfono: +56 9 4060 0861 | Santiago, Chile
LinkedIn: https://www.linkedin.com/in/andresgallop/ | Portafolio: https://ateliju.com

RESUMEN PROFESIONAL
{cv_data['summary']['text']}

EXPERIENCIA PROFESIONAL
"""
for exp in cv_data["experience"]:
    txt_content += f"\n{exp['position']}\n{exp['company']} | {exp['location']} | {exp['start_date']} - {exp['end_date']}\n"
    for line in exp["description"].split("\n"):
        txt_content += f"  {line}\n"

txt_content += "\nFORMACIÓN ACADÉMICA\n"
for edu in cv_data["education"]:
    txt_content += f"{edu['degree']} — {edu['institution']} ({edu['start_date']} - {edu['end_date']})\n"

txt_content += "\nCERTIFICACIONES TÉCNICAS\n"
for cert in cv_data["certifications"]:
    txt_content += f"• {cert['name']} — {cert['issuer']} ({cert['date']})\n"

txt_content += "\nHABILIDADES TÉCNICAS (STACK ATS)\n"
skills_list = [s["name"] for s in cv_data["skills"]]
txt_content += " · ".join(skills_list) + "\n"

txt_content += "\nIDIOMAS\n"
for lang in cv_data["languages"]:
    txt_content += f"• {lang['name']}: {lang['level']}\n"

targets_txt = [
    r"c:\Users\andre\Documents\Proyectos26\proyectos\WebProject\public\cv\CV_Andres_Gallo_ATS.txt",
    r"C:\Users\andre\Downloads\CV_Andres_Gallo_ATS.txt"
]

for p in targets_txt:
    with open(p, "w", encoding="utf-8") as f:
        f.write(txt_content)
    print(f"Written TXT: {p}")
