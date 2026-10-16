import { describe, it, expect, vi } from 'vitest';
import {
  ExportService,
  DxfStaircaseStrategy,
  PdfTakeoffStrategy,
  ExcelTakeoffStrategy,
} from '../core/export';

describe('Export Architecture - Strategy Pattern (Fase 2)', () => {
  describe('DxfStaircaseStrategy', () => {
    const samplePayload = {
      results: {
        numeroPeldanos: 12,
        contrahuellaCalculada: 175,
        alturaTotal: 2100,
        longitudMedia: 3360,
      },
      huella: 280,
      anchoTramo: 1000,
    };

    it('genera un archivo DXF ASCII con estructura de capas oficial para AutoCAD', () => {
      const strategy = new DxfStaircaseStrategy();
      const dxfContent = strategy.generateDxfString(samplePayload);

      // Verificación de secciones y tablas DXF
      expect(dxfContent).toContain('SECTION\n2\nHEADER');
      expect(dxfContent).toContain('SECTION\n2\nTABLES');
      expect(dxfContent).toContain('TABLE\n2\nLAYER');

      // Verificación de capas normativas de ingeniería
      expect(dxfContent).toContain('ESTRUCTURA_C250');
      expect(dxfContent).toContain('PELDANOS_GRATING');
      expect(dxfContent).toContain('BARANDAS_SCH40');
      expect(dxfContent).toContain('PUNTOS_TRABAJO');
      expect(dxfContent).toContain('COTAS_Y_TEXTO');

      // Verificación de entidades geométricas
      expect(dxfContent).toContain('LINE\n8\nPELDANOS_GRATING');
      expect(dxfContent).toContain('LINE\n8\nESTRUCTURA_C250');
      expect(dxfContent).toContain('LINE\n8\nBARANDAS_SCH40');
      expect(dxfContent).toContain('POINT\n8\nPUNTOS_TRABAJO');

      // Verificación de pie de archivo
      expect(dxfContent).toContain('ENDSEC\n0\nEOF');
    });

    it('genera exactamente las coordenadas correctas del canal C250 y barandas SCH40', () => {
      const strategy = new DxfStaircaseStrategy();
      const dxfContent = strategy.generateDxfString(samplePayload);

      // El limón inferior a -250mm de canal
      expect(dxfContent).toContain('20\n-250.0');
      // Baranda superior a +1200mm
      expect(dxfContent).toContain('20\n1200.0');
      // Baranda intermedia a +800mm
      expect(dxfContent).toContain('20\n800.0');
      // Rodapié a +400mm
      expect(dxfContent).toContain('20\n400.0');
      // Punto de trabajo superior (L, H)
      expect(dxfContent).toContain('10\n3360\n20\n2100');
    });

    it('resuelve el nombre de archivo con formato estándar', () => {
      const strategy = new DxfStaircaseStrategy();
      const filename = strategy.resolveFilename(samplePayload);
      expect(filename).toBe('Escalera_Estructural_C250_2100mm.dxf');

      const customFilename = strategy.resolveFilename({
        ...samplePayload,
        filename: 'Mi_Escalera_Proyecto',
      });
      expect(customFilename).toBe('Mi_Escalera_Proyecto.dxf');
    });

    it('retorna error con early return si los peldaños son menores o iguales a cero', () => {
      const strategy = new DxfStaircaseStrategy();
      const invalidPayload = {
        results: {
          numeroPeldanos: 0,
          contrahuellaCalculada: 0,
          alturaTotal: 0,
          longitudMedia: 0,
        },
        huella: 280,
      };

      const result = strategy.export(invalidPayload);
      expect(result.isSuccess).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('ejecuta export exitoso disparando triggerDownload', () => {
      const strategy = new DxfStaircaseStrategy();
      const triggerSpy = vi.spyOn(ExportService, 'triggerDownload').mockImplementation(() => {});

      const result = strategy.export(samplePayload);
      expect(result.isSuccess).toBe(true);
      expect(result.filename).toBe('Escalera_Estructural_C250_2100mm.dxf');
      expect(triggerSpy).toHaveBeenCalledTimes(1);

      triggerSpy.mockRestore();
    });
  });

  describe('ExportService', () => {
    it('retorna error estructurado si se invoca sin estrategia', async () => {
      // @ts-expect-error probando valor nulo intencional
      const result = await ExportService.executeExport(null, {});
      expect(result.isSuccess).toBe(false);
      expect(result.error).toContain('No se suministró una estrategia');
    });

    it('captura excepciones y retorna error estructurado sin romper la aplicación', async () => {
      const faultyStrategy = {
        id: 'faulty',
        format: 'json',
        mimeType: 'application/json',
        export: () => {
          throw new Error('Fallo simulado en generación');
        },
      };

      // @ts-expect-error estrategia simulada
      const result = await ExportService.executeExport(faultyStrategy, {});
      expect(result.isSuccess).toBe(false);
      expect(result.error).toBe('Fallo simulado en generación');
    });

    it('ejecuta exitosamente una estrategia asíncrona', async () => {
      const mockStrategy = {
        id: 'mock-test',
        format: 'json',
        mimeType: 'application/json',
        export: vi.fn().mockResolvedValue({
          isSuccess: true,
          filename: 'reporte.json',
        }),
      };

      // @ts-expect-error estrategia simulada
      const result = await ExportService.executeExport(mockStrategy, { test: 123 });
      expect(result.isSuccess).toBe(true);
      expect(result.filename).toBe('reporte.json');
      expect(mockStrategy.export).toHaveBeenCalledWith({ test: 123 });
    });
  });

  describe('PdfTakeoffStrategy & ExcelTakeoffStrategy Validations', () => {
    it('PdfTakeoffStrategy rechaza tempranamente si no hay filas', () => {
      const pdfStrategy = new PdfTakeoffStrategy();
      const result = pdfStrategy.export({
        headers: ['Col1', 'Col2'],
        rows: [],
        summary: { subtotal: 0, grandTotal: 0 },
      });

      expect(result.isSuccess).toBe(false);
      expect(result.error).toContain('No hay perfiles');
    });

    it('ExcelTakeoffStrategy rechaza tempranamente si no hay datos', async () => {
      const excelStrategy = new ExcelTakeoffStrategy();
      const result = await excelStrategy.export({
        columns: [{ header: 'Col1', key: 'col1' }],
        data: [],
        summary: { subtotal: 0, grandTotal: 0 },
      });

      expect(result.isSuccess).toBe(false);
      expect(result.error).toContain('No hay datos');
    });
  });
});
