"use client";

import { ArrowRight, CaretDown, Clock, Path } from "@phosphor-icons/react";
import React, { useState } from "react";

import { useBooking } from "@/context/BookingContext";
import { POPULAR_ROUTES, FLEET } from "@/data/fleet";
import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Quote these cards against the sedan tier, read from fleet data rather than hardcoded. */
const SEDAN = FLEET.find((v) => v.category === "Sedan") ?? FLEET[0];

/** Cards shown before "Show all". */
const PREVIEW_COUNT = 8;

/** "Tiruchirappalli (Trichy)" → "Trichy": the common name fits the card. */
const shortName = (city: string) => city.match(/\(([^)]+)\)/)?.[1] ?? city;

/** A small decorative route: origin ring, a curved dashed road, destination pin. */
const RouteArt: React.FC<{ seed: number }> = ({ seed }) => {
  // Vary the curve a little per card so the grid doesn't look stamped.
  const bend = [18, -14, 24, -20, 10, -24, 16, -10][seed % 8];
  const d = `M 14 40 C 80 ${40 - bend * 2}, 150 ${40 + bend * 2}, 226 40`;
  return (
    <svg viewBox="0 0 240 80" className="h-16 w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`route-${seed}`} x1="0" x2="1">
          <stop offset="0" stopColor="#BF0123" />
          <stop offset="0.5" stopColor="#BF0123" />
          <stop offset="1" stopColor="#BF0123" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="#E5E7F0" strokeWidth="6" strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke={`url(#route-${seed})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 10"
        className="animate-dash-run"
      />
      <circle cx="14" cy="40" r="7" fill="#fff" stroke="#141416" strokeWidth="3.5" />
      <g transform="translate(226 40)">
        <circle
          r="12"
          fill="#BF0123"
          opacity="0.18"
          className="animate-ping"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        <circle r="7" fill="#BF0123" />
        <circle r="2.6" fill="#fff" />
      </g>
    </svg>
  );
};

export const PopularRoutes: React.FC = () => {
  const containerRef = useSilkReveal<HTMLDivElement>();
  const { setPickupCity, setDropCity, setBookingDrawerOpen, calculateTariff } = useBooking();
  const [showAll, setShowAll] = useState(false);
  const routes = showAll ? POPULAR_ROUTES : POPULAR_ROUTES.slice(0, PREVIEW_COUNT);

  const handleSelectRoute = (from: string, to: string) => {
    setPickupCity(from);
    setDropCity(to);
    // Let the context settle the new cities before recalculating the fare.
    setTimeout(() => {
      calculateTariff();
      setBookingDrawerOpen(true);
    }, 100);
  };

  return (
    <section ref={containerRef} id="popular-routes" className="bg-white py-12 md:py-16">
      <div className="shell">
        <div className="silk-item mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            align="left"
            title="Tamil Nadu's favourite"
            titleRest="highways, pre-priced."
            subtitle="Tap a route to see the full fare and book in seconds. Tolls are already in the estimate."
          />
          <a href="#booking-widget" className="btn-secondary shrink-0">
            Plan a custom route <ArrowRight size={15} weight="bold" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((route, i) => {
            const estimate = route.distanceKm * SEDAN.ratePerKm + SEDAN.driverBattaPerDay + route.distanceKm * 1.5;

            return (
              <button
                key={route.id}
                type="button"
                onClick={() => handleSelectRoute(route.from, route.to)}
                className="silk-item group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.5rem] border border-hairline bg-white p-5 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift"
              >
                {/* Hover wash */}
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-600 transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden="true"
                />

                <span className="self-start rounded-full bg-surface-alt px-2.5 py-1 text-[11px] font-semibold text-ink-muted">
                  {route.popularFor}
                </span>

                <div className="mt-4">
                  <RouteArt seed={i} />
                  <div className="mt-1 grid grid-cols-2 gap-3">
                    <span className="min-w-0">
                      <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-ink-subtle">From</span>
                      <span className="block break-words font-display text-[16px] font-bold leading-tight text-ink">
                        {shortName(route.from)}
                      </span>
                    </span>
                    <span className="min-w-0 text-right">
                      <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-ink-subtle">To</span>
                      <span className="block break-words font-display text-[16px] font-bold leading-tight text-ink">
                        {shortName(route.to)}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-[12.5px] text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <Path size={14} weight="bold" className="text-ink-subtle" />
                    {route.distanceKm} km
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} weight="bold" className="text-ink-subtle" />
                    {route.approxDuration}
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between border-t border-dashed border-hairline-strong pt-4">
                  <span>
                    <span className="block text-[11px] font-medium text-ink-subtle">Sedan from</span>
                    <span className="font-display text-[24px] font-extrabold tracking-tight text-ink">
                      ₹{(Math.round(estimate / 10) * 10).toLocaleString("en-IN")}
                    </span>
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white transition-all duration-500 group-hover:bg-brand-700 group-hover:-rotate-45">
                    <ArrowRight size={17} weight="bold" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {POPULAR_ROUTES.length > PREVIEW_COUNT && (
          <div className="mt-8 flex justify-center">
            <button onClick={() => setShowAll((v) => !v)} className="btn-secondary btn-lg" aria-expanded={showAll}>
              {showAll ? "Show fewer routes" : `Show all ${POPULAR_ROUTES.length} routes`}
              <CaretDown size={15} weight="bold" className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}

        <p className="mx-auto mt-6 max-w-2xl text-center text-[12px] text-ink-subtle">
          Estimates use {SEDAN.category} tariffs (₹{SEDAN.ratePerKm}/km plus driver allowance and estimated tolls). Your
          final fare depends on the exact drop address and the cab class you choose.
        </p>
      </div>
    </section>
  );
};
