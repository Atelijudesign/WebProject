/**
 * asset – Resuelve rutas de archivos estáticos respetando el `base` de Vite.
 *
 * La app puede publicarse en la raíz del dominio (Vercel / `atelijudesign.com`,
 * dev local) o bajo una subcarpeta (GitHub Pages en `/WebProject/`). Cualquier
 * referencia a un archivo de `public/` debe pasar por esta función para que
 * funcione en ambos entornos.
 *
 * @param {string} path Ruta tipo "/assets/img/portada.webp" o "assets/img/portada.webp"
 * @returns {string} Ruta prefijada con el base de Vite. Es idempotente y
 *                   devuelve tal cual las URL absolutas (http/https/data/blob).
 */
export function asset(path) {
  if (!path) return path;
  if (/^(?:https?:|data:|blob:|\/\/)/i.test(path)) return path;

  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.replace(/\/+$/, ""); // "" en raíz, "/WebProject" en Pages
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Evita prefijos dobles si el valor ya fue procesado con asset()
  if (normalizedBase && normalizedPath.startsWith(`${normalizedBase}/`)) {
    return normalizedPath;
  }

  return `${normalizedBase}${normalizedPath}`;
}
