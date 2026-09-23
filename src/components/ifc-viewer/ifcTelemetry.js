/**
 * Telemetría y analítica ética para el Visor IFC
 * Regla fundamental: CERO datos privados o sensibles del modelo (sin nombres de archivo,
 * sin identificadores de propiedad, sin geometrías). Únicamente eventos anónimos de usabilidad.
 */

const TELEMETRY_STORAGE_KEY = "ifc_telemetry_events_v1";
const MAX_LOCAL_EVENTS = 50;

/**
 * Filtra y sanitiza parámetros de evento para garantizar privacidad absoluta.
 */
const sanitizePayload = (payload = {}) => {
  const sanitized = {};
  for (const [key, val] of Object.entries(payload)) {
    // Bloquear explícitamente cualquier campo potencialmente sensible
    if (
      /filename|filepath|name|text|comment|author|geometry|coord|guid|globalid/i.test(key)
    ) {
      continue;
    }
    if (typeof val === "number" || typeof val === "boolean") {
      sanitized[key] = val;
    } else if (typeof val === "string" && val.length < 64) {
      sanitized[key] = val;
    }
  }
  return sanitized;
};

/**
 * Registra un evento de telemetría anónimo en el buffer local.
 * @param {string} eventName - Nombre del evento (ej: 'ifc_model_loaded', 'ifc_tool_used')
 * @param {object} [properties] - Propiedades agregadas y no identificables
 */
export const trackIfcEvent = (eventName, properties = {}) => {
  if (typeof window === "undefined") return;

  const eventRecord = {
    event: String(eventName),
    timestamp: Date.now(),
    data: sanitizePayload(properties),
  };

  try {
    const raw = localStorage.getItem(TELEMETRY_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const updated = [eventRecord, ...(Array.isArray(existing) ? existing : [])].slice(0, MAX_LOCAL_EVENTS);
    localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Si localStorage está deshabilitado o lleno, continuar silenciosamente
  }
};

/**
 * Obtiene el historial de eventos locales de telemetría para auditoría o diagnóstico.
 */
export const getIfcTelemetryEvents = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TELEMETRY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Limpia el registro local de eventos de telemetría.
 */
export const clearIfcTelemetryEvents = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TELEMETRY_STORAGE_KEY);
  } catch {
    // Silencioso
  }
};
