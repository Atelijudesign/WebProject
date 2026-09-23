"""
CV Builder Pro — Paths
Centraliza todas las rutas de archivos del usuario (autosave, logs, config).
Multiplataforma: usa appdirs si está disponible, si no fallback a ~/.cvbuilder.
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

APP_NAME = "CVBuilderPro"
APP_AUTHOR = "AndresGalloParra"


def _try_appdirs() -> Optional[Path]:
    """Intenta usar la lib `appdirs` si está instalada."""
    try:
        from appdirs import user_data_dir  # type: ignore
        return Path(user_data_dir(APP_NAME, APP_AUTHOR))
    except Exception:
        return None


def user_data_dir() -> Path:
    """Devuelve (y crea) la carpeta de datos del usuario."""
    base = _try_appdirs()
    if base is not None:
        base.mkdir(parents=True, exist_ok=True)
        return base

    # Fallback: ~/.cvbuilder
    fallback = Path.home() / ".cvbuilder"
    fallback.mkdir(parents=True, exist_ok=True)
    return fallback


def autosave_path() -> Path:
    """Ruta al archivo de autoguardado."""
    return user_data_dir() / "autosave.cvb"


def log_path() -> Path:
    """Ruta al archivo de log."""
    return user_data_dir() / "cvbuilder.log"


def recent_files_path() -> Path:
    """Ruta al JSON de archivos recientes (futuro)."""
    return user_data_dir() / "recent.json"


def safe_filename(name: str, default: str = "CV") -> str:
    """Sanitiza un nombre para usarlo como nombre de archivo.
    - Elimina caracteres no ASCII (incluye acentos).
    - Reemplaza caracteres no permitidos por "_".
    - Colapsa espacios en "_".
    - Elimina punto final.
    """
    if not name or not name.strip():
        return default
    # Keep only ASCII characters
    ascii_str = ''.join(ch for ch in name.strip() if ord(ch) < 128)
    # Allowed characters
    keep = "-_.() abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    cleaned = "".join(c if c in keep else "_" for c in ascii_str)
    cleaned = "_".join(cleaned.split())
    if cleaned.endswith('.'):
        cleaned = cleaned[:-1]
    # If result is only underscores/dots (no alphanumeric chars), use default
    if not any(ch.isalnum() for ch in cleaned):
        return default
    return cleaned or default
