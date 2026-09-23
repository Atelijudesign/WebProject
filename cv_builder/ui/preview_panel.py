"""
CV Builder Pro — Preview Panel
QWebEngineView que renderiza el CV en tiempo real.

Responsabilidades:
  - Cargar el HTML renderizado por core.exporter en una vista embebida.
  - Exponer la QWebEnginePage para que main_window gestione el export PDF.
"""
from __future__ import annotations
from typing import Optional

from PyQt6.QtCore import QUrl, pyqtSignal
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtWebEngineCore import QWebEngineSettings

from core.logger import get_logger
from core.models import CVData
from core.exporter import render_to_temp_file

logger = get_logger(__name__)


class PreviewPanel(QWebEngineView):
    """Panel de vista previa del CV."""

    # (success, output_path, error_message)
    pdf_export_finished = pyqtSignal(bool, str, str)

    def __init__(self, parent=None) -> None:
        super().__init__(parent)
        self._current_temp: Optional[str] = None
        self._pending_pdf_path: Optional[str] = None
        self._export_pending: bool = False

        # Habilitar acceso a fuentes externas (Google Fonts) y a archivos
        # locales (para que las imágenes embebidas se rendericen bien).
        settings = self.settings()
        settings.setAttribute(
            QWebEngineSettings.WebAttribute.LocalContentCanAccessRemoteUrls, True
        )
        settings.setAttribute(
            QWebEngineSettings.WebAttribute.LocalContentCanAccessFileUrls, True
        )

        self.page().pdfPrintingFinished.connect(self._on_pdf_finished)

    # ──────────────────────────────────────────────────────────────
    # Preview
    # ──────────────────────────────────────────────────────────────
    def refresh(self, cv: CVData) -> None:
        """Re-renderiza el preview con los datos actuales del CV."""
        try:
            url_str = render_to_temp_file(cv)
        except Exception as exc:
            logger.exception("No se pudo renderizar el preview: %s", exc)
            self.setHtml(
                f"<html><body style='font-family:sans-serif;padding:24px'>"
                f"<h2>Error renderizando el CV</h2><pre>{exc}</pre></body></html>"
            )
            return
        self._current_temp = url_str
        self.setUrl(QUrl(url_str))

    # ──────────────────────────────────────────────────────────────
    # PDF export — delega a core.exporter.export_pdf
    # ──────────────────────────────────────────────────────────────
    def request_pdf_export(self, cv: CVData, output_path: str) -> None:
        """Recarga el HTML actualizado y, al terminar, dispara el printToPdf.

        `core.exporter.export_pdf` es quien llama a `printToPdf`; aquí solo
        nos aseguramos de que la página esté cargada antes de imprimir.
        """
        from core.exporter import export_pdf
        self._pending_pdf_path = output_path
        self._export_pending = True

        def _on_loaded(ok: bool) -> None:
            self.loadFinished.disconnect(_on_loaded)
            if not ok:
                logger.error("Falló la carga del HTML para export PDF")
                self.pdf_export_finished.emit(False, output_path, "load failed")
                self._reset_export_state()
                return
            try:
                export_pdf(self.page(), output_path, cv=cv)
            except Exception as exc:
                logger.exception("Error al disparar printToPdf: %s", exc)
                self.pdf_export_finished.emit(False, output_path, str(exc))
                self._reset_export_state()

        self.loadFinished.connect(_on_loaded)
        try:
            url_str = render_to_temp_file(cv)
        except Exception as exc:
            logger.exception("Error generando HTML para PDF: %s", exc)
            self.loadFinished.disconnect(_on_loaded)
            self.pdf_export_finished.emit(False, output_path, str(exc))
            self._reset_export_state()
            return
        self.setUrl(QUrl(url_str))

    def _on_pdf_finished(self, file_path: str, success: bool) -> None:
        if not self._export_pending:
            # Evento no solicitado por nosotros (p.ej. test)
            return
        err = "" if success else "printToPdf returned False"
        self.pdf_export_finished.emit(success, file_path, err)
        self._reset_export_state()

    def _reset_export_state(self) -> None:
        self._export_pending = False
        self._pending_pdf_path = None
