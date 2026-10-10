"use client";

import { ArrowRight, Check, Coins, TrendDown as TrendingDown } from "@phosphor-icons/react";
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

  return (
    <section ref={containerRef} id="why-choose-us" className="py-12 md:py-16 bg-surface-alt">
      <div className="shell">
        <SectionHeading
          title="Why Pay Double"
          titleRest="for an Empty Return?"
          subtitle="Most Tamil Nadu operators charge twice the distance when you drop off in another district. We bill only the route you actually travel — move the slider and see the difference."
          className="silk-item mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Simulator ──────────────────────────────────────────────── */}
          <div className="silk-item lg:col-span-7 card p-6 md:p-7">
            <h3 className="flex items-center gap-2 text-[17px] font-bold text-ink mb-6">
              <Coins size={18} className="text-brand-600" />
              Savings simulator
            </h3>

            {/* Cab class */}
            <fieldset className="mb-6">
              <legend className="field-label">Cab class</legend>
              <div className="grid grid-cols-4 gap-2">
                {RATE_TIERS.map((option, idx) => (
                  <button
                    key={option.category}
                    type="button"
                    aria-pressed={tierIndex === idx}
                    onClick={() => setTierIndex(idx)}
                    className={`py-2.5 rounded-lg border text-[12px] font-semibold transition-colors cursor-pointer ${
                      tierIndex === idx
                        ? "bg-brand-600 border-brand-600 text-white"
                        : "bg-white border-hairline-strong text-ink-muted hover:border-brand-600 hover:text-brand-600"
                    }`}
                  >
                    {option.category}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Distance */}
            <div className="mb-7">
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="savings-distance" className="field-label mb-0">
                  One-way distance
                </label>
                <output htmlFor="savings-distance" className="text-lg font-extrabold text-ink tracking-tight">
                  {distance} <span className="text-[13px] font-medium text-ink-subtle">km</span>
                </output>
              </div>
              <input
                id="savings-distance"
                type="range"
                min={50}
                max={700}
                step={10}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-1.5 bg-hairline rounded-full appearance-none cursor-pointer accent-brand-600"
              />
              <div className="flex justify-between text-[11px] text-ink-subtle font-medium mt-1.5">
                <span>50 km</span>
                <span>375 km</span>
                <span>700 km</span>
              </div>
            </div>

            {/* Comparison bars */}
            <div className="space-y-5 pt-6 border-t border-hairline">
              <div>
                <div className="flex justify-between items-baseline text-[13px] mb-2">
                  <span className="font-medium text-ink-muted">Typical operator (round-trip billed)</span>
                  <span className="font-bold text-ink">₹{traditionalTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-2.5 bg-surface-sunken rounded-full overflow-hidden">
                  <div className="h-full w-full bg-ink-subtle" />
                </div>
                <p className="text-[12px] text-ink-subtle mt-1.5">
                  Billed for {(distance * 2).toLocaleString("en-IN")} km + double driver allowance
                </p>
              </div>

              <div>
                <div className="flex justify-between items-baseline text-[13px] mb-2">
                  <span className="font-semibold text-brand-600">Aurelle one-way fare</span>
                  <span className="font-bold text-brand-600">₹{aurelleTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-2.5 bg-brand-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 transition-all duration-500"
                    style={{ width: `${(aurelleTotal / traditionalTotal) * 100}%` }}
                  />
                </div>
                <p className="text-[12px] text-ink-subtle mt-1.5">
                  Billed for {distance.toLocaleString("en-IN")} km only
                </p>
              </div>
            </div>
          </div>

          {/* ── Benefits ───────────────────────────────────────────────── */}
          <div className="silk-item lg:col-span-5 lg:pt-4">
            <span className="inline-flex items-center gap-2 badge mb-5 bg-emerald-50 text-emerald-800 border-emerald-200">
              <TrendingDown size={13} />
              Save up to {savingsPct}% per trip
            </span>

            <h3 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-3">
              Keep ₹{savings.toLocaleString("en-IN")} in your pocket.
            </h3>

            <p className="text-[15px] text-ink-muted leading-relaxed mb-6">
              There is no reason to pay for the driver&apos;s return day between Chennai, Madurai, Trichy or Coimbatore.
              Our route matching means you pay for the kilometres you travel — nothing more.
            </p>

            <ul className="space-y-3 mb-8">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-[14px] text-ink-muted">
                  <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} weight="bold" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <a href="#booking-widget" className="btn-primary">
              Estimate your route
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
