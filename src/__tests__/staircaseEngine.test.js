import { describe, it, expect } from 'vitest';
import { StaircaseEngine } from '../core/calculators/StaircaseEngine';

describe('StaircaseEngine - Pure Domain Calculation Engine (Fase 3)', () => {
  describe('calculateTotalHeight', () => {
    it('calcula la altura en milímetros para Tipo 1 (TA con espesores)', () => {
      // (6.000 + 0.030) - (3.000 + 0.030) = 3.000m -> 3000mm
      const h = StaircaseEngine.calculateTotalHeight({
        tipoConnection: 'tipo1',
        t1Ta1: 6.0,
        t1Esp1: 30,
        t1Ta2: 3.0,
        t1Esp2: 30,
      });
      expect(h).toBe(3000);
    });

    it('calcula la altura en milímetros para Tipo 2 (TC directo)', () => {
      // 5.500 - 2.500 = 3.000m -> 3000mm
      const h = StaircaseEngine.calculateTotalHeight({
        tipoConnection: 'tipo2',
        t2TcSup: 5.5,
        t2TcInf: 2.5,
      });
      expect(h).toBe(3000);
    });

    it('calcula la altura en milímetros para Tipo 3 (TA superior + TC inferior)', () => {
      // (6.000 + 0.030) - 3.000 = 3.030m -> 3030mm
      const h = StaircaseEngine.calculateTotalHeight({
        tipoConnection: 'tipo3',
        t3Ta: 6.0,
        t3Esp: 30,
        t3Tc: 3.0,
      });
      expect(h).toBe(3030);
    });
  });

  describe('evaluateSlope', () => {
    it('clasifica pendientes según la tabla oficial de la Lámina 5', () => {
      expect(StaircaseEngine.evaluateSlope(24.5)).toBe('Inclinación Baja');
      expect(StaircaseEngine.evaluateSlope(31.5)).toBe('Recomendable ⭐ (Estándar)');
      expect(StaircaseEngine.evaluateSlope(35.0)).toBe('Recomendable ⭐');
      expect(StaircaseEngine.evaluateSlope(42.0)).toBe('Inclinación Alta');
      expect(StaircaseEngine.evaluateSlope(47.0)).toBe('Crítico');
    });
  });

  describe('analyze', () => {
    it('analiza exhaustivamente la geometría, ergonomía y BOM de una escalera C250', () => {
      const output = StaircaseEngine.analyze(
        {
          tipoConnection: 'tipo2',
          t2TcSup: 5.8,
          t2TcInf: 3.0,
        },
        {
          targetContrahuella: 175,
          huella: 280,
          anchoTramo: 1000,
        }
      );

      // H = 2800 mm
      expect(output.alturaTotal).toBe(2800);
      // n = round(2800 / 175) = 16 peldaños
      expect(output.numeroPeldanos).toBe(16);
      expect(output.contrahuellaCalculada).toBe(175);
      expect(output.longitudMedia).toBe(16 * 280);

      // Ergonomía Blondel: 2 * 175 + 280 = 630 mm (Óptimo)
      expect(output.blondel).toBe(630);
      expect(output.ergonomia.isBlondelCompliant).toBe(true);
      expect(output.seguridad).toBe(455);
      expect(output.galiboMinimoMm).toBe(2200);

      // Verificación de descanso (H = 2800 <= 3000 y n = 16 <= 16 -> false)
      expect(output.requiereDescanso).toBe(false);

      // Verificación de lista de materiales BOM
      expect(parseFloat(output.bom.longitudDiagonalM)).toBeGreaterThan(4.0);
      expect(parseFloat(output.bom.pesoLimonesKg)).toBeGreaterThan(150);
      expect(parseFloat(output.bom.pesoPeldañosKg)).toBeGreaterThan(100);
      expect(output.bom.pernosAnclaje).toBe(16 * 4 + 8);
    });

    it('activa bandera de descanso obligatorio cuando H supera 3000 mm', () => {
      const output = StaircaseEngine.analyze(
        {
          tipoConnection: 'tipo2',
          t2TcSup: 6.5,
          t2TcInf: 3.0,
        },
        {
          targetContrahuella: 175,
          huella: 280,
          anchoTramo: 900,
        }
      );

      expect(output.alturaTotal).toBe(3500);
      expect(output.requiereDescanso).toBe(true);
    });
  });
});
