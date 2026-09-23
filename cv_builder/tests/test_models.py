"""Tests del modelo de datos."""
import pytest
from core.models import (
    CVData, PersonalInfo, ExperienceEntry, SkillEntry,
    EducationEntry, LanguageEntry, CertificationEntry,
    ProjectEntry, PublicationEntry, TargetJob,
)


def test_personal_defaults():
    p = PersonalInfo()
    assert p.name == ""
    assert "photo_path" not in PersonalInfo.model_fields
    assert "photo_data_uri" not in PersonalInfo.model_fields


def test_cv_data_defaults():
    cv = CVData()
    assert cv.template == "executive"
    assert cv.accent_color == "#1a2332"
    assert cv.font_family == "Inter"
    assert isinstance(cv.experience, list) and cv.experience == []
    assert isinstance(cv.skills, list) and cv.skills == []
    assert cv.target_job == TargetJob()


def test_experience_is_current_flag():
    e = ExperienceEntry(position="Dev", company="X", is_current=True, end_date="ignored")
    e.end_date = ""  # el panel fuerza a vacío si is_current
    assert e.is_current is True
    assert e.end_date == ""


def test_skill_level_range():
    s = SkillEntry(name="Python", level=5, category="Programación")
    assert 1 <= s.level <= 5


def test_cv_data_is_mutable_lists():
    cv = CVData()
    cv.experience.append(ExperienceEntry(position="X", company="Y"))
    assert len(cv.experience) == 1
    # no debe filtrar entre instancias
    cv2 = CVData()
    assert cv2.experience == []
