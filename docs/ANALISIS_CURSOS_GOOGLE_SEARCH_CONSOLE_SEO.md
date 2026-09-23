# 📚 Análisis Integral de Cursos: Google Search Console & SEO Técnico

> **Fuente de Aprendizaje**: Auditoría profunda de los cursos de **SEO Warriors (Dean Romero 2025)**, **BIGSEO Academy (Romuald Fons)** y **Platzi (Growth Marketing)** en `G:\Mi unidad\Atelijudesign\03_ESTUDIOS_Y_FORMACION\02_Cursos_y_Diplomados\`.

---

## 🎯 1. Resumen Ejecutivo de Cursos Analizados

| Curso / Módulo | Instructor / Academia | Enfoque Principal | Conceptos Clave Extraídos |
| :--- | :--- | :--- | :--- |
| **9 Curso de Search Console** | Dean Romero (*SEO Warriors*) | Auditoría de GSC paso a paso | Inspección de URLs, Informe de Rendimiento, Discover, Cobertura, Enlaces y Mejoras. |
| **Módulos 30 & 31: GSC Básico y Avanzado** | Romuald Fons (*BIGSEO*) | Extracción de datos masivos y optimización | GSC + Google Sheets, Regex de intención de búsqueda, canibalización SEO y diferencias de agregación. |
| **Curso Fundamentos de GSC** | Platzi (*Escuela de Marketing*) | Métricas Web Principales | Core Web Vitals (LCP, FID/INP, CLS), Google Tag Manager, sitemaps jerárquicos. |
| **SEO para Desarrolladores Web** | Plataforma Digital | Código e Indexación | SSR vs SPA, meta robots, Open Graph, datos estructurados Schema.org JSON-LD. |

---

## 🧠 2. Desglose Técnico de Aprendizajes y Mejores Prácticas

### 2.1. Inspección de URLs y Validación en Vivo (Live Test)
1. **Diferencia entre HTML Original y Renderizado**:
   - Googlebot ejecuta dos olas de indexación. La segunda ola pasa por el motor Chromium (WRS - Web Rendering Service) para procesar JavaScript (React / Vite).
   - Siempre se debe verificar en **"Probar URL en vivo"** que el contenido principal, enlaces (`<a href>`) y esquemas no dependan de eventos `onClick` o retrasos excesivos de render.
2. **Canonical Declarado vs Canónico de Google**:
   - Si Google selecciona un canonical distinto al que configuramos con `<SEOHead />`, indica que el contenido es demasiado similar a otra página o que hay enlaces internos confusos.

---

### 2.2. Triaje de Errores de Indexación (Informe de Páginas)
* **"Rastreada: actualmente sin indexar"**:
  - *Causa*: El robot leyó el contenido pero determinó que no aporta suficiente valor añadido (*Thin Content*).
  - *Solución*: Agregar tablas técnicas comparativas, calculadoras interactivas, schemas enriquecidos y enlaces desde artículos con buen tráfico.
* **"Descubierta: actualmente sin indexar"**:
  - *Causa*: Problema de *Crawl Budget* (presupuesto de rastreo). Google sabe que la URL existe pero sus servidores no la priorizan.
  - *Solución*: Mejorar el Time to First Byte (TTFB), comprimir assets, subir sitemap limpio y enlazar directamente desde la navegación principal.
* **"Excluida por etiqueta noindex"**:
  - *Causa*: Presencia de `<meta name="robots" content="noindex" />` o directiva `X-Robots-Tag`.
  - *Solución*: Revisar que solo las páginas privadas (login, administración) tengan `noindex`.

---

### 2.3. Matriz de Crecimiento de Clics (Rendimiento GSC)
* **Términos en Posiciones 4 a 15 (*Low Hanging Fruits*)**:
  - Son palabras clave que Google ya considera relevantes para tu web pero aún no están en el Top 3.
  - **Técnica de Optimización**:
    1. Descargar las consultas de GSC.
    2. Identificar términos con > 200 impresiones y posición entre 4 y 15.
    3. Incluir esas frases exactas dentro de subtítulos `<h2>` o párrafos explicativos de la página correspondiente.
* **Ajuste de CTR mediante Copywriting**:
  - Si una página tiene miles de impresiones pero CTR < 2%, el título no llama la atención en la SERP.
  - Añadir corchetes `[Guía 2026]`, números `2,100+ Perfiles`, o valor directo `Fórmula + Descarga DXF`.

---

### 2.4. Resolución de Canibalizaciones SEO
* Cuando dos páginas de tu web compiten por la misma palabra clave:
  1. Identificar en GSC la consulta y ver en la pestaña "Páginas" cuáles URLs se reparten los clics.
  2. Determinar la página con mejor conversión técnica.
  3. Redirigir (301) o cambiar los enlaces internos para que solo una reciba la autoridad de la keyword.

---

### 2.5. Expresiones Regulares (Regex) Maestras para GSC
```regex
# 1. Consultas informacionales (Preguntas frecuentes)
^(qué|cómo|cuánto|dónde|cuándo|por qué|cuál|cuáles|fórmula|cálculo) .*

# 2. Consultas de alta intención técnica y transaccional
(descargar|dxf|pdf|norma|catalogo|ficha técnica|acero|calculadora)

# 3. Consultas de marca / portafolio
.*(atelijudesign|andres gallo|agp).*
```

---

## 🛠️ 3. Agente y Skill Implementados en el Ecosistema

1. **Skill**: [`google-search-console-master`](file:///c:/Users/andre/Documents/Proyectos26/skills/google-search-console-master/SKILL.md)
   - Contiene todos los procedimientos operativos estándar (SOPs), matrices de decisión, tablas de diagnóstico y expresiones regulares listas para ejecutar.
2. **Agente**: [`GoogleSearchConsole-Agent`](file:///c:/Users/andre/Documents/Proyectos26/.agents/agents/GoogleSearchConsole-Agent.md)
   - Registrado en el workspace para auditorías periódicas, triaje de indexación y optimizaciones de CTR en `WebProject`, `IchaCatalogApp` y `GoogleDork`.
