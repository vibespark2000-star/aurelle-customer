"use client";
import {
  ArrowRight,
  Buildings as Building2,
  CalendarCheck,
  Check,
  Clock,
  Heart,
  PhoneCall,
  Sparkle as Sparkles,
} from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useEffect, useState } from "react";

import { SAMPLE_SERVICES } from "@/data/services";
import { ServiceBookingModal } from "@/components/ui/ServiceBookingModal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SUPPORT_PHONE_TEL } from "@/lib/site";

export interface ServicePackage {
  _id?: string;
  id: string;
  title: string;
  category: "hourly" | "corporate" | "wedding" | "event";
  subtitle: string;
  description: string;
  badge: string;
  image: string;
  priceDisplay: string;
  baseFare: number;
  includedHours: number;
  includedKm: number;
  extraKmRate: number;
  extraHourRate: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

const CATEGORIES = [
  { id: "All", label: "All", icon: Sparkles },
  { id: "hourly", label: "Hourly rentals", icon: Clock },
  { id: "corporate", label: "Corporate", icon: Building2 },
  { id: "wedding", label: "Weddings & events", icon: Heart },
];

/** The package opened by the "custom quote" banner. */
const CUSTOM_QUOTE: ServicePackage = {
  id: "custom_b2b_wedding",
  title: "Custom Marriage & Corporate Convoy",
  category: "wedding",
  subtitle: "Multi-Vehicle White Cab Convoy",
  description: "Full custom white cab fleet dispatch with VIP decorations and dedicated dispatch manager.",
  badge: "Custom Convoy",
  image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  priceDisplay: "Custom Tariff Quote",
  baseFare: 15000,
  includedHours: 24,
  includedKm: 500,
  extraKmRate: 18,
  extraHourRate: 350,
  features: ["Matching pristine white fleet", "Flower & VIP ribbon decoration", "Dedicated dispatch manager"],
  isActive: true,
  sortOrder: 1,
};

export function OurServices() {
  const [services, setServices] = useState<ServicePackage[]>(SAMPLE_SERVICES as ServicePackage[]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedModalPackage, setSelectedModalPackage] = useState<ServicePackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    apiFetch("/api/services?activeOnly=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setServices(data.data);
        }
      })
      .catch((err) => console.error("Failed to load services:", err));
  }, []);

  const filteredServices = activeTab === "All" ? services : services.filter((s) => s.category === activeTab);

  const openPackage = (pkg: ServicePackage) => {
    setSelectedModalPackage(pkg);
    setIsModalOpen(true);
  };

  return (
    <section id="services" className="relative overflow-hidden bg-surface-alt py-12 md:py-16">
      <div className="dot-backdrop pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="shell relative space-y-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            title="Beyond the drop."
            titleRest="Packages for every plan."
            subtitle="Hourly city rentals, IT shift transport and wedding convoys — priced up front, tailored to how you travel."
          />

          {/* Category filter — a single pill track */}
          <div
            role="tablist"
            aria-label="Service categories"
            className="no-scrollbar -mx-5 flex overflow-x-auto px-5 lg:mx-0 lg:px-0"
          >
            <div className="flex shrink-0 gap-1 rounded-full border border-hairline bg-white p-1 shadow-sm">
              {CATEGORIES.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(id)}
                    className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                      isActive ? "bg-brand-600 text-white shadow-md" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    <Icon size={15} weight={isActive ? "fill" : "regular"} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="card px-8 py-16 text-center text-sm text-ink-subtle">No active packages in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((pkg) => (
              <article
                key={pkg.id}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-hairline bg-white p-2 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div className="relative h-52 overflow-hidden rounded-[1.4rem] bg-surface-sunken">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950/85 via-night-950/10 to-transparent" />

                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-ink backdrop-blur">
                    {pkg.badge || "Popular"}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <div>
                      <span className="block text-[11px] font-medium uppercase tracking-wider text-white/70">Package fare</span>
                      <span className="block font-display text-[26px] font-extrabold leading-tight text-white">
                        {pkg.priceDisplay}
                      </span>
                    </div>
                    {pkg.category === "hourly" && pkg.includedHours > 0 && (
                      <span className="glass-dark rounded-full px-3 py-1.5 text-[12px] font-semibold text-white">
                        {pkg.includedHours}h · {pkg.includedKm}km
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
                  <h3 className="font-display text-[18px] font-bold leading-snug tracking-tight text-ink">{pkg.title}</h3>
                  {pkg.subtitle && <p className="mt-1 text-[12.5px] font-semibold text-brand-600">{pkg.subtitle}</p>}
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-muted">{pkg.description}</p>

                  <ul className="mt-5 space-y-2.5">
                    {pkg.features.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[13px] text-ink-muted">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                          <Check size={9} weight="bold" />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center gap-2 pt-6">
                    <a
                      href={SUPPORT_PHONE_TEL}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline-strong text-ink transition-colors hover:border-ink"
                      title="Speak to our bookings team"
                      aria-label="Call to enquire"
                    >
                      <PhoneCall size={16} weight="bold" />
                    </a>
                    <button onClick={() => openPackage(pkg)} className="btn-dark btn-sm group/btn h-11 flex-1">
                      <CalendarCheck size={15} weight="bold" />
                      Book package
                      <ArrowRight size={14} weight="bold" className="transition-transform group-hover/btn:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Custom quotation banner */}
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-brand-50 p-8 md:p-12">
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h3 className="font-display text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink md:text-[2.25rem]">
                Monthly corporate contract or a <span className="text-brand-600">wedding fleet?</span>
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                IT shift rosters, VIP delegate movement and multi-car wedding convoys across Tamil Nadu. Tell us the
                requirement — we&apos;ll quote it the same day.
              </p>
            </div>
            <button onClick={() => openPackage(CUSTOM_QUOTE)} className="btn-primary btn-lg shrink-0">
              <CalendarCheck size={17} weight="bold" />
              Request a custom quote
            </button>
          </div>
        </div>
      </div>

      <ServiceBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        servicePackage={selectedModalPackage}
      />
    </section>
  );
}
