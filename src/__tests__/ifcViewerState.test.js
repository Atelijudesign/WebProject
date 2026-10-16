import { describe, it, expect } from 'vitest';
import {
  ifcViewerReducer,
  initialIfcViewerState,
} from '../core/ifc/ifcViewerState';

describe('IfcViewer State Architecture - Reducer & State Machine (Fase 4)', () => {
  it('inicializa con el estado por defecto esperado', () => {
    expect(initialIfcViewerState.ui.isShortcutsModalOpen).toBe(false);
    expect(initialIfcViewerState.tools.activeMode).toBe('select');
    expect(initialIfcViewerState.tools.renderStyle).toBe('shaded');
    expect(initialIfcViewerState.model.isLoading).toBe(false);
    expect(initialIfcViewerState.model.hasLoadedModel).toBe(false);
  });

  describe('Gestión de Modales', () => {
    it('abre el modal solicitado y garantiza exclusión mutua de otros modales', () => {
      const state1 = ifcViewerReducer(initialIfcViewerState, {
        type: 'OPEN_MODAL',
        payload: { modal: 'quantities', initialTab: 'comparison' },
      });

      expect(state1.ui.isQuantitiesModalOpen).toBe(true);
      expect(state1.ui.quantitiesInitialTab).toBe('comparison');
      expect(state1.ui.isShortcutsModalOpen).toBe(false);
      expect(state1.ui.isMemoryModalOpen).toBe(false);

      // Abrir otro modal cierra el anterior
      const state2 = ifcViewerReducer(state1, {
        type: 'OPEN_MODAL',
        payload: { modal: 'memory' },
      });

      expect(state2.ui.isQuantitiesModalOpen).toBe(false);
      expect(state2.ui.isMemoryModalOpen).toBe(true);
    });

    it('cierra un modal específico con CLOSE_MODAL', () => {
      const openState = ifcViewerReducer(initialIfcViewerState, {
        type: 'OPEN_MODAL',
        payload: { modal: 'shortcuts' },
      });
      expect(openState.ui.isShortcutsModalOpen).toBe(true);

      const closedState = ifcViewerReducer(openState, {
        type: 'CLOSE_MODAL',
        payload: { modal: 'shortcuts' },
      });
      expect(closedState.ui.isShortcutsModalOpen).toBe(false);
    });

    it('cierra todos los modales con CLOSE_ALL_MODALS', () => {
      const openState = ifcViewerReducer(initialIfcViewerState, {
        type: 'OPEN_MODAL',
        payload: { modal: 'export' },
      });

      const resetState = ifcViewerReducer(openState, { type: 'CLOSE_ALL_MODALS' });
      expect(resetState.ui.isExportModalOpen).toBe(false);
      expect(resetState.ui.isMemoryModalOpen).toBe(false);
    });
  });

  describe('Herramientas 3D y Modos de Interacción', () => {
    it('cambia el modo activo de herramienta y el estilo de renderizado', () => {
      const modeState = ifcViewerReducer(initialIfcViewerState, {
        type: 'SET_ACTIVE_MODE',
        payload: 'measure-distance',
      });
      expect(modeState.tools.activeMode).toBe('measure-distance');

      const wireframeState = ifcViewerReducer(modeState, {
        type: 'SET_RENDER_STYLE',
        payload: 'wireframe',
      });
      expect(wireframeState.tools.renderStyle).toBe('wireframe');
    });

    it('gestiona elementos ocultos con HIDE_ELEMENT y UNHIDE_ELEMENT inmutablemente', () => {
      const hidden1 = ifcViewerReducer(initialIfcViewerState, {
        type: 'HIDE_ELEMENT',
        payload: 1052,
      });
      expect(hidden1.tools.hiddenExpressIds.has(1052)).toBe(true);

      const hidden2 = ifcViewerReducer(hidden1, {
        type: 'HIDE_ELEMENT',
        payload: 2048,
      });
      expect(hidden2.tools.hiddenExpressIds.has(1052)).toBe(true);
      expect(hidden2.tools.hiddenExpressIds.has(2048)).toBe(true);

      const unhidden = ifcViewerReducer(hidden2, {
        type: 'UNHIDE_ELEMENT',
        payload: 1052,
      });
      expect(unhidden.tools.hiddenExpressIds.has(1052)).toBe(false);
      expect(unhidden.tools.hiddenExpressIds.has(2048)).toBe(true);

      const cleared = ifcViewerReducer(unhidden, { type: 'CLEAR_HIDDEN_ELEMENTS' });
      expect(cleared.tools.hiddenExpressIds.size).toBe(0);
    });
  });

  describe('Ciclo de Vida de Carga de Modelo', () => {
    it('transiciona correctamente entre estados de carga, progreso y éxito', () => {
      const startState = ifcViewerReducer(initialIfcViewerState, {
        type: 'START_MODEL_LOAD',
        payload: { modelName: 'Estructura_Galpon.ifc' },
      });
      expect(startState.model.isLoading).toBe(true);
      expect(startState.model.modelName).toBe('Estructura_Galpon.ifc');

      const progressState = ifcViewerReducer(startState, {
        type: 'UPDATE_LOAD_PROGRESS',
        payload: { phase: 'Parseando geometría IFC', percent: 60 },
      });
      expect(progressState.model.loadingProgress.percent).toBe(60);

      const finishState = ifcViewerReducer(progressState, {
        type: 'FINISH_MODEL_LOAD',
      });
      expect(finishState.model.isLoading).toBe(false);
      expect(finishState.model.hasLoadedModel).toBe(true);
      expect(finishState.model.loadingProgress.percent).toBe(100);
    });

    it('registra fallo de carga con FAIL_MODEL_LOAD', () => {
      const failState = ifcViewerReducer(initialIfcViewerState, {
        type: 'FAIL_MODEL_LOAD',
        payload: { errorMessage: 'Archivo IFC corrupto o no soportado' },
      });
      expect(failState.model.isLoading).toBe(false);
      expect(failState.model.hasLoadedModel).toBe(false);
      expect(failState.model.errorMessage).toBe('Archivo IFC corrupto o no soportado');
    });
  });
});
