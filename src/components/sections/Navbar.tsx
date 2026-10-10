"use client";

import {
  ArrowRight,
  Buildings as Building2,
  Calculator,
  CaretDown as ChevronDown,
  Clock,
  Compass,
  Heart,
  MapPin,
  List as Menu,
  NavigationArrow as Navigation,
  AirplaneTilt as Plane,
  Path as Route,
  ShieldCheck,
  X,
} from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { FLEET } from "@/data/fleet";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/site";

/** Services mega menu, grouped into columns. */
const SERVICE_GROUPS = [
  {
    heading: "Trip types",
    items: [
      { icon: Navigation, title: "One-Way Drop", desc: "Pay only pickup-to-drop distance", href: "/#booking-widget" },
      {
        icon: Compass,
        title: "Outstation Round Trip",
        desc: "Multi-day travel with waiting",
        href: "/#booking-widget",
      },
      { icon: Plane, title: "Airport Transfer", desc: "Flight-tracked pickups and drops", href: "/#services" },
    ],
  },
  {
    heading: "Packages",
    items: [
      { icon: Clock, title: "Hourly City Rental", desc: "4, 8 and 12 hour local packages", href: "/#services" },
      {
        icon: Building2,
        title: "Corporate Transport",
        desc: "Shift rosters and monthly contracts",
        href: "/#services",
      },
      { icon: Heart, title: "Wedding & Events", desc: "Matched convoys for functions", href: "/#services" },
    ],
  },
  {
    heading: "Plan your trip",
    items: [
      { icon: Calculator, title: "Fare Estimator", desc: "See the price before you book", href: "/#booking-widget" },
      { icon: Route, title: "Popular Routes", desc: "Fixed fares on common corridors", href: "/#popular-routes" },
      { icon: ShieldCheck, title: "Safety Standards", desc: "How we vet every chauffeur", href: "/#safety-standards" },
    ],
  },
];

/** Districts mega menu, grouped by region; ids match src/data/districts.ts. */
const DISTRICT_GROUPS = [
  {
    heading: "North",
    items: [
      { id: "chennai", name: "Chennai" },
      { id: "chengalpattu", name: "Chengalpattu" },
      { id: "kanchipuram", name: "Kanchipuram" },
      { id: "tiruvallur", name: "Tiruvallur" },
      { id: "vellore", name: "Vellore" },
    ],
  },
  {
    heading: "West",
    items: [
      { id: "coimbatore", name: "Coimbatore" },
      { id: "tiruppur", name: "Tiruppur" },
      { id: "erode", name: "Erode" },
      { id: "salem", name: "Salem" },
      { id: "nilgiris", name: "Ooty" },
    ],
  },
  {
    heading: "Central",
    items: [
      { id: "tiruchirappalli", name: "Trichy" },
      { id: "thanjavur", name: "Thanjavur" },
      { id: "karur", name: "Karur" },
      { id: "namakkal", name: "Namakkal" },
      { id: "dindigul", name: "Dindigul" },
    ],
  },
  {
    heading: "South",
    items: [
      { id: "madurai", name: "Madurai" },
      { id: "tirunelveli", name: "Tirunelveli" },
      { id: "thoothukudi", name: "Thoothukudi" },
      { id: "kanyakumari", name: "Kanyakumari" },
      { id: "theni", name: "Theni" },
    ],
  },
];

const navLinkBase =
  "px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap";

/**
 * Nav links invert to white while the header floats over the hero. The bar has
 * no scrim there, so each label carries its own shadow for legibility against
 * whichever slide is on screen.
 */
/** Nav links — the bar is always solid, so one treatment covers every page. */
const navLink = `${navLinkBase} text-gray-700 hover:text-brand-600 hover:bg-brand-50`;

/**
 * Mega menu panel — a contained card, not a full-bleed bar.
 *
 * It anchors to the right edge of the <nav> (the nearest positioned ancestor)
 * so wide panels stay inside the viewport instead of overflowing. The top
 * padding clears the header bar and doubles as a hover bridge, so the panel
 * does not close while the pointer travels down to it.
 */
