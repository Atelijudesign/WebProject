const CACHE_DB_NAME = "ifc-fragments-cache";
const CACHE_STORE_NAME = "models";
const CACHE_DB_VERSION = 1;
const CACHE_FORMAT_VERSION = "fragments-3.4.7-webifc-0.0.77-v1";
const MAX_CACHE_ENTRIES = 3;
const SAMPLE_SIZE = 64 * 1024;

const openCacheDatabase = () => new Promise((resolve, reject) => {
  if (typeof indexedDB === "undefined") {
    reject(new Error("IndexedDB no está disponible"));
    return;
  }

  const request = indexedDB.open(CACHE_DB_NAME, CACHE_DB_VERSION);
  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains(CACHE_STORE_NAME)) {
      database.createObjectStore(CACHE_STORE_NAME, { keyPath: "key" });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error("No se pudo abrir la caché IFC"));
});

const runTransaction = async (mode, operation) => {
  const database = await openCacheDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(CACHE_STORE_NAME, mode);
      const store = transaction.objectStore(CACHE_STORE_NAME);
      let result;
      try {
        result = operation(store);
      } catch (error) {
        reject(error);
        return;
      }
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error || new Error("Falló la operación de caché IFC"));
      transaction.onabort = () => reject(transaction.error || new Error("Se canceló la operación de caché IFC"));
    });
  } finally {
    database.close();
  }
};

const requestResult = (request) => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const toHex = (buffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");

export const buildIfcCacheKey = ({ name, size, lastModified, digest }) =>
  `${CACHE_FORMAT_VERSION}:${name}:${size}:${lastModified}:${digest}`;

export const createIfcFingerprint = async (file) => {
  const head = await file.slice(0, SAMPLE_SIZE).arrayBuffer();
  const tailStart = Math.max(0, file.size - SAMPLE_SIZE);
  const tail = await file.slice(tailStart, file.size).arrayBuffer();
  const metadata = new TextEncoder().encode(`${file.name}:${file.size}:${file.lastModified}`);
  const sample = new Uint8Array(metadata.byteLength + head.byteLength + tail.byteLength);
  sample.set(metadata, 0);
  sample.set(new Uint8Array(head), metadata.byteLength);
  sample.set(new Uint8Array(tail), metadata.byteLength + head.byteLength);
  const digest = await crypto.subtle.digest("SHA-256", sample);
  return buildIfcCacheKey({ name: file.name, size: file.size, lastModified: file.lastModified, digest: toHex(digest) });
};

export const getCachedFragments = async (key) => {
  if (!key) return null;
  try {
    return await runTransaction("readonly", (store) => requestResult(store.get(key)));
  } catch {
    return null;
  }
};

export const putCachedFragments = async ({ key, name, size, lastModified, buffer }) => {
  if (!key || !buffer) return false;
  try {
    const records = await runTransaction("readonly", (store) => requestResult(store.getAll()));
    const oldest = records
      .filter((record) => record.key !== key)
      .sort((left, right) => left.updatedAt - right.updatedAt)
      .slice(0, Math.max(0, records.length - MAX_CACHE_ENTRIES + 1));

    await runTransaction("readwrite", (store) => {
      oldest.forEach((record) => store.delete(record.key));
      store.put({ key, name, size, lastModified, updatedAt: Date.now(), buffer });
    });
    return true;
  } catch (error) {
    console.warn("No se pudo guardar la caché IFC:", error);
    return false;
  }
};

export const clearIfcCache = async () => {
  try {
    await runTransaction("readwrite", (store) => store.clear());
    return true;
  } catch {
    return false;
  }
};

export const deleteCachedModel = async (key) => {
  if (!key) return false;
  try {
    await runTransaction("readwrite", (store) => store.delete(key));
    return true;
  } catch {
    return false;
  }
};

export const listCachedModels = async () => {
  try {
    const records = await runTransaction("readonly", (store) => requestResult(store.getAll()));
    return records.map((rec) => ({
      key: rec.key,
      name: rec.name || "Modelo IFC",
      size: rec.size || (rec.buffer ? rec.buffer.byteLength : 0),
      sizeMB: ((rec.size || (rec.buffer ? rec.buffer.byteLength : 0)) / (1024 * 1024)).toFixed(1),
      updatedAt: rec.updatedAt || Date.now(),
      formattedDate: new Date(rec.updatedAt || Date.now()).toLocaleDateString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  } catch {
    return [];
  }
};

export const getStorageEstimate = async () => {
  if (typeof navigator !== "undefined" && navigator.storage && typeof navigator.storage.estimate === "function") {
    try {
      const estimate = await navigator.storage.estimate();
      const usageMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
      const quotaMB = ((estimate.quota || 0) / (1024 * 1024)).toFixed(0);
      const percent = estimate.quota ? Math.round(((estimate.usage || 0) / estimate.quota) * 100) : 0;
      return {
        usageMB,
        quotaMB,
        percent,
        isSupported: true,
      };
    } catch {
      // Fallback
    }
  }
  return {
    usageMB: "—",
    quotaMB: "—",
    percent: 0,
    isSupported: false,
  };
};
