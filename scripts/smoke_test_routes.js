import http from 'http';
import { BLOG_POSTS } from '../src/data/blog_data.js';

const routes = [
  '/',
  '/herramientas',
  '/herramientas/escaleras',
  '/herramientas/acortadores',
  '/herramientas/icha',
  '/herramientas/aisc',
  '/herramientas/perfiles',
  '/blog',
  '/proyectos',
  '/admin'
];

BLOG_POSTS.forEach(p => {
  routes.push(`/blog/${p.slug}`);
});

console.log(`Auditing ${routes.length} HTTP routes on local server...`);

async function checkRoute(route) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:5173${route}`, (res) => {
      resolve({ route, statusCode: res.statusCode });
    });
    req.on('error', (err) => {
      resolve({ route, statusCode: 'ERROR', error: err.message });
    });
  });
}

async function run() {
  let passed = 0;
  let failed = 0;
  for (const route of routes) {
    const res = await checkRoute(route);
    if (res.statusCode === 200) {
      passed++;
    } else {
      failed++;
      console.error(`FAILED: ${route} -> status ${res.statusCode} ${res.error || ''}`);
    }
  }
  console.log(`Audit complete: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

run();
