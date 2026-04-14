import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { navLinks } from "../constants";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, link) => {
    if (link.external) return; // Let browser handle full navigation
    e.preventDefault();
    setIsOpen(false);
    const el = document.querySelector(link.href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a
          href="#home"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Andrés Gallo <span>P.BIM</span>
        </a>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          {navLinks.map((link) => {
            if (link.external) {
              return (
                <a
                  key={link.id}
                  href={`/${link.href}`}
                  className={link.cta ? "nav-cta" : ""}
                >
                  {link.title}
                </a>
              );
            }
            if (link.href.startsWith("/")) {
              return (
                <Link
                  key={link.id}
                  to={link.href}
                  className={link.cta ? "nav-cta" : ""}
                  onClick={() => setIsOpen(false)}
                >
                  {link.title}
                </Link>
              );
            }
            return (
              <a
                key={link.id}
                href={`/${link.href}`}
                className={link.cta ? "nav-cta" : ""}
                onClick={(e) => handleNavClick(e, link)}
              >
                {link.title}
              </a>
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
