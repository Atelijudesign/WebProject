/**
 * StaircaseEngine - Motor de Cálculo Estructural y Ergonómico de Escaleras
 * Desacoplado del ciclo de vida de React. Funciones puras, determinísticas
 * y tipadas según normativas NCh / AISC / OSHA y criterios de la Lámina 5 (b + 2h = 630mm).
 */

export type StaircaseConnectionType = 'tipo1' | 'tipo2' | 'tipo3';

export type SlopeEvaluation =
  | 'Inclinación Baja'
  | 'Recomendable ⭐'
  | 'Recomendable ⭐ (Estándar)'
  | 'Inclinación Alta'
  | 'Crítico';

export interface StaircaseElevationInputs {
  readonly tipoConnection: StaircaseConnectionType;
  readonly t1Ta1?: number; // Cota superior TA1 (m)
  readonly t1Esp1?: number; // Espesor 1 (mm)
  readonly t1Ta2?: number; // Cota inferior TA2 (m)
  readonly t1Esp2?: number; // Espesor 2 (mm)
  readonly t2TcSup?: number; // Cota superior TC (m)
  readonly t2TcInf?: number; // Cota inferior TC (m)
  readonly t3Ta?: number; // Cota superior TA (m)
  readonly t3Esp?: number; // Espesor (mm)
  readonly t3Tc?: number; // Cota inferior TC (m)
}

export interface StaircaseGeometryInputs {
  readonly targetContrahuella: number; // h deseada (mm, estándar 175)
  readonly huella: number; // b (mm, estándar 280)
  readonly anchoTramo: number; // A (mm, estándar 900)
}

export interface StaircaseErgonomics {
  readonly blondelValue: number; // 2h + b
  readonly isBlondelCompliant: boolean; // 600mm <= 2h + b <= 640mm
  readonly safetyFormulaValue: number; // h + b (ideal 460mm)
  readonly angleDeg: number; // atan(h / b) en grados
  readonly slopeEvaluation: SlopeEvaluation;
}

export interface StaircaseBillOfMaterials {
  readonly longitudDiagonalM: number;
  readonly pesoLimonesKg: number; // 2 canales C250 (25.1 kg/m c/u)
  readonly pesoPeldanosKg: number; // Parrilla grating (12.5 kg/m²)
  readonly pesoPasamanosKg: number; // Cañería 1-1/2" SCH40 (4.5 kg/m)
  readonly pesoTotalAceroKg: number;
  readonly pernosAnclaje: number;
}

export interface StaircaseAnalysisOutput {
  readonly alturaTotal: number; // H en mm
  readonly numeroPeldanos: number; // n
  readonly contrahuellaCalculada: number; // h en mm
  readonly huella: number; // b en mm
  readonly anchoTramo: number; // A en mm
  readonly longitudMedia: number; // L = b * n en mm
  readonly angulo: number; // Ángulo de inclinación en grados
  readonly blondel: number; // 2h + b en mm
  readonly seguridad: number; // h + b en mm
  readonly requiereDescanso: boolean; // H > 3000 mm o n > 16 peldaños
  readonly galiboMinimoMm: number; // 2200 mm según norma industrial
  readonly ergonomia: StaircaseErgonomics;
  readonly bom: {
    readonly longitudDiagonalM: string;
    readonly pesoLimonesKg: string;
    readonly pesoPeldañosKg: string;
    readonly pesoPasamanosKg: string;
    readonly pesoTotalAceroKg: string;
    readonly pernosAnclaje: number;
  };
}

export class StaircaseEngine {
  /**
   * Resuelve el desnivel vertical total H (en mm) según el tipo de empalme topográfico.
   */
  public static calculateTotalHeight(inputs: StaircaseElevationInputs): number {
    const {
      tipoConnection,
      t1Ta1 = 6.0,
      t1Esp1 = 30,
      t1Ta2 = 3.0,
      t1Esp2 = 30,
      t2TcSup = 6.0,
      t2TcInf = 3.0,
      t3Ta = 6.0,
      t3Esp = 30,
      t3Tc = 3.0,
    } = inputs;

    if (tipoConnection === 'tipo1') {
      const supLevel = t1Ta1 + t1Esp1 * 0.001;
      const infLevel = t1Ta2 + t1Esp2 * 0.001;
      return Math.round(Math.abs((supLevel - infLevel) * 1000) * 100) / 100;
    }

    if (tipoConnection === 'tipo2') {
      return Math.round(Math.abs((t2TcSup - t2TcInf) * 1000) * 100) / 100;
    }

    // tipoConnection === 'tipo3'
    const supLevel = t3Ta + t3Esp * 0.001;
    return Math.round(Math.abs((supLevel - t3Tc) * 1000) * 100) / 100;
  }

