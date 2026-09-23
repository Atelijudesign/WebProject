import { asset } from "../../utils/asset";
import { useState, useEffect } from "react";
import { useTranslation } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import SEOHead, { getShareUrl } from "../../components/SEOHead";
import ShareArticle from "../../components/ShareArticle";

export const MiningDigitalTwins = () => {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [scrollProgress, setScrollProgress] = useState(0);

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

  const shareUrl = getShareUrl("/blog/gemelos-digitales-prefabricacion-modular-mineria");
  const shareTitle = encodeURIComponent(isEn ? "Digital Twins & Modular Prefabrication in Mining: From 3D Laser Scanning to Off-Site Assembly" : "Gemelos Digitales y Prefabricación Modular en Minería: Del Escaneo 3D al Montaje Off-Site");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      <SEOHead
        title={isEn ? "Digital Twins & Modular Prefabrication in Mining: From 3D Laser Scanning to Off-Site Assembly" : "Gemelos Digitales y Prefabricación Modular en Minería: Del Escaneo 3D al Montaje Off-Site"}
        description={isEn ? "How the convergence of LiDAR point clouds, federated structural models, and IoT sensors is transforming the construction of mining processing and crushing plants." : "Cómo la convergencia de nubes de puntos LiDAR, modelos estructurales federados y sensores IoT está revolucionando la construcción y montaje de plantas mineras e industriales."}
        path="/blog/gemelos-digitales-prefabricacion-modular-mineria"
        keywords="Minería 4.0, Gemelos Digitales, Prefabricación Modular, LiDAR, Escaneo 3D, Estructuras Metálicas, Tekla Structures, IoT, AISC, Codelco"
      />
      
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-400 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* HERO SECTION */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/60 transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors inline-flex items-center gap-1">
              <i className="fa-solid fa-arrow-left text-xs" /> {isEn ? "Back to Blog" : "Volver al Blog"}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-amber-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-industry mr-1" /> Minería 4.0 · Modular Off-Site
            </span>
            <span className="bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-cubes-stacked mr-1" /> LiDAR & Digital Twins
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 30 Ago 2026
            </span>
            <span className="text-slate-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> {isEn ? "9 min read" : "9 min lectura"}
            </span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-2.5 py-0.5 rounded-full font-mono">
              Tekla & IoT
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 text-gradient-article">
            {isEn ? "Digital Twins & Modular Prefabrication in Mining: From 3D Laser Scanning to Off-Site Assembly" : (
              <>🏭 Gemelos Digitales y <span className="text-amber-400">Prefabricación Modular</span> en Minería: Del Escaneo 3D al Montaje Off-Site</>
            )}
          </h1>

          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {isEn ? "How the convergence of LiDAR point clouds, federated structural models, and IoT sensors is transforming the construction of mining processing and crushing plants." : (
              <>Construir a más de 4.000 metros de altura en los Andes exige trasladar la mayor cantidad de trabajo fuera de la faena. Analizamos cómo el escaneo láser 3D en taller, los modelos estructurales milimétricos y la telemetría IoT crean gemelos digitales que aseguran montajes sin interferencias.</>
            )}
          </p>

          {/* BOTONES DE ENLACES OFICIALES / FUENTES */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://eracore.com/bim-trends-2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-amber-400 font-bold shadow-lg hover:text-amber-300 hover:border-amber-500/60 transition-all"
            >
              <i className="fa-solid fa-newspaper" /> Fuente: EraCore BIM Trends 2026 (Mining & Twins)
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
            <a
              href="https://www.tekla.com/products/tekla-structures"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-cyan-400 font-bold shadow-lg hover:text-cyan-300 hover:border-cyan-500/60 transition-all"
            >
              <i className="fa-solid fa-cube" /> Trimble: Tekla Structures Steel & LOD 400
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* STATS IMPACT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-amber-400 font-mono text-3xl font-bold mb-1">-65%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Retrabajos en Montaje</div>
            <p className="text-slate-500 text-xs mt-2">Eliminación de cortes de soplete y perforaciones de ajuste en terreno gracias a la verificación láser previa en maestranza.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-emerald-400 font-mono text-3xl font-bold mb-1">-40%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Horas-Hombre en Faena</div>
            <p className="text-slate-500 text-xs mt-2">Menor exposición de personal a condiciones climáticas extremas y gran altitud geográfica (puna, viento y bajas temperaturas).</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-cyan-400 font-mono text-3xl font-bold mb-1">100%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Trazabilidad As-Built</div>
            <p className="text-slate-500 text-xs mt-2">Cada módulo llega con su gemelo digital sincronizado: torque registrado, escaneo 3D y especificación de recubrimientos.</p>
          </div>
        </div>

        {/* SECCIÓN 1: EL DESAFÍO DE LA MINERÍA DE ALTURA */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400 text-lg">⚠️</span>
            El Desafío de la Minería de Gran Altura
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-slate-300 leading-relaxed">
            <p>
              En faenas mineras ubicadas en la cordillera de Chile y Perú (como Collahuasi, Quebrada Blanca, Pelambres, Escondida o Quellaveco), los frentes de trabajo superan comúnmente los 3.800 a 4.500 metros sobre el nivel del mar. A estas altitudes, la hipoxia reduce el rendimiento físico de los trabajadores entre un 30% y un 45%, mientras que los vientos cordilleranos superiores a 90 km/h paralizan frecuentemente las maniobras de izaje con grúas de gran tonelaje.
            </p>
            <p>
              Tradicionalmente, el montaje de naves industriales pesadas (edificios de molienda SAG y bolas, transferencias de correas transportadoras y estaciones de chancado) requería miles de horas de empernado y soldadura en altura. Cualquier desalineación de apenas 5 mm entre los pernos de anclaje empotrados en las fundaciones de hormigón y las placas base de las columnas de acero provocaba paralizaciones que costaban cientos de miles de dólares por día de retraso.
            </p>
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-200 text-sm">
              <i className="fa-solid fa-circle-check mr-2 text-amber-400" />
              <strong>El cambio de paradigma:</strong> Trasladar hasta el 80% de las horas-hombre de construcción fuera de la faena (*Off-site Construction*) mediante módulos preensamblados en maestranzas a nivel del mar y validados digitalmente antes de su despacho.
            </div>
          </div>

          {/* FIGURA 1: FOTO TÉCNICA PLANTA MINERA & DIGITAL TWIN */}
          <figure className="my-8 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img 
              src={asset("/assets/img/blog/news/mining_digital_twins_modular.png")} 
              alt="Planta de procesamiento y molienda minera en la cordillera con modelo holográfico de gemelo digital y sensores IoT" 
              className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800 font-mono">
              <i className="fa-solid fa-camera mr-1 text-amber-400" /> {isEn ? "Figure 1:" : "Figura 1:"} Planta de concentración y molienda minera en la alta cordillera con superposición de gemelo digital y telemetría IoT de vibración en tiempo real.
            </figcaption>
          </figure>
        </section>

        {/* SECCIÓN 2: CONTROL DIMENSIONAL LIDAR EN MAESTRANZA */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-lg">⚙️</span>
            Prearmado Virtual y Control Dimensional LiDAR en Taller
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-slate-300 leading-relaxed">
            <p>
              Antes de autorizar el transporte por carretera de un módulo estructural que puede superar las 120 toneladas de peso, la maestranza ejecuta un <strong>escaneo láser terrestre (TLS) milimétrico</strong> sobre la pieza totalmente prearmada.
            </p>
            <p>
              La nube de puntos de alta densidad se importa en software de análisis de tolerancias y se alinea mediante el algoritmo ICP (*Iterative Closest Point*) contra el modelo nativo de fabricación (Tekla Structures LOD 400). El software genera un mapa térmico de desviaciones que evalúa:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-2 text-sm">
              <li><strong>Centros de Perforaciones de Placas Base:</strong> Verificación de que la distancia entre centros de pernos de anclaje respete la tolerancia de ±1.5 mm respecto a la plantilla de fundaciones en terreno.</li>
              <li><strong>Desviación de Aplomo (Plumbness):</strong> Comprobación de que la verticalidad de las columnas no exceda la relación 1/500 según el estándar <em>AISC Code of Standard Practice for Steel Buildings and Bridges</em>.</li>
              <li><strong>Empalmes de Módulos Contiguos:</strong> Simulación de ensamble virtual (*Virtual Trial Assembly*) entre el módulo A y el módulo B para confirmar que las cartelas de unión calzarán perfectamente sin forzado mecánico de grúa.</li>
            </ul>
          </div>

          {/* FIGURA 2: INSPECCIÓN LIDAR EN MAESTRANZA CON MAPA DE CALOR */}
          <figure className="my-8 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900">
            <img 
              src={asset("/assets/img/blog/news/mining_lidar_tolerance_inspection.png")} 
              alt="Inspección dimensional con escáner láser terrestre en maestranza con mapa de calor de tolerancias AISC" 
              className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            <figcaption className="p-3 text-center text-xs text-slate-400 bg-slate-950/80 border-t border-slate-800 font-mono">
              <i className="fa-solid fa-camera mr-1 text-emerald-400" /> {isEn ? "Figure 2:" : "Figura 2:"} Inspección láser terrestre (TLS) en taller de maestranza con mapa de calor de tolerancias dimensionales AISC (±2 mm) sobre placas y conexiones estructurales.
            </figcaption>
          </figure>
        </section>

        {/* SECCIÓN 3: EL GEMELO DIGITAL EN OPERACIÓN Y MANTENIMIENTO */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-lg">📡</span>
            Monitoreo Estructural Continuo y Telemetría IoT en Operación
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-slate-300 leading-relaxed">
            <p>
              El modelo As-Built enriquecido con los datos dimensionales del escaneo no se archiva al concluir la puesta en marcha; pasa a gobernar el <strong>Gemelo Digital de Mantenimiento Predictivo</strong> durante los 30 años de vida útil de la planta.
            </p>
            <p>
              Las estructuras que soportan equipos dinámicos severos (molinos semiautógenos SAG, harneros vibratorios, chutes de traspaso de alta abrasión y chancadores primarios) son instrumentadas con sensores industriales conectados vía MQTT y OPC-UA:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold text-sm mb-1 flex items-center gap-2">
                  <i className="fa-solid fa-wave-square" /> Acelerómetros Triaxiales de Alta Precisión
                </div>
                <p className="text-xs text-slate-400">
                  Monitoreo continuo de frecuencias de vibración y resonancia en vigas reticuladas para anticipar fallas por desalineación de poleas o impacto de rocas de gran tonelaje.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-emerald-400 font-bold text-sm mb-1 flex items-center gap-2">
                  <i className="fa-solid fa-gauge-high" /> Galgas Extensométricas IoT (Strain Gauges)
                </div>
                <p className="text-xs text-slate-400">
                  Medición de ciclos de microdeformación elástica para alimentar algoritmos de conteo Rainflow y calcular el consumo de vida útil por fatiga en uniones soldadas críticas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: CHECKLIST Y CRITERIOS PARA PROYECTISTAS ESTRUCTURALES */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-lg">💡</span>
            Criterios de Ingeniería y Tolerancias Constructivas
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-slate-300 leading-relaxed text-sm">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-check text-emerald-400 mt-1" />
              <div>
                <strong className="text-white">Diseño para Fabricación y Ensamble (DfMA):</strong> El proyectista debe diseñar las uniones considerando el izaje modular; priorizar conexiones apernadas con pernos ASTM A325 / A490 y limitar la soldadura en terreno a casos estrictamente inevitables.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-check text-emerald-400 mt-1" />
              <div>
                <strong className="text-white">Puntos de Levantamiento y Rigidez de Transporte:</strong> Todo módulo estructural debe ser modelado no solo para su condición de servicio final, sino para las fuerzas dinámicas de aceleración durante el transporte en camión cama baja y el izaje con balancín de grúa.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-check text-emerald-400 mt-1" />
              <div>
                <strong className="text-white">Compatibilidad OpenBIM IFC 4.3:</strong> Toda la información de sensores, nubes de puntos y metadatos de fabricación debe exportarse bajo esquemas OpenBIM para garantizar interoperabilidad entre Tekla, Revit, Navisworks y plataformas de operación minera.
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 5: FUENTES Y ENLACES TÉCNICOS OFICIALES */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-link text-amber-400" />{isEn ? "Official Reference & Documentation" : "Fuentes y Documentación Oficial de Referencia"}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://eracore.com/bim-trends-2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/50 transition-all flex items-start gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-amber-950/60 text-amber-400 text-base group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-newspaper" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>EraCore Global BIM Trends</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  Digital Twins, Off-site Modular & Mining 2026
                </div>
              </div>
            </a>

            <a
              href="https://www.tekla.com/products/tekla-structures"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all flex items-start gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-400 text-base group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-cube" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>Trimble Tekla Structures</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  Modelado LOD 400 y Detallamiento Estructural Minero
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* COMPARTIR Y RETORNO */}
        <div className="pt-8 border-t border-slate-800">
          <ShareArticle url={shareUrl} title={shareTitle} />
          
          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white hover:border-amber-500 hover:text-amber-300 transition-all font-medium text-sm shadow-lg hover:shadow-amber-500/10"
            >
              <i className="fa-solid fa-arrow-left" /> Volver a Todos los Artículos del Blog
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MiningDigitalTwins;
