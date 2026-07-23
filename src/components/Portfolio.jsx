import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { portfolioFilters, portfolioProjects } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";
import projectsData from "../data/proyectos.json";

function PortfolioCard({ project, index }) {
  return (
    <motion.div
      className="portfolio-card"
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      {project.confidential ? (
        <div className="confidential-overlay">🔒 Confidencial</div>
      ) : (
        <img
          src={project.image}
          alt={project.title}
          className="portfolio-img"
          loading="lazy"
          decoding="async"
          width="800"
          height="500"
        />
      )}
      <div className="portfolio-body">
        <div className="portfolio-category">{project.category}</div>
        <h3>{project.title}</h3>
        <div className="portfolio-year">
          {project.yearDisplay || project.year}
        </div>
        <div className="portfolio-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="portfolio-tag">
              {tag}
            </span>
          ))}
        </div>
        <p className="portfolio-desc">{project.description}</p>
        {project.link ? (
          <Link to={project.link} className="portfolio-link">
            Ver detalles <i className="fa-solid fa-arrow-right"></i>
          </Link>
        ) : (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--muted)",
            }}
          >
            Detalles restringidos
          </span>
        )}
      </div>
    </motion.div>
  );
}

function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [dbFeatured, setDbFeatured] = useState([]);

  useEffect(() => {
    async function loadDbFeatured() {
      try {
        let data = null;
        if (window.location.hostname === 'localhost') {
          try {
            const res = await fetch('http://localhost:3001/api/projects');
            if (res.ok) {
              const json = await res.json();
              data = json.value;
            }
          } catch (e) {
            console.warn("Local API server not running, using static JSON", e);
          }
        }

        if (!data) {
          data = projectsData.value;
        }

        // Filter and map database projects marked as featured
        const featuredList = (data || [])
          .filter(p => p.featured === true)
          .map(p => ({
            image: p.image_url || "assets/img/amb_00.webp",
            category: p.project_type || "Estructural",
            title: p.name,
            year: String(p.year_end || p.year_start || p.period || ""),
            tags: p.software ? p.software.split(',').map(s => s.trim()) : ["Revit"],
            description: p.description || "",
            link: `/project/${p.project_id}`
          }));

        setDbFeatured(featuredList);
      } catch (err) {
        console.error("Error loading featured projects from DB:", err);
      }
    }
    loadDbFeatured();
  }, []);

  // Sort by year descending
  const sortedProjects = useMemo(() => {
    const combined = [...portfolioProjects, ...dbFeatured];
    return combined.sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      return yearB - yearA;
    });
  }, [dbFeatured]);

  const filtered = useMemo(() => {
    if (activeFilter === "Todos") return sortedProjects;
    return sortedProjects.filter((p) => p.tags.includes(activeFilter));
  }, [activeFilter, sortedProjects]);

  return (
    <>
      <motion.h2
        className="section-title"
        style={{ textAlign: "center" }}
        variants={textVariant(0)}
      >
        Proyectos Destacados
      </motion.h2>
      <motion.p
        className="section-subtitle"
        style={{ textAlign: "center", margin: "0 auto 3rem" }}
        variants={fadeIn("", "tween", 0.1, 0.6)}
      >
        Una selección de mis trabajos más recientes.
      </motion.p>

      <motion.div
        className="portfolio-filters"
        variants={fadeIn("up", "tween", 0.2, 0.6)}
      >
        {portfolioFilters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </motion.div>

      <motion.div className="portfolio-grid" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <PortfolioCard
              key={project.title}
              project={project}
              index={i}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default SectionWrapper(Portfolio, "portfolio");
