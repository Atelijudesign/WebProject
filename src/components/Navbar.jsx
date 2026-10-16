import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { navLinks } from "../constants";
import { useTranslation } from "../hooks/useTranslation";

const NAV_ICONS = {
  home: "fa-solid fa-house",
  about: "fa-solid fa-user",
  automation: "fa-solid fa-bolt",
  services: "fa-solid fa-briefcase",
  portfolio: "fa-solid fa-folder-open",
  proyectos: "fa-solid fa-cubes",
  blog: "fa-solid fa-newspaper",
  tools: "fa-solid fa-wrench",
  contact: "fa-solid fa-paper-plane",
};

export const Navbar = () => {
  const location = useLocation();
  const { language, toggleLanguage, t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hoveredLinkId, setHoveredLinkId] = useState(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;

    setIsScrolled(latest > 30);

    if (isDrawerOpen) {
      setIsHidden(false);
      return;
    }

    if (latest > 120 && diff > 8) {
      setIsHidden(true);
      return;
    }

    if (diff < -6 || latest <= 60) {
      setIsHidden(false);
    }
  });

  // Cerrar drawer automáticamente al cambiar de ruta
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname, location.hash]);

  // Cerrar drawer al presionar Escape o al redimensionar a pantalla de escritorio (>= 1280px)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Bloquear el scroll del body cuando el menú móvil/tablet está abierto
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
  }, [isDrawerOpen]);

  const currentPath = location.pathname;
  const currentHash = location.hash;

  const checkIsLinkActive = useCallback((link) => {
    if (link.href.startsWith("#")) {
      const baseName = import.meta.env.BASE_URL.replace(/\/+$/, "");
      const isHome = currentPath === "/" || currentPath === "" || currentPath === baseName || currentPath === `${baseName}/`;
      if (!isHome) return false;
      return currentHash === link.href || (!currentHash && link.id === "home");
    }
    return currentPath === link.href || currentPath.startsWith(`${link.href}/`);
  }, [currentPath, currentHash]);

  const handleNavClick = (e, link) => {
    if (link.external) return;
    setIsDrawerOpen(false);

    if (!link.href.startsWith("#")) return;

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
    if (!element) return;

    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  };

  const handleOpenSearch = () => {
    setIsDrawerOpen(false);
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={`navbar ${isScrolled ? "scrolled" : ""}`}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="nav-inner flex items-center justify-between">
          <Link
            to="/"
            className="nav-logo"
            onClick={() => {
              setIsDrawerOpen(false);
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

            {/* Enlaces de Escritorio (Desktop >= 1280px) */}
            <div
              className="nav-links"
              onMouseLeave={() => setHoveredLinkId(null)}
            >
              {navLinks.map((link) => {
                const isExternal = link.external;
                const isAnchor = link.href.startsWith("#");
                const linkTitle = link.i18nKey ? t(link.i18nKey) : link.title;
                const isActive = checkIsLinkActive(link);
                const isHovered = hoveredLinkId === link.id;
                const shouldShowPill = !link.cta && (isHovered || (!hoveredLinkId && isActive));

                if (isExternal) {
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      className={`relative px-2.5 py-1.5 rounded-lg transition-colors ${link.cta ? "nav-cta" : ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setHoveredLinkId(link.id)}
                    >
                      {shouldShowPill && (
                        <motion.span
                          layoutId="navbarSlidingPill"
                          className="absolute inset-0 bg-cyan-500/15 border border-cyan-400/40 rounded-lg -z-10 shadow-[0_0_15px_rgba(6,182,212,0.18)]"
                          transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        />
                      )}
                      <span className="relative z-10">{linkTitle}</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.id}
                    to={isAnchor ? `/${link.href}` : link.href}
                    className={`relative px-2.5 py-1.5 rounded-lg transition-colors ${
                      link.cta ? "nav-cta active" : isActive ? "text-cyan-300 font-bold" : "text-slate-300 hover:text-white"
                    }`}
                    onClick={(e) => handleNavClick(e, link)}
                    onMouseEnter={() => setHoveredLinkId(link.id)}
                  >
                    {shouldShowPill && (
                      <motion.span
                        layoutId="navbarSlidingPill"
                        className="absolute inset-0 bg-cyan-500/15 border border-cyan-400/40 rounded-lg -z-10 shadow-[0_0_15px_rgba(6,182,212,0.18)]"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10">{linkTitle}</span>
                  </Link>
                );
              })}
            </div>

            {/* Botón Hamburguesa para Tablet y Móvil (< 1280px) */}
            <button
              type="button"
              className="nav-toggle"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label={isDrawerOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={isDrawerOpen}
            >
              {isDrawerOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* DRAWER PORTAL RESPONSIVO PARA TABLETS (LENOVO IDEA TAB PRO, IPAD) Y MÓVILES */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isDrawerOpen && (
            <div className="fixed inset-0 z-[9999] pointer-events-auto">
              {/* Backdrop Oscuro con Desenfoque */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
                onClick={() => setIsDrawerOpen(false)}
                aria-hidden="true"
              />

              {/* Panel Deslizante Lateral Derecho */}
              <motion.aside
                initial={{ x: "100%", opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 32 }}
                className="fixed top-0 right-0 h-full w-full max-w-[340px] sm:max-w-md bg-slate-900/98 border-l border-slate-800 shadow-2xl flex flex-col z-[10000] overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Menú de navegación tablet y móvil"
              >
                {/* Cabecera del Drawer */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/60 shrink-0">
                  <Link
                    to="/"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="font-extrabold text-white text-base tracking-tight font-grotesk flex items-center gap-2"
                  >
                    <span>Andrés Gallo</span>
                    <span className="text-cyan-400 font-mono text-sm px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                      P.BIM
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-white flex items-center justify-center text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label="Cerrar panel de navegación"
                  >
                    <i className="fa-solid fa-xmark text-base" />
                  </button>
                </div>

                {/* Acciones Rápidas (Búsqueda y Selector de Idioma) */}
                <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-800/60 space-y-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleOpenSearch}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all text-xs font-mono group"
                  >
                    <span className="flex items-center gap-2.5">
                      <i className="fa-solid fa-magnifying-glass text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span>{language === "en" ? "Search project, tool, blog..." : "Buscar proyecto, herramienta, blog..."}</span>
                    </span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-cyan-300 font-bold">
                      Ctrl K
                    </kbd>
                  </button>

                  <div className="flex items-center justify-between px-2 pt-1 text-xs">
                    <span className="text-slate-400 font-mono flex items-center gap-1.5">
                      <i className="fa-solid fa-globe text-cyan-400" />
                      {language === "en" ? "Language" : "Idioma"}:
                    </span>
                    <div className="inline-flex rounded-lg bg-slate-800/90 p-0.5 border border-slate-700/80">
                      <button
                        type="button"
                        onClick={() => language !== "es" && toggleLanguage()}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                          language === "es"
                            ? "bg-cyan-500 text-slate-950 shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Español (ES)
                      </button>
                      <button
                        type="button"
                        onClick={() => language !== "en" && toggleLanguage()}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                          language === "en"
                            ? "bg-cyan-500 text-slate-950 shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        English (EN)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista Completa de Enlaces y Menús */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 [scrollbar-width:thin] overscroll-contain">
                  {/* Grupo 1: Navegación del Perfil y Portafolio */}
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                      // {language === "en" ? "NAVIGATION" : "NAVEGACIÓN PRINCIPAL"}
                    </span>
                    <div className="space-y-1">
                      {navLinks
                        .filter((item) => ["home", "about", "automation", "services", "portfolio"].includes(item.id))
                        .map((link) => {
                          const isActive = checkIsLinkActive(link);
                          const linkTitle = link.i18nKey ? t(link.i18nKey) : link.title;
                          const iconClass = NAV_ICONS[link.id] || "fa-solid fa-chevron-right";

                          return (
                            <Link
                              key={link.id}
                              to={`/${link.href}`}
                              onClick={(e) => handleNavClick(e, link)}
                              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                                  : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                                isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-400"
                              }`}>
                                <i className={iconClass} />
                              </div>
                              <span className="flex-1">{linkTitle}</span>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                              )}
                            </Link>
                          );
                        })}
                    </div>
                  </div>

                  {/* Grupo 2: Plataformas, Catálogos y Blog */}
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                      // {language === "en" ? "BIM TOOLS & KNOWLEDGE" : "CATÁLOGOS & HERRAMIENTAS BIM"}
                    </span>
                    <div className="space-y-1">
                      {navLinks
                        .filter((item) => ["proyectos", "blog", "tools"].includes(item.id))
                        .map((link) => {
                          const isActive = checkIsLinkActive(link);
                          const linkTitle = link.i18nKey ? t(link.i18nKey) : link.title;
                          const iconClass = NAV_ICONS[link.id] || "fa-solid fa-cube";

                          return (
                            <Link
                              key={link.id}
                              to={link.href}
                              onClick={(e) => handleNavClick(e, link)}
                              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                                  : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                                isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-400"
                              }`}>
                                <i className={iconClass} />
                              </div>
                              <span className="flex-1">{linkTitle}</span>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                              )}
                            </Link>
                          );
                        })}
                    </div>
                  </div>

                  {/* Grupo 3: Contacto CTA Destacado */}
                  <div className="pt-2">
                    {navLinks
                      .filter((item) => item.cta)
                      .map((link) => {
                        const linkTitle = link.i18nKey ? t(link.i18nKey) : link.title;

                        return (
                          <Link
                            key={link.id}
                            to={`/${link.href}`}
                            onClick={(e) => handleNavClick(e, link)}
                            className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/25 transition-all text-center"
                          >
                            <i className="fa-solid fa-paper-plane text-xs" />
                            <span>{linkTitle}</span>
                          </Link>
                        );
                      })}
                  </div>
                </div>

                {/* Footer del Drawer con Redes Sociales y Estado */}
                <div className="p-5 border-t border-slate-800/80 bg-slate-950/70 shrink-0 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[11px] text-slate-300">
                      {language === "en" ? "Available for Projects" : "Disponible para Proyectos"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <a
                      href="https://www.linkedin.com/in/andresgallop/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-[#0A66C2] transition-colors"
                      aria-label="LinkedIn"
                    >
                      <i className="fa-brands fa-linkedin-in" />
                    </a>
                    <a
                      href="https://github.com/Atelijudesign"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                      aria-label="GitHub"
                    >
                      <i className="fa-brands fa-github" />
                    </a>
                    <a
                      href="mailto:andresgallop@gmail.com"
                      className="text-slate-400 hover:text-cyan-400 transition-colors"
                      aria-label="Email"
                    >
                      <i className="fa-solid fa-envelope" />
                    </a>
                  </div>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Navbar;
