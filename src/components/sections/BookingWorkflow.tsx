"use client";

import { CheckSquare, MagnifyingGlass as Search, Sparkle as Sparkles } from "@phosphor-icons/react";
import React from "react";

import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const BookingWorkflow: React.FC = () => {
  const containerRef = useSilkReveal<HTMLDivElement>();

  const steps = [
    {
      number: "01",
      icon: <Search size={22} weight="duotone" />,
      title: "Select TN Districts & Fleet",
      description:
        "Select your pickup district, drop destination anywhere in Tamil Nadu, travel date, and preferred cab category.",
    },
    {
      number: "02",
      icon: <CheckSquare size={22} weight="duotone" />,
      title: "Review Transparent Fare",
      description:
        "Review detailed per-km calculations including driver allowances and FASTag highway tolls with zero hidden costs.",
    },
    {
      number: "03",
      icon: <Sparkles size={22} weight="duotone" />,
      title: "Chauffeur Dispatched",
      description:
        "Driver details and cab live tracking link are sent 2 hours before pickup. Board your ride and pay driver directly.",
    },
  ];

  return (
    <section ref={containerRef} id="booking-workflow" className="py-12 md:py-16 bg-surface-alt">
      <div className="shell">
        <SectionHeading
          title="How It Works"
          titleRest="in Three Steps"
          subtitle="From picking your districts to boarding the cab — three steps, no phone calls required."
          className="silk-item mb-8"
        />

        <ol className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connector, desktop only — sits behind the step markers. */}
          <div
            className="hidden lg:block absolute top-7 left-[16%] right-[16%] h-px bg-hairline-strong"
            aria-hidden="true"
          />

          {steps.map((step, idx) => (
            <li key={idx} className="silk-item relative flex flex-col items-center text-center">
              <span className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center mb-5 relative z-10 ring-8 ring-surface-alt">
                {step.icon}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600 mb-2">
                Step {step.number}
              </span>
              <h3 className="text-[17px] font-bold text-ink mb-2">{step.title}</h3>
              <p className="text-[13px] text-ink-muted leading-relaxed max-w-xs">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
