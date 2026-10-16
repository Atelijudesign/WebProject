import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export const Tilt3DCard = ({
  children,
  className = "",
  containerClassName = "",
  maxTilt = 8,
  perspective = 1000,
  hasGlare = true,
  glareColor = "rgba(56, 189, 248, 0.14)",
  spotlightBorderColor = "rgba(56, 189, 248, 0.4)",
  as: Component = "div",
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Coordenadas relativas normalizadas [-0.5, 0.5]
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Coordenadas absolutas en px dentro de la tarjeta para el resplandor
  const pxX = useMotionValue(-1000);
  const pxY = useMotionValue(-1000);

  // Resortes cinéticos para física natural
  const springConfig = { stiffness: 320, damping: 25 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Rotaciones 3D proporcionales
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    pxX.set(mouseXPos);
    pxY.set(mouseYPos);

    // Normalizado de -0.5 a 0.5
    const normX = mouseXPos / rect.width - 0.5;
    const normY = mouseYPos / rect.height - 0.5;

    x.set(normX);
    y.set(normY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    pxX.set(-1000);
    pxY.set(-1000);
  };

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className={`relative h-full ${containerClassName}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden rounded-3xl transition-shadow duration-300 will-change-transform ${className}`}
        {...props}
      >
        {/* 1. Halo Radial Especular (Luz 3D dinámica) */}
        {hasGlare && (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              background: useMotionTemplate`
                radial-gradient(
                  380px circle at ${pxX}px ${pxY}px,
                  ${glareColor},
                  transparent 80%
                )
              `,
            }}
          />
        )}

        {/* 2. Resplandor Dinámico en el Borde */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 z-10"
          style={{
            opacity: isHovered ? 1 : 0,
            background: useMotionTemplate`
              radial-gradient(
                260px circle at ${pxX}px ${pxY}px,
                ${spotlightBorderColor},
                transparent 70%
              )
            `,
            maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1.5px",
          }}
        />

        {/* 3. Contenido en Capa Z Elevada para Parallax 3D */}
        <div
          style={{ transform: "translateZ(18px)", transformStyle: "preserve-3d" }}
          className="relative z-20 w-full h-full flex flex-col justify-between"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};
