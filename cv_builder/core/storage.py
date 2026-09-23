"""
CV Builder Pro — Storage (JSON persistence)
Serializa y deserializa CVData hacia/desde archivos .cvb (JSON).
"""
from __future__ import annotations
import json
from pydantic import BaseModel
from typing import get_type_hints
from pathlib import Path
from typing import Any, Dict, Type, TypeVar

from core.models import (
    CVData, PersonalInfo, SummarySection, TargetJob, ExperienceEntry,
    EducationEntry, SkillEntry, LanguageEntry, CertificationEntry,
    ProjectEntry, PublicationEntry,
)

T = TypeVar("T")

CV_FILE_EXTENSION = ".cvb"
CV_FILE_FILTER = "CV Builder Project (*.cvb);;All Files (*)"


def _deserialize_list(data: list, cls: Type[T]) -> list:
    """Convierte una lista de dicts en instancias del modelo Pydantic dado."""
    result = []
    # Pydantic model fields are in cls.model_fields
    valid_keys = {name for name in getattr(cls, "model_fields", {}).keys()}
    for item in data:
        filtered = {k: v for k, v in item.items() if k in valid_keys}
        result.append(cls(**filtered))
    return result


def save(cv: CVData, path: str | Path) -> None:
    """Guarda un CVData completo en formato JSON con extensión .cvb."""
    path = Path(path)
    if path.suffix != CV_FILE_EXTENSION:
        path = path.with_suffix(CV_FILE_EXTENSION)
    path.parent.mkdir(parents=True, exist_ok=True)
    # Use Pydantic's model_dump for serialization
    with open(path, "w", encoding="utf-8") as f:
        json.dump(cv.model_dump(), f, ensure_ascii=False, indent=2)


def load(path: str | Path) -> CVData:
    """Carga un archivo .cvb y devuelve un CVData instanciado."""
    path = Path(path)
    with open(path, "r", encoding="utf-8") as f:
        raw: Dict[str, Any] = json.load(f)

    personal_raw = raw.get("personal", {})
    target_job_raw = raw.get("target_job", raw.get("targetJob", {}))
    summary_raw = raw.get("summary", {})
    if isinstance(summary_raw, str):
        summary_raw = {"text": summary_raw}

    cv = CVData(
        personal=PersonalInfo(**{
            k: v for k, v in personal_raw.items()
            if k in getattr(PersonalInfo, "model_fields", {}).keys()
        }),
        target_job=TargetJob(**{
            k: v for k, v in target_job_raw.items()
            if k in getattr(TargetJob, "model_fields", {}).keys()
        }),
        summary=SummarySection(**{
            k: v for k, v in summary_raw.items()
            if k in getattr(SummarySection, "model_fields", {}).keys()
        }),
        experience=_deserialize_list(raw.get("experience", []), ExperienceEntry),
        education=_deserialize_list(raw.get("education", []), EducationEntry),
        skills=_deserialize_list(raw.get("skills", []), SkillEntry),
        languages=_deserialize_list(raw.get("languages", []), LanguageEntry),
        certifications=_deserialize_list(raw.get("certifications", []), CertificationEntry),
        projects=_deserialize_list(raw.get("projects", []), ProjectEntry),
        publications=_deserialize_list(raw.get("publications", []), PublicationEntry),
        template=raw.get("template", "executive"),
        accent_color=raw.get("accent_color", "#1a2332"),
        font_family=raw.get("font_family", "Inter"),
    )
    return cv


def new_empty() -> CVData:
    """Retorna un CVData vacío con un ejemplo mínimo para orientar al usuario."""
    return CVData(
        personal=PersonalInfo(
            name="Tu Nombre Completo",
            title="Ingeniero BIM Senior",
            email="tu@email.com",
            phone="+56 9 XXXX XXXX",
            location="Santiago, Chile",
            linkedin="linkedin.com/in/tuperfil",
        ),
        summary=SummarySection(
            text="Profesional con experiencia en desarrollo BIM y automatización..."
        ),
    )
