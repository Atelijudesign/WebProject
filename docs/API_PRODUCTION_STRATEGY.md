# 🚀 Estrategia de API en Producción

Este documento detalla la arquitectura de separación entre el servidor local de desarrollo (`server.js`) y las funciones serverless de producción para el proyecto **WebProject**.

---

## 🛠️ Contexto Actual

Actualmente en entorno local de desarrollo:
- `vite.config.js` inicia un servidor Node.js secundario (`server.js`) en `http://localhost:3001` mediante el hook `configureServer`.
- Permite operaciones CRUD locales en SQLite/JSON para el panel de administración (`/admin`).

---

## 🌐 Estrategia de Producción

En entornos de producción (Vercel / Netlify / Supabase Cloud):

### Opción Recomendada: **Vercel Serverless Functions (`/api/*`)**
1. **Ubicación de endpoints**: Crear la carpeta `api/` en la raíz del proyecto.
2. **Endpoints clave**:
   - `api/projects.js`: Devuelve el catálogo de proyectos desde Supabase o JSON estático.
   - `api/analytics.js`: Recibe métricas de uso de herramientas estructurales.
3. **Ventajas**:
   - Despliegue automático con cada push a `main`.
   - Cero mantenimiento de infraestructura de servidores.
   - Soporte nativo para variables de entorno secretas (`SUPABASE_SERVICE_ROLE_KEY`).

### Opción Alternativa: **Supabase Edge Functions (Deno / TS)**
1. Configurar Supabase CLI (`supabase functions new projects`).
2. Desplegar funciones TypeScript con latencia ultra-baja en la red global de Deno.
3. Configurar la variable de entorno en producción:
   `VITE_API_URL=https://<your-project>.supabase.co/functions/v1`

---

## 🔌 Uso en el Código Frontend

Toda interacción con la API en el frontend debe realizarse mediante el módulo unificado `src/utils/apiClient.ts`:

```typescript
import { fetchApi } from "./utils/apiClient";

// Automáticamente usará http://localhost:3001/api/projects en dev
// y /api/projects o Supabase Edge Functions en producción.
const projects = await fetchApi<{ value: Project[] }>("/projects");
```
