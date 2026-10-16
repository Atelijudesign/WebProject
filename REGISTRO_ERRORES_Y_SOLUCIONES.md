# Registro de Errores, Causa Raíz y Soluciones Técnicas (Post-Mortem)

**Proyecto:** WebProject (Portafolio, Catálogo y Blog Técnico BIM / Estructuras)  
**Entorno:** React 18, Vite 5, Tailwind CSS, TypeScript / JSX  
**Autor & Propietario del Workspace:** Andrés Gallo Parra · **Diseñador Estructural Senior & Especialista en Automatización BIM**  
**Última actualización:** 30 de Septiembre de 2026  

---

## 📌 Regla de Oro de Vocabulario y Rol Profesional (Obligatoria)

> ⚠️ **ESTÁNDAR PERMANENTE DEL WORKSPACE**:
> - El rol, cargo y título técnico de Andrés Gallo Parra es **Diseñador Estructural** / **Diseñador Estructural Senior**.
> - **QUEDA ESTRICTAMENTE PROHIBIDO** el uso de la palabra *"proyectista"* en cualquier contexto (código, documentación, blogs, presentaciones, commits, prompts y respuestas).
> - Toda referencia a la modelación, cálculo de detalle o planimetría debe expresarse como:
>   * *Diseñador Estructural* / *Diseñadores Estructurales*
>   * *Equipo de Diseño Estructural*
>   * *Modelador BIM Estructural*

---

## 🛠️ Incidencia #001: Error de Renderizado en Runtime `ReferenceError: mm is not defined`

### 1. Síntoma / Manifestación
Al acceder a las páginas del blog o a la presentación interactiva (`/presentacion` o `/blog/normas-estructurales-chile-usa`), la aplicación capturaba una excepción mediante `ErrorBoundary.jsx` mostrando la pantalla de error:
```
Ocurrió un error inesperado
No se pudo cargar el recurso o módulo solicitado. Puedes reintentar la carga o volver al inicio.
mm is not defined
```

### 2. Diagnóstico & Causa Raíz (Root Cause Analysis)
En el componente `src/pages/blog/NormasEstructuralesChileUsa.jsx`, se habían insertado expresiones matemáticas de detallamiento de armaduras utilizando sintaxis similar a LaTeX dentro de elementos JSX planos:
```jsx
// CÓDIGO CON ERROR (Línea 1329):
<span>Ganchos sísmicos: 135° con prolongación de $6d_b$ ($\ge 75\text{ mm}$) rematando en el núcleo confinado.</span>

// CÓDIGO CON ERROR (Línea 1359):
<span>Tolerancia de colocación según ACI 117: $\pm 6\text{ mm}$ en losas y $\pm 10\text{ mm}$ en vigas perimetrales.</span>
```

#### ¿Por qué falló en tiempo de ejecución?
1. En JSX, los caracteres de llaves `{ ... }` dentro de los hijos de un nodo no se interpretan como texto literal, sino como **interpolaciones de código JavaScript**.
2. El transpilador de JSX interpretó `\text{ mm}` no como un comando de texto LaTeX, sino como el texto `\text` seguido de una expresión JavaScript `{ mm }`.
3. Al evaluarse `{ mm }` en el navegador, el motor V8 buscó una variable o identificador llamado `mm` en el scope léxico del componente.
4. Al no existir ninguna variable `mm`, el motor lanzó inmediatamente:
   ```javascript
   ReferenceError: mm is not defined
   ```
5. La excepción escaló hasta el `ErrorBoundary`, bloqueando la visualización del contenido.

---

### 3. Solución Aplicada (Fix Definitivo)

Se eliminaron por completo las llaves `{ ... }` y los delimitadores LaTeX de los nodos JSX, sustituyéndolos por texto limpio y símbolos estándar Unicode/HTML:

```jsx
// CÓDIGO CORREGIDO (Línea 1329):
<span>Ganchos sísmicos: 135° con prolongación de 6db (≥ 75 mm) rematando en el núcleo confinado.</span>

// CÓDIGO CORREGIDO (Línea 1359):
<span>Tolerancia de colocación según ACI 117: ±6 mm en losas y ±10 mm en vigas perimetrales.</span>
```

Asimismo, se limpiaron todas las demás fórmulas matemáticas dentro de JSX:
- `$e \ge h/25$` ➔ `e ≥ h/25`
- `$4d_b$` ➔ `4db`
- `$6d_b$` ➔ `6db`
- `$CE \le 0.55\%$` ➔ `CE ≤ 0.55%`
- `\ge 20\text{ cm}` ➔ `≥ 20 cm`

---

## 🚫 Incidencia #002: Uso Inadecuado de Vocabulario ("Proyectista" vs "Diseñador Estructural")

