import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCvBuilderState } from '../core/cv/useCvBuilderState';

describe('useCvBuilderState - Decoupled CV Builder Hook (Fase 4)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('inicializa con estado de CV válido y métricas calculadas', () => {
    const { result } = renderHook(() => useCvBuilderState());

    expect(result.current.cv).toBeDefined();
    expect(result.current.canUndo).toBe(false);
    expect(result.current.isDemo).toBe(false);
    expect(result.current.analysis).toBeDefined();
    expect(result.current.progress).toBeDefined();
    expect(result.current.assistant).toBeDefined();
  });

  it('permite actualizar campos del CV y registra el historial para deshacer (undo)', () => {
    const { result } = renderHook(() => useCvBuilderState());

    act(() => {
      result.current.updateCv((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          name: 'Ing. Carlos Mendoza',
        },
      }));
    });

    expect(result.current.cv.personal.name).toBe('Ing. Carlos Mendoza');
    expect(result.current.canUndo).toBe(true);

    // Ejecutar deshacer
    act(() => {
      result.current.undo();
    });

    expect(result.current.cv.personal.name).not.toBe('Ing. Carlos Mendoza');
    expect(result.current.canUndo).toBe(false);
  });

  it('conmuta entre modo demo de ejemplo y borrador', () => {
    const { result } = renderHook(() => useCvBuilderState());

    act(() => {
      result.current.toggleDemo();
    });

    expect(result.current.isDemo).toBe(true);
    expect(result.current.cv.personal.name).toBe('Valentina Rojas Méndez');

    act(() => {
      result.current.toggleDemo();
    });

    expect(result.current.isDemo).toBe(false);
  });

  it('permite cambiar el paso activo de navegación', () => {
    const { result } = renderHook(() => useCvBuilderState());

    act(() => {
      result.current.setActiveStep('experience');
    });

    expect(result.current.activeStep).toBe('experience');
  });
});
