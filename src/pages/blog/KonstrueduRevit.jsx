import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";


export default function KonstrueduRevit() {
  

  const copyBlock = (e) => {
    const pre = e.target.closest('.code-block').querySelector('pre');
    navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
      e.target.textContent = '✓ Copiado';
      setTimeout(() => e.target.textContent = 'Copiar', 2000);
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-bim-dark min-h-screen transition-colors duration-300">
      <section className="pt-28 pb-16 px-4 bg-white dark:bg-bim-dark transition-colors duration-300 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-bim-blue rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/*  Breadcrumb  */}
        <div className="mb-6">
          <Link to="/blog" className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors">
            <i className="fa-solid fa-arrow-left mr-1"></i> Volver al Blog
          </Link>
        </div>
<div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          <span className="bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
            <i className="fa-solid fa-graduation-cap mr-1"></i> Formación BIM
          </span>
          <span className="text-gray-400 text-sm"><i className="fa-regular fa-calendar mr-1"></i> 24 Mar 2026</span>
          <span className="text-gray-400 text-sm"><i className="fa-regular fa-clock mr-1"></i> 9 min lectura</span>
        </div>
<h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-tight leading-tight">
          <span className="text-emerald-400 text-5xl">�??�??</span> Especialista BIM Konstruedu:<br />
          <span className="text-gradient-article">¿Vale la Pena?</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Analizo la especialización de 127 horas en Modelado BIM con Revit: qué incluye, para quién es, y si realmente prepara para el trabajo real en proyectos de ingeniería.
        </p>
      </div>
    </section>
{/*  Article Content  */}
    <section className="py-12 bg-gray-100 dark:bg-gray-900/30 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">
{/*  Imagen portada  */}
        <div className="mb-10 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <img
            src="../assets/img/blog/konstruedu/portada.png"
            alt="Especialización Modelado de Proyectos BIM con Revit - Konstruedu"
            className="w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
{/*  Contexto  */}
        <div className="glass-card rounded-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 mb-10">
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
            <i className="fa-solid fa-circle-info text-bim-blue mr-2"></i> Por qué escribo esto
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Con <strong className="text-gray-900 dark:text-white">15 años en obra</strong> modelando con Revit, Tekla y Navisworks en proyectos de minería, aeropuertos y hospitales, llego a un punto donde la certificación formal importa tanto como la experiencia práctica. No por ego �?�?�sino porque el mercado lo exige.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Cuando encontré la <a href="https://konstruedu.com/es/especializacion/modelado-de-proyectos-bim-con-revit-31290" target="_blank" rel="noopener noreferrer" className="text-bim-blue hover:text-blue-400 underline transition-colors">Especialización en Modelado de Proyectos BIM con Revit</a> de Konstruedu, lo primero que hice fue analizarla con ojo crítico: ¿es contenido que ya sé? ¿o hay valor real para un profesional senior?
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-0">
            Esta es mi revisión honesta �?�?�sin publicidad, sin afiliados. Solo mi perspectiva de proyectista que vive del modelado BIM.
          </p>
        </div>
{/*  Ficha técnica  */}
        <div className="glass-card rounded-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 mb-10">
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
            <i className="fa-solid fa-table-list text-cyan-400 mr-2"></i> Ficha de la Especialización
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-800/40 rounded-xl p-5 border border-gray-700/50">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Duración total</div>
              <div className="text-2xl font-extrabold text-white">127 h 54 min</div>
              <div className="text-sm text-gray-400 mt-1">1,081 sesiones · 143 módulos</div>
            </div>
            <div className="bg-gray-800/40 rounded-xl p-5 border border-gray-700/50">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cursos incluidos</div>
              <div className="text-2xl font-extrabold text-white">14 cursos</div>
              <div className="text-sm text-gray-400 mt-1">Introductorio �?�?? Avanzado</div>
            </div>
            <div className="bg-gray-800/40 rounded-xl p-5 border border-gray-700/50">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Software requerido</div>
              <div className="text-lg font-bold text-white">Revit 2024+</div>
              <div className="text-sm text-gray-400 mt-1">Navisworks 2023+ (incluido)</div>
            </div>
            <div className="bg-gray-800/40 rounded-xl p-5 border border-gray-700/50">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Precio</div>
              <div className="text-2xl font-extrabold text-emerald-400">USD $117</div>
              <div className="text-sm text-gray-400 mt-1">12 meses de acceso · Pago único</div>
            </div>
          </div>
{/*  Valoración personal  */}
          <div className="mt-6 bg-blue-900/20 rounded-xl p-5 border border-blue-800/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-bim-blue uppercase tracking-wider">Mi valoración general</span>
              <div className="flex gap-0.5">
                <i className="fa-solid fa-star rating-star text-sm"></i>
                <i className="fa-solid fa-star rating-star text-sm"></i>
                <i className="fa-solid fa-star rating-star text-sm"></i>
                <i className="fa-solid fa-star rating-star text-sm"></i>
                <i className="fa-regular fa-star text-gray-500 text-sm"></i>
              </div>
              <span className="text-white font-bold text-sm">4 / 5</span>
            </div>
            <p className="text-gray-400 text-sm mb-0">
              La relación contenido/precio es difícil de superar en el mercado hispanohablante. 127 horas por USD $117 es un costo por hora imbatible si se aprovecha bien.
            </p>
          </div>
        </div>
{/*  ¿Quéé incluye  */}
        <div className="glass-card rounded-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 mb-10">
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
            <i className="fa-solid fa-list-check text-emerald-400 mr-2"></i> ¿Qué cubre realmente el programa?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            La especialización está estructurada en <strong className="text-gray-900 dark:text-white">14 cursos</strong> que abarcan las tres grandes disciplinas del modelado BIM con Revit. No es un único curso extendido: es un recorrido completo que parte desde los fundamentos de la metodología BIM hasta el detallado avanzado.
          </p>
{/*  Grid completo de 14 cursos  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{/*  Curso 1  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_e70c0a5dad7b982157334e0ec986d95b_98643.png" alt="Introducción a la metodología BIM" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-emerald-400 mb-1">CURSO 01 · 3h 48min</div>
                <div className="text-sm font-semibold text-white leading-snug">Introducción a la metodología BIM</div>
              </div>
            </div>
{/*  Curso 2  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_cf104fe4a332cc350d22eaac2b7d1a49_92984.png" alt="Fundamentos del modelado BIM" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-emerald-400 mb-1">CURSO 02 · 5h 37min</div>
                <div className="text-sm font-semibold text-white leading-snug">Fundamentos del modelado BIM</div>
              </div>
            </div>
{/*  Curso 3  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_5897222154c4d74dd89a6dcea802f2d5_16793.jpg" alt="Modelado BIM con Revit Estructuras 2024" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-blue-400 mb-1">CURSO 03 · 13h 01min</div>
                <div className="text-sm font-semibold text-white leading-snug">Modelado BIM con Revit Estructuras 2024</div>
              </div>
            </div>
{/*  Curso 4  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_423b6af67b173d1b0565a998f89e1a9e_86962.jpg" alt="Gestión BIM de proyectos de estructuras con Revit" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-blue-400 mb-1">CURSO 04 · 7h 18min</div>
                <div className="text-sm font-semibold text-white leading-snug">Gestión BIM: Parámetros y cuantificación de estructuras</div>
              </div>
            </div>
{/*  Curso 5  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_084138b40a6b00f787460e5857e58e12_6155.png" alt="Modelado BIM con Revit Arquitectura 2024" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-purple-400 mb-1">CURSO 05 · 14h 22min</div>
                <div className="text-sm font-semibold text-white leading-snug">Modelado BIM con Revit Arquitectura 2024</div>
              </div>
            </div>
{/*  Curso 6  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_f892fe0c77028de514238ca7f5509d96_50054.jpg" alt="Modelado BIM con Revit MEP Sanitarias y Mecánicas" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-cyan-400 mb-1">CURSO 06 · 14h 20min</div>
                <div className="text-sm font-semibold text-white leading-snug">Revit MEP: Sanitarias y Mecánicas</div>
              </div>
            </div>
{/*  Curso 7  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_e79db7240edb41d73b7d6c5a03755517_58539.jpg" alt="Modelado BIM con Revit MEP Eléctricas" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-cyan-400 mb-1">CURSO 07 · 6h 07min</div>
                <div className="text-sm font-semibold text-white leading-snug">Modelado BIM con Revit MEP: Eléctricas</div>
              </div>
            </div>
{/*  Curso 8  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_744648f1d94a865a93ea198fdc4512f8_55640.png" alt="Mediciones de estructuras con Revit" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-blue-400 mb-1">CURSO 08 · 7h 07min</div>
                <div className="text-sm font-semibold text-white leading-snug">Mediciones de estructuras con Revit</div>
              </div>
            </div>
{/*  Curso 9  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_3060a963079630aa00c57b80ce0d4af7_76874.png" alt="Creación de planos estructurales y documentación BIM con Revit" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-blue-400 mb-1">CURSO 09 · 10h 20min</div>
                <div className="text-sm font-semibold text-white leading-snug">Planos estructurales y documentación BIM con Revit</div>
              </div>
            </div>
{/*  Curso 10  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_29c2594dd3f14557e61379bb38559668_32496.jpg" alt="Creación de planos arquitectónicos y documentación BIM con Revit" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-purple-400 mb-1">CURSO 10 · 11h 40min</div>
                <div className="text-sm font-semibold text-white leading-snug">Planos arquitectónicos y documentación BIM con Revit</div>
              </div>
            </div>
{/*  Curso 11  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_75a906396e6ee6d135387a0b73c3d595_50751.jpg" alt="Modelado de acero de refuerzo con REVIT avanzado" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-orange-400 mb-1">CURSO 11 · 6h 48min</div>
                <div className="text-sm font-semibold text-white leading-snug">Modelado de acero de refuerzo con Revit (avanzado)</div>
              </div>
            </div>
{/*  Curso 12  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_14a8dc1741c635e7356f8f706b4fecaa_75576.jpg" alt="Modelado BIM de estructuras metálicas con Revit" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-orange-400 mb-1">CURSO 12 · 12h 04min</div>
                <div className="text-sm font-semibold text-white leading-snug">Modelado BIM de estructuras metálicas con Revit</div>
              </div>
            </div>
{/*  Curso 13  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="https://leadgods-com.s3.amazonaws.com/imagenes/publications/12087/mediun/leadgods_4b21731dc5e265a3a02662c9f8f4461e_2880.jpg" alt="Revit Familias Paramétricas" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-yellow-400 mb-1">CURSO 13 · 11h 00min</div>
                <div className="text-sm font-semibold text-white leading-snug">Revit Familias Paramétricas</div>
              </div>
            </div>
{/*  Curso 14  */}
            <div className="course-card flex gap-3 bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50">
              <img src="../assets/img/blog/konstruedu/bim-management.jpg" alt="BIM Management" className="w-24 h-24 object-cover flex-shrink-0" loading="lazy" decoding="async" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-yellow-400 mb-1">CURSO 14 · Contenido adicional</div>
                <div className="text-sm font-semibold text-white leading-snug">BIM Management y Gestión de Proyectos</div>
              </div>
            </div>
</div>
        </div>
{/*  Mi perspectiva como profesional  */}
        <div className="glass-card rounded-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 mb-10">
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
            <i className="fa-solid fa-user-tie text-purple-400 mr-2"></i> Mi perspectiva como profesional senior
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Seré directo: <strong className="text-gray-900 dark:text-white">los primeros módulos no me van a enseñar nada nuevo.</strong> Si llevas años trabajando con Revit en proyectos reales de ingeniería, los cursos introductorios son terreno conocido. Eso no es una crítica �?�?�es lo esperable en cualquier especialización que apunta a un público amplio.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            El valor real para mí está en tres áreas específicas:
          </p>
<div className="space-y-4 mt-2">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1"><i className="fa-solid fa-check-circle"></i></span>
              <div>
                <strong className="text-gray-900 dark:text-white">Consolidación de metodología BIM formal:</strong>
                <span className="text-gray-600 dark:text-gray-400"> En el trabajo diario desarrollas atajos y hábitos propios. Volver a los fundamentos con metodología estructurada revela brechas que uno ni sabía que tenía.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1"><i className="fa-solid fa-check-circle"></i></span>
              <div>
                <strong className="text-gray-900 dark:text-white">Disciplinas que no son tu especialidad:</strong>
                <span className="text-gray-600 dark:text-gray-400"> Soy especialista en estructuras. El módulo MEP me da vocabulario y criterio para coordinar mejor con otros especialistas, sin tener que convertirme en instalador.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1"><i className="fa-solid fa-check-circle"></i></span>
              <div>
                <strong className="text-gray-900 dark:text-white">Certificación internacional reconocida:</strong>
                <span className="text-gray-600 dark:text-gray-400"> Konstruedu tiene presencia en Chile, México, Colombia y España. En un mercado donde los empleadores buscan credenciales verificables, una certificación de especialista tiene peso real en el CV.</span>
              </div>
            </div>
          </div>
{/*  Callout honesto  */}
          <div className="bg-yellow-900/20 rounded-xl p-6 border border-yellow-800/30 mt-6">
            <h4 className="font-bold text-yellow-400 text-sm mb-2">
              <i className="fa-solid fa-triangle-exclamation mr-1"></i> Lo que no te dirán en la página de ventas:
            </h4>
            <p className="text-gray-400 text-sm mb-0">
              127 horas es un número enorme, pero la velocidad de avance depende completamente de tu disciplina. Sin un proyecto real que lo sustente, existe riesgo de completar módulos sin internalizar el flujo de trabajo. Mi recomendación: estudia en paralelo con un proyecto propio, aunque sea ficticio.
            </p>
          </div>
        </div>
{/*  Para quién es  */}
        <div className="glass-card rounded-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 mb-10">
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
            <i className="fa-solid fa-users text-bim-blue mr-2"></i> ¿Para quién es esta especialización?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-900/20 rounded-xl p-5 border border-emerald-800/30">
              <div className="font-bold text-emerald-400 text-sm mb-3 uppercase tracking-wider"><i className="fa-solid fa-circle-check mr-1"></i> Ideal si eres:</div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><i className="fa-solid fa-chevron-right text-emerald-500 mr-2 text-xs"></i>Dibujante técnico que quiere entrar al mundo BIM</li>
                <li><i className="fa-solid fa-chevron-right text-emerald-500 mr-2 text-xs"></i>Arquitecto o ingeniero que usa CAD y necesita migrar a Revit</li>
                <li><i className="fa-solid fa-chevron-right text-emerald-500 mr-2 text-xs"></i>Especialista en una disciplina que quiere ampliar a otras</li>
                <li><i className="fa-solid fa-chevron-right text-emerald-500 mr-2 text-xs"></i>Profesional con experiencia que busca certificación formal</li>
              </ul>
            </div>
            <div className="bg-red-900/20 rounded-xl p-5 border border-red-800/30">
              <div className="font-bold text-red-400 text-sm mb-3 uppercase tracking-wider"><i className="fa-solid fa-circle-xmark mr-1"></i> Quizás no es para ti si:</div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><i className="fa-solid fa-chevron-right text-red-500 mr-2 text-xs"></i>Solo buscas aprender automatización (Python/Dynamo)</li>
                <li><i className="fa-solid fa-chevron-right text-red-500 mr-2 text-xs"></i>Tu foco es Tekla Structures o Advance Steel exclusivamente</li>
                <li><i className="fa-solid fa-chevron-right text-red-500 mr-2 text-xs"></i>Ya tienes 10+ años en Revit y dominas las 3 disciplinas</li>
                <li><i className="fa-solid fa-chevron-right text-red-500 mr-2 text-xs"></i>Buscas formación específica en Revit API o scripting</li>
              </ul>
            </div>
          </div>
        </div>
{/*  Proceso de certificación  */}
        <div className="glass-card rounded-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 mb-10">
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
            <i className="fa-solid fa-medal text-yellow-400 mr-2"></i> El proceso de certificación
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Lo que diferencia a Konstruedu de un curso de plataforma genérica es el <strong className="text-gray-900 dark:text-white">proyecto integrador de certificación</strong>. No basta con ver los videos: debes entregar un proyecto que demuestre las competencias de todos los cursos, y el equipo docente lo revisa y aprueba �?�?�o te da feedback para mejorar.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-0">
            Este sistema iterativo (entrega �?�?? revisión �?�?? corrección) es lo más parecido a la dinámica de trabajo real en un proyecto BIM. Que un instructor revise tu modelo y te diga por qué está mal o bien es un diferenciador real frente a los MOOCs masivos.
          </p>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="text-center bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
              <div className="text-3xl font-extrabold text-bim-blue">24/7</div>
              <div className="text-sm text-gray-400 mt-1">Acceso a contenidos</div>
            </div>
            <div className="text-center bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
              <div className="text-3xl font-extrabold text-emerald-400">12</div>
              <div className="text-sm text-gray-400 mt-1">Meses de acceso</div>
            </div>
            <div className="text-center bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
              <div className="text-3xl font-extrabold text-yellow-400">Q&A</div>
              <div className="text-sm text-gray-400 mt-1">Sesiones en vivo + tutoría diaria</div>
            </div>
          </div>
        </div>
{/*  Veredicto final  */}
        <div className="glass-card rounded-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 mb-10">
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
            <i className="fa-solid fa-scale-balanced text-orange-400 mr-2"></i> Veredicto: sí, vale la pena �?�?� con matices
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            A <strong className="text-gray-900 dark:text-white">USD $117 por 127 horas de formación</strong>, más acceso a tutorías y certificación internacional, la ecuación económica es clara: no existe en el mercado hispanohablante una oferta comparable en esa relación costo-contenido.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-0">
            Para un proyectista que busca escalar de CAD a BIM, o consolidar su formación multidisciplinar, esta especialización es un camino sólido. Para un profesional senior como yo, el valor está en la certificación formal y en los módulos de disciplinas secundarias �?�?�no en los fundamentos, que ya están internalizados desde hace años.
          </p>
        </div>
{/*  CTA  */}
        <div className="glass-card rounded-2xl p-8 md:p-10 border border-emerald-800/40 border-l-4 border-l-emerald-500 mb-10 text-center">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3">
            ¿Quieres revisar el programa completo?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Visita la página oficial de Konstruedu para ver el temario detallado de los 14 cursos, los instructores y las opciones de pago disponibles.
          </p>
          <a
            href="https://konstruedu.com/es/especializacion/modelado-de-proyectos-bim-con-revit-31290"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-graduation-cap"></i>
            Ver Especialización en Konstruedu
            <i className="fa-solid fa-arrow-up-right-from-square text-xs opacity-80"></i>
          </a>
        </div>
{/*  Conclusiones clave  */}
        <div className="glass-card rounded-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 border-l-4 border-l-bim-blue">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4">
            <i className="fa-solid fa-lightbulb text-yellow-400 mr-2"></i> Conclusiones Clave
          </h3>
          <ul className="space-y-3 mb-0">
            <li className="flex items-start text-gray-600 dark:text-gray-400">
              <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
              <span><strong className="text-gray-900 dark:text-white">127 horas reales</strong> cubriendo estructuras, arquitectura y MEP �?�?� el programa más completo de Konstruedu en Revit.</span>
            </li>
            <li className="flex items-start text-gray-600 dark:text-gray-400">
              <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
              <span><strong className="text-gray-900 dark:text-white">Certificación con proyecto integrador</strong> revisado por instructores �?�?� no solo badges automáticos.</span>
            </li>
            <li className="flex items-start text-gray-600 dark:text-gray-400">
              <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
              <span><strong className="text-gray-900 dark:text-white">USD $117 por acceso completo</strong> �?�?� la mejor relación costo/contenido BIM en español que he encontrado.</span>
            </li>
            <li className="flex items-start text-gray-600 dark:text-gray-400">
              <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
              <span><strong className="text-gray-900 dark:text-white">Aplícalo en paralelo</strong> con un proyecto real. La especialización sola no construye experiencia �?�?� la práctica constante sí.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    </div>
  );
}
