# CV Builder Pro

Aplicación desktop (PyQt6 + WebEngine) para crear CVs profesionales y exportarlos a PDF, con **5 templates** y persistencia JSON.

> Parte del proyecto [WebProject](../) (portfolio del Proyectista Estructural BIM). La idea es integrar este builder como herramienta interna de la web más adelante.

---

## ✨ Características

- **9 secciones editables**: Personal, Resumen, Experiencia, Educación, Habilidades, Idiomas, Certificaciones, Proyectos, Publicaciones.
- **5 templates** con diseño profesional:
  - **Executive** — header oscuro y sidebar profesional.
  - **Minimal** — una columna, limpio, tipografía aireada.
  - **Technical** — sidebar coloreado, ideal para perfiles técnicos.
  - **ATS** — plain, 1 columna, sin imágenes ni fuentes web. Pensado para que los parsers de LinkedIn / Indeed / Greenhouse lo lean sin errores.
  - **LaTeX** — código fuente `.tex` listo para compilar con `pdflatex`. Diseño académico, character-escape de `& % $ # _ { } ~ ^ \`.
- **Live preview** vía QWebEngineView (Chromium embebido).
- **Sin fotografías personales**: no se solicitan, guardan ni renderizan imágenes de perfil en ningún template.
- **Export PDF** A4 sin dependencias externas (sin WeasyPrint, sin GTK).
- **Color de acento personalizable** (color picker en toolbar).
- **Validación silenciosa al exportar PDF** (bloquea el export si hay errores en nombre/email).
- **Autosave** cada 30 s en `~/.cvbuilder/autosave.cvb` con recuperación al iniciar.
- **Logging** estructurado en `~/.cvbuilder/cvbuilder.log`.
- **CRUD genérico** (`ListCrudPanel`) reusado por 4 paneles.
- **Persistencia** JSON con extensión `.cvb` (formato defensivo, ignora claves desconocidas).
- **Suite de tests** con `pytest` (45 tests, sin GUI).

---

## 🚀 Uso rápido

```bash
# 1. Instalar dependencias
cd proyectos/WebProject/cv_builder
pip install -r requirements.txt

# 2. Lanzar
python main.py
# o, equivalentemente:
python -m cv_builder.main
```

En la primera ejecución se creará la carpeta `~/.cvbuilder/` con `cvbuilder.log` y, eventualmente, `autosave.cvb`.

---

## 🏗️ Arquitectura

```
cv_builder/
├── main.py                   Entry point (delega en run_app)
├── requirements.txt
│
├── core/                     Lógica pura (sin PyQt6)
│   ├── models.py            9 dataclasses + CVData agregador
│   ├── storage.py           save/load JSON (.cvb)
│   ├── exporter.py          render HTML/LaTeX + printToPdf
│   ├── validation.py        validador con severity (error/warn/info)
│   ├── paths.py             rutas multiplataforma (appdirs + fallback)
│   └── logger.py            logging raíz con rotación a archivo
│
├── ui/                       PyQt6 (paneles, ventana, preview)
│   ├── main_window.py       QMainWindow 3-panel + toolbar + statusbar
│   ├── preview_panel.py     QWebEngineView (preview + PDF)
│   └── panels/
│       ├── base_panel.py    Contrato load()/save() + signal data_changed
│       ├── list_crud_panel.py  Widget CRUD genérico (↑↓＋✕)
│       ├── personal_panel.py
│       ├── summary_panel.py
│       ├── experience_panel.py
│       ├── education_panel.py
│       ├── skills_panel.py
│       └── list_panels.py   Idiomas, Certs, Proyectos, Publicaciones
│
├── templates/                Jinja2
│   ├── template_executive.html
│   ├── template_minimal.html
│   ├── template_technical.html
│   ├── template_ats.html
│   └── template_latex.tex
│
└── tests/                    pytest (sin PyQt6)
    ├── conftest.py
    ├── test_models.py
    ├── test_storage.py
    ├── test_validation.py
    ├── test_paths.py
    └── test_exporter.py
