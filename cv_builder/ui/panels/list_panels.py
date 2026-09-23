"""
CV Builder Pro — Languages, Certifications, Projects, Publications Panels
"""
from PyQt6.QtCore import pyqtSignal
from PyQt6.QtWidgets import (
    QComboBox, QFormLayout, QLineEdit, QPlainTextEdit,
    QScrollArea, QVBoxLayout, QWidget,
)
from core.models import (
    CVData, LanguageEntry, CertificationEntry, ProjectEntry, PublicationEntry,
)
from ui.panels.base_panel import BasePanel
from ui.panels.list_crud_panel import ListCrudPanel


# ── LANGUAGES ──────────────────────────────────────────────────────────────

_LANG_LEVELS = ["Nativo", "C2 — Maestría", "C1 — Avanzado", "B2 — Intermedio-alto",
                "B1 — Intermedio", "A2 — Elemental", "A1 — Principiante"]


class _LangForm(QWidget):
    data_changed = pyqtSignal()

    def __init__(self, parent=None):
        super().__init__(parent)
        form = QFormLayout(self)
        form.setSpacing(10)
        self._name = QLineEdit()
        self._name.setObjectName("Field")
        self._name.textChanged.connect(self.data_changed)
        form.addRow("Idioma *", self._name)
        self._level = QComboBox()
        self._level.setObjectName("Field")
        self._level.addItems(_LANG_LEVELS)
        self._level.currentTextChanged.connect(self.data_changed)
        form.addRow("Nivel", self._level)

    def load_entry(self, e: LanguageEntry):
        self._name.setText(e.name)
        idx = next((i for i, v in enumerate(_LANG_LEVELS) if e.level in v), 0)
        self._level.setCurrentIndex(idx)

    def save_entry(self, e: LanguageEntry):
        e.name  = self._name.text().strip()
        raw = self._level.currentText()
        e.level = raw.split(" — ")[0] if " — " in raw else raw


class LanguagesPanel(BasePanel):
    def __init__(self, parent=None):
        super().__init__("Idiomas", parent)
        self._crud = ListCrudPanel(
            label_fn=lambda e: f"{e.name or 'Nuevo'} · {e.level or '—'}",
            factory_fn=LanguageEntry,
            form_widget_class=_LangForm,
        )
        self._crud.data_changed.connect(self.data_changed)
        self._layout.addWidget(self._crud)

    def load(self, cv: CVData):
        self._crud.load_items(cv.languages)

    def save(self, cv: CVData):
        cv.languages = self._crud.get_items()


# ── CERTIFICATIONS ─────────────────────────────────────────────────────────

class _CertForm(QWidget):
    data_changed = pyqtSignal()

    def __init__(self, parent=None):
        super().__init__(parent)
        form = QFormLayout(self)
        form.setSpacing(8)
        for attr, label in [("_name", "Nombre certificación *"), ("_issuer", "Emisor / Plataforma"),
                             ("_date", "Fecha (ej: Jun 2024)"), ("_id", "ID Credencial"), ("_url", "URL verificación")]:
            le = QLineEdit()
            le.setObjectName("Field")
            le.textChanged.connect(self.data_changed)
            setattr(self, attr, le)
            form.addRow(label, le)

    def load_entry(self, e: CertificationEntry):
        self._name.setText(e.name)
        self._issuer.setText(e.issuer)
        self._date.setText(e.date)
        self._id.setText(e.credential_id)
        self._url.setText(e.url)

    def save_entry(self, e: CertificationEntry):
        e.name          = self._name.text().strip()
        e.issuer        = self._issuer.text().strip()
        e.date          = self._date.text().strip()
        e.credential_id = self._id.text().strip()
        e.url           = self._url.text().strip()


class CertificationsPanel(BasePanel):
    def __init__(self, parent=None):
        super().__init__("Certificaciones", parent)
        self._crud = ListCrudPanel(
            label_fn=lambda e: f"{e.name or 'Nueva'} · {e.issuer or '—'}",
            factory_fn=CertificationEntry,
            form_widget_class=_CertForm,
        )
        self._crud.data_changed.connect(self.data_changed)
        self._layout.addWidget(self._crud)

    def load(self, cv: CVData):
        self._crud.load_items(cv.certifications)

    def save(self, cv: CVData):
        cv.certifications = self._crud.get_items()


