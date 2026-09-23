import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export const NumberTicker = ({
  value,
  direction = "up",
  delay = 0,
  className = "",
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
}) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      motionValue.set(direction === "down" ? 0 : value);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, delay, value, direction, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (!ref.current) return;
      const formatted = Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(Number(latest.toFixed(decimalPlaces)));

      ref.current.textContent = `${prefix}${formatted}${suffix}`;
    });
  }, [springValue, decimalPlaces, prefix, suffix]);

  return (
    <span
      ref={ref}
      className={`inline-block tabular-nums tracking-tight ${className}`}
    >
      {prefix}{direction === "down" ? value : 0}{suffix}
    </span>
  );
};
