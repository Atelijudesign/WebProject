import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  validateIfcFile,
  validateIfcHeader,
  getFileSizeCategory,
  estimateMemoryImpact,
  getSafeIfcFileLimit,
} from "../components/ifc-viewer/ifcHelpers";
import {
  listCachedModels,
  deleteCachedModel,
  getStorageEstimate,
  clearIfcCache,
} from "../components/ifc-viewer/ifcCache";
import { IfcMemoryModal } from "../components/ifc-viewer/IfcMemoryModal";
import { IfcPrivacyModal } from "../components/ifc-viewer/IfcPrivacyModal";
import { IfcErrorBoundary } from "../components/ifc-viewer/IfcErrorBoundary";
import {
  trackIfcEvent,
  getIfcTelemetryEvents,
  clearIfcTelemetryEvents,
} from "../components/ifc-viewer/ifcTelemetry";

describe("Fase 8 — Pruebas Funcionales y Validación de Archivos IFC", () => {
  it("clasifica correctamente categorías de tamaño de archivo IFC (pequeño, mediano, 40 MB y pesado)", () => {
    expect(getFileSizeCategory(2 * 1024 * 1024)).toBe("small");
    expect(getFileSizeCategory(9.9 * 1024 * 1024)).toBe("small");
    expect(getFileSizeCategory(15 * 1024 * 1024)).toBe("medium");
    expect(getFileSizeCategory(40 * 1024 * 1024)).toBe("medium");
    expect(getFileSizeCategory(40.1 * 1024 * 1024)).toBe("large");
    expect(getFileSizeCategory(120 * 1024 * 1024)).toBe("large");
  });

  it("valida archivos IFC respetando límites de memoria del dispositivo", () => {
    // 40 MB en dispositivo con 8 GB RAM -> Válido
    const file40MB = { name: "edificio-40mb.ifc", size: 40 * 1024 * 1024 };
    const res8GB = validateIfcFile(file40MB, 8);
    expect(res8GB.valid).toBe(true);
    expect(res8GB.category).toBe("medium");

    // 40 MB en dispositivo muy limitado (2 GB RAM) -> Válido (límite 45MB)
    const res2GB = validateIfcFile(file40MB, 2);
    expect(res2GB.valid).toBe(true);

    // Archivo de 50 MB en dispositivo con 2 GB RAM -> Rechazado por seguridad
    const file50MB = { name: "gran-modelo.ifc", size: 50 * 1024 * 1024 };
    const resReject = validateIfcFile(file50MB, 2);
    expect(resReject.valid).toBe(false);
    expect(resReject.message).toContain("supera el límite seguro");
  });

  it("rechaza archivos vacíos o con extensiones que no sean .ifc", () => {
    expect(validateIfcFile(null, 8).valid).toBe(false);
    expect(validateIfcFile({ name: "vacio.ifc", size: 0 }, 8).valid).toBe(false);
    expect(validateIfcFile({ name: "plano.dwg", size: 1024 }, 8).valid).toBe(false);
    expect(validateIfcFile({ name: "calculo.xlsx", size: 1024 }, 8).valid).toBe(false);
  });

  it("valida la firma de cabecera STEP/IFC ISO-10303-21", async () => {
    // Archivo con cabecera legítima
    const validFile = {
      slice: () => ({
        text: async () => "ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION(('ViewDefinition [CoordinationView]'),'2;1');",
      }),
    };
    const isValid = await validateIfcHeader(validFile);
    expect(isValid).toBe(true);

    // Archivo binario o corrupto sin cabecera STEP
    const invalidFile = {
      slice: () => ({
        text: async () => "MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xFF\xFF",
      }),
    };
    const isInvalid = await validateIfcHeader(invalidFile);
    expect(isInvalid).toBe(false);
  });

  it("calcula la estimación de impacto de memoria JS Heap y GPU", () => {
    const impact40MB = estimateMemoryImpact(40 * 1024 * 1024);
    expect(impact40MB.fileMB).toBe("40.0");
    expect(impact40MB.category).toBe("medium");
    expect(impact40MB.recommendedProfile).toBe("balanced");
    expect(impact40MB.estimatedHeapMB).toBeGreaterThan(100);
  });
});

