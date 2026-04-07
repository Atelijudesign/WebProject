<p align="center">
  <img src="https://img.shields.io/badge/STATUS-LIVE-00c853?style=for-the-badge&labelColor=0b1220" />
  <img src="https://img.shields.io/badge/STACK-HTML%20%7C%20CSS%20%7C%20JS-3b82f6?style=for-the-badge&labelColor=0b1220" />
  <img src="https://img.shields.io/badge/TAILWIND-v3.x-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0b1220" />
  <img src="https://img.shields.io/badge/LICENSE-MIT-a855f7?style=for-the-badge&labelColor=0b1220" />
</p>

<h1 align="center">
  <br>
  🏗️ Andrés Gallo P. — Portfolio BIM
  <br>
  <sub><sup>Proyectista Estructural · Desarrollador BIM · Automatización</sup></sub>
</h1>

<p align="center">
  <strong>Portfolio profesional y suite de herramientas para ingeniería estructural.</strong><br>
  Diseño moderno con dark theme, glassmorphism y herramientas interactivas de cálculo en tiempo real.
</p>

---

## ⚡ Vista Rápida

| Módulo                         | Descripción                                                                |
| ------------------------------ | -------------------------------------------------------------------------- |
| 🏠 **Portfolio**               | Proyectos destacados con galería interactiva y filtros por tecnología      |
| 🛤️ **Roadmap BIM**             | Ruta de aprendizaje: De Proyectista Estructural a Desarrollador BIM        |
| 🔧 **Calculadora de Perfiles** | 12 tipos de perfiles de acero con cálculo en tiempo real + SVG interactivo |

---

## 🏛️ Estructura del Proyecto

```
WebProject/
├── index.html                          # Landing principal del portfolio
├── tailwind.config.js                  # Configuración de Tailwind CSS
│
├── css/
│   └── styles.css                      # Estilos personalizados + glassmorphism
│
├── js/
│   ├── scripts.js                      # Lógica del portfolio (filtros, animaciones)
│   └── tailwind-config.js              # Config extendida de Tailwind
│
├── assets/
│   ├── favicon.ico
│   └── img/                            # Imágenes del portfolio
│
├── project/                            # Páginas individuales de cada proyecto
│   ├── aeropuerto-amb.html
│   ├── desaladora-sto-domingo.html
│   ├── hospital-marga-marga.html
│   ├── maquina-papelera.html
│   ├── paso-los-libertadores.html
│   └── proyecto-arqueros.html
│
└── automatizacion/                     # Suite de herramientas
    ├── bim-dev-roadmap.html            # Roadmap interactivo BIM
    └── profile-calculator.html         # Calculadora de perfiles de acero
```

---

## 🔧 Calculadora de Perfiles de Acero

Herramienta de cálculo en tiempo real para **12 tipos de perfiles estructurales**.

### Perfiles Soportados

| Perfil      | Tipo                  | Parámetros                       |
| ----------- | --------------------- | -------------------------------- |
| **H**       | Perfil H              | `h`, `b`, `s`, `t`               |
| **HE**      | H Alas Desiguales     | `h`, `b₁`, `b₂`, `t₁`, `t₂`, `s` |
| **T**       | Perfil T              | `h`, `b`, `t`, `s`               |
| **CA**      | Canal Atiesado        | `h`, `b`, `c`, `t`               |
| **C**       | Canal Simple          | `h`, `b`, `t`                    |
| **CE**      | Canal Alas Desiguales | `h`, `b₁`, `b₂`, `t`             |
| **XL**      | Doble Ángulo          | `h`, `b`, `t`                    |
| **L**       | Ángulo                | `h`, `b`, `t`                    |
| **PL**      | Placa                 | `h`, `b`, `t`                    |
| **PIPE**    | Tubería Circular      | `Ø`, `e`                         |
| **TUBULAR** | Tubo Rectangular      | `h`, `b`, `t`                    |
| **RB**      | Barra Redonda         | `Ø`                              |

### Resultados Calculados

```
📐 Área de Sección ───────── cm²
⚖️ Peso Lineal ────────────── kg/m
📏 Área de Cubrimiento ──── m²/m
🏷️ Designación del Perfil
```

