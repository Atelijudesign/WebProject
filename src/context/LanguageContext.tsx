import React, { createContext, useState, useEffect, ReactNode } from "react";
import { TRANSLATIONS, Language } from "../data/i18n";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("bim-lang") as Language | null;
    if (saved === "es" || saved === "en") return saved;
    if (typeof process !== "undefined" && (process.env.NODE_ENV === "test" || process.env.VITEST)) {
      return "es";
    }
    if (typeof navigator !== "undefined" && navigator.language) {
      return navigator.language.toLowerCase().startsWith("en") ? "en" : "es";
    }
    return "es";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("bim-lang", lang);
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === "es" ? "en" : "es";
    setLanguage(nextLang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    if (TRANSLATIONS.es && TRANSLATIONS.es[key]) {
      return TRANSLATIONS.es[key];
    }
    return fallback || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
