"""Tests del módulo de validación."""
import pytest

from core.models import (
    CVData, PersonalInfo, ExperienceEntry, EducationEntry, SkillEntry,
)
from core.validation import (
    Severity, validate_all, validate_personal, validate_summary,
    validate_experience, validate_education, validate_skills,
    has_blocking_errors, count_by_severity,
)


def test_personal_missing_name_and_email():
    cv = CVData()
    issues = validate_personal(cv)
    assert any(i.severity == Severity.ERROR and i.field == "name" for i in issues)
    assert any(i.severity == Severity.ERROR and i.field == "email" for i in issues)


def test_personal_invalid_email_format():
    cv = CVData(personal=PersonalInfo(name="X", email="not-an-email"))
    issues = validate_personal(cv)
    assert any(i.severity == Severity.ERROR and i.field == "email" for i in issues)


def test_personal_valid_email_passes():
    cv = CVData(personal=PersonalInfo(name="X", email="user@example.com"))
    assert validate_personal(cv) == []


def test_personal_url_validation():
    cv = CVData(personal=PersonalInfo(
        name="X", email="x@x.com",
        linkedin="not a url",
    ))
    issues = validate_personal(cv)
    assert any(i.severity == Severity.WARNING and i.field == "linkedin" for i in issues)


def test_summary_empty_is_warning():
    cv = CVData()
    issues = validate_summary(cv)
    assert len(issues) == 1
    assert issues[0].severity == Severity.WARNING


def test_summary_short_is_info():
    cv = CVData()
    cv.summary.text = "corto"
    issues = validate_summary(cv)
    assert issues[0].severity == Severity.INFO


def test_summary_long_is_info():
    cv = CVData()
    cv.summary.text = "x" * 1500
    issues = validate_summary(cv)
    assert issues[0].severity == Severity.INFO


def test_experience_missing_required_fields():
    cv = CVData(experience=[ExperienceEntry()])
    issues = validate_experience(cv)
    fields = {i.field for i in issues}
    assert "position" in fields
    assert "company" in fields


def test_experience_current_job_no_end_date_ok():
    cv = CVData(experience=[ExperienceEntry(
        position="X", company="Y", is_current=True,
    )])
    issues = validate_experience(cv)
    assert not any(i.field == "end_date" for i in issues)


def test_experience_past_job_without_end_date_warns():
    cv = CVData(experience=[ExperienceEntry(
        position="X", company="Y", is_current=False, end_date="",
    )])
    issues = validate_experience(cv)
    assert any(i.field == "end_date" and i.severity == Severity.WARNING for i in issues)


def test_skills_empty_warns():
    cv = CVData()
    issues = validate_skills(cv)
    assert len(issues) == 1
    assert issues[0].severity == Severity.WARNING


def test_skills_nameless_is_error():
    cv = CVData(skills=[SkillEntry(name="", level=3)])
    issues = validate_skills(cv)
    assert any(i.severity == Severity.ERROR for i in issues)


def test_validate_all_returns_sorted_list():
    cv = CVData()
    issues = validate_all(cv)
    # ERROR debe ir antes que WARNING
    severities = [i.severity for i in issues]
    assert severities == sorted(severities, key=lambda s: s.value)


def test_has_blocking_errors():
    cv = CVData()
    assert has_blocking_errors(validate_all(cv))


def test_count_by_severity():
    cv = CVData()
    cv.skills = []  # 1 warning
    counts = count_by_severity(validate_all(cv))
    assert counts["warning"] >= 1
    assert counts["error"] >= 1  # name + email


def test_valid_minimal_cv_has_no_errors():
    cv = CVData(
        personal=PersonalInfo(name="Ana", email="ana@example.com"),
        summary="Soy una ingeniera con 5 años de experiencia en proyectos BIM estructurales.",
        experience=[ExperienceEntry(
            position="Ing.", company="X", start_date="2020",
            end_date="2024", description="Logros.",
        )],
        education=[EducationEntry(institution="U. de Chile", degree="Ing.")],
        skills=[SkillEntry(name="Revit", level=4)],
    )
    issues = validate_all(cv)
    assert not has_blocking_errors(issues)
