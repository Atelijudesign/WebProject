/**
 * server.cjs — API local de desarrollo para WebProject
 * Permite leer y modificar proyectos.json en tiempo real desde el frontend.
 * Corre en puerto 3001. Iniciar con: node server.cjs
 */

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;
const DATA_PATH = path.join(__dirname, "src", "data", "proyectos.json");

app.use(cors());
app.use(express.json());

// GET /api/projects — Devuelve todos los proyectos
app.get("/api/projects", (_req, res) => {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error leyendo proyectos.json", detail: err.message });
  }
});

// POST /api/projects — Crear un nuevo proyecto o actualizar la lista completa
app.post("/api/projects", (req, res) => {
  try {
    const payload = req.body;
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);

    // Caso 1: Actualización de la lista completa (ej: desde AdminDashboard)
    if (payload.value && Array.isArray(payload.value)) {
      data.value = payload.value;
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
      console.log(`[API] Base de datos de proyectos reemplazada (${payload.value.length} proyectos)`);
      return res.json({ success: true, count: payload.value.length });
    }

    // Caso 2: Creación de un proyecto individual
    const newProject = payload.project || payload;
    if (!newProject.name) {
      return res.status(400).json({ error: "El nombre del proyecto es obligatorio" });
    }

    // Generar project_id si no existe
    if (!newProject.project_id) {
      const maxId = Math.max(
        ...data.value.map((p) => parseInt(String(p.project_id).replace("P-", "")) || 0),
        0
      );
      newProject.project_id = `P-${String(maxId + 1).padStart(3, "0")}`;
    }

    if (!newProject.id) {
      newProject.id = require("crypto").randomUUID();
    }

    newProject.created_at = newProject.created_at || new Date().toISOString();
    newProject.updated_at = new Date().toISOString();
    newProject.featured = !!newProject.featured;

    // Agregar al inicio
    data.value.unshift(newProject);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");

    console.log(`[API] Proyecto creado: ${newProject.project_id} - ${newProject.name} (featured: ${newProject.featured})`);
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    res.status(500).json({ error: "Error procesando proyecto", detail: err.message });
  }
});

// PATCH /api/projects/:project_id/featured — Toggle campo featured
app.patch("/api/projects/:project_id/featured", (req, res) => {
  try {
    const { project_id } = req.params;
    const { featured } = req.body;

    if (typeof featured !== "boolean") {
      return res.status(400).json({ error: "Campo 'featured' debe ser boolean" });
    }

    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);

    const project = data.value.find(
      (p) => p.project_id === project_id || p.id === project_id || p.slug === project_id
    );
    if (!project) {
      return res.status(404).json({ error: `Proyecto ${project_id} no encontrado` });
    }

    project.featured = featured;
    project.updated_at = new Date().toISOString();

    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");

    console.log(`[API] ${project.project_id} featured → ${featured}`);
    res.json({ success: true, project_id: project.project_id, featured });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando featured", detail: err.message });
  }
});

// PATCH /api/projects/:project_id — Actualizar campos arbitrarios (image_url, etc.)
app.patch("/api/projects/:project_id", (req, res) => {
  try {
    const { project_id } = req.params;
    const updates = req.body;

    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);

    const project = data.value.find(
      (p) => p.project_id === project_id || p.id === project_id || p.slug === project_id
    );
    if (!project) {
      return res.status(404).json({ error: `Proyecto ${project_id} no encontrado` });
    }

    Object.assign(project, updates, { updated_at: new Date().toISOString() });
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");

    console.log(`[API] ${project.project_id} actualizado:`, Object.keys(updates));
    res.json({ success: true, project_id: project.project_id, updates });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando proyecto", detail: err.message });
  }
});

// DELETE /api/projects/:project_id — Eliminar proyecto
app.delete("/api/projects/:project_id", (req, res) => {
  try {
    const { project_id } = req.params;
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);

    const initialLen = data.value.length;
    data.value = data.value.filter(
      (p) => p.project_id !== project_id && p.id !== project_id && p.slug !== project_id
    );

    if (data.value.length === initialLen) {
      return res.status(404).json({ error: `Proyecto ${project_id} no encontrado` });
    }

    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    console.log(`[API] ${project_id} eliminado`);
    res.json({ success: true, deleted: project_id });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando proyecto", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 API local corriendo en http://localhost:${PORT}`);
  console.log(`   GET  http://localhost:${PORT}/api/projects`);
  console.log(`   PATCH http://localhost:${PORT}/api/projects/:id/featured\n`);
});
