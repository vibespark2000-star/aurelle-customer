import React from "react";

/**
 * The single heading treatment used at the top of every page section.
 *
 * Titles are two-tone: `title` renders in crimson and `titleRest` in ink,
 * matching the reference ("Cab Types for Every Traveler"). Pass only `title`
 * for a single-colour heading.
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
    <div className={`${centered ? "text-center mx-auto max-w-2xl" : "text-left max-w-2xl"} ${className}`}>
      <h2 className="font-serif text-[1.625rem] md:text-[2.125rem] font-semibold leading-[1.18] tracking-tight">
        <span className={dark ? "text-white" : "text-brand-600"}>{title}</span>
        {titleRest && <span className={dark ? "text-gray-300" : "text-ink"}> {titleRest}</span>}
      </h2>

      {subtitle && (
        <p
          className={`mt-2.5 text-[14px] leading-relaxed ${centered ? "max-w-xl mx-auto" : ""} ${
            dark ? "text-gray-400" : "text-ink-muted"
          }`}
        >
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
};
