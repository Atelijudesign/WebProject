const fs = require('fs');
const path = require('path');

const DRIVE_ROOT = 'G:\\Mi unidad\\Proyectos-Portfolio';
const WEB_PROJECT_DIR = path.resolve(__dirname, '..');
const PROYECTOS_PATH = path.join(WEB_PROJECT_DIR, 'src', 'data', 'proyectos.json');
const FEATURED_PATH = path.join(WEB_PROJECT_DIR, 'src', 'data', 'featured_details.json');
const PUBLIC_DIR = path.join(WEB_PROJECT_DIR, 'public');

function sanitizeName(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/-+/g, '-')
    .replace(/^[\s.-]+|[\s.-]+$/g, '')
    .trim();
}

function run() {
  console.log(`[Drive Setup] Destino: ${DRIVE_ROOT}`);
  
  if (!fs.existsSync(DRIVE_ROOT)) {
    fs.mkdirSync(DRIVE_ROOT, { recursive: true });
    console.log(`[Drive Setup] Creada carpeta raíz: ${DRIVE_ROOT}`);
  }

  const rawProjects = fs.readFileSync(PROYECTOS_PATH, 'utf8');
  const projectsData = JSON.parse(rawProjects);
  const projects = projectsData.value || [];

  let featuredData = {};
  if (fs.existsSync(FEATURED_PATH)) {
    try {
      featuredData = JSON.parse(fs.readFileSync(FEATURED_PATH, 'utf8'));
    } catch (e) {
      console.warn("No se pudo leer featured_details.json", e.message);
    }
  }

  console.log(`[Drive Setup] Procesando ${projects.length} proyectos...`);

  const results = [];
  let totalImagesCopied = 0;

  projects.forEach((p, idx) => {
    const pId = p.project_id || `P-${String(idx + 1).padStart(3, '0')}`;
    const cleanTitle = sanitizeName(p.name || 'Sin Titulo');
    const folderName = `${pId} - ${cleanTitle}`;
    const projectDir = path.join(DRIVE_ROOT, folderName);

    // Carpetas obligatorias
    const imgDir = path.join(projectDir, 'Imagenes');
    const modDir = path.join(projectDir, 'Modelos');
    const plaDir = path.join(projectDir, 'Planos');

    fs.mkdirSync(imgDir, { recursive: true });
    fs.mkdirSync(modDir, { recursive: true });
    fs.mkdirSync(plaDir, { recursive: true });

    // Buscar imágenes locales para copiar a Imagenes
    let imgList = [];
    if (p.image_url) imgList.push(p.image_url);
    if (Array.isArray(p.gallery_images)) imgList.push(...p.gallery_images);

    const feat = featuredData[p.slug] || featuredData[p.project_id];
    if (feat) {
      if (feat.image) imgList.push(feat.image);
      if (Array.isArray(feat.gallery)) imgList.push(...feat.gallery);
    }

    imgList = [...new Set(imgList.filter(Boolean))];
    let copiedForProject = 0;

    imgList.forEach(relPath => {
      const cleanRel = relPath.startsWith('/') ? relPath.slice(1) : relPath;
      const srcPath = path.join(PUBLIC_DIR, cleanRel);
      if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile()) {
        const fileName = path.basename(srcPath);
        const destPath = path.join(imgDir, fileName);
        try {
          fs.copyFileSync(srcPath, destPath);
          copiedForProject++;
          totalImagesCopied++;
        } catch (err) {
          console.warn(`Error copiando ${srcPath} a ${destPath}:`, err.message);
        }
      }
    });

    // Crear FICHA_TECNICA.md con metadatos completos
    const fichaContent = `# ${p.project_id} - ${p.name}
${p.name_en ? `*${p.name_en}*\n` : ''}
---

## 📋 Información General

| Campo | Detalle |
| :--- | :--- |
| **ID del Proyecto** | \`${p.project_id}\` |
| **Estado** | ${p.status || 'Completado'} |
| **Empresa / Especialista** | ${p.company || 'GHD'} |
| **Cliente / Mandante** | ${p.client || '–'} |
| **País / Ciudad** | ${p.country || 'Chile'}${p.city ? ` / ${p.city}` : ''} |
| **Período** | ${p.year_start || ''} ${p.year_end && p.year_end !== p.year_start ? `– ${p.year_end}` : ''} |
| **Sector / Industria** | ${p.project_type || 'Industrial'} |
| **Etapa / Fase** | ${p.phase || 'Ingeniería de Detalle'} |
| **Rol Desempeñado** | ${p.role || 'Proyectista Estructural BIM'} |
| **Material Predominante** | ${p.material || 'Acero Estructural'} |
| **Software BIM / CAD** | ${p.software || 'Revit Structure, AutoCAD'} |
| **Volumen Hormigón** | ${p.concrete_volume ? `${p.concrete_volume.toLocaleString()} m³` : '–'} |
| **Toneladas Acero** | ${p.steel_weight ? `${p.steel_weight.toLocaleString()} Ton.` : '–'} |
| **Destacado en Portafolio** | ${p.featured ? '★ SÍ (Visible en /#portfolio)' : '☆ NO (Solo en Catálogo)'} |

---

## 📝 Descripción Técnica

### Español
${p.description || 'Sin descripción detallada.'}

${p.description_en ? `### English\n${p.description_en}\n` : ''}

${p.activities ? `### 🛠️ Actividades y Alcances Clave\n${p.activities}\n` : ''}

---

## 📁 Estructura de Archivos del Proyecto
- \`Imagenes/\`: Renders, capturas de pantalla de modelos 3D y fotografías de avance (${copiedForProject} imágenes copiadas).
- \`Modelos/\`: Modelos BIM paramétricos (.rvt, .ifc, .nwd, .tekla).
- \`Planos/\`: Documentación planimétrica final (.dwg, .pdf).

*Generado automáticamente para el Portfolio Profesional de Andrés Gallo P. el ${new Date().toLocaleDateString('es-CL')}.*
`;

    fs.writeFileSync(path.join(projectDir, 'FICHA_TECNICA.md'), fichaContent, 'utf8');

    results.push({
      id: p.project_id,
      name: p.name,
      folder: folderName,
      featured: !!p.featured,
      imagesCopied: copiedForProject
    });
  });

  // Crear INDICE_PROYECTOS.md maestro
  let indexContent = `# 📂 Portafolio Profesional de Proyectos BIM & Estructurales
**Andrés Gallo P. — Proyectista Estructural BIM**  
*Directorio Principal en Google Drive: \`G:\\Mi unidad\\Proyectos-Portfolio\`*  
*Total de Proyectos: ${projects.length} | Proyectos con Imágenes: ${results.filter(r => r.imagesCopied > 0).length}*

---

## 🗂️ Índice Completo de Proyectos

| ID | Proyecto | Empresa | Año | Destacado | Imágenes | Carpeta |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
`;

  projects.forEach((p, idx) => {
    const r = results[idx];
    const isFeat = p.featured ? '★ SÍ' : '☆ No';
    const yearStr = p.year_end || p.year_start || '–';
    indexContent += `| \`${p.project_id}\` | **${p.name}** | ${p.company || '–'} | ${yearStr} | ${isFeat} | ${r.imagesCopied} | [\`${r.folder}\`](./${encodeURIComponent(r.folder)}) |\n`;
  });

  indexContent += `\n---\n*Estructura creada con las 3 subcarpetas por proyecto: \`Imagenes/\`, \`Modelos/\` y \`Planos/\`.*`;

  fs.writeFileSync(path.join(DRIVE_ROOT, 'INDICE_PROYECTOS.md'), indexContent, 'utf8');

  console.log(`\n✅ Proceso completado exitosamente:`);
  console.log(`   - 📁 ${projects.length} carpetas de proyectos creadas en: ${DRIVE_ROOT}`);
  console.log(`   - 📂 3 subcarpetas por proyecto (Imagenes, Modelos, Planos): ${projects.length * 3} subcarpetas`);
  console.log(`   - 🖼️ ${totalImagesCopied} imágenes web respaldadas en las carpetas Imagenes/`);
  console.log(`   - 📄 51 fichas técnicas FICHA_TECNICA.md generadas`);
  console.log(`   - 📑 1 índice maestro INDICE_PROYECTOS.md creado`);
}

run();
