import fs from 'fs';
import path from 'path';

const missingAssets = [];

// 1. Check blog_data.js
import { BLOG_POSTS } from '../src/data/blog_data.js';
BLOG_POSTS.forEach(p => {
  if (p.image) {
    const assetPath = path.join('public', p.image.replace(/^\//, ''));
    if (!fs.existsSync(assetPath)) {
      missingAssets.push(`Blog image missing: ${p.image} (post: ${p.slug})`);
    }
  }
});

// 2. Check featured_details.json
const featured = JSON.parse(fs.readFileSync('src/data/featured_details.json', 'utf-8'));
Object.entries(featured).forEach(([id, proj]) => {
  if (proj.image_url) {
    const assetPath = path.join('public', proj.image_url.replace(/^\//, ''));
    if (!fs.existsSync(assetPath)) {
      missingAssets.push(`Featured project image missing: ${proj.image_url} (proj: ${id})`);
    }
  }
  if (proj.gallery_images) {
    proj.gallery_images.forEach(img => {
      const assetPath = path.join('public', img.replace(/^\//, ''));
      if (!fs.existsSync(assetPath)) {
        missingAssets.push(`Gallery image missing: ${img} (proj: ${id})`);
      }
    });
  }
});

// 3. Check proyectos.json
const rawProyectos = JSON.parse(fs.readFileSync('src/data/proyectos.json', 'utf-8'));
const proyectos = rawProyectos.value || rawProyectos;
proyectos.forEach(p => {
  if (p.image_url) {
    const assetPath = path.join('public', p.image_url.replace(/^\//, ''));
    if (!fs.existsSync(assetPath)) {
      missingAssets.push(`Project image missing: ${p.image_url} (id: ${p.project_id})`);
    }
  }
});

console.log('Total missing assets:', missingAssets.length);
missingAssets.slice(0, 30).forEach(m => console.log('  ->', m));
if (missingAssets.length > 30) {
  console.log(`  ... and ${missingAssets.length - 30} more`);
}
