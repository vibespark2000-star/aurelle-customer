"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle as CheckCircle2,
  Crown,
  Fire,
  Users,
  X,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { useBooking } from "@/context/BookingContext";
import { Vehicle } from "@/data/fleet";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSilkReveal } from "@/hooks/useSilkReveal";

export const FleetShowcase: React.FC = () => {
  const { setSelectedVehicleId, setBookingDrawerOpen, calculateTariff, pickupCity, dropCity, fleetList } = useBooking();
  const [detailId, setDetailId] = useState<string | null>(null);
  const revealRef = useSilkReveal<HTMLDivElement>();

  // Close the spec sheet with Escape.
  useEffect(() => {
    if (!detailId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDetailId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailId]);

  if (!fleetList.length) return null;

  const detailVehicle = fleetList.find((v) => v.id === detailId) || null;

  /**
   * Booking a cab opens the drawer when a valid route is already set; otherwise
   * it sends the customer up to the hero form to choose districts first.
   */
  const handleBook = (vehicle: Vehicle) => {
    setSelectedVehicleId(vehicle.id);
    setDetailId(null);
    if (pickupCity && dropCity && pickupCity !== dropCity) {
      calculateTariff();
      setBookingDrawerOpen(true);
    } else {
      document.getElementById("booking-widget")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={revealRef} id="fleet-showcase" className="relative bg-white py-12 md:py-16">
      <div className="shell">
        <div className="silk-item mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            align="left"
            title="A ride for"
            titleRest="every journey."
            subtitle="From a nimble hatchback for two to a captain-seat Innova Crysta for the whole family — every car white, spotless and chauffeur-driven."
          />
          <p className="shrink-0 text-[13px] text-ink-subtle md:text-right">
            All fares per km · driver allowance extra
            <br />
            <span className="font-semibold text-ink">No surge pricing, ever.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fleetList.map((vehicle) => {
            const popular = vehicle.category === "Sedan";
            const premium = vehicle.category === "Premium";
            return (
              <article
                key={vehicle.id}
                className={`silk-item group relative flex flex-col overflow-hidden rounded-[1.75rem] p-2 transition-all duration-500 hover:-translate-y-2 ${
                  popular
                    ? "border-2 border-brand-600 bg-white shadow-lift"
                    : "border border-hairline bg-surface-alt hover:bg-white hover:shadow-lift"
                }`}
              >
                <div className="relative h-48 overflow-hidden rounded-[1.4rem]">
                  <SmartImage fallbackLabel={vehicle.category}
                    src={vehicle.images[0]}
                    alt={vehicle.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {(popular || premium) && (
                    <span
                      className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        popular ? "bg-brand-600 text-white" : "bg-white/95 text-ink"
                      }`}
                    >
                      {popular ? <Fire size={12} weight="fill" /> : <Crown size={12} weight="fill" className="text-brand-500" />}
                      {popular ? "Most booked" : "Luxury"}
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      <Users size={12} weight="fill" /> {vehicle.seatingCapacity}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      <Briefcase size={12} weight="fill" /> {vehicle.baggageCapacity}
                    </span>
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-3.5 pb-3 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`font-display text-[20px] font-extrabold tracking-tight ${"text-ink"}`}>
                      {vehicle.category}
                    </h3>
                    <div className="text-right">
                      <span className={`font-display text-[24px] font-extrabold leading-none ${popular ? "text-brand-600" : "text-ink"}`}>
                        ₹{vehicle.ratePerKm}
                      </span>
                      <span className={`text-[12px] ${"text-ink-subtle"}`}>/km</span>
                    </div>
                  </div>
                  <p className={`mt-2 line-clamp-2 text-[13px] leading-relaxed ${"text-ink-muted"}`}>
                    {vehicle.tagline}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {vehicle.features.slice(0, 3).map((f) => (
                      <li
                        key={f}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          popular ? "bg-brand-50 text-brand-700" : "bg-white text-ink-muted ring-1 ring-hairline"
                        }`}
                      >
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center gap-2 pt-6">
                    <button
                      onClick={() => handleBook(vehicle)}
                      className={`${popular ? "btn-primary" : "btn-dark"} btn-sm h-11 flex-1`}
                    >
                      Book {vehicle.category}
                    </button>
                    <button
                      onClick={() => setDetailId(vehicle.id)}
                      aria-label={`View ${vehicle.category} details`}
                      className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 group-hover:rotate-45 ${
                        popular
                          ? "border-brand-200 bg-white text-brand-600 hover:border-brand-600"
                          : "border-hairline-strong bg-white text-ink hover:border-ink"
                      }`}
                    >
                      <ArrowUpRight size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Spec sheet ─────────────────────────────────────────────────── */}
        {detailVehicle && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-night-950/70 p-4 backdrop-blur-md"
            onClick={() => setDetailId(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="fleet-detail-title"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] w-full max-w-3xl animate-fade-up overflow-y-auto rounded-[1.75rem] bg-white shadow-lift"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative min-h-[240px] bg-surface-sunken md:min-h-full">
                  <SmartImage fallbackLabel={detailVehicle.category}
                    src={detailVehicle.images[0]}
                    alt={detailVehicle.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950/70 to-transparent" />
                  <div className="absolute bottom-5 left-5 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-500">
                      {detailVehicle.category}
                    </span>
                    <p className="font-display text-[30px] font-extrabold leading-none">
                      ₹{detailVehicle.ratePerKm}
                      <span className="text-[14px] font-medium text-white/70">/km</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 id="fleet-detail-title" className="font-display text-[22px] font-extrabold tracking-tight text-ink">
                      {detailVehicle.name}
                    </h3>
                    <button
                      onClick={() => setDetailId(null)}
                      aria-label="Close details"
                      className="-mr-2 -mt-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-surface-sunken hover:text-ink"
                    >
                      <X size={18} weight="bold" />
                    </button>
                  </div>
                  <p className="text-[14px] leading-relaxed text-ink-muted">{detailVehicle.description}</p>

                  <dl className="mt-6 grid grid-cols-4 gap-2">
                    {[
                      { label: "Seats", value: `${detailVehicle.seatingCapacity}` },
                      { label: "Bags", value: `${detailVehicle.baggageCapacity}` },
                      { label: "Allowance", value: `₹${detailVehicle.driverBattaPerDay}` },
                      { label: "Min/day", value: `${detailVehicle.minKmPerDay}km` },
                    ].map((spec) => (
                      <div key={spec.label} className="rounded-xl bg-surface-alt px-2 py-3 text-center">
                        <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-subtle">{spec.label}</dt>
                        <dd className="mt-1 text-[15px] font-extrabold text-ink">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {detailVehicle.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-[13px] font-medium text-ink-muted">
                        <CheckCircle2 size={16} weight="fill" className="shrink-0 text-brand-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button onClick={() => handleBook(detailVehicle)} className="btn-primary btn-lg mt-7 w-full">
                    Book {detailVehicle.category}
                    <ArrowRight size={16} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
