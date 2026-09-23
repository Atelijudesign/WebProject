"""
CV Builder Pro — Skills Panel
"""
from PyQt6.QtCore import pyqtSignal
from PyQt6.QtWidgets import (
    QComboBox, QFormLayout, QLabel, QLineEdit, QScrollArea,
    QSlider, QVBoxLayout, QWidget,
)
from PyQt6.QtCore import Qt
from core.models import CVData, SkillEntry
from ui.panels.base_panel import BasePanel
from ui.panels.list_crud_panel import ListCrudPanel

_LEVELS = {1: "Básico", 2: "Elemental", 3: "Intermedio", 4: "Avanzado", 5: "Experto"}


class _SkillForm(QWidget):
    data_changed = pyqtSignal()

    def __init__(self, parent=None):
        super().__init__(parent)
        form = QFormLayout(self)
        form.setSpacing(10)
        self._name = QLineEdit()
        self._name.setObjectName("Field")
        self._name.textChanged.connect(self.data_changed)
        form.addRow("Habilidad *", self._name)

        self._cat = QLineEdit()
        self._cat.setObjectName("Field")
        self._cat.setPlaceholderText("BIM / Programación / Software…")
        self._cat.textChanged.connect(self.data_changed)
        form.addRow("Categoría", self._cat)

        self._slider = QSlider(Qt.Orientation.Horizontal)
        self._slider.setRange(1, 5)
        self._slider.setValue(3)
        self._slider.setTickPosition(QSlider.TickPosition.TicksBelow)
        self._slider.setTickInterval(1)
        self._slider.valueChanged.connect(self._on_level)
        form.addRow("Nivel", self._slider)

        self._level_lbl = QLabel(_LEVELS[3])
        self._level_lbl.setObjectName("HintLabel")
        form.addRow("", self._level_lbl)

    def _on_level(self, val: int):
        self._level_lbl.setText(_LEVELS.get(val, ""))
        self.data_changed.emit()

    def load_entry(self, e: SkillEntry):
        self._name.setText(e.name)
        self._cat.setText(e.category)
        self._slider.setValue(max(1, min(5, e.level)))

    def save_entry(self, e: SkillEntry):
        e.name     = self._name.text().strip()
        e.category = self._cat.text().strip()
        e.level    = self._slider.value()


class SkillsPanel(BasePanel):
    def __init__(self, parent=None):
        super().__init__("Habilidades", parent)
        self._crud = ListCrudPanel(
            label_fn=lambda e: f"{e.name or 'Nueva'} ({_LEVELS.get(e.level, '')})",
            factory_fn=SkillEntry,
            form_widget_class=_SkillForm,
        )
        self._crud.data_changed.connect(self.data_changed)
        self._layout.addWidget(self._crud)

    def load(self, cv: CVData):
        self._crud.load_items(cv.skills)

    def save(self, cv: CVData):
        cv.skills = self._crud.get_items()
