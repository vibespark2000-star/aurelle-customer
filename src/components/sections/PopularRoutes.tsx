"use client";

import { ArrowRight, Clock, MapTrifold as Map, ShieldCheck } from "@phosphor-icons/react";
import React from "react";

import { useBooking } from "@/context/BookingContext";
import { POPULAR_ROUTES, FLEET } from "@/data/fleet";
import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Quote these cards against the sedan tier, read from fleet data rather than hardcoded. */
const SEDAN = FLEET.find((v) => v.category === "Sedan") ?? FLEET[0];

export const PopularRoutes: React.FC = () => {
  const containerRef = useSilkReveal<HTMLDivElement>();
  const { setPickupCity, setDropCity, setBookingDrawerOpen, calculateTariff } = useBooking();

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
    <section ref={containerRef} id="popular-routes" className="py-12 md:py-16 bg-surface">
      <div className="shell">
        <SectionHeading
          title="Popular Routes"
          titleRest="Across Tamil Nadu"
          subtitle="Frequently travelled district routes with flat per-km tariffs and instant dispatch."
          className="silk-item mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_ROUTES.map((route) => {
            const estimate = route.distanceKm * SEDAN.ratePerKm + SEDAN.driverBattaPerDay + route.distanceKm * 1.5;

            return (
              <article key={route.id} className="silk-item card-hover p-5 flex flex-col group">
                <span className="badge-neutral self-start mb-4 text-[11px]">{route.popularFor}</span>

                <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink group-hover:text-brand-600 transition-colors mb-5">
                  <span className="truncate">{route.from}</span>
                  <ArrowRight size={14} className="text-brand-600 shrink-0" />
                  <span className="truncate">{route.to}</span>
                </h3>

                <ul className="space-y-2.5 text-[13px] text-ink-muted pb-5 border-b border-hairline">
                  <li className="flex items-center gap-2.5">
                    <Map size={14} className="text-ink-subtle shrink-0" />
                    Approx. {route.distanceKm} km
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Clock size={14} className="text-ink-subtle shrink-0" />
                    {route.approxDuration} via highway
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck size={14} className="text-ink-subtle shrink-0" />
                    Tolls included in estimate
                  </li>
                </ul>

                <div className="flex items-baseline justify-between gap-2 mt-auto pt-5 mb-4">
                  <span className="text-[12px] text-ink-subtle font-medium">Sedan from</span>
                  <span className="text-xl font-extrabold text-ink tracking-tight">
                    ₹{(Math.round(estimate / 10) * 10).toLocaleString("en-IN")}
                  </span>
                </div>

                <button onClick={() => handleSelectRoute(route.from, route.to)} className="btn-primary btn-sm w-full">
                  Book this route
                </button>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[12px] text-ink-subtle max-w-2xl mx-auto">
          Estimates use {SEDAN.category} tariffs (₹{SEDAN.ratePerKm}/km plus driver allowance and estimated tolls). Your
          final fare depends on the exact drop address and the cab class you choose.
        </p>
      </div>
    </section>
  );
};
