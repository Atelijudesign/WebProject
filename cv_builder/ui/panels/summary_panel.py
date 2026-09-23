"""
CV Builder Pro — Summary Panel
"""
from PyQt6.QtWidgets import QLabel, QPlainTextEdit, QVBoxLayout, QWidget
from core.models import CVData
from ui.panels.base_panel import BasePanel


class SummaryPanel(BasePanel):
    def __init__(self, parent=None) -> None:
        super().__init__("Resumen", parent)
        self._build_ui()

    def _build_ui(self) -> None:
        lbl = QLabel("Resumen / Perfil profesional")
        lbl.setObjectName("FieldLabel")
        self._text = QPlainTextEdit()
        self._text.setObjectName("Field")
        self._text.setPlaceholderText(
            "Describe tu perfil profesional en 3–5 líneas. "
            "Enfócate en tu propuesta de valor, experiencia clave y especialización."
        )
        self._text.setMinimumHeight(160)
        self._text.textChanged.connect(self.data_changed)
        hint = QLabel("💡 Usa lenguaje activo y cuantifica logros cuando sea posible.")
        hint.setObjectName("HintLabel")
        hint.setWordWrap(True)
        self._layout.addWidget(lbl)
        self._layout.addWidget(self._text)
        self._layout.addWidget(hint)
        self._layout.addStretch()

    def load(self, cv: CVData) -> None:
        self._text.setPlainText(cv.summary.text)

    def save(self, cv: CVData) -> None:
        cv.summary.text = self._text.toPlainText().strip()
