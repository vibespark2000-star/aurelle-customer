"use client";

import {
  ArrowRight,
  ArrowsDownUp,
  CalendarBlank,
  CheckCircle,
  Envelope,
  Lightning,
  Phone,
  ShieldCheck,
  WarningCircle as AlertCircle,
} from "@phosphor-icons/react";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { useBooking } from "@/context/BookingContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { CITIES } from "@/data/fleet";

interface Slide {
  image: string;
  /** object-position, nudged so the subject sits in the open right half. */
  focus: string;
  caption: string;
}

/* Background stills, crossfaded behind the navy grade. */
const SLIDES: Slide[] = [
  { image: "/hero/premium-ride.jpg", focus: "70% center", caption: "Premium sedans on every highway" },
  { image: "/hero/airport-pickup.png", focus: "72% center", caption: "Chauffeur-assisted airport pickups" },
  { image: "/hero/family-trip.jpg", focus: "30% center", caption: "Room for the whole family" },
  { image: "/hero/happy-kids.jpg", focus: "35% center", caption: "Trips the kids remember" },
];

const TABS = [
  { value: "one-way", label: "One-way drop" },
  { value: "outstation", label: "Round trip" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

const SLIDE_MS = 6500;

const HIGHLIGHTS = [
  { icon: Lightning, label: "From ₹13/km" },
  { icon: CheckCircle, label: "Zero return charges" },
  { icon: ShieldCheck, label: "Verified chauffeurs" },
];

const STATS = [
  { value: "38", unit: "districts", label: "Full Tamil Nadu coverage" },
  { value: "25K+", unit: "trips", label: "Completed journeys" },
  { value: "4.9", unit: "★", label: "Average rider rating" },
  { value: "24/7", unit: "", label: "Live chauffeur desk" },
];



export const Hero: React.FC = () => {
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState<TabValue>("one-way");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    setTripType,
    pickupCity,
    setPickupCity,
    dropCity,
    setDropCity,
    pickupDate,
    setPickupDate,
    passengerPhone,
    setPassengerPhone,
    passengerEmail,
    setPassengerEmail,
    calculateTariff,
    setBookingDrawerOpen,
  } = useBooking();

  const { isAuthenticated, openAuthForBooking } = useCustomerAuth();

  // Crossfade the background; skipped entirely for reduced-motion viewers.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  const handleTab = (value: TabValue) => {
    setTab(value);
    setError(null);
    setTripType(value === "one-way" ? "one-way" : "round-trip");
  };

  /** Left/right arrows move between trip-type tabs, per the ARIA tabs pattern. */
  const handleTabKeys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    const current = TABS.findIndex((item) => item.value === tab);
    const next = TABS[(current + step + TABS.length) % TABS.length];
    handleTab(next.value);
    document.getElementById(`trip-tab-${next.value}`)?.focus();
  };

  const swapCities = () => {
    setPickupCity(dropCity);
    setDropCity(pickupCity);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError("Please accept the privacy policy and terms to continue.");
      return;
    }
    if (pickupCity === dropCity) {
      setError("Pickup and drop districts must be different.");
      return;
    }
    setError(null);
    calculateTariff();
    if (isAuthenticated) setBookingDrawerOpen(true);
    else openAuthForBooking();
  };

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  return (
    <section className="relative isolate overflow-hidden bg-night-950 text-white">
      {/* ── Background stills ───────────────────────────────────────────── */}
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        {SLIDES.map((item, i) => (
          <div
            key={item.image}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <Image
              src={item.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              quality={80}
              style={{ objectPosition: item.focus }}
              className={`object-cover transition-transform duration-[8000ms] ease-out ${
                i === slide ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}
      </div>

      {/*
       * Light grade: just enough shade behind the headline on the left and
       * the stats at the bottom; the rest of the photo stays clear.
       */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, rgba(12,12,14,0.78) 0%, rgba(12,12,14,0.55) 35%, rgba(12,12,14,0.15) 62%, rgba(12,12,14,0) 100%), linear-gradient(0deg, rgba(12,12,14,0.85) 0%, rgba(12,12,14,0) 28%)",
        }}
      />

      <div className="shell relative pb-8 pt-28 lg:pb-10 lg:pt-32">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* ── Copy ───────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <h1
              className="text-cine animate-fade-up font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-white sm:text-[3.4rem] lg:text-[4.4rem]"
              style={{ animationDelay: "80ms" }}
            >
              Ride anywhere
              <br className="hidden sm:block" /> in Tamil Nadu.
              <br />
              <span className="text-brand-500">Pay one way only.</span>
            </h1>

            <p
              className="text-cine mt-6 max-w-xl animate-fade-up text-[16px] font-medium leading-relaxed text-white/90 lg:text-[17px]"
              style={{ animationDelay: "160ms" }}
            >
              Premium drop taxis and outstation cabs with flat per-km pricing, FASTag tolls built in and spotless AC
              cars — no empty-return charges, no bargaining, no last-minute cancellations.
            </p>

            <ul className="mt-7 flex animate-fade-up flex-wrap gap-2.5" style={{ animationDelay: "240ms" }}>
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-night-950/55 px-3.5 py-2 text-[13px] font-semibold text-white backdrop-blur"
                >
                  <Icon size={15} weight="fill" className="text-brand-500" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Booking card ───────────────────────────────────────────── */}
          <div id="booking-widget" className="relative lg:col-span-5">
            <div className="relative animate-fade-up rounded-[1.75rem] bg-white p-5 text-ink shadow-glow sm:p-6" style={{ animationDelay: "200ms" }}>
              <h2 className="sr-only">Book a cab</h2>

              {/* Trip type — segmented control */}
              <div
                role="tablist"
                aria-label="Trip type"
                className="grid grid-cols-2 gap-1 rounded-full bg-surface-sunken p-1"
                onKeyDown={handleTabKeys}
              >
                {TABS.map((item) => {
                  const isActive = tab === item.value;
                  return (
                    <button
                      key={item.value}
                      id={`trip-tab-${item.value}`}
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      aria-controls="trip-panel"
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => handleTab(item.value)}
                      className={`cursor-pointer rounded-full py-2.5 text-[13px] font-bold transition-all duration-300 ${
                        isActive ? "bg-night text-white shadow-md" : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <form
                id="trip-panel"
                role="tabpanel"
                aria-labelledby={`trip-tab-${tab}`}
                onSubmit={handleSubmit}
                className="mt-4"
              >
                {/* From / To with a route rail and swap button */}
                <div className="relative rounded-2xl border border-hairline-strong bg-white">
                  <div className="pointer-events-none absolute bottom-[30px] left-[22px] top-[30px] w-px border-l-2 border-dotted border-hairline-strong" aria-hidden="true" />

                  <label htmlFor="hero-from" className="flex items-center gap-3 px-4 pb-2.5 pt-3">
                    <span className="relative z-10 h-3 w-3 shrink-0 rounded-full border-[3px] border-ink bg-white" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-subtle">
                        Pickup district
                      </span>
                      <select
                        id="hero-from"
                        value={pickupCity}
                        onChange={(e) => {
                          setPickupCity(e.target.value);
                          setError(null);
                        }}
                        className="w-full cursor-pointer appearance-none bg-transparent pr-12 text-[15px] font-semibold text-ink outline-none"
                      >
                        {CITIES.map((city) => (
                          <option key={`from-${city}`} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>

                  <div className="ml-11 border-t border-hairline" />

                  <label htmlFor="hero-to" className="flex items-center gap-3 px-4 pb-3 pt-2.5">
                    <span className="relative z-10 h-3 w-3 shrink-0 rounded-[3px] bg-brand-600" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-subtle">
                        Drop district
                      </span>
                      <select
                        id="hero-to"
                        value={dropCity}
                        onChange={(e) => {
                          setDropCity(e.target.value);
                          setError(null);
                        }}
                        className="w-full cursor-pointer appearance-none bg-transparent pr-12 text-[15px] font-semibold text-ink outline-none"
                      >
                        {CITIES.map((city) => (
                          <option key={`to-${city}`} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={swapCities}
                    aria-label="Swap pickup and drop"
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-hairline-strong bg-white text-ink shadow-sm transition-all duration-300 hover:rotate-180 hover:border-ink"
                  >
                    <ArrowsDownUp size={16} weight="bold" />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="relative">
                    <label htmlFor="hero-date" className="sr-only">
                      Travel date
                    </label>
                    <CalendarBlank size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
                    <input
                      id="hero-date"
                      type="date"
                      value={pickupDate}
                      min={today}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                      className="field cursor-pointer pl-10"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="hero-mobile" className="sr-only">
                      Mobile number
                    </label>
                    <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
                    <input
                      id="hero-mobile"
                      type="tel"
                      inputMode="numeric"
                      placeholder="Mobile number"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      required
                      className="field pl-10"
                    />
                  </div>
                </div>

                <div className="relative mt-3">
                  <label htmlFor="hero-email" className="sr-only">
                    Email (optional)
                  </label>
                  <Envelope size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
                  <input
                    id="hero-email"
                    type="email"
                    placeholder="Email (optional)"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="field pl-10"
                  />
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[12px] leading-snug text-ink-muted">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      setError(null);
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-600"
                  />
                  <span>
                    I agree to the{" "}
                    <a href="/privacy-policy" className="font-semibold text-ink underline decoration-brand-400 underline-offset-2">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/terms-and-conditions" className="font-semibold text-ink underline decoration-brand-400 underline-offset-2">
                      Terms of Use
                    </a>
                    , and consent to my details being used for this booking.
                  </span>
                </label>

                {error && (
                  <p role="alert" className="mt-3 flex items-center gap-2 text-[13px] font-medium text-brand-600">
                    <AlertCircle size={15} weight="fill" className="shrink-0" />
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-primary btn-lg group mt-4 w-full">
                  Book now
                  <ArrowRight size={17} weight="bold" className="transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ── Stats rail + slide dots ──────────────────────────────────── */}
        <div className="mt-10 border-t border-white/10 pt-6 lg:mt-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:gap-x-14">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="font-display text-[30px] font-extrabold tracking-tight text-white lg:text-[34px]">
                      {stat.value}
                    </span>
                    {stat.unit && <span className="ml-1 text-[14px] font-semibold text-brand-500">{stat.unit}</span>}
                    <span className="mt-0.5 block text-[12.5px] text-night-dim">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex items-center gap-4">
              <p className="hidden text-[12.5px] text-night-dim md:block" aria-live="polite">
                {SLIDES[slide].caption}
              </p>
              <div className="flex items-center gap-1.5">
                {SLIDES.map((item, i) => (
                  <button
                    key={item.image}
                    onClick={() => setSlide(i)}
                    aria-label={`Show background ${i + 1}`}
                    aria-current={i === slide ? "true" : undefined}
                    className={`h-1.5 cursor-pointer rounded-full transition-all duration-500 ${
                      i === slide ? "w-8 bg-brand-600" : "w-1.5 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
