import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 3001;
const JSON_PATH = join(__dirname, 'src', 'data', 'proyectos.json');

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function readDatabase() {
  const raw = fs.readFileSync(JSON_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeDatabase(data) {
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
}

const server = http.createServer((req, res) => {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost:3001'}`);
  const pathname = url.pathname;

  // 1. GET /api/projects
  if (pathname === '/api/projects' && req.method === 'GET') {
    try {
      const data = readDatabase();
      return sendJson(res, 200, data);
    } catch (err) {
      console.error('[API] Error reading database:', err);
      return sendJson(res, 500, { error: 'Failed to read database file' });
    }
  }

  // 2. POST /api/projects (bulk or single)
  if (pathname === '/api/projects' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const data = readDatabase();

        // Caso 1: Actualización de la lista completa (ej: desde AdminDashboard)
        if (payload.value && Array.isArray(payload.value)) {
          data.value = payload.value;
          writeDatabase(data);
          console.log(`[API] Base de datos reemplazada (${payload.value.length} proyectos)`);
          return sendJson(res, 200, { success: true, count: payload.value.length });
        }

        // Caso 2: Creación de un proyecto individual
        const newProject = payload.project || payload;
        if (!newProject.name) {
          return sendJson(res, 400, { error: 'El nombre del proyecto es obligatorio' });
        }

        if (!newProject.project_id) {
          const maxId = Math.max(
            ...data.value.map((p) => parseInt(String(p.project_id).replace('P-', '')) || 0),
            0
          );
          newProject.project_id = `P-${String(maxId + 1).padStart(3, '0')}`;
        }

        if (!newProject.id) {
          newProject.id = crypto.randomUUID();
        }

        newProject.created_at = newProject.created_at || new Date().toISOString();
        newProject.updated_at = new Date().toISOString();
        newProject.featured = !!newProject.featured;

        data.value.unshift(newProject);
        writeDatabase(data);
        console.log(`[API] Proyecto creado: ${newProject.project_id} - ${newProject.name}`);
        return sendJson(res, 201, { success: true, project: newProject });
      } catch (err) {
        console.error('[API] Error in POST /api/projects:', err);
        return sendJson(res, 400, { error: 'Invalid JSON payload' });
      }
    });
    return;
  }

  // 3. PATCH /api/projects/:id/featured
  const featuredMatch = pathname.match(/^\/api\/projects\/([^/]+)\/featured$/);
  if (featuredMatch && req.method === 'PATCH') {
    const rawId = decodeURIComponent(featuredMatch[1]);
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { featured } = JSON.parse(body);
        if (typeof featured !== 'boolean') {
          return sendJson(res, 400, { error: "Campo 'featured' debe ser boolean" });
        }

        const data = readDatabase();
        const project = data.value.find(
          (p) => p.project_id === rawId || p.id === rawId || p.slug === rawId
        );

        if (!project) {
          console.warn(`[API] Proyecto ${rawId} no encontrado para toggle featured`);
          return sendJson(res, 404, { error: `Proyecto ${rawId} no encontrado` });
        }

        project.featured = featured;
        project.updated_at = new Date().toISOString();
        writeDatabase(data);

        console.log(`[API] ${project.project_id} featured → ${featured}`);
        return sendJson(res, 200, { success: true, project_id: project.project_id, featured });
      } catch (err) {
        console.error('[API] Error in PATCH featured:', err);
        return sendJson(res, 500, { error: 'Error actualizando featured', detail: err.message });
      }
    });
    return;
  }

  // 4. PATCH /api/projects/:id
  const projectMatch = pathname.match(/^\/api\/projects\/([^/]+)$/);
  if (projectMatch && req.method === 'PATCH') {
    const rawId = decodeURIComponent(projectMatch[1]);
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const updates = JSON.parse(body);
        const data = readDatabase();
        const project = data.value.find(
          (p) => p.project_id === rawId || p.id === rawId || p.slug === rawId
        );

        if (!project) {
          return sendJson(res, 404, { error: `Proyecto ${rawId} no encontrado` });
        }

        Object.assign(project, updates, { updated_at: new Date().toISOString() });
        writeDatabase(data);

        console.log(`[API] ${project.project_id} actualizado:`, Object.keys(updates));
        return sendJson(res, 200, { success: true, project_id: project.project_id, updates });
      } catch (err) {
        console.error('[API] Error in PATCH project:', err);
        return sendJson(res, 500, { error: 'Error actualizando proyecto', detail: err.message });
      }
    });
    return;
  }

  // 5. DELETE /api/projects/:id
  if (projectMatch && req.method === 'DELETE') {
    const rawId = decodeURIComponent(projectMatch[1]);
    try {
      const data = readDatabase();
      const initialLen = data.value.length;
      data.value = data.value.filter(
        (p) => p.project_id !== rawId && p.id !== rawId && p.slug !== rawId
      );

      if (data.value.length === initialLen) {
        return sendJson(res, 404, { error: `Proyecto ${rawId} no encontrado` });
      }

      writeDatabase(data);
      console.log(`[API] ${rawId} eliminado`);
      return sendJson(res, 200, { success: true, deleted: rawId });
    } catch (err) {
      console.error('[API] Error in DELETE project:', err);
      return sendJson(res, 500, { error: 'Error eliminando proyecto' });
    }
  }

  // Fallback 404
  return sendJson(res, 404, { error: 'Not Found' });
});

server.listen(PORT, () => {
  console.log(`\n🚀 API local (ESM) corriendo en http://localhost:${PORT}`);
  console.log(`   GET    http://localhost:${PORT}/api/projects`);
  console.log(`   POST   http://localhost:${PORT}/api/projects`);
  console.log(`   PATCH  http://localhost:${PORT}/api/projects/:id/featured`);
  console.log(`   PATCH  http://localhost:${PORT}/api/projects/:id\n`);
});
