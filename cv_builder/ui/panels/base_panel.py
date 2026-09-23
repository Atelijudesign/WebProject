"""
CV Builder Pro — Base Panel
Clase base para todos los paneles de edición.
"""
from __future__ import annotations
from PyQt6.QtCore import pyqtSignal
from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel, QFrame


class BasePanel(QWidget):
    """Panel base. Emite data_changed cuando el usuario modifica algún campo."""

    data_changed = pyqtSignal()

    def __init__(self, title: str, parent=None) -> None:
        super().__init__(parent)
        self._title = title
        self._layout = QVBoxLayout(self)
        self._layout.setContentsMargins(0, 0, 0, 0)
        self._layout.setSpacing(12)

    # Subclases deben implementar:
    def load(self, cv) -> None:
        """Carga datos del CVData al panel."""
        raise NotImplementedError

    def save(self, cv) -> None:
        """Guarda los valores del panel de vuelta al CVData."""
        raise NotImplementedError

    # Helper para construir campos
    def _make_label(self, text: str) -> QLabel:
        lbl = QLabel(text)
        lbl.setObjectName("FieldLabel")
        return lbl

    def _separator(self) -> QFrame:
        line = QFrame()
        line.setFrameShape(QFrame.Shape.HLine)
        line.setObjectName("Separator")
        return line