const MegaMenu: React.FC<{ label: string; width: string; children: React.ReactNode }> = ({
  label,
  width,
  children,
}) => (
  <div
    aria-label={label}
    className={`invisible absolute right-0 top-full z-50 pt-[22px] ${width} max-w-[calc(100vw-2rem)] translate-y-1 opacity-0 transition-all duration-200
      group-hover:visible group-hover:translate-y-0 group-hover:opacity-100
      group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100`}
  >
    <div className="overflow-hidden rounded-xl border border-hairline bg-white shadow-lift">
      <div className="p-6">{children}</div>
      {/* Thin brand rule along the bottom edge. */}
      <div className="h-[3px] w-full bg-gradient-to-r from-brand-600 via-brand-500 to-gold-400" />
    </div>
  </div>
);

/** One labelled column of links inside a mega menu. */
const MegaColumn: React.FC<{ heading: string; children: React.ReactNode }> = ({ heading, children }) => (
  <div>
    <h3 className="mb-3.5 border-b border-hairline pb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600">
      {heading}
    </h3>
    <ul className="space-y-1">{children}</ul>
  </div>
);

/* ── Mobile drawer rows ─────────────────────────────────────────────────── */

const mobileRow = "flex items-center py-3 border-b border-hairline text-sm font-semibold text-ink";
const mobileChild =
  "flex items-center justify-between gap-3 py-2.5 pl-4 text-[13px] text-ink-muted hover:text-brand-600 transition-colors";
const mobileChildAll = "flex items-center py-2.5 pl-4 text-[13px] font-bold text-brand-600";

/**
 * One expandable section of the mobile drawer. The panel is kept mounted and
 * collapsed with a max-height transition so it animates; `hidden` on a closed
 * panel keeps its links out of the tab order and off screen readers.
 */
