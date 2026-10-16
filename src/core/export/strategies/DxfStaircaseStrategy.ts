import { ExportService } from '../ExportService';
import type { DxfStaircasePayload, ExportFormat, ExportResult, IExportStrategy } from '../types';

/**
 * Estrategia de exportación de planos CAD en formato DXF ASCII R12/2000
 * para escaleras metálicas industriales (Canal C250, peldaños, barandas SCH40 y P.T.).
 */
export class DxfStaircaseStrategy implements IExportStrategy<DxfStaircasePayload> {
  public readonly id = 'dxf-staircase';
  public readonly format: ExportFormat = 'dxf';
  public readonly mimeType = 'application/dxf';

  /**
   * Genera el contenido textual del archivo DXF de manera pura (determinística).
   */
  public generateDxfString(payload: DxfStaircasePayload): string {
    const { results, huella } = payload;
    const numSteps = Math.max(0, results.numeroPeldanos);
    const stepHeight = results.contrahuellaCalculada;
    const stepTread = huella;
    const totalHeight = results.alturaTotal;
    const totalLength = results.longitudMedia;

    let dxf = '0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n5\n';
    dxf += '0\nLAYER\n2\nESTRUCTURA_C250\n70\n0\n62\n4\n6\nCONTINUOUS\n0\n';
    dxf += '0\nLAYER\n2\nPELDANOS_GRATING\n70\n0\n62\n3\n6\nCONTINUOUS\n0\n';
    dxf += '0\nLAYER\n2\nBARANDAS_SCH40\n70\n0\n62\n30\n6\nCONTINUOUS\n0\n';
    dxf += '0\nLAYER\n2\nPUNTOS_TRABAJO\n70\n0\n62\n1\n6\nCONTINUOUS\n0\n';
    dxf += '0\nLAYER\n2\nCOTAS_Y_TEXTO\n70\n0\n62\n7\n6\nCONTINUOUS\n0\n';
    dxf += '0\nENDTAB\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n';

    // 1. Trazado de peldaños (Grating)
    for (let i = 0; i < numSteps; i++) {
      const x1 = i * stepTread;
      const y1 = i * stepHeight;
      const x2 = (i + 1) * stepTread;
      const y2 = y1;
      const y3 = (i + 1) * stepHeight;

      // Huella horizontal
      dxf += `0\nLINE\n8\nPELDANOS_GRATING\n10\n${x1}\n20\n${y1}\n30\n0.0\n11\n${x2}\n21\n${y2}\n31\n0.0\n`;
      // Contrahuella vertical
      dxf += `0\nLINE\n8\nPELDANOS_GRATING\n10\n${x2}\n20\n${y2}\n30\n0.0\n11\n${x2}\n21\n${y3}\n31\n0.0\n`;
    }

    // 2. Limón de acero Canal C250 (eje y canto inferior -250mm)
    dxf += `0\nLINE\n8\nESTRUCTURA_C250\n10\n0.0\n20\n0.0\n30\n0.0\n11\n${totalLength}\n21\n${totalHeight}\n31\n0.0\n`;
    dxf += `0\nLINE\n8\nESTRUCTURA_C250\n10\n0.0\n20\n-250.0\n30\n0.0\n11\n${totalLength}\n21\n${totalHeight - 250.0}\n31\n0.0\n`;

    // 3. Barandas de protección SCH40 (Pasamanos 1200mm, intermedia 800mm, rodapié 400mm)
    dxf += `0\nLINE\n8\nBARANDAS_SCH40\n10\n0.0\n20\n1200.0\n30\n0.0\n11\n${totalLength}\n21\n${totalHeight + 1200.0}\n31\n0.0\n`;
    dxf += `0\nLINE\n8\nBARANDAS_SCH40\n10\n0.0\n20\n800.0\n30\n0.0\n11\n${totalLength}\n21\n${totalHeight + 800.0}\n31\n0.0\n`;
    dxf += `0\nLINE\n8\nBARANDAS_SCH40\n10\n0.0\n20\n400.0\n30\n0.0\n11\n${totalLength}\n21\n${totalHeight + 400.0}\n31\n0.0\n`;

    // 4. Puntos de Trabajo (P.T.) estructurales
    dxf += '0\nPOINT\n8\nPUNTOS_TRABAJO\n10\n0.0\n20\n0.0\n30\n0.0\n';
    dxf += `0\nPOINT\n8\nPUNTOS_TRABAJO\n10\n${totalLength}\n20\n${totalHeight}\n30\n0.0\n`;

    dxf += '0\nENDSEC\n0\nEOF\n';
    return dxf;
  }

  /**
   * Resuelve el nombre del archivo de salida
   */
  public resolveFilename(payload: DxfStaircasePayload): string {
    if (payload.filename && payload.filename.trim().length > 0) {
      return payload.filename.endsWith('.dxf') ? payload.filename : `${payload.filename}.dxf`;
    }

    const heightMm = payload.results?.alturaTotal ? payload.results.alturaTotal.toFixed(0) : '0';
    return `Escalera_Estructural_C250_${heightMm}mm.dxf`;
  }

  /**
   * Ejecuta la exportación, crea el Blob DXF y dispara la descarga en el navegador.
   */
  public export(payload: DxfStaircasePayload): ExportResult {
    if (!payload?.results || payload.results.numeroPeldanos <= 0) {
      return {
        isSuccess: false,
        filename: '',
        error: 'Los resultados de cálculo de la escalera no son válidos para generar el plano CAD.',
      };
    }

    const filename = this.resolveFilename(payload);
    const dxfString = this.generateDxfString(payload);
    const blob = new Blob([dxfString], { type: this.mimeType });

    ExportService.triggerDownload(blob, filename);

    return {
      isSuccess: true,
      filename,
    };
  }
}