### 1. Síntoma
Se utilizaron términos no alineados con el cargo real del usuario (ej. *"proyectista"*, *"proyectistas"*), cuando el título profesional oficial y exclusivo es **Diseñador Estructural**.

### 2. Acciones de Corrección Ejecutadas
1. **En `NormasEstructuralesChileUsa.jsx`:**
   - Se renombró la propiedad del catálogo de `enfoqueProyectista` a `enfoqueDisenador` en las 35 normas.
   - Se reemplazaron las 58 ocurrencias del término en badges, títulos, subtítulos, pitch de voz y notas generales.
2. **En Páginas Principales y SEO (`Home.jsx`, `SEOHead.jsx`, `BentoHeroPreview.jsx`, `About.jsx`, `InteractiveTerminal.jsx`):**
   - Se actualizaron los metadatos Open Graph, Twitter Cards, títulos y Schema JSON-LD (`jobTitle`, `hasOccupation`).
   - Se cambiaron los encabezados visibles a **Diseñador Estructural BIM** y **Diseñador Estructural Senior**.
3. **En Catálogos y Herramientas (`ToolsCatalog.jsx`, `ToolsApp.jsx`, `ToolsPreview.jsx`, `StaircaseCalculator.jsx`, `IchaCatalog.jsx`, `pdfExportUtils.js`):**
   - Actualización de descripciones, tarjetas, newsletters y encabezados de reportes PDF exportables a *Diseñadores Estructurales*.
4. **En Módulos de Administración y CV ATS (`ProjectsCatalog.jsx`, `AdminDashboard.jsx`, `CvAtsBuilder.jsx`, `cvAts.js`):**
   - Normalización de los presets de roles a *Diseñador Estructural Senior*, *Diseñador de Arquitectura* y *Diseñador Civil*.
5. **En Artículos de Blog (`blog_data.js`, `WhatsNewRevit2027.jsx`, `VibeCodingRevitPython.jsx`, `SmartPlant3DInteractiveMasterLab.jsx`, `RevitStructureFuturo.jsx`, `RevitScanToBimReality3D.jsx`, `Revit2027RebarLongitudinal.jsx`, `Revit2027Rebar3D.jsx`, `PyRevitAccelerator.jsx`, `PlanBimChileEstandar.jsx`, `MiningDigitalTwins.jsx`, `KonstrueduRevit.jsx`, `Iso19650Validation.jsx`, `HerramientasBimAcero.jsx`, `BimDevRoadmap.jsx`, `AiscCatalogPost.jsx`):**
   - Sustitución sistemática en el 100% de los artículos del blog.
6. **En Diccionarios de Idioma (`src/data/i18n.js` y `src/constants/index.js`):**
   - Purgadas todas las claves (`about_title`, `about_bio1`, `tools_desc`, `footer_text`, `tc_desc`, `blog_hero_desc`, `blog_subtitle`, etc.).
7. **En Enrutamiento (`App.jsx`):**
   - Eliminada la ruta legacy con el término obsoleto.
8. **En archivos Markdown y Bóveda Obsidian:**
   - Se renombró el archivo en la bóveda oficial de Obsidian a:
     `Normas_Estructurales_Chile_USA_Presentacion_Disenador_Estructural.md`
   - Se sincronizó el registro técnico de errores a:
     `G:\Mi unidad\Obsidian Vault\01_Profesional\01.4_Ingenieria_BIM_Formacion\REGISTRO_ERRORES_Y_SOLUCIONES.md`
   - Se verificó con `grep_search` que el código fuente de `src/` cuenta con **0 ocurrencias**.

---

## 🛡️ Protocolo de Prevención de Errores para Futuros Desarrollos

Para evitar que estos incidentes se repitan:

1. **Regla JSX 1 - Prohibición de llaves no deseadas:**
   - Nunca escribir `{` o `}` en texto plano dentro de componentes `.jsx` o `.tsx` a menos que sea una expresión intencionada.
   - Si se requiere mostrar llaves literales o caracteres especiales, usar cadenas explícitas `{"{ mm }"}` o entidades HTML (`&#123;`, `&#125;`).
   - Evitar pegar sintaxis cruda de LaTeX (`\text{...}`, `\frac{...}{...}`) en JSX; convertirla siempre a texto plano con caracteres Unicode (`±`, `≥`, `≤`, `²`, `³`, `Ø`).

2. **Regla de Compilación y Validación:**
   - Ejecutar siempre `npm run build` para comprobar que la generación de chunks de Vite / Rollup concluya sin alertas de sintaxis antes de dar una tarea por terminada.
   - Probar directamente la ruta en el navegador o mediante petición HTTP local para confirmar que no se activen los `ErrorBoundary`.

3. **Regla de Persona:**
   - Toda comunicación, documentación técnica, metadatos y código debe identificar al usuario como **Diseñador Estructural Senior**.