  /**
   * Evalúa la pendiente e inclinación ergonómica según la tabla oficial de la Lámina 5.
   */
  public static evaluateSlope(angleDeg: number): SlopeEvaluation {
    if (angleDeg < 28.0) {
      return 'Inclinación Baja';
    }
    if (angleDeg >= 30.0 && angleDeg <= 33.0) {
      return 'Recomendable ⭐ (Estándar)';
    }
    if (angleDeg >= 28.0 && angleDeg <= 38.0) {
      return 'Recomendable ⭐';
    }
    if (angleDeg <= 44.0) {
      return 'Inclinación Alta';
    }
    return 'Crítico';
  }

  /**
   * Ejecuta el análisis dimensional, ergonómico y volumétrico completo de la escalera.
   */
  public static analyze(
    elevationInputs: StaircaseElevationInputs,
    geometryInputs: StaircaseGeometryInputs
  ): StaircaseAnalysisOutput {
    const alturaTotal = this.calculateTotalHeight(elevationInputs);
    const targetCH = Math.max(50, geometryInputs.targetContrahuella || 175);
    const huella = Math.max(100, geometryInputs.huella || 280);
    const anchoTramo = Math.max(300, geometryInputs.anchoTramo || 900);

    const numeroPeldanos = Math.max(1, Math.round(alturaTotal / targetCH));
    const contrahuellaCalculada = alturaTotal / numeroPeldanos;
    const longitudMedia = huella * numeroPeldanos;

    const angleRad = Math.atan(contrahuellaCalculada / huella);
    const angulo = angleRad * (180 / Math.PI);

    const blondelValue = 2 * contrahuellaCalculada + huella;
    const isBlondelCompliant = blondelValue >= 600 && blondelValue <= 640;
    const safetyFormulaValue = contrahuellaCalculada + huella;
    const slopeEvaluation = this.evaluateSlope(angulo);

    const ergonomia: StaircaseErgonomics = {
      blondelValue,
      isBlondelCompliant,
      safetyFormulaValue,
      angleDeg: angulo,
      slopeEvaluation,
    };

    // Verificación de normativas de seguridad (Descanso obligatorio si H > 3000 mm o n > 16)
    const hasExcessiveHeight = alturaTotal > 3000;
    const hasExcessiveSteps = numeroPeldanos > 16;
    const requiereDescanso = hasExcessiveHeight || hasExcessiveSteps;

    // Cubicaciones de Acero y Lista de Materiales (BOM)
    const longitudDiagonalM = Math.sqrt(
      Math.pow(longitudMedia / 1000, 2) + Math.pow(alturaTotal / 1000, 2)
    );
    const pesoLimonesKg = longitudDiagonalM * 2 * 25.1; // 2 limones de perfil Canal C250
    const pesoPeldanosKg = numeroPeldanos * (anchoTramo / 1000) * 12.5; // Parrilla electroforjada
    const pesoPasamanosKg = longitudDiagonalM * 2 * 4.5; // Cañería 1-1/2" SCH40
    const pesoTotalAceroKg = pesoLimonesKg + pesoPeldanosKg + pesoPasamanosKg;
    const pernosAnclaje = numeroPeldanos * 4 + 8;

    return {
      alturaTotal,
      numeroPeldanos,
      contrahuellaCalculada,
      huella,
      anchoTramo,
      longitudMedia,
      angulo,
      blondel: blondelValue,
      seguridad: safetyFormulaValue,
      requiereDescanso,
      galiboMinimoMm: 2200,
      ergonomia,
      bom: {
        longitudDiagonalM: longitudDiagonalM.toFixed(2),
        pesoLimonesKg: pesoLimonesKg.toFixed(1),
        pesoPeldañosKg: pesoPeldanosKg.toFixed(1),
        pesoPasamanosKg: pesoPasamanosKg.toFixed(1),
        pesoTotalAceroKg: pesoTotalAceroKg.toFixed(1),
        pernosAnclaje,
      },
    };
  }
}