```

### Patrones de diseño aplicados

| Patrón | Dónde | Por qué |
|---|---|---|
| **MVC-like** | `core/` (Model) ↔ `ui/` (View) | UI no conoce Jinja ni PDF; `core/` no depende de PyQt6. |
| **Strategy** | `templates/template_*.html` | Mismo modelo, 4 visualizaciones. |
| **Template Method** | `BasePanel.load()/save()` | Contrato común para 9 paneles. |
| **Composite + Generic** | `ListCrudPanel[T]` | CRUD reusado por 4 secciones. |
| **Singleton (lazy)** | `_jinja_env`, `_initialized` en logger | Recursos costosos se crean una vez. |
| **Observer** | `data_changed = pyqtSignal()` | Debounce del preview + validación. |
| **Defensive serialization** | `storage._deserialize_list()` | JSON con campos extra no rompe la carga. |

---

## 🧪 Tests

```bash
cd proyectos/WebProject/cv_builder
pytest tests/ -v
```

Los tests cubren **storage, validation, models, paths, exporter** y **no requieren PyQt6** (se pueden ejecutar en CI headless).

---

## 🎯 Formatos ATS y LaTeX

### ATS (Applicant Tracking System)

Los portales como LinkedIn, Indeed, Greenhouse, Workday y Bumeran usan parsers automáticos que leen el PDF / DOCX y extraen:
- Datos de contacto
- Historial laboral
- Educación
- Skills

Esos parsers **se confunden** con:
- Columnas múltiples
- Tablas para layout
- Imágenes / íconos / fotos
- Web fonts (que el parser no embebe)
- Headers / footers con texto
- Caracteres Unicode raros en bullets (•, ▪, ◆)

El template `ats` (botón "ATS" en el combo) está diseñado para que el parser extraiga todo sin perder un campo:
- 1 sola columna
- Solo Arial / Helvetica (la única fuente que todos los parsers conocen)
- Bullets con `-` (no glifos)
- Sin fotos, sin íconos, sin tablas
- Secciones con nombres estándar: `Resumen profesional`, `Experiencia profesional`, `Educación`, `Habilidades técnicas`, `Idiomas`, `Certificaciones`, `Proyectos`, `Publicaciones`
- Sin fotos personales, incluso al abrir archivos `.cvb` heredados que las contengan.

### LaTeX

El template `latex` (botón "LaTeX" en el combo + botón "📜 Exportar LaTeX" en la toolbar) genera el código fuente `.tex`:

```latex
\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
...
\begin{document}
...
\end{document}
```

**Para usarlo:**
1. En el builder, selecciona el template "LaTeX" en el combo. El preview muestra el código fuente en un `<pre>` con highlighting.
2. Click en "📜 Exportar LaTeX" → guarda `tu_cv.tex`.
3. Compílalo en tu máquina:
   ```bash
   pdflatex tu_cv.tex          # genera tu_cv.pdf
   # o usa Overleaf: pégalo en un nuevo proyecto y compila.
   ```

**Caracteres que se escapan automáticamente:** `& % $ # _ { } ~ ^ \` (los 10 caracteres especiales de LaTeX).

**Paquetes usados:** `inputenc`, `fontenc`, `babel (spanish)`, `geometry`, `enumitem`, `hyperref`, `parskip`, `microtype`, `textcomp`. Todos vienen en `texlive-latex-recommended` (≈ 200 MB).

---

## 📁 Datos del usuario

| Archivo | Ubicación | Propósito |
|---|---|---|
| `autosave.cvb` | `~/.cvbuilder/` (o `appdirs.user_data_dir`) | Autosave cada 30 s |
| `cvbuilder.log` | misma carpeta | Log rotado (1 MB × 3) |
| `recent.json` | misma carpeta | (futuro) archivos recientes |
| `<proyecto>.cvb` | donde el usuario elija | Archivos guardados manualmente |

En Windows, `appdirs` resuelve a `%APPDATA%/AndresGalloParra/CVBuilderPro/`.

---

## 🛠️ Añadir un nuevo template

1. Crear `templates/template_mine.html` (es un Jinja2 estándar, todas las vars del CVData están disponibles).
2. Registrar en `core/exporter.py:_TEMPLATE_FILES`:
   ```python
   "mine": "template_mine.html",
   ```
3. Añadir la entrada legible en `ui/main_window.py:_TEMPLATES`:
   ```python
   ("Mine (descripción corta)", "mine"),
   ```

Listo, ya aparece en el combo del toolbar.

## 🛠️ Añadir una nueva sección al CV

1. Crear el dataclass en `core/models.py` (siguiendo el patrón de los otros `*Entry`).
2. Añadir el campo a `CVData`.
3. Crear el panel en `ui/panels/` extendiendo `BasePanel` (o reusando `ListCrudPanel` para listas).
4. Registrar la sección en `ui/main_window.py:_SECTIONS`.
5. Renderizar la sección en cada template HTML que deba incluirla.

---

## 🐛 Troubleshooting

**`QtWebEngineWidgets` no se importa**  
→ En sistemas muy minimalistas, asegúrate de tener instaladas las dependencias de Chromium del SO. En Windows no debería ser problema con el wheel de PyQt6-WebEngine.

**El PDF sale en blanco**  
→ Comprueba la `status bar`: si dice "⛔ N errores", hay campos obligatorios sin completar. El botón "Exportar PDF" se aborta automáticamente en ese caso.

**El autosave no se recupera al iniciar**  
→ Solo se ofrece la recuperación si el CV tiene al menos el nombre o el resumen lleno. Si abres el archivo `.cvb` manualmente desde `~/.cvbuilder/`, lo lee directamente.

---

## 📜 Licencia

MIT. Andrés Gallo P. · 2026.
