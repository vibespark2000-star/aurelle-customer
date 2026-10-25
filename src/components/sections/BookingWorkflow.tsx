"use client";

import { ArrowRight, Car, MapPinLine, Receipt } from "@phosphor-icons/react";
import React from "react";

import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    icon: MapPinLine,
    title: "Choose your route",
    description: "Pick a pickup district, a drop anywhere in Tamil Nadu, your travel date and the cab you like.",
  },
  {
    icon: Receipt,
    title: "See the full fare",
    description: "Per-km fare, driver allowance and FASTag tolls laid out up front. Nothing gets added later.",
  },
  {
    icon: Car,
    title: "Ride with a pro",
    description: "Chauffeur details and a live tracking link arrive 2 hours before pickup. Pay the driver directly.",
  },
];

export const BookingWorkflow: React.FC = () => {
  const containerRef = useSilkReveal<HTMLDivElement>();

  return (
    <section ref={containerRef} id="booking-workflow" className="relative overflow-hidden bg-surface-alt py-12 md:py-16">
      <div className="shell">
        <SectionHeading
          title="Booked in a minute."
          titleRest="On the road in three steps."
          subtitle="No phone calls, no haggling, no surprises at the drop point."
          className="silk-item mb-8"
        />

        <ol className="relative grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Connector behind the icons, desktop only. */}
          <div
            className="absolute left-[16.6%] right-[16.6%] top-[60px] hidden h-[2px] bg-hairline-strong lg:block"
            aria-hidden="true"
          />

          {STEPS.map(({ icon: Icon, title, description }, idx) => (
            <li
              key={title}
              className="silk-item group relative flex flex-col items-center rounded-[1.75rem] border border-hairline bg-white px-7 pb-8 pt-8 text-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <span
                className="pointer-events-none absolute right-5 top-3 select-none font-display text-[72px] font-extrabold leading-none text-surface-sunken transition-colors duration-500 group-hover:text-brand-50"
                aria-hidden="true"
              >
                0{idx + 1}
              </span>

              <span className="relative z-10 flex h-[56px] w-[56px] items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg ring-8 ring-white transition-all duration-500 group-hover:bg-brand-700">
                <Icon size={26} weight="duotone" />
              </span>

              <h3 className="mt-5 font-display text-[21px] font-bold tracking-tight text-ink">{title}</h3>
              <p className="mt-2.5 max-w-xs text-[14px] leading-relaxed text-ink-muted">{description}</p>
            </li>
          ))}
        </ol>

        <div className="silk-item mt-8 flex justify-center">
          <a href="#booking-widget" className="btn-primary btn-lg group">
            Start booking
            <ArrowRight size={17} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};
