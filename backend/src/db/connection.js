import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '../..');
const envPath = path.join(backendRoot, '.env');
if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile(envPath);
}

// Directorio y ruta de la base de datos
const dataDir = path.join(backendRoot, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const dbPath = process.env.DB_PATH
  ? path.resolve(backendRoot, process.env.DB_PATH)
  : path.join(dataDir, 'atelijudesign.db');

export const db = new DatabaseSync(dbPath);

// Configurar pragmas para máxima integridad y rendimiento
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA synchronous = NORMAL;');
db.exec('PRAGMA busy_timeout = 5000;');

console.log(`[Database] Conectado a SQLite en: ${dbPath}`);
