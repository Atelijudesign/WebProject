import { lazy } from "react";

/**
 * Resilient lazy loader for React components.
 * Retries failed dynamic imports and handles stale chunk / deployment mismatches
 * automatically by refreshing the page once per session.
 *
 * @param {() => Promise<{ default: React.ComponentType<any> }>} componentImport
 * @param {number} retriesLeft Number of retries before falling back to reload
 * @param {number} interval Milliseconds between retries
 * @returns {React.LazyExoticComponent<React.ComponentType<any>>}
 */
export function lazyWithRetry(componentImport, retriesLeft = 2, interval = 1000) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      const errorMsg = error?.message || String(error);
      const isDynamicImportError =
        errorMsg.includes("Failed to fetch dynamically imported module") ||
        errorMsg.includes("error loading dynamically imported module") ||
        errorMsg.includes("Importing a module script failed") ||
        errorMsg.includes("failed to load module script");

      if (retriesLeft > 0) {
        await new Promise((resolve) => setTimeout(resolve, interval));
        return lazyWithRetry(componentImport, retriesLeft - 1, interval * 1.5)._payload();
      }

      // If retries are exhausted and it's a chunk/module loading error (e.g. new deploy or cache desync):
      if (isDynamicImportError && typeof window !== "undefined") {
        const lastReloadKey = "app_last_chunk_reload";
        const lastReload = Number(sessionStorage.getItem(lastReloadKey) || 0);
        const now = Date.now();

        // Allow auto-reload once every 15 seconds to prevent reload loops
        if (now - lastReload > 15000) {
          sessionStorage.setItem(lastReloadKey, String(now));
          window.location.reload();
          return new Promise(() => {}); // Keep pending while the page reloads
        }
      }

      throw error;
    }
  });
}
