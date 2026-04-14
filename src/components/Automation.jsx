import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { automations } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";

function Automation() {
  return (
    <>
      <motion.p className="section-label" variants={textVariant(0)}>
        // Diferencial competitivo
      </motion.p>
      <motion.h2 className="section-title" variants={textVariant(0.1)}>
        Automatización que genera <br />
        resultados reales
      </motion.h2>
      <motion.p className="section-subtitle" variants={fadeIn("", "tween", 0.2, 0.6)}>
        15 años en obra me enseñaron dónde se pierde el tiempo. Por eso programo
        las soluciones.
      </motion.p>

      <div className="auto-grid">
        {automations.map((item, i) => (
          <motion.div
            key={item.title}
            className="auto-card"
            variants={fadeIn("up", "spring", i * 0.15, 0.75)}
          >
            <span className="auto-tech">{item.tech}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.result && <span className="auto-result">{item.result}</span>}
            {item.link && (
              <a href={item.link.url} className="auto-link">
                {item.link.text}
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
}

export default SectionWrapper(Automation, "automation");
