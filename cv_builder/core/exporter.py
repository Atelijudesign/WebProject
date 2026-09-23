"""
CV Builder Pro — Exporter
Renderiza CVData → HTML (via Jinja2) y exporta a PDF (via QWebEnginePage).

Decisiones técnicas:
  - No usamos WeasyPrint/GTK (problema clásico en Windows). En su lugar
    aprovechamos el motor Chromium que ya viene con PyQt6-WebEngine.
  - Los CV se renderizan sin fotografías personales para favorecer privacidad
    y compatibilidad con procesos ATS.
"""
from __future__ import annotations

import logging
import re
import tempfile
from pathlib import Path
from typing import TYPE_CHECKING, Optional

from jinja2 import Environment, FileSystemLoader, select_autoescape

from core.models import CVData

if TYPE_CHECKING:
    # Solo para type-checkers; no importamos PyQt6 en este módulo para
    # mantener `core/` testeable sin dependencias de GUI.
    from PyQt6.QtWebEngineCore import QWebEnginePage
    from PyQt6.QtGui import QPageLayout

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# Templates disponibles
# ─────────────────────────────────────────────────────────────────────────────
_TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"

_TEMPLATE_FILES: dict[str, str] = {
    "executive": "template_executive.html",
    "minimal":   "template_minimal.html",
    "technical": "template_technical.html",
    "ats":       "template_ats.html",
    "latex":     "template_latex.tex",
}

DEFAULT_TEMPLATE = "executive"

# ─────────────────────────────────────────────────────────────────────────────
# Jinja2 env (singleton)
# ─────────────────────────────────────────────────────────────────────────────
_jinja_env: Optional[Environment] = None


# Caracteres especiales de LaTeX que hay que escapar en strings de datos.
# Se usa un enfoque single-pass con regex para evitar que los reemplazos
# se re-escapen entre sí (ej: {} en \textbackslash{}).
_LATEX_SPECIAL_MAP: dict[str, str] = {
    "\\": r"\textbackslash{}",
    "&":  r"\&",
    "%":  r"\%",
    "$":  r"\$",
    "#":  r"\#",
    "_":  r"\_",
    "{":  r"\{",
    "}":  r"\}",
    "~":  r"\textasciitilde{}",
    "^":  r"\textasciicircum{}",
}

# Regex que matchea cualquier carácter especial de LaTeX en un solo paso
_LATEX_SPECIAL_RE = re.compile(
    "|".join(re.escape(k) for k in _LATEX_SPECIAL_MAP)
)


def _latex_escape(value) -> str:
    """Escapa caracteres especiales de LaTeX en un string.

    Usa un reemplazo single-pass vía regex para evitar que las llaves {}
    insertadas por \\textbackslash{}, \\textasciitilde{}, etc. se re-escapen.
    """
    if value is None:
        return ""
    s = str(value)
    return _LATEX_SPECIAL_RE.sub(lambda m: _LATEX_SPECIAL_MAP[m.group()], s)


def _get_jinja_env() -> Environment:
    global _jinja_env
    if _jinja_env is None:
        # Para .tex NO activamos autoescape (queremos \section, no \\section)
        _jinja_env = Environment(
            loader=FileSystemLoader(str(_TEMPLATES_DIR)),
            autoescape=select_autoescape(["html"]),
            keep_trailing_newline=True,
        )
        _jinja_env.filters["latex_escape"] = _latex_escape
    return _jinja_env


def list_templates() -> list[str]:
    """Devuelve la lista de identificadores de template disponibles."""
    return list(_TEMPLATE_FILES.keys())


# ─────────────────────────────────────────────────────────────────────────────
# Render → HTML
# ─────────────────────────────────────────────────────────────────────────────
def render_html(cv: CVData) -> str:
    """Renderiza el CVData al HTML completo del template seleccionado.

    Caso especial: si el template es "latex", devuelve un HTML que
    muestra el código LaTeX en un <pre> (es lo que se ve en el preview).
    Para obtener el .tex crudo, usa ``render_latex(cv)``.
    """
    if cv.template == "latex":
        return _wrap_latex_as_preview_html(render_latex(cv))
    env = _get_jinja_env()
    template_file = _TEMPLATE_FILES.get(cv.template, _TEMPLATE_FILES[DEFAULT_TEMPLATE])
    template = env.get_template(template_file)
    return template.render(cv=cv)


