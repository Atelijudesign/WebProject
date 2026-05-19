import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { navLinks } from "../constants";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, link) => {
    if (link.external) return;
    
    setIsOpen(false);

    // Si es un enlace de anclaje (#seccion)
    if (link.href.startsWith("#")) {
      if (location.pathname !== "/") {
        // Si no estamos en la Home, navegamos a la Home + anclaje
        // El navegador por defecto no hace scroll suave al cambiar de página
        // pero cargará la Home en esa sección.
        return; 
      } else {
        // Si ya estamos en la Home, scroll suave manual
        e.preventDefault();
        const id = link.href.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <Link
          to="/"
          className="nav-logo"
          onClick={() => {
            setIsOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Andrés Gallo <span>P.BIM</span>
        </Link>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          {navLinks.map((link) => {
            const isExternal = link.external;
            const isInternalPage = link.href.startsWith("/");
            const isAnchor = link.href.startsWith("#");

            if (isExternal) {
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={link.cta ? "nav-cta" : ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.title}
                </a>
              );
            }

            return (
              <Link
                key={link.id}
                to={isAnchor ? `/${link.href}` : link.href}
                className={link.cta ? "nav-cta active" : ""}
                onClick={(e) => handleNavClick(e, link)}
              >
                {link.title}
              </Link>
            );
          })}
        </div>

        <button
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menú"
          aria-expanded={isOpen}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}
