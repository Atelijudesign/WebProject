import { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 bg-bim-blue hover:bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center focus:outline-none group transform hover:scale-110 ${
        isVisible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      aria-label="Volver al inicio"
    >
      <i className="fa-solid fa-arrow-up group-hover:-translate-y-1 transition-transform duration-300"></i>
    </button>
  );
}
