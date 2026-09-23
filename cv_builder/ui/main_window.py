"""
CV Builder Pro — Main Window
QMainWindow con layout de 3 paneles: Sidebar de secciones | Editor | Preview.

Mejoras recientes (v1.1):
  - Logging estructurado (ver core.logger) en lugar de except: pass.
  - Autosave cada 30s a ~/.cvbuilder/autosave.cvb.
  - Prompt de recuperación de autosave al arrancar.
  - Validación silenciosa al exportar PDF (bloquea si hay errores).
  - Export PDF centralizado en core.exporter.
"""
from __future__ import annotations

from pathlib import Path

from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QAction, QColor, QKeySequence
from PyQt6.QtWidgets import (
    QColorDialog, QComboBox, QFileDialog, QHBoxLayout, QLabel,
    QListWidget, QListWidgetItem, QMainWindow, QMessageBox,
    QSplitter, QStackedWidget, QStatusBar, QToolBar,
    QVBoxLayout, QWidget,
)

from core.logger import get_logger, setup_logging
from core.models import CVData
from core import storage
from core.paths import autosave_path, log_path, safe_filename
from core.validation import (
    Severity, has_blocking_errors, validate_all,
)
from core.exporter import render_latex

from ui.preview_panel import PreviewPanel
from ui.panels.personal_panel import PersonalPanel
from ui.panels.target_job_panel import TargetJobPanel
from ui.panels.summary_panel import SummaryPanel
from ui.panels.experience_panel import ExperiencePanel
from ui.panels.education_panel import EducationPanel
from ui.panels.skills_panel import SkillsPanel
from ui.panels.list_panels import (
    LanguagesPanel, CertificationsPanel, ProjectsPanel, PublicationsPanel,
)
from ui.panels.ats_review_panel import ATSReviewPanel

logger = get_logger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# Configuración
# ─────────────────────────────────────────────────────────────────────────────
_SECTIONS = [
    ("👤  Personal",        PersonalPanel),
    ("🎯  Vacante ATS",     TargetJobPanel),
    ("📝  Resumen",         SummaryPanel),
    ("💼  Experiencia",     ExperiencePanel),
    ("🎓  Educación",       EducationPanel),
    ("🔧  Habilidades",     SkillsPanel),
    ("🌐  Idiomas",         LanguagesPanel),
    ("🏅  Certificaciones", CertificationsPanel),
    ("🚀  Proyectos",       ProjectsPanel),
    ("📚  Publicaciones",   PublicationsPanel),
    ("✅  Revisión ATS",    ATSReviewPanel),
]

_TEMPLATES = [
    ("Executive (Dark Header)", "executive"),
    ("Minimal (Clean White)",   "minimal"),
    ("Technical (Sidebar)",     "technical"),
    ("ATS (Plain / Parsers)",   "ats"),
    ("LaTeX (.tex source)",     "latex"),
]

_DEBOUNCE_MS = 600       # preview refresh tras editar
_AUTOSAVE_MS = 30_000    # autoguardado cada 30 s


