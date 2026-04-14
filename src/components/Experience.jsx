import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { experiences, certifications, education } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";

function Experience() {
  // Sort certifications by year descending
  const sortedCerts = [...certifications].sort((a, b) => b.year - a.year);

  return (
    <>
      <motion.p className="section-label" variants={textVariant(0)}>
        // Trayectoria
      </motion.p>
      <motion.h2 className="section-title" variants={textVariant(0.1)}>
        Experiencia y Formación
      </motion.h2>

      <div className="exp-layout">
        {/* Left: Timeline */}
        <motion.div variants={fadeIn("right", "tween", 0.2, 0.8)}>
          <p className="section-label">Experiencia profesional</p>
          <div className="timeline">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company + exp.period}
                className="timeline-item"
                variants={fadeIn("right", "spring", i * 0.15, 0.75)}
              >
                <div className={`timeline-dot ${exp.active ? "active" : ""}`} aria-hidden="true">
                  <i className={exp.icon}></i>
                </div>
                <div className="timeline-body">
                  <div className="timeline-company">{exp.company}</div>
                  <div className="timeline-role">{exp.role}</div>
                  <div className="timeline-period">{exp.period}</div>
                  <div className="timeline-desc">{exp.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Certifications */}
        <motion.div variants={fadeIn("left", "tween", 0.4, 0.8)}>
          <p className="section-label">Certificaciones</p>
          <div className="certs-grid">
            {sortedCerts.map((cert, i) => (
              <motion.a
                key={cert.name}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-card"
                variants={fadeIn("left", "spring", i * 0.1, 0.5)}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
              >
                <div className="cert-icon">
                  {cert.icon.startsWith("fa-") ? (
                    <i className={cert.icon}></i>
                  ) : (
                    cert.icon
                  )}
                </div>
                <div>
                  <div className="cert-name">{cert.name}</div>
                  <div className="cert-org">
                    {cert.org} · {cert.year}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <br />
          <p className="section-label">Formación académica</p>
          <div className="certs-grid">
            {education.map((edu) => (
              <div key={edu.name} className="cert-card">
                <div className="cert-icon" aria-hidden="true">
                  <i className={edu.icon}></i>
                </div>
                <div>
                  <div className="cert-name">{edu.name}</div>
                  <div className="cert-org">
                    {edu.org} · {edu.period}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SectionWrapper(Experience, "curriculum");
