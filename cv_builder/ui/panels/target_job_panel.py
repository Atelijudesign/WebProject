"""Panel de vacante para el flujo ATS Command Center."""
from __future__ import annotations

from PyQt6.QtWidgets import (
    QFormLayout, QGroupBox, QLabel, QLineEdit, QPlainTextEdit, QVBoxLayout,
)

from core.ats import extract_keywords
from core.models import CVData
from ui.panels.base_panel import BasePanel


class TargetJobPanel(BasePanel):
    """Captura una vacante y extrae sus términos clave de manera local."""

    def __init__(self, parent=None) -> None:
        super().__init__("Vacante ATS", parent)
        self._build_ui()

    def _build_ui(self) -> None:
        group = QGroupBox("Vacante objetivo")
        form = QFormLayout(group)
        self._title = QLineEdit()
        self._title.setObjectName("Field")
        self._title.setPlaceholderText("Ej: Proyectista Estructural Senior")
        self._title.textChanged.connect(self._on_change)
        form.addRow("Cargo objetivo", self._title)

        self._description = QPlainTextEdit()
        self._description.setObjectName("Field")
        self._description.setMinimumHeight(220)
        self._description.setPlaceholderText(
            "Pega aquí la descripción de la oferta. El análisis se realiza en tu equipo y no se envía a ningún servicio."
        )
        self._description.textChanged.connect(self._on_change)
        form.addRow("Descripción de la oferta", self._description)
        self._layout.addWidget(group)

        result_group = QGroupBox("Palabras clave detectadas")
        result_layout = QVBoxLayout(result_group)
        self._keywords = QLabel("Pega una oferta para identificar sus términos técnicos.")
        self._keywords.setObjectName("HintLabel")
        self._keywords.setWordWrap(True)
        result_layout.addWidget(self._keywords)
        self._layout.addWidget(result_group)
        self._layout.addStretch()

    def _on_change(self) -> None:
        self._refresh_keywords()
        self.data_changed.emit()

    def _refresh_keywords(self) -> None:
        keywords = extract_keywords(self._description.toPlainText())
        self._keywords.setText(
            " · ".join(keywords) if keywords else "Pega una oferta para identificar sus términos técnicos."
        )

    def load(self, cv: CVData) -> None:
        self._title.setText(cv.target_job.title)
        self._description.setPlainText(cv.target_job.description)
        self._refresh_keywords()

    def save(self, cv: CVData) -> None:
        cv.target_job.title = self._title.text().strip()
        cv.target_job.description = self._description.toPlainText().strip()
