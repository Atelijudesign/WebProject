"""Análisis ATS local, determinista y sin transmisión de datos."""
from __future__ import annotations

import re
import unicodedata

from core.models import CVData

_PRIORITY_TERMS = (
    "Revit Structures", "Tekla Structures", "AutoCAD", "Navisworks Manage",
    "Autodesk Construction Cloud", "BIM 360", "ISO 19650", "AISC", "ACI",
    "NCh2369", "NCh433", "Python", "pyRevit", "Rebar", "Hormigón Armado",
    "Acero Estructural", "Clash Detection", "Coordinación BIM", "Modelado BIM",
)
_STOP_WORDS = {
    "para", "como", "desde", "entre", "sobre", "esta", "este", "estos", "estas",
    "donde", "debe", "deben", "ser", "tener", "contar", "trabajo", "oferta",
    "cargo", "equipo", "proyecto", "proyectos", "experiencia", "profesional",
    "requisitos", "responsable", "personas", "empresa", "través", "todas",
}


def _normalise(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", value).casefold().strip()


def extract_keywords(job_description: str, limit: int = 18) -> list[str]:
    """Extrae términos técnicos repetibles de una vacante, sin usar servicios externos."""
    text = _normalise(job_description)
    if not text:
        return []

    found: list[str] = []
    for term in _PRIORITY_TERMS:
        if _normalise(term) in text:
            found.append(term)

    for word in re.findall(r"[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9+#.]{4,}", job_description):
        key = _normalise(word)
        if key not in _STOP_WORDS and all(_normalise(item) != key for item in found):
            found.append(word)
        if len(found) >= limit:
            break
    return found[:limit]


def cv_searchable_text(cv: CVData) -> str:
    """Construye el corpus de búsqueda del CV sin incluir la vacante objetivo."""
    parts = [cv.personal.model_dump_json(), cv.summary.text]
    for collection in (cv.experience, cv.education, cv.skills, cv.languages,
                       cv.certifications, cv.projects, cv.publications):
        for item in collection:
            parts.append(item.model_dump_json())
    return _normalise(" ".join(parts))


def analyze_cv_match(cv: CVData) -> dict[str, list[str]]:
    """Clasifica keywords de la vacante entre presentes y pendientes en el CV."""
    keywords = extract_keywords(cv.target_job.description)
    cv_text = cv_searchable_text(cv)
    matched = [term for term in keywords if _normalise(term) in cv_text]
    missing = [term for term in keywords if term not in matched]
    return {"keywords": keywords, "matched": matched, "missing": missing}
