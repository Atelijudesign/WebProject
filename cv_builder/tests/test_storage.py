"""Tests de persistencia (storage)."""
import json
from pathlib import Path

import pytest

from core import storage
from core.models import (
    CVData, PersonalInfo, ExperienceEntry, EducationEntry, SkillEntry,
    LanguageEntry, CertificationEntry, ProjectEntry, PublicationEntry, TargetJob,
)


def _full_cv() -> CVData:
    return CVData(
        personal=PersonalInfo(
            name="Andrés Gallo",
            title="Proyectista BIM Senior",
            email="andres@example.com",
            phone="+56 9 1234 5678",
            location="Santiago, Chile",
            linkedin="linkedin.com/in/andres",
            github="github.com/andres",
            website="andres.dev",
        ),
        summary="Resumen profesional de prueba con más de 80 caracteres para pasar la validación.",
        target_job=TargetJob(title="Proyectista Senior", description="Se requiere Revit y Tekla."),
        experience=[
            ExperienceEntry(
                position="Ingeniero Estructural",
                company="Acme",
                start_date="Ene 2020",
                end_date="Dic 2023",
                description="• Diseñé 10 naves industriales\n• Lideré equipo de 5",
            )
        ],
        education=[
            EducationEntry(
                institution="Universidad de Chile",
                degree="Ingeniero Civil",
                field_of_study="Estructuras",
                start_date="2010",
                end_date="2015",
            )
        ],
        skills=[SkillEntry(name="Revit", level=5, category="BIM")],
        languages=[LanguageEntry(name="Español", level="Nativo")],
        certifications=[CertificationEntry(name="PE", issuer="AISC", date="2021")],
        projects=[ProjectEntry(name="Pipeline", technologies="Python, AWS")],
        publications=[PublicationEntry(title="Paper X", publisher="Journal Y")],
        template="minimal",
        accent_color="#0066cc",
        font_family="Inter",
    )


def test_roundtrip(tmp_path: Path):
    cv = _full_cv()
    out = tmp_path / "test.cvb"
    storage.save(cv, out)
    assert out.exists()

    cv2 = storage.load(out)
    assert cv2.personal.name == "Andrés Gallo"
    assert cv2.personal.email == "andres@example.com"
    assert cv2.target_job.title == "Proyectista Senior"
    assert len(cv2.experience) == 1
    assert cv2.experience[0].position == "Ingeniero Estructural"
    assert cv2.skills[0].name == "Revit"
    assert cv2.template == "minimal"
    assert cv2.accent_color == "#0066cc"


def test_save_uses_cvb_extension(tmp_path: Path):
    cv = _full_cv()
    out = tmp_path / "no_extension"
    storage.save(cv, out)
    assert out.with_suffix(".cvb").exists()
    assert not out.exists()


def test_load_handles_missing_optional_fields(tmp_path: Path):
    """Un JSON con solo lo mínimo no debe romper la carga."""
    minimal = {
        "personal": {"name": "X", "email": "x@x.com"},
        "summary": {"text": "hola"},
    }
    p = tmp_path / "min.cvb"
    p.write_text(json.dumps(minimal), encoding="utf-8")
    cv = storage.load(p)
    assert cv.personal.name == "X"
    assert cv.experience == []
    assert cv.template == "executive"  # default


def test_new_empty_returns_valid_dataclass():
    cv = storage.new_empty()
    assert cv.personal.name == "Tu Nombre Completo"
    assert cv.personal.email.endswith("@email.com")
    assert cv.template == "executive"


def test_load_skips_unknown_keys(tmp_path: Path):
    """Si alguien añade campos extra al JSON, no deben romper el dataclass."""
    p = tmp_path / "weird.cvb"
    p.write_text(json.dumps({
        "personal": {"name": "X", "email": "x@x.com", "future_field": "ignored"},
        "summary": {"text": "ok"},
        "future_section": {"foo": "bar"},
    }), encoding="utf-8")
    cv = storage.load(p)
    assert cv.personal.name == "X"


def test_load_discards_legacy_photo_fields(tmp_path: Path):
    p = tmp_path / "legacy-photo.cvb"
    p.write_text(json.dumps({
        "personal": {
            "name": "X",
            "email": "x@x.com",
            "photo_path": "C:/legacy/photo.jpg",
            "photo_data_uri": "data:image/png;base64,abc",
        },
    }), encoding="utf-8")

    cv = storage.load(p)
    assert "photo_path" not in cv.personal.model_dump()
    assert "photo_data_uri" not in cv.personal.model_dump()


def test_load_accepts_web_project_shape(tmp_path: Path):
    p = tmp_path / "web-project.cvb"
    p.write_text(json.dumps({
        "personal": {"name": "Web User"},
        "summary": "Resumen creado en el navegador.",
        "targetJob": {"title": "Modelador BIM", "description": "Revit Structures"},
    }), encoding="utf-8")

    cv = storage.load(p)
    assert cv.summary.text == "Resumen creado en el navegador."
    assert cv.target_job.title == "Modelador BIM"
