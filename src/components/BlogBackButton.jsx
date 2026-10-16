import { Link } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";

export default function BlogBackButton({ className = "" }) {
  const { language } = useTranslation();
  const isEn = language === "en";
  const label = isEn ? "Back to Blog" : "Volver al blog";

  return (
    <Link
      to="/blog"
      aria-label={label}
      className={`group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full border border-cyan-400/30 bg-slate-950/75 px-3 py-2 pr-5 text-sm font-bold tracking-wide text-slate-100 shadow-lg shadow-cyan-950/25 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/60 hover:text-white hover:shadow-xl hover:shadow-emerald-950/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/10 via-transparent to-emerald-500/10 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-transform duration-300 group-hover:-translate-x-0.5">
        <i className="fa-solid fa-arrow-left text-xs" />
      </span>
      <span>{label}</span>
    </Link>
  );
}
