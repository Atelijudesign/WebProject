import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { InteractiveTerminal } from "./InteractiveTerminal";

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
  hidden: { opacity: 0, y: 20, scale: 0.98 },
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

export const BentoHeroPreview = () => {
  return (
    <section className="py-16 px-4 bg-[#030712] relative overflow-hidden">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              // ARQUITECTURA BENTO GRID 2026 (MANWAR VIBE)
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Vista Previa de Arquitectura Web & UI/UX
            </h2>
          </div>
          <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <i className="fa-solid fa-wand-magic-sparkles text-cyan-400" /> HyperFrames Motion
          </span>
        </div>

        {/* ─── BENTO GRID CONTAINER ─── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={bentoContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* CARD 1: Hero Principal */}
          <motion.div
            variants={bentoItemVariants}
            className="md:col-span-2 lg:col-span-2 rounded-3xl p-5 sm:p-6 md:p-8 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 hover:shadow-cyan-500/5 transition-all duration-300 shadow-2xl flex flex-col justify-between group"
          >
            <div>
              {/* Badge Disponibilidad */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-mono mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Disponible para proyectos BIM & Software
              </div>

              {/* Título Principal */}
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                BIM Developer & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
                  Proyectista Estructural
                </span>
              </h1>

              <p className="text-slate-300 text-base leading-relaxed mb-6">
                <strong className="text-white">15+ años</strong> diseñando ingeniería real para minería, aeropuertos y estructuras complejas. Automatizo en <strong className="text-cyan-400 font-mono">Python, C# y pyRevit</strong> los procesos que otros calculan a mano.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap pt-4 border-t border-slate-800/60">
              <a
                href="#contact"
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg hover:shadow-cyan-500/25 btn-tactile flex items-center gap-2"
              >
                <i className="fa-solid fa-bolt text-yellow-300" /> Iniciar Proyecto
              </a>
              <Link
                to="/herramientas/icha"
                className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700/60 btn-tactile flex items-center gap-2"
              >
                <i className="fa-solid fa-toolbox text-cyan-400" /> Probar Herramientas Web
              </Link>
            </div>
          </motion.div>

          {/* CARD 2: Interactive Terminal (Border Beam) */}
          <motion.div
            variants={bentoItemVariants}
            className="md:col-span-1 lg:col-span-2 flex flex-col justify-between"
          >
            <InteractiveTerminal />
          </motion.div>

          {/* CARD 3: Live Quick Widget */}
          <motion.div
            variants={bentoItemVariants}
            className="md:col-span-1 lg:col-span-2 rounded-3xl p-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300 shadow-2xl"
          >
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block mb-2">// CALCULADORA EN VIVO</span>
            <h4 className="text-lg font-extrabold text-white mb-4">Cubicador Rápido Perfil ICHA</h4>

            <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Perfil Seleccionado</span>
                <span className="text-cyan-400 font-bold text-sm">H300x300x94</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Peso Lineal</span>
                <span className="text-emerald-400 font-bold text-sm">94.2 kg/m</span>
              </div>
            </div>

            <Link
              to="/herramientas/perfiles"
              className="w-full py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono btn-tactile flex items-center justify-center gap-2"
            >
              Abrir Calculadora Completa <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          </motion.div>

          {/* CARD 4: Métrica & Rendimiento */}
          <motion.div
            variants={bentoItemVariants}
            className="md:col-span-1 lg:col-span-2 rounded-3xl p-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/40 transition-all duration-300 shadow-2xl flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">// PROYECTOS BIM</span>
              <span className="text-3xl font-black text-white">2,130+</span>
              <span className="text-xs text-slate-400 block mt-1">Perfiles Estructurales AISC & ICHA Indexados</span>
            </div>
            <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 text-2xl float-gentle">
              <i className="fa-solid fa-database" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BentoHeroPreview;
