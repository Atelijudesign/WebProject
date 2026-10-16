import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const AmbientCursorGlow = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 30, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Solo habilitar en dispositivos con puntero de alta precisión (mouse / trackpad)
    if (typeof window === "undefined") {
      return;
    }

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) {
      return;
    }

    setIsEnabled(true);

    const handlePointerMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mouseX, mouseY]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.065)_0%,rgba(59,130,246,0.03)_40%,transparent_70%)] blur-2xl will-change-transform"
      />
    </div>
  );
};
