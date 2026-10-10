"use client";

import { ArrowRight, CurrencyInr as BadgeIndianRupee, Clock, Phone, ShieldCheck } from "@phosphor-icons/react";
import React from "react";
import Image from "next/image";

import { SUPPORT_PHONE_TEL, SUPPORT_PHONE_DISPLAY } from "@/lib/site";

const POINTS = [
  { icon: BadgeIndianRupee, label: "Fare shown before you book" },
  { icon: Clock, label: "Chauffeur assigned in minutes" },
  { icon: ShieldCheck, label: "Verified, background-checked drivers" },
];

/**
 * Full-bleed cinematic break between the marketing sections — a dark, graded
 * image band that resets the eye and carries the primary conversion CTA.
 */
export const CtaBand: React.FC = () => (
  <section className="relative overflow-hidden">
    <div className="relative min-h-[420px] md:min-h-[460px] flex items-center">
      <Image
        src="/hero/highway-night.jpg"
        alt=""
        fill
        sizes="100vw"
        quality={80}
        className="object-cover object-center"
      />

      {/* Grade: darken for contrast, then wash crimson through it. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,6,6,0.92) 0%, rgba(8,6,6,0.72) 38%, rgba(140,10,32,0.42) 70%, rgba(200,16,46,0.3) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 shell py-12 md:py-14">
        <div className="max-w-2xl">
          <h2 className="text-cine font-serif text-[1.75rem] md:text-[2.25rem] font-semibold leading-[1.15] tracking-tight text-white">
            Your next outstation trip,
            <br />
            <span className="text-brand-400">priced honestly.</span>
          </h2>

          <p className="text-cine mt-4 max-w-lg text-[15px] leading-relaxed text-white/80">
            One-way means one-way. No return-leg padding, no surprise surcharges at the drop point — just the distance
            you actually travel, across all 38 districts.
          </p>

          <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
            {POINTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-[13px] font-medium text-white/85">
                <Icon size={18} weight="duotone" className="shrink-0 text-brand-400" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#booking-widget" className="btn-gold btn-lg group">
              Get your fare
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={SUPPORT_PHONE_TEL}
              className="btn btn-lg border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Phone size={16} />
              {SUPPORT_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
