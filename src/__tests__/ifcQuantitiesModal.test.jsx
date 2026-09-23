import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IfcQuantitiesModal } from "../components/ifc-viewer/IfcQuantitiesModal";

afterEach(cleanup);

describe("IfcQuantitiesModal - Cantidades y Comparación (Fase 6)", () => {
  const mockElements = [
    { expressID: 1, type: "IFCBEAM", name: "Viga W12x26" },
    { expressID: 2, type: "IFCBEAM", name: "Viga W12x26" },
    { expressID: 3, type: "IFCBEAM", name: "Viga W14x30" },
    { expressID: 4, type: "IFCCOLUMN", name: "Columna H200" },
    { expressID: 5, type: "IFCSLAB", name: "Losa e=15cm" },
  ];

  const mockCategories = [
    { type: "IFCBEAM", count: 3 },
    { type: "IFCCOLUMN", count: 1 },
    { type: "IFCSLAB", count: 1 },
  ];

  const mockBounds = {
    min: { x: -10, y: 0, z: -5 },
    max: { x: 10, y: 8, z: 15 },
  };

  const mockLoadTimings = {
    totalDurationMs: 850,
    geometryReadyMs: 400,
    indexReadyMs: 450,
  };

  it("renderiza el resumen de cubicación con conteos y porcentajes", () => {
    render(
      <IfcQuantitiesModal
        isOpen={true}
        onClose={() => {}}
        elementsList={mockElements}
        categories={mockCategories}
        modelBounds={mockBounds}
        modelName="nave-industrial.ifc"
        loadTimings={mockLoadTimings}
        initialTab="summary"
      />
    );

    expect(screen.getByText(/nave-industrial\.ifc/)).toBeTruthy();
    expect(screen.getByText("Vigas")).toBeTruthy();
    expect(screen.getByText("Columnas")).toBeTruthy();
    expect(screen.getByText(/Losas/)).toBeTruthy();

    // 3 de 5 elementos = 60.0%
    expect(screen.getByText("60.0%")).toBeTruthy();
  });

  it("permite filtrar la tabla de cubicación por nombre de categoría", () => {
    render(
      <IfcQuantitiesModal
        isOpen={true}
        onClose={() => {}}
        elementsList={mockElements}
        categories={mockCategories}
        modelBounds={mockBounds}
        modelName="nave-industrial.ifc"
        loadTimings={mockLoadTimings}
        initialTab="summary"
      />
    );

    const searchInput = screen.getByPlaceholderText(/Buscar clase IFC o categoría/i);
    fireEvent.change(searchInput, { target: { value: "Colum" } });

    expect(screen.getByText("Columnas")).toBeTruthy();
    expect(screen.queryByText("Losas")).toBeNull();
  });

  it("compara el modelo actual contra una línea base y muestra deltas (+ / - / Δ)", () => {
    // Línea base anterior con 2 vigas y 2 columnas (1 viga agregada en actual, 1 columna eliminada)
    const baseline = [
      { expressID: 10, type: "IFCBEAM", name: "Viga W12" },
      { expressID: 11, type: "IFCBEAM", name: "Viga W12" },
      { expressID: 12, type: "IFCCOLUMN", name: "Columna A" },
      { expressID: 13, type: "IFCCOLUMN", name: "Columna B" },
    ];

    render(
      <IfcQuantitiesModal
        isOpen={true}
        onClose={() => {}}
        elementsList={mockElements}
        categories={mockCategories}
        modelBounds={mockBounds}
        modelName="nave-v2.ifc"
        loadTimings={mockLoadTimings}
        baselineInventory={baseline}
        baselineModelName="nave-v1.ifc"
        initialTab="compare"
      />
    );

    // Pestaña Comparar abierta
    expect(screen.getByText(/Comparación de Inventario entre Revisiones/i)).toBeTruthy();
    expect(screen.getByText(/nave-v1\.ifc/)).toBeTruthy();
    expect(screen.getByText(/nave-v2\.ifc/)).toBeTruthy();

    // Vigas y Losas agregadas (+1 en ambas)
    expect(screen.getAllByText("+1").length).toBe(2);

    // Columnas: 1 actual vs 2 anterior (-1)
    expect(screen.getByText("-1")).toBeTruthy();
  });

  it("calcula y muestra las métricas dimensionales del modelo (BBox y tiempos)", () => {
    render(
      <IfcQuantitiesModal
        isOpen={true}
        onClose={() => {}}
        elementsList={mockElements}
        categories={mockCategories}
        modelBounds={mockBounds}
        modelName="nave-industrial.ifc"
        loadTimings={mockLoadTimings}
        initialTab="metrics"
      />
    );

    // Dimensiones BBox: deltaX = 20m, deltaY = 8m, deltaZ = 20m -> Bounding Volume = 20 * 8 * 20 = 3200 m³
    expect(screen.getByText(/3\.200/)).toBeTruthy();
    expect(screen.getAllByText("20.00 m").length).toBe(2);
    expect(screen.getByText("8.00 m")).toBeTruthy();

    // Timings
    expect(screen.getByText("0.4s")).toBeTruthy();
  });
});
