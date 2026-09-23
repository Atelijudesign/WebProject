"""Tests del exporter (sin GUI; render HTML puro)."""
import pytest
from pathlib import Path

from core.exporter import (
    _latex_escape, list_templates, render_html, render_latex,
)
from core.models import CVData, PersonalInfo


def test_list_templates_includes_all_five():
    ts = list_templates()
    for key in ("executive", "minimal", "technical", "ats", "latex"):
        assert key in ts, f"Falta el template '{key}'"
    assert len(ts) == 5


def test_render_html_uses_fallback_template():
    cv = CVData(template="nonexistent", personal=PersonalInfo(name="X"))
    html = render_html(cv)
    assert "<!DOCTYPE html>" in html
    # cuando el template no existe, debe caer al "executive" por defecto
    assert "X" in html


def test_render_html_with_each_template():
    cv = CVData(personal=PersonalInfo(name="Test User", email="t@t.com"))
    for t in list_templates():
        cv.template = t
        html = render_html(cv)
        assert "<!DOCTYPE html>" in html


# ── LaTeX tests ───────────────────────────────────────────────

def test_latex_escape_basic_specials():
    assert _latex_escape("a & b") == r"a \& b"
    assert _latex_escape("50%") == r"50\%"
    assert _latex_escape("$10") == r"\$10"
    assert _latex_escape("snake_case") == r"snake\_case"
    assert _latex_escape("curly{braces}") == r"curly\{braces\}"
    assert _latex_escape("hash#tag") == r"hash\#tag"
    assert _latex_escape("tilde~here") == r"tilde\textasciitilde{}here"
    assert _latex_escape("caret^here") == r"caret\textasciicircum{}here"
    assert _latex_escape(r"back\slash") == r"back\textbackslash{}slash"


def test_latex_escape_preserves_normal_text():
    assert _latex_escape("Andrés Gallo") == "Andrés Gallo"
    assert _latex_escape("Hello, World! 123") == "Hello, World! 123"
    assert _latex_escape("") == ""


def test_latex_escape_handles_none():
    assert _latex_escape(None) == ""


def test_latex_escape_combined():
    s = "100% en 30 días & noches #1"
    out = _latex_escape(s)
    assert "100\\%" in out
    assert "\\&" in out
    assert "\\#1" in out


def test_render_latex_returns_compilable_document():
    cv = CVData(personal=PersonalInfo(
        name="Andrés Gallo",
        title="Ingeniero Estructural",
        email="a.gallo@example.com",
    ))
    tex = render_latex(cv)
    assert r"\documentclass" in tex
    assert r"\begin{document}" in tex
    assert r"\end{document}" in tex
    assert "Andrés Gallo" in tex  # caracteres unicode se preservan


def test_render_latex_escapes_special_chars():
    cv = CVData(
        personal=PersonalInfo(name="X & Y 50%_off"),
    )
    tex = render_latex(cv)
    # los caracteres especiales deben estar escapados
    assert r"\&" in tex
    assert r"\%" in tex
    assert r"\_" in tex
    # y NO debe contener el & crudo que rompería LaTeX
    assert "X & Y" not in tex
    assert "50%_off" not in tex


def test_render_latex_uses_standard_packages():
    import re as _re
    cv = CVData()
    tex = render_latex(cv)
    for pkg in ("inputenc", "fontenc", "geometry", "hyperref", "enumitem", "babel"):
        # Match \usepackage{pkg} or \usepackage[opts]{pkg}
        pattern = r"\\usepackage(\[[^\]]*\])?\{" + _re.escape(pkg) + r"\}"
        assert _re.search(pattern, tex), f"Falta el paquete {pkg}"


def test_render_html_for_latex_wraps_source():
    cv = CVData(template="latex", personal=PersonalInfo(name="Test"))
    html = render_html(cv)
    # el preview del template LaTeX debe ser un HTML que envuelve el código
    assert "<!DOCTYPE html>" in html
    assert "<pre>" in html
    assert r"\documentclass" in html
    assert r"\begin{document}" in html


# ── ATS tests ─────────────────────────────────────────────────

def test_render_ats_no_fancy_styling():
    cv = CVData(template="ats", personal=PersonalInfo(
        name="Andrés", email="a@a.com", title="Ingeniero",
    ))
    html = render_html(cv)
    # ATS: debe ser un HTML válido sin dependencias externas
    assert "<!DOCTYPE html>" in html
    assert "Andrés" in html
    # No debe cargar Google Fonts (los parsers ATS no los procesan)
    assert "fonts.googleapis.com" not in html
    # No debe tener colores de marca
    assert "color-mix" not in html
    assert "var(--accent)" not in html


def test_render_ats_single_column():
    cv = CVData(template="ats", personal=PersonalInfo(name="X", email="x@x.com"))
    html = render_html(cv)
    # No debe haber grid-template-columns ni flex-direction: row usados para multicolumna
    assert "grid-template-columns" not in html
    assert "float:" not in html


def test_html_templates_do_not_render_personal_images():
    cv = CVData(personal=PersonalInfo(name="Test User", email="test@example.com"))
    for template in ("executive", "minimal", "technical", "ats"):
        cv.template = template
        html = render_html(cv).lower()
        assert "<img" not in html
        assert "photo_" not in html
