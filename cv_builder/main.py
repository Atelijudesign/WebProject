"""
CV Builder Pro — Entry Point
Aplicación desktop PyQt6 para crear CVs profesionales y exportarlos a PDF.

Uso:
    python -m cv_builder.main
    # o, desde la carpeta cv_builder/:
    python main.py
"""
from __future__ import annotations

import sys
from pathlib import Path

# Permite ejecutar tanto `python main.py` como `python -m cv_builder.main`
_HERE = Path(__file__).resolve().parent
if str(_HERE) not in sys.path:
    sys.path.insert(0, str(_HERE))

from ui.main_window import run_app


if __name__ == "__main__":
    sys.exit(run_app())
