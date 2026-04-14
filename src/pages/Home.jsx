import Hero from "../components/Hero";
import About from "../components/About";
import Automation from "../components/Automation";
import Services from "../components/Services";
import ToolsPreview from "../components/ToolsPreview";
import Experience from "../components/Experience";
import Portfolio from "../components/Portfolio";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Automation />
      <Services />
      <ToolsPreview />
      <Experience />
      <Portfolio />
      <Contact />
    </>
  );
}
