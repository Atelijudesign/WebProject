import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "../context/LanguageContext";
import { Navbar } from "../components/Navbar";

const renderNavbar = () => {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </LanguageProvider>
  );
};

describe("Navbar Responsive & Tablet Drawer", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  afterEach(() => {
    cleanup();
  });

  it("renders navbar with brand logo, search button, language selector and toggle", () => {
    renderNavbar();

    expect(screen.getByLabelText(/Ir al inicio de Andrés Gallo P.BIM/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Buscar con Command Palette|Search with Command Palette/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Abrir menú de navegación/i })).toBeDefined();
  });

  it("opens mobile/tablet drawer when toggle button is clicked", () => {
    renderNavbar();

    const toggleBtn = screen.getByRole("button", { name: /Abrir menú de navegación/i });
    fireEvent.click(toggleBtn);

    // The drawer dialog is now opened in portal
    const drawerDialog = screen.getByRole("dialog", { name: /Menú de navegación tablet y móvil/i });
    expect(drawerDialog).toBeDefined();

    // Verify all menu items are present and visible in drawer
    expect(screen.getAllByText(/Inicio/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sobre Mí/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Automatización/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Servicios/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Portafolio/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Proyectos/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Blog/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Herramientas/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Contacto/i).length).toBeGreaterThan(0);
  });

  it("closes the drawer when close button is clicked", async () => {
    renderNavbar();

    const toggleBtn = screen.getByRole("button", { name: /Abrir menú de navegación/i });
    fireEvent.click(toggleBtn);

    const closeBtn = screen.getByRole("button", { name: /Cerrar panel de navegación/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /Menú de navegación tablet y móvil/i })).toBeNull();
    });
  });

  it("locks body scroll when drawer is open and unlocks when closed", async () => {
    renderNavbar();

    const toggleBtn = screen.getByRole("button", { name: /Abrir menú de navegación/i });
    fireEvent.click(toggleBtn);
    expect(document.body.style.overflow).toBe("hidden");

    const closeBtn = screen.getByRole("button", { name: /Cerrar panel de navegación/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
    });
  });
});
