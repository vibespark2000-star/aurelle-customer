"use client";

import React from "react";

const POINTS = [
  "Zero return charges",
  "All 38 districts",
  "Verified Tamil chauffeurs",
  "FASTag tolls built in",
  "24/7 helpline",
  "Transparent per-km billing",
  "Sanitised sedans & SUVs",
  "Instant digital invoices",
];

/** A slow ticker of selling points between the hero and the first section. */
export const TrustMarquee: React.FC = () => (
  <section className="relative overflow-hidden border-b border-hairline bg-white py-4" aria-label="Service highlights">
    <ul className="sr-only">
      {POINTS.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
    <div className="mask-fade-x" aria-hidden="true">
      {/* Two identical tracks so the -50% translation loops seamlessly. */}
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((set) => (
          <div key={set} className="flex items-center">
            {POINTS.map((point) => (
              <span key={`${set}-${point}`} className="flex items-center whitespace-nowrap">
                <span className="px-7 font-display text-[22px] font-bold tracking-tight text-ink md:text-[26px]">
                  {point}
                </span>
                <svg width="22" height="22" viewBox="0 0 24 24" className="shrink-0">
                  <defs>
                    <linearGradient id={`star-${set}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#BF0123" />
                      <stop offset="0.5" stopColor="#BF0123" />
                      <stop offset="1" stopColor="#BF0123" />
                    </linearGradient>
                  </defs>
                  <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z" fill={`url(#star-${set})`} />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);
