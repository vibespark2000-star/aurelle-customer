"use client";

import { Quotes as Quote, SealCheck, Star } from "@phosphor-icons/react";
import React from "react";

import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Review {
  quote: string;
  author: string;
  location: string;
  initials: string;
  trip: string;
}

const REVIEWS: Review[] = [
  {
    quote:
      "Booked a one-way drop from Chennai to Madurai. Local agents wanted return charges for 920 km, but Aurelle charged strictly for 460 km — saved over ₹5,200. The driver was courteous and the sedan was spotless.",
    author: "Karthik Subramanian",
    location: "Chennai",
    initials: "KS",
    trip: "Chennai → Madurai · Sedan",
  },
  {
    quote:
      "We reserved an Innova Crysta for a family trip from Coimbatore to Ooty. Strong hill-climb performance, a patient driver, and no hidden toll surcharges at the end of the trip.",
    author: "Dr. Ananya Sundaram",
    location: "Coimbatore",
    initials: "AS",
    trip: "Coimbatore → Ooty · Premium",
  },
  {
    quote:
      "I travel between Trichy, Salem and Thanjavur regularly for industrial visits. Instant invoices, verified chauffeurs and support that actually answers at 2am. It has become our default.",
    author: "S. Rajesh Kumar",
    location: "Tiruchirappalli",
    initials: "RK",
    trip: "Trichy ⇄ Salem · Corporate",
  },
];

const Stars: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex gap-0.5 ${className}`} role="img" aria-label="Rated 5 out of 5">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} size={16} weight="fill" className="text-gold-400" />
    ))}
  </div>
);

export const Testimonials: React.FC = () => {
  const revealRef = useSilkReveal<HTMLDivElement>();

  return (
    <section ref={revealRef} id="testimonials" className="relative overflow-hidden bg-surface-alt py-12 md:py-16">
      <div className="shell">
        <div className="silk-item mb-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            title="Real trips."
            titleRest="Real savings."
            subtitle="What riders across Tamil Nadu say after their journey."
          />

          {/* Rating summary */}
          <div className="flex items-center gap-5 rounded-3xl border border-hairline bg-white px-6 py-5 shadow-sm">
            <span className="font-display text-[52px] font-extrabold leading-none tracking-tight text-ink">4.9</span>
            <span>
              <Stars />
              <span className="mt-1.5 block text-[13px] text-ink-muted">
                from <strong className="text-ink">25,000+</strong> verified journeys
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {REVIEWS.map((review, i) => {
            const featured = i === 1;
            return (
              <figure
                key={review.author}
                className={`silk-item relative flex flex-col overflow-hidden rounded-[1.75rem] p-7 transition-transform duration-500 hover:-translate-y-1.5 md:p-8 ${
                  featured ? "border-2 border-brand-600 bg-white shadow-lift md:-translate-y-4 md:hover:-translate-y-6" : "border border-hairline bg-white"
                }`}
              >
                <Quote
                  size={40}
                  weight="fill"
                  className={`mb-5 shrink-0 ${featured ? "text-brand-600" : "text-brand-200"}`}
                  aria-hidden="true"
                />
                <blockquote className={`flex-1 text-[15px] leading-relaxed ${featured ? "text-ink" : "text-ink-muted"}`}>
                  {review.quote}
                </blockquote>

                <span
                  className={`mt-6 self-start rounded-full px-3 py-1 text-[11.5px] font-semibold ${
                    featured ? "bg-brand-50 text-brand-700" : "bg-surface-alt text-ink-muted"
                  }`}
                >
                  {review.trip}
                </span>

                <figcaption className={`mt-6 flex items-center gap-3 border-t pt-6 ${"border-hairline"}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[13px] font-bold text-white">
                    {review.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`flex items-center gap-1 text-[14.5px] font-bold ${"text-ink"}`}>
                      {review.author}
                      <SealCheck size={15} weight="fill" className="shrink-0 text-sky-400" aria-label="Verified rider" />
                    </span>
                    <span className={`block text-[12.5px] ${"text-ink-subtle"}`}>
                      {review.location}, Tamil Nadu
                    </span>
                  </span>
                  <Stars className="hidden lg:flex" />
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};
