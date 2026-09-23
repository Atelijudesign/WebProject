import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import Hero from "../components/Hero";
import { TechMarqueeSection } from "../components/TechMarqueeSection";
import { KeyMetricsBar } from "../components/KeyMetricsBar";
import About from "../components/About";
import Automation from "../components/Automation";
import BimComparisonSection from "../components/BimComparisonSection";
import Services from "../components/Services";
import ToolsPreview from "../components/ToolsPreview";
import Experience from "../components/Experience";
import Portfolio from "../components/Portfolio";
import Contact from "../components/Contact";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      <SEOHead
        title="Andrés Gallo P. | Proyectista Estructural BIM"
        description="Proyectista Estructural BIM Senior con 15+ años en minería, aeropuertos y hospitales. Especialista en Revit, Tekla, Dynamo, pyRevit y desarrollo en Python y C#."
        path="/"
        keywords="Proyectista Estructural BIM, Modelador BIM Estructural, Revit API, pyRevit, C#, Python, Tekla Structures, Navisworks, Santiago Chile"
        schema={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Andrés Gallo P.",
          "url": "https://atelijudesign.com",
          "jobTitle": "Proyectista Estructural BIM",
          "description": "Proyectista Estructural BIM Senior con 15+ años de experiencia. Especializado en modelado paramétrico, planos de fabricación y desarrollo de plugins en Python y C#. Estudiante de Ingeniería en Construcción.",
          "knowsAbout": ["BIM", "Revit API", "pyRevit", "C#", "Python", "Tekla Structures", "Navisworks", "Modelado Estructural", "Planos de Fabricación"],
          "hasOccupation": {
            "@type": "Occupation",
            "name": "Proyectista Estructural BIM",
            "occupationLocation": { "@type": "Country", "name": "Chile" }
          },
          "sameAs": [
            "https://www.linkedin.com/in/andresgallop/",
            "https://github.com/Atelijudesign"
          ]
        }}
      />
      <Hero />
      <TechMarqueeSection />
      <KeyMetricsBar />
      <About />
      <Automation />
      <BimComparisonSection />
      <Services />
      <ToolsPreview />
      <Experience />
      <Portfolio />
      <Contact />
    </>
  );
}
