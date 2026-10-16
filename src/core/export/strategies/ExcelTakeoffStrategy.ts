import { generateTakeoffExcel } from '../../../utils/excelExportUtils';
import type { ExportFormat, ExportResult, IExportStrategy, TakeoffExcelPayload } from '../types';

/**
 * Estrategia de exportación para planillas de cubicación en formato Excel (.xlsx).
 */
export class ExcelTakeoffStrategy implements IExportStrategy<TakeoffExcelPayload> {
  public readonly id = 'excel-takeoff';
  public readonly format: ExportFormat = 'xlsx';
  public readonly mimeType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  public async export(payload: TakeoffExcelPayload): Promise<ExportResult> {
    if (!payload?.data || payload.data.length === 0) {
      return {
        isSuccess: false,
        filename: '',
        error: 'No hay datos en la lista de cubicación para generar el archivo Excel.',
      };
    }

    const resolvedFilename = payload.filename || 'cubicacion_acero.xlsx';

    await generateTakeoffExcel({
      sheetName: payload.sheetName,
      title: payload.title,
      subtitle: payload.subtitle,
      standardTag: payload.standardTag,
      columns: payload.columns ? [...payload.columns] : [],
      data: payload.data ? [...payload.data] : [],
      summary: payload.summary,
      filename: resolvedFilename,
    });

    return {
      isSuccess: true,
      filename: resolvedFilename,
    };
  }
}
