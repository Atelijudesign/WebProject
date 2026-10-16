import type { ExportResult, IExportStrategy } from './types';

/**
 * Servicio unificado de exportación (Orquestador del Patrón Strategy)
 * Desacopla la lógica de renderizado en UI de la descarga física de archivos.
 */
export class ExportService {
  /**
   * Dispara la descarga de un Blob en el navegador de manera segura.
   * Maneja la creación y limpieza del elemento <a> y revoca la URL generada.
   */
  public static triggerDownload(blob: Blob, filename: string): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const url = window.URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = filename;
    downloadAnchor.style.display = 'none';

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    window.URL.revokeObjectURL(url);
  }

  /**
   * Ejecuta una estrategia de exportación validando el payload y protegiendo de excepciones.
   */
  public static async executeExport<TPayload>(
    strategy: IExportStrategy<TPayload>,
    payload: TPayload
  ): Promise<ExportResult> {
    if (!strategy) {
      return {
        isSuccess: false,
        filename: '',
        error: 'No se suministró una estrategia de exportación válida.',
      };
    }

    try {
      const result = await strategy.export(payload);
      return result;
    } catch (caughtError) {
      const errorMessage =
        caughtError instanceof Error
          ? caughtError.message
          : 'Error desconocido durante la ejecución de la exportación.';

      return {
        isSuccess: false,
        filename: '',
        error: errorMessage,
      };
    }
  }
}
