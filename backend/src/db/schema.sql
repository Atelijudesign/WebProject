-- Esquema Relacional de Base de Datos SQLite para WebProject (AtelijuDesign)

CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  project_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE,
  client TEXT,
  company TEXT,
  country TEXT,
  city TEXT,
  period TEXT,
  year_start INTEGER,
  year_end INTEGER,
  project_type TEXT,
  project_type_en TEXT,
  material TEXT,
  material_en TEXT,
  role TEXT,
  role_en TEXT,
  software TEXT,
  status TEXT,
  status_en TEXT,
  phase TEXT,
  phase_en TEXT,
  description TEXT,
  description_en TEXT,
  description_paragraphs TEXT,
  description_paragraphs_en TEXT,
  activities TEXT,
  activities_en TEXT,
  concrete_volume REAL,
  steel_weight REAL,
  rebar_weight REAL,
  featured INTEGER DEFAULT 0,
  image_url TEXT,
  gallery_images TEXT,
  specs TEXT,
  specs_en TEXT,
  technologies TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_project_id ON projects(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON projects(project_type);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  project_type TEXT,
  message TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

CREATE TABLE IF NOT EXISTS calculation_logs (
  id TEXT PRIMARY KEY,
  tool_name TEXT NOT NULL,
  inputs TEXT NOT NULL,
  results TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_calc_logs_tool ON calculation_logs(tool_name);

INSERT OR IGNORE INTO schema_migrations (version, name, applied_at)
VALUES (1, 'initial_schema', CURRENT_TIMESTAMP);
