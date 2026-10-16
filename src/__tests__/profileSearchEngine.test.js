import { describe, it, expect } from 'vitest';
import { ProfileSearchEngine } from '../core/calculators/ProfileSearchEngine';

describe('ProfileSearchEngine - Indexing and Multi-Criteria Filtering (Fase 3)', () => {
  const sampleProfiles = [
    {
      designation: 'W14X90',
      metricDesignation: 'W360X134',
      type: 'W',
      W_lb: 90,
      W_kg: 134,
      Ix_in4: 999,
      Ix_cm4: 41600,
      d_in: 14.0,
      d_mm: 356,
    },
    {
      designation: 'W12X53',
      metricDesignation: 'W310X79',
      type: 'W',
      W_lb: 53,
      W_kg: 79,
      Ix_in4: 425,
      Ix_cm4: 17700,
      d_in: 12.1,
      d_mm: 307,
    },
    {
      designation: 'C10X30',
      metricDesignation: 'C250X45',
      type: 'C',
      W_lb: 30,
      W_kg: 45,
      Ix_in4: 103,
      Ix_cm4: 4290,
      d_in: 10.0,
      d_mm: 254,
    },
  ];

  it('normaliza queries eliminando espacios y convirtiendo a minúsculas', () => {
    expect(ProfileSearchEngine.normalizeQuery('  W 14 x 90  ')).toBe('w14x90');
    expect(ProfileSearchEngine.normalizeQuery('')).toBe('');
  });

  it('encuentra perfiles tanto por designación imperial como métrica', () => {
    const resImp = ProfileSearchEngine.filterProfiles(sampleProfiles, {
      searchQuery: 'w14',
    });
    expect(resImp).toHaveLength(1);
    expect(resImp[0].designation).toBe('W14X90');

    const resMet = ProfileSearchEngine.filterProfiles(sampleProfiles, {
      searchQuery: 'w310',
    });
    expect(resMet).toHaveLength(1);
    expect(resMet[0].designation).toBe('W12X53');
  });

  it('filtra por inercia mínima en sistema métrico e imperial', () => {
    // Imperial: minIx = 500 in^4 -> solo W14X90 (999 in^4)
    const resImp = ProfileSearchEngine.filterProfiles(sampleProfiles, {
      unitSys: 'imperial',
      minIx: 500,
    });
    expect(resImp).toHaveLength(1);
    expect(resImp[0].designation).toBe('W14X90');

    // Métrico: minIx = 10000 cm^4 -> W14X90 y W12X53
    const resMet = ProfileSearchEngine.filterProfiles(sampleProfiles, {
      unitSys: 'metric',
      minIx: 10000,
    });
    expect(resMet).toHaveLength(2);
  });

  it('filtra por rango de peso y altura máxima', () => {
    // Rango de peso métrico: entre 70 y 100 kg/m -> solo W12X53 (79 kg/m)
    const resWeight = ProfileSearchEngine.filterProfiles(sampleProfiles, {
      unitSys: 'metric',
      minWeight: 70,
      maxWeight: 100,
    });
    expect(resWeight).toHaveLength(1);
    expect(resWeight[0].designation).toBe('W12X53');

    // Altura máxima: d <= 320 mm -> W12X53 y C10X30
    const resDepth = ProfileSearchEngine.filterProfiles(sampleProfiles, {
      unitSys: 'metric',
      maxDepth: 320,
    });
    expect(resDepth).toHaveLength(2);
  });

  it('retorna arreglo vacío si la lista de entrada está vacía', () => {
    const res = ProfileSearchEngine.filterProfiles([], { searchQuery: 'w14' });
    expect(res).toEqual([]);
  });
});
