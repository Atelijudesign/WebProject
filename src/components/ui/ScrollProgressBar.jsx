import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 38,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[120] pointer-events-none">
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="w-full h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.9)]"
      />
    </div>
  );
};
