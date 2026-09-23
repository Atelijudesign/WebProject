"""
CV Builder Pro — Education Panel
"""
from PyQt6.QtCore import pyqtSignal
from PyQt6.QtWidgets import QFormLayout, QLineEdit, QScrollArea, QVBoxLayout, QWidget
from core.models import CVData, EducationEntry
from ui.panels.base_panel import BasePanel
from ui.panels.list_crud_panel import ListCrudPanel


class _EducationForm(QWidget):
    data_changed = pyqtSignal()

    def __init__(self, parent=None):
        super().__init__(parent)
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(scroll.Shape.NoFrame)
        w = QWidget()
        form = QFormLayout(w)
        form.setSpacing(8)
        self._deg   = self._f(form, "Título / Grado *")
        self._field = self._f(form, "Área / Especialidad")
        self._inst  = self._f(form, "Institución *")
        self._start = self._f(form, "Año inicio")
        self._end   = self._f(form, "Año egreso")
        self._gpa   = self._f(form, "Promedio / GPA")
        self._desc  = self._f(form, "Descripción adicional")
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

    def load_entry(self, e: EducationEntry):
        self._deg.setText(e.degree)
        self._field.setText(e.field_of_study)
        self._inst.setText(e.institution)
        self._start.setText(e.start_date)
        self._end.setText(e.end_date)
        self._gpa.setText(e.gpa)
        self._desc.setText(e.description)

    def save_entry(self, e: EducationEntry):
        e.degree         = self._deg.text().strip()
        e.field_of_study = self._field.text().strip()
        e.institution    = self._inst.text().strip()
        e.start_date     = self._start.text().strip()
        e.end_date       = self._end.text().strip()
        e.gpa            = self._gpa.text().strip()
        e.description    = self._desc.text().strip()


class EducationPanel(BasePanel):
    def __init__(self, parent=None):
        super().__init__("Educación", parent)
        self._crud = ListCrudPanel(
            label_fn=lambda e: f"{e.degree or 'Nuevo'} — {e.institution or '—'}",
            factory_fn=EducationEntry,
            form_widget_class=_EducationForm,
        )
        self._crud.data_changed.connect(self.data_changed)
        self._layout.addWidget(self._crud)

    def load(self, cv: CVData):
        self._crud.load_items(cv.education)

    def save(self, cv: CVData):
        cv.education = self._crud.get_items()
