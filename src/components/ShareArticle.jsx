import { useState } from "react";
import { useTranslation } from "../context/LanguageContext";

export default function ShareArticle({ title, url }) {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url || window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareUrl = url || window.location.href;
  const shareTitle = title || (isEn ? "Blog Article" : "Artículo del blog");

  return (
    <section className="py-10 bg-[#070d18] border-t border-slate-800/60">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-5 font-mono flex items-center justify-center gap-2">
          <i className="fa-solid fa-share-nodes text-cyan-400" /> {isEn ? "Share this article" : "Comparte este artículo"}
        </p>

        {/* Grid simétrico y uniforme para todos los botones */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs sm:text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5"
            aria-label="Compartir en LinkedIn"
          >
            <i className="fa-brands fa-linkedin-in text-base" />
            <span className="truncate">LinkedIn</span>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-[#1877F2] hover:bg-[#0d5bbf] text-white text-xs sm:text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5"
            aria-label="Compartir en Facebook"
          >
            <i className="fa-brands fa-facebook-f text-base" />
            <span className="truncate">Facebook</span>
          </a>

          {/* X (Twitter) */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-[#000000] hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 border border-slate-700/80"
            aria-label="Compartir en X (Twitter)"
          >
            <i className="fa-brands fa-x-twitter text-base" />
            <span className="truncate">X (Twitter)</span>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-[#25D366] hover:bg-[#1DA851] text-white text-xs sm:text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5"
            aria-label="Compartir en WhatsApp"
          >
            <i className="fa-brands fa-whatsapp text-base" />
            <span className="truncate">WhatsApp</span>
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-[#0088cc] hover:bg-[#006699] text-white text-xs sm:text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5"
            aria-label="Compartir en Telegram"
          >
            <i className="fa-brands fa-telegram text-base" />
            <span className="truncate">Telegram</span>
          </a>

          {/* Copiar Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 border border-slate-700/60"
            aria-label={isEn ? "Copy link to clipboard" : "Copiar enlace al portapapeles"}
          >
            {copied ? (
              <>
                <i className="fa-solid fa-check text-emerald-400 text-base" />
                <span className="text-emerald-400 font-bold truncate">{isEn ? "Copied!" : "¡Copiado!"}</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-link text-base" />
                <span className="truncate">{isEn ? "Copy Link" : "Copiar Enlace"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
