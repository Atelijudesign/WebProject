import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IfcRibbon, IFC_RIBBON_TABS } from "../components/ifc-viewer/IfcRibbon";

afterEach(cleanup);

describe("IfcRibbon", () => {
  it("muestra todas las pestañas principales", () => {
    render(<IfcRibbon activeTab="file" onTabChange={() => {}} collapsed={false} onToggleCollapsed={() => {}} />);
    IFC_RIBBON_TABS.forEach((tab) => expect(screen.getByRole("tab", { name: tab.label })).toBeTruthy());
    expect(screen.getByRole("button", { name: "Abrir IFC" })).toBeTruthy();
  });

  it("permite cambiar de pestaña y contraer la cinta", () => {
    const onTabChange = vi.fn();
    const onToggleCollapsed = vi.fn();
    const { rerender } = render(<IfcRibbon activeTab="file" onTabChange={onTabChange} collapsed={false} onToggleCollapsed={onToggleCollapsed} />);

    fireEvent.click(screen.getByRole("tab", { name: "Vista" }));
    expect(onTabChange).toHaveBeenCalledWith("view");
    fireEvent.click(screen.getByRole("button", { name: "Contraer cinta" }));
    expect(onToggleCollapsed).toHaveBeenCalledOnce();

    rerender(<IfcRibbon activeTab="view" onTabChange={onTabChange} collapsed onToggleCollapsed={onToggleCollapsed} />);
    expect(screen.queryByRole("button", { name: "Isométrica" })).toBeNull();
    expect(screen.getByRole("button", { name: "Expandir cinta" })).toBeTruthy();
  });

  it("expande la cinta al seleccionar una pestaña cerrada", () => {
    const onTabChange = vi.fn();
    const onToggleCollapsed = vi.fn();
    render(<IfcRibbon activeTab="file" onTabChange={onTabChange} collapsed onToggleCollapsed={onToggleCollapsed} />);

    fireEvent.click(screen.getByRole("tab", { name: "Analizar" }));
    expect(onTabChange).toHaveBeenCalledWith("analyze");
    expect(onToggleCollapsed).toHaveBeenCalledOnce();
  });

  it("emite onCommand al hacer clic en un comando de la pestaña activa", () => {
    const onCommand = vi.fn();
    render(
      <IfcRibbon
        activeTab="performance"
        onTabChange={() => {}}
        collapsed={false}
        onToggleCollapsed={() => {}}
        onCommand={onCommand}
        activeCommands={{ "style-wireframe": true }}
      />
    );

    const wireframeBtn = screen.getByRole("button", { name: "Alámbrico" });
    expect(wireframeBtn).toBeTruthy();
    expect(wireframeBtn.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(wireframeBtn);
    expect(onCommand).toHaveBeenCalledWith("style-wireframe");
  });

  it("soporta navegación por teclado con flechas en la barra de pestañas", () => {
    const onTabChange = vi.fn();
    render(
      <IfcRibbon
        activeTab="file"
        onTabChange={onTabChange}
        collapsed={false}
        onToggleCollapsed={() => {}}
      />
    );

    const tabList = screen.getByRole("tablist");
    fireEvent.keyDown(tabList, { key: "ArrowRight" });
    expect(onTabChange).toHaveBeenCalledWith("view");

    fireEvent.keyDown(tabList, { key: "ArrowLeft" });
    expect(onTabChange).toHaveBeenCalledWith("performance");
  });
});
