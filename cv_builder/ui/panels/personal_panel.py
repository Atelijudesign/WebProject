"""
CV Builder Pro — Personal Info Panel
"""
from __future__ import annotations

from PyQt6.QtWidgets import (
    QFormLayout, QGroupBox, QLineEdit, QScrollArea, QVBoxLayout, QWidget,
)

from core.models import CVData
from ui.panels.base_panel import BasePanel


class PersonalPanel(BasePanel):
    """Panel de edición de datos personales."""

    def __init__(self, parent=None) -> None:
        super().__init__("Personal", parent)
        self._build_ui()

    def _build_ui(self) -> None:
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(scroll.Shape.NoFrame)

        container = QWidget()
        vl = QVBoxLayout(container)
        vl.setSpacing(16)

        # --- Fields ---
        info_group = QGroupBox("Información básica")
        form = QFormLayout(info_group)
        form.setSpacing(8)

        self._name  = self._field(form, "Nombre completo *")
        self._title = self._field(form, "Cargo / Título")
        self._email = self._field(form, "Email *")
        self._phone = self._field(form, "Teléfono")
        self._loc   = self._field(form, "Ubicación")
        self._li    = self._field(form, "LinkedIn URL")
        self._gh    = self._field(form, "GitHub URL")
        self._web   = self._field(form, "Sitio web")
        vl.addWidget(info_group)

        scroll.setWidget(container)
        self._layout.addWidget(scroll)

    def _field(self, form: QFormLayout, label: str) -> QLineEdit:
        le = QLineEdit()
        le.setObjectName("Field")
        le.textChanged.connect(self.data_changed)
        form.addRow(label, le)
        return le

    def load(self, cv: CVData) -> None:
        p = cv.personal
        self._name.setText(p.name)
        self._title.setText(p.title)
        self._email.setText(p.email)
        self._phone.setText(p.phone)
        self._loc.setText(p.location)
        self._li.setText(p.linkedin)
        self._gh.setText(p.github)
        self._web.setText(p.website)

    def save(self, cv: CVData) -> None:
        p = cv.personal
        p.name       = self._name.text().strip()
        p.title      = self._title.text().strip()
        p.email      = self._email.text().strip()
        p.phone      = self._phone.text().strip()
        p.location   = self._loc.text().strip()
        p.linkedin   = self._li.text().strip()
        p.github     = self._gh.text().strip()
        p.website    = self._web.text().strip()
