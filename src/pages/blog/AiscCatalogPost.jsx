import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function AiscCatalogPost() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) setScrollProgress((winScroll / height) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareUrl   = getShareUrl("/blog/catalogo-aisc-v150-online");
  const shareTitle = encodeURIComponent(isEn ? "Online AISC v15.0 Catalog: 2,130 Structural Profiles with Metric & Imperial Units" : "Catálogo AISC v15.0 Online: 2130 perfiles estructurales con unidades métricas e imperiales");

  const FAMILIES = [
    { key: "W",     label: "Wide Flange",         count: "267", color: "text-blue-400",    icon: "fa-bars" },
    { key: "HP",    label: "Bearing Piles",        count: "48",  color: "text-indigo-400",  icon: "fa-arrows-down-to-line" },
    { key: "S",     label: "American Standard",    count: "60",  color: "text-cyan-400",    icon: "fa-bars" },
    { key: "M",     label: "Misc I-Shapes",        count: "16",  color: "text-purple-400",  icon: "fa-bars" },
    { key: "C",     label: "Channels",             count: "106", color: "text-emerald-400", icon: "fa-align-right" },
    { key: "MC",    label: "Misc Channels",        count: "106", color: "text-teal-400",    icon: "fa-align-right" },
    { key: "L",     label: "Single Angles",        count: "149", color: "text-yellow-400",  icon: "fa-sort-up" },
    { key: "WT",    label: "Tees (W)",             count: "266", color: "text-orange-400",  icon: "fa-t" },
    { key: "HSS",   label: "Hollow Sections",      count: "746", color: "text-rose-400",    icon: "fa-square" },
    { key: "PIPE",  label: "Steel Pipes",          count: "26",  color: "text-pink-400",    icon: "fa-circle-dot" },
    { key: "2L",    label: "Double Angles",        count: "298", color: "text-amber-400",   icon: "fa-equals" },
    { key: "MT/ST", label: "Misc Tees",            count: "56",  color: "text-lime-400",    icon: "fa-t" },
  ];

  const FEATURES = [
    { icon: "fa-magnifying-glass", color: "text-blue-400",    bg: "bg-blue-900/20 border-blue-800/40",    title: "Búsqueda Inteligente en Tiempo Real",   desc: "Filtra por nombre de perfil, serie o tipo en cualquier sistema de unidades. El motor procesa los 2,130 perfiles al instante." },
    { icon: "fa-ruler-combined",   color: "text-emerald-400", bg: "bg-emerald-900/20 border-emerald-800/40", title: "Vista Dual Métrico ↔ Imperial",        desc: "Alterna entre SI (mm, kg/m, cm⁴) e Imperial US (in, lb/ft, in⁴) con un clic. Ambos valores se muestran simultáneamente en las tarjetas de detalle." },
    { icon: "fa-drafting-compass", color: "text-purple-400",  bg: "bg-purple-900/20 border-purple-800/40",  title: "Diagramas SVG 2D con Cotas",           desc: "Cada perfil genera automáticamente un plano esquemático con sección transversal acotada (d, bf, tw, tf) escalado al sistema de unidades activo." },
    { icon: "fa-table-list",       color: "text-orange-400",  bg: "bg-orange-900/20 border-orange-800/40",  title: "Grilla de Propiedades Completa",       desc: "Consulta todas las propiedades: A, d, bf, tw, tf, Ix, Iy, Sx, Sy, Zx, Zy, rx, ry, J, Cw y más — organizadas en tarjetas de lectura rápida." },
    { icon: "fa-calculator",       color: "text-cyan-400",    bg: "bg-cyan-900/20 border-cyan-800/40",      title: "Cubicador de Proyecto Integrado",      desc: "Agrega perfiles a tu take-off con Marca, Cantidad y Largo. Calcula el peso total por familia, aplica margen de conexiones y exporta a Excel (.xlsx)." },
    { icon: "fa-chart-pie",        color: "text-pink-400",    bg: "bg-pink-900/20 border-pink-800/40",      title: "Gráfico de Distribución por Familia",  desc: "Visualiza la composición de tu estructura con un gráfico de dona interactivo (Chart.js) que desglosa el peso por tipo de perfil." },
  ];

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Online AISC v15.0 Catalog: 2,130 Structural Profiles with Metric & Imperial Units" : "Catálogo AISC v15.0 Online: 2130 perfiles estructurales"}
        description={isEn ? "Search, filter, and quantify W, HSS, C, L, and PIPE profiles directly in your browser. Dual SI Metric ↔ US Imperial system, 2D SVG diagrams, and takeoff calculator with Excel export." : "Catálogo AISC v15.0 online con 2130 perfiles estructurales, unidades métricas e imperiales, diagramas SVG y cubicador integrado."}
        path="/blog/catalogo-aisc-v150-online"
      />
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/3 w-48 h-48 bg-emerald-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors">
              <i className="fa-solid fa-arrow-left mr-1" /> {isEn ? "Back to Blog" : "Volver al Blog"}
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-blue-700/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-database mr-1" /> Herramientas BIM
            </span>
            <span className="text-gray-400 text-sm"><i className="fa-regular fa-calendar mr-1" /> 7 Ago 2026</span>
            <span className="text-gray-400 text-sm"><i className="fa-regular fa-clock mr-1" /> {isEn ? "7 min read" : "7 min lectura"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight font-grotesk">
            {isEn ? "Online AISC v15.0 Catalog: 2,130 Structural Profiles with Metric & Imperial Units" : (
              <><span className="text-5xl">🇺🇸</span>{" "}
            Catálogo AISC v15.0 Online:{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
              2,130 Perfiles Estructurales
            </span>{" "}
            a tu alcance</>
            )}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {isEn ? "Search, filter, and quantify W, HSS, C, L, and PIPE profiles directly in your browser. Dual SI Metric ↔ US Imperial system, 2D SVG diagrams, and takeoff calculator with Excel export." : (
              <>Consulta, filtra y cubica perfiles de la norma AISC v15.0 con soporte completo de unidades
            Métricas SI e Imperial US, diagramas SVG 2D y exportación a Excel.</>
            )}
          </p>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-12 bg-[#0b1220]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          {/* Intro */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h2 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-lightbulb text-yellow-400 mr-2" /> El problema de las tablas estáticas
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Todo proyectista estructural que trabaja con norma AISC lo conoce bien: abres el{" "}
              <strong className="text-white">Steel Construction Manual</strong> o un PDF de la v15.0, buscas
              el perfil, lees el valor en pulgadas y luego haces la conversión a milímetros a mano. Un proceso
              que se repite decenas de veces al día.
            </p>
            <p className="text-slate-400 leading-relaxed mb-4">
              A eso se suma la fragmentación: la cubicación en una planilla Excel aparte, los diagramas de
              sección en AutoCAD, y la verificación de propiedades en otra ventana.{" "}
              <strong className="text-white">Demasiados pasos para una tarea rutinaria.</strong>
            </p>
            <p className="text-slate-400 leading-relaxed mb-0">
              Por eso creé el <strong className="text-blue-400">Catálogo AISC v15.0</strong> integrado en
              nuestras Herramientas BIM: un módulo que concentra búsqueda, propiedades, visualización 2D,
              conversión de unidades y cubicación en una sola pantalla — directamente en el navegador.
            </p>

            {/* FIGURA 1: AISC CATALOG INTERFACE */}
            <figure className="my-8 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
              <img
                src={asset("/assets/img/blog/news/aisc_catalog_v15_interface.png")}
                alt="Interfaz web del Catálogo de Perfiles de Acero Estructural AISC v15.0"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800">
                <i className="fa-solid fa-camera mr-1 text-blue-400" /> {isEn ? "Figure 1:" : "Figura 1:"} Módulo interactivo del Catálogo AISC v15.0 con selector de familias (W, HSS, C, L), diagrama SVG paramétrico acotado y tabla de propiedades mecánicas.
              </figcaption>
            </figure>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { val: "2,130", label: "Perfiles totales",        icon: "fa-database",    color: "text-blue-400" },
              { val: "13",    label: "Familias AISC",           icon: "fa-layer-group", color: "text-purple-400" },
              { val: "166",   label: "Propiedades por perfil",  icon: "fa-list",        color: "text-emerald-400" },
              { val: "2",     label: "Sistemas de unidades",    icon: "fa-ruler",       color: "text-orange-400" },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-center">
                <i className={`fa-solid ${stat.icon} ${stat.color} text-xl mb-2 block`} />
                <span className={`text-3xl font-black ${stat.color} block font-grotesk`}>{stat.val}</span>
                <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Families */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 mb-10 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-white mb-2 flex items-center gap-3">
              <i className="fa-solid fa-layer-group text-purple-400" />
              <span>Las 13 Familias de Perfiles</span>
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              La base de datos fue procesada directamente desde el archivo oficial{" "}
              <code className="text-blue-300 bg-slate-900/70 px-1.5 py-0.5 rounded text-xs">
                aisc-shapes-database-v150.xlsx
              </code>{" "}
              publicado por el AISC, manteniendo fidelidad total a los valores tabulados en ambas unidades.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {FAMILIES.map(fam => (
                <div key={fam.key} className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 hover:border-slate-600 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <i className={`fa-solid ${fam.icon} ${fam.color} text-xs`} />
                    <span className={`font-black text-base font-mono ${fam.color}`}>{fam.key}</span>
                    <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded font-mono">{fam.count}</span>
                  </div>
                  <span className="text-xs text-slate-400 leading-tight block">{fam.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 mb-10 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
              <i className="fa-solid fa-star text-yellow-400" />
              <span>¿Qué hace diferente a este catálogo?</span>
            </h2>
            <div className="space-y-5">
              {FEATURES.map(f => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl border ${f.bg} flex items-center justify-center text-lg flex-shrink-0`}>
                    <i className={`fa-solid ${f.icon} ${f.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base mb-1">{f.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-0">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dual Units */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-emerald-800/40 mb-10 shadow-2xl bg-emerald-950/10">
            <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <i className="fa-solid fa-arrows-left-right text-emerald-400" />
              <span>Métrico SI ↔ Imperial US: el detalle que importa</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              La mayoría de los catálogos digitales muestran propiedades en un solo sistema de unidades. En
              proyectos que mezclan clientes, normas y softwares de diferentes países, eso no es suficiente.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-900/20 rounded-xl p-4 border border-emerald-800/40">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-emerald-400 font-black text-sm font-mono">MÉTRICO SI</span>
                  <span className="text-xs text-slate-500">(por defecto)</span>
                </div>
                <ul className="text-sm text-slate-400 space-y-1.5">
                  {[["Masa", "kg/m"], ["Dimensiones", "mm"], ["Área", "mm²"], ["Inercia", "cm⁴"], ["Módulo", "cm³"]].map(([label, unit]) => (
                    <li key={label}><i className="fa-solid fa-check text-emerald-400 mr-2 text-xs" />{label}: <strong className="text-white font-mono">{unit}</strong></li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-800/40">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-400 font-black text-sm font-mono">IMPERIAL US</span>
                  <span className="text-xs text-slate-500">(un clic)</span>
                </div>
                <ul className="text-sm text-slate-400 space-y-1.5">
                  {[["Masa", "lb/ft"], ["Dimensiones", "in"], ["Área", "in²"], ["Inercia", "in⁴"], ["Módulo", "in³"]].map(([label, unit]) => (
                    <li key={label}><i className="fa-solid fa-check text-blue-400 mr-2 text-xs" />{label}: <strong className="text-white font-mono">{unit}</strong></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-sm text-slate-400">
              <i className="fa-solid fa-circle-info text-bim-blue mr-2" />
              Las tarjetas siempre muestran <strong className="text-white">ambos valores simultáneamente</strong>:
              el sistema activo en texto grande y el alternativo como referencia secundaria. Los diagramas SVG
              también actualizan sus cotas automáticamente.
            </div>
          </div>

          {/* Cubicador */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/80 mb-10 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <i className="fa-solid fa-file-excel text-emerald-400" />
              <span>Cubicador de Proyecto y Exportación</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Arma la lista de materiales de tu estructura directamente desde el catálogo, sin salir del navegador.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { num: "1", icon: "fa-plus",             color: "text-blue-400",    title: "Agrega perfiles",         desc: "Selecciona el perfil, asigna marca/tag, ingresa cantidad y largo en metros o pies." },
                { num: "2", icon: "fa-chart-pie",         color: "text-purple-400",  title: "Visualiza la distribución", desc: "Gráfico de dona que muestra el peso por familia. Aplica un margen de conexiones personalizable." },
                { num: "3", icon: "fa-file-arrow-down",  color: "text-emerald-400", title: "Exporta a Excel",          desc: "Genera un archivo .xlsx con cubicación, pesos parciales y peso total en la unidad seleccionada." },
              ].map(step => (
                <div key={step.num} className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black ${step.color}`}>{step.num}</span>
                    <i className={`fa-solid ${step.icon} ${step.color}`} />
                    <span className="font-bold text-white text-sm">{step.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN: FUENTES Y ENLACES OFICIALES */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-800/60 mb-10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-link text-blue-400" />
              Fuentes Oficiales y Referencias AISC
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://www.aisc.org/publications/steel-construction-manual-resources/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 text-sm group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-book-bookmark" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors flex items-center justify-between">
                    <span>AISC Official Steel Manual</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    AISC Shapes Database v15.0 (ASTM Standards)
                  </div>
                </div>
              </a>

              <a
                href="https://www.aisc.org/standards/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 text-sm group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-certificate" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                    <span>AISC 360 Specification</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    Specification for Structural Steel Buildings
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl p-8 md:p-10 border border-bim-blue/30 mb-10 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-purple-950/30 text-center shadow-2xl">
            <span className="text-5xl mb-4 block">🚀</span>
            <h2 className="text-2xl font-extrabold text-white mb-3">Pruébalo ahora — gratis</h2>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              El Catálogo AISC v15.0 está disponible en nuestras Herramientas BIM sin registro, sin instalación y sin costo.
            </p>
            <Link
              to="/herramientas/aisc"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-bim-blue hover:bg-blue-500 text-white font-bold text-base shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-database" />
              Abrir Catálogo AISC v15.0
              <i className="fa-solid fa-arrow-right text-sm" />
            </Link>
          </div>

          {/* ─── SHARE BUTTONS ─── */}
          <ShareArticle url={shareUrl} title={shareTitle} />
        </div>
      </section>

      {/* Footer Nav */}
      <section className="py-12 bg-[#030712] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link to="/blog" className="inline-flex items-center text-bim-blue font-bold hover:text-blue-400 transition-colors group text-base">
            <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform" />
            {isEn ? "Back to Blog" : "Volver al Blog"}
          </Link>
          <Link to="/herramientas/aisc" className="inline-flex items-center text-slate-400 hover:text-bim-blue font-medium transition-colors text-sm">
            <i className="fa-solid fa-database mr-2" /> Abrir Catálogo AISC
          </Link>
        </div>
      </section>
    </div>
  );
}
