import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import BlogBackButton from "../components/BlogBackButton";
import { LanguageProvider } from "../context/LanguageContext";

describe("BlogBackButton", () => {
  it("renders the shared blog navigation as an accessible button-style link", () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <BlogBackButton />
        </MemoryRouter>
      </LanguageProvider>
    );

    const button = screen.getByRole("link", { name: /volver al blog|back to blog/i });
    expect(button.getAttribute("href")).toBe("/blog");
    expect(button.className).toContain("rounded-full");
    expect(button.className).toContain("focus-visible:ring-2");
  });
});
