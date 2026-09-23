import { asset } from "../utils/asset";
import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { InteractiveTerminal } from "./InteractiveTerminal";
import { NumberTicker } from "./ui/NumberTicker";
import { useTranslation } from "../hooks/useTranslation";

const BuildingScene = lazy(() => import("./canvas/BuildingScene"));

// Variantes de animación con curva de aceleración hiper-suave (Manwar Vibe cubic-bezier)
const bentoContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const bentoItemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const Hero = () => {
  const { t, language } = useTranslation();

  const handleContactScroll = (e) => {
    e.preventDefault();
    const contactSection = document.querySelector("#contact");
    if (!contactSection) return;
    contactSection.scrollIntoView({ behavior: "smooth" });
  };

  const handleAboutScroll = (e) => {
    e.preventDefault();
    const aboutSection = document.querySelector("#about");
    if (!aboutSection) return;
    aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-[#030712] relative overflow-hidden">
      {/* Background Reticular Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── BENTO GRID CONTAINER CON STAGGERED ENTRANCE ─── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={bentoContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* CARD 1: Hero Principal (Staggered Item) */}
          <motion.div
            variants={bentoItemVariants}
            className="md:col-span-2 lg:col-span-2 rounded-3xl p-5 sm:p-6 md:p-8 bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl hover:border-cyan-500/40 hover:shadow-cyan-500/5 transition-all duration-300 shadow-2xl flex flex-col justify-between group"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/50 text-emerald-400 text-xs font-mono mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t("hero_available")}
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                {t("hero_title")} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
                  {t("hero_title_accent")}
                </span>
              </h1>

              <p
                className="text-slate-300 text-base leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: t("hero_desc") }}
              />
            </div>

            {/* CTAs con Microinteracciones Táctiles */}
            <div className="flex items-center gap-3 flex-wrap pt-6 border-t border-slate-800/60">
              <a
                href="#contact"
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg hover:shadow-cyan-500/25 btn-tactile flex items-center gap-2"
                onClick={handleContactScroll}
              >
                <i className="fa-solid fa-bolt text-yellow-300" /> {t("hero_cta_contact")}
              </a>
              <a
                href={asset("/Andres_Gallo_CV.pdf")}
                className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700/60 btn-tactile flex items-center gap-2"
                download
              >
                <i className="fa-solid fa-file-arrow-down text-cyan-400" /> {t("hero_cta_cv")}
              </a>
              <a
                href={asset("/Andres_Gallo_Portfolio.pdf")}
                className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700/60 btn-tactile flex items-center gap-2"
                download
              >
                <i className="fa-solid fa-folder-open text-emerald-400" /> {t("hero_cta_portfolio")}
              </a>
            </div>
          </motion.div>

          {/* CARD 2: Visor 3D Interactivo con Damping */}
          <motion.div
            variants={bentoItemVariants}
            className="md:col-span-1 lg:col-span-2 rounded-3xl p-4 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 shadow-2xl relative min-h-[300px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between z-10 px-4 pt-2">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-cube text-cyan-400" /> // {t("hero_3d_label")}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 60 FPS Damping
              </span>
            </div>

            <div className="w-full h-full min-h-[220px] rounded-2xl overflow-hidden my-2">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-slate-950/60 rounded-2xl">
                    <p className="text-xs font-mono text-slate-400 animate-pulse">{t("hero_loading_3d")}</p>
                  </div>
                }
              >
                <BuildingScene />
              </Suspense>
            </div>

            <div className="px-4 pb-2 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Revit + Three.js Engine</span>
              <span className="text-slate-500">{language === "en" ? "Interactive orbit & damping" : "Cursor reactivo & Órbita"}</span>
            </div>
          </motion.div>

          {/* CARD 3: TERMINAL INTERACTIVA CLI EN VIVO */}
          <motion.div
            variants={bentoItemVariants}
            className="md:col-span-2 lg:col-span-2 flex flex-col justify-between"
          >
            <InteractiveTerminal />
          </motion.div>

          {/* CARD 4: Métrica Perfiles con Number Ticker */}
          <motion.div
            variants={bentoItemVariants}
            className="md:col-span-1 lg:col-span-1 rounded-3xl p-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
                // {language === "en" ? "DATABASE" : "BASE DE DATOS"}
              </span>
              <NumberTicker
                value={2130}
                suffix="+"
                className="text-3xl font-black text-white"
              />
              <p className="text-xs text-slate-400 mt-2">{t("hero_aisc_desc")}</p>
            </div>
            <Link
              to="/herramientas/aisc"
              className="mt-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono btn-tactile flex items-center justify-center gap-1.5"
            >
              {t("hero_aisc_link")} <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          </motion.div>

          {/* CARD 5: Experiencia con Number Ticker */}
          <motion.div
            variants={bentoItemVariants}
            className="md:col-span-1 lg:col-span-1 rounded-3xl p-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                // {t("hero_exp_label")}
              </span>
              <div className="flex items-baseline gap-1.5">
                <NumberTicker
                  value={15}
                  suffix="+"
                  className="text-3xl font-black text-white"
                />
                <span className="text-lg font-bold text-slate-300">{language === "en" ? "Years" : "Años"}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">{t("hero_exp_desc")}</p>
            </div>
            <a
              href="#about"
              className="mt-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono btn-tactile flex items-center justify-center gap-1.5"
              onClick={handleAboutScroll}
            >
              {t("hero_exp_link")} <i className="fa-solid fa-arrow-down text-[10px]" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
