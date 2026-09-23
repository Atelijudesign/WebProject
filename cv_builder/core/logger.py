"""
CV Builder Pro — Logging
Configura un logger raíz con salida a archivo (rotación simple) y consola.

El archivo de log se guarda en la carpeta de datos del usuario (ver paths.py).
"""
from __future__ import annotations

import logging
import logging.handlers
import sys
from pathlib import Path
from typing import Optional

_LOGGER_NAME = "cvbuilder"
_DEFAULT_FORMAT = "%(asctime)s | %(levelname)-7s | %(name)s | %(message)s"
_DEFAULT_LEVEL = logging.INFO

_initialized = False


def setup_logging(
    log_file: Optional[Path] = None,
    level: int = _DEFAULT_LEVEL,
    console: bool = True,
) -> logging.Logger:
    """Inicializa el logger raíz del CV Builder. Idempotente."""
    global _initialized
    logger = logging.getLogger(_LOGGER_NAME)

    if _initialized:
        return logger

    logger.setLevel(level)
    logger.propagate = False
    formatter = logging.Formatter(_DEFAULT_FORMAT)

    # Consola
    if console:
        sh = logging.StreamHandler(sys.stderr)
        sh.setFormatter(formatter)
        sh.setLevel(level)
        logger.addHandler(sh)

    # Archivo (rotación a 1 MB × 3 backups)
    if log_file is not None:
        log_file.parent.mkdir(parents=True, exist_ok=True)
        fh = logging.handlers.RotatingFileHandler(
            log_file,
            maxBytes=1_000_000,
            backupCount=3,
            encoding="utf-8",
        )
        fh.setFormatter(formatter)
        fh.setLevel(level)
        logger.addHandler(fh)

    _initialized = True
    logger.debug("Logging inicializado. Archivo: %s", log_file)
    return logger


def get_logger(name: str) -> logging.Logger:
    """Devuelve un hijo del logger raíz, p. ej. get_logger(__name__)."""
    if not _initialized:
        # Auto-init con defaults si alguien pide un logger antes de setup.
        setup_logging()
    return logging.getLogger(f"{_LOGGER_NAME}.{name}")
