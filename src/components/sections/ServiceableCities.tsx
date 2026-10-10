"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Serviceable cities: a two-column link list beside the Tamil Nadu map.
 *
 * `x`/`y` are percentages of the map artwork (public/images/tamil-nadu-map.svg,
 * a 980×980 square). They were derived from each district's real latitude and
 * longitude against the artwork's bounds — lon 76.23–80.35°E spans x 150→800px,
 * lat 13.57–8.07°N spans y 110→825px — so every pin lands on its actual
 * district rather than being eyeballed.
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

export const ServiceableCities: React.FC = () => {
  const containerRef = useSilkReveal<HTMLDivElement>();

  return (
    <section ref={containerRef} id="serviceable-cities" className="py-12 md:py-16 bg-surface">
      <div className="shell grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
        {/* ── City list ──────────────────────────────────────────────────── */}
        <div className="silk-item">
          <SectionHeading align="left" title="Our Serviceable" titleRest="Cities in Tamil Nadu" className="mb-7" />

          <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
            {CITIES.map((city) => (
              <li key={city.id}>
                <Link
                  href={`/district/${city.id}`}
                  className="group flex items-center gap-2.5 text-[14px] text-ink-muted hover:text-brand-600 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full border border-brand-500 group-hover:bg-brand-500 transition-colors shrink-0" />
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/#tamil-nadu-districts" className="btn-primary mt-8">
            View all 38 districts
          </Link>
        </div>

        {/* ── Map with service points ────────────────────────────────────── */}
        <div className="silk-item relative mx-auto w-full max-w-[460px]">
          {/* Square box so the percentage pins line up with the square artwork. */}
          <div className="relative aspect-square">
            <Image
              src="/images/tamil-nadu-map.svg"
              alt=""
              aria-hidden="true"
              fill
              unoptimized
              sizes="(max-width: 1024px) 90vw, 460px"
              className="object-contain"
            />

            <ul aria-label="Aurelle Cabs service points across Tamil Nadu" className="absolute inset-0">
              {CITIES.map((city) => (
                <li
                  key={city.id}
                  className="absolute"
                  style={{ left: `${city.x}%`, top: `${city.y}%` }}
                >
                  <Link
                    href={`/district/${city.id}`}
                    title={`${city.name} — Aurelle service point`}
                    className="group absolute -translate-x-1/2 -translate-y-full block cursor-pointer"
                  >
                    {/* Pulse ring, kept out of the a11y tree. */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-600/25 motion-safe:animate-ping"
                    />
                    {/* Teardrop pin. */}
                    <span
                      aria-hidden="true"
                      className="relative block h-[18px] w-[13px] rounded-t-full rounded-b-[2px] bg-brand-600 shadow-[0_2px_6px_rgba(10,8,8,0.35)] transition-transform duration-200 group-hover:scale-125 [clip-path:polygon(50%_100%,0%_42%,0%_0%,100%_0%,100%_42%)]"
                    >
                      <span className="absolute left-1/2 top-[5px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-surface" />
                    </span>

                    {/* Label appears on hover/focus so 20 pins stay readable. */}
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                      {city.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-2 text-center text-[12px] font-medium text-ink-subtle">
            <span className="font-bold text-brand-600">{CITIES.length}</span> live service points · all 38 districts
            covered
          </p>
        </div>
      </div>
    </section>
  );
};
