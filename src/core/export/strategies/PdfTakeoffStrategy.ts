import { generateTakeoffPdf } from '../../../utils/pdfExportUtils';
import type { ExportFormat, ExportResult, IExportStrategy, TakeoffPdfPayload } from '../types';

/**
 * Estrategia de exportación para reportes ejecutivos en formato PDF (jsPDF + autoTable).
 */
export class PdfTakeoffStrategy implements IExportStrategy<TakeoffPdfPayload> {
  public readonly id = 'pdf-takeoff';
  public readonly format: ExportFormat = 'pdf';
  public readonly mimeType = 'application/pdf';

  public export(payload: TakeoffPdfPayload): ExportResult {
    if (!payload?.rows || payload.rows.length === 0) {
      return {
        isSuccess: false,
        filename: '',
        error: 'No hay perfiles o elementos registrados en la lista de cubicación.',
      };
    }

    const resolvedFilename = payload.filename || 'cubicacion_acero.pdf';

    generateTakeoffPdf({
      title: payload.title,
      subtitle: payload.subtitle,
      standardTag: payload.standardTag,
      headers: payload.headers ? [...payload.headers] : [],
      rows: payload.rows ? payload.rows.map((row) => [...row]) : [],
      summary: payload.summary,
      columnAlignments: payload.columnAlignments,
      filename: resolvedFilename,
    });

    return {
      isSuccess: true,
      filename: resolvedFilename,
    };
  }
}
