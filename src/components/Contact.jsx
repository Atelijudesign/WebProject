import { asset } from "../utils/asset";
import { useState, useRef } from "react";
import SectionWrapper from "../hoc/SectionWrapper";
import { useTranslation } from "../context/LanguageContext";

function Contact() {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    _subject: "Modelado BIM",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("https://formspree.io/f/mojkoayd", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(formRef.current),
      });

      if (res.ok) {
        setMessage({ text: t("contact_success") || "✓ Mensaje enviado. Te respondo pronto.", type: "success" });
        setForm({ name: "", email: "", _subject: "Modelado BIM", message: "" });
      } else {
        throw new Error("Failed");
      }
    } catch {
      setMessage({
        text: t("contact_error") || "✗ Error al enviar. Escríbeme a andresgallo@pm.me",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-16">
      <div className="mb-10">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
          {t("contact_tag") || "// CANAL DE CONTACTO DIRECTO"}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {t("contact_title") || "Hablemos de Tu Próximo Proyecto"}
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          {t("contact_desc") || "¿Buscas optimizar tus procesos de diseño estructural o necesitas un experto BIM? Disponible para proyectos en Chile e internacionales."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Direct Links */}
        <div className="space-y-6">
          <div className="rounded-3xl p-5 sm:p-6 md:p-8 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">
              {t("contact_info_title") || "Información Directa"}
            </h3>

            <a
              href="mailto:andresgallo@pm.me"
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4 hover:border-cyan-500/40 transition-colors block"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-lg shrink-0">
                <i className="fa-solid fa-envelope" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-500 block">
                  {t("contact_email_label") || "Correo Oficial"}
                </span>
                <span className="text-sm font-bold text-white">andresgallo@pm.me</span>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/andresgallop/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4 hover:border-cyan-500/40 transition-colors block"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center text-lg shrink-0">
                <i className="fa-brands fa-linkedin-in" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-500 block">LinkedIn</span>
                <span className="text-sm font-bold text-white">/in/andresgallop</span>
              </div>
            </a>

            <a
              href="https://github.com/Atelijudesign"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4 hover:border-cyan-500/40 transition-colors block"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center justify-center text-lg shrink-0">
                <i className="fa-brands fa-github" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-500 block">GitHub</span>
                <span className="text-sm font-bold text-white">Atelijudesign</span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={asset("/Andres_Gallo_CV.pdf")}
              className="flex-1 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 font-mono text-xs font-bold text-center transition-all flex items-center justify-center gap-2"
              download
            >
              <i className="fa-solid fa-file-pdf text-red-400" /> {t("contact_download_cv") || "Descargar CV PDF"}
            </a>
            <a
              href={asset("/Andres_Gallo_Portfolio.pdf")}
              className="flex-1 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 font-mono text-xs font-bold text-center transition-all flex items-center justify-center gap-2"
              download
            >
              <i className="fa-solid fa-folder-open text-amber-400" /> {t("contact_download_portfolio") || "Portafolio PDF"}
            </a>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="rounded-3xl p-5 sm:p-6 md:p-8 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t("contact_available") || "Disponible · Respuesta en menos de 24 hrs"}
          </div>

          <h3 className="text-xl font-bold text-white mb-6">
            {t("contact_form_title") || "Formulario de Contacto"}
          </h3>

          <form ref={formRef} className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="fname" className="block text-xs font-mono text-slate-400 mb-1">
                {t("contact_label_name") || "Nombre Completo *"}
              </label>
              <input
                id="fname"
                name="name"
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                placeholder={t("contact_placeholder_name") || "Tu nombre"}
                required
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="femail" className="block text-xs font-mono text-slate-400 mb-1">
                {t("contact_label_email") || "Email Profesional *"}
              </label>
              <input
                id="femail"
                name="email"
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                placeholder={t("contact_placeholder_email") || "tu@empresa.com"}
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="fsubject" className="block text-xs font-mono text-slate-400 mb-1">
                {t("contact_label_service") || "Tipo de Servicio"}
              </label>
              <select
                id="fsubject"
                name="_subject"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                value={form._subject}
                onChange={handleChange}
              >
                <option value="Modelado BIM">{t("contact_opt_bim") || "Modelado & Detallado BIM"}</option>
                <option value="Automatización / Plugin">{t("contact_opt_auto") || "Automatización (Python / pyRevit / C#)"}</option>
                <option value="Consultoría BIM">{t("contact_opt_consult") || "Consultoría en Ingeniería Estructural"}</option>
                <option value="Otro">{t("contact_opt_other") || "Otro"}</option>
              </select>
            </div>

            <div>
              <label htmlFor="fmsg" className="block text-xs font-mono text-slate-400 mb-1">
                {t("contact_label_message") || "Detalles del Proyecto *"}
              </label>
              <textarea
                id="fmsg"
                name="message"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                placeholder={t("contact_placeholder_message") || "Describe los requerimientos principales de tu proyecto..."}
                required
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg hover:shadow-cyan-500/25 transition-all active:scale-[0.98] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (t("contact_btn_sending") || "Enviando...") : (t("contact_btn_send") || "Enviar Mensaje Directo")}
            </button>

            {message.text && (
              <div
                className={`p-3 rounded-xl font-mono text-xs font-bold ${
                  message.type === "success"
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                    : "bg-red-950/80 text-red-400 border border-red-800"
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SectionWrapper(Contact, "contact");