def render_latex(cv: CVData) -> str:
    """Devuelve el código LaTeX crudo, listo para guardar como .tex.

    Compilable con: ``pdflatex template_latex.tex`` (vía ``texlive-latex-recommended``).
    """
    env = _get_jinja_env()
    template = env.get_template(_TEMPLATE_FILES["latex"])
    return template.render(cv=cv)


def _wrap_latex_as_preview_html(latex_source: str) -> str:
    """Envuelve el código LaTeX en una página HTML para mostrarlo en el preview."""
    # Escapar <, >, & para que el <pre> los muestre literal.
    safe = (
        latex_source
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>Preview LaTeX</title>
<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{
    font-family: 'Consolas', 'Menlo', 'Courier New', monospace;
    background: #1a1d24; color: #d4d4d4;
    font-size: 12.5px; line-height: 1.5;
  }}
  .toolbar {{
    position: sticky; top: 0;
    background: #11141a; color: #8ba4bf;
    padding: 10px 16px;
    border-bottom: 1px solid #2d3f55;
    font-family: -apple-system, system-ui, sans-serif;
    font-size: 13px;
  }}
  .toolbar code {{ color: #4ec9b0; }}
  pre {{
    padding: 18px 20px;
    white-space: pre-wrap;
    word-break: break-word;
  }}
  /* Pseudo-syntax-highlight para deleitar al ojo */
  .cm {{ color: #6a9955; font-style: italic; }} /* comentarios */
</style>
</head>
<body>
<div class="toolbar">
  📄 <strong>Vista previa del código LaTeX</strong> — Usa <code>Exportar LaTeX</code> para descargar el <code>.tex</code>.
  Compílalo con <code>pdflatex archivo.tex</code>.
</div>
<pre>{safe}</pre>
</body>
</html>
"""


def render_to_temp_file(cv: CVData) -> str:
    """Guarda el HTML renderizado en un archivo temporal y devuelve su URI file://.

    El archivo temporal NO se borra automáticamente: el motor de Chromium
    necesita que el archivo siga existiendo mientras se muestra el preview.
    Si quisieras limpiarlo, hazlo cuando el usuario cierre el CV.
    """
    html = render_html(cv)
    tmp = tempfile.NamedTemporaryFile(
        mode="w",
        suffix=".html",
        encoding="utf-8",
        delete=False,
        prefix="cvbuilder_preview_",
    )
    try:
        tmp.write(html)
    finally:
        tmp.close()
    return Path(tmp.name).as_uri()


# ─────────────────────────────────────────────────────────────────────────────
# Export → PDF
# ─────────────────────────────────────────────────────────────────────────────
def make_a4_page_layout() -> "QPageLayout":
    """Layout A4 vertical con márgenes 0 (los templates ya tienen padding).

    Centralizado aquí para no repetir imports de PyQt6 en main_window.
    """
    from PyQt6.QtCore import QMarginsF
    from PyQt6.QtGui import QPageLayout, QPageSize

    return QPageLayout(
        QPageSize(QPageSize.PageSizeId.A4),
        QPageLayout.Orientation.Portrait,
        QMarginsF(0, 0, 0, 0),
    )


def export_pdf(
    page: "QWebEnginePage",
    output_path: str | Path,
    cv: Optional[CVData] = None,
) -> Path:
    """Imprime el HTML actual de la QWebEnginePage a PDF (A4 vertical).

    El proceso es asíncrono: `printToPdf` dispara la señal
    `pdfPrintingFinished` en `page` cuando termina. Esta función solo
    dispara el comando; el llamador debe conectar la señal para
    conocer el resultado.

    Args:
        page: QWebEnginePage que ya tiene cargado el HTML del CV.
        output_path: Ruta destino del PDF (se crean los directorios).
        cv: opcional, solo para logging.
    """
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    layout = make_a4_page_layout()
    logger.info(
        "Iniciando export PDF → %s (template=%s)",
        out,
        cv.template if cv else "?",
    )
    page.printToPdf(str(out), layout)
    return out
