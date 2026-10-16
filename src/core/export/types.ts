/**
 * Core Export Architecture - Domain Types & Strategy Contracts
 * Define contratos tipados sin dependencias externas para desacoplar
 * generadores de archivos (DXF, PDF, Excel, etc.) del ciclo de vida de React.
 */

export type ExportFormat = 'dxf' | 'pdf' | 'xlsx' | 'json' | 'csv';

export interface ExportResult {
  readonly isSuccess: boolean;
  readonly filename: string;
  readonly error?: string;
}

export interface IExportStrategy<TPayload> {
  readonly id: string;
  readonly format: ExportFormat;
  readonly mimeType: string;
  export(payload: TPayload): Promise<ExportResult> | ExportResult;
}

// ---------------------------------------------------------------------------
// Escaleras Estructurales & CAD DXF
// ---------------------------------------------------------------------------

export interface StaircaseCalculationResults {
  readonly numeroPeldanos: number;
  readonly contrahuellaCalculada: number;
  readonly alturaTotal: number;
  readonly longitudMedia: number;
  readonly anguloInclinacion?: number;
  readonly desarrolloTotal?: number;
}

export interface DxfStaircasePayload {
  readonly results: StaircaseCalculationResults;
  readonly huella: number;
  readonly anchoTramo?: number;
  readonly filename?: string;
  readonly projectName?: string;
}

// ---------------------------------------------------------------------------
// Cubicaciones & Reportes (PDF / Excel)
// ---------------------------------------------------------------------------

export interface TakeoffSummary {
  readonly subtotal: number;
  readonly extraPct?: number;
  readonly extraWeight?: number;
  readonly grandTotal: number;
  readonly tonTotal?: number;
  readonly unitLabel?: string;
  readonly tonUnitLabel?: string;
}

export interface TakeoffPdfPayload {
  readonly title?: string;
  readonly subtitle?: string;
  readonly standardTag?: string;
  readonly headers: readonly string[];
  readonly rows: ReadonlyArray<ReadonlyArray<string | number>>;
  readonly summary: TakeoffSummary;
  readonly columnAlignments?: Record<number, 'left' | 'center' | 'right'>;
  readonly filename?: string;
}

export interface ExcelColumnDefinition {
  readonly header: string;
  readonly key: string;
  readonly width?: number;
  readonly align?: 'left' | 'center' | 'right';
  readonly numFmt?: string;
}

export interface TakeoffExcelPayload {
  readonly sheetName?: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly standardTag?: string;
  readonly columns: readonly ExcelColumnDefinition[];
  readonly data: ReadonlyArray<Record<string, unknown>>;
  readonly summary: TakeoffSummary;
  readonly filename?: string;
}
