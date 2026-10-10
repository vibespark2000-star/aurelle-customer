"use client";

import { Quotes as Quote, Star } from "@phosphor-icons/react";
import React from "react";

import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Review {
  quote: string;
  author: string;
  location: string;
  initials: string;
}

const REVIEWS: Review[] = [
  {
    quote:
      "Booked a one-way drop from Chennai to Madurai. Local agents wanted return charges for 920 km, but Aurelle charged strictly for 460 km — saved over ₹5,200. The driver was courteous and the sedan was spotless.",
    author: "Karthik Subramanian",
    location: "Chennai",
    initials: "KS",
  },
  {
    quote:
      "We reserved an Innova Crysta for a family trip from Coimbatore to Ooty. Strong hill-climb performance, a patient driver, and no hidden toll surcharges at the end of the trip.",
    author: "Dr. Ananya Sundaram",
    location: "Coimbatore",
    initials: "AS",
  },
  {
    quote:
      "I travel between Trichy, Salem and Thanjavur regularly for industrial visits. Instant invoices, verified chauffeurs and support that actually answers at 2am. It has become our default.",
    author: "S. Rajesh Kumar",
    location: "Tiruchirappalli",
    initials: "RK",
  },
];

const ReviewCard: React.FC<Review> = ({ quote, author, location, initials }) => (
  <figure className="silk-item card p-6 flex flex-col">
    <Quote size={26} weight="fill" className="text-brand-200 shrink-0 mb-4" aria-hidden="true" />

    <div className="flex gap-0.5 mb-3" role="img" aria-label="Rated 5 out of 5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={15} weight="fill" className="text-brand-500" />
      ))}
    </div>

    <blockquote className="text-[14px] text-ink-muted leading-relaxed flex-1">{quote}</blockquote>

    <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-hairline">
      <span className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[12px] font-bold shrink-0">
        {initials}
      </span>
      <span>
        <span className="block text-[14px] font-semibold text-ink">{author}</span>
        <span className="block text-[12px] text-ink-subtle">{location}, Tamil Nadu</span>
      </span>
    </figcaption>
  </figure>
);

export const Testimonials: React.FC = () => {
  const revealRef = useSilkReveal<HTMLDivElement>();

  return (
    <section ref={revealRef} id="testimonials" className="py-12 md:py-16 bg-surface">
      <div className="shell">
        <SectionHeading
          title="Your Satisfaction,"
          titleRest="Our Success"
          subtitle="Rated 4.9 out of 5 across more than 25,000 verified journeys in Tamil Nadu."
          className="silk-item mb-8"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.author} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
};
