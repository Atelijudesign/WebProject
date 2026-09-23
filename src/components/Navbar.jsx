import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "../constants";
import { useTranslation } from "../hooks/useTranslation";

export default function Navbar() {
  const location = useLocation();
  const { language, toggleLanguage, t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, link) => {
    if (link.external) return;
    setIsOpen(false);

    if (link.href.startsWith("#")) {
      // location.pathname incluye el base de Vite
      // (por ejemplo "/WebProject/blog" al publicar en GitHub Pages).
      const baseName = import.meta.env.BASE_URL.replace(/\/+$/, "");
      const homePath = baseName || "/";
      const isHome = (location.pathname.replace(/\/+$/, "") || "/") === homePath;
      if (!isHome) {
        e.preventDefault();
        window.location.href = `${baseName}/${link.href}`;
        return;
      }
      e.preventDefault();
      const id = link.href.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} role="navigation" aria-label="Navegación principal">
      <div className="nav-inner flex items-center justify-between">
        <Link
          to="/"
          className="nav-logo"
          onClick={() => {
            setIsOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="Ir al inicio de Andrés Gallo P.BIM"
        >
          <span className="nav-logo-full">Andrés Gallo <span>P.BIM</span></span>
          <span className="nav-logo-compact" aria-hidden="true">AG<span>.PBIM</span></span>
        </Link>

        <div className="nav-actions">
          {/* Selector de Idioma ES / EN */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="nav-language"
            title={language === "es" ? "Switch to English" : "Cambiar a Español"}
            aria-label={language === "es" ? "Switch to English" : "Cambiar a Español"}
          >
            <i className="fa-solid fa-globe" aria-hidden="true" />
            <span className="nav-language-values">
              <span className={language === "es" ? "is-active" : ""}>ES</span>
              <span className="nav-language-separator">/</span>
              <span className={language === "en" ? "is-active" : ""}>EN</span>
            </span>
          </button>

          {/* Botón de Acceso a Command Palette (Ctrl + K) */}
          <button
            type="button"
            onClick={handleOpenSearch}
            className="nav-search"
            title={language === "en" ? "Open global search (Ctrl + K)" : "Abrir buscador global de herramientas y proyectos (Ctrl + K)"}
            aria-label={language === "en" ? "Search with Command Palette" : "Buscar con Command Palette"}
          >
            <span className="nav-search-main">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              <span className="nav-search-label">
                {language === "en" ? "Search" : "Buscar"}
              </span>
            </span>
            <kbd className="nav-search-shortcut">
              Ctrl K
            </kbd>
          </button>

          <div className={`nav-links ${isOpen ? "open" : ""}`}>
            {navLinks.map((link) => {
              const isExternal = link.external;
              const isAnchor = link.href.startsWith("#");
              const linkTitle = link.i18nKey ? t(link.i18nKey) : link.title;

              if (isExternal) {
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    className={link.cta ? "nav-cta" : ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linkTitle}
                  </a>
                );
              }

              return (
                <Link
                  key={link.id}
                  to={isAnchor ? `/${link.href}` : link.href}
                  className={link.cta ? "nav-cta active" : ""}
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {linkTitle}
                </Link>
              );
            })}
          </div>

          <button
            className="nav-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </nav>
  );
}
