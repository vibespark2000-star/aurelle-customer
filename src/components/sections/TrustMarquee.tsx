"use client";

import { CheckCircle } from "@phosphor-icons/react";
import React from "react";

export const TrustMarquee: React.FC = () => {
  const points = [
    "Exclusively Serving All 38 Districts of Tamil Nadu",
    "Zero Inter-District Return Charges",
    "Professional Tamil Chauffeurs",
    "FASTag Toll Automated Billing",
    "24/7 District Helpline Support",
    "Transparent Per-KM Billing",
    "Sanitized Luxury Sedans & SUVs",
    "Instant SMS & Digital Invoices",
  ];

  return (
    <section className="bg-brand-600 text-white py-4 overflow-hidden select-none" aria-label="Service highlights">
      {/* Two identical tracks so the -50% translation loops seamlessly. */}
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((set) => (
          <ul key={set} aria-hidden={set === 1} className="flex items-center gap-8 pr-12 text-[13px] font-semibold">
            {points.map((point, idx) => (
              <li key={`${set}-${idx}`} className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle size={15} weight="fill" className="shrink-0 text-brand-200" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
};
