import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { services } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";

function Services() {
  return (
    <>
      <motion.p className="section-label" variants={textVariant(0)}>
        // Servicios
      </motion.p>
      <motion.h2 className="section-title" variants={textVariant(0.1)}>
        Soluciones para los sectores <br />
        más exigentes
      </motion.h2>
      <motion.p className="section-subtitle" variants={fadeIn("", "tween", 0.2, 0.6)}>
        Trabajo en minería, infraestructura, salud e industria — donde la
        precisión no es opcional.
      </motion.p>

      <div className="services-grid">
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            className="service-card"
            variants={fadeIn("up", "spring", i * 0.12, 0.75)}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
          >
            <div className="service-icon" aria-hidden="true">
              <i className={svc.icon}></i>
            </div>
            <h3>{svc.title}</h3>
            <p>{svc.description}</p>
            <a
              href="#contact"
              className="btn-service"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Solicitar cotización →
            </a>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export default SectionWrapper(Services, "services");
