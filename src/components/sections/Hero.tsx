"use client";

import {
  WarningCircle as AlertCircle,
  CaretLeft as ChevronLeft,
  CaretRight as ChevronRight,
} from "@phosphor-icons/react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { useBooking } from "@/context/BookingContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { CITIES } from "@/data/fleet";

interface Slide {
  image: string;
  alt: string;
  /** object-position, nudged so the subject stays clear of the copy. */
  focus: string;
  /** Which side the copy sits on; the grade mirrors to match. */
  align: "left" | "right";
  title: string;
  /** Optional second line, rendered in gold. */
  accent?: string;
  sub: string;
  /** Stat cards overlaid opposite the copy. */
  cards?: { value: string; label: string }[];
}

const SLIDES: Slide[] = [
  {
    image: "/hero/airport-pickup.jpg",
    alt: "A uniformed chauffeur holding the door open for a traveller at airport departures",
    focus: "72% center",
    align: "left",
    title: "Pay Only for One-Way,",
    accent: "Zero Return Charges",
    sub: "Inter-district highway travel with flat per-km pricing, automated FASTag toll estimates, and spotless air-conditioned cabs.",
    cards: [
      { value: "38 Districts", label: "100% Tamil Nadu coverage" },
      { value: "Flat Per KM", label: "Starting at ₹13/km" },
      { value: "0% Cancellation", label: "Guaranteed driver dispatch" },
      { value: "24/7 Helpline", label: "Dedicated chauffeur desk" },
    ],
  },
  {
    image: "/hero/easy-booking.jpg",
    alt: "Illustration of a chauffeur and traveller beside a cab, booking on a phone",
    focus: "78% center",
    align: "left",
    title: "No Ride Cancellations,",
    accent: "No Extra Charges",
    sub: "No more last-minute cancellations or bargaining. Just a smooth ride to your destination across all 38 districts.",
  },
  {
    image: "/hero/happy-kids.jpg",
    alt: "Two children smiling out of the window of a moving cab",
    focus: "35% center",
    align: "right",
    title: "Convenient Travel,",
    accent: "Right in Your Pocket",
    sub: "Plan, book and ride with ease — all at your convenience, with vetted chauffeurs and transparent per-km fares.",
  },
  {
    image: "/hero/premium-ride.jpg",
    alt: "A white Aurelle taxi on a city highway",
    focus: "70% center",
    align: "left",
    title: "Where Every Ride",
    accent: "Feels Premium",
    sub: "Redefining the experience of travel across Tamil Nadu, with comfort, punctuality and convenience.",
  },
  {
    image: "/hero/family-trip.jpg",
    alt: "A family of four riding together in the back of a spacious cab",
    focus: "30% center",
    align: "right",
    title: "Family Trips,",
    accent: "Made Comfortable",
    sub: "Spacious, sanitised vehicles with room for everyone and their luggage — priced honestly, every time.",
  },
];

