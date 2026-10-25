"use client";

import { ArrowUpRight, ChatCircle, Phone } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";

import { SUPPORT_PHONE_TEL, SUPPORT_WHATSAPP_URL } from "@/lib/site";

/**
 * Persistent booking shortcuts, shown once the hero's booking card has
 * scrolled away: a floating pair of buttons on desktop and a sticky action
 * bar on phones.
 */
export const QuickActions: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0";

  return (
    <>
      {/* Desktop */}
      <div className={`fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 transition-all duration-500 md:flex ${hidden}`}>
        <a
          href={`${SUPPORT_WHATSAPP_URL}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20cab`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lift transition-transform duration-300 hover:scale-110"
        >
          <ChatCircle size={22} weight="fill" />
        </a>
        <a
          href="#booking-widget"
          className="group flex items-center gap-2.5 rounded-full bg-night py-2 pl-5 pr-2 text-[14px] font-semibold text-white shadow-glow transition-transform duration-300 hover:-translate-y-0.5"
        >
          Book a ride
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={15} weight="bold" />
          </span>
        </a>
      </div>

      {/* Mobile */}
      <div className={`fixed inset-x-3 bottom-3 z-40 transition-all duration-500 md:hidden ${hidden}`}>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-night/95 p-1.5 shadow-glow backdrop-blur-xl">
          <a
            href={SUPPORT_PHONE_TEL}
            aria-label="Call us"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <Phone size={19} weight="fill" />
          </a>
          <a
            href={SUPPORT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
          >
            <ChatCircle size={20} weight="fill" />
          </a>
          <a href="#booking-widget" className="btn-primary h-12 flex-1">
            Book a ride
            <ArrowUpRight size={15} weight="bold" />
          </a>
        </div>
      </div>
    </>
  );
};
