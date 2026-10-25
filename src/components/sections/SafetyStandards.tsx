"use client";

import { Broadcast, Lifebuoy as LifeBuoy, Sparkle, UserCheck } from "@phosphor-icons/react";
import React from "react";

import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SMALL_CARDS = [
  {
    icon: UserCheck,
    title: "Vetted local chauffeurs",
    description: "Background-verified, with 5+ years of highway experience on Tamil Nadu routes.",
  },
  {
    icon: Sparkle,
    title: "Sanitised & inspected",
    description: "Mechanical checklist, tyre-tread check and AC sanitisation before every dispatch.",
  },
  {
    icon: LifeBuoy,
    title: "24/7 breakdown cover",
    description: "If a car has trouble on the highway, a backup cab is dispatched anywhere in the state.",
  },
];

export const SafetyStandards: React.FC = () => {
  const containerRef = useSilkReveal<HTMLDivElement>();

  return (
    <section ref={containerRef} id="safety-standards" className="bg-white py-12 md:py-16">
      <div className="shell">
        <SectionHeading
          title="Every ride,"
          titleRest="watched over."
          subtitle="Long highway trips need disciplined drivers, ready vehicles and real-time monitoring. Here's the standard every trip is held to."
          className="silk-item mb-8"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3">
          {/* ── Feature card: live tracking ─────────────────────────────── */}
          <div className="silk-item relative overflow-hidden rounded-[1.75rem] border border-hairline bg-surface-alt p-7 md:col-span-2 lg:row-span-3 lg:p-9">
            <div className="relative flex h-full flex-col">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <Broadcast size={24} weight="duotone" />
              </span>
              <h3 className="mt-6 font-display text-[26px] font-extrabold tracking-tight text-ink md:text-[30px]">
                24/7 live GPS telematics
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-muted">
                Every trip is tracked live by our control room, with instant speed-limit monitoring and route-deviation
                alerts — plus a live tracking link sent to your phone before pickup.
              </p>

              {/* Tracking mock-up */}
              <div className="relative mt-8 flex-1 overflow-hidden rounded-2xl border border-hairline bg-white p-5 md:min-h-[230px]">
                <svg viewBox="0 0 400 160" className="h-auto w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="track" x1="0" x2="1">
                      <stop offset="0" stopColor="#BF0123" />
                      <stop offset="0.5" stopColor="#BF0123" />
                      <stop offset="1" stopColor="#BF0123" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 130 C 80 130, 90 40, 160 50 S 250 140, 300 90 S 360 30, 385 30"
                    fill="none"
                    stroke="rgba(20,20,22,0.07)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    id="track-path"
                    d="M 20 130 C 80 130, 90 40, 160 50 S 250 140, 300 90 S 360 30, 385 30"
                    fill="none"
                    stroke="url(#track)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="6 8"
                    className="animate-dash-run"
                  />
                  <circle cx="20" cy="130" r="7" fill="#fff" stroke="#141416" strokeWidth="3" />
                  <circle cx="385" cy="30" r="7" fill="#BF0123" stroke="#fff" strokeWidth="3" />
                  <circle r="8" fill="#fff" stroke="#BF0123" strokeWidth="3">
                    <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
                      <mpath href="#track-path" />
                    </animateMotion>
                  </circle>
                  <circle r="16" fill="#BF0123" opacity="0.25">
                    <animateMotion dur="7s" repeatCount="indefinite">
                      <mpath href="#track-path" />
                    </animateMotion>
                  </circle>
                </svg>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                    On route · 72 km/h
                  </span>
                  <span className="rounded-full bg-surface-sunken px-3 py-1.5 text-[12px] font-semibold text-ink-muted">
                    ETA 2h 14m
                  </span>
                  <span className="rounded-full bg-surface-sunken px-3 py-1.5 text-[12px] font-semibold text-ink-muted">
                    Monitored by control room
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Small cards ─────────────────────────────────────────────── */}
          {SMALL_CARDS.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`silk-item group flex flex-col rounded-[1.75rem] border border-hairline bg-surface-alt p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-lift ${
                i === 2 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ink shadow-sm ring-1 ring-hairline transition-all duration-500 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-transparent">
                <Icon size={24} weight="duotone" />
              </span>
              <h3 className="mt-6 font-display text-[19px] font-bold tracking-tight text-ink">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
