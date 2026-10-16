import { useState } from "react";
import { useTranslation } from "../context/LanguageContext";

export const ToolsLeadCapture = ({
  toolName: _toolName = "Herramientas Estructurales",
  className = "",
  showFreeResources = false,
}) => {
  const { language } = useTranslation();
  const isEn = language === "en";

  const hasFreeResources = showFreeResources;
  const [activeTab, setActiveTab] = useState(hasFreeResources ? "lead-magnet" : "quotation"); // 'lead-magnet' | 'quotation'
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState("Minería");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSending(true);
    // Simulate lead capture / store local
    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      setEmail("");
      setName("");
      setMessage("");
    }, 800);
  };

  return (
    <section
      className={`my-12 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Background Accent Gradients */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Tab Selector - Only rendered if free pro resources are enabled */}
        {hasFreeResources && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("lead-magnet");
                  setIsSubmitted(false);
                }}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                  activeTab === "lead-magnet"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <i className="fa-solid fa-gift text-[11px]"></i>
                <span>{isEn ? "Free Pro Resources" : "Recursos Pro Gratuitos"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("quotation");
                  setIsSubmitted(false);
                }}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                  activeTab === "quotation"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <i className="fa-solid fa-briefcase text-[11px]"></i>
                <span>{isEn ? "Get a BIM / Engineering Quote" : "Cotizar Proyecto BIM / Ingeniería"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Lead Magnet */}
        {hasFreeResources && activeTab === "lead-magnet" && (
          <div className="text-center max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3 inline-block">
              {isEn ? "BIM Productivity Kit" : "Kit de Productividad BIM"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-grotesk text-white tracking-tight mb-3">
              {isEn ? "Download the Revit Family Pack & Pro ICHA Spreadsheets" : "Descarga el Pack de Familias Revit & Planillas ICHA Pro"}
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              {isEn
                ? "Receive in your inbox the collection of parametric structural steel families, automated ICHA profiles, and direct takeoff templates for your project deliverables."
                : "Recibe en tu correo el compendio de familias paramétricas de acero estructural, perfiles ICHA automatizados y plantillas de cubicación directa para tus entregables."}
            </p>

            {isSubmitted ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 text-emerald-300 animate-fadeIn">
                <i className="fa-solid fa-circle-check text-3xl mb-2 text-emerald-400"></i>
                <h4 className="font-bold text-lg text-white">{isEn ? "Resource Sent Successfully!" : "¡Recurso enviado con éxito!"}</h4>
                <p className="text-xs text-emerald-300/80 mt-1">
                  {isEn ? "Check your inbox for the direct download links." : "Revisa tu bandeja de entrada para acceder a los enlaces de descarga directa."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  required
                  placeholder={isEn ? "Enter your professional email..." : "Ingresa tu correo profesional..."}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-slate-950/80 border border-slate-700/80 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 flex-shrink-0"
                >
                  {isSending ? (
                    <span>{isEn ? "Sending..." : "Enviando..."}</span>
                  ) : (
                    <>
                      <span>{isEn ? "Access for Free" : "Acceder Gratis"}</span>
                      <i className="fa-solid fa-arrow-right text-[11px]"></i>
                    </>
                  )}
                </button>
              </form>
            )}
            <p className="text-[11px] text-slate-500 mt-3">
              {isEn ? "Zero spam. Only structural engineering resources, scripts, and software updates." : "Cero spam. Solo recursos de ingeniería estructural, scripts y actualizaciones de software."}
            </p>
          </div>
        )}

        {/* Tab 2: B2B High-Ticket Quotation */}
        {activeTab === "quotation" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3 inline-block">
                {isEn ? "Senior Professional Services" : "Servicios Profesionales Senior"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-grotesk text-white tracking-tight mb-2">
                {isEn ? "Need Structural BIM Modeling or Detailing?" : "¿Necesitas Modelado BIM o Detallamiento de Estructuras?"}
              </h3>
              <p className="text-slate-400 text-sm">
                {isEn
                  ? "Development of Revit 2025/2027 models, Rebar detailing drawings, material takeoffs, and engineering coordination for mining, infrastructure, and commercial building projects."
                  : "Desarrollo de modelos Revit 2025/2027, planos de armaduras (Rebar), cubicaciones y coordinación de ingeniería para proyectos en minería, infraestructura o edificación."}
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 text-center text-emerald-300 animate-fadeIn">
                <i className="fa-solid fa-circle-check text-3xl mb-2 text-emerald-400"></i>
                <h4 className="font-bold text-lg text-white">{isEn ? "Inquiry Received" : "Solicitud Recibida"}</h4>
                <p className="text-xs text-emerald-300/80 mt-1">
                  {isEn ? "We will contact you within 24 hours to review your project scope." : "Nos pondremos en contacto contigo en menos de 24 horas para revisar los alcances de tu proyecto."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {isEn ? "Name or Company" : "Nombre o Empresa"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isEn ? "Your name or consulting firm..." : "Tu nombre o consultora..."}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {isEn ? "Email Address" : "Correo Electrónico"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={isEn ? "email@company.com" : "correo@empresa.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {isEn ? "Project Sector" : "Sector del Proyecto"}
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 text-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Minería">{isEn ? "Mining / Process Plants" : "Minería / Procesos"}</option>
                      <option value="Infraestructura">{isEn ? "Infrastructure / Transit / Roads" : "Infraestructura / Vial / Metro"}</option>
                      <option value="Industrial">{isEn ? "Industrial / Energy / Pulp & Paper" : "Industrial / Papelera / Energía"}</option>
                      <option value="Edificación">{isEn ? "Buildings / Healthcare / Commercial" : "Edificación / Salud / Hospitales"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      {isEn ? "Software / Requirement" : "Software / Requerimiento"}
                    </label>
                    <input
                      type="text"
                      placeholder={isEn ? "e.g. Revit Rebar 2025, Tekla, Takeoffs..." : "Ej: Revit Rebar 2025, Tekla, Cubicaciones..."}
                      className="w-full bg-slate-950/80 border border-slate-700/80 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {isEn ? "Brief Project Scope" : "Descripción Breve del Alcance"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={isEn ? "Tell us about deadlines, required deliverables, and engineering stage..." : "Cuéntanos sobre los plazos, entregables requeridos y fase de ingeniería..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700/80 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 mx-auto"
                  >
                    {isSending ? (
                      <span>{isEn ? "Processing..." : "Procesando..."}</span>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane text-[11px]"></i>
                        <span>{isEn ? "Submit Quotation Request" : "Enviar Solicitud de Cotización"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

