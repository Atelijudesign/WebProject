import { describe, it, expect } from "vitest";
import {
  calculatePolygonArea3D,
  calculatePolygonPerimeter3D,
  extractIfcValue,
  cleanPropertySets,
  getCategoryMetadata,
  STRUCTURAL_CATEGORIES,
  getSafeIfcFileLimit,
  validateIfcFile,
  resolvePerformanceProfile,
  getRendererPixelRatio,
  buildQuantitySummary,
  compareQuantitySummaries,
  createLoadTimings,
} from "../components/ifc-viewer/ifcHelpers";

describe("ifcHelpers - Utilidades del Visor IFC", () => {
  it("debe extraer correctamente valores primitivos y objetos IFC", () => {
    expect(extractIfcValue(null)).toBe("—");
    expect(extractIfcValue(undefined)).toBe("—");
    expect(extractIfcValue("COSTANERA")).toBe("COSTANERA");
    expect(extractIfcValue(123)).toBe("123");
    expect(extractIfcValue({ value: "C12.5X6.65" })).toBe("C12.5X6.65");
    expect(extractIfcValue({ NominalValue: { value: 4500 } })).toBe("4500");
  });

  it("debe obtener metadatos y colores correctos para categorías estructurales", () => {
    const beamMeta = getCategoryMetadata("IFCBEAM");
    expect(beamMeta.name).toBe("Vigas");
    expect(beamMeta.icon).toBe("fa-bars");

    const columnMeta = getCategoryMetadata("ifccolumn");
    expect(columnMeta.name).toBe("Columnas");

    const unknownMeta = getCategoryMetadata("IFCSOMETHINGNEW");
    expect(unknownMeta.name).toBe("SOMETHINGNEW");
  });

  it("debe limpiar y estructurar Property Sets (Psets) omitiendo vacíos", () => {
    const rawPsets = [
      {
        Name: { value: "Pset_BeamCommon" },
        HasProperties: [
          { Name: { value: "LoadBearing" }, NominalValue: { value: true } },
          { Name: { value: "Span" }, NominalValue: { value: 6000 } },
        ],
      },
      {
        Name: { value: "Pset_Empty" },
        HasProperties: [],
      },
    ];

    const cleaned = cleanPropertySets(rawPsets);
    expect(cleaned).toHaveLength(1);
    expect(cleaned[0].name).toBe("Pset_BeamCommon");
    expect(cleaned[0].properties).toHaveLength(2);
    expect(cleaned[0].properties[0]).toEqual({ name: "LoadBearing", value: "true" });
    expect(cleaned[0].properties[1]).toEqual({ name: "Span", value: "6000" });
  });

  it("debe calcular el área de un polígono 3D plano con precisión (fórmula de Newell)", () => {
    // Cuadrado de 4m x 3m en plano XY -> Área = 12 m²
    const rectPoints = [
      { x: 0, y: 0, z: 0 },
      { x: 4, y: 0, z: 0 },
      { x: 4, y: 3, z: 0 },
      { x: 0, y: 3, z: 0 },
    ];
    const area = calculatePolygonArea3D(rectPoints);
    expect(area).toBeCloseTo(12.0, 2);

    // Triángulo rectángulo base 6m, altura 8m en plano XZ -> Área = 24 m²
    const triPoints = [
      { x: 0, y: 0, z: 0 },
      { x: 6, y: 0, z: 0 },
      { x: 0, y: 0, z: 8 },
    ];
    const triArea = calculatePolygonArea3D(triPoints);
    expect(triArea).toBeCloseTo(24.0, 2);

    // Menos de 3 puntos retorna 0
    expect(calculatePolygonArea3D([{ x: 0, y: 0, z: 0 }])).toBe(0);
  });

  it("debe calcular el perímetro de un polígono 3D", () => {
    // Rectángulo 4m x 3m -> Perímetro = 4 + 3 + 4 + 3 = 14m
    const rectPoints = [
      { x: 0, y: 0, z: 0 },
      { x: 4, y: 0, z: 0 },
      { x: 4, y: 3, z: 0 },
      { x: 0, y: 3, z: 0 },
    ];
    const perim = calculatePolygonPerimeter3D(rectPoints);
    expect(perim).toBeCloseTo(14.0, 2);

    expect(calculatePolygonPerimeter3D([])).toBe(0);
  });

  it("debe adaptar el límite IFC a la memoria del dispositivo", () => {
    expect(getSafeIfcFileLimit(2)).toBe(45 * 1024 * 1024);
    expect(getSafeIfcFileLimit(4)).toBe(80 * 1024 * 1024);
    expect(getSafeIfcFileLimit(8)).toBe(150 * 1024 * 1024);
    expect(getSafeIfcFileLimit(undefined)).toBe(100 * 1024 * 1024);
  });

  it("debe rechazar extensiones y tamaños IFC inseguros", () => {
    expect(validateIfcFile({ name: "modelo.rvt", size: 1000 }, 8).valid).toBe(false);
    expect(validateIfcFile({ name: "modelo.ifc", size: 90 * 1024 * 1024 }, 4).valid).toBe(false);
    expect(validateIfcFile({ name: "modelo.ifc", size: 20 * 1024 * 1024 }, 4).valid).toBe(true);
  });

  it("debe seleccionar un perfil gráfico seguro", () => {
    expect(resolvePerformanceProfile("auto", 2, 1)).toBe("economy");
    expect(resolvePerformanceProfile("auto", 8, 1)).toBe("quality");
    expect(resolvePerformanceProfile("balanced", 2, 3)).toBe("balanced");
    expect(getRendererPixelRatio("economy", 3)).toBe(1);
    expect(getRendererPixelRatio("balanced", 3)).toBe(1.5);
    expect(getRendererPixelRatio("quality", 3)).toBe(2);
  });

  it("debe agrupar cantidades por categoría IFC", () => {
    expect(buildQuantitySummary([{ ifcType: "IFCBEAM" }, { ifcType: "IFCBEAM" }, { ifcType: "IFCCOLUMN" }])).toEqual([
      { type: "IFCBEAM", label: "Vigas", count: 2 },
      { type: "IFCCOLUMN", label: "Columnas", count: 1 },
    ]);
  });

  it("debe comparar inventarios IFC sin cargar dos geometrías", () => {
    expect(compareQuantitySummaries([{ ifcType: "IFCBEAM" }], [{ ifcType: "IFCBEAM" }, { ifcType: "IFCCOLUMN" }])).toEqual([
      { type: "IFCCOLUMN", label: "Columnas", previousCount: 0, currentCount: 1, difference: 1 },
    ]);
  });

  it("debe calcular tiempos acumulados de carga", () => {
    expect(createLoadTimings(1000, { engineReady: 1200, dataReady: 1500, geometryReady: 3000, indexReady: 4500, finishedAt: 4500 })).toEqual({ engineMs: 200, dataReadyMs: 500, geometryReadyMs: 2000, indexReadyMs: 3500, totalMs: 3500 });
  });
});