const MobileGroup: React.FC<{
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ label, isOpen, onToggle, children }) => {
  const panelId = `drawer-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="border-b border-hairline">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-ink cursor-pointer"
      >
        {label}
        <ChevronDown
          size={15}
          weight="bold"
          aria-hidden="true"
          className={`shrink-0 text-ink-subtle transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/*
       * The display utility must be swapped, not paired with the `hidden`
       * attribute: author CSS always beats the UA stylesheet, so Tailwind's
       * `.flex { display: flex }` overrode `[hidden] { display: none }` and
       * the panel stayed open. `hidden` here is Tailwind's display:none class.
       */}
      <div
        id={panelId}
        className={
          isOpen ? "flex flex-col gap-0.5 border-l-2 border-brand-100 pb-3 pl-1" : "hidden"
        }
      >
        {children}
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { user, isAuthenticated, setAuthModalOpen, setAuthMode, setAccountModalOpen } = useCustomerAuth();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setOpenGroup(null);
  };

  /** Which drawer accordion is expanded; only one at a time. */
  const toggleGroup = (key: string) => setOpenGroup((current) => (current === key ? null : key));

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ── Main bar — always solid, so the hero image never runs under it. ── */}
      <div
        className={`bg-surface border-b border-hairline transition-shadow duration-200 ${
          scrolled ? "shadow-card" : ""
        }`}
      >
        {/* Brand sits left; nav and account cluster are pushed right together. */}
        <div className="shell h-[68px] flex items-center gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center shrink-0" onClick={closeMobile} aria-label="Trip Nova — home">
            <Image
              src="/brand/logo-lockup.png"
              alt="Trip Nova"
              width={1391}
              height={518}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="relative ml-auto hidden lg:flex items-center gap-0.5">
            <Link href="/" className={navLink}>
              Home
            </Link>

            {/* ── Services mega menu ───────────────────────────────────── */}
            <div className="group">
              <a href="/#services" className={navLink}>
                Services
                <ChevronDown size={13} className="transition-transform duration-200 group-hover:rotate-180" />
              </a>

              <MegaMenu label="Services" width="w-[860px]">
                <div className="grid grid-cols-4 gap-6">
                  {SERVICE_GROUPS.map((group) => (
                    <MegaColumn key={group.heading} heading={group.heading}>
                      {group.items.map(({ icon: Icon, title, desc, href }) => (
                        <li key={title}>
                          <a
                            href={href}
                            className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-brand-50"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                              <Icon size={19} weight="duotone" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13px] font-semibold text-ink">{title}</span>
                              <span className="mt-0.5 block text-[12px] leading-snug text-ink-subtle">{desc}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </MegaColumn>
                  ))}

                  {/* Featured panel */}
                  <div className="rounded-xl bg-ink p-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold-400">
                      Need something custom?
                    </span>
                    <p className="mt-2.5 text-[14px] font-semibold leading-snug text-white">
                      Corporate contracts and wedding convoys, quoted to your requirement.
                    </p>
                    <p className="mt-2 text-[12px] leading-relaxed text-gray-400">
                      Tell our operations desk what you need and we&apos;ll price it the same day.
                    </p>
                    <a href="/#services" className="btn-gold btn-sm mt-4 w-full">
                      Request a quote
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </MegaMenu>
            </div>

            {/* ── Fleet mega menu — priced from live fleet data ────────── */}
            <div className="group">
              <a href="/#fleet-showcase" className={navLink}>
                Fleet
                <ChevronDown size={13} className="transition-transform duration-200 group-hover:rotate-180" />
              </a>

              <MegaMenu label="Fleet" width="w-[720px]">
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-hairline pb-4">
                  <div>
                    <h3 className="text-[15px] font-bold text-ink">Our cab classes</h3>
                    <p className="mt-1 text-[13px] text-ink-subtle">
                      Every vehicle sanitised before dispatch, with a verified chauffeur.
                    </p>
                  </div>
                  <a
                    href="/#fleet-showcase"
                    className="flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-brand-600 hover:underline"
                  >
                    Compare all tariffs <ArrowRight size={13} />
                  </a>
                </div>

                <ul className="grid grid-cols-4 gap-3.5">
                  {FLEET.map((vehicle) => (
                    <li key={vehicle.id}>
                      <a
                        href="/#fleet-showcase"
                        className="group/card block overflow-hidden rounded-xl border border-hairline transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
                      >
                        <div className="relative h-24 bg-surface-sunken">
                          <Image
                            src={vehicle.images[0]}
                            alt=""
                            fill
                            unoptimized
                            sizes="220px"
                            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[13px] font-bold text-ink">{vehicle.category}</span>
                            <span className="text-[12px] font-bold text-brand-600">₹{vehicle.ratePerKm}/km</span>
                          </div>
                          <span className="mt-1 block text-[12px] text-ink-subtle">
                            {vehicle.seatingCapacity} seats · {vehicle.baggageCapacity} bags
                          </span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </MegaMenu>
            </div>

            {/* ── Districts mega menu ──────────────────────────────────── */}
            <div className="group">
              <a href="/#tamil-nadu-districts" className={navLink}>
                Districts
                <ChevronDown size={13} className="transition-transform duration-200 group-hover:rotate-180" />
              </a>

              <MegaMenu label="Districts" width="w-[820px]">
                <div className="grid grid-cols-5 gap-5">
                  {DISTRICT_GROUPS.map((group) => (
                    <MegaColumn key={group.heading} heading={group.heading}>
                      {group.items.map((district) => (
                        <li key={district.id}>
                          <Link
                            href={`/district/${district.id}`}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-600"
                          >
                            <MapPin size={12} className="shrink-0 text-brand-500" />
                            {district.name}
                          </Link>
                        </li>
                      ))}
                    </MegaColumn>
                  ))}

                  <div className="rounded-xl bg-brand-50 p-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600">
                      Full coverage
                    </span>
                    <p className="mt-2.5 text-[14px] font-semibold leading-snug text-ink">
                      All 38 districts of Tamil Nadu, one transparent per-km rate.
                    </p>
                    <a
                      href="/#tamil-nadu-districts"
                      className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 hover:underline"
                    >
                      Browse every district <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </MegaMenu>
            </div>

            <Link href="/blog" className={navLink}>
              Blog
            </Link>
            <a href="/#why-choose-us" className={navLink}>
              Why Us
            </a>
            <a href="/#safety-standards" className={navLink}>
              Safety
            </a>
          </nav>

          {/*
           * Account + CTA. Carries `ml-auto` below lg, where the nav above is
           * display:none and so cannot push this cluster right itself. At lg
           * the nav takes over that job and this drops back to ml-0, or the
           * two auto margins would split the free space between them.
           */}
          <div className="ml-auto flex items-center gap-2 shrink-0 lg:ml-0">
            {isAuthenticated && user ? (
              <button
                onClick={() => setAccountModalOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden transition-colors cursor-pointer border bg-brand-50 border-brand-200 text-brand-600 hover:border-brand-600"
                title={`My account — ${user.name}`}
                aria-label="My account"
              >
                {user.profilePic ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthModalOpen(true);
                }}
                className="text-[13px] font-semibold transition-colors px-3 py-2 hidden sm:inline-flex items-center gap-1.5 cursor-pointer text-ink-muted hover:text-brand-600"
              >
                Sign In
              </button>
            )}

            <a href="/#booking-widget" className="btn-gold btn-sm rounded-full px-5 hidden sm:inline-flex">
              Book a Trip
            </a>

            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="lg:hidden p-2 -mr-2 transition-colors text-ink hover:text-brand-600"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-hairline shadow-lift max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          <nav className="shell py-4 flex flex-col">
            <Link href="/" onClick={closeMobile} className={mobileRow}>
              Home
            </Link>

            {/*
             * Services, Fleet and Districts are mega menus on desktop. Hover
             * has no mobile equivalent, so here they expand in place — without
             * this their children (trip types, cab classes, district pages)
             * are unreachable on a phone.
             */}
            <MobileGroup
              label="Services"
              isOpen={openGroup === "services"}
              onToggle={() => toggleGroup("services")}
            >
              {SERVICE_GROUPS.flatMap((group) => group.items).map((item) => (
                <a key={item.title} href={item.href} onClick={closeMobile} className={mobileChild}>
                  {item.title}
                </a>
              ))}
              <a href="/#services" onClick={closeMobile} className={mobileChildAll}>
                View all services
              </a>
            </MobileGroup>

            <MobileGroup label="Our Fleet" isOpen={openGroup === "fleet"} onToggle={() => toggleGroup("fleet")}>
              {FLEET.map((vehicle) => (
                <a key={vehicle.id} href="/#fleet-showcase" onClick={closeMobile} className={mobileChild}>
                  <span>{vehicle.category}</span>
                  <span className="font-bold text-brand-600">₹{vehicle.ratePerKm}/km</span>
                </a>
              ))}
              <a href="/#fleet-showcase" onClick={closeMobile} className={mobileChildAll}>
                Compare all tariffs
              </a>
            </MobileGroup>

            <MobileGroup
              label="38 TN Districts"
              isOpen={openGroup === "districts"}
              onToggle={() => toggleGroup("districts")}
            >
              {DISTRICT_GROUPS.flatMap((group) => group.items).map((district) => (
                <Link
                  key={district.id}
                  href={`/district/${district.id}`}
                  onClick={closeMobile}
                  className={mobileChild}
                >
                  {district.name}
                </Link>
              ))}
              <a href="/#tamil-nadu-districts" onClick={closeMobile} className={mobileChildAll}>
                Browse every district
              </a>
            </MobileGroup>

            <Link href="/blog" onClick={closeMobile} className={mobileRow}>
              Blog &amp; Guides
            </Link>
            <a href="/#why-choose-us" onClick={closeMobile} className={mobileRow}>
              Why Aurelle
            </a>
            <a href="/#safety-standards" onClick={closeMobile} className={mobileRow}>
              Safety Standards
            </a>
            <a href="/#faq-section" onClick={closeMobile} className={mobileRow}>
              FAQ
            </a>

            <div className="flex flex-col gap-2.5 pt-4">
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                    closeMobile();
                  }}
                  className="btn-secondary w-full"
                >
                  Sign In
                </button>
              )}
              <a href="/#booking-widget" onClick={closeMobile} className="btn-gold w-full">
                Book a Trip
              </a>
              <a href={SUPPORT_PHONE_TEL} className="btn-ghost w-full">
                {SUPPORT_PHONE_DISPLAY}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
