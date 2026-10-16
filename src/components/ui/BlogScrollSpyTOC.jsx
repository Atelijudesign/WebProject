import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const BlogScrollSpyTOC = ({
  items = [],
  containerSelector = "article",
  title = "Índice Técnico",
  estimatedReadTime = "8 min",
  className = "",
  mode = "auto", // "auto" | "sidebar" | "floating"
  onZenModeToggle = null,
  isZenMode = false,
  onSelectSection = null,
}) => {
  const [activeId, setActiveId] = useState("");
  const [sections, setSections] = useState(items);
  const [readingProgress, setReadingProgress] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(parseInt(estimatedReadTime, 10) || 5);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const observerRef = useRef(null);

  // 1. Detección automática de secciones si no se proporcionan items explícitos
  useEffect(() => {
    if (items && items.length > 0) {
      setSections(items);
      if (!activeId && items[0]) {
        setActiveId(items[0].id);
      }
      return;
    }

    const container = document.querySelector(containerSelector);
    if (!container) return;

    const headings = container.querySelectorAll("h2[id], h3[id], section[id]");
    const parsedSections = Array.from(headings).map((heading) => ({
      id: heading.id,
      title: heading.getAttribute("data-title") || heading.textContent.replace(/^[#\s]+/, ""),
      level: heading.tagName === "H3" ? 3 : 2,
    }));

    if (parsedSections.length > 0) {
      setSections(parsedSections);
      setActiveId(parsedSections[0].id);
    }
  }, [items, containerSelector, activeId]);

  // 2. ScrollSpy con IntersectionObserver para detectar la sección visible
  useEffect(() => {
    if (sections.length === 0) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const handleIntersect = (entries) => {
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        const sorted = visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveId(sorted[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-90px 0px -65% 0px",
      threshold: [0, 0.2, 0.5, 1],
    });

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sections]);

  // 3. Cálculo de porcentaje de lectura y minutos restantes
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      setReadingProgress(Math.round(progress));

      const totalMins = parseInt(estimatedReadTime, 10) || 6;
      const remaining = Math.max(1, Math.round(totalMins * (1 - progress / 100)));
      setRemainingMinutes(remaining);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [estimatedReadTime]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setIsMobileOpen(false);

    if (onSelectSection) {
      onSelectSection(id);
    }

    const targetEl = document.getElementById(id);
    if (!targetEl) return;

    const navbarOffset = 88;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = targetEl.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - navbarOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setActiveId(id);
  };

  if (sections.length === 0) {
    return null;
  }

  const renderSidebarCard = () => (
    <div className={`w-full rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800/90 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Luz ambiental sutil */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header con Progreso y Minutos */}
      <div className="pb-4 mb-4 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <i className="fa-solid fa-list-ul text-cyan-400 text-[11px]" />
            <span>{title}</span>
          </span>

          {/* Botón Modo Zen opcional */}
          {onZenModeToggle && (
            <button
              type="button"
              onClick={onZenModeToggle}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                isZenMode
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20"
                  : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
              title={isZenMode ? "Salir de Modo Zen (Lectura libre de distracciones)" : "Activar Modo Zen"}
            >
              <i className="fa-solid fa-book-open text-[10px]" />
              <span>{isZenMode ? "Zen On" : "Modo Zen"}</span>
            </button>
          )}
        </div>

        {/* Barra y Estadísticas de Lectura */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
          <span className="flex items-center gap-1">
            <span className="text-white font-bold">{readingProgress}%</span> leído
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <i className="fa-regular fa-clock text-[10px]" />
            ~{remainingMinutes} min
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
          <div
            style={{ width: `${readingProgress}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-150"
          />
        </div>
      </div>

      {/* Lista de Secciones con layoutId */}
      <nav className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1 relative z-10">
        {sections.map((section, idx) => {
          const isActive = activeId === section.id;
          const isSublevel = section.level === 3;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => scrollToSection(e, section.id)}
              className={`relative block rounded-xl text-xs font-mono transition-colors py-2 px-3 ${
                isSublevel ? "pl-6 text-[11px]" : ""
              } ${
                isActive
                  ? "text-cyan-300 font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeTocSectionPill"
                  className="absolute inset-0 bg-cyan-500/15 border-l-2 border-cyan-400 rounded-r-xl -z-10 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <span className="flex items-center gap-2 relative z-10 truncate">
                {section.icon ? (
                  <i className={`${section.icon} text-[10px] opacity-75 shrink-0`} />
                ) : !isSublevel ? (
                  <span className="text-slate-600 text-[10px] font-mono">0{idx + 1}.</span>
                ) : null}
                <span className="truncate">{section.title}</span>
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );

  const renderFloatingFAB = () => (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsMobileOpen(true)}
        className="px-4 py-2.5 rounded-full bg-slate-900/95 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold shadow-2xl backdrop-blur-xl flex items-center gap-2.5 hover:border-cyan-400 transition-colors shadow-cyan-500/10"
        aria-label="Abrir tabla de contenidos"
      >
        <div className="w-5 h-5 rounded-full border-2 border-cyan-500/40 border-t-cyan-400 flex items-center justify-center text-[9px]">
          {readingProgress}%
        </div>
        <span>Índice ({sections.length})</span>
        <i className="fa-solid fa-chevron-up text-[10px]" />
      </motion.button>

      {/* Modal / Drawer Móvil */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 max-h-[82vh] rounded-t-3xl bg-slate-900 border-t border-slate-800 p-6 z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                    {title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs hover:bg-slate-700 transition-colors"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              {/* Progreso en Drawer */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>{readingProgress}% completado</span>
                <span className="text-emerald-400 font-bold">~{remainingMinutes} min restantes</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 mb-5">
                <div
                  style={{ width: `${readingProgress}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400"
                />
              </div>

              {/* Botón Zen Mode en Móvil */}
              {onZenModeToggle && (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      onZenModeToggle();
                      setIsMobileOpen(false);
                    }}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                      isZenMode
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <i className="fa-solid fa-book-open" />
                    <span>{isZenMode ? "Desactivar Modo Zen" : "Activar Modo Zen (Lectura Limpia)"}</span>
                  </button>
                </div>
              )}

              {/* Lista de enlaces táctiles */}
              <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
                {sections.map((section, idx) => {
                  const isActive = activeId === section.id;
                  const isSublevel = section.level === 3;

                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => scrollToSection(e, section.id)}
                      className={`block rounded-xl text-xs font-mono transition-colors py-2.5 px-3.5 ${
                        isSublevel ? "pl-7 text-[11px]" : ""
                      } ${
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {section.icon ? (
                          <i className={`${section.icon} text-xs text-cyan-400 shrink-0`} />
                        ) : !isSublevel ? (
                          <span className="text-slate-500 text-[10px] font-mono">0{idx + 1}.</span>
                        ) : null}
                        <span className="truncate">{section.title}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  if (mode === "sidebar") {
    return renderSidebarCard();
  }

  if (mode === "floating") {
    return renderFloatingFAB();
  }

  // mode === "auto"
  return (
    <>
      <div className="hidden lg:block w-full">
        {renderSidebarCard()}
      </div>
      <div className="lg:hidden">
        {renderFloatingFAB()}
      </div>
    </>
  );
};
