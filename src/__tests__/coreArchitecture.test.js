import { describe, it, expect } from 'vitest';
import * as Core from '../core';

describe('Core Architecture - Master Barrel & Domain Integrity (Fase 5)', () => {
  it('expone el subsistema de exportación y sus estrategias unificadas', () => {
    expect(Core.ExportService).toBeDefined();
    expect(typeof Core.ExportService.executeExport).toBe('function');
    expect(typeof Core.ExportService.triggerDownload).toBe('function');

    expect(Core.DxfStaircaseStrategy).toBeDefined();
    expect(Core.PdfTakeoffStrategy).toBeDefined();
    expect(Core.ExcelTakeoffStrategy).toBeDefined();
  });

  it('expone los motores de cálculo de dominio independientes', () => {
    expect(Core.StaircaseEngine).toBeDefined();
    expect(typeof Core.StaircaseEngine.analyze).toBe('function');
    expect(typeof Core.StaircaseEngine.calculateTotalHeight).toBe('function');
    expect(typeof Core.StaircaseEngine.evaluateSlope).toBe('function');

    expect(Core.ProfileSearchEngine).toBeDefined();
    expect(typeof Core.ProfileSearchEngine.filterProfiles).toBe('function');
    expect(typeof Core.ProfileSearchEngine.normalizeQuery).toBe('function');
  });

  it('expone la máquina de estados y reducers del visor IFC', () => {
    expect(Core.ifcViewerReducer).toBeDefined();
    expect(typeof Core.ifcViewerReducer).toBe('function');
    expect(Core.initialIfcViewerState).toBeDefined();
    expect(Core.useIfcViewerState).toBeDefined();
    expect(typeof Core.useIfcViewerState).toBe('function');
  });

  it('expone el gestor de estado desacoplado de CV ATS', () => {
    expect(Core.useCvBuilderState).toBeDefined();
    expect(typeof Core.useCvBuilderState).toBe('function');
  });
});
