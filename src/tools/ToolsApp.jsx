import { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant, staggerContainer } from "../utils/motion";
import { tools } from "./constants";

/* ── Tag colors mapping ── */
const tagColors = {
  blue: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  purple: "text-purple-400 border-purple-500/20 bg-purple-500/10",
};

/* ── Tool Card ── */
function ToolCard({ tool, index }) {
  return (
    <motion.a
      href={tool.href}
      className="tool-card-react group"
      variants={fadeIn("up", "spring", index * 0.15, 0.75)}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {/* Gradient Top Border (hover) */}
      <div className="tool-card-glow" />

      <div className="tool-card-header">
        <div className={`tool-icon-wrap bg-gradient-to-br ${tool.gradient} ${tool.borderColor}`}>
          <i className={`${tool.icon} tool-icon-inner`}></i>
        </div>
        <i className="fa-solid fa-arrow-right tool-arrow-icon"></i>
      </div>

      <h2 className="tool-card-title">{tool.title}</h2>
      <p className="tool-card-desc">{tool.description}</p>

      <div className="tool-tags">
        {tool.tags.map((tag) => (
          <span
            key={tag.label}
            className={`tool-tag ${tagColors[tag.color]}`}
          >
            <i className={`${tag.icon} tool-tag-icon`}></i>
            {tag.label}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

/* ── Newsletter Section ── */
function Newsletter() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("https://formspree.io/f/mojkoayd", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.target),
      });

      if (res.ok) {
        setMessage({ text: "✓ ¡Suscrito! Te avisamos cuando haya nuevas herramientas.", type: "success" });
        e.target.reset();
      } else {
        throw new Error();
      }
    } catch {
      setMessage({ text: "✗ Error al enviar. Escríbenos a andresgallo@pm.me", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="tools-newsletter"
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="tools-newsletter-inner">
        <motion.p className="section-label" style={{ textAlign: "center" }} variants={textVariant(0)}>
          // Newsletter
        </motion.p>
        <motion.h2 className="tools-newsletter-title" variants={textVariant(0.1)}>
          Recibe cada nueva herramienta BIM en tu correo
        </motion.h2>
        <motion.p className="tools-newsletter-subtitle" variants={fadeIn("", "tween", 0.2, 0.6)}>
          Sin spam. Solo utilidades reales para proyectistas estructurales.
        </motion.p>

        <motion.form
          className="tools-newsletter-form"
          onSubmit={handleSubmit}
          variants={fadeIn("up", "tween", 0.3, 0.6)}
        >
          <input type="hidden" name="_subject" value="Nueva suscripción desde Tools" />
          <input
            type="email"
            name="email"
            placeholder="tu@email.com"
            required
            className="form-input"
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ whiteSpace: "nowrap" }}
          >
            {loading ? "Enviando..." : "Suscribirme gratis →"}
          </button>
        </motion.form>

        {message.text && (
          <motion.p
            className={`form-msg ${message.type}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", marginTop: "0.75rem" }}
          >
            {message.text}
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}

/* ── Navbar (shared) ── */
function ToolsNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <a href="../index.html#home" className="nav-logo">
          Andrés Gallo <span>P.BIM</span>
        </a>
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <a href="../index.html#home">Inicio</a>
          <a href="../index.html#about">Sobre Mí</a>
          <a href="../index.html#automation">Automatización</a>
          <a href="../index.html#services">Servicios</a>
          <a href="../index.html#portfolio">Portafolio</a>
          <a href="../proyectos-bim/">Proyectos</a>
          <a href="../blog/blog.html">Blog</a>
          <a href="./" className="active">Herramientas</a>
          <a href="../index.html#contact" className="nav-cta">Contacto →</a>
        </div>
        <button
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menú"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}

/* ── Footer ── */
function ToolsFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo">
            Andrés Gallo <span>P.BIM</span>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} Andrés Gallo P. Todos los derechos reservados.
          </div>
          <div className="footer-tagline">// Diseñado con ingeniería y código</div>
        </div>
      </div>
    </footer>
  );
}

/* ── Main App ── */
export default function ToolsApp() {
  return (
    <>
      <ToolsNavbar />

      {/* Hero */}
      <section className="tools-hero">
        <div className="tools-hero-grid" />
        <div className="tools-hero-inner">
          <motion.div
            className="tools-hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <i className="fa-solid fa-wrench"></i> HERRAMIENTAS PARA PROYECTISTAS ESTRUCTURALES
          </motion.div>

          <motion.h1
            className="tools-hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Herramientas <span className="accent">BIM</span>
          </motion.h1>

          <motion.p
            className="tools-hero-desc"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Utilidades de ingeniería para cálculo, diseño y gestión de perfiles de acero estructural. Selecciona una herramienta para comenzar.
          </motion.p>
        </div>
      </section>

      {/* Tools Grid */}
      <motion.section
        className="tools-grid-section"
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="tools-grid-container">
          <div className="tools-grid-layout">
            {tools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </motion.section>

      <Newsletter />
      <ToolsFooter />
    </>
  );
}
