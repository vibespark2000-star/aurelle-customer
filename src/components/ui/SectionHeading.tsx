import React from "react";

/**
 * The heading used at the top of every page section.
 *
 * `title` renders in solid ink (white on dark bands) and `titleRest` in the
 * brand red.
 */
export const SectionHeading: React.FC<{
  title: React.ReactNode;
  titleRest?: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  children?: React.ReactNode;
}> = ({ title, titleRest, subtitle, align = "center", tone = "light", className = "", children }) => {
  const centered = align === "center";
  const dark = tone === "dark";

  return (
    <div className={`${centered ? "text-center mx-auto max-w-3xl" : "text-left max-w-2xl"} ${className}`}>
      <h2
        className={`font-display text-[1.875rem] font-extrabold leading-[1.08] tracking-[-0.03em] md:text-[2.5rem] ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
        {titleRest && (
          <>
            {" "}
            <span className={dark ? "text-brand-500" : "text-brand-600"}>{titleRest}</span>
          </>
        )}
      </h2>

      {subtitle && (
        <p
          className={`mt-3 text-[15px] leading-relaxed ${centered ? "mx-auto max-w-2xl" : ""} ${
            dark ? "text-night-text" : "text-ink-muted"
          }`}
        >
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
};
