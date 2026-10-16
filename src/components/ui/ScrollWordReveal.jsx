import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HIGHLIGHT_TERMS = new Set([
  "BIM",
  "Python",
  "C#",
  "pyRevit",
  "Tekla",
  "Revit",
  "estructural",
  "automatización",
  "precisión",
  "cálculo",
  "código",
  "structural",
  "automation",
  "precision",
  "engineering",
  "code",
]);

const WordScrub = ({ word, range, progress }) => {
  const cleanWord = word.replace(/[.,:;()—"']/g, "");
  const isHighlighted = HIGHLIGHT_TERMS.has(cleanWord);

  const opacity = useTransform(progress, range, [0.18, 1]);
  const color = useTransform(
    progress,
    range,
    isHighlighted
      ? ["rgba(56, 189, 248, 0.25)", "rgba(56, 189, 248, 1)"]
      : ["rgba(148, 163, 184, 0.22)", "rgba(248, 250, 252, 1)"]
  );
  const translateY = useTransform(progress, range, [4, 0]);

  return (
    <span className="relative inline-block mr-2 sm:mr-3 my-1">
      <motion.span
        style={{ opacity, color, y: translateY }}
        className={`inline-block font-extrabold transition-all duration-75 select-none ${
          isHighlighted ? "drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]" : ""
        }`}
      >
        {word}
      </motion.span>
    </span>
  );
};

export const ScrollWordReveal = ({ text, subtitle = "", className = "" }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.88", "end 0.35"],
  });

  if (!text) {
    return null;
  }

  const words = text.split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  return (
    <div ref={containerRef} className={`relative py-8 md:py-14 my-4 ${className}`}>
      {subtitle && (
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-4">
          {subtitle}
        </span>
      )}
      <p className="flex flex-wrap text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed sm:leading-tight font-extrabold tracking-tight">
        {words.map((word, index) => {
          const start = index / totalWords;
          const end = Math.min(1, start + 1.2 / totalWords);
          return (
            <WordScrub
              key={`${word}-${index}`}
              word={word}
              range={[start, end]}
              progress={scrollYProgress}
            />
          );
        })}
      </p>
    </div>
  );
};
