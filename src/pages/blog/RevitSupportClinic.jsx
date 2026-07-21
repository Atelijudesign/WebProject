import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RevitSupportClinic() {
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
  const shareTitle = encodeURIComponent("Secretos de Soporte: Lo que aprendimos en AU 2025 sobre Acero");

  return (
    <div className="bg-bim-dark min-h-screen transition-colors duration-300">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />
      {/* Header Section */}
      <section className="pt-28 pb-16 px-4 bg-[#030712]/40 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-bim-blue rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Link to="/blog" className="text-bim-blue hover:text-blue-400 text-sm font-medium transition-colors">
              <i className="fa-solid fa-arrow-left mr-1"></i> Volver al Blog
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-life-ring mr-1"></i> Soporte
            </span>
            <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              <i className="fa-solid fa-screwdriver-wrench mr-1"></i> Revit Clinic
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-calendar mr-1"></i> 17 Feb 2026
            </span>
            <span className="text-gray-400 text-sm">
              <i className="fa-regular fa-clock mr-1"></i> 10 min lectura
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            <span className="text-5xl">🚑</span> Secretos de Soporte:<br />
            <span className="text-gradient-article">Errores Comunes de Acero en Revit</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Lo que aprendimos en la "Revit Support Clinic" de Autodesk University 2025: troubleshooting avanzado, errores recurrentes y cómo evitar que tu modelo falle.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-[#0b1220]/60 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-article">

          {/* Diagnóstico de la Clínica */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa- stethoscope text-red-400 mr-2"></i>
              Diagnóstico de la Clínica
            </h3>
            <p className="text-slate-400">
              Cada año en Autodesk University (AU), el equipo de soporte técnico global expone los casos más recurrentes y complejos que reciben de usuarios alrededor del mundo. Este año, el foco principal estuvo centrado en las **Estructuras de Acero y Conexiones**.
            </p>
            <p className="text-slate-400 mb-0">
              Si alguna vez te has frustrado porque no aparece el botón de conexión, o porque la opción "Propagate Connection" ignora deliberadamente la mitad de las vigas del edificio, estás en el lugar indicado. Aquí desglosamos las mejores soluciones.
            </p>
          </div>

          {/* Problema #1 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-triangle-exclamation text-orange-400 mr-2"></i>
              Problema #1: "No puedo crear la conexión estructural"
            </h3>
            <p className="text-slate-400">
              El error número uno reportado a soporte: seleccionas la columna y la viga de acero, haces clic en la herramienta de conexión estructural y... no ocurre absolutamente nada, o se produce un aviso genérico de advertencia.
            </p>
            <h4 className="font-bold text-gray-200 mt-6 mb-3">La Solución del Experto:</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1"><i className="fa-solid fa-check"></i></span>
                <div>
                  <strong className="text-white">Material Behavior:</strong>
                  <span> Abre la familia del perfil en el editor de familias y verifica que el parámetro <code className="text-red-400">Material for Model Behavior</code> esté configurado estrictamente como <code className="text-red-400">Steel</code>. Si está definido como <code className="text-red-400">Concrete</code> u <code className="text-red-400">Other</code>, el motor de conexiones de acero fallará.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1"><i className="fa-solid fa-check"></i></span>
                <div>
                  <strong className="text-white">Familias Certificadas (Certified Families):</strong>
                  <span> Procura usar siempre las familias por defecto provistas por Autodesk. Las familias personalizadas creadas "desde cero" a menudo carecen de los planos de referencia internos y ejes paramétricos que el motor de Revit requiere para ubicar las placas de unión.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Problema #2 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-link-slash text-yellow-500 mr-2"></i>
              Problema #2: El Modelo Analítico Desconectado
            </h3>
            <p className="text-slate-400">
              Desde las versiones Revit 2024 y 2025, el modelo analítico se maneja de forma totalmente autónoma. Esto ha traído bastantes confusiones: al desplazar la viga física, el eje analítico de cálculo suele quedarse en su posición original, desconectando los nudos estructurales.
            </p>
            <p className="text-slate-400">
              **Lección aprendida:** Olvídate de alinear el modelo analítico "a ojo". Utiliza la herramienta nativa **Analytical Automation** (que funciona sobre Dynamo) para regenerar y sincronizar automáticamente el esqueleto analítico a partir de las coordenadas físicas reales del modelo. Esto evitará nudos huérfanos al exportar a programas de cálculo como Robot, SAP2000 o ETABS.
            </p>
          </div>

          {/* Problema #3 */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 mb-10">
            <h3 className="text-2xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-gauge-high text-cyan-400 mr-2"></i>
              Problema #3: Caída de Rendimiento en Modelos Masivos
            </h3>
            <p className="text-slate-400">
              ¿Tu archivo tarda 10 o 15 minutos en cargar, y la navegación 3D se siente lenta? El culpable principal suele ser el nivel exagerado de detalle en vistas generales y de coordinación del proyecto.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-5 bg-red-950/20 rounded-xl border border-red-900/40">
                <h4 className="font-bold text-red-400 text-sm mb-2"><i className="fa-solid fa-xmark mr-1"></i> Lo que hacíamos mal</h4>
                <p className="text-slate-400 text-xs mb-0">Configurar el nivel de detalle en "Fine" en todas las vistas 3D de modelado y coordinación, forzando a la GPU a renderizar cada tornillo, golilla y cordón de soldadura.</p>
              </div>
              <div className="p-5 bg-green-950/20 rounded-xl border border-green-900/40">
                <h4 className="font-bold text-green-400 text-sm mb-2"><i className="fa-solid fa-check mr-1"></i> La práctica recomendada</h4>
                <p className="text-slate-400 text-xs mb-0">Mantener el nivel de detalle en "Medium" o "Coarse" en vistas de planta y 3D de conjunto. Reserva el detalle "Fine" únicamente para planos de detalle de conexiones específicas.</p>
              </div>
            </div>
          </div>

          {/* Contacto por Caso de Soporte */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-red-800/40 border-l-4 border-l-red-500 mb-10 text-center">
            <h3 className="text-xl font-extrabold text-white mb-3">
              ¿Tienes un caso de soporte en Revit que parece imposible?
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              A veces la ayuda oficial no es suficiente. Si tu modelo analítico está roto o tus conexiones de acero fallan sin motivo, escríbeme y lo analizamos juntos.
            </p>
            <a
              href="mailto:andresgallo@pm.me?subject=Consulta%20Blog%20Revit%20Support"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-base shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-paper-plane"></i>
              Enviar mi caso a revisión
            </a>
          </div>

          {/* Conclusiones clave */}
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-slate-800/60 border-l-4 border-l-bim-blue">
            <h3 className="text-xl font-extrabold text-white mb-4">
              <i className="fa-solid fa-lightbulb text-yellow-400 mr-2"></i> Conclusiones Clave
            </h3>
            <ul className="space-y-3 mb-0">
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>Verifica familias primero</strong>: El parámetro 'Material for Model Behavior = Steel' es indispensable para habilitar las conexiones estructurales.</span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>Confía en Analytical Automation</strong>: No muevas líneas analíticas de forma manual. Deja que los algoritmos de Dynamo sincronicen el modelo de cálculo.</span>
              </li>
              <li className="flex items-start text-slate-400">
                <span className="text-bim-blue mr-2 mt-1"><i className="fa-solid fa-check-circle"></i></span>
                <span><strong>Optimiza la GPU</strong>: El exceso de nivel de detalle en vistas generales degrada notablemente el rendimiento. Usa 'Medium' o 'Coarse' para modelado diario.</span>
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
          <a
            href="/#contact"
            className="inline-flex items-center text-slate-400 hover:text-bim-blue font-medium transition-colors text-sm"
          >
            <i className="fa-solid fa-envelope mr-2" /> ¿Preguntas? Contáctame
          </a>
        </div>
      </section>
    </div>
  );
}
