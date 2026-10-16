import { Link } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import SEOHead from "../components/SEOHead";

export default function NotFound() {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <>
      <SEOHead
        title={isEn ? "404 - Page Not Found" : "404 - Página no encontrada"}
        description={
          isEn
            ? "The page you are looking for does not exist or has been moved."
            : "La ruta que buscas no existe o ha sido movida."
        }
        noindex={true}
      />

      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="relative mb-6">
          <span className="text-8xl sm:text-9xl font-black text-slate-800 font-mono select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold tracking-widest uppercase">
              {isEn ? "Error: Not Found" : "Error: Ruta Inexistente"}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
          {isEn ? "Page Not Found" : "Página no encontrada"}
        </h1>
        <p className="text-slate-400 max-w-md mb-8 text-sm sm:text-base leading-relaxed font-light">
          {isEn
            ? "The address you requested does not correspond to an active section. Explore our engineering tools, portfolio, or technical blog."
            : "La dirección solicitada no corresponde a una sección activa. Puedes explorar nuestras herramientas de cálculo, portafolio o artículos técnicos."}
        </p>

        {/* Enlaces Rápidos de Rescate */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-lg">
          <Link
            to="/"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-500/20 font-mono flex items-center gap-2"
          >
            <i className="fa-solid fa-house"></i>
            {isEn ? "Home" : "Inicio"}
          </Link>
          <Link
            to="/herramientas"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-700 font-mono flex items-center gap-2"
          >
            <i className="fa-solid fa-calculator text-cyan-400"></i>
            {isEn ? "Calculators" : "Herramientas"}
          </Link>
          <Link
            to="/blog"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-700 font-mono flex items-center gap-2"
          >
            <i className="fa-solid fa-book text-emerald-400"></i>
            Blog
          </Link>
          <Link
            to="/herramientas/cv-ats"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-700 font-mono flex items-center gap-2"
          >
            <i className="fa-solid fa-file-invoice text-amber-400"></i>
            CV ATS
          </Link>
        </div>

        <div className="text-[11px] font-mono text-slate-600">
          HTTP 404 • robots: noindex, nofollow • andresgallop.com
        </div>
      </div>
    </>
  );
}
