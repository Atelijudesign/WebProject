import crypto from 'node:crypto';

export const PROJECT_COLUMNS = [
  'id', 'project_id', 'name', 'name_en', 'slug', 'client', 'company', 'country', 'city',
  'period', 'year_start', 'year_end', 'project_type', 'project_type_en', 'material',
  'material_en', 'role', 'role_en', 'software', 'status', 'status_en', 'phase', 'phase_en',
  'description', 'description_en', 'description_paragraphs', 'description_paragraphs_en',
  'activities', 'activities_en', 'concrete_volume',
  'steel_weight', 'rebar_weight', 'featured', 'image_url', 'gallery_images', 'created_at',
  'specs', 'specs_en', 'technologies', 'updated_at',
];

const MUTABLE_COLUMNS = new Set(PROJECT_COLUMNS.filter((column) => !['id', 'created_at'].includes(column)));
const JSON_COLUMNS = new Set([
  'gallery_images', 'description_paragraphs', 'description_paragraphs_en',
  'specs', 'specs_en', 'technologies',
]);
const BOOLEAN_COLUMNS = new Set(['featured']);

function serializeValue(column, value) {
  if (JSON_COLUMNS.has(column)) {
    if (typeof value === 'string') return value;
    return JSON.stringify(Array.isArray(value) ? value : []);
  }
  if (BOOLEAN_COLUMNS.has(column)) return value ? 1 : 0;
  return value === undefined || value === '' ? null : value;
}

function deserializeProject(row) {
  if (!row) return null;
  const project = { ...row, featured: Boolean(row.featured) };
  for (const column of JSON_COLUMNS) {
    try {
      project[column] = JSON.parse(row[column] || '[]');
    } catch {
      project[column] = [];
    }
  }
  return project;
}

function normalizeProject(input, existing = null) {
  const now = new Date().toISOString();
  const source = { ...(existing || {}), ...(input || {}) };
  return {
    ...source,
    id: source.id || crypto.randomUUID(),
    project_id: source.project_id,
    name: source.name,
    featured: Boolean(source.featured),
    gallery_images: source.gallery_images || [],
    description_paragraphs: source.description_paragraphs || [],
    description_paragraphs_en: source.description_paragraphs_en || [],
    specs: source.specs || [],
    specs_en: source.specs_en || [],
    technologies: source.technologies || [],
    created_at: source.created_at || existing?.created_at || now,
    updated_at: source.updated_at || now,
  };
}

function nextProjectId(database) {
  const rows = database.prepare('SELECT project_id FROM projects').all();
  const maximum = rows.reduce((max, row) => {
    const value = Number.parseInt(String(row.project_id || '').replace('P-', ''), 10);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);
  return `P-${String(maximum + 1).padStart(3, '0')}`;
}

function insert(database, project) {
  const placeholders = PROJECT_COLUMNS.map(() => '?').join(', ');
  const statement = database.prepare(
    `INSERT INTO projects (${PROJECT_COLUMNS.join(', ')}) VALUES (${placeholders})`,
  );
  statement.run(...PROJECT_COLUMNS.map((column) => serializeValue(column, project[column])));
}

export function listProjects(database) {
  return database
    .prepare('SELECT * FROM projects ORDER BY COALESCE(year_end, year_start, 0) DESC, project_id DESC')
    .all()
    .map(deserializeProject);
}

export function findProject(database, identifier) {
  return deserializeProject(
    database
      .prepare('SELECT * FROM projects WHERE project_id = ? OR id = ? OR slug = ? LIMIT 1')
      .get(identifier, identifier, identifier),
  );
}

export function createProject(database, input) {
  const project = normalizeProject({ ...input, project_id: input.project_id || nextProjectId(database) });
  if (!project.name?.trim()) throw new TypeError('El nombre del proyecto es obligatorio');
  insert(database, project);
  return findProject(database, project.id);
}

export function updateProject(database, identifier, updates) {
  const current = findProject(database, identifier);
  if (!current) return null;

  const entries = Object.entries(updates || {}).filter(
    ([key]) => MUTABLE_COLUMNS.has(key) && key !== 'updated_at',
  );
  if (entries.length === 0) return current;
  entries.push(['updated_at', new Date().toISOString()]);

  const assignments = entries.map(([column]) => `${column} = ?`).join(', ');
  database
    .prepare(`UPDATE projects SET ${assignments} WHERE id = ?`)
    .run(...entries.map(([column, value]) => serializeValue(column, value)), current.id);
  return findProject(database, current.id);
}

export function deleteProject(database, identifier) {
  const current = findProject(database, identifier);
  if (!current) return null;
  database.prepare('DELETE FROM projects WHERE id = ?').run(current.id);
  return current;
}

export function replaceProjects(database, projects) {
  if (!Array.isArray(projects)) throw new TypeError('value debe ser una lista de proyectos');
  const normalized = projects.map((project) => normalizeProject(project));
  for (const project of normalized) {
    if (!project.project_id || !project.name?.trim()) {
      throw new TypeError('Cada proyecto requiere project_id y name');
    }
  }

  database.exec('BEGIN IMMEDIATE');
  try {
    database.exec('DELETE FROM projects');
    for (const project of normalized) insert(database, project);
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
  return normalized.length;
}
