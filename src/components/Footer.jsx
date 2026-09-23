import { useTranslation } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#020617] border-t border-slate-800/80 py-12 text-slate-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand & Socials */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-white text-base">
              Andrés Gallo <span className="text-cyan-400">P.BIM</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              v2.5.0
            </span>
          </div>

          <div className="flex items-center gap-4 text-base md:border-l md:border-slate-800 md:pl-5">
            <a href="https://www.linkedin.com/in/andresgallop/" target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] hover:scale-110 transition-all duration-300" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="https://www.youtube.com/@andresgalloparra" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF0000] hover:scale-110 transition-all duration-300" aria-label="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a href="https://www.tiktok.com/@andresgalloparra?lang=es" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all duration-300" aria-label="TikTok">
              <i className="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>

        <div className="text-center md:text-left">
          © {new Date().getFullYear()} Andrés Gallo P. {t("footer_rights") || "Todos los derechos reservados."}
        </div>

        <div className="text-cyan-400 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          {t("footer_slogan") || "// Diseñado con ingeniería y código"}
        </div>
      </div>
    </footer>
  );
}
