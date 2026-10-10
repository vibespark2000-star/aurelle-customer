"use client";
import {
  ArrowRight,
  Buildings as Building2,
  CalendarCheck,
  CheckCircle as CheckCircle2,
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

export function OurServices() {
  const [services, setServices] = useState<ServicePackage[]>(SAMPLE_SERVICES as any);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedModalPackage, setSelectedModalPackage] = useState<ServicePackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchServices = async () => {
    try {
      const res = await apiFetch("/api/services?activeOnly=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setServices(data.data);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const categories = [
    { id: "All", label: "All Services", icon: Sparkles },
    { id: "hourly", label: "Hourly Rental Packages", icon: Clock },
    { id: "corporate", label: "Corporate & IT Cabs", icon: Building2 },
    { id: "wedding", label: "Weddings & VIP Events", icon: Heart },
  ];

  const filteredServices = activeTab === "All" ? services : services.filter((s) => s.category === activeTab);

  const handleBookPackage = (pkg: ServicePackage) => {
    setSelectedModalPackage(pkg);
    setIsModalOpen(true);
  };

  return (
    <section id="services" className="py-12 md:py-16 bg-surface-alt">
      <div className="shell space-y-8">
        <SectionHeading
          title="Trip Types"
          titleRest="for Every Journey"
          subtitle="From flexible local hourly rentals to round-the-clock corporate employee transport and wedding fleet convoys — priced up front, tailored to your plan."
        />

        {/* Category filter */}
        <div
          role="tablist"
          aria-label="Service categories"
          className="flex items-center justify-center gap-2 flex-wrap"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2.5 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer border ${
                  isActive
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "bg-white border-hairline text-ink-muted hover:text-brand-600 hover:border-brand-200"
                }`}
              >
                <Icon size={15} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Service Cards Grid */}
        {filteredServices.length === 0 ? (
          <div className="card text-center py-16 px-8 text-ink-subtle text-sm">
            No active packages in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((pkg) => (
              <article key={pkg.id} className="card-hover overflow-hidden flex flex-col group">
                {/* Image header */}
                <div className="relative h-44 overflow-hidden bg-surface-sunken">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                  <span className="absolute top-3.5 left-3.5 bg-brand-600 text-white text-[11px] font-bold px-2.5 py-1 rounded">
                    {pkg.badge || "Popular"}
                  </span>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5">
                    <span className="block text-[11px] font-medium text-gray-300">Package fare</span>
                    <span className="block text-xl font-extrabold text-white tracking-tight">{pkg.priceDisplay}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-[17px] font-bold text-ink leading-snug group-hover:text-brand-600 transition-colors">
                    {pkg.title}
                  </h3>

                  {pkg.subtitle && <p className="text-[12px] font-semibold text-brand-600 mt-1">{pkg.subtitle}</p>}

                  <p className="text-[13px] text-ink-muted leading-relaxed mt-2.5">{pkg.description}</p>

                  {/* Overflow rates (hourly packages) */}
                  {pkg.category === "hourly" && (pkg.extraKmRate > 0 || pkg.extraHourRate > 0) && (
                    <dl className="mt-4 bg-surface-sunken rounded-lg p-3 grid grid-cols-2 divide-x divide-hairline text-center">
                      <div>
                        <dt className="text-[11px] font-medium text-ink-subtle">Extra km</dt>
                        <dd className="text-[13px] font-bold text-ink mt-0.5">₹{pkg.extraKmRate}/km</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium text-ink-subtle">Extra hour</dt>
                        <dd className="text-[13px] font-bold text-ink mt-0.5">₹{pkg.extraHourRate}/hr</dd>
                      </div>
                    </dl>
                  )}

                  <ul className="space-y-2 mt-4">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[13px] text-ink-muted">
                        <CheckCircle2 size={16} weight="fill" className="text-brand-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 pt-5 mt-auto">
                    <a
                      href={SUPPORT_PHONE_TEL}
                      className="btn-secondary btn-sm shrink-0"
                      title="Speak to our bookings team"
                    >
                      <PhoneCall size={14} />
                      <span className="hidden sm:inline">Enquire</span>
                    </a>
                    <button onClick={() => handleBookPackage(pkg)} className="btn-primary btn-sm flex-1 group/btn">
                      <CalendarCheck size={15} />
                      Book package
                      <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Custom quotation banner */}
        {/* Reads as a raised card on the cream page, not a dark cut-out. */}
        <div className="rounded-2xl bg-surface-card brand-ring p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left max-w-2xl">
            <h3 className="font-serif text-2xl md:text-[1.75rem] font-semibold text-ink leading-tight">
              Need a monthly corporate contract or a wedding fleet?
            </h3>
            <p className="text-[15px] text-ink-muted leading-relaxed mt-3">
              Our operations team handles IT shift rosters, VIP delegate movement and multi-vehicle wedding convoys
              across Tamil Nadu. Tell us the requirement and we&apos;ll quote it.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                setSelectedModalPackage({
                  id: "custom_b2b_wedding",
                  title: "Custom Marriage & Corporate Convoy",
                  category: "wedding",
                  subtitle: "Multi-Vehicle White Cab Convoy",
                  description:
                    "Full custom white cab fleet dispatch with VIP decorations and dedicated dispatch manager.",
                  badge: "Custom Convoy",
                  image:
                    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
                  priceDisplay: "Custom Tariff Quote",
                  baseFare: 15000,
                  includedHours: 24,
                  includedKm: 500,
                  extraKmRate: 18,
                  extraHourRate: 350,
                  features: [
                    "Matching pristine white fleet",
                    "Flower & VIP ribbon decoration",
                    "Dedicated dispatch manager",
                  ],
                  isActive: true,
                  sortOrder: 1,
                });
                setIsModalOpen(true);
              }}
              className="btn-primary btn-lg w-full md:w-auto"
            >
              <CalendarCheck size={16} />
              Request a custom quote
            </button>
          </div>
        </div>
      </div>

      {/* Render Dedicated Service Booking Modal with OTP & Confetti */}
      <ServiceBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        servicePackage={selectedModalPackage}
      />
    </section>
  );
}
