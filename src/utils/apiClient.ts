/**
 * API Client para conmutar transparentemente entre el servidor local de desarrollo (server.js)
 * y la infraestructura de API de producción (Supabase Edge Functions o Vercel Serverless Functions).
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? "http://localhost:3001/api" : "/api");

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Request Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch API error on ${url}:`, error);
    throw error;
  }
}
