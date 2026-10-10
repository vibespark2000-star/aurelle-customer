"use client";

import { ArrowRight, Check, Envelope as Mail, MapPin, ChatCircle as MessageCircle, Phone } from "@phosphor-icons/react";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBooking } from "@/context/BookingContext";

import { POPULAR_ROUTES } from "@/data/fleet";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL, SUPPORT_WHATSAPP_URL } from "@/lib/site";

/**
 * Link-dense SEO footer.
 *
 * Columns are driven by real data (fleet tiers, district guide pages, popular
 * routes) so every link resolves to a page that exists. The city cloud exists
 * to give the /district/[id] guides internal links from every page on the site.
 */

/** District guide pages, ordered by search demand. Ids match src/data/districts.ts. */
const CITY_LINKS: { id: string; label: string }[] = [
  { id: "chennai", label: "Chennai" },
  { id: "coimbatore", label: "Coimbatore" },
  { id: "madurai", label: "Madurai" },
  { id: "tiruchirappalli", label: "Trichy" },
  { id: "salem", label: "Salem" },
  { id: "tiruppur", label: "Tiruppur" },
  { id: "erode", label: "Erode" },
  { id: "nilgiris", label: "Ooty" },
  { id: "vellore", label: "Vellore" },
  { id: "thanjavur", label: "Thanjavur" },
  { id: "tirunelveli", label: "Tirunelveli" },
  { id: "kanyakumari", label: "Kanyakumari" },
  { id: "dindigul", label: "Dindigul" },
  { id: "thoothukudi", label: "Thoothukudi" },
  { id: "karur", label: "Karur" },
  { id: "namakkal", label: "Namakkal" },
  { id: "krishnagiri", label: "Krishnagiri" },
  { id: "dharmapuri", label: "Dharmapuri" },
  { id: "theni", label: "Theni" },
  { id: "cuddalore", label: "Cuddalore" },
  { id: "villupuram", label: "Villupuram" },
  { id: "kanchipuram", label: "Kanchipuram" },
  { id: "tiruvallur", label: "Tiruvallur" },
  { id: "chengalpattu", label: "Chengalpattu" },
  { id: "virudhunagar", label: "Virudhunagar" },
  { id: "sivaganga", label: "Sivaganga" },
  { id: "pudukkottai", label: "Pudukkottai" },
  { id: "ramanathapuram", label: "Ramanathapuram" },
  { id: "nagapattinam", label: "Nagapattinam" },
  { id: "tiruvannamalai", label: "Tiruvannamalai" },
  { id: "tenkasi", label: "Tenkasi" },
  { id: "ranipet", label: "Ranipet" },
];

const TRIP_TYPES = [
  { label: "One-Way Drop Taxi", href: "#booking-widget" },
  { label: "Round Trip / Outstation", href: "#booking-widget" },
  { label: "Hourly City Rental", href: "#services" },
  { label: "Airport Transfer", href: "#services" },
  { label: "Corporate Employee Cabs", href: "#services" },
  { label: "Wedding & Event Fleet", href: "#services" },
];

const CAB_TYPES = [
  { label: "Economy Hatchback", href: "#fleet-showcase" },
  { label: "Classic Sedan", href: "#fleet-showcase" },
  { label: "Family SUV", href: "#fleet-showcase" },
  { label: "Innova Crysta Premium", href: "#fleet-showcase" },
  { label: "Tempo Traveller", href: "#services" },
  { label: "Compare All Tariffs", href: "#fleet-showcase" },
];

const QUICK_LINKS = [
  { label: "Travel Blog & Guides", href: "/blog" },
  { label: "All 38 TN Districts", href: "#tamil-nadu-districts" },
  { label: "Popular Highway Routes", href: "#popular-routes" },
  { label: "Why Choose Aurelle", href: "#why-choose-us" },
  { label: "Safety Standards", href: "#safety-standards" },
  { label: "Customer Reviews", href: "#testimonials" },
  { label: "Frequently Asked Questions", href: "#faq-section" },
];

/** Shared link style for every footer anchor. */
const linkClass = "text-[13px] text-ink-muted hover:text-brand-600 transition-colors duration-200";

const FooterColumn: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h5 className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-4">{title}</h5>
    <ul className="space-y-2.5">{children}</ul>
  </div>
);

