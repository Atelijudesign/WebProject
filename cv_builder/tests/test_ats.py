from core.ats import analyze_cv_match, extract_keywords
from core.models import CVData, PersonalInfo, SkillEntry, TargetJob


def test_extract_keywords_prioritizes_technical_terms():
    keywords = extract_keywords("Se requiere manejo de Revit Structures, Tekla Structures y NCh2369.")
    assert "Revit Structures" in keywords
    assert "Tekla Structures" in keywords
    assert "NCh2369" in keywords


def test_analyze_cv_match_reports_present_and_missing_terms():
    cv = CVData(
        personal=PersonalInfo(name="Andrea", title="Modeladora BIM"),
        skills=[SkillEntry(name="Revit Structures", category="BIM", level=5)],
        target_job=TargetJob(description="Revit Structures, Tekla Structures y Navisworks Manage"),
    )
    analysis = analyze_cv_match(cv)
    assert "Revit Structures" in analysis["matched"]
    assert "Tekla Structures" in analysis["missing"]
