import crypto from 'node:crypto';
import { dbPath } from './db/connection.js';

const ALLOWED_TABLES = new Set(['projects', 'leads', 'calculation_logs', 'schema_migrations']);
const EDITABLE_TABLES = {
  leads: {
    columns: ['name', 'email', 'company', 'project_type', 'message', 'source', 'status'],
    required: ['name', 'email'],
    defaults: { status: 'new' },
  },
  calculation_logs: {
    columns: ['tool_name', 'inputs', 'results'],
    required: ['tool_name', 'inputs', 'results'],
    defaults: {},
  },
};

export function databaseSummary(database) {
  const tables = [...ALLOWED_TABLES].map((name) => ({
    name,
    rows: Number(database.prepare(`SELECT COUNT(*) AS count FROM ${name}`).get().count),
  }));
  return {
    engine: 'SQLite',
    path: dbPath,
    integrity: database.prepare('PRAGMA quick_check').get().quick_check,
    tables,
  };
}

export function tableRows(database, table, limit = 100, offset = 0) {
  if (!ALLOWED_TABLES.has(table)) return null;
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const columns = database.prepare(`PRAGMA table_info(${table})`).all().map((column) => column.name);
  const rows = database.prepare(`SELECT * FROM ${table} LIMIT ? OFFSET ?`).all(safeLimit, safeOffset);
  const total = Number(database.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count);
  return { table, columns, rows, total, limit: safeLimit, offset: safeOffset };
}

function editableConfig(table) {
  return EDITABLE_TABLES[table] || null;
}

function validateRecord(config, input) {
  for (const field of config.required) {
    if (input[field] === undefined || input[field] === null || String(input[field]).trim() === '') {
      throw new TypeError(`El campo ${field} es obligatorio`);
    }
  }
}

export function createTableRecord(database, table, input) {
  const config = editableConfig(table);
  if (!config) return null;
  const record = { ...config.defaults, ...(input || {}) };
  validateRecord(config, record);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const columns = ['id', ...config.columns, 'created_at'];
  const values = [id, ...config.columns.map((column) => record[column] ?? null), createdAt];
  database
    .prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`)
    .run(...values);
  return database.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

export function updateTableRecord(database, table, id, input) {
  const config = editableConfig(table);
  if (!config) return undefined;
  const current = database.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  if (!current) return null;
  const entries = Object.entries(input || {}).filter(([column]) => config.columns.includes(column));
  const candidate = { ...current, ...Object.fromEntries(entries) };
  validateRecord(config, candidate);
  if (entries.length) {
    database
      .prepare(`UPDATE ${table} SET ${entries.map(([column]) => `${column} = ?`).join(', ')} WHERE id = ?`)
      .run(...entries.map(([, value]) => value ?? null), id);
  }
  return database.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

export function deleteTableRecord(database, table, id) {
  const config = editableConfig(table);
  if (!config) return undefined;
  const current = database.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  if (!current) return null;
  database.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  return current;
}
