import { Suspense, lazy, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { textVariant, fadeIn } from "../utils/motion";
import { heroStats } from "../constants";

// Lazy-load the 3D scene so Three.js/R3F/Drei stay out of the main bundle
const BuildingScene = lazy(() => import("./canvas/BuildingScene"));

function AnimatedCounter({ target, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              start = target;
              clearInterval(timer);
            }
            setCount(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count}
      <span className="accent">{suffix}</span>
    </span>
  );
}

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-grid-bg" />
      <div className="hero-glow" />

      <div className="container">
        <div className="hero-layout">
          {/* Left: Text Content */}
          <motion.div
            className="hero-content"
            variants={textVariant(0.1)}
            initial="hidden"
            animate="show"
          >
            <motion.div
              className="availability-badge"
              variants={fadeIn("down", "tween", 0, 0.6)}
              initial="hidden"
              animate="show"
            >
              <span className="dot-pulse" />
              Disponible para proyectos ·
              <a href="mailto:andresgallo@pm.me">Escríbeme hoy →</a>
            </motion.div>

            <motion.p
              className="hero-eyebrow"
              variants={fadeIn("", "tween", 0.2, 0.6)}
              initial="hidden"
              animate="show"
            >
              // BIM Developer &amp; Proyectista Estructural
            </motion.p>

            <motion.h1
              className="hero-title"
              variants={fadeIn("up", "tween", 0.3, 0.8)}
              initial="hidden"
              animate="show"
            >
              Diseñador BIM <span className="accent">Estructural</span>
              <span className="line-break">
                que también <span className="accent">programa.</span>
              </span>
            </motion.h1>

            <motion.p
              className="hero-desc"
              variants={fadeIn("up", "tween", 0.5, 0.8)}
              initial="hidden"
              animate="show"
            >
              <strong>15+ años</strong> en proyectos reales de minería,
              aeropuertos y hospitales. El diferencial: automatizo en{" "}
              <strong>Dynamo y Python</strong> lo que otros hacen a mano.
              Especialista en Revit, Tekla y Navisworks.
            </motion.p>

            <motion.div
              className="hero-actions"
              variants={fadeIn("up", "tween", 0.7, 0.8)}
              initial="hidden"
              animate="show"
            >
              <a href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                ⚡ Hablemos de tu proyecto
              </a>
              <a href="/Andres_Gallo_CV.pdf" className="btn-secondary" download>
                ⬇ Descargar CV
              </a>
              <a href="/Andres_Gallo_Portfolio.pdf" className="btn-secondary" download>
                ⬇ Portafolio PDF
              </a>
            </motion.div>

            <motion.div
              className="hero-stats"
              variants={fadeIn("up", "tween", 0.9, 0.8)}
              initial="hidden"
              animate="show"
            >
              {heroStats.map((stat) => (
                <div className="stat" key={stat.id}>
                  <div className="stat-value">
                    {stat.display ? (
                      <>
                        CL<span className="accent">·</span>INT
                      </>
                    ) : (
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                      />
                    )}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: 3D Scene */}
          <motion.div
            variants={fadeIn("left", "tween", 0.5, 1)}
            initial="hidden"
            animate="show"
          >
            <Suspense
              fallback={
                <div className="hero-canvas-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    Cargando escena 3D...
                  </p>
                </div>
              }
            >
              <BuildingScene />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
