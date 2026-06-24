import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import SectionWrapper from "../hoc/SectionWrapper";

function Contact() {
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
        setMessage({ text: "✓ Mensaje enviado. Te respondo pronto.", type: "success" });
        setForm({ name: "", email: "", _subject: "Modelado BIM", message: "" });
      } else {
        throw new Error("Failed");
      }
    } catch {
      setMessage({
        text: "✗ Error al enviar. Escríbeme a andresgallo@pm.me",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="contact-grid">
        <motion.div variants={fadeIn("right", "tween", 0.1, 0.8)}>
          <p className="section-label">// Contacto</p>
          <h2 className="section-title">
            Hablemos de tu <br />
            próximo proyecto
          </h2>
          <p style={{ color: "var(--muted2)", marginBottom: "2rem" }}>
            ¿Buscas optimizar tus procesos de diseño estructural o necesitas un
            experto BIM? Estoy disponible para nuevas oportunidades en Chile y el
            exterior.
          </p>

          <div className="contact-info">
            <a href="mailto:andresgallo@pm.me" className="contact-item">
              <div className="contact-item-icon">📧</div>
              <div>
                <div className="contact-item-label">Email</div>
                <div className="contact-item-value">andresgallo@pm.me</div>
              </div>
            </a>
            <a
              href="https://www.linkedin.com/in/andresgallop/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item"
            >
              <div className="contact-item-icon">💼</div>
              <div>
                <div className="contact-item-label">LinkedIn</div>
                <div className="contact-item-value">/in/andresgallop</div>
              </div>
            </a>
            <a
              href="https://github.com/Atelijudesign"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item"
            >
              <div className="contact-item-icon">💻</div>
              <div>
                <div className="contact-item-label">GitHub</div>
                <div className="contact-item-value">Atelijudesign</div>
              </div>
            </a>
          </div>
        </motion.div>

        <motion.div variants={fadeIn("left", "tween", 0.3, 0.8)}>
          <div className="contact-cta">
            <div className="availability-badge" style={{ marginBottom: "1.25rem" }}>
              <span className="dot-pulse" />
              Disponible ahora
            </div>
            <h3>¿Tienes un proyecto en mente?</h3>
            <p
              style={{
                color: "var(--muted2)",
                fontSize: "0.9rem",
                marginBottom: "1.25rem",
              }}
            >
              Completa el formulario y te respondo en menos de 24 horas.
            </p>

            <form
              ref={formRef}
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="form-group">
                <label htmlFor="fname" className="form-label">
                  Nombre <span aria-hidden="true">*</span>
                </label>
                <input
                  id="fname"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Tu nombre"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="femail" className="form-label">
                  Email <span aria-hidden="true">*</span>
                </label>
                <input
                  id="femail"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="tu@email.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="fsubject" className="form-label">
                  Asunto
                </label>
                <select
                  id="fsubject"
                  name="_subject"
                  className="form-input"
                  value={form._subject}
                  onChange={handleChange}
                >
                  <option value="Modelado BIM">Modelado BIM</option>
                  <option value="Automatización / Plugin">
                    Automatización / Plugin
                  </option>
                  <option value="Consultoría BIM">Consultoría BIM</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="fmsg" className="form-label">
                  Mensaje <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="fmsg"
                  name="message"
                  className="form-textarea"
                  placeholder="Cuéntame sobre tu proyecto..."
                  required
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar mensaje"}
              </button>
              {message.text && (
                <motion.div
                  className={`form-msg ${message.type}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.text}
                </motion.div>
              )}
            </form>
          </div>

          <div className="contact-downloads">
            <a href="/Andres_Gallo_CV.pdf" className="btn-download" download>
              ⬇ Descargar CV
            </a>
            <a
              href="/Andres_Gallo_Portfolio.pdf"
              className="btn-download"
              download
            >
              ⬇ Portafolio PDF
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SectionWrapper(Contact, "contact");
