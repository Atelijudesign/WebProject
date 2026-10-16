import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const RollingTextButton = ({
  children,
  icon,
  iconRight,
  href,
  to,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  download,
  target,
  rel,
  type = "button",
  disabled = false,
  ariaLabel,
}) => {
  // Variantes de estilo arquitectónico de alta gama
  const variantStyles = {
    primary:
      "bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.45)]",
    secondary:
      "bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-500/50 hover:text-white shadow-lg",
    emerald:
      "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    outline:
      "bg-transparent hover:bg-cyan-950/40 text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 hover:border-cyan-400",
    ghost:
      "bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent",
  };

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base rounded-2xl gap-2.5 font-bold",
  };

  const selectedVariant = variantStyles[variant] || variantStyles.primary;
  const selectedSize = sizeStyles[size] || sizeStyles.md;

  const content = (
    <motion.span
      className="relative inline-flex items-center overflow-hidden font-mono font-bold tracking-wide"
      initial="initial"
      whileHover="hover"
    >
      {/* Texto original que sube */}
      <motion.span
        className="inline-flex items-center gap-2"
        variants={{
          initial: { y: 0, opacity: 1 },
          hover: { y: "-125%", opacity: 0 },
        }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
      >
        {icon && (typeof icon === "string" ? <i className={icon} /> : icon)}
        <span>{children}</span>
        {iconRight && (typeof iconRight === "string" ? <i className={iconRight} /> : iconRight)}
      </motion.span>

      {/* Réplica idéntica que entra desde abajo */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 inline-flex items-center justify-center gap-2 pointer-events-none"
        variants={{
          initial: { y: "125%", opacity: 0 },
          hover: { y: 0, opacity: 1 },
        }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
      >
        {icon && (typeof icon === "string" ? <i className={icon} /> : icon)}
        <span>{children}</span>
        {iconRight && (typeof iconRight === "string" ? <i className={iconRight} /> : iconRight)}
      </motion.span>
    </motion.span>
  );

  const baseClasses = `relative inline-flex items-center justify-center font-mono transition-all duration-300 backdrop-blur-md select-none group ${selectedVariant} ${selectedSize} ${className}`;

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
        <Link to={to} className={baseClasses} onClick={onClick} aria-label={ariaLabel}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
        <a
          href={href}
          className={baseClasses}
          onClick={onClick}
          download={download}
          target={target}
          rel={rel}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={ariaLabel}
    >
      {content}
    </motion.button>
  );
};
