import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Manual Técnico Completo - Administración de Contenido Web</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; margin: 40px; }
      h1 { color: #1e3a8a; border-bottom: 2px solid #bfdbfe; padding-bottom: 10px; font-size: 28px; }
      h2 { color: #2563eb; margin-top: 35px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
      h3 { color: #3b82f6; margin-top: 25px; }
      .code-block { background-color: #f8fafc; padding: 15px; border-radius: 8px; font-family: 'Courier New', Courier, monospace; font-size: 13px; border: 1px solid #cbd5e1; margin-bottom: 20px; white-space: pre-wrap; word-break: break-all; }
      .highlight { color: #0284c7; font-weight: bold; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; }
      .note { background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; border-radius: 4px; }
      .warning { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
      .box { border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); page-break-inside: avoid; }
      ul { padding-left: 20px; }
      li { margin-bottom: 8px; }
    </style>
  </head>
  <body>
    <h1>Manual Técnico Completo - Administración del Portafolio</h1>
    <p>Este documento es la guía definitiva para actualizar completamente tu sitio web sin requerir conocimientos de programación. Aquí aprenderás desde cómo subir nuevas fotos, hasta cómo publicar tu sitio web en Hostinger.</p>
    
    <div class="box">
      <h2>1. Estructura Básica (Dónde está cada cosa)</h2>
      <p>Tu proyecto web está organizado en carpetas clave:</p>
      <ul>
        <li><span class="highlight">public/</span> : Aquí guardas <strong>todas tus imágenes</strong>, PDFs y modelos 3D. Todo lo que pongas aquí es accesible directamente.</li>
        <li><span class="highlight">src/data/</span> : Aquí están los archivos terminados en <code>.json</code> y <code>.js</code> que contienen la información de tus <strong>proyectos</strong> y el <strong>blog</strong>.</li>
        <li><span class="highlight">src/constants/index.js</span> : Este archivo centraliza los textos de la página de inicio (Experiencia, Herramientas, Habilidades).</li>
      </ul>
    </div>

    <div class="box">
      <h2>2. Gestión de Imágenes</h2>
      <p>Para añadir una imagen nueva a la página (por ejemplo, para un proyecto nuevo):</p>
      <ol>
        <li>Copia la imagen a tu computadora. Se recomienda usar formato <strong>.webp</strong> o <strong>.jpg</strong> para que cargue rápido.</li>
        <li>Pega el archivo de imagen dentro de la carpeta <span class="highlight">public/assets/</span> (o public/assets/img/).</li>
        <li>Cuando escribas el código en tu proyecto para referenciar esta imagen, solo debes escribir el nombre del archivo comenzando con una barra diagonal. <br>Por ejemplo: Si tu imagen está en <code>public/foto1.webp</code>, en el código escribes <code>"/foto1.webp"</code>. Si está en <code>public/assets/foto1.webp</code>, escribes <code>"/assets/foto1.webp"</code>.</li>
      </ol>
      <div class="warning"><strong>Regla de Oro:</strong> Los nombres de los archivos de imagen NO deben tener espacios ni caracteres extraños (ñ, tildes). Usa guiones medios, ej: <code>mi-proyecto-1.webp</code>.</div>
    </div>

    <div class="box">
      <h2>3. Añadir o Actualizar Proyectos</h2>
      <p>Los proyectos se manejan desde dos archivos principales dependiendo de su nivel de detalle.</p>
      
      <h3>3.1 El catálogo general de Proyectos</h3>
      <p>Abre el archivo <span class="highlight">src/data/proyectos.json</span>. Verás una lista. Para añadir uno, copia un bloque existente y pégalo al final, modificando los valores:</p>
      <div class="code-block">{
  "id": "nuevo-id-2026",
  "project_id": "P-099",
  "name": "Edificio Los Leones",
  "project_type": "Edificación",
  "status": "Completado",
  "description": "Breve descripción...",
  "image": "/assets/nueva-imagen.webp",
  "client": "Constructora X",
  "technologies": ["Revit", "AutoCAD"]
}</div>
      <p>Recuerda separar cada bloque de proyecto con una <strong>coma</strong> al final del corchete <code>}</code> de cierre (excepto en el último proyecto de la lista).</p>

      <h3>3.2 Detalles extendidos del Proyecto (Con Galería)</h3>
      <p>Si quieres que tu proyecto tenga párrafos largos, detalles técnicos y una galería de imágenes completa al hacerle clic, debes añadirlo en <span class="highlight">src/data/featured_details.json</span> usando el ID exacto que le diste.</p>
      <div class="code-block">"nuevo-id-2026": {
  "slug": "edificio-los-leones",
  "description_paragraphs": [
    "Este es el primer párrafo de detalle.",
    "Este es el segundo párrafo explicativo."
  ],
  "gallery_images": [
    "assets/foto1.webp",
    "assets/foto2.webp"
  ],
  "specs": [
    { "icon": "fa-solid fa-building", "label": "Cliente", "value": "Constructora X" },
    { "icon": "fa-solid fa-calendar-days", "label": "Año", "value": "2026" }
  ]
}</div>
    </div>

    <div class="box">
      <h2>4. Actualizar la Portada, Experiencia y Herramientas</h2>
      <p>La información de la página principal (Inicio) y los catálogos principales se cambia desde <span class="highlight">src/constants/index.js</span>.</p>
      
      <h3>Añadir Habilidades o Tecnologías</h3>
      <p>Busca <code>export const skills = [</code> y añade tu nueva tecnología. Si pones <code>highlight: true</code>, se verá resaltada en azul brillante.</p>

      <h3>Añadir Experiencia Laboral</h3>
      <p>Busca <code>export const experiences = [</code>. Añade un bloque respetando el formato:</p>
      <div class="code-block">{
  company: "Mi Nueva Empresa",
  role: "BIM Manager",
  period: "Feb 2026 — Presente",
  description: "Descripción de mis tareas...",
  icon: "fa-solid fa-building",
  active: true,
}</div>

      <h3>Añadir una nueva Herramienta Destacada</h3>
      <p>Busca <code>export const toolsPreview = [</code> y agrega tu herramienta. Esto la hará aparecer en la sección de automatización/herramientas.</p>
      <div class="code-block">{
  icon: "fa-solid fa-laptop-code",
  title: "Mi Nueva Herramienta",
  description: "Hace el trabajo un 100% más rápido.",
  link: "/herramientas/nueva",
  featured: true,
}</div>
    </div>

    <div class="box">
      <h2>5. Publicar tu web en Hostinger (Paso a Paso)</h2>
      <p>Una vez que hayas modificado todos los textos o imágenes y lo veas perfecto en tu computadora, sigue estos pasos para subirlo a internet para todo el mundo.</p>
      
      <h3>Paso 5.1: Construir la versión de producción (Build)</h3>
      <ol>
        <li>Abre la Terminal en VS Code (menú <code>Terminal &gt; New Terminal</code>).</li>
        <li>Asegúrate de estar en la carpeta del proyecto.</li>
        <li>Escribe el siguiente comando y presiona Enter:
          <div class="code-block">npm run build</div>
        </li>
        <li>Espera unos segundos. Cuando termine, se habrá actualizado una carpeta llamada <span class="highlight">dist</span> dentro de tu proyecto. Esta carpeta contiene tu página web final, comprimida y lista para internet.</li>
      </ol>
      <div class="note"><strong>¿Error en Windows?</strong> Si al correr 'npm run build' en Powershell te sale error de permisos rojos, usa este comando en su lugar:<br><code>powershell -ExecutionPolicy Bypass -Command "npm run build"</code></div>

      <h3>Paso 5.2: Subir a Hostinger</h3>
      <ol>
        <li>Entra a tu cuenta de <strong>Hostinger</strong> e ingresa a tu panel de control (hPanel).</li>
        <li>Ve a la sección <strong>Sitios Web &gt; Administrar &gt; Administrador de Archivos</strong> (File Manager).</li>
        <li>Navega haciendo doble clic hasta entrar en la carpeta <span class="highlight">public_html</span> de tu dominio.</li>
        <li>Borra el contenido viejo que haya <strong>dentro</strong> de <code>public_html</code>. (Solo el contenido interior, no borres carpetas del sistema que estén un nivel arriba).</li>
        <li>Abre la carpeta <code>dist</code> en tu explorador de archivos de Windows. <strong>Selecciona todos los archivos que hay DENTRO de <code>dist</code></strong> (incluyendo <code>index.html</code>, la carpeta <code>assets</code>, etc.).</li>
        <li><strong>Arrastra y suelta</strong> esos archivos en la ventana del Administrador de Archivos de Hostinger, directo dentro de <code>public_html</code>.</li>
        <li>¡Listo! Tu web está actualizada. Si no ves los cambios inmediatamente en tu navegador, presiona <code>Ctrl + F5</code> (o limpia la caché) para forzar la actualización.</li>
      </ol>
      
    </div>
    
  </body>
  </html>
  `;
  
  const tempPath = path.join(__dirname, 'temp_manual.html');
  fs.writeFileSync(tempPath, htmlContent);
  
  console.log('Generando PDF Extendido...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe'
  });
  const page = await browser.newPage();
  
  const fileUrl = 'file:///' + tempPath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  const pdfPath = path.join(__dirname, 'Manual_Tecnico.pdf');
  await page.pdf({ 
    path: pdfPath, 
    format: 'A4', 
    printBackground: true, 
    margin: { top: '30px', bottom: '30px', left: '30px', right: '30px' } 
  });
  
  await browser.close();
  fs.unlinkSync(tempPath);
  console.log('PDF generado exitosamente en: ' + pdfPath);
})();
