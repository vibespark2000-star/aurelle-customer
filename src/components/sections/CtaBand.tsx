"use client";

import { ArrowRight, CurrencyInr, Clock, Phone, ShieldCheck } from "@phosphor-icons/react";
import React from "react";

import { SUPPORT_PHONE_TEL, SUPPORT_PHONE_DISPLAY } from "@/lib/site";

const POINTS = [
  { icon: CurrencyInr, label: "Fare shown before you book" },
  { icon: Clock, label: "Chauffeur assigned in minutes" },
  { icon: ShieldCheck, label: "Verified, background-checked drivers" },
];

/** Solid red conversion panel between the marketing sections. */
export const CtaBand: React.FC = () => (
  <section className="bg-white px-3 py-2 sm:px-4 md:py-4">
    <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[2rem] bg-brand-600 text-white md:rounded-[2.5rem]">
      {/* Faint road-line motif, white on red */}
      <svg
        className="pointer-events-none absolute -right-10 top-1/2 hidden h-[140%] -translate-y-1/2 opacity-[0.12] md:block"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <path d="M40 380 C 160 300, 120 140, 360 20" stroke="#fff" strokeWidth="44" strokeLinecap="round" />
        <path d="M40 380 C 160 300, 120 140, 360 20" stroke="#BF0123" strokeWidth="4" strokeDasharray="18 18" />
      </svg>

      <div className="relative z-10 flex flex-col gap-10 px-6 py-12 sm:px-10 md:px-14 md:py-14 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-white md:text-[3rem]">
            Your next trip, priced honestly.
          </h2>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/85">
            One-way means one-way. No return-leg padding, no surprise surcharges at the drop — just the distance you
            travel, across all 38 districts.
          </p>
          <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
            {POINTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-[13.5px] font-medium text-white">
                <Icon size={18} weight="fill" className="shrink-0 text-white/80" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <a
            href="#booking-widget"
            className="btn btn-lg group bg-white text-brand-700 shadow-lg hover:-translate-y-0.5 hover:bg-brand-50"
          >
            Book your ride
            <ArrowRight size={17} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={SUPPORT_PHONE_TEL}
            className="btn btn-lg border border-white/40 bg-transparent text-white hover:bg-white/10"
          >
            <Phone size={16} weight="fill" />
            {SUPPORT_PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  </section>
);