export const Footer: React.FC = () => {
  const { setTariffDetailsOpen } = useBooking();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer id="footer" className="w-full bg-surface-alt text-ink-muted">
      {/* ── Newsletter band ──────────────────────────────────────────────── */}
      <div className="border-b border-hairline">
        <div className="shell py-12 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-400 mb-3">
              Exclusive Offers
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-ink leading-tight mb-2">
              Get ₹500 off your first outstation ride
            </h3>
            <p className="text-sm text-ink-muted max-w-md">
              District tariff alerts, festival discount codes and temple-route travel passes — straight to your inbox.
            </p>
          </div>

          {subscribed ? (
            <div
              role="status"
              className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-4 text-sm text-emerald-300 font-medium"
            >
              <Check size={18} className="shrink-0" />
              You&apos;re on the list — your ₹500 voucher code is on its way.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 sm:max-w-xs bg-white border border-hairline-strong text-ink placeholder-ink-subtle px-4 py-3 rounded-lg text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 transition-all"
              />
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-6 py-3 rounded-lg inline-flex items-center justify-center gap-2 transition-colors group cursor-pointer"
              >
                Subscribe
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Link columns ─────────────────────────────────────────────────── */}
      <div className="shell py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
        {/* Brand + contact */}
        <div className="col-span-2">
          <Link href="/" className="mb-4 inline-block">
            <Image
              src="/brand/logo-lockup.png"
              alt="Trip Nova"
              width={1391}
              height={518}
              priority={false}
              className="h-11 w-auto"
            />
          </Link>
          <p className="text-[13px] leading-relaxed text-ink-muted max-w-xs mb-6">
            Tamil Nadu&apos;s one-way drop taxi service. Transparent per-km billing across all 38 districts, verified
            local chauffeurs, and no hidden return charges.
          </p>

          <div className="space-y-3">
            <a
              href={SUPPORT_PHONE_TEL}
              className="flex items-center gap-2.5 text-sm text-ink font-bold hover:text-brand-600 transition-colors"
            >
              <Phone size={15} className="text-brand-400 shrink-0" />
              {SUPPORT_PHONE_DISPLAY}
            </a>
            <a
              href={SUPPORT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-[13px] text-ink-muted hover:text-brand-600 transition-colors"
            >
              <MessageCircle size={15} className="text-emerald-400 shrink-0" />
              24/7 WhatsApp booking
            </a>
            <a
              href="mailto:support@aurellecabs.com"
              className="flex items-center gap-2.5 text-[13px] text-ink-muted hover:text-brand-600 transition-colors"
            >
              <Mail size={15} className="text-ink-subtle shrink-0" />
              support@aurellecabs.com
            </a>
            <p className="flex items-center gap-2.5 text-[13px] text-ink-subtle">
              <MapPin size={15} className="text-ink-subtle shrink-0" />
              Intra-Tamil Nadu service only
            </p>
          </div>
        </div>

        <FooterColumn title="Trip Types">
          {TRIP_TYPES.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={linkClass}>
                {item.label}
              </a>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Cab Types">
          {CAB_TYPES.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={linkClass}>
                {item.label}
              </a>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Quick Links">
          {QUICK_LINKS.map((item) =>
            item.href.startsWith("/") ? (
              <li key={item.label}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.label}>
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              </li>
            )
          )}
        </FooterColumn>

        <FooterColumn title="Popular Routes">
          {POPULAR_ROUTES.slice(0, 7).map((route) => (
            <li key={route.id}>
              <a href="#popular-routes" className={linkClass}>
                {route.from} → {route.to}
              </a>
            </li>
          ))}
        </FooterColumn>
      </div>

      {/* ── District link cloud ──────────────────────────────────────────── */}
      <div className="border-t border-hairline">
        <div className="shell py-10">
          <h5 className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-5">
            Drop Taxi Service Across Tamil Nadu
          </h5>
          <nav aria-label="District travel guides">
            <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
              {CITY_LINKS.map((city) => (
                <li key={city.id}>
                  <Link
                    href={`/district/${city.id}`}
                    className="text-[13px] text-ink-muted hover:text-brand-600 transition-colors"
                  >
                    {city.label} Taxi
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div className="border-t border-hairline">
        <div className="shell py-7 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <p className="text-[12px] text-ink-subtle text-center md:text-left">
            © {new Date().getFullYear()} Aurelle Cabs Tamil Nadu. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="text-[12px] text-ink-muted hover:text-brand-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-[12px] text-ink-muted hover:text-brand-600 transition-colors">
              Terms &amp; Conditions
            </Link>
            <button
              onClick={() => setTariffDetailsOpen(true)}
              className="text-[12px] text-ink-muted hover:text-brand-600 transition-colors cursor-pointer"
            >
              Tariff Policy
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-ink-subtle font-medium">
            {["UPI", "GPay", "Cards", "Cash"].map((method) => (
              <span key={method} className="border border-hairline-strong rounded px-2.5 py-1">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
