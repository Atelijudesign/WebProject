import fs from 'fs';
import path from 'path';

const appContent = fs.readFileSync('src/App.jsx', 'utf-8');
const routeMatches = [...appContent.matchAll(/path=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Registered routes in App.jsx:', routeMatches.length);

const allFiles = [];
function findFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') findFiles(p);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts')) {
      allFiles.push(p);
    }
  });
}
findFiles('src');

const brokenLinks = new Set();
const routeSet = new Set(routeMatches);

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const linkMatches = [...content.matchAll(/to=["']([^"'#?]+)["']/g)].map(m => m[1]);
  linkMatches.forEach(target => {
    if (!target.startsWith('http') && target.startsWith('/')) {
      // Check if matches a route or a dynamic route
      const directMatch = routeSet.has(target);
      const dynamicMatch = [...routeSet].some(r => {
        if (!r.includes(':')) return false;
        const regex = new RegExp('^' + r.replace(/:[^/]+/g, '[^/]+') + '$');
        return regex.test(target);
      });
      if (!directMatch && !dynamicMatch && target !== '/') {
        brokenLinks.add(`${target} (in ${path.basename(f)})`);
      }
    }
  });
});

console.log('Unmatched internal links count:', brokenLinks.size);
brokenLinks.forEach(l => console.log('  ->', l));
