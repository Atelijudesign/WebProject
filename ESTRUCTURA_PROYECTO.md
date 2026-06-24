# 🏗️ Estructura del Proyecto Web - Andrés Gallo P.

Este documento contiene el mapa detallado del proyecto, la explicación de las carpetas y archivos, y una guía rápida de cómo funciona y cómo expandir el sitio web (añadir posts, proyectos o herramientas).

---

## 🌳 Árbol del Proyecto

```text
WebProject/
├── package.json               # Configuración de dependencias y scripts de ejecución (npm)
├── vite.config.js             # Configuración del empaquetador Vite (plugins, alias)
├── tailwind.config.js         # Configuración y extensión del diseño de Tailwind CSS
├── postcss.config.js          # Configuración de PostCSS para procesar Tailwind
├── vercel.json                # Configuración de despliegue para Vercel (redirecciones SPA)
├── index.html                 # Punto de entrada HTML principal donde se monta React
│
├── public/                    # Archivos estáticos servidos directamente al navegador
│   ├── assets/                # Favicons e imágenes de base
│   ├── models/                # Modelos 3D (archivos .ifc, etc.)
│   └── wasm/                  # Archivos WebAssembly (ej. web-ifc.wasm para procesar modelos BIM)
│
├── src/                       # Código fuente de la aplicación React
│   ├── main.jsx               # Punto de entrada de JavaScript (monta React en index.html)
│   ├── App.jsx                # Enrutador principal (React Router) y estructura global
│   │
│   ├── components/            # Componentes visuales reutilizables de la web
│   │   ├── Navbar.jsx         # Barra de navegación superior
│   │   ├── Footer.jsx         # Pie de página con copyright y enlaces
│   │   ├── Hero.jsx           # Sección de bienvenida principal con animación 3D
│   │   ├── About.jsx          # Sección "Sobre Mí"
│   │   ├── Experience.jsx     # Línea de tiempo de experiencia laboral
│   │   ├── Portfolio.jsx      # Catálogo interactivo de proyectos en la Home
│   │   ├── Services.jsx       # Servicios ofrecidos
│   │   ├── ToolsPreview.jsx   # Vista previa de herramientas interactivas
│   │   └── canvas/            
│   │       └── BuildingScene.jsx # Escena 3D interactiva (Three.js / React Three Fiber)
│   │
│   ├── pages/                 # Vistas completas de la aplicación (páginas individuales)
│   │   ├── Home.jsx           # Página de inicio que agrupa los componentes de la landing
│   │   ├── ProjectsCatalog.jsx# Catálogo extendido de proyectos estructurales
│   │   ├── ProjectDetail.jsx  # Detalle interactivo de un proyecto seleccionado
│   │   ├── ToolsCatalog.jsx   # Catálogo completo de herramientas de cálculo
│   │   ├── IchaCatalog.jsx    # Buscador interactivo de perfiles ICHA
│   │   ├── ProfileCalculator.jsx # Calculadora de propiedades de perfiles personalizados
│   │   ├── StaircaseCalculator.jsx # Calculadora paramétrica de escaleras metálicas
│   │   ├── BucklingShorteners.jsx # Calculadora de acortamientos e inestabilidades
│   │   ├── AdminDashboard.jsx # Panel de administración para gestión interna
│   │   │
│   │   └── blog/              # Sección de Blog
│   │       ├── BlogCatalog.jsx# Catálogo/Listado con buscador y filtros de posts
│   │       ├── KonstrueduRevit.jsx # Post: Análisis Especialización Konstruedu
│   │       ├── PyRevitVolumen.jsx  # Post: Plugin de cubicaciones (pyRevit)
│   │       ├── HerramientasBimAcero.jsx # Post: Herramientas web para acero
│   │       ├── PyRevitAccelerator.jsx # Post: Guía rápida pyRevit
│   │       ├── BimDevRoadmap.jsx      # Post: Plan de carrera de 12 meses
│   │       ├── RevitStructureFuturo.jsx # Post: Roadmap estructural
│   │       └── RevitSupportClinic.jsx  # Post: Solución a errores de acero
│   │
│   ├── data/                  # Datos estructurados en formato JS o JSON
│   │   ├── blog_data.js       # Listado de posts, categorías y metadatos del blog
│   │   ├── proyectos.json     # Base de datos local de proyectos estructurales
│   │   ├── icha_data.js       # Propiedades mecánicas de perfiles chilenos ICHA
│   │   └── i18n.js            # Sistema local de traducciones (Español / Inglés)
│   │
│   ├── styles/                # Archivos de estilos CSS
│   │   ├── index.css          # Estilos globales, variables de color premium y resets
│   │   └── admin.css          # Estilos del panel de control
│   │
│   ├── tools/                 # Utilidades lógicas de los componentes de herramientas
│   │   └── ToolsApp.jsx
│   │
│   └── utils/                 # Funciones helper y auxiliares
│       └── motion.js          # Configuraciones de animación (Framer Motion)
```

