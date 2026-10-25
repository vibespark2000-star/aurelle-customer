"use client";

import { ArrowRight, Check, TrendDown as TrendingDown } from "@phosphor-icons/react";
import React, { useState } from "react";

import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FLEET } from "@/data/fleet";

/** Rates come from fleet data so the simulator can never drift from real pricing. */
const RATE_TIERS = FLEET.map((v) => ({
  category: v.category,
  perKm: v.ratePerKm,
  batta: v.driverBattaPerDay,
}));

const BENEFITS = [
  "Strictly one-way pricing across all 38 TN districts",
  "Transparent per-km billing with no hidden fees",
  "FASTag prepaid highway toll integration",
  "Digital invoice sent to your mobile instantly",
];

const MIN_KM = 50;
const MAX_KM = 700;

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const WhyChooseUs: React.FC = () => {
  const containerRef = useSilkReveal<HTMLDivElement>();
  const [distance, setDistance] = useState(300);
  const [tierIndex, setTierIndex] = useState(() =>
    Math.max(
      0,
      RATE_TIERS.findIndex((t) => t.category === "Sedan")
    )
  );

  const tier = RATE_TIERS[tierIndex] ?? RATE_TIERS[0];
  const toll = Math.floor(distance * 1.5);

  // Aurelle: one-way distance only, one driver allowance.
  const aurelleTotal = distance * tier.perKm + tier.batta + toll;
  // Traditional operators: round-trip distance and a doubled allowance for the empty return leg.
  const traditionalTotal = distance * 2 * tier.perKm + tier.batta * 2 + toll * 2;

  const savings = traditionalTotal - aurelleTotal;
  const savingsPct = Math.round((savings / traditionalTotal) * 100);
  const fill = ((distance - MIN_KM) / (MAX_KM - MIN_KM)) * 100;

  return (
    <section
      ref={containerRef}
      id="why-choose-us"
      className="relative overflow-hidden bg-surface-alt py-12 md:py-16"
    >

      <div className="shell relative">
        <SectionHeading
          title="Why pay double for"
          titleRest="an empty return?"
          subtitle="Most operators bill twice the distance when you drop in another district. We bill only the road you actually travel. Move the slider and see."
          className="silk-item mb-8"
        />

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* ── Simulator ──────────────────────────────────────────────── */}
          <div className="silk-item card p-6 md:p-8 lg:col-span-7">
            <fieldset>
              <legend className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-subtle">Cab class</legend>
              <div className="grid grid-cols-4 gap-1 rounded-full bg-surface-sunken p-1">
                {RATE_TIERS.map((option, idx) => (
                  <button
                    key={option.category}
                    type="button"
                    aria-pressed={tierIndex === idx}
                    onClick={() => setTierIndex(idx)}
                    className={`cursor-pointer rounded-full py-2.5 text-[12.5px] font-bold transition-all duration-300 ${
                      tierIndex === idx ? "bg-brand-600 text-white shadow-md" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {option.category}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-7">
              <div className="mb-4 flex items-baseline justify-between">
                <label htmlFor="savings-distance" className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
                  One-way distance
                </label>
                <output htmlFor="savings-distance" className="font-display text-[34px] font-extrabold leading-none tracking-tight text-ink">
                  {distance}
                  <span className="ml-1 text-[14px] font-semibold text-ink-subtle">km</span>
                </output>
              </div>
              <input
                id="savings-distance"
                type="range"
                min={MIN_KM}
                max={MAX_KM}
                step={10}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="range-brand w-full"
                style={{ "--fill": `${fill}%` } as React.CSSProperties}
              />
              <div className="mt-2.5 flex justify-between text-[11px] font-medium text-ink-subtle">
                <span>{MIN_KM} km</span>
                <span>Chennai → Madurai ≈ 460 km</span>
                <span>{MAX_KM} km</span>
              </div>
            </div>

            <div className="mt-8 space-y-6 border-t border-hairline pt-6">
              <div>
                <div className="mb-2.5 flex items-baseline justify-between text-[13.5px]">
                  <span className="font-medium text-ink-muted">Typical operator · round-trip billed</span>
                  <span className="font-display text-[18px] font-bold text-ink-subtle line-through decoration-brand-500/70">
                    {rupees(traditionalTotal)}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-surface-sunken">
                  <div className="h-full w-full rounded-full bg-ink-subtle/40" />
                </div>
                <p className="mt-2 text-[12px] text-ink-subtle">
                  Billed for {(distance * 2).toLocaleString("en-IN")} km + double driver allowance
                </p>
              </div>

              <div>
                <div className="mb-2.5 flex items-baseline justify-between text-[13.5px]">
                  <span className="font-semibold text-ink">Our one-way fare</span>
                  <span className="font-display text-[22px] font-extrabold text-brand-600">{rupees(aurelleTotal)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-surface-sunken">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
                    style={{ width: `${(aurelleTotal / traditionalTotal) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-[12px] text-ink-subtle">Billed for {distance.toLocaleString("en-IN")} km only</p>
              </div>
            </div>
          </div>

          {/* ── Savings + benefits ─────────────────────────────────────── */}
          <div className="silk-item flex flex-col gap-6 lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl bg-brand-600 text-white">
              <div className="p-6 md:p-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[12px] font-bold text-white">
                  <TrendingDown size={14} weight="bold" />
                  You save {savingsPct}%
                </span>
                <p className="mt-5 text-[13px] font-medium text-white/80">Stays in your pocket on this trip</p>
                <p key={savings} className="mt-1 animate-fade-up font-display text-[3.25rem] font-extrabold leading-none tracking-tight text-white md:text-[3.75rem]">
                  {rupees(savings)}
                </p>
              </div>
            </div>

            <div className="card flex-1 p-6 md:p-8">
              <ul className="space-y-4">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-[14.5px] text-ink-muted">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check size={11} weight="bold" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
              <a href="#booking-widget" className="btn-primary btn-lg mt-8 w-full">
                Get my exact fare
                <ArrowRight size={16} weight="bold" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
