import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const TiltCard = ({
  children,
  className = "",
  maxRotation = 8,
  perspective = 1000,
  scale = 1.015,
  hasGlare = true,
  glareOpacity = 0.12,
  as: _Component = "div",
  ...props
}) => {
  const cardRef = useRef(null);

  // Valores normalizados entre -0.5 y 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Física de amortiguación (Spring Damping) para suavidad extrema (Manwar Vibe)
  const springConfig = { stiffness: 180, damping: 22 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Transformaciones 3D de rotación e inclinación
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [maxRotation, -maxRotation]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-maxRotation, maxRotation]);
  const glareX = useTransform(xSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(ySpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalizar de -0.5 a 0.5
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full relative rounded-3xl"
      >
        {/* Capa de Reflejo Glare 3D */}
        {hasGlare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-3xl z-30 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{
              background: `radial-gradient(400px circle at ${glareX} ${glareY}, rgba(255,255,255,${glareOpacity}), transparent 80%)`,
            }}
          />
        )}

        {/* Contenido Renderizado */}
        <div style={{ transform: "translateZ(1px)" }} className="w-full h-full">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};