const TABS = [
  { value: "one-way", label: "Oneway Trip" },
  { value: "outstation", label: "Outstation / Round Trip" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

const SLIDE_MS = 7000;
const COUNT = SLIDES.length;

export const Hero: React.FC = () => {
  /**
   * The track renders SLIDES plus a clone of the first, so `position` can run
   * past the last index and keep gliding one way. On landing at the clone we
   * snap back to 0 with the transition off — identical frames, so it is unseen.
   */
  const [position, setPosition] = useState(0);
  const [gliding, setGliding] = useState(true);
  const [tab, setTab] = useState<TabValue>("one-way");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calm, setCalm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = position % COUNT;
  const active = SLIDES[slide];
  const alignRight = active.align === "right";

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

  /** Held in state so toggling the OS setting mid-session takes effect. */
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setCalm(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (calm) return;
    timerRef.current = setInterval(() => setPosition((p) => p + 1), SLIDE_MS);
  }, [calm]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const enableGlideNextFrame = useCallback(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setGliding(true)));
  }, []);

  const goNext = useCallback(() => {
    setPosition((p) => p + 1);
    resetTimer();
  }, [resetTimer]);

  /** Going back from the first slide hops to the clone, then glides left. */
  const goPrev = useCallback(() => {
    resetTimer();
    if (position % COUNT !== 0) {
      setPosition(position - 1);
      return;
    }
    setGliding(false);
    setPosition(COUNT);
    requestAnimationFrame(() => {
      setPosition(COUNT - 1);
      enableGlideNextFrame();
    });
  }, [position, resetTimer, enableGlideNextFrame]);

  const goTo = useCallback(
    (index: number) => {
      setPosition(index);
      resetTimer();
    },
    [resetTimer]
  );

  const handleTrackSettled = () => {
    if (position === COUNT) {
      setGliding(false);
      setPosition(0);
      enableGlideNextFrame();
    }
  };

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
    <section className="relative bg-surface pt-[68px]">
      {/* ── Stage ──────────────────────────────────────────────────────── */}
      <div className="relative min-h-[430px] lg:min-h-[480px] overflow-hidden">
        {/* Poster track */}
        <div
          className="hero-track absolute inset-0 flex will-change-transform"
          style={{
            transform: `translate3d(-${position * 100}%, 0, 0)`,
            transition: gliding ? "transform 900ms cubic-bezier(0.65, 0, 0.35, 1)" : "none",
          }}
          onTransitionEnd={handleTrackSettled}
        >
          {[...SLIDES, SLIDES[0]].map((item, i) => (
            <div key={`${item.image}-${i}`} className="relative h-full w-full shrink-0 grow-0 basis-full">
              <Image
                src={item.image}
                alt={i === slide ? item.alt : ""}
                fill
                priority={i === 0}
                sizes="100vw"
                quality={85}
                style={{ objectPosition: item.focus }}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Grade — mirrors to whichever side the copy sits on. */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            alignRight ? "hero-grade-right" : "hero-grade"
          }`}
          aria-hidden="true"
        />
        <div className="absolute inset-0 hero-vignette pointer-events-none" aria-hidden="true" />

        {/* Copy + optional stat cards */}
        {/*
         * Centred in the stage rather than top-anchored, so the copy never
         * drifts into the dead band above the booking panel. The bottom pad
         * reserves the strip the panel overlaps into.
         */}
        <div className="relative z-10 flex min-h-[430px] items-center lg:min-h-[480px]">
          <div className="shell w-full pb-[124px] pt-8 lg:pb-[128px] lg:pt-10">
            {/*
             * Right-aligned slides reorder the columns rather than flipping
             * `direction`: under RTL, `justify-self-end` resolves to the LEFT
             * edge, which pinned these slides to the wrong side.
             */}
            <div
              className={`grid items-center gap-8 lg:gap-12 ${
                active.cards
                  ? "lg:grid-cols-[minmax(0,1fr)_auto]"
                  : "lg:grid-cols-1"
              }`}
            >
            <div
              className={`max-w-xl ${
                alignRight ? "lg:order-2 lg:ml-auto lg:text-right" : "lg:order-1"
              }`}
            >
              <h1
                key={`title-${slide}`}
                className="text-cine animate-fade-up text-[2rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-[2.5rem] lg:text-[3rem]"
              >
                {active.title}
                {active.accent && (
                  <>
                    <br />
                    <span className="text-gold-400">{active.accent}</span>
                  </>
                )}
              </h1>

              <p
                key={`sub-${slide}`}
                className={`text-cine mt-4 max-w-lg animate-fade-up text-[14px] leading-relaxed text-white/85 lg:text-[15px] ${
                  alignRight ? "lg:ml-auto" : ""
                }`}
              >
                {active.sub}
              </p>

            </div>

            {/* Stat cards sit opposite the copy, desktop only. */}
            {active.cards && (
              <div
                key={`cards-${slide}`}
                className={`hidden w-[420px] animate-fade-up self-center lg:grid lg:grid-cols-2 lg:gap-3.5 ${
                  alignRight ? "lg:order-1" : "lg:order-2"
                }`}
              >
                {active.cards.map((card) => (
                  <div
                    key={card.value}
                    className="rounded-xl border border-white/15 bg-black/45 p-4 backdrop-blur-md"
                  >
                    <span className="block text-[15px] font-bold text-gold-400">{card.value}</span>
                    <span className="mt-1 block text-[12px] leading-snug text-white/75">{card.label}</span>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Slide changes are visual only, so announce them politely. */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {`Slide ${slide + 1} of ${COUNT}: ${active.title} ${active.accent ?? ""}`.trim()}
        </div>

        {/*
         * Controls live together in one bar on the shell's right gutter. Edge
         * arrows used to sit over the headline on the left and the stat cards
         * on the right; grouped here they stay clear of both.
         */}
        <div className="absolute inset-x-0 bottom-[100px] z-10">
          <div className="shell flex items-center justify-end gap-3">
            <div className="flex items-center gap-1.5 pr-1">
              {SLIDES.map((item, i) => (
                <button
                  key={item.image}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === slide ? "true" : undefined}
                  className={`h-[3px] cursor-pointer rounded-full transition-all duration-300 ${
                    i === slide ? "w-8 bg-white" : "w-4 bg-white/45 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goPrev}
              aria-label="Previous slide"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/35 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
            >
              <ChevronLeft size={18} weight="bold" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next slide"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/35 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
            >
              <ChevronRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Booking panel ──────────────────────────────────────────────── */}
      <div id="booking-widget" className="shell relative z-20 -mt-[92px] pb-12 scroll-mt-24 md:pb-14">
        <div
          role="tablist"
          aria-label="Trip type"
          className="flex items-end gap-1.5"
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
                className={`cursor-pointer rounded-t-lg px-6 text-[13px] font-semibold transition-all ${
                  isActive
                    ? "bg-surface-card py-3.5 text-brand-600 shadow-[0_-2px_8px_rgba(10,8,8,0.08)]"
                    : "bg-surface-card/70 py-3 text-ink-muted hover:bg-surface-card hover:text-ink"
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
          className="rounded-b-xl rounded-tr-xl bg-surface-card p-5 shadow-[0_18px_40px_-18px_rgba(10,8,8,0.28)] md:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label htmlFor="hero-from" className="field-label">
                From <span className="text-brand-600">*</span>
              </label>
              <select
                id="hero-from"
                value={pickupCity}
                onChange={(e) => {
                  setPickupCity(e.target.value);
                  setError(null);
                }}
                className="field cursor-pointer"
              >
                {CITIES.map((city) => (
                  <option key={`from-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="hero-to" className="field-label">
                To <span className="text-brand-600">*</span>
              </label>
              <select
                id="hero-to"
                value={dropCity}
                onChange={(e) => {
                  setDropCity(e.target.value);
                  setError(null);
                }}
                className="field cursor-pointer"
              >
                {CITIES.map((city) => (
                  <option key={`to-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="hero-date" className="field-label">
                Date <span className="text-brand-600">*</span>
              </label>
              <input
                id="hero-date"
                type="date"
                value={pickupDate}
                min={today}
                onChange={(e) => setPickupDate(e.target.value)}
                required
                className="field cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="hero-mobile" className="field-label">
                Mobile No <span className="text-brand-600">*</span>
              </label>
              <input
                id="hero-mobile"
                type="tel"
                inputMode="numeric"
                placeholder="Enter mobile number"
                value={passengerPhone}
                onChange={(e) => setPassengerPhone(e.target.value)}
                required
                className="field"
              />
            </div>

            <div>
              <label htmlFor="hero-email" className="field-label">
                Email
              </label>
              <input
                id="hero-email"
                type="email"
                placeholder="Enter email address"
                value={passengerEmail}
                onChange={(e) => setPassengerEmail(e.target.value)}
                className="field"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <label className="flex cursor-pointer items-start gap-2.5 text-[13px] text-ink-muted">
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
                <a href="/privacy-policy" className="font-semibold text-brand-600 underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms-and-conditions" className="font-semibold text-brand-600 underline">
                  Terms of Use
                </a>{" "}
                and consent to my details being used to process this booking.
              </span>
            </label>

            <button type="submit" className="btn-primary shrink-0 px-10">
              Get Fare &amp; Book
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-3 flex items-center gap-2 text-[13px] font-medium text-brand-600">
              <AlertCircle size={14} weight="fill" className="shrink-0" />
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};
