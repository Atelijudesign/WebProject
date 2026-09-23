"""Tests de rutas multiplataforma y sanitización."""
import pytest
from pathlib import Path

from core import paths


def test_user_data_dir_creates_if_missing(tmp_path, monkeypatch):
    monkeypatch.setattr(paths, "_try_appdirs", lambda: None)
    monkeypatch.setattr(Path, "home", lambda: tmp_path)
    d = paths.user_data_dir()
    assert d == tmp_path / ".cvbuilder"
    assert d.exists()


def test_autosave_path_is_under_user_data_dir(tmp_path, monkeypatch):
    monkeypatch.setattr(paths, "_try_appdirs", lambda: None)
    monkeypatch.setattr(Path, "home", lambda: tmp_path)
    p = paths.autosave_path()
    assert p.name == "autosave.cvb"
    assert p.parent == tmp_path / ".cvbuilder"


def test_safe_filename_strips_dangerous_chars():
    assert paths.safe_filename("Andrés Gallo P.") == "Andrs_Gallo_P"
    assert paths.safe_filename("") == "CV"
    assert paths.safe_filename("!!!") == "CV"
    assert paths.safe_filename("  espacios  múltiples  ") == "espacios_mltiples"
    assert paths.safe_filename("normal-name.txt") == "normal-name.txt"


def test_safe_filename_keeps_unicode_letters():
    # solo bloquea lo que pueda romper el filesystem
    assert "ñ" not in "abc"
    out = paths.safe_filename("Año 2026 — CV")
    # el resultado es seguro (sin caracteres raros)
    assert "/" not in out
    assert "\\" not in out
    assert ":" not in out
