import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";

export const AnimatedBeam = ({
  className = "",
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 2 + 3,
  delay = 0,
  pathColor = "rgba(100, 116, 139, 0.2)",
  pathWidth = 2,
  pathOpacity = 0.3,
  gradientStartColor = "#38bdf8",
  gradientStopColor = "#3b82f6",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  // Calcular las coordenadas exactas de la curva bezier entre los dos nodos
  const updatePath = () => {
    if (!containerRef?.current || !fromRef?.current || !toRef?.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const rectA = fromRef.current.getBoundingClientRect();
    const rectB = toRef.current.getBoundingClientRect();

    const svgWidth = containerRect.width;
    const svgHeight = containerRect.height;
    setSvgDimensions({ width: svgWidth, height: svgHeight });

    const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
    const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
    const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
    const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

    const controlPointX = (startX + endX) / 2;
    const controlPointY = (startY + endY) / 2 + curvature;

    const d = `M ${startX},${startY} Q ${controlPointX},${controlPointY} ${endX},${endY}`;
    setPathD(d);
  };

  useEffect(() => {
    updatePath();

    const resizeObserver = new ResizeObserver(() => {
      updatePath();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updatePath);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  if (!pathD) return null;

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none absolute left-0 top-0 transform-gpu stroke-2 ${className}`}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      {/* Path Base Estático */}
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />

      {/* Path Animado con Haz de Luz Dinámico */}
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${id})`}
        strokeOpacity="1"
        strokeLinecap="round"
      />

      <defs>
        <motion.linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: "0%",
            x2: "0%",
            y1: "0%",
            y2: "0%",
          }}
          animate={{
            x1: reverse ? ["90%", "-10%"] : ["-10%", "90%"],
            x2: reverse ? ["100%", "0%"] : ["0%", "100%"],
            y1: reverse ? ["90%", "-10%"] : ["-10%", "90%"],
            y2: reverse ? ["100%", "0%"] : ["0%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
            duration,
            delay,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
};
