"""Panel de revisión ATS para comparar el CV contra una vacante local."""
from __future__ import annotations

from PyQt6.QtWidgets import QGroupBox, QLabel, QVBoxLayout

from core.ats import analyze_cv_match
from core.models import CVData
from ui.panels.base_panel import BasePanel


class ATSReviewPanel(BasePanel):
    """Muestra términos presentes y pendientes sin modificar el contenido del CV."""

    requires_fresh_cv = True

    def __init__(self, parent=None) -> None:
        super().__init__("Revisión ATS", parent)
        self._build_ui()

    def _build_ui(self) -> None:
        heading = QLabel("Revisión ATS local")
        heading.setObjectName("FieldLabel")
        self._layout.addWidget(heading)

        self._summary = QLabel()
        self._summary.setObjectName("HintLabel")
        self._summary.setWordWrap(True)
        self._layout.addWidget(self._summary)

        self._matched = self._result_group("Términos ya presentes")
        self._missing = self._result_group("Términos por incorporar")
        self._layout.addStretch()

    def _result_group(self, title: str) -> QLabel:
        group = QGroupBox(title)
        layout = QVBoxLayout(group)
        label = QLabel("—")
        label.setWordWrap(True)
        label.setObjectName("HintLabel")
        layout.addWidget(label)
        self._layout.addWidget(group)
        return label

    def load(self, cv: CVData) -> None:
        analysis = analyze_cv_match(cv)
        keywords = analysis["keywords"]
        if not keywords:
            self._summary.setText("Primero pega una descripción en la sección Vacante ATS.")
            self._matched.setText("—")
            self._missing.setText("—")
            return
        self._summary.setText(
            f"Se revisaron {len(keywords)} términos de la vacante. Agrega solo los que representen experiencia real."
        )
        self._matched.setText(" · ".join(analysis["matched"]) or "Aún no hay coincidencias detectadas.")
        self._missing.setText(" · ".join(analysis["missing"]) or "No hay términos pendientes en el conjunto analizado.")

    def save(self, cv: CVData) -> None:
        """El panel es solo de lectura; no modifica CVData."""
