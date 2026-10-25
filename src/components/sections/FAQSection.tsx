"use client";
import {
  Question as HelpCircle,
  ChatCircle as MessageCircle,
  Phone,
  Plus,
  MagnifyingGlass as Search,
} from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useState, useEffect } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SUPPORT_WHATSAPP_URL, SUPPORT_PHONE_TEL, SUPPORT_PHONE_DISPLAY } from "@/lib/site";

interface FAQItem {
  _id: string;
  type: string;
  title: string;
  content: string;
  category?: string;
  sortOrder?: number;
}

export const FAQSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    apiFetch("/api/cms?type=faq")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setFaqs(data.data);
        }
      })
      .catch((err) => console.error("Error loading FAQs:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category || "General")))];

  const filteredFaqs = faqs.filter((faq) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = faq.title.toLowerCase().includes(q) || faq.content.toLowerCase().includes(q);
    const matchesCategory = activeCategory === "All" || (faq.category || "General") === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="faq-section" className="bg-surface-alt py-12 md:py-16">
      <div className="shell grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* ── Left: heading, search, contact ──────────────────────────── */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              align="left"
              title="Questions?"
              titleRest="Answered."
              subtitle="Cabs, tolls, driver allowance and inter-district travel — everything in one place."
            />

            <div className="relative mt-8">
              <label htmlFor="faq-search" className="sr-only">
                Search questions
              </label>
              <Search size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-subtle" />
              <input
                id="faq-search"
                type="search"
                placeholder="Search tolls, cancellation, driver…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-full border border-hairline-strong bg-white pl-12 pr-5 text-[15px] font-medium text-ink outline-none transition-all placeholder:font-normal placeholder:text-ink-subtle focus:border-brand-500 focus:shadow-[0_0_0_4px_rgba(191,1,35,0.12)]"
              />
            </div>

            <div className="relative mt-8 overflow-hidden rounded-[1.75rem] border border-hairline border-l-4 border-l-brand-600 bg-white p-7 shadow-sm">
              <h3 className="relative font-display text-[20px] font-bold text-ink">Still have questions?</h3>
              <p className="relative mt-1.5 text-[14px] text-ink-muted">
                Our support desk is online 24/7 for custom route queries.
              </p>
              <div className="relative mt-6 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
                <a
                  href={`${SUPPORT_WHATSAPP_URL}?text=Hi%20Aurelle%20Cabs%2C%20I%20have%20a%20question%20about%20booking`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn flex-1 bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  <MessageCircle size={17} weight="fill" />
                  WhatsApp us
                </a>
                <a href={SUPPORT_PHONE_TEL} className="btn-secondary flex-1">
                  <Phone size={16} weight="fill" />
                  {SUPPORT_PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: categories + accordion ───────────────────────────── */}
        <div className="lg:col-span-7">
          {categories.length > 1 && (
            <div className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-brand-600 text-white shadow-md"
                      : "border border-hairline bg-white text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {loading ? (
              [0, 1, 2, 3].map((i) => <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-surface-sunken" />)
            ) : filteredFaqs.length === 0 ? (
              <div className="rounded-[1.75rem] border border-hairline bg-surface-alt px-6 py-12 text-center">
                <HelpCircle size={30} className="mx-auto mb-3 text-ink-subtle" />
                <p className="mb-4 text-[15px] font-semibold text-ink">No questions match your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="btn-secondary btn-sm"
                >
                  Clear search and filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                const panelId = `faq-panel-${faq._id || index}`;

                return (
                  <div
                    key={faq._id || index}
                    className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isOpen ? "border-transparent bg-white shadow-lift" : "border-hairline bg-white hover:border-hairline-strong"
                    }`}
                  >
                    <h3>
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                      >
                        <span className="font-display text-[16px] font-semibold leading-snug text-ink">{faq.title}</span>
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                            isOpen ? "rotate-45 bg-brand-600 text-white" : "bg-surface-sunken text-ink"
                          }`}
                        >
                          <Plus size={15} weight="bold" />
                        </span>
                      </button>
                    </h3>

                    <div
                      id={panelId}
                      aria-hidden={!isOpen}
                      className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="whitespace-pre-line px-6 pb-6 text-[14.5px] leading-relaxed text-ink-muted">
                          {faq.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
