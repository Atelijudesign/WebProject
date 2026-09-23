export const Marquee = ({
  children,
  reverse = false,
  pauseOnHover = true,
  duration = "35s",
  gap = "1.25rem",
  className = "",
}) => {
  const durationValue = typeof duration === "number" ? `${duration}s` : duration;

  return (
    <div
      className={`marquee-track flex overflow-hidden user-select-none ${pauseOnHover ? "marquee-pause-on-hover" : ""} ${className}`}
      style={{
        "--duration": durationValue,
        "--gap": gap,
      }}
    >
      <div className={reverse ? "marquee-group-reverse" : "marquee-group"}>
        {children}
      </div>
      <div className={reverse ? "marquee-group-reverse" : "marquee-group"} aria-hidden="true">
        {children}
      </div>
    </div>
  );
};