describe("Fase 9 — Rendimiento, FPS y Almacenamiento IndexedDB", () => {
  beforeEach(() => {
    clearIfcTelemetryEvents();
  });

  it("renderiza IfcMemoryModal con pestañas de Memoria/GPU e IndexedDB", async () => {
    render(
      <IfcMemoryModal
        isOpen={true}
        onClose={vi.fn()}
        modelName="nave-industrial.ifc"
        modelElementCount={850}
        indexedElementCount={850}
        categoryCount={6}
        performanceProfile="balanced"
        onProfileChange={vi.fn()}
        onDisposeModel={vi.fn()}
        hasLoadedModel={true}
        fps={58}
        gpuMetrics={{ drawCalls: 12, triangles: 45000 }}
      />
    );

    expect(screen.getByText(/Rendimiento, FPS y Almacenamiento Local/i)).toBeTruthy();
    expect(screen.getByText("58")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("45k")).toBeTruthy();

    // Cambiar a pestaña IndexedDB
    const tabCache = screen.getByRole("button", { name: /IndexedDB/i });
    fireEvent.click(tabCache);

    expect(screen.getByText(/Almacenamiento Navegador/i)).toBeTruthy();
    expect(screen.getByText(/Modelos Almacenados en Caché Local/i)).toBeTruthy();
  });

  it("provee estimación de almacenamiento y operaciones de lista/borrado en ifcCache", async () => {
    const estimate = await getStorageEstimate();
    expect(estimate).toHaveProperty("usageMB");
    expect(estimate).toHaveProperty("quotaMB");

    const models = await listCachedModels();
    expect(Array.isArray(models)).toBe(true);

    const deleteResult = await deleteCachedModel("fake-key");
    expect(typeof deleteResult).toBe("boolean");
  });
});

describe("Fase 10 — Preparación para Producción, Seguridad y Privacidad", () => {
  beforeEach(() => {
    clearIfcTelemetryEvents();
  });

  it("IfcPrivacyModal renderiza declaraciones de procesamiento 100% Client-Side", () => {
    const handleClose = vi.fn();
    render(<IfcPrivacyModal isOpen={true} onClose={handleClose} />);

    expect(
      screen.getByText(/Privacidad, Seguridad y Limitaciones Técnicas/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/Procesamiento 100% en tu Navegador \(Client-Side\)/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/Caché Local Acelerada \(IndexedDB\)/i)
    ).toBeTruthy();

    const closeButton = screen.getByRole("button", { name: /Entendido/i });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("IfcErrorBoundary captura fallos en componentes hijos y permite reiniciar", () => {
    const ThrowingComponent = () => {
      throw new Error("WebGL context lost simulation");
    };

    const handleReset = vi.fn();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <IfcErrorBoundary onReset={handleReset}>
        <ThrowingComponent />
      </IfcErrorBoundary>
    );

    expect(
      screen.getByText(/Recuperación de Gráficos WebGL \/ Memoria/i)
    ).toBeTruthy();
    expect(screen.getByText(/WebGL context lost simulation/i)).toBeTruthy();

    const restartBtn = screen.getByRole("button", { name: /Reiniciar Visor/i });
    fireEvent.click(restartBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });

  it("ifcTelemetry registra eventos anónimos y sanitiza datos privados sensibles", () => {
    trackIfcEvent("ifc_test_event", {
      category: "medium",
      durationMs: 1200,
      // Campos sensibles que DEBEN ser eliminados por la sanitización
      filename: "proyecto_secreto_confidencial.ifc",
      filepath: "C:/secret/model.ifc",
      author: "Juan Perez",
      globalId: "3m$F8G49vB5v_J000X9L00",
    });

    const events = getIfcTelemetryEvents();
    expect(events.length).toBeGreaterThan(0);
    const lastEvent = events[0];
    expect(lastEvent.event).toBe("ifc_test_event");
    expect(lastEvent.data.category).toBe("medium");
    expect(lastEvent.data.durationMs).toBe(1200);

    // Comprobar que ningún campo sensible fue retenido
    expect(lastEvent.data).not.toHaveProperty("filename");
    expect(lastEvent.data).not.toHaveProperty("filepath");
    expect(lastEvent.data).not.toHaveProperty("author");
    expect(lastEvent.data).not.toHaveProperty("globalId");
  });
});
