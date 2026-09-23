"""
CV Builder Pro — List Panel Helper
Widget genérico de CRUD para paneles con listas de entradas (Experience, Education, etc.)
"""
from __future__ import annotations
from typing import Callable, Generic, List, TypeVar

from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtWidgets import (
    QFrame, QHBoxLayout, QLabel, QListWidget, QListWidgetItem,
    QPushButton, QSizePolicy, QSplitter, QVBoxLayout, QWidget,
)

T = TypeVar("T")


class ListCrudPanel(QWidget, Generic[T]):
    """
    Panel de CRUD genérico:
    - Lista lateral con entradas
    - Formulario de detalle a la derecha
    - Botones Añadir / Eliminar / Subir / Bajar
    """

    data_changed = pyqtSignal()

    def __init__(
        self,
        label_fn: Callable[[T], str],      # Función que devuelve el texto del item en la lista
        factory_fn: Callable[[], T],        # Crea un nuevo item vacío
        form_widget_class,                  # Clase QWidget del formulario de detalle
        parent=None,
    ) -> None:
        super().__init__(parent)
        self._items: List[T] = []
        self._label_fn = label_fn
        self._factory_fn = factory_fn
        self._current_idx = -1
        self._is_loading = False

        self._build_ui(form_widget_class)

    # ──────────────────────────────────────────────────────────────
    def _build_ui(self, form_widget_class) -> None:
        root = QHBoxLayout(self)
        root.setContentsMargins(0, 0, 0, 0)

        # LEFT: list + buttons
        left = QVBoxLayout()
        left.setSpacing(6)

        self._list = QListWidget()
        self._list.setObjectName("EntryList")
        self._list.setMaximumWidth(200)
        self._list.currentRowChanged.connect(self._on_select)
        left.addWidget(self._list)

        btn_row = QHBoxLayout()
        self._btn_add  = QPushButton("＋")
        self._btn_del  = QPushButton("✕")
        self._btn_up   = QPushButton("↑")
        self._btn_down = QPushButton("↓")
        for btn in (self._btn_add, self._btn_del, self._btn_up, self._btn_down):
            btn.setFixedSize(32, 28)
            btn_row.addWidget(btn)
        btn_row.addStretch()
        left.addLayout(btn_row)

        self._btn_add.clicked.connect(self._add_item)
        self._btn_del.clicked.connect(self._del_item)
        self._btn_up.clicked.connect(self._move_up)
        self._btn_down.clicked.connect(self._move_down)

        root.addLayout(left)

        # Divider
        sep = QFrame()
        sep.setFrameShape(QFrame.Shape.VLine)
        sep.setObjectName("Separator")
        root.addWidget(sep)

        # RIGHT: form
        self._form: QWidget = form_widget_class()
        self._form.setEnabled(False)
        # Conectar señal data_changed del formulario
        if hasattr(self._form, "data_changed"):
            self._form.data_changed.connect(self._on_form_changed)
        root.addWidget(self._form, 1)

    # ──────────────────────────────────────────────────────────────
    def _refresh_list(self) -> None:
        self._list.clear()
        for item in self._items:
            self._list.addItem(self._label_fn(item))

    def _on_select(self, idx: int) -> None:
        if idx < 0 or idx >= len(self._items):
            self._form.setEnabled(False)
            return
        self._current_idx = idx
        self._is_loading = True
        self._form.setEnabled(True)
        self._form.load_entry(self._items[idx])
        self._is_loading = False

    def _on_form_changed(self) -> None:
        if self._is_loading:
            return
        if 0 <= self._current_idx < len(self._items):
            self._form.save_entry(self._items[self._current_idx])
            # Actualizar label en lista
            self._list.item(self._current_idx).setText(
                self._label_fn(self._items[self._current_idx])
            )
        self.data_changed.emit()

    def _add_item(self) -> None:
        new = self._factory_fn()
        self._items.append(new)
        self._refresh_list()
        self._list.setCurrentRow(len(self._items) - 1)
        self.data_changed.emit()

    def _del_item(self) -> None:
        idx = self._list.currentRow()
        if 0 <= idx < len(self._items):
            self._items.pop(idx)
            self._refresh_list()
            new_idx = min(idx, len(self._items) - 1)
            if new_idx >= 0:
                self._list.setCurrentRow(new_idx)
            else:
                self._form.setEnabled(False)
            self.data_changed.emit()

    def _move_up(self) -> None:
        idx = self._list.currentRow()
        if idx > 0:
            self._items[idx], self._items[idx - 1] = self._items[idx - 1], self._items[idx]
            self._refresh_list()
            self._list.setCurrentRow(idx - 1)
            self.data_changed.emit()

    def _move_down(self) -> None:
        idx = self._list.currentRow()
        if idx < len(self._items) - 1:
            self._items[idx], self._items[idx + 1] = self._items[idx + 1], self._items[idx]
            self._refresh_list()
            self._list.setCurrentRow(idx + 1)
            self.data_changed.emit()

    # ──────────────────────────────────────────────────────────────
    def load_items(self, items: list) -> None:
        self._items = list(items)
        self._refresh_list()
        if self._items:
            self._list.setCurrentRow(0)

    def get_items(self) -> list:
        return list(self._items)
