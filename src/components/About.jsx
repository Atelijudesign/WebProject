import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { skills, featuredProjects } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";

function About() {
  return (
    <>
      <div className="about-grid">
        <motion.div className="about-text" variants={fadeIn("right", "tween", 0.1, 0.8)}>
          <div className="about-photo-wrap">
            <img
              src="assets/img/profile.webp"
              className="profile-photo"
              alt="Andrés Gallo P. — BIM Developer & Structural Engineer"
              width="120"
              height="120"
            />
          </div>
          <p className="section-label">// Sobre Mí</p>
          <h2 className="section-title">Diseñador Estructural &amp; Experto BIM</h2>
          <p>
            Con más de <strong>15 años de experiencia</strong> como Diseñador BIM
            especializado en ingeniería estructural, he trabajado en grandes
            organizaciones como <strong>Black &amp; Veatch, Arcadis, GHD y AFRY</strong>.
          </p>
          <p>
            Mi trayectoria abarca proyectos mineros, hospitales, aeropuertos,
            plantas de pulpa y papel e infraestructura civil — tanto nacionales
            como internacionales.
          </p>
          <p>
            Lo que me diferencia: además de diseñar,{" "}
            <strong>programo las herramientas</strong> que hacen ese diseño más
            rápido y preciso.
          </p>

          <div className="skills-section">
            <p className="section-label">// Stack técnico</p>
            <div className="skills-grid">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill.name}
                  className={`skill-tag ${skill.highlight ? "highlight" : ""}`}
                  variants={fadeIn("up", "spring", 0.05 * i, 0.5)}
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeIn("left", "tween", 0.3, 0.8)}>
          <p className="section-label">// Proyectos emblemáticos</p>
          <div className="projects-list">
            {featuredProjects.map((proj, i) => (
              <motion.div
                key={proj.name}
                className="proj-item"
                variants={fadeIn("left", "spring", 0.1 * i, 0.5)}
              >
                <img
                  src={`assets/img/flags/${proj.flag}.webp`}
                  width="24"
                  height="18"
                  alt={proj.flag === "cl" ? "Chile" : "México"}
                  className="flag"
                />
                <div>
                  <div className="proj-name">{proj.name}</div>
                  <div className="proj-detail">{proj.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SectionWrapper(About, "about");
