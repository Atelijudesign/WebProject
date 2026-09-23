import { asset } from "../../utils/asset";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export default function PlanBimChileEstandar() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);
  const chartRef = useRef(null);

  // 1. Barra de progreso de lectura
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress((winScroll / height) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Gráfico interactivo de distribución de los 25 Usos BIM (Chart.js)
  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          "Diseño y Especialidades (10 Usos)",
          "Construcción y Fabricación (5 Usos)",
          "Planificación y Costos (5 Usos)",
          "Operación y Mantenimiento (5 Usos)"
        ],
        datasets: [
          {
            data: [10, 5, 5, 5],
            backgroundColor: [
              "rgba(59, 130, 246, 0.85)",
              "rgba(16, 185, 129, 0.85)",
              "rgba(245, 158, 11, 0.85)",
              "rgba(168, 85, 247, 0.85)"
            ],
            borderColor: [
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#a855f7"
            ],
            borderWidth: 2,
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#cbd5e1",
              font: { family: "Inter", size: 12, weight: "bold" },
              padding: 16
            }
          },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#38bdf8",
            bodyColor: "#e2e8f0",
            borderColor: "#334155",
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => ` ${context.label}: ${context.parsed} Usos BIM Oficiales`
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, []);

  const shareUrl = getShareUrl("/blog/plan-bim-chile-estandar-proyectos-publicos");
  const shareTitle = "Plan BIM Chile: Guía Definitiva del Estándar para Proyectos Públicos (SDI, PEB, 25 Usos y Roles)";

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Plan BIM Chile: Definitive Guide to the Standard for Public Projects (EIR, BEP, 25 BIM Uses & Roles)" : "Plan BIM Chile: Guía del Estándar para Proyectos Públicos · SDI, PEB y 25 Usos"}
        description={isEn ? "Comprehensive breakdown of the CORFO BIM Standard for public tenders in Chile: Information Requirements (EIR), Pre/Post-Award BEP, the 25 BIM Uses, and Roles Matrix." : "Análisis técnico del Estándar BIM para Proyectos Públicos de Planbim Corfo en Chile: Solicitud de Información (SDI), Plan de Ejecución BIM (PEB), los 25 Usos BIM, Estados de Avance (EAI) y Matriz de Roles."}
        path="/blog/plan-bim-chile-estandar-proyectos-publicos"
        keywords="Plan BIM Chile, Estándar BIM proyectos públicos, Planbim Corfo, PEB definitivo, SDI BIM, 25 usos BIM, roles BIM Chile, EAI Estados de Avance, licitaciones públicas BIM MOP MINVU"
        schema={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": "Plan BIM Chile: Guía del Estándar para Proyectos Públicos",
          "description": "Análisis exhaustivo del Estándar BIM de Corfo para licitaciones públicas en Chile: SDI, PEB de Oferta y Definitivo, 25 Usos BIM, Niveles de Desarrollo EAI y los 5 Roles estandarizados.",
          "inLanguage": "es",
          "author": {
            "@type": "Person",
            "name": "Andrés Gallo P.",
            "jobTitle": "Proyectista Estructural BIM",
            "url": "https://atelijudesign.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Atelijudesign",
            "url": "https://atelijudesign.com"
          },
          "datePublished": "2026-08-26",
          "dateModified": "2026-08-26"
        }}
      />

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors">
              <i className="fa-solid fa-arrow-left mr-1" /> {isEn ? "Back to Blog" : "Volver al Blog"}
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span>🇨🇱</span> Normativa Nacional
            </span>
            <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-file-contract mr-1" /> Planbim CORFO
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> Agosto 2026
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "9 min read" : "9 min lectura"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight font-grotesk">
            {isEn ? "Plan BIM Chile: Definitive Guide to the Standard for Public Projects (EIR, BEP, 25 BIM Uses & Roles)" : (
              <>🇨🇱 Plan BIM Chile: <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">Guía Definitiva del Estándar</span> para Proyectos Públicos</>
            )}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isEn ? "Comprehensive breakdown of the CORFO BIM Standard for public tenders in Chile: Information Requirements (EIR), Pre/Post-Award BEP, the 25 BIM Uses, and Roles Matrix." : (
              <>Cómo estructurar la Solicitud de Información (SDI), el Plan de Ejecución BIM (PEB), los 25 Usos oficiales y la Matriz de Roles para ganar y ejecutar licitaciones públicas sin rechazos documentales.</>
            )}
          </p>

          {/* Enlaces a Fuentes Oficiales en el Hero Header */}
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://planbim.cl/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm hover:border-cyan-400"
            >
              <i className="fa-solid fa-globe text-cyan-400" />
              <span>Sitio Oficial Planbim.cl</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400" />
            </a>
            <a
              href="https://construye2025.cl/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm hover:border-emerald-400"
            >
              <i className="fa-solid fa-building text-emerald-400" />
              <span>Construye 2025 (CORFO)</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-12 bg-[#0b1220]/60 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article space-y-12">
          
          {/* 1. Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stat-card glass-card rounded-2xl p-6 border border-slate-800/60 text-center bg-slate-900/60">
              <p className="text-4xl font-extrabold text-cyan-400 mb-1">25</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Usos BIM Oficiales</p>
            </div>
            <div className="stat-card glass-card rounded-2xl p-6 border border-slate-800/60 text-center bg-slate-900/60">
              <p className="text-4xl font-extrabold text-emerald-400 mb-1">5</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Roles Estandarizados</p>
            </div>
            <div className="stat-card glass-card rounded-2xl p-6 border border-blue-500/40 text-center bg-slate-900/60">
              <p className="text-4xl font-extrabold text-blue-400 mb-1">100%</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Mandato Público (MOP / MINVU)</p>
            </div>
          </div>

          {/* FIGURA 1: INFOGRAFÍA INFRAESTRUCTURA PLAN BIM CHILE */}
          <figure className="my-8 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img
              src={asset("/assets/img/blog/plan_bim_chile/plan_bim_chile_hero.webp")}
              alt="Centro de control de infraestructura BIM con modelos 3D y cumplimiento de Estándar Plan BIM Chile"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <figcaption className="p-3.5 text-center text-xs text-slate-400 bg-slate-950/90 border-t border-slate-800 flex items-center justify-center gap-2">
              <i className="fa-solid fa-camera text-cyan-400" />
              <span>{isEn ? "Figure 1:" : "Figura 1:"} Entorno integrado de gestión y supervisión de proyectos de infraestructura pública bajo el Estándar Plan BIM Chile (CORFO / Construye 2025).</span>
            </figcaption>
          </figure>

          {/* 2. El Problema Real en Licitaciones */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/40">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <i className="fa-solid fa-triangle-exclamation text-red-400" />
              <span>El Desafío de las Licitaciones Públicas en Chile</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Durante años, cada ministerio u oficina pública en Chile (MOP, MINVU, MINSAL, CAPJ) solicitaba modelos BIM con criterios heterogéneos: parámetros inventados, nombres de archivos arbitrarios y expectativas irreales de nivel de detalle (LOD 500 para anteproyectos).
            </p>
            <p className="text-slate-400 leading-relaxed">
              Esta dispersión generaba sobrecostos, rechazos de entregas y modelos inútiles para la etapa de operación. Con la promulgación del <strong className="text-white">Estándar BIM para Proyectos Públicos</strong> por parte de <strong className="text-cyan-400">Planbim de CORFO</strong>, se fijó una regla de juego única y universal para todo el Estado de Chile.
            </p>

            <div className="callout callout-orange mt-6 p-5 rounded-xl bg-amber-950/30 border border-amber-800/40">
              <div className="font-bold text-amber-400 text-sm mb-1 flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation" />
                <span>Impacto en la Industria Nacional</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mb-0">
                La construcción representa el <strong>7,2% del PIB nacional</strong> y el <strong>10,6% del empleo en Chile</strong> (más de 870 mil trabajadores). El Estándar BIM permite erradicar la brecha de productividad detectada por McKinsey, transformando el intercambio de información entre mandantes públicos y proveedores de ingeniería.
              </p>
            </div>
          </div>

          {/* 3. Arquitectura del Flujo de Información */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/40">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <i className="fa-solid fa-network-wired text-cyan-400" />
              <span>La Tríada Documental: SDI ➔ PEB Oferta ➔ PEB Definitivo</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              El Estándar Plan BIM Chile articula el intercambio de información mediante tres instrumentos clave:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-blue-900/40 text-blue-400 text-xs font-bold font-mono">1. SDI</span>
                  <h4 className="text-base font-bold text-white mt-3 mb-2">Solicitud de Información</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Documento donde el <strong>Solicitante (Mandante)</strong> define los objetivos del proyecto, los Usos BIM requeridos, los Estados de Avance (EAI) y las fechas clave.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-amber-900/40 text-amber-400 text-xs font-bold font-mono">2. PEB Oferta</span>
                  <h4 className="text-base font-bold text-white mt-3 mb-2">Plan de Ejecución (Oferta)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Propuesta del <strong>Oferente / Contratista</strong> durante la licitación, demostrando competencias técnicas, infraestructura tecnológica y roles del equipo.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-950/80 border border-emerald-500/40 flex flex-col justify-between bg-emerald-950/10">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-900/40 text-emerald-400 text-xs font-bold font-mono">3. PEB Definitivo</span>
                  <h4 className="text-base font-bold text-white mt-3 mb-2">Plan de Ejecución Definitivo</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    El documento contractual consensuado que fija la matriz de coordinación, CDE, frecuencias de intercambio y entregables finales en IFC/Nativo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Gráfico Interactivo de los 25 Usos BIM */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/40">
            <h3 className="text-2xl font-extrabold text-white mb-2 flex items-center gap-3">
              <i className="fa-solid fa-chart-pie text-emerald-400" />
              <span>Distribución de los 25 Usos BIM Oficiales</span>
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Basados en la metodología de Penn State y adaptados a la realidad chilena, los 25 Usos se distribuyen en las 4 fases del ciclo de vida del activo:
            </p>

            <div className="relative h-72 w-full my-4">
              <canvas ref={chartRef} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-blue-400 block mb-1">🎨 Fase de Diseño (10 Usos):</span>
                <span className="text-slate-400">Coordinación 3D, Diseño de especialidades, Revisión de diseño, Análisis estructural, Lumínico, Energético, Mecánico, Sustentabilidad y Validación normativa.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">🏗️ Fase de Construcción (5 Usos):</span>
                <span className="text-slate-400">Planificación de obra (4D), Diseño de sistemas constructivos, Fabricación digital, Control de obra y Modelación As-Built.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">📊 Fase de Planificación (5 Usos):</span>
                <span className="text-slate-400">Levantamiento de condiciones existentes, Estimación de cantidades/costos (5D), Fases, Programa espacial y Ubicación.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-purple-400/40">
                <span className="font-bold text-purple-400 block mb-1">⚙️ Fase de Operación (5 Usos):</span>
                <span className="text-slate-400">Gestión de activos (7D/FM), Análisis de sistemas, Mantenimiento preventivo, Seguimiento de espacios y Gestión de emergencias.</span>
              </div>
            </div>
          </div>

          {/* 5. Matriz de los 5 Roles BIM */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/40">
            <h3 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
              <i className="fa-solid fa-users-gear text-purple-400" />
              <span>Matriz Oficial de Roles BIM (Planbim Chile)</span>
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-950/80 text-blue-400 flex items-center justify-center font-bold font-mono shrink-0">01</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dirección en BIM</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-0">Lidera la estrategia organizacional o del proyecto, valida la SDI y aprueba el PEB definitivo.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-950/80 text-cyan-400 flex items-center justify-center font-bold font-mono shrink-0">02</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Revisión en BIM</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-0">Audita visual y paramétricamente la información recibida respecto a los requisitos de la SDI sin modificar el modelo.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">03</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Modelado en BIM</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-0">Desarrolla la geometría y carga los datos no geométricos (parámetros TDI) en la disciplina correspondiente.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center font-bold font-mono shrink-0">04</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Coordinación en BIM</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-0">Integra los modelos de distintas especialidades, detecta interferencias espaciales y genera informes BCF de colisiones.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-950/80 text-purple-400 flex items-center justify-center font-bold font-mono shrink-0">05</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Gestión en BIM</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-0">Define los flujos de trabajo, administra el Entorno Común de Datos (CDE), supervisa el cumplimiento del PEB y lidera la estandarización técnica.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Matriz de Información No Geométrica (TDI) */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/40">
            <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-3">
              <i className="fa-solid fa-table-list text-cyan-400" />
              <span>Matriz de Tipos de Información (TDI) y Parámetros Exigidos</span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              El Estándar establece que los elementos del modelo (vigas, pilares, muros, losas) deben contener conjuntos de propiedades no geométricas (TDI) asociadas al Estado de Avance de la Información (EAI):
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-950 text-slate-200 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Parámetro Oficial</th>
                    <th className="p-3">Descripción Técnica</th>
                    <th className="p-3">Tipo de Dato</th>
                    <th className="p-3">Disciplina</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-300">BIM_TipoElemento</td>
                    <td className="p-3">Clasificación uniforme del elemento (viga, pilar, zapata).</td>
                    <td className="p-3 font-mono text-slate-400">Texto</td>
                    <td className="p-3">Todas</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-300">BIM_EstadoAvance</td>
                    <td className="p-3">Nivel de desarrollo de información (EAI-1 a EAI-5).</td>
                    <td className="p-3 font-mono text-slate-400">Texto / Lista</td>
                    <td className="p-3">Todas</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-300">BIM_CodigoZona</td>
                    <td className="p-3">Sectorización, eje estructural o nivel del edificio.</td>
                    <td className="p-3 font-mono text-slate-400">Texto</td>
                    <td className="p-3">Todas</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-300">BIM_ResponsableModelado</td>
                    <td className="p-3">Identificación del autor o rol de modelado.</td>
                    <td className="p-3 font-mono text-slate-400">Texto</td>
                    <td className="p-3">Gestión</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-cyan-300">BIM_CodigoPartida</td>
                    <td className="p-3">Ítem de presupuesto según especificaciones técnicas.</td>
                    <td className="p-3 font-mono text-slate-400">Texto / Código</td>
                    <td className="p-3">Estructura / Costos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. Conclusiones Clave */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/40">
            <h3 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
              <i className="fa-solid fa-lightbulb text-yellow-400" />
              <span>Conclusiones y Recomendaciones para la Oficina Técnica</span>
            </h3>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-circle-check text-blue-400 mt-1 text-base shrink-0" />
                <span><strong>No sobre-modelar:</strong> Solicitar o modelar un EAI superior al requerido por la etapa del proyecto solo incrementa costos sin aportar valor real.</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-circle-check text-emerald-400 mt-1 text-base shrink-0" />
                <span><strong>OpenBIM como estándar de entrega:</strong> Todo entregable público exige exportación en formato neutral <strong>IFC (ISO 16739)</strong> para asegurar la soberanía de los datos a lo largo de los 50 años de vida útil de la obra.</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-circle-check text-cyan-400 mt-1 text-base shrink-0" />
                <span><strong>Plantillas PEB Oficiales:</strong> Utiliza siempre las plantillas oficiales de Excel de Planbim para el PEB de Oferta y Definitivo para acelerar las revisiones del mandante.</span>
              </li>
            </ul>
          </div>

          {/* 8. Fuentes Oficiales y Documentación */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-800/60 bg-slate-900/40">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-link text-orange-400" />
              <span>Documentos Oficiales y Referencias</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href="https://planbim.cl/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-400 transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">Portal Oficial Planbim Chile</p>
                  <p className="text-slate-400 mt-0.5">Estándar BIM y recursos oficiales CORFO</p>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square text-cyan-400 text-sm" />
              </a>

              <a
                href="https://construye2025.cl/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-400 transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">Iniciativa Construye 2025</p>
                  <p className="text-slate-400 mt-0.5">Estrategia Nacional de Productividad y Sustentabilidad</p>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square text-emerald-400 text-sm" />
              </a>
            </div>
          </div>

          {/* Barra de Compartir Estandarizada */}
          <ShareArticle title={shareTitle} url={shareUrl} />

        </div>
      </section>

      {/* Footer Nav */}
      <section className="py-12 bg-[#030712] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <Link to="/blog" className="inline-flex items-center text-bim-blue font-bold hover:text-blue-400 transition-colors group text-base">
            <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform" />
            {isEn ? "Back to Blog" : "Volver al Blog"}
          </Link>
          <Link to="/herramientas" className="inline-flex items-center text-slate-400 hover:text-bim-blue font-medium transition-colors text-sm">
            <i className="fa-solid fa-cube mr-2" /> Explorar Herramientas BIM
          </Link>
        </div>
      </section>
    </div>
  );
}
