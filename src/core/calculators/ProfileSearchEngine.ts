/**
 * ProfileSearchEngine - Motor de indexación y filtrado de alto rendimiento
 * para catálogos estructurales masivos (AISC / ICHA).
 * Desacoplado de React para ejecución síncrona o dentro de Web Workers.
 */

export interface ProfileSearchItem {
  readonly designation: string;
  readonly metricDesignation?: string;
  readonly type?: string;
  readonly W_lb?: number;
  readonly W_kg?: number;
  readonly Ix_in4?: number;
  readonly Ix_cm4?: number;
  readonly d_in?: number;
  readonly d_mm?: number;
  readonly OD_in?: number;
  readonly OD_mm?: number;
  readonly [key: string]: unknown;
}

export interface ProfileFilterCriteria {
  readonly searchQuery?: string;
  readonly unitSys?: 'imperial' | 'metric';
  readonly minIx?: number;
  readonly minWeight?: number;
  readonly maxWeight?: number;
  readonly maxDepth?: number;
}

export class ProfileSearchEngine {
  /**
   * Normaliza una cadena de texto para búsqueda insensible a espacios y mayúsculas.
   */
  public static normalizeQuery(text: string): string {
    if (!text) {
      return '';
    }
    return text.toLowerCase().replace(/\s+/g, '');
  }

  /**
   * Comprueba si un perfil coincide con la consulta de texto ingresada.
   */
  public static matchesQuery(profile: ProfileSearchItem, normalizedQuery: string): boolean {
    if (!normalizedQuery) {
      return true;
    }

    const impDesig = this.normalizeQuery(profile.designation);
    if (impDesig.includes(normalizedQuery)) {
      return true;
    }

    const metDesig = this.normalizeQuery(profile.metricDesignation || '');
    return metDesig.includes(normalizedQuery);
  }

  /**
   * Aplica filtros multi-criterio de ingeniería (inercia, peso, peralte/altura).
   */
  public static filterProfiles(
    profiles: readonly ProfileSearchItem[],
    criteria: ProfileFilterCriteria
  ): ProfileSearchItem[] {
    if (!profiles || profiles.length === 0) {
      return [];
    }

    const isImperial = criteria.unitSys === 'imperial';
    const normalizedQuery = this.normalizeQuery(criteria.searchQuery || '');
    const minIx = criteria.minIx || 0;
    const minWeight = criteria.minWeight || 0;
    const maxWeight = criteria.maxWeight !== undefined && !isNaN(criteria.maxWeight)
      ? criteria.maxWeight
      : Infinity;
    const maxDepth = criteria.maxDepth !== undefined && !isNaN(criteria.maxDepth)
      ? criteria.maxDepth
      : Infinity;

    const matchedProfiles: ProfileSearchItem[] = [];

    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];

      // 1. Coincidencia de búsqueda textual
      if (!this.matchesQuery(profile, normalizedQuery)) {
        continue;
      }

      // 2. Extracción de valores según sistema de unidades
      const weight = isImperial ? (profile.W_lb || 0) : (profile.W_kg || 0);
      const ix = isImperial ? (profile.Ix_in4 || 0) : (profile.Ix_cm4 || 0);
      const depth = isImperial
        ? (profile.d_in || profile.OD_in || 0)
        : (profile.d_mm || profile.OD_mm || 0);

      // 3. Verificación de inercia mínima
      if (ix < minIx) {
        continue;
      }

      // 4. Verificación de rango de peso
      if (weight < minWeight || weight > maxWeight) {
        continue;
      }

      // 5. Verificación de peralte máximo
      if (depth > maxDepth) {
        continue;
      }

      matchedProfiles.push(profile);
    }

    return matchedProfiles;
  }
}
