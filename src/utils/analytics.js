/**
 * analytics.js — Sistema Unificado de Telemetría y Exclusión de Tráfico Interno
 * Andrés Gallo P. · Portfolio & Engineering Tools
 *
 * Características:
 * 1. Zero-Noise: Exclusión automática de tráfico interno (localhost, 127.0.0.1, Vercel Previews).
 * 2. Manual Toggle: Permite marcar cualquier navegador/dispositivo como "Tráfico Interno" (agp_internal_traffic).
 * 3. Dual Engine: Funciona con LocalStorage (privacy-first) y Google Analytics 4 (GA4 / gtag) si está activo.
 * 4. Tipado y Normalización de Eventos Clave (3D, CV ATS, Calculadoras, Manuales).
 */

export const INTERNAL_TRAFFIC_KEY = "agp_internal_traffic";
export const GA_CONSENT_KEY = "agp_analytics_consent";

/**
 * Comprueba si el entorno o navegador actual corresponde a tráfico interno (dueño/desarrollador)
 */
export function isInternalTraffic() {
  if (typeof window === "undefined") return true;

  // 1. Hostname de desarrollo local
  const hostname = window.location.hostname;
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".local") ||
    hostname.includes("vercel.app") // Vercel preview deploys
  ) {
    return true;
  }

  // 2. Cookie o LocalStorage explícito de tráfico interno
  try {
    const isFlagged = window.localStorage.getItem(INTERNAL_TRAFFIC_KEY);
    if (isFlagged === "true") return true;
  } catch {
    // LocalStorage bloqueado
  }

  // 3. Parámetro de URL para activación rápida (?internal_traffic=1)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("internal_traffic") === "1") {
      setInternalTraffic(true);
      return true;
    }
  } catch {
    // Ignorar errores de URL
  }

  return false;
}

/**
 * Activa o desactiva la exclusión de tráfico interno en el dispositivo actual
 * @param {boolean} value
 */
export function setInternalTraffic(value) {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      window.localStorage.setItem(INTERNAL_TRAFFIC_KEY, "true");
      // Desactivar Google Analytics a nivel ventana si GA está configurado
      const gaId = window.GA_MEASUREMENT_ID || import.meta.env?.VITE_GA_ID;
      if (gaId) {
        window[`ga-disable-${gaId}`] = true;
      }
    } else {
      window.localStorage.removeItem(INTERNAL_TRAFFIC_KEY);
      const gaId = window.GA_MEASUREMENT_ID || import.meta.env?.VITE_GA_ID;
      if (gaId) {
        delete window[`ga-disable-${gaId}`];
      }
    }
  } catch {
    // Ignorar si Storage no está disponible
  }
}

/**
 * Alterna el estado de tráfico interno
 * @returns {boolean} nuevo estado
 */
export function toggleInternalTraffic() {
  const current = isInternalTraffic();
  const next = !current;
  setInternalTraffic(next);
  return next;
}

/**
 * Enrutador principal de eventos
 * @param {string} eventName
 * @param {Record<string, any>} params
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return false;

  const internal = isInternalTraffic();

  // Si es tráfico interno, NO enviar a proveedores externos para no ensuciar métricas
  if (internal) {
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.debug(`[Analytics-Internal] Ignorando evento "${eventName}":`, params);
    }
    return false;
  }

  // 1. Envío a Google Analytics 4 si gtag está presente
  if (typeof window.gtag === "function") {
    try {
      window.gtag("event", eventName, {
        ...params,
        traffic_type: "external",
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    } catch (err) {
      // Silenciar errores de analytics
    }
  }

  // 2. Registro local complementario
  try {
    const raw = window.localStorage.getItem("agp_site_events_v1");
    const db = raw ? JSON.parse(raw) : { events: {} };
    db.events[eventName] = {
      count: (db.events[eventName]?.count || 0) + 1,
      lastAt: new Date().toISOString(),
      lastParams: params,
    };
    window.localStorage.setItem("agp_site_events_v1", JSON.stringify(db));
  } catch {
    // Silenciar errores de Storage
  }

  return true;
}

/* ─────────────────────────────────────────────────────────────
 * Eventos Específicos del Sitio y Portafolio
 * ───────────────────────────────────────────────────────────── */

/**
 * Clic en activar el modelo 3D del Hero (evaluación de rendimiento vs engagement)
 */
export function track3DModelActivated() {
  return trackEvent("model3d_activated", {
    category: "3d_viewer",
    model_name: "nave-licuadores",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Descarga de CV en cualquier formato (ATS, PDF, DOCX, TXT, JSON)
 * @param {string} format
 * @param {string} lang
 */
export function trackCvDownload(format, lang = "es") {
  return trackEvent("cv_download", {
    category: "career_leads",
    format,
    language: lang,
  });
}

/**
 * Interacción o cálculo en herramientas de ingeniería (ICHA, AISC, Escalera, GeoCalc)
 * @param {string} toolName
 * @param {string} action
 */
export function trackToolInteraction(toolName, action = "calculate") {
  return trackEvent("tool_interaction", {
    category: "engineering_tools",
    tool: toolName,
    action,
  });
}

/**
 * Solicitud de acceso o descarga del Manual de SmartPlant 3D
 * @param {string} source
 */
export function trackManualRequest(source = "sp3d_manual_post") {
  return trackEvent("manual_requested", {
    category: "lead_generation",
    manual_id: "smartplant-3d",
    source,
  });
}

/**
 * Clic a enlace externo de redes profesionales
 * @param {string} platform
 * @param {string} targetUrl
 */
export function trackSocialClick(platform, targetUrl) {
  return trackEvent("social_outbound_click", {
    category: "social_outbound",
    platform,
    target_url: targetUrl,
  });
}
