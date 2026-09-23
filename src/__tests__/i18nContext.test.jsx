import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { LanguageProvider } from "../context/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";

const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>;

describe("LanguageContext & useTranslation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should default to Spanish translation", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.language).toBe("es");
    expect(result.current.t("nav_blog")).toBe("BLOG");
    expect(result.current.t("btn_export")).toBe("Exportar Excel");
  });

  it("should toggle language to English", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    act(() => {
      result.current.toggleLanguage();
    });

    expect(result.current.language).toBe("en");
    expect(result.current.t("btn_export")).toBe("Export Excel");
    expect(localStorage.getItem("bim-lang")).toBe("en");
  });
});
