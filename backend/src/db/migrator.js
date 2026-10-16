import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_DETAIL_COLUMNS = {
  description_paragraphs: 'TEXT',
  description_paragraphs_en: 'TEXT',
  specs: 'TEXT',
  specs_en: 'TEXT',
  technologies: 'TEXT',
};

function ensureProjectDetailColumns() {
  const existing = new Set(db.prepare('PRAGMA table_info(projects)').all().map((column) => column.name));
  for (const [column, type] of Object.entries(PROJECT_DETAIL_COLUMNS)) {
    if (!existing.has(column)) db.exec(`ALTER TABLE projects ADD COLUMN ${column} ${type}`);
  }
  db.prepare(`INSERT OR IGNORE INTO schema_migrations (version, name, applied_at) VALUES (2, ?, ?)`)
    .run('project_detail_content', new Date().toISOString());
}

function enrichProjectDetails() {
  const detailsPath = path.resolve(__dirname, '../../../src/data/featured_details.json');
  if (!fs.existsSync(detailsPath)) return 0;
  const details = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
  const values = Object.values(details);
  const projects = db.prepare('SELECT id, project_id, slug FROM projects').all();
  const update = db.prepare(`UPDATE projects SET
    description_paragraphs = COALESCE(description_paragraphs, ?),
    description_paragraphs_en = COALESCE(description_paragraphs_en, ?),
    specs = COALESCE(specs, ?), specs_en = COALESCE(specs_en, ?),
    technologies = COALESCE(technologies, ?),
    gallery_images = CASE WHEN gallery_images IS NULL OR gallery_images = '[]' THEN ? ELSE gallery_images END,
    image_url = COALESCE(image_url, ?), name_en = COALESCE(name_en, ?)
    WHERE id = ?`);
  let enriched = 0;
  for (const project of projects) {
    const detail = details[project.project_id] || details[project.slug]
      || values.find((item) => item.project_id === project.project_id || item.slug === project.slug);
    if (!detail) continue;
    update.run(
      JSON.stringify(detail.description_paragraphs || []),
      JSON.stringify(detail.description_paragraphs_en || []),
      JSON.stringify(detail.specs || []),
      JSON.stringify(detail.specs_en || []),
      JSON.stringify(detail.technologies || []),
      JSON.stringify(detail.gallery_images || []),
      detail.image_url || null,
      detail.name_en || null,
      project.id,
    );
    enriched += 1;
  }
  return enriched;
}

export function runMigrations() {
  console.log('[Migrator] Ejecutando migraciones de esquema SQL...');

  // 1. Ejecutar schema.sql
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  ensureProjectDetailColumns();
  console.log('[Migrator] Tablas e índices creados o verificados exitosamente.');

  // 2. Verificar si existen proyectos
  const countRow = db.prepare('SELECT COUNT(*) AS count FROM projects').get();
  const currentCount = Number(countRow?.count || 0);

  if (currentCount > 0) {
    const enriched = enrichProjectDetails();
    console.log(`[Migrator] Base de datos ya inicializada con ${currentCount} proyectos (${enriched} enriquecidos).`);
    return currentCount;
  }

  // 3. Importar proyectos semilla desde proyectos.json si la tabla está vacía
  const candidateJsonPaths = [
    path.resolve(__dirname, '../../../src/data/proyectos.json'),
    path.resolve(__dirname, '../../../frontend/src/data/proyectos.json'),
    path.resolve(__dirname, '../../data/proyectos.json'),
  ];

  let jsonPath = null;
  for (const candidate of candidateJsonPaths) {
    if (fs.existsSync(candidate)) {
      jsonPath = candidate;
      break;
    }
  }

  if (!jsonPath) {
    console.log('[Migrator] No se encontró proyectos.json para poblar datos iniciales.');
    return 0;
  }

  try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(rawData);
    const projectsList = Array.isArray(parsed) ? parsed : (parsed.value || []);

    if (projectsList.length === 0) {
      return 0;
    }

    console.log(`[Migrator] Sembrando ${projectsList.length} proyectos desde ${jsonPath}...`);

    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO projects (
        id, project_id, name, name_en, slug, client, company, country, city,
        period, year_start, year_end, project_type, project_type_en,
        material, material_en, role, role_en, software, status, status_en,
        phase, phase_en, description, description_en, activities, activities_en,
        concrete_volume, steel_weight, rebar_weight, featured, image_url,
        gallery_images, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `);

    db.exec('BEGIN TRANSACTION;');

    for (const p of projectsList) {
      const id = p.id || crypto.randomUUID();
      const galleryJson = Array.isArray(p.gallery_images) ? JSON.stringify(p.gallery_images) : '[]';

      insertStmt.run(
        id,
        p.project_id || id,
        p.name || 'Sin Título',
        p.name_en || null,
        p.slug || null,
        p.client || null,
        p.company || null,
        p.country || null,
        p.city || null,
        p.period || null,
        p.year_start || null,
        p.year_end || null,
        p.project_type || null,
        p.project_type_en || null,
        p.material || null,
        p.material_en || null,
        p.role || null,
        p.role_en || null,
        p.software || null,
        p.status || null,
        p.status_en || null,
        p.phase || null,
        p.phase_en || null,
        p.description || null,
        p.description_en || null,
        p.activities || null,
        p.activities_en || null,
        typeof p.concrete_volume === 'number' ? p.concrete_volume : null,
        typeof p.steel_weight === 'number' ? p.steel_weight : null,
        typeof p.rebar_weight === 'number' ? p.rebar_weight : null,
        p.featured ? 1 : 0,
        p.image_url || null,
        galleryJson,
        p.created_at || new Date().toISOString(),
        p.updated_at || new Date().toISOString()
      );
    }

    db.exec('COMMIT;');
    const enriched = enrichProjectDetails();
    console.log(`[Migrator] ¡Éxito! ${projectsList.length} proyectos importados en SQLite.`);
    console.log(`[Migrator] Contenido detallado incorporado en ${enriched} proyectos.`);
    return projectsList.length;
  } catch (seedError) {
    db.exec('ROLLBACK;');
    console.error('[Migrator] Error al sembrar proyectos:', seedError);
    throw seedError;
  }
}

// Permitir ejecución directa con: node src/db/migrator.js
if (process.argv[1] && process.argv[1].endsWith('migrator.js')) {
  runMigrations();
}
