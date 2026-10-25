"use client";

import { ArrowRight, CheckCircle, NavigationArrow, ShieldCheck } from "@phosphor-icons/react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Serviceable cities beside the Tamil Nadu map.
 *
 * `x`/`y` are percentages of the square map artwork
 * (public/images/tamil-nadu-map.svg), derived from each district's real
 * latitude/longitude against the artwork's bounds so every pin lands on its
 * actual district.
 */
const CITIES: { id: string; name: string; x: number; y: number }[] = [
  { id: "chennai", name: "Chennai", x: 80.3, y: 17.8 },
  { id: "vellore", name: "Vellore", x: 62.0, y: 19.9 },
  { id: "krishnagiri", name: "Krishnagiri", x: 47.1, y: 25.2 },
  { id: "villupuram", name: "Villupuram", x: 67.8, y: 32.9 },
  { id: "cuddalore", name: "Cuddalore", x: 72.3, y: 35.4 },
  { id: "salem", name: "Salem", x: 46.2, y: 36.5 },
  { id: "nilgiris", name: "Ooty", x: 22.9, y: 39.9 },
  { id: "erode", name: "Erode", x: 39.3, y: 40.8 },
  { id: "namakkal", name: "Namakkal", x: 46.5, y: 42.4 },
  { id: "tiruppur", name: "Tiruppur", x: 33.2, y: 43.9 },
  { id: "coimbatore", name: "Coimbatore", x: 27.0, y: 45.1 },
  { id: "karur", name: "Karur", x: 45.1, y: 45.8 },
  { id: "tiruchirappalli", name: "Trichy", x: 55.1, y: 48.1 },
  { id: "thanjavur", name: "Thanjavur", x: 62.1, y: 48.1 },
  { id: "pudukkottai", name: "Pudukkottai", x: 57.0, y: 53.6 },
  { id: "dindigul", name: "Dindigul", x: 43.5, y: 53.8 },
  { id: "madurai", name: "Madurai", x: 45.7, y: 59.5 },
  { id: "thoothukudi", name: "Thoothukudi", x: 45.9, y: 75.0 },
  { id: "tirunelveli", name: "Tirunelveli", x: 39.9, y: 75.7 },
  { id: "kanyakumari", name: "Kanyakumari", x: 36.4, y: 84.1 },
];

const HUB = CITIES[0];
/** Major corridors drawn out of the Chennai hub. */
const CORRIDORS = ["coimbatore", "madurai", "kanyakumari", "nilgiris", "tiruchirappalli", "salem"];

const COVERAGE_POINTS = [
  {
    icon: CheckCircle,
    title: "38-district hub network",
    body: "Cabs stationed at every district headquarters and major highway junction.",
  },
  {
    icon: NavigationArrow,
    title: "Highway-smart routing",
    body: "NH 44, NH 45 (GST Road), NH 83 and NH 183 with automated FASTag.",
  },
  {
    icon: ShieldCheck,
    title: "Local, verified drivers",
    body: "Tamil-speaking chauffeurs who know the bypasses, temples and weather.",
  },
];

export const ServiceableCities: React.FC = () => {
  const containerRef = useSilkReveal<HTMLDivElement>();

  return (
    <section ref={containerRef} id="serviceable-cities" className="relative overflow-hidden bg-surface-alt py-12 md:py-16">
      <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-10">
        {/* ── Copy ─────────────────────────────────────────────────────── */}
        <div className="silk-item">
          <SectionHeading
            align="left"
            title="One state."
            titleRest="Fully covered."
            subtitle="Whichever corner of Tamil Nadu you're heading to, there's an Aurelle cab close by."
            className="mb-9"
          />

          <ul className="space-y-5">
            {COVERAGE_POINTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-hairline">
                  <Icon size={21} weight="duotone" />
                </span>
                <span>
                  <span className="block font-display text-[16px] font-bold text-ink">{title}</span>
                  <span className="mt-0.5 block text-[14px] leading-relaxed text-ink-muted">{body}</span>
                </span>
              </li>
            ))}
          </ul>

          <ul className="mt-7 flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <li key={city.id}>
                <Link
                  href={`/district/${city.id}`}
                  className="block rounded-full border border-hairline bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-muted transition-all hover:border-ink hover:text-ink"
                >
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/#tamil-nadu-districts" className="btn-dark mt-7">
            View all 38 districts <ArrowRight size={15} weight="bold" />
          </Link>
        </div>

        {/* ── Map ──────────────────────────────────────────────────────── */}
        <div className="silk-item relative mx-auto w-full max-w-[540px]">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-hairline bg-white shadow-lift">
            <Image
              src="/images/tamil-nadu-map.svg"
              alt=""
              aria-hidden="true"
              fill
              unoptimized
              sizes="(max-width: 1024px) 90vw, 540px"
              className="object-contain mix-blend-multiply"
            />

            {/* Corridors from the Chennai hub */}
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="corridor" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#BF0123" />
                  <stop offset="1" stopColor="#BF0123" />
                </linearGradient>
              </defs>
              {CORRIDORS.map((id) => {
                const c = CITIES.find((x) => x.id === id)!;
                const mx = (HUB.x + c.x) / 2 + 6;
                const my = (HUB.y + c.y) / 2 - 6;
                return (
                  <path
                    key={id}
                    d={`M ${HUB.x} ${HUB.y} Q ${mx} ${my} ${c.x} ${c.y}`}
                    fill="none"
                    stroke="url(#corridor)"
                    strokeWidth="0.45"
                    strokeLinecap="round"
                    strokeDasharray="1.4 1.6"
                    className="animate-dash-run"
                    opacity="0.85"
                  />
                );
              })}
            </svg>

            <ul aria-label="Service points across Tamil Nadu" className="absolute inset-0">
              {CITIES.map((city) => {
                const hub = city.id === HUB.id;
                return (
                  <li key={city.id} className="absolute" style={{ left: `${city.x}%`, top: `${city.y}%` }}>
                    <Link
                      href={`/district/${city.id}`}
                      title={`${city.name} — service point`}
                      className="group absolute block -translate-x-1/2 -translate-y-1/2 cursor-pointer p-1.5"
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/30 motion-safe:animate-ping ${
                          hub ? "h-6 w-6" : "h-3.5 w-3.5"
                        }`}
                      />
                      <span
                        aria-hidden="true"
                        className={`relative block rounded-full border-2 border-white shadow-[0_2px_8px_rgba(191,1,35,0.5)] transition-transform duration-200 group-hover:scale-150 ${
                          hub ? "h-4 w-4 bg-night" : "h-2.5 w-2.5 bg-brand-600"
                        }`}
                      />
                      <span
                        className={`pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-night px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg transition-opacity duration-150 ${
                          hub ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                        }`}
                      >
                        {city.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Floating stat card */}
          <div className="absolute bottom-6 right-0 animate-float rounded-2xl border border-hairline bg-white/95 px-4 py-3 shadow-lift backdrop-blur sm:right-2">
            <span className="block font-display text-[26px] font-extrabold leading-none text-brand-600">38/38</span>
            <span className="mt-1 block text-[11.5px] font-medium text-ink-muted">districts served</span>
          </div>
        </div>
      </div>
    </section>
  );
};