### Funcionalidades

- 🔄 **Cálculo en tiempo real** — Los resultados se actualizan instantáneamente al modificar cualquier dimensión
- 📊 **Diagramas SVG interactivos** — Sección transversal con cotas y parámetros visibles
- ✅ **Validación de entrada** — Solo acepta números positivos, con feedback visual en rojo
- 🎨 **Dark theme** — Diseño glassmorphism integrado con el portfolio

---

## 🎨 Stack Tecnológico

<table>
  <tr>
    <td align="center"><strong>Frontend</strong></td>
    <td>HTML5 · CSS3 · JavaScript ES6+</td>
  </tr>
  <tr>
    <td align="center"><strong>Styling</strong></td>
    <td>Tailwind CSS v3 · Custom Glassmorphism · CSS Animations</td>
  </tr>
  <tr>
    <td align="center"><strong>Iconos</strong></td>
    <td>Font Awesome 6.4</td>
  </tr>
  <tr>
    <td align="center"><strong>Tipografía</strong></td>
    <td>Inter (Google Fonts)</td>
  </tr>
  <tr>
    <td align="center"><strong>Gráficos</strong></td>
    <td>SVG dinámico generado por JS</td>
  </tr>
  <tr>
    <td align="center"><strong>Hosting</strong></td>
    <td>Static — compatible con GitHub Pages, Netlify, Vercel</td>
  </tr>
</table>

---

## 🚀 Instalación

No requiere build ni dependencias. Es un sitio estático puro.

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/webproject.git

# Abrir directamente en el navegador
open index.html

# O servir con cualquier servidor local
npx serve .
```

## ✅ QA Rápido (Fase P2)

Para validar consistencia visual/textual antes de publicar:

```bash
python _p2_quality_check.py
```

Este chequeo valida:

- Patrones de texto roto (mojibake) en todos los `.html`
- Navegación base uniforme en todas las entradas de `blog/`
- Tokens de nav e icono principal (`fa-layer-group`) presentes en el blog
- Enlaces internos y anchors básicos que resuelven correctamente

## ⚠️ Scripts de limpieza global

Los scripts `_deep_text_clean.py` y `_final_global_clean.py` realizan reemplazos masivos por bytes.
Usarlos solo con respaldo previo y revisión posterior, para evitar cambios no deseados en contenido válido.

## 🚢 Release Checklist (Pre-Deploy)

Antes de publicar en producción:

1. Ejecutar QA automático:

   ```bash
   python _p2_quality_check.py
   ```

2. Verificar en navegador (desktop + móvil) que en `blog/`, `tool/` y `project/` se mantenga:
   - Logo con icono `fa-layer-group`
   - Menú hamburguesa funcional
   - Enlaces principales del nav (`Inicio`, `Blog`, `Herramientas`, `Contacto`)

3. Confirmar rutas de nuevas páginas/herramientas:
   - Entradas nuevas listadas en `blog/blog.html`
   - Herramientas nuevas listadas en `tool/index.html`
   - Links cruzados funcionando (`blog` ↔ `tool` ↔ `project`)

4. Hacer revisión rápida de texto:
   - Sin símbolos extraños de codificación (mojibake)
   - Sin cambios involuntarios en iconos o labels del menú
   - Sin enlaces internos rotos ni anchors faltantes

5. Validación final visual en el dominio de staging/hosting antes de marcar release.

---

## 🎯 Design System

| Token        | Valor                               | Uso                      |
| ------------ | ----------------------------------- | ------------------------ |
| `bim-blue`   | `#3b82f6`                           | Color principal, acentos |
| `bim-dark`   | `#0b1220`                           | Fondo principal          |
| `bim-card`   | `#111827`                           | Fondo de cards           |
| `bim-border` | `#1f2937`                           | Bordes sutiles           |
| `glass-card` | `rgba(17,24,39,0.7)` + `blur(12px)` | Efecto glassmorphism     |

---

## 📄 Licencia

© 2025 **Andrés Gallo P.** — Todos los derechos reservados.

<p align="center">
  <sub>Hecho con ☕ y acero estructural</sub>
</p>
