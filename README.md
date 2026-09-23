# Portfolio BIM y herramientas de ingeniería

Aplicación web profesional de Andrés Gallo P.: portafolio BIM estructural, contenidos técnicos y herramientas interactivas. Está construida como una SPA con React y Vite; no es un sitio HTML estático.

## Stack

- React 19, React Router y Vite 5
- Tailwind CSS + estilos propios en `src/styles/`
- Three.js / React Three Fiber para el visor 3D
- Vitest para pruebas unitarias
- PWA mediante `vite-plugin-pwa`

## Ejecutar localmente

```bash
npm install
npm run dev
```

La aplicación se sirve por Vite. La configuración de desarrollo también inicia el servicio local definido en `server.js` cuando corresponde.

## Verificación

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

`npm run build` genera la salida de producción en `dist/`.

## Estructura relevante

```text
src/
├── App.jsx                 # Rutas de la SPA con carga diferida
├── components/             # Navegación, portada, secciones y visor 3D
├── pages/                  # Portafolio, herramientas, CV ATS y blog
├── data/                   # Datos locales e internacionalización
├── styles/                 # Variables, estilos globales y estilos de administración
└── utils/                  # Utilidades compartidas

public/
├── assets/                 # Recursos estáticos
├── models/                 # Modelos 3D utilizados por la portada
└── wasm/                   # Recursos de interoperabilidad IFC
```

## Convenciones

- Toda ruta nueva se registra en `src/App.jsx` y se carga de forma diferida cuando no pertenece al inicio.
- Los estilos de navegación deben estar acotados a `.navbar`; no se usan selectores globales para `nav`.
- Las funciones de ingeniería son de apoyo educativo o de consulta. Antes de modificar fórmulas, propiedades, normas o criterios técnicos, consulta la fuente oficial del Obsidian Vault definida por el workspace.
- Mantén la experiencia comprobada en 390, 768, 1024 y 1440 px, incluido teclado y navegación móvil.

## Funcionalidades destacadas

- Portafolio BIM y de ingeniería estructural.
- Catálogos y calculadoras (ICHA, AISC, escaleras, perfiles y acortamientos).
- Visor/exportador IFC y modelo 3D en portada.
- Constructor de CV ATS con exportación PDF y LaTeX, sin fotografías personales.
- Blog técnico y panel administrativo de uso interno.
