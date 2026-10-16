import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import { db } from './db/connection.js';
import { runMigrations } from './db/migrator.js';
import {
  createProject,
  deleteProject,
  findProject,
  listProjects,
  replaceProjects,
  updateProject,
} from './db/projectsRepository.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createTableRecord,
  databaseSummary,
  deleteTableRecord,
  tableRows,
  updateTableRecord,
} from './databaseViewer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.resolve(__dirname, '../public');
const projectAssetsDirectory = path.resolve(__dirname, '../../public/assets');
const chartJsBundle = path.resolve(__dirname, '../../node_modules/chart.js/dist/chart.umd.js');
const frontendDistDirectory = path.resolve(__dirname, '../../dist');
const liveClients = new Set();

function notifyDataChange(entity, action) {
  const payload = `event: data-change\ndata: ${JSON.stringify({ entity, action, at: new Date().toISOString() })}\n\n`;
  for (const response of liveClients) response.write(payload);
}

const app = express();
const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '127.0.0.1';
const allowedOrigins = new Set([
  `http://localhost:${port}`,
  `http://127.0.0.1:${port}`,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(process.env.CORS_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean),
]);

runMigrations();

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origen no permitido por CORS'));
  },
}));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', database: databaseSummary(db) });
});

app.use('/database-assets', express.static(publicDirectory, {
  index: false,
  etag: false,
  maxAge: 0,
  setHeaders(response) {
    response.setHeader('Cache-Control', 'no-store, max-age=0');
  },
}));
app.use('/assets', express.static(projectAssetsDirectory, { index: false, maxAge: '1h' }));
app.get('/database-assets/chart.umd.js', (_req, res) => res.sendFile(chartJsBundle));
app.get('/database', (_req, res) => res.sendFile(path.join(publicDirectory, 'database.html')));
app.get('/api/database', (_req, res) => res.json(databaseSummary(db)));
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  res.write('retry: 3000\nevent: connected\ndata: {}\n\n');
  liveClients.add(res);
  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 20000);
  req.on('close', () => {
    clearInterval(heartbeat);
    liveClients.delete(res);
  });
});
app.get('/api/database/tables/:table', (req, res) => {
  const result = tableRows(db, req.params.table, req.query.limit, req.query.offset);
  if (!result) return res.status(404).json({ error: 'Tabla no disponible' });
  return res.json(result);
});

app.post('/api/database/tables/:table', (req, res, next) => {
  try {
    const record = createTableRecord(db, req.params.table, req.body);
    if (record === null) return res.status(403).json({ error: 'Tabla de solo lectura' });
    notifyDataChange(req.params.table, 'created');
    return res.status(201).json({ success: true, record });
  } catch (error) {
    return next(error);
  }
});

app.patch('/api/database/tables/:table/:id', (req, res, next) => {
  try {
    const record = updateTableRecord(db, req.params.table, req.params.id, req.body);
    if (record === undefined) return res.status(403).json({ error: 'Tabla de solo lectura' });
    if (record === null) return res.status(404).json({ error: 'Registro no encontrado' });
    notifyDataChange(req.params.table, 'updated');
    return res.json({ success: true, record });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/database/tables/:table/:id', (req, res, next) => {
  try {
    const record = deleteTableRecord(db, req.params.table, req.params.id);
    if (record === undefined) return res.status(403).json({ error: 'Tabla de solo lectura' });
    if (record === null) return res.status(404).json({ error: 'Registro no encontrado' });
    notifyDataChange(req.params.table, 'deleted');
    return res.json({ success: true, deleted: record.id });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/projects', (_req, res) => res.json({ value: listProjects(db) }));
app.get('/api/projects/:identifier', (req, res) => {
  const project = findProject(db, req.params.identifier);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
  return res.json({ project });
});

app.post('/api/projects', (req, res, next) => {
  try {
    if (Array.isArray(req.body?.value)) {
      const count = replaceProjects(db, req.body.value);
      notifyDataChange('projects', 'replaced');
      return res.json({ success: true, count });
    }
    const project = createProject(db, req.body?.project || req.body || {});
    notifyDataChange('projects', 'created');
    return res.status(201).json({ success: true, project });
  } catch (error) {
    return next(error);
  }
});

app.patch('/api/projects/:identifier/featured', (req, res, next) => {
  try {
    if (typeof req.body?.featured !== 'boolean') {
      return res.status(400).json({ error: "El campo 'featured' debe ser boolean" });
    }
    const project = updateProject(db, req.params.identifier, { featured: req.body.featured });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    notifyDataChange('projects', 'updated');
    return res.json({ success: true, project_id: project.project_id, featured: project.featured });
  } catch (error) {
    return next(error);
  }
});

app.patch('/api/projects/:identifier', (req, res, next) => {
  try {
    const project = updateProject(db, req.params.identifier, req.body);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    notifyDataChange('projects', 'updated');
    return res.json({ success: true, project });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/projects/:identifier', (req, res, next) => {
  try {
    const project = deleteProject(db, req.params.identifier);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    notifyDataChange('projects', 'deleted');
    return res.json({ success: true, deleted: project.project_id });
  } catch (error) {
    return next(error);
  }
});

if (fs.existsSync(path.join(frontendDistDirectory, 'index.html'))) {
  app.use(express.static(frontendDistDirectory, { index: false, maxAge: '1h' }));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/') && req.accepts('html')) {
      return res.sendFile(path.join(frontendDistDirectory, 'index.html'));
    }
    return next();
  });
}

app.use((error, _req, res, _next) => {
  console.error('[API]', error);
  const clientError = error instanceof TypeError || String(error.code || '').startsWith('SQLITE_CONSTRAINT');
  res.status(clientError ? 400 : 500).json({
    error: clientError ? error.message : 'Error interno del servidor',
  });
});

app.listen(port, host, () => {
  console.log(`\nWebProject API: http://${host}:${port}`);
  console.log(`Visor SQLite:   http://${host}:${port}/database`);
});
