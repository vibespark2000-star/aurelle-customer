"use client";
import {
  CaretDown as ChevronDown,
  Question as HelpCircle,
  ChatCircle as MessageCircle,
  Phone,
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
    const matchesSearch =
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || (faq.category || "General") === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="faq-section" className="py-12 md:py-16 bg-surface-alt">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 space-y-7">
        <SectionHeading
          title="Got Questions?"
          titleRest="We Have Answers"
          subtitle="Everything about our cabs, toll policies, driver allowances and inter-district travel across Tamil Nadu."
        />

        {/* Filters */}
        <div className="space-y-4">
          <div className="relative max-w-md mx-auto">
            <label htmlFor="faq-search" className="sr-only">
              Search questions
            </label>
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none"
            />
            <input
              id="faq-search"
              type="search"
              placeholder="Search questions — tolls, cancellation, driver…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="field pl-11"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold border transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? "bg-brand-600 border-brand-600 text-white"
                      : "bg-white border-hairline text-ink-muted hover:text-brand-600 hover:border-brand-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-[13px] text-ink-subtle">Loading questions…</div>
          ) : filteredFaqs.length === 0 ? (
            <div className="card text-center py-12 px-6">
              <HelpCircle size={28} className="mx-auto text-ink-subtle mb-3" />
              <p className="text-[15px] font-semibold text-ink mb-4">No questions match your search.</p>
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
                <div key={faq._id || index} className="card overflow-hidden">
                  <h3>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-alt transition-colors"
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="badge-neutral shrink-0 hidden sm:inline-flex">
                          {faq.category || "General"}
                        </span>
                        <span className="text-[15px] font-semibold text-ink leading-snug">{faq.title}</span>
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-ink-subtle shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </h3>

                  {isOpen && (
                    <div id={panelId} className="px-5 pb-5 pt-4 border-t border-hairline">
                      <p className="text-[14px] text-ink-muted leading-relaxed whitespace-pre-line">{faq.content}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still stuck? */}
        <div className="card p-6 text-center">
          <h3 className="text-[17px] font-bold text-ink mb-1.5">Still have questions?</h3>
          <p className="text-[14px] text-ink-muted mb-5">
            Our support desk is online 24/7 to answer custom route queries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`${SUPPORT_WHATSAPP_URL}?text=Hi%20Aurelle%20Cabs%2C%20I%20have%20a%20question%20about%20booking`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
            <a href={SUPPORT_PHONE_TEL} className="btn-secondary w-full sm:w-auto">
              <Phone size={15} />
              {SUPPORT_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
