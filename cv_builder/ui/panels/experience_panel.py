"""
CV Builder Pro — Experience Panel
"""
from PyQt6.QtCore import pyqtSignal
from PyQt6.QtWidgets import (
    QCheckBox, QFormLayout, QLabel, QLineEdit, QPlainTextEdit,
    QScrollArea, QVBoxLayout, QWidget,
)
from core.models import CVData, ExperienceEntry
from ui.panels.base_panel import BasePanel
from ui.panels.list_crud_panel import ListCrudPanel


class _ExperienceForm(QWidget):
    data_changed = pyqtSignal()

    def __init__(self, parent=None):
        super().__init__(parent)
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(scroll.Shape.NoFrame)
        w = QWidget()
        form = QFormLayout(w)
        form.setSpacing(8)
        self._pos    = self._f(form, "Cargo / Posición *")
        self._co     = self._f(form, "Empresa / Organización *")
        self._loc    = self._f(form, "Ubicación")
        self._start  = self._f(form, "Fecha inicio (ej: Ene 2022)")
        self._end    = self._f(form, "Fecha fin")
        self._curr   = QCheckBox("Trabajo actual (Presente)")
        self._curr.stateChanged.connect(self._on_curr)
        form.addRow("", self._curr)
        self._desc = QPlainTextEdit()
        self._desc.setObjectName("Field")
        self._desc.setPlaceholderText("• Un logro por línea\n• Usa verbos de acción\n• Cuantifica resultados")
        self._desc.setMinimumHeight(120)
        self._desc.textChanged.connect(self.data_changed)
        form.addRow("Descripción", self._desc)
        scroll.setWidget(w)
        vl = QVBoxLayout(self)
        vl.setContentsMargins(8, 0, 0, 0)
        vl.addWidget(scroll)

    def _f(self, form, label):
        le = QLineEdit()
        le.setObjectName("Field")
        le.textChanged.connect(self.data_changed)
        form.addRow(label, le)
        return le

    def _on_curr(self):
        self._end.setEnabled(not self._curr.isChecked())
        self.data_changed.emit()

    def load_entry(self, e: ExperienceEntry):
        self._pos.setText(e.position)
        self._co.setText(e.company)
        self._loc.setText(e.location)
        self._start.setText(e.start_date)
        self._end.setText(e.end_date)
        self._curr.setChecked(e.is_current)
        self._desc.setPlainText(e.description)

    def save_entry(self, e: ExperienceEntry):
        e.position   = self._pos.text().strip()
        e.company    = self._co.text().strip()
        e.location   = self._loc.text().strip()
        e.start_date = self._start.text().strip()
        e.end_date   = self._end.text().strip()
        e.is_current = self._curr.isChecked()
        e.description = self._desc.toPlainText().strip()


class ExperiencePanel(BasePanel):
    def __init__(self, parent=None):
        super().__init__("Experiencia", parent)
        self._crud = ListCrudPanel(
            label_fn=lambda e: f"{e.position or 'Nueva entrada'} @ {e.company or '—'}",
            factory_fn=ExperienceEntry,
            form_widget_class=_ExperienceForm,
        )
        self._crud.data_changed.connect(self.data_changed)
        self._layout.addWidget(self._crud)

    def load(self, cv: CVData):
        self._crud.load_items(cv.experience)

    def save(self, cv: CVData):
        cv.experience = self._crud.get_items()