# ── PROJECTS ───────────────────────────────────────────────────────────────

class _ProjectForm(QWidget):
    data_changed = pyqtSignal()

    def __init__(self, parent=None):
        super().__init__(parent)
        form = QFormLayout(self)
        form.setSpacing(8)
        for attr, label in [("_name", "Nombre proyecto *"), ("_date", "Fecha"), ("_tech", "Tecnologías (separadas por coma)"), ("_url", "URL / Repositorio")]:
            le = QLineEdit()
            le.setObjectName("Field")
            le.textChanged.connect(self.data_changed)
            setattr(self, attr, le)
            form.addRow(label, le)
        self._desc = QPlainTextEdit()
        self._desc.setObjectName("Field")
        self._desc.setMinimumHeight(80)
        self._desc.textChanged.connect(self.data_changed)
        form.addRow("Descripción", self._desc)

    def load_entry(self, e: ProjectEntry):
        self._name.setText(e.name)
        self._date.setText(e.date)
        self._tech.setText(e.technologies)
        self._url.setText(e.url)
        self._desc.setPlainText(e.description)

    def save_entry(self, e: ProjectEntry):
        e.name         = self._name.text().strip()
        e.date         = self._date.text().strip()
        e.technologies = self._tech.text().strip()
        e.url          = self._url.text().strip()
        e.description  = self._desc.toPlainText().strip()


class ProjectsPanel(BasePanel):
    def __init__(self, parent=None):
        super().__init__("Proyectos", parent)
        self._crud = ListCrudPanel(
            label_fn=lambda e: e.name or "Nuevo proyecto",
            factory_fn=ProjectEntry,
            form_widget_class=_ProjectForm,
        )
        self._crud.data_changed.connect(self.data_changed)
        self._layout.addWidget(self._crud)

    def load(self, cv: CVData):
        self._crud.load_items(cv.projects)

    def save(self, cv: CVData):
        cv.projects = self._crud.get_items()


# ── PUBLICATIONS ───────────────────────────────────────────────────────────

class _PubForm(QWidget):
    data_changed = pyqtSignal()

    def __init__(self, parent=None):
        super().__init__(parent)
        form = QFormLayout(self)
        form.setSpacing(8)
        for attr, label in [("_title", "Título *"), ("_pub", "Editorial / Plataforma"),
                             ("_date", "Fecha"), ("_url", "URL")]:
            le = QLineEdit()
            le.setObjectName("Field")
            le.textChanged.connect(self.data_changed)
            setattr(self, attr, le)
            form.addRow(label, le)
        self._desc = QPlainTextEdit()
        self._desc.setObjectName("Field")
        self._desc.setMinimumHeight(60)
        self._desc.textChanged.connect(self.data_changed)
        form.addRow("Descripción", self._desc)

    def load_entry(self, e: PublicationEntry):
        self._title.setText(e.title)
        self._pub.setText(e.publisher)
        self._date.setText(e.date)
        self._url.setText(e.url)
        self._desc.setPlainText(e.description)

    def save_entry(self, e: PublicationEntry):
        e.title       = self._title.text().strip()
        e.publisher   = self._pub.text().strip()
        e.date        = self._date.text().strip()
        e.url         = self._url.text().strip()
        e.description = self._desc.toPlainText().strip()


class PublicationsPanel(BasePanel):
    def __init__(self, parent=None):
        super().__init__("Publicaciones", parent)
        self._crud = ListCrudPanel(
            label_fn=lambda e: e.title or "Nueva publicación",
            factory_fn=PublicationEntry,
            form_widget_class=_PubForm,
        )
        self._crud.data_changed.connect(self.data_changed)
        self._layout.addWidget(self._crud)

    def load(self, cv: CVData):
        self._crud.load_items(cv.publications)

    def save(self, cv: CVData):
        cv.publications = self._crud.get_items()