class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self._cv: CVData = storage.new_empty()
        self._current_file: Path | None = None
        self._is_dirty: bool = False
        self._is_loading: bool = False

        self.setWindowTitle("CV Builder Pro")
        self.setMinimumSize(1280, 780)
        self.resize(1440, 860)

        # Inicialización de UI
        self._build_toolbar()
        self._build_central()
        self._build_statusbar()

        # Timers
        self._preview_timer = QTimer(self)
        self._preview_timer.setSingleShot(True)
        self._preview_timer.setInterval(_DEBOUNCE_MS)
        self._preview_timer.timeout.connect(self._do_refresh_preview)

        self._autosave_timer = QTimer(self)
        self._autosave_timer.setInterval(_AUTOSAVE_MS)
        self._autosave_timer.timeout.connect(self._do_autosave)
        self._autosave_timer.start()

        # Señales
        self._preview.pdf_export_finished.connect(self._on_pdf_done)

        # Carga inicial
        self._load_cv_to_panels()
        self._do_refresh_preview()
        self._apply_stylesheet()

        # Recuperar autosave si existe
        QTimer.singleShot(0, self._maybe_restore_autosave)

        logger.info("CV Builder Pro listo.")

    # ──────────────────────────────────────────────────────────────────────────
    # TOOLBAR
    # ──────────────────────────────────────────────────────────────────────────
    def _build_toolbar(self) -> None:
        tb = QToolBar("Main Toolbar")
        tb.setObjectName("MainToolbar")
        tb.setMovable(False)
        tb.setToolButtonStyle(Qt.ToolButtonStyle.ToolButtonTextBesideIcon)
        self.addToolBar(tb)

        act_new   = QAction("🗋  Nuevo",         self)
        act_open  = QAction("📂  Abrir",         self)
        act_save  = QAction("💾  Guardar",       self)
        act_pdf   = QAction("📤  Exportar PDF",  self)
        act_tex   = QAction("📜  Exportar LaTeX", self)

        act_new.setShortcut(QKeySequence.StandardKey.New)
        act_open.setShortcut(QKeySequence.StandardKey.Open)
        act_save.setShortcut(QKeySequence.StandardKey.Save)

        act_new.triggered.connect(self._new_cv)
        act_open.triggered.connect(self._open_cv)
        act_save.triggered.connect(self._save_cv)
        act_pdf.triggered.connect(self._export_pdf)
        act_tex.triggered.connect(self._export_latex)

        tb.addActions([act_new, act_open, act_save])
        tb.addSeparator()
        tb.addAction(act_pdf)
        tb.addAction(act_tex)
        tb.addSeparator()

        # Template selector
        tb.addWidget(QLabel("  Template: "))
        self._template_combo = QComboBox()
        self._template_combo.setObjectName("TemplateCombo")
        for name, key in _TEMPLATES:
            self._template_combo.addItem(name, key)
        self._template_combo.currentIndexChanged.connect(self._on_template_change)
        tb.addWidget(self._template_combo)
        tb.addSeparator()

        # Color picker
        self._color_btn = QLabel("  Color: ")
        tb.addWidget(self._color_btn)
        self._color_preview = QLabel("   ")
        self._color_preview.setObjectName("ColorPreview")
        self._color_preview.setFixedSize(28, 22)
        self._color_preview.setCursor(Qt.CursorShape.PointingHandCursor)
        self._color_preview.mousePressEvent = lambda _: self._pick_color()  # type: ignore[assignment]
        self._update_color_preview()
        tb.addWidget(self._color_preview)

    # ──────────────────────────────────────────────────────────────────────────
    # CENTRAL WIDGET — 3 paneles
    # ──────────────────────────────────────────────────────────────────────────
    def _build_central(self) -> None:
        central = QWidget()
        self.setCentralWidget(central)
        h = QHBoxLayout(central)
        h.setContentsMargins(0, 0, 0, 0)
        h.setSpacing(0)

        splitter = QSplitter(Qt.Orientation.Horizontal)
        splitter.setChildrenCollapsible(False)

        # LEFT: section list
        left = QWidget()
        left.setObjectName("SectionBar")
        left.setFixedWidth(190)
        lv = QVBoxLayout(left)
        lv.setContentsMargins(0, 0, 0, 0)
        lv.setSpacing(0)

        header = QLabel("  SECCIONES")
        header.setObjectName("SectionHeader")
        header.setFixedHeight(36)
        lv.addWidget(header)

        self._section_list = QListWidget()
        self._section_list.setObjectName("SectionList")
        for name, _ in _SECTIONS:
            item = QListWidgetItem(name)
            item.setSizeHint(item.sizeHint().__class__(190, 38))
            self._section_list.addItem(item)
        self._section_list.currentRowChanged.connect(self._on_section_changed)
        lv.addWidget(self._section_list)
        splitter.addWidget(left)

        # CENTER: stacked editor panels
        self._stack = QStackedWidget()
        self._stack.setObjectName("EditorStack")
        self._panels = []
        for _, PanelClass in _SECTIONS:
            panel = PanelClass()
            panel.data_changed.connect(self._on_data_changed)
            self._panels.append(panel)

            wrapper = QWidget()
            wrapper.setObjectName("PanelWrapper")
            wl = QVBoxLayout(wrapper)
            wl.setContentsMargins(16, 16, 16, 16)
            wl.addWidget(panel)
            self._stack.addWidget(wrapper)

        splitter.addWidget(self._stack)

        # RIGHT: preview
        self._preview = PreviewPanel()
        self._preview.setObjectName("PreviewPanel")
        splitter.addWidget(self._preview)

        splitter.setSizes([190, 440, 610])
        h.addWidget(splitter)

        self._section_list.setCurrentRow(0)

    # ──────────────────────────────────────────────────────────────────────────
    # STATUSBAR
    # ──────────────────────────────────────────────────────────────────────────
    def _build_statusbar(self) -> None:
        self._status = QStatusBar()
        self.setStatusBar(self._status)
        self._status_lbl = QLabel("Nuevo CV · Sin guardar")
        self._status.addWidget(self._status_lbl)

    # ──────────────────────────────────────────────────────────────────────────
    # EVENT HANDLERS
    # ──────────────────────────────────────────────────────────────────────────
    def _on_section_changed(self, idx: int) -> None:
        if 0 <= idx < self._stack.count():
            self._save_panels_to_cv()
            self._stack.setCurrentIndex(idx)
            panel = self._panels[idx]
            if getattr(panel, "requires_fresh_cv", False):
                panel.load(self._cv)

    def _on_data_changed(self) -> None:
        if self._is_loading:
            return
        self._is_dirty = True
        self._save_panels_to_cv()
        self._preview_timer.start()
        self._update_title()

    def _on_template_change(self, _: int) -> None:
        self._cv.template = self._template_combo.currentData() or "executive"
        self._preview_timer.start()

    def _pick_color(self) -> None:
        color = QColorDialog.getColor(QColor(self._cv.accent_color), self, "Color de acento")
        if color.isValid():
            self._cv.accent_color = color.name()
            self._update_color_preview()
            self._preview_timer.start()
            logger.info("Color de acento cambiado a %s", self._cv.accent_color)

    def _update_color_preview(self) -> None:
        self._color_preview.setStyleSheet(
            f"background:{self._cv.accent_color};border-radius:4px;border:1px solid #444;"
        )

    # ──────────────────────────────────────────────────────────────────────────
    # CV DATA SYNC
    # ──────────────────────────────────────────────────────────────────────────
    def _save_panels_to_cv(self) -> None:
        for panel in self._panels:
            try:
                panel.save(self._cv)
            except Exception:
                logger.exception("Panel %s falló al guardar", type(panel).__name__)

    def _load_cv_to_panels(self) -> None:
        self._is_loading = True
        try:
            for panel in self._panels:
                try:
                    panel.load(self._cv)
                except Exception:
                    logger.exception("Panel %s falló al cargar", type(panel).__name__)
            for i, (_, key) in enumerate(_TEMPLATES):
                if key == self._cv.template:
                    self._template_combo.setCurrentIndex(i)
                    break
            self._update_color_preview()
        finally:
            self._is_loading = False

    def _do_refresh_preview(self) -> None:
        self._save_panels_to_cv()
        self._preview.refresh(self._cv)

    def _do_autosave(self) -> None:
        if not self._is_dirty:
            return
        self._save_panels_to_cv()
        try:
            path = autosave_path()
            storage.save(self._cv, path)
            logger.info("Autosave OK → %s", path)
            self._status_lbl.setText(
                f"💾 Autoguardado {self._format_now()} · {path.name}"
            )
        except Exception:
            logger.exception("Autosave falló")

    @staticmethod
    def _format_now() -> str:
        from datetime import datetime
        return datetime.now().strftime("%H:%M:%S")

    def _maybe_restore_autosave(self) -> None:
        path = autosave_path()
        if not path.exists():
            return
        try:
            cv = storage.load(path)
        except Exception:
            logger.exception("Autosave corrupto en %s", path)
            return
        # Si el usuario ya tenía un archivo abierto/cargado, no machacar.
        if self._current_file is not None:
            return
        # Si el CV está vacío, tampoco.
        if not cv.personal.name and not cv.summary.text:
            return
        reply = QMessageBox.question(
            self, "Recuperar autoguardado",
            f"Se encontró un autoguardado de un CV anterior:\n\n"
            f"  · Nombre: {cv.personal.name or '(sin nombre)'}\n"
            f"  · Archivo: {path}\n\n"
            f"¿Deseas recuperarlo?",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
        )
        if reply == QMessageBox.StandardButton.Yes:
            self._cv = cv
            self._current_file = path
            self._is_dirty = False
            self._load_cv_to_panels()
            self._do_refresh_preview()
            self._update_title()
            self._status_lbl.setText(f"♻️  Recuperado de autoguardado")
            logger.info("Autoguardado recuperado: %s", cv.personal.name)

    # ──────────────────────────────────────────────────────────────────────────
    # FILE ACTIONS
    # ──────────────────────────────────────────────────────────────────────────
    def _new_cv(self) -> None:
        if not self._confirm_discard():
            return
        self._cv = storage.new_empty()
        self._current_file = None
        self._is_dirty = False
        self._load_cv_to_panels()
        self._do_refresh_preview()
        self._update_title()
        self._status_lbl.setText("Nuevo CV")
        logger.info("Nuevo CV creado")

    def _open_cv(self) -> None:
        if not self._confirm_discard():
            return
        path, _ = QFileDialog.getOpenFileName(
            self, "Abrir CV", "",
            storage.CV_FILE_FILTER,
        )
        if not path:
            return
        try:
            self._cv = storage.load(path)
        except Exception as exc:
            logger.exception("Error abriendo %s", path)
            QMessageBox.critical(self, "Error al abrir", str(exc))
            return
        self._current_file = Path(path)
        self._is_dirty = False
        self._load_cv_to_panels()
        self._do_refresh_preview()
        self._update_title()
        self._status_lbl.setText(f"Abierto: {Path(path).name}")
        logger.info("CV abierto: %s", path)

    def _save_cv(self) -> None:
        if not self._current_file:
            default_name = safe_filename(self._cv.personal.name) + ".cvb"
            path, _ = QFileDialog.getSaveFileName(
                self, "Guardar CV como…", default_name,
                storage.CV_FILE_FILTER,
            )
            if not path:
                return
            self._current_file = Path(path)
        self._save_panels_to_cv()
        try:
            storage.save(self._cv, self._current_file)
        except Exception as exc:
            logger.exception("Error guardando %s", self._current_file)
            QMessageBox.critical(self, "Error al guardar", str(exc))
            return
        self._is_dirty = False
        self._update_title()
        self._status_lbl.setText(f"Guardado: {self._current_file.name}")
        logger.info("CV guardado: %s", self._current_file)

    def _export_pdf(self) -> None:
        self._save_panels_to_cv()
        issues = validate_all(self._cv)
        if has_blocking_errors(issues):
            QMessageBox.warning(
                self, "Hay errores en el CV",
                "Hay campos obligatorios vacíos. Corrígelos antes de exportar:\n\n"
                + "\n".join(f"  · {i.section}: {i.message}" for i in issues
                            if i.severity == Severity.ERROR)
            )
            return
        default_name = safe_filename(self._cv.personal.name, "CV") + "_CV.pdf"
        path, _ = QFileDialog.getSaveFileName(
            self, "Exportar PDF", default_name,
            "PDF (*.pdf);;All Files (*)",
        )
        if not path:
            return
        self._status_lbl.setText("⏳ Generando PDF…")
        self._preview.request_pdf_export(self._cv, path)

    def _export_latex(self) -> None:
        """Exporta el código fuente LaTeX (.tex) listo para compilar con pdflatex."""
        self._save_panels_to_cv()
        default_name = safe_filename(self._cv.personal.name, "CV") + "_CV.tex"
        path, _ = QFileDialog.getSaveFileName(
            self, "Exportar LaTeX", default_name,
            "LaTeX (*.tex);;All Files (*)",
        )
        if not path:
            return
        try:
            tex_source = render_latex(self._cv)
        except Exception as exc:
            logger.exception("Error generando LaTeX: %s", exc)
            QMessageBox.critical(self, "Error", f"No se pudo generar el LaTeX:\n{exc}")
            return
        try:
            with open(path, "w", encoding="utf-8") as f:
                f.write(tex_source)
        except OSError as exc:
            logger.exception("Error guardando LaTeX en %s", path)
            QMessageBox.critical(self, "Error al guardar", str(exc))
            return
        self._status_lbl.setText(f"📜 LaTeX exportado: {Path(path).name}")
        logger.info("LaTeX exportado OK: %s (%d bytes)", path, len(tex_source))
        QMessageBox.information(
            self, "LaTeX exportado",
            f"Archivo .tex guardado en:\n{path}\n\n"
            f"Para compilarlo a PDF:\n"
            f"  pdflatex {Path(path).name}",
        )

    def _on_pdf_done(self, success: bool, path: str, err: str) -> None:
        if success:
            self._status_lbl.setText(f"✅ PDF exportado: {Path(path).name}")
            QMessageBox.information(
                self, "PDF Exportado",
                f"El PDF fue guardado en:\n{path}",
            )
            logger.info("PDF exportado OK: %s", path)
        else:
            self._status_lbl.setText("❌ Error al exportar PDF")
            QMessageBox.warning(
                self, "Error",
                f"No se pudo exportar el PDF.\n\nDetalle: {err or 'desconocido'}",
            )
            logger.error("PDF export FAILED: %s — %s", path, err)

    # ──────────────────────────────────────────────────────────────────────────
    # HELPERS
    # ──────────────────────────────────────────────────────────────────────────
    def _confirm_discard(self) -> bool:
        if not self._is_dirty:
            return True
        reply = QMessageBox.question(
            self, "Cambios sin guardar",
            "Tienes cambios sin guardar. ¿Deseas continuar y descartarlos?",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
        )
        return reply == QMessageBox.StandardButton.Yes

    def _update_title(self) -> None:
        name = self._cv.personal.name or "Sin nombre"
        file = self._current_file.name if self._current_file else "Sin guardar"
        dirty = " •" if self._is_dirty else ""
        self.setWindowTitle(f"CV Builder Pro — {name} [{file}]{dirty}")

    def closeEvent(self, event) -> None:
        if self._is_dirty and not self._confirm_discard():
            event.ignore()
            return
        self._autosave_timer.stop()
        event.accept()

    # ──────────────────────────────────────────────────────────────────────────
    # STYLESHEET
    # ──────────────────────────────────────────────────────────────────────────
    def _apply_stylesheet(self) -> None:
        self.setStyleSheet("""
            QMainWindow, QWidget { background: #0f1923; color: #e2e8f0; font-family: 'Inter', 'Segoe UI', sans-serif; font-size: 13px; }

            QToolBar#MainToolbar { background: #1a2535; border-bottom: 1px solid #2d3f55; padding: 4px 8px; spacing: 4px; }
            QToolBar#MainToolbar QToolButton {
                background: transparent; color: #c8d6e8; border: none;
                padding: 5px 12px; border-radius: 6px; font-size: 13px;
            }
            QToolBar#MainToolbar QToolButton:hover { background: #243348; color: #fff; }
            QToolBar#MainToolbar QToolButton:pressed { background: #1e3050; }

            QWidget#SectionBar { background: #111d2b; border-right: 1px solid #1e2e42; }
            QLabel#SectionHeader {
                background: #0d1824; color: #5a7a9a;
                font-size: 10px; font-weight: 700; letter-spacing: 2px;
                padding-left: 16px;
            }
            QListWidget#SectionList {
                background: transparent; border: none;
                outline: none;
            }
            QListWidget#SectionList::item {
                padding: 8px 16px; color: #8ba4bf;
                border-left: 3px solid transparent;
            }
            QListWidget#SectionList::item:selected {
                background: #1a2d42; color: #e2f0ff;
                border-left: 3px solid #3b7dd8;
            }
            QListWidget#SectionList::item:hover:!selected { background: #162233; color: #c0d8f0; }

            QWidget#EditorStack { background: #13202f; }
            QWidget#PanelWrapper { background: #13202f; }

            QGroupBox {
                color: #8ba4bf; font-size: 11px; font-weight: 600;
                border: 1px solid #1e2e42; border-radius: 8px;
                margin-top: 12px; padding: 12px 10px 8px;
            }
            QGroupBox::title { subcontrol-origin: margin; left: 12px; padding: 0 4px; }

            QLineEdit#Field, QPlainTextEdit#Field, QComboBox#Field {
                background: #0d1824; border: 1px solid #1e2e42;
                border-radius: 6px; padding: 6px 10px;
                color: #e2e8f0; selection-background-color: #3b7dd8;
            }
            QLineEdit#Field:focus, QPlainTextEdit#Field:focus { border-color: #3b7dd8; }

            QLabel#FieldLabel { color: #8ba4bf; font-size: 12px; }
            QLabel#HintLabel  { color: #4a6a8a; font-size: 11px; font-style: italic; }

            QComboBox#TemplateCombo {
                background: #1a2535; border: 1px solid #2d3f55;
                border-radius: 6px; padding: 4px 10px; color: #c8d6e8;
                min-width: 200px;
            }
            QComboBox#TemplateCombo::drop-down { border: none; }
            QComboBox#TemplateCombo QAbstractItemView { background: #1a2535; color: #c8d6e8; }

            QListWidget#EntryList {
                background: #0d1824; border: 1px solid #1e2e42;
                border-radius: 6px; color: #c8d6e8; outline: none;
            }
            QListWidget#EntryList::item { padding: 6px 10px; }
            QListWidget#EntryList::item:selected { background: #1e3a5a; color: #fff; }
            QListWidget#EntryList::item:hover:!selected { background: #162233; }

            QPushButton {
                background: #1e3050; border: 1px solid #2d4a6a;
                border-radius: 6px; padding: 5px 14px; color: #c8d6e8;
            }
            QPushButton:hover { background: #274060; color: #fff; }
            QPushButton:pressed { background: #1a2d47; }
            QPushButton#SecondaryButton { background: #1a2535; }
            QPushButton#DangerButton { background: #3a1a1a; border-color: #6a2a2a; color: #f08080; }
            QPushButton#DangerButton:hover { background: #4a2020; }

            QSlider::groove:horizontal { height: 4px; background: #1e2e42; border-radius: 2px; }
            QSlider::handle:horizontal {
                width: 14px; height: 14px; border-radius: 7px;
                background: #3b7dd8; margin: -5px 0;
            }
            QSlider::sub-page:horizontal { background: #3b7dd8; border-radius: 2px; }

            QScrollArea { background: transparent; border: none; }
            QScrollBar:vertical { width: 6px; background: transparent; }
            QScrollBar::handle:vertical { background: #2a3d52; border-radius: 3px; }

            QFrame#Separator { color: #1e2e42; }
            QStatusBar { background: #0d1824; color: #5a7a9a; border-top: 1px solid #1e2e42; font-size: 12px; }

            QCheckBox { color: #c8d6e8; spacing: 8px; }
            QCheckBox::indicator { width: 16px; height: 16px; border: 1px solid #2d4a6a; border-radius: 4px; background: #0d1824; }
            QCheckBox::indicator:checked { background: #3b7dd8; border-color: #3b7dd8; }

        """)


# ─────────────────────────────────────────────────────────────────────────────
# Bootstrap helper para que main.py sea trivial.
# ─────────────────────────────────────────────────────────────────────────────
def run_app() -> int:
    """Inicializa logging, lanza la app y devuelve el exit code."""
    import os
    import sys
    from PyQt6.QtWidgets import QApplication
    from PyQt6.QtGui import QFont

    setup_logging(log_file=log_path())
    logger.info("=" * 60)
    logger.info("CV Builder Pro iniciando · log=%s", log_path())

    os.environ.setdefault("QT_ENABLE_HIGHDPI_SCALING", "1")
    app = QApplication(sys.argv)
    app.setApplicationName("CV Builder Pro")
    app.setApplicationDisplayName("CV Builder Pro")
    app.setOrganizationName("Andrés Gallo Parra")
    app.setFont(QFont("Segoe UI", 10))

    window = MainWindow()
    window.show()
    return app.exec()
