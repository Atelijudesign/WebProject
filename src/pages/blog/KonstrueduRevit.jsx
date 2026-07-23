import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function KonstrueduRevit() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent("Especialista Modelador BIM Konstruedu: ¿Vale la pena? Mi análisis honesto");

  return (
    <div className="bg-bim-dark min-h-screen text-slate-300 font-sans transition-colors duration-300">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Article Hero */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/40 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-bim-blue rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/blog"
              className="inline-flex items-center text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2" /> Volver al Blog
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-graduation-cap mr-1" /> Formación BIM
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-calendar mr-1" /> 24 Mar 2026
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-clock mr-1" /> 9 min lectura
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight font-head">
            <span className="text-emerald-400 text-5xl">🎓</span> Especialista BIM Konstruedu:
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              ¿Vale la Pena?
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Analizo la especialización de 127 horas en Modelado BIM con Revit: qué incluye, para quién es, y si realmente prepara para el trabajo real en proyectos de ingeniería.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-[#0b1220]/60 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Cover Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-800/60 shadow-2xl">
            <img
              src="/assets/img/blog/konstruedu/portada.webp"
              alt="Especialización Modelado de Proyectos BIM con Revit - Konstruedu"
              className="w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Context Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/50 backdrop-blur-md">
            <h3 className="text-2xl font-extrabold text-white mb-4 font-head flex items-center">
              <i className="fa-solid fa-circle-info text-bim-blue mr-3" /> Por qué escribo esto
            </h3>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                Con <strong className="text-white font-semibold">15 años en obra</strong> modelando con Revit, Tekla y Navisworks en proyectos de minería, aeropuertos y hospitales, llego a un punto donde la certificación formal importa tanto como la experiencia práctica. No por ego — sino porque el mercado lo exige.
              </p>
              <p>
                Cuando encontré la{" "}
                <a
                  href="https://konstruedu.com/es/especializacion/modelado-de-proyectos-bim-con-revit-31290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bim-blue hover:text-blue-400 underline transition-colors"
                >
                  Especialización en Modelado de Proyectos BIM con Revit
                </a>{" "}
                de Konstruedu, lo primero que hice fue analizarla con ojo crítico: ¿es contenido que ya sé? ¿o hay valor real para un profesional senior?
              </p>
              <p className="mb-0">
                Esta es mi revisión honesta — sin publicidad, sin afiliados. Solo mi perspectiva de proyectista que vive del modelado BIM.
              </p>
            </div>
          </div>

          {/* Ficha Técnica Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/50 backdrop-blur-md">
            <h3 className="text-2xl font-extrabold text-white mb-6 font-head flex items-center">
              <i className="fa-solid fa-table-list text-cyan-400 mr-3" /> Ficha de la Especialización
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800/80">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Duración total</div>
                <div className="text-2xl font-extrabold text-white">127 h 54 min</div>
                <div className="text-sm text-slate-400 mt-1">1,081 sesiones · 143 módulos</div>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800/80">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cursos incluidos</div>
                <div className="text-2xl font-extrabold text-white">14 cursos</div>
                <div className="text-sm text-slate-400 mt-1">Introductorio → Avanzado</div>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800/80">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Software requerido</div>
                <div className="text-lg font-bold text-white">Revit 2024+</div>
                <div className="text-sm text-slate-400 mt-1">Navisworks 2023+ (incluido)</div>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800/80">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Precio</div>
                <div className="text-2xl font-extrabold text-emerald-400">USD $117</div>
                <div className="text-sm text-slate-400 mt-1">12 meses de acceso · Pago único</div>
              </div>
            </div>

            {/* Overall Rating */}
            <div className="mt-6 bg-blue-900/20 rounded-xl p-5 border border-blue-800/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-bim-blue uppercase tracking-wider">Mi valoración general</span>
                <div className="flex gap-1 text-amber-400">
                  <i className="fa-solid fa-star text-sm" />
                  <i className="fa-solid fa-star text-sm" />
                  <i className="fa-solid fa-star text-sm" />
                  <i className="fa-solid fa-star text-sm" />
                  <i className="fa-regular fa-star text-slate-600 text-sm" />
                </div>
                <span className="text-white font-bold text-sm ml-1">4 / 5</span>
              </div>
              <p className="text-slate-400 text-sm mb-0">
                La relación contenido/precio es difícil de superar en el mercado hispanohablante. 127 horas por USD $117 es un costo por hora imbatible si se aprovecha bien.
              </p>
            </div>
          </div>

          {/* Program Content Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/50 backdrop-blur-md">
            <h3 className="text-2xl font-extrabold text-white mb-4 font-head flex items-center">
              <i className="fa-solid fa-list-check text-emerald-400 mr-3" /> ¿Qué cubre realmente el programa?
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              La especialización está estructurada en <strong className="text-white">14 cursos</strong> que abarcan las tres grandes disciplinas del modelado BIM con Revit. No es un único curso extendido: es un recorrido completo que parte desde los fundamentos de la metodología BIM hasta el detallado avanzado.
            </p>

            {/* 14 Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Course 1 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_e70c0a5dad7b982157334e0ec986d95b_98643.png" alt="Introducción a la metodología BIM" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-emerald-400 mb-1">CURSO 01 · 3h 48min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Introducción a la metodología BIM</div>
                </div>
              </div>

              {/* Course 2 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_cf104fe4a332cc350d22eaac2b7d1a49_92984.png" alt="Fundamentos del modelado BIM" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-emerald-400 mb-1">CURSO 02 · 5h 37min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Fundamentos del modelado BIM</div>
                </div>
              </div>

              {/* Course 3 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_5897222154c4d74dd89a6dcea802f2d5_16793.jpg" alt="Modelado BIM con Revit Estructuras 2024" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-blue-400 mb-1">CURSO 03 · 13h 01min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Modelado BIM con Revit Estructuras 2024</div>
                </div>
              </div>

              {/* Course 4 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_423b6af67b173d1b0565a998f89e1a9e_86962.jpg" alt="Gestión BIM de proyectos de estructuras" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-blue-400 mb-1">CURSO 04 · 7h 18min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Gestión BIM: Parámetros y cuantificación</div>
                </div>
              </div>

              {/* Course 5 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_084138b40a6b00f787460e5857e58e12_6155.png" alt="Modelado BIM con Revit Arquitectura 2024" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-purple-400 mb-1">CURSO 05 · 14h 22min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Modelado BIM con Revit Arquitectura 2024</div>
                </div>
              </div>

              {/* Course 6 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_f892fe0c77028de514238ca7f5509d96_50054.jpg" alt="Modelado BIM con Revit MEP Sanitarias y Mecánicas" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-cyan-400 mb-1">CURSO 06 · 14h 20min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Revit MEP: Sanitarias y Mecánicas</div>
                </div>
              </div>

              {/* Course 7 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_e79db7240edb41d73b7d6c5a03755517_58539.jpg" alt="Modelado BIM con Revit MEP Eléctricas" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-cyan-400 mb-1">CURSO 07 · 6h 07min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Modelado BIM con Revit MEP: Eléctricas</div>
                </div>
              </div>

              {/* Course 8 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_744648f1d94a865a93ea198fdc4512f8_55640.png" alt="Mediciones de estructuras con Revit" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-blue-400 mb-1">CURSO 08 · 7h 07min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Mediciones de estructuras con Revit</div>
                </div>
              </div>

              {/* Course 9 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_3060a963079630aa00c57b80ce0d4af7_76874.png" alt="Planos estructurales y documentación BIM" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-blue-400 mb-1">CURSO 09 · 10h 20min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Planos estructurales y documentación</div>
                </div>
              </div>

              {/* Course 10 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_29c2594dd3f14557e61379bb38559668_32496.jpg" alt="Planos arquitectónicos y documentación BIM" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-purple-400 mb-1">CURSO 10 · 11h 40min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Planos arquitectónicos y documentación</div>
                </div>
              </div>

              {/* Course 11 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_75a906396e6ee6d135387a0b73c3d595_50751.jpg" alt="Modelado de acero de refuerzo con REVIT" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-amber-400 mb-1">CURSO 11 · 6h 48min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Modelado de acero de refuerzo (avanzado)</div>
                </div>
              </div>

              {/* Course 12 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_14a8dc1741c635e7356f8f706b4fecaa_75576.jpg" alt="Modelado BIM de estructuras metálicas" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-amber-400 mb-1">CURSO 12 · 12h 04min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Modelado BIM de estructuras metálicas</div>
                </div>
              </div>

              {/* Course 13 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_4b21731dc5e265a3a02662c9f8f4461e_2880.jpg" alt="Revit Familias Paramétricas" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-yellow-400 mb-1">CURSO 13 · 11h 00min</div>
                  <div className="text-sm font-semibold text-white leading-snug">Revit Familias Paramétricas</div>
                </div>
              </div>

              {/* Course 14 */}
              <div className="flex gap-3 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <img src="/assets/img/blog/konstruedu/bim-management.jpg" alt="BIM Management" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <div className="text-xs font-bold text-yellow-400 mb-1">CURSO 14 · Contenido adicional</div>
                  <div className="text-sm font-semibold text-white leading-snug">BIM Management y Gestión de Proyectos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Perspective Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/50 backdrop-blur-md">
            <h3 className="text-2xl font-extrabold text-white mb-4 font-head flex items-center">
              <i className="fa-solid fa-user-tie text-purple-400 mr-3" /> Mi perspectiva como profesional senior
            </h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              Seré directo: <strong className="text-white">los primeros módulos no me van a enseñar nada nuevo.</strong> Si llevas años trabajando con Revit en proyectos reales de ingeniería, los cursos introductorios son terreno conocido. Eso no es una crítica — es lo esperable en cualquier especialización que apunta a un público amplio.
            </p>
            <p className="text-slate-400 leading-relaxed mb-4">
              El valor real para mí está en tres áreas específicas:
            </p>

            <div className="space-y-4 mt-2">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1"><i className="fa-solid fa-check-circle" /></span>
                <div>
                  <strong className="text-white font-semibold">Consolidación de metodología BIM formal:</strong>
                  <span className="text-slate-400"> En el trabajo diario desarrollas atajos y hábitos propios. Volver a los fundamentos con metodología estructurada revela brechas que uno ni sabía que tenía.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1"><i className="fa-solid fa-check-circle" /></span>
                <div>
                  <strong className="text-white font-semibold">Disciplinas que no son tu especialidad:</strong>
                  <span className="text-slate-400"> Soy especialista en estructuras. El módulo MEP me da vocabulario y criterio para coordinar mejor con otros especialistas, sin tener que convertirme en instalador.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1"><i className="fa-solid fa-check-circle" /></span>
                <div>
                  <strong className="text-white font-semibold">Certificación internacional reconocida:</strong>
                  <span className="text-slate-400"> Konstruedu tiene presencia en Chile, México, Colombia y España. En un mercado donde los empleadores buscan credenciales verificables, una certificación de especialista tiene peso real en el CV.</span>
                </div>
              </div>
            </div>

            {/* Warning Callout */}
            <div className="bg-amber-950/30 rounded-xl p-6 border border-amber-800/40 mt-6">
              <h4 className="font-bold text-amber-400 text-sm mb-2 flex items-center">
                <i className="fa-solid fa-triangle-exclamation mr-2" /> Lo que no te dirán en la página de ventas:
              </h4>
              <p className="text-slate-300 text-sm mb-0 leading-relaxed">
                127 horas es un número enorme, pero la velocidad de avance depende completamente de tu disciplina. Sin un proyecto real que lo sustente, existe riesgo de completar módulos sin internalizar el flujo de trabajo. Mi recomendación: estudia en paralelo con un proyecto propio, aunque sea ficticio.
              </p>
            </div>
          </div>

          {/* Target Audience Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/50 backdrop-blur-md">
            <h3 className="text-2xl font-extrabold text-white mb-6 font-head flex items-center">
              <i className="fa-solid fa-users text-bim-blue mr-3" /> ¿Para quién es esta especialización?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-950/30 rounded-xl p-5 border border-emerald-800/40">
                <div className="font-bold text-emerald-400 text-sm mb-3 uppercase tracking-wider flex items-center">
                  <i className="fa-solid fa-circle-check mr-2" /> Ideal si eres:
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-chevron-right text-emerald-500 mt-1 text-xs" />
                    <span>Dibujante técnico que quiere entrar al mundo BIM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-chevron-right text-emerald-500 mt-1 text-xs" />
                    <span>Arquitecto o ingeniero que usa CAD y necesita migrar a Revit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-chevron-right text-emerald-500 mt-1 text-xs" />
                    <span>Especialista en una disciplina que quiere ampliar a otras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-chevron-right text-emerald-500 mt-1 text-xs" />
                    <span>Profesional con experiencia que busca certificación formal</span>
                  </li>
                </ul>
              </div>

              <div className="bg-rose-950/30 rounded-xl p-5 border border-rose-800/40">
                <div className="font-bold text-rose-400 text-sm mb-3 uppercase tracking-wider flex items-center">
                  <i className="fa-solid fa-circle-xmark mr-2" /> Quizás no es para ti si:
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-chevron-right text-rose-500 mt-1 text-xs" />
                    <span>Solo buscas aprender automatización (Python/Dynamo)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-chevron-right text-rose-500 mt-1 text-xs" />
                    <span>Tu foco es Tekla Structures o Advance Steel exclusivamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-chevron-right text-rose-500 mt-1 text-xs" />
                    <span>Ya tienes 10+ años en Revit y dominas las 3 disciplinas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-chevron-right text-rose-500 mt-1 text-xs" />
                    <span>Buscas formación específica en Revit API o scripting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Certification Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/50 backdrop-blur-md">
            <h3 className="text-2xl font-extrabold text-white mb-4 font-head flex items-center">
              <i className="fa-solid fa-medal text-yellow-400 mr-3" /> El proceso de certificación
            </h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              Lo que diferencia a Konstruedu de un curso de plataforma genérica es el <strong className="text-white">proyecto integrador de certificación</strong>. No basta con ver los videos: debes entregar un proyecto que demuestre las competencias de todos los cursos, y el equipo docente lo revisa y aprueba — o te da feedback para mejorar.
            </p>
            <p className="text-slate-400 leading-relaxed mb-0">
              Este sistema iterativo (entrega → revisión → corrección) es lo más parecido a la dinámica de trabajo real en un proyecto BIM. Que un instructor revise tu modelo y te diga por qué está mal o bien es un diferenciador real frente a los MOOCs masivos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="text-center bg-slate-900/80 rounded-xl p-4 border border-slate-800/80">
                <div className="text-3xl font-extrabold text-bim-blue font-head">24/7</div>
                <div className="text-sm text-slate-400 mt-1">Acceso a contenidos</div>
              </div>
              <div className="text-center bg-slate-900/80 rounded-xl p-4 border border-slate-800/80">
                <div className="text-3xl font-extrabold text-emerald-400 font-head">12</div>
                <div className="text-sm text-slate-400 mt-1">Meses de acceso</div>
              </div>
              <div className="text-center bg-slate-900/80 rounded-xl p-4 border border-slate-800/80">
                <div className="text-3xl font-extrabold text-yellow-400 font-head">Q&A</div>
                <div className="text-sm text-slate-400 mt-1">Sesiones en vivo + tutoría diaria</div>
              </div>
            </div>
          </div>

          {/* Verdict Card */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 bg-slate-900/50 backdrop-blur-md">
            <h3 className="text-2xl font-extrabold text-white mb-4 font-head flex items-center">
              <i className="fa-solid fa-scale-balanced text-amber-400 mr-3" /> Veredicto: sí, vale la pena — con matices
            </h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              A <strong className="text-white">USD $117 por 127 horas de formación</strong>, más acceso a tutorías y certificación internacional, la ecuación económica es clara: no existe en el mercado hispanohablante una oferta comparable en esa relación costo-contenido.
            </p>
            <p className="text-slate-400 leading-relaxed mb-0">
              Para un proyectista que busca escalar de CAD a BIM, o consolidar su formación multidisciplinar, esta especialización es un camino sólido. Para un profesional senior como yo, el valor está en la certificación formal y en los módulos de disciplinas secundarias — no en los fundamentos, que ya están internalizados desde hace años.
            </p>
          </div>

          {/* CTA Banner */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-emerald-800/40 border-l-4 border-l-emerald-500 bg-slate-900/50 text-center backdrop-blur-md">
            <h3 className="text-xl font-extrabold text-white mb-3 font-head">
              ¿Quieres revisar el programa completo?
            </h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xl mx-auto">
              Visita la página oficial de Konstruedu para ver el temario detallado de los 14 cursos, los instructores y las opciones de pago disponibles.
            </p>
            <a
              href="https://konstruedu.com/es/especializacion/modelado-de-proyectos-bim-con-revit-31290"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-graduation-cap" />
              Ver Especialización en Konstruedu
              <i className="fa-solid fa-arrow-up-right-from-square text-xs opacity-80" />
            </a>
          </div>

          {/* Key Conclusions */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-bim-blue bg-slate-900/50 backdrop-blur-md">
            <h3 className="text-xl font-extrabold text-white mb-4 font-head flex items-center">
              <i className="fa-solid fa-lightbulb text-yellow-400 mr-3" /> Conclusiones Clave
            </h3>
            <ul className="space-y-3 mb-0">
              <li className="flex items-start text-slate-300">
                <span className="text-bim-blue mr-3 mt-1"><i className="fa-solid fa-check-circle" /></span>
                <span><strong className="text-white">127 horas reales</strong> cubriendo estructuras, arquitectura y MEP — el programa más completo de Konstruedu en Revit.</span>
              </li>
              <li className="flex items-start text-slate-300">
                <span className="text-bim-blue mr-3 mt-1"><i className="fa-solid fa-check-circle" /></span>
                <span><strong className="text-white">Certificación con proyecto integrador</strong> revisado por instructores — no solo badges automáticos.</span>
              </li>
              <li className="flex items-start text-slate-300">
                <span className="text-bim-blue mr-3 mt-1"><i className="fa-solid fa-check-circle" /></span>
                <span><strong className="text-white">USD $117 por acceso completo</strong> — la mejor relación costo/contenido BIM en español que he encontrado.</span>
              </li>
              <li className="flex items-start text-slate-300">
                <span className="text-bim-blue mr-3 mt-1"><i className="fa-solid fa-check-circle" /></span>
                <span><strong className="text-white">Aplícalo en paralelo</strong> con un proyecto real. La especialización sola no construye experiencia — la práctica constante sí.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Share Buttons Section */}
      <section className="py-10 bg-[#070d18] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-mono">
            <i className="fa-solid fa-share-nodes mr-2 text-bim-blue" /> Comparte este artículo
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-bold shadow-lg hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              <i className="fa-brands fa-linkedin-in" /> LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#0d5bbf] text-white text-sm font-bold shadow-lg hover:shadow-blue-400/20 transition-all hover:-translate-y-0.5"
            >
              <i className="fa-brands fa-facebook-f" /> Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-bold shadow-lg hover:shadow-slate-500/20 transition-all hover:-translate-y-0.5 border border-slate-700"
            >
              <i className="fa-brands fa-x-twitter" /> X
            </a>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 border border-slate-700"
            >
              {copied ? (
                <>
                  <i className="fa-solid fa-check text-emerald-400" /> ¡Copiado!
                </>
              ) : (
                <>
                  <i className="fa-solid fa-link" /> Copiar Link
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Article Navigation Footer */}
      <section className="py-12 bg-[#030712] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center text-bim-blue font-bold hover:text-blue-400 transition-colors group text-base"
          >
            <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al Blog
          </Link>
          <Link
            to="/#contact"
            className="inline-flex items-center text-slate-400 hover:text-bim-blue font-medium transition-colors text-sm"
          >
            <i className="fa-solid fa-envelope mr-2" /> ¿Preguntas? Contáctame
          </Link>
        </div>
      </section>
    </div>
  );
}
