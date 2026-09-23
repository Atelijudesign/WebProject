import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(56, 189, 248, 0.12)",
  spotlightBorderColor = "rgba(56, 189, 248, 0.35)",
  spotlightSize = 350,
  as: Component = "div",
  ...props
}) => {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  return (
    <Component
      className={`group/spotlight relative overflow-hidden rounded-3xl transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* 1. Halo de Luz Radial de Fondo (Foco de Luz Asimétrico) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${spotlightSize}px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
        }}
      />

      {/* 2. Resplandor Dinámico en el Borde */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${spotlightSize * 0.8}px circle at ${mouseX}px ${mouseY}px,
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

      {/* Contenido de la Tarjeta */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </Component>
  );
};
