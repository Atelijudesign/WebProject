import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import {
  createProject,
  deleteProject,
  findProject,
  listProjects,
  replaceProjects,
  updateProject,
} from '../src/db/projectsRepository.js';

function database() {
  const db = new DatabaseSync(':memory:');
  const schema = fs.readFileSync(path.resolve('src/db/schema.sql'), 'utf8');
  db.exec(schema);
  return db;
}

test('crea, lee, actualiza y elimina proyectos', () => {
  const db = database();
  const created = createProject(db, {
    name: 'Proyecto de prueba',
    gallery_images: ['uno.webp'],
    featured: true,
  });

  assert.equal(created.project_id, 'P-001');
  assert.equal(created.featured, true);
  assert.deepEqual(created.gallery_images, ['uno.webp']);

  const updated = updateProject(db, created.id, { name: 'Proyecto actualizado', featured: false });
  assert.equal(updated.name, 'Proyecto actualizado');
  assert.equal(updated.featured, false);
  assert.equal(findProject(db, created.project_id).id, created.id);

  assert.equal(deleteProject(db, created.slug || created.id).id, created.id);
  assert.equal(listProjects(db).length, 0);
  db.close();
});

test('reemplaza la colección de forma transaccional', () => {
  const db = database();
  const timestamp = '2026-01-01T00:00:00.000Z';
  const count = replaceProjects(db, [
    { id: 'a', project_id: 'P-002', name: 'Dos', created_at: timestamp, updated_at: timestamp },
    { id: 'b', project_id: 'P-001', name: 'Uno', created_at: timestamp, updated_at: timestamp },
  ]);

  assert.equal(count, 2);
  assert.equal(listProjects(db).length, 2);
  assert.equal(findProject(db, 'P-001').updated_at, timestamp);
  assert.throws(
    () => replaceProjects(db, [{ id: 'c', name: 'Inválido' }]),
    /project_id/,
  );
  assert.equal(listProjects(db).length, 2);
  db.close();
});
