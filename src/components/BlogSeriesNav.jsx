import { Link } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";

/**
 * Navegacion anterior/siguiente para series de articulos del blog.
 * props:
 *   series: nombre de la serie (ej. "SmartPlant 3D")
 *   prev / next: { href, titleEs, titleEn } | null
 */
export default function BlogSeriesNav({ series = "", prev = null, next = null }) {
  const { language } = useTranslation();
  const isEn = language === "en";

  const renderCard = (item, direction) => {
    const isPrev = direction === "prev";
    const label = isPrev
      ? isEn ? "Previous article" : "Articulo anterior"
      : isEn ? "Next article" : "Articulo siguiente";

    if (!item) {
      return (
        <div
          aria-disabled="true"
          className={`flex flex-col justify-center p-5 rounded-2xl border border-slate-800/60 bg-slate-900/30 opacity-50 cursor-not-allowed ${
            isPrev ? "" : "text-right"
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1">
            {label}
          </span>
          <span className="text-sm text-slate-500 font-semibold">
            {isEn ? "Coming soon" : "Proximamente"}
          </span>
        </div>
      );
    }

    return (
      <Link
        to={item.href}
        className={`group flex flex-col justify-center p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-950/40 ${
          isPrev ? "" : "text-right"
        }`}
      >
        <span
          className={`flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 mb-1 ${
            isPrev ? "" : "justify-end"
          }`}
        >
          {isPrev && <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform" />}
          {label}
          {!isPrev && <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />}
        </span>
        <span className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
          {isEn ? item.titleEn : item.titleEs}
        </span>
      </Link>
    );
  };

  return (
    <nav
      aria-label={isEn ? `${series} series navigation` : `Navegacion de la serie ${series}`}
      className="mt-14"
    >
      {series && (
        <p className="text-center text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-4">
          <i className="fa-solid fa-layer-group mr-2 text-cyan-400" />
          {isEn ? `${series} series` : `Serie ${series}`}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderCard(prev, "prev")}
        {renderCard(next, "next")}
      </div>
    </nav>
  );
}
