"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Buildings as Building2,
  Calculator,
  CaretDown as ChevronDown,
  Clock,
  Compass,
  Heart,
  MapPin,
  List as Menu,
  NavigationArrow as Navigation,
  Phone,
  AirplaneTilt as Plane,
  Path as Route,
  ShieldCheck,
  X,
} from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SmartImage } from "@/components/ui/SmartImage";

import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { FLEET } from "@/data/fleet";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from "@/lib/site";

/** Services mega menu, grouped into columns. */
const SERVICE_GROUPS = [
  {
    heading: "Trip types",
    items: [
      { icon: Navigation, title: "One-Way Drop", desc: "Pay only pickup-to-drop distance", href: "/#booking-widget" },
      { icon: Compass, title: "Outstation Round Trip", desc: "Multi-day travel with waiting", href: "/#booking-widget" },
      { icon: Plane, title: "Airport Transfer", desc: "Flight-tracked pickups and drops", href: "/#services" },
    ],
  },
  {
    heading: "Packages",
    items: [
      { icon: Clock, title: "Hourly City Rental", desc: "4, 8 and 12 hour local packages", href: "/#services" },
      { icon: Building2, title: "Corporate Transport", desc: "Shift rosters and monthly contracts", href: "/#services" },
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

const navLink =
  "relative flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink";

/**
 * Mega menu panel. It anchors to the right edge of the <nav> so wide panels
 * stay inside the viewport. The top padding clears the bar and doubles as a
 * hover bridge, so the panel stays open while the pointer travels to it.
 */
const MegaMenu: React.FC<{ label: string; width: string; children: React.ReactNode }> = ({
  label,
  width,
  children,
}) => (
  <div
    aria-label={label}
    className={`invisible absolute right-0 top-full z-50 pt-5 ${width} max-w-[calc(100vw-2rem)] translate-y-2 opacity-0 transition-all duration-300
      group-hover:visible group-hover:translate-y-0 group-hover:opacity-100
      group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100`}
  >
    <div className="overflow-hidden rounded-3xl border border-hairline bg-white p-3 shadow-[0_40px_80px_-30px_rgba(12,12,14,0.35)]">
      {children}
    </div>
  </div>
);

const MegaColumn: React.FC<{ heading: string; children: React.ReactNode }> = ({ heading, children }) => (
  <div className="p-3">
    <h3 className="mb-3 px-2.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-subtle">{heading}</h3>
    <ul className="space-y-0.5">{children}</ul>
  </div>
);

/** Dark feature card at the end of a mega menu. */
const MegaFeature: React.FC<{ title: string; body?: string; cta: string; href: string }> = ({
  title,
  body,
  cta,
  href,
}) => (
  <div className="relative flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-brand-50 p-5">
    <p className="relative font-display text-[16px] font-bold leading-snug text-ink">{title}</p>
    {body && <p className="relative mt-2 text-[12.5px] leading-relaxed text-ink-muted">{body}</p>}
    <a href={href} className="btn-primary btn-sm relative mt-5 w-full">
      {cta}
      <ArrowRight size={13} weight="bold" />
    </a>
  </div>
);

/* ── Mobile drawer rows ─────────────────────────────────────────────────── */

const mobileRow =
  "flex items-center justify-between py-3.5 border-b border-hairline text-[15px] font-semibold text-ink";
const mobileChild =
  "flex items-center justify-between gap-3 py-2.5 pl-4 text-[14px] text-ink-muted hover:text-brand-600 transition-colors";
const mobileChildAll = "flex items-center gap-1.5 py-2.5 pl-4 text-[14px] font-bold text-brand-600";

/**
 * One expandable section of the mobile drawer. Closed panels use Tailwind's
 * `hidden` class (display:none) so their links stay out of the tab order.
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
        className="flex w-full cursor-pointer items-center justify-between py-3.5 text-left text-[15px] font-semibold text-ink"
      >
        {label}
        <ChevronDown
          size={15}
          weight="bold"
          aria-hidden="true"
          className={`shrink-0 text-ink-subtle transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div id={panelId} className={isOpen ? "flex flex-col gap-0.5 border-l-2 border-brand-200 pb-3 pl-1" : "hidden"}>
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

  const toggleGroup = (key: string) => setOpenGroup((current) => (current === key ? null : key));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      {/*
       * A floating frosted pill on every page. The logo's navy wordmark needs a
       * light ground, so the bar stays light even over the dark hero; it firms
       * up (more opaque, deeper shadow) once the page scrolls.
       */}
      <div
        className={`mx-auto max-w-7xl rounded-full border backdrop-blur-xl transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? "border-hairline bg-white/95 shadow-[0_18px_40px_-20px_rgba(12,12,14,0.35)]"
            : "border-white/40 bg-white/85 shadow-[0_10px_30px_-16px_rgba(12,12,14,0.5)]"
        }`}
      >
        <div className="flex h-[62px] items-center gap-4 pl-5 pr-2.5">
          <Link href="/" className="flex shrink-0 items-center" onClick={closeMobile} aria-label="Trip Nova — home">
            <Image
              src="/brand/logo-lockup.png"
              alt="Trip Nova"
              width={1391}
              height={518}
              priority
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="relative ml-auto hidden items-center gap-0.5 lg:flex">
            <div className="group">
              <a href="/#services" className={navLink}>
                Services
                <ChevronDown size={12} weight="bold" className="transition-transform duration-300 group-hover:rotate-180" />
              </a>
              <MegaMenu label="Services" width="w-[900px]">
                <div className="grid grid-cols-[1fr_1fr_1fr_240px] gap-1">
                  {SERVICE_GROUPS.map((group) => (
                    <MegaColumn key={group.heading} heading={group.heading}>
                      {group.items.map(({ icon: Icon, title, desc, href }) => (
                        <li key={title}>
                          <a
                            href={href}
                            className="group/item flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-alt"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-sunken text-ink transition-all duration-300 group-hover/item:bg-brand-600 group-hover/item:text-white">
                              <Icon size={19} weight="duotone" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13.5px] font-semibold text-ink">{title}</span>
                              <span className="mt-0.5 block text-[12px] leading-snug text-ink-subtle">{desc}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </MegaColumn>
                  ))}
                  <MegaFeature
                    title="Corporate contracts & wedding convoys, quoted to your plan."
                    body="Tell our operations desk what you need — we price it the same day."
                    cta="Request a quote"
                    href="/#services"
                  />
                </div>
              </MegaMenu>
            </div>

            <div className="group">
              <a href="/#fleet-showcase" className={navLink}>
                Fleet
                <ChevronDown size={12} weight="bold" className="transition-transform duration-300 group-hover:rotate-180" />
              </a>
              <MegaMenu label="Fleet" width="w-[760px]">
                <div className="flex items-end justify-between gap-4 px-3 pb-4 pt-2">
                  <div>
                    <h3 className="text-[16px] font-bold text-ink">Pick your ride</h3>
                    <p className="mt-1 text-[13px] text-ink-subtle">Sanitised before every trip, with a verified chauffeur.</p>
                  </div>
                  <a
                    href="/#fleet-showcase"
                    className="flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-brand-600 hover:underline"
                  >
                    Compare tariffs <ArrowRight size={13} />
                  </a>
                </div>
                <ul className="grid grid-cols-4 gap-2">
                  {FLEET.map((vehicle) => (
                    <li key={vehicle.id}>
                      <a
                        href="/#fleet-showcase"
                        className="group/card block overflow-hidden rounded-2xl bg-surface-alt transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                      >
                        <div className="relative h-24 overflow-hidden">
                          <SmartImage fallbackLabel={vehicle.category}
                            src={vehicle.images[0]}
                            alt=""
                            fill
                            unoptimized
                            sizes="200px"
                            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                          />
                        </div>
                        <div className="p-3">
                          <span className="block text-[13px] font-bold text-ink">{vehicle.category}</span>
                          <span className="mt-0.5 flex items-baseline justify-between text-[12px] text-ink-subtle">
                            {vehicle.seatingCapacity} seats
                            <span className="font-bold text-brand-600">₹{vehicle.ratePerKm}/km</span>
                          </span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </MegaMenu>
            </div>

            <div className="group">
              <a href="/#tamil-nadu-districts" className={navLink}>
                Districts
                <ChevronDown size={12} weight="bold" className="transition-transform duration-300 group-hover:rotate-180" />
              </a>
              <MegaMenu label="Districts" width="w-[860px]">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_230px] gap-1">
                  {DISTRICT_GROUPS.map((group) => (
                    <MegaColumn key={group.heading} heading={group.heading}>
                      {group.items.map((district) => (
                        <li key={district.id}>
                          <Link
                            href={`/district/${district.id}`}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13.5px] text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
                          >
                            <MapPin size={12} weight="fill" className="shrink-0 text-brand-500" />
                            {district.name}
                          </Link>
                        </li>
                      ))}
                    </MegaColumn>
                  ))}
                  <MegaFeature
                    title="All 38 districts. One transparent per-km rate."
                    cta="Browse districts"
                    href="/#tamil-nadu-districts"
                  />
                </div>
              </MegaMenu>
            </div>

            <a href="/#popular-routes" className={navLink}>
              Routes
            </a>
            <Link href="/blog" className={navLink}>
              Blog
            </Link>
            <a href="/#safety-standards" className={navLink}>
              Safety
            </a>
          </nav>

          {/* `ml-auto` below lg, where the nav is hidden and can't push this right. */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-2">
            <a
              href={SUPPORT_PHONE_TEL}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-surface-sunken xl:inline-flex"
              title="24/7 helpline"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {SUPPORT_PHONE_DISPLAY}
            </a>

            {isAuthenticated && user ? (
              <button
                onClick={() => setAccountModalOpen(true)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-brand-600 p-[2px] text-sm font-bold"
                title={`My account — ${user.name}`}
                aria-label="My account"
              >
                <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white text-ink">
                  {user.profilePic ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.profilePic} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthModalOpen(true);
                }}
                className="hidden cursor-pointer items-center rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-surface-sunken sm:inline-flex"
              >
                Sign in
              </button>
            )}

            <a href="/#booking-widget" className="btn-dark btn-sm group hidden h-[44px] px-5 sm:inline-flex">
              Book a ride
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={12} weight="bold" />
              </span>
            </a>

            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-night text-white transition-colors hover:bg-night-700 lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} weight="bold" /> : <Menu size={20} weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-2 max-h-[calc(100vh-6rem)] max-w-7xl animate-fade-up overflow-y-auto rounded-3xl border border-hairline bg-white shadow-lift lg:hidden">
          <nav className="flex flex-col px-5 py-3">
            <MobileGroup label="Services" isOpen={openGroup === "services"} onToggle={() => toggleGroup("services")}>
              {SERVICE_GROUPS.flatMap((group) => group.items).map((item) => (
                <a key={item.title} href={item.href} onClick={closeMobile} className={mobileChild}>
                  {item.title}
                </a>
              ))}
              <a href="/#services" onClick={closeMobile} className={mobileChildAll}>
                View all services <ArrowRight size={13} />
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
                Compare all tariffs <ArrowRight size={13} />
              </a>
            </MobileGroup>

            <MobileGroup
              label="38 TN Districts"
              isOpen={openGroup === "districts"}
              onToggle={() => toggleGroup("districts")}
            >
              {DISTRICT_GROUPS.flatMap((group) => group.items).map((district) => (
                <Link key={district.id} href={`/district/${district.id}`} onClick={closeMobile} className={mobileChild}>
                  {district.name}
                </Link>
              ))}
              <a href="/#tamil-nadu-districts" onClick={closeMobile} className={mobileChildAll}>
                Browse every district <ArrowRight size={13} />
              </a>
            </MobileGroup>

            <a href="/#popular-routes" onClick={closeMobile} className={mobileRow}>
              Popular Routes
            </a>
            <Link href="/blog" onClick={closeMobile} className={mobileRow}>
              Blog &amp; Guides
            </Link>
            <a href="/#safety-standards" onClick={closeMobile} className={mobileRow}>
              Safety Standards
            </a>
            <a href="/#faq-section" onClick={closeMobile} className={mobileRow}>
              FAQ
            </a>

            <div className="flex flex-col gap-2.5 py-4">
              <a href="/#booking-widget" onClick={closeMobile} className="btn-primary w-full">
                Book a ride <ArrowRight size={15} weight="bold" />
              </a>
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                    closeMobile();
                  }}
                  className="btn-secondary w-full"
                >
                  Sign in
                </button>
              )}
              <a href={SUPPORT_PHONE_TEL} className="btn-ghost w-full">
                <Phone size={15} weight="fill" />
                {SUPPORT_PHONE_DISPLAY}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
