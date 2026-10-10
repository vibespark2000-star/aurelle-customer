"use client";

import { ArrowRight, Briefcase, CheckCircle as CheckCircle2, Users, X } from "@phosphor-icons/react";
import React, { useState } from "react";
import Image from "next/image";
import { useBooking } from "@/context/BookingContext";
import { Vehicle } from "@/data/fleet";

import { SectionHeading } from "@/components/ui/SectionHeading";

export const FleetShowcase: React.FC = () => {
  const { setSelectedVehicleId, setBookingDrawerOpen, calculateTariff, pickupCity, dropCity, fleetList } = useBooking();
  const [detailId, setDetailId] = useState<string | null>(null);

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
    <section id="fleet-showcase" className="py-12 md:py-16 bg-surface">
      <div className="shell">
        <SectionHeading
          title="Cab Types"
          titleRest="for Every Traveller"
          subtitle="Whether you need a compact city ride, a spacious family vehicle or a premium chauffeured sedan, we have you covered."
          className="mb-8"
        />

        {/* ── Cab cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fleetList.map((vehicle) => (
            <article
              key={vehicle.id}
              className="card-plain group/card relative z-0 flex min-h-[260px] flex-col transition-all duration-300 hover:z-20 hover:shadow-lift hover:-translate-y-1"
            >
              <div className="p-5 pb-0">
                <h3 className="text-[17px] font-bold text-ink leading-tight">{vehicle.category}</h3>
                <p className="text-[13px] text-ink-muted leading-relaxed mt-2 max-w-[90%]">{vehicle.tagline}</p>
                <p className="text-[13px] font-bold text-brand-600 mt-3">₹{vehicle.ratePerKm}/km</p>
              </div>

              {/*
               * The vehicle breaks out past the card's bottom-right corner
               * (-20px / -14px) instead of being clipped inside it, so it
               * reads as a 3D model sitting on the card rather than a photo
               * pasted into it. The card gap is 20px, so the overhang stays
               * clear of the neighbouring card.
               */}
              <div className="relative mt-auto h-[118px]">
                <div
                  aria-hidden="true"
                  className="absolute bottom-[6px] right-[4px] h-3 w-[72%] rounded-[50%] bg-ink/25 blur-md transition-all duration-300 group-hover/card:w-[76%] group-hover/card:bg-ink/30"
                />
                <Image
                  src={vehicle.images[0]}
                  alt={vehicle.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="scale-[1.14] object-contain object-right-bottom drop-shadow-[0_10px_14px_rgba(10,8,8,0.22)]
                    translate-x-[20px] translate-y-[14px]
                    transition-transform duration-300 ease-out
                    group-hover/card:translate-y-[8px] group-hover/card:scale-[1.19]"
                />
              </div>

              {/* Arrow opens the spec sheet. */}
              <button
                onClick={() => setDetailId(vehicle.id)}
                aria-label={`View ${vehicle.category} details`}
                className="absolute bottom-4 left-5 w-8 h-8 rounded-full border border-hairline-strong text-ink-muted hover:bg-brand-600 hover:border-brand-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>

        {/* ── Spec sheet ─────────────────────────────────────────────────── */}
        {detailVehicle && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setDetailId(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="fleet-detail-title"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[88vh] overflow-y-auto shadow-lift animate-fade-up"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative bg-surface-sunken min-h-[220px] md:min-h-full">
                  <Image
                    src={detailVehicle.images[0]}
                    alt={detailVehicle.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="badge-brand">{detailVehicle.category}</span>
                    <button
                      onClick={() => setDetailId(null)}
                      aria-label="Close details"
                      className="text-ink-subtle hover:text-ink transition-colors cursor-pointer -mt-1 -mr-1 p-1"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <h3 id="fleet-detail-title" className="text-xl font-extrabold text-ink tracking-tight">
                    {detailVehicle.name}
                  </h3>
                  <p className="text-[14px] text-ink-muted leading-relaxed mt-3">{detailVehicle.description}</p>

                  <div className="flex flex-wrap gap-4 mt-5 text-[13px] text-ink-muted">
                    <span className="flex items-center gap-1.5">
                      <Users size={15} weight="duotone" className="text-brand-600" />
                      {detailVehicle.seatingCapacity} seats
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={15} weight="duotone" className="text-brand-600" />
                      {detailVehicle.baggageCapacity} bags
                    </span>
                  </div>

                  <dl className="grid grid-cols-3 border border-hairline rounded-xl overflow-hidden divide-x divide-hairline mt-5">
                    {[
                      { label: "Per km", value: `₹${detailVehicle.ratePerKm}`, highlight: true },
                      { label: "Allowance", value: `₹${detailVehicle.driverBattaPerDay}`, highlight: false },
                      { label: "Min/day", value: `${detailVehicle.minKmPerDay} km`, highlight: false },
                    ].map((spec) => (
                      <div
                        key={spec.label}
                        className={`text-center py-3 px-2 ${spec.highlight ? "bg-brand-50" : "bg-white"}`}
                      >
                        <dt className="text-[11px] font-medium text-ink-subtle mb-1">{spec.label}</dt>
                        <dd className={`text-[15px] font-extrabold ${spec.highlight ? "text-brand-600" : "text-ink"}`}>
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="flex flex-wrap gap-2 mt-5">
                    {detailVehicle.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-1.5 border border-hairline rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-ink-muted"
                      >
                        <CheckCircle2 size={13} weight="fill" className="text-brand-600 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button onClick={() => handleBook(detailVehicle)} className="btn-primary w-full mt-6">
                    Book {detailVehicle.category}
                    <ArrowRight size={15} />
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
