import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { toolsPreview } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";

function ToolsPreview() {
  return (
    <>
      <motion.p className="section-label" variants={textVariant(0)}>
        // Herramientas propias
      </motion.p>
      <motion.h2 className="section-title" variants={textVariant(0.1)}>
        No solo diseño — también creo <br />
        las herramientas
      </motion.h2>
      <motion.p className="section-subtitle" variants={fadeIn("", "tween", 0.2, 0.6)}>
        Recursos gratuitos para proyectistas estructurales, construidos con
        experiencia real de obra.
      </motion.p>

      <div className="tools-grid">
        {toolsPreview.map((tool, i) => (
          <motion.div
            key={tool.title}
            className={`tool-card ${tool.featured ? "featured" : ""}`}
            variants={fadeIn("up", "spring", i * 0.15, 0.75)}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="tool-thumb" aria-hidden="true">
              <i className={tool.icon}></i>
            </div>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <a href={tool.link} className="btn-tool">
              {tool.featured ? "Usar herramienta →" : "Leer el blog →"}
            </a>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export default SectionWrapper(ToolsPreview, "tools-preview");
