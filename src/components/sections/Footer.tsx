"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Envelope as Mail,
  MapPin,
  ChatCircle as MessageCircle,
  Phone,
  Star,
} from "@phosphor-icons/react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useBooking } from "@/context/BookingContext";

import { POPULAR_ROUTES } from "@/data/fleet";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL, SUPPORT_WHATSAPP_URL } from "@/lib/site";

/**
 * Link-dense SEO footer.
 *
 * Columns are driven by real data (fleet tiers, district guide pages, popular
 * routes) so every link resolves to a page that exists. The city cloud gives
 * the /district/[id] guides internal links from every page on the site.
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


/** "Tiruchirappalli (Trichy)" → "Trichy". */
const shortName = (city: string) => city.match(/\(([^)]+)\)/)?.[1] ?? city;

/** Link with a small red arrow that slides in on hover. */
const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const className =
    "group inline-flex items-center gap-1.5 text-[14px] text-ink-muted transition-colors duration-200 hover:text-brand-600";
  const inner = (
    <>
      <span className="w-0 overflow-hidden text-brand-600 transition-all duration-300 group-hover:w-3">
        <ArrowRight size={12} weight="bold" />
      </span>
      {children}
    </>
  );
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={className}>
      {inner}
    </a>
  );
};

const FooterColumn: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h5 className="mb-5 flex items-center gap-2 font-display text-[15px] font-bold text-ink">
      <span className="h-4 w-1 rounded-full bg-brand-600" aria-hidden="true" />
      {title}
    </h5>
    <ul className="space-y-3">{children}</ul>
  </div>
);

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: "24/7 booking helpline",
    value: SUPPORT_PHONE_DISPLAY,
    href: SUPPORT_PHONE_TEL,
    tone: "bg-brand-600 text-white",
  },
  {
    icon: MessageCircle,
    label: "Book on WhatsApp",
    value: "Chat with us",
    href: SUPPORT_WHATSAPP_URL,
    tone: "bg-emerald-500 text-white",
    external: true,
  },
  {
    icon: Mail,
    label: "Email support",
    value: "support@aurellecabs.com",
    href: "mailto:support@aurellecabs.com",
    tone: "bg-night text-white",
  },
];

const TRUST = [
  { icon: Star, value: "4.9", label: "Rider rating" },
  { icon: MapPin, value: "38", label: "Districts" },
  { icon: Clock, value: "24/7", label: "Support" },
];

const PAYMENTS = ["UPI", "GPay", "Cards", "Cash"];

export const Footer: React.FC = () => {
  const { setTariffDetailsOpen } = useBooking();

  return (
    <footer id="footer" className="relative w-full overflow-hidden border-t border-hairline bg-white text-ink-muted">
      {/* Thin red rule across the very top */}
      <div className="h-1 w-full bg-brand-600" aria-hidden="true" />

      {/* ── Contact cards ────────────────────────────────────────────────── */}
      <div className="shell pt-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CONTACT_CARDS.map(({ icon: Icon, label, value, href, tone, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 rounded-2xl border border-hairline bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lift"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon size={22} weight="fill" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-medium text-ink-subtle">{label}</span>
                <span className="block truncate font-display text-[16px] font-bold text-ink">{value}</span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-ink transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-600 group-hover:text-white">
                <ArrowUpRight size={15} weight="bold" />
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Brand + link columns ─────────────────────────────────────────── */}
      <div className="shell grid grid-cols-2 gap-x-8 gap-y-10 py-12 md:grid-cols-4 lg:grid-cols-12">
        <div className="col-span-2 md:col-span-4 lg:col-span-4">
          <Link href="/" className="inline-block">
            <Image src="/brand/logo-lockup.png" alt="Trip Nova" width={1391} height={518} className="h-11 w-auto" />
          </Link>
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ink-muted">
            Tamil Nadu&apos;s one-way drop taxi service. Transparent per-km billing across all 38 districts, verified
            local chauffeurs, and no hidden return charges.
          </p>

          <dl className="mt-6 grid max-w-sm grid-cols-3 gap-2">
            {TRUST.map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-xl bg-surface-alt px-3 py-3 text-center">
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="flex items-center justify-center gap-1 font-display text-[20px] font-extrabold text-ink">
                    <Icon size={15} weight="fill" className="text-brand-600" />
                    {value}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-ink-subtle">{label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <a href="/#booking-widget" className="btn-primary mt-6">
            Book your ride
            <ArrowRight size={15} weight="bold" />
          </a>
        </div>

        <div className="lg:col-span-2">
          <FooterColumn title="Trip types">
            {TRIP_TYPES.map((item) => (
              <li key={item.label}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="lg:col-span-2">
          <FooterColumn title="Cab types">
            {CAB_TYPES.map((item) => (
              <li key={item.label}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="lg:col-span-2">
          <FooterColumn title="Quick links">
            {QUICK_LINKS.map((item) => (
              <li key={item.label}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="lg:col-span-2">
          <FooterColumn title="Popular routes">
            {POPULAR_ROUTES.slice(0, 7).map((route) => (
              <li key={route.id}>
                <FooterLink href="#popular-routes">
                  {shortName(route.from)} → {shortName(route.to)}
                </FooterLink>
              </li>
            ))}
          </FooterColumn>
        </div>
      </div>

      {/* ── District link cloud ──────────────────────────────────────────── */}
      <div className="shell pb-10">
        <div className="rounded-3xl bg-surface-alt p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <h5 className="font-display text-[17px] font-bold text-ink">Drop taxi service across Tamil Nadu</h5>
            <span className="text-[12.5px] text-ink-subtle">All 38 districts · one transparent per-km rate</span>
          </div>
          <nav aria-label="District travel guides">
            <ul className="flex flex-wrap gap-2">
              {CITY_LINKS.map((city) => (
                <li key={city.id}>
                  <Link
                    href={`/district/${city.id}`}
                    className="flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-muted transition-all hover:border-brand-600 hover:bg-brand-600 hover:text-white"
                  >
                    <MapPin size={11} weight="fill" className="opacity-60" />
                    {city.label} Taxi
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div className="border-t border-hairline bg-surface-alt">
        <div className="shell flex flex-col-reverse items-center justify-between gap-5 py-6 md:flex-row">
          <p className="text-center text-[13px] text-ink-subtle md:text-left">
            © {new Date().getFullYear()} <span className="font-semibold text-ink">Trip Nova</span>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px]">
            <Link href="/privacy-policy" className="text-ink-muted transition-colors hover:text-brand-600">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-ink-muted transition-colors hover:text-brand-600">
              Terms &amp; Conditions
            </Link>
            <button
              onClick={() => setTariffDetailsOpen(true)}
              className="flex cursor-pointer items-center gap-1 text-ink-muted transition-colors hover:text-brand-600"
            >
              Tariff Policy <ArrowUpRight size={11} weight="bold" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="mr-1 text-[12px] text-ink-subtle">We accept</span>
            {PAYMENTS.map((method) => (
              <span
                key={method}
                className="rounded-md border border-hairline bg-white px-2.5 py-1 text-[11px] font-bold text-ink shadow-sm"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