---

## ⚙️ ¿Cómo funciona el proyecto bajo el capó?

1. **El Compilador y Empaquetador (Vite)**: 
   Vite es el motor de desarrollo. Realiza un pre-empaquetamiento ultrarrápido y sirve el proyecto localmente mediante módulos ES nativos, actualizando los cambios en caliente sin recargar toda la página.

2. **Estructura SPA (Single Page Application)**:
   La página es una aplicación de una sola página. El archivo `index.html` sirve de plantilla, `main.jsx` monta la app en el nodo `#root` y **React Router** (`App.jsx`) maneja las URLs virtuales para cargar instantáneamente cada página sin tiempos de carga tradicionales del servidor.

3. **Tailwind CSS + Diseño Integrado**:
   Se utiliza Tailwind CSS para dar formato ágil y responsive. El archivo [index.css](file:///g:/Mi%20unidad/Proyectos26/WebProject/src/styles/index.css) agrupa las variables de CSS personalizadas (sombras, colores de acento, bordes) y clases utilitarias personalizadas como `glass-card` para mantener la consistencia estética.

4. **Motor 3D (React Three Fiber & Three.js)**:
   Permite renderizar vistas 3D interactivas directamente en el navegador utilizando WebGL de forma declarativa dentro del ciclo de vida de React.

---

## 🛠️ Guía Rápida de Mantenimiento

### 1. ¿Cómo agregar un nuevo artículo al Blog?
1. Abre [blog_data.js](file:///g:/Mi%20unidad/Proyectos26/WebProject/src/data/blog_data.js) y añade los metadatos del nuevo post (ID, título, descripción, tags, etc.) en el array `BLOG_POSTS`.
2. Crea tu archivo JSX del artículo dentro de [src/pages/blog/](file:///g:/Mi%20unidad/Proyectos26/WebProject/src/pages/blog/) (puedes tomar como referencia el diseño premium de `PyRevitAccelerator.jsx`).
3. Importa el archivo en [App.jsx](file:///g:/Mi%20unidad/Proyectos26/WebProject/src/App.jsx) y regístralo bajo la ruta deseada:
   ```jsx
   <Route path="/blog/slug-de-tu-articulo" element={<NombreComponente />} />
   ```

### 2. ¿Cómo añadir un proyecto al Portafolio?
1. Ve a [proyectos.json](file:///g:/Mi%20unidad/Proyectos26/WebProject/src/data/proyectos.json).
2. Agrega el bloque de datos correspondiente (título, descripción, ruta de imagen, tecnologías y detalles).
3. Asegúrate de colocar las capturas o renders WebP correspondientes en `public/assets/img/`.

### 3. ¿Cómo ejecutar el proyecto localmente?
* Abre tu consola en la carpeta raíz y ejecuta:
  ```bash
  npm run dev
  ```
  *(O si estás en Windows con políticas restrictivas: `powershell -ExecutionPolicy Bypass -Command "npm run dev"`)*.
* El proyecto estará disponible en tu navegador en `http://localhost:5173`.
