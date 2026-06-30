import React from "react";
import { Link } from "react-router-dom";

export default function PyRevitAccelerator() {
  const copyBlock = (e) => {
    const pre = e.target.closest('.code-block').querySelector('pre');
    navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
      e.target.textContent = '✓ Copiado';
      setTimeout(() => e.target.textContent = 'Copiar', 2000);
    });
  };

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      {/* Header Section */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/40 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-bim-blue rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors">
              <i className="fa-solid fa-arrow-left mr-1"></i> Volver al Blog
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-green-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-brands fa-python mr-1"></i> pyRevit
            </span>
            <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-bolt mr-1"></i> Accelerator
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-calendar mr-1"></i> 17 Feb 2026
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-clock mr-1"></i> 8 min lectura
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            <span className="text-5xl">⚡</span> pyRevit Accelerator:<br />
            <span className="text-gradient-article">Crea tu primer plugin en 5 minutos</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            El camino más rápido para crear herramientas personalizadas dentro de Revit usando Python e IronPython. Sin compilar, sin configurar Visual Studio ni archivos XML complejos.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-[#0b1220]/60 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          {/* ¿Qué es pyRevit? */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-graduation-cap text-green-400 mr-2"></i>
              ¿Qué es pyRevit?
            </h3>
            <p className="text-slate-400">
              **pyRevit** es un framework de código abierto extremadamente potente creado por Ehsan Iran-Nejad que permite escribir extensiones y scripts para Revit utilizando Python. A diferencia de las formas tradicionales que requieren compilar archivos <code className="text-green-400">.dll</code> con C# en Visual Studio, pyRevit lee tus scripts directamente en tiempo de ejecución.
            </p>
            <p className="text-slate-400 mb-0">
              Para los ingenieros estructurales y modeladores, representa el camino con la **menor barrera de entrada** para automatizar el trabajo diario, permitiendo convertir scripts simples en botones dentro del Ribbon de Revit.
            </p>
          </div>

          {/* Anatomía de una App */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-sitemap text-blue-400 mr-2"></i>
              La Anatomía de una App en pyRevit
            </h3>
            <p className="text-slate-400 mb-6">
              En pyRevit, **la estructura de carpetas ES la interfaz de usuario**. pyRevit analiza los nombres y jerarquías de las carpetas para crear las pestañas, paneles y botones dinámicamente.
            </p>
            <div className="folder-tree mb-0">
              <span className="ft-folder">MiExtension.extension/</span>      <span className="ft-comment"># Directorio raíz del plugin</span><br />
              &nbsp;&nbsp;<span className="ft-folder">Herramientas.tab/</span>      <span className="ft-comment"># Pestaña dedicada en la barra superior de Revit</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="ft-folder">Automatizacion.panel/</span>  <span className="ft-comment"># Contenedor de herramientas agrupadas</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ft-folder">MiPrimerBoton.pushbutton/</span> <span className="ft-comment"># Carpeta específica para el botón</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ft-file">script.py</span>   <span className="ft-comment"># El código Python a ejecutar</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ft-file">icon.png</span>    <span className="ft-comment"># El ícono visible en Revit (PNG de 32x32)</span>
            </div>
          </div>

          {/* El Proceso de 7 Pasos */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-6">
              <i className="fa-solid fa-list-ol text-cyan-400 mr-2"></i>
              El Proceso de 7 Pasos
            </h3>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-num">1</div>
                <div className="step-body">
                  <div className="step-title">Identifica el Dolor</div>
                  <div className="step-desc">Elige una tarea manual y repetitiva que hagas a diario y cuantifícala (ej: "tardo 30 minutos enumerando planos o rellenando parámetros").</div>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">2</div>
                <div className="step-body">
                  <div className="step-title">Describe la Solución</div>
                  <div className="step-desc">Describe en lenguaje natural, paso a paso, qué elementos del modelo quieres seleccionar y qué quieres modificar.</div>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">3</div>
                <div className="step-body">
                  <div className="step-title">Genera el Código con IA</div>
                  <div className="step-desc">Usa modelos de lenguaje como Gemini o Claude. Copia nuestro prompt base e introduce la lógica específica que requieres.</div>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">4</div>
                <div className="step-body">
                  <div className="step-title">Crea la Estructura de Carpetas</div>
                  <div className="step-desc">Crea un directorio terminado en <span className="ic">.extension</span>, luego subcarpetas terminadas en <span className="ic">.tab</span>, <span className="ic">.panel</span> y finalmente <span className="ic">.pushbutton</span>.</div>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">5</div>
                <div className="step-body">
                  <div className="step-title">Pega tu script.py</div>
                  <div className="step-desc">Guarda el script generado por la IA en un archivo de texto plano llamado exactamente <span className="ic">script.py</span> dentro de la carpeta del botón.</div>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">6</div>
                <div className="step-body">
                  <div className="step-title">Recarga en pyRevit</div>
                  <div className="step-desc">Abre Revit, ve a la pestaña "pyRevit" y haz clic en "Reload". Tu nuevo botón aparecerá al instante en la interfaz.</div>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">7</div>
                <div className="step-body">
                  <div className="step-title">Prueba, Itera y Corrige</div>
                  <div className="step-desc">Ejecuta el script. Si arroja algún error, lee la consola de pyRevit, cópialo a tu IA de confianza para solucionarlo, actualiza el código y recarga.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparativa pyRevit vs C# */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-6">
              <i className="fa-solid fa-code-compare text-yellow-500 mr-2"></i>
              pyRevit (Python) vs C# Add-ins
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-green-950/20 rounded-xl border border-green-900/40">
                <h4 className="font-bold text-green-400 text-sm mb-2"><i className="fa-brands fa-python mr-1"></i> pyRevit (Python)</h4>
                <ul className="text-slate-400 text-xs space-y-1 mb-0 list-disc pl-4">
                  <li>Curva de aprendizaje extremadamente amigable.</li>
                  <li>Sin fase de compilación. Recarga directa en Revit.</li>
                  <li>Estructura de interfaz simple por carpetas.</li>
                  <li>Ideal para automatizaciones de oficina y prototipado rápido.</li>
                </ul>
              </div>
              <div className="p-5 bg-blue-950/20 rounded-xl border border-blue-900/40">
                <h4 className="font-bold text-blue-400 text-sm mb-2"><i className="fa-solid fa-code mr-1"></i> C# Add-in (.NET)</h4>
                <ul className="text-slate-400 text-xs space-y-1 mb-0 list-disc pl-4">
                  <li>Requiere conocimientos de C#, POO y Visual Studio.</li>
                  <li>Es necesario compilar a DLL y configurar manifiestos XML.</li>
                  <li>Control total de interfaces de usuario complejas (WPF).</li>
                  <li>Mayor rendimiento y mejor para desarrollo comercial.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Prompt Copiable */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-600/10 rounded-full blur-2xl"></div>
            <h3 className="text-2xl font-extrabold text-white mb-2 relative z-10">
              <i className="fa-solid fa-copy text-green-400 mr-2"></i>
              Tu Primer Prompt BIM Developer
            </h3>
            <p className="text-slate-400 mb-5 relative z-10 text-sm">
              Copia y pega este prompt estructurado en tu IA favorita para obtener un código pyRevit inicial listo para usar:
            </p>
            <div className="code-block w-full relative z-10">
              <div className="code-header">
                <span className="code-lang text-orange-400">Prompt IA · Estructurado</span>
                <button className="code-copy" onClick={(e) => copyBlock(e)}>Copiar</button>
              </div>
              <pre id="codigo-prompt" className="text-blue-200">Actúa como un experto en pyRevit y la API de Revit con IronPython. Necesito un script.py que haga lo siguiente:

<span className="text-orange-300 font-bold">TAREA:</span> [Describe tu tarea aquí, por ejemplo: Seleccionar todas las zapatas del modelo y escribir su volumen en el parámetro 'Comentarios']

<span className="text-orange-300 font-bold">CONTEXTO:</span>
- Uso Revit 2024/2025
- pyRevit 4.8+ instalado
- El script será un pushbutton

<span className="text-orange-300 font-bold">REQUISITOS:</span>
- Importar los módulos necesarios (clr, Autodesk.Revit.DB, etc.)
- Usar Transaction de Revit según corresponda
- Incluir manejo de errores básico (try/except)
- Mostrar un TaskDialog con el resultado al finalizar
- Código estructurado y comentado en español

Dame el script.py completo y listo para guardar.</pre>
            </div>
          </div>

          {/* Conclusiones clave */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-bim-blue">
            <h3 className="text-xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-lightbulb text-yellow-400 mr-2"></i> Conclusiones Clave
            </h3>
            <ul className="space-y-3 mb-0">
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>Comienza pequeño</strong>: Una herramienta simple que te ahorre 10 minutos al día representará más de 40 horas al año.</span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>Estructura es interfaz</strong>: No pierdas tiempo diseñando UI al principio, pyRevit se encarga del renderizado de botones.</span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>La IA es tu copiloto</strong>: Aprovecha prompts estructurados para saltarte la sintaxis básica y concentrarte en la lógica.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
}
