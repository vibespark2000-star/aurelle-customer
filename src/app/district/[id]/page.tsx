"use client";
import {
  ArrowLeft,
  Car,
  CheckCircle as CheckCircle2,
  Compass,
  Bank as Landmark,
  MapPin,
  PhoneCall,
  ShareNetwork as Share2,
  ShieldCheck,
  Sparkle as Sparkles,
} from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { TN_DISTRICTS_DATA } from "@/data/districts";
import { useBooking } from "@/context/BookingContext";

export default function DistrictBlogPage() {
  const params = useParams();
  const router = useRouter();
  const districtId = (params?.id as string) || "tiruvannamalai";

  const [district, setDistrict] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: number]: number }>({});
  const { setPickupCity, setDropCity } = useBooking();

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/districts/${districtId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setDistrict(data.data);
        } else {
          // Fallback to static data matching
          const match = TN_DISTRICTS_DATA.find((d) => d.id.toLowerCase() === districtId.toLowerCase());
          setDistrict(match || TN_DISTRICTS_DATA[0]);
        }
      })
      .catch(() => {
        const match = TN_DISTRICTS_DATA.find((d) => d.id.toLowerCase() === districtId.toLowerCase());
        setDistrict(match || TN_DISTRICTS_DATA[0]);
      })
      .finally(() => setLoading(false));
  }, [districtId]);

  const handleBookCab = (districtName: string, spotName?: string) => {
    setPickupCity("Chennai");
    setDropCity(spotName ? `${spotName}, ${districtName}` : districtName);
    router.push("/#booking-widget");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-sans text-lg font-semibold text-ink">Loading District Travel Blog...</p>
        </div>
      </div>
    );
  }

  if (!district) return null;

  const seoKeywordsList: string[] =
    district.seoKeywords && district.seoKeywords.length > 0
      ? district.seoKeywords
      : [
          `${district.name} outstation cab`,
          `${district.name} drop taxi`,
          `${district.landmarkName} travel guide`,
          `best places to visit in ${district.name}`,
          `Chennai to ${district.name} taxi fare`,
        ];

  return (
    <div className="min-h-screen bg-white text-ink font-sans antialiased selection:bg-brand-600 selection:text-white">
      {/* Dynamic SEO Meta & JSON-LD for Google Search ranking crawlers */}
      <head>
        <title>{`${district.name} Travel Blog & Popular Places Guide | Aurelle Cabs Outstation Taxi`}</title>
        <meta
          name="description"
          content={`Explore ${district.name} tourist spots, ${district.landmarkName}, and popular places with complete blog details. Book pristine white outstation cabs with transparent per-km rates.`}
        />
        <meta name="keywords" content={seoKeywordsList.join(", ")} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TouristDestination",
              name: `${district.name} District`,
              description: district.famousFor || district.tagline,
              keywords: seoKeywordsList.join(", "),
              image: district.heroImage,
              touristType: ["Outstation Travel", "Pilgrimage", "Heritage"],
            }),
          }}
        />
      </head>

      {/* Top Floating Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-hairline px-4 md:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/#tamil-nadu-districts"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>All 38 Districts</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full border border-brand-600/40 font-semibold hidden sm:inline-block">
              Official Travel Blog
            </span>
            <button
              onClick={() => handleBookCab(district.name)}
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Car size={14} />
              <span>Book Taxi to {district.name}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative h-[480px] md:h-[560px] w-full overflow-hidden bg-slate-950">
        <Image
          src={district.heroImage}
          alt={district.landmarkName || district.name}
          fill
          priority
          unoptimized
          className="object-cover opacity-70 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-12 z-10">
          {/* Region Tag */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-brand-600 text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-md">
              <MapPin size={12} />
              {district.region}
            </span>
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-brand-200 border border-brand-300/30 px-3 py-1 rounded-full text-[11px] font-semibold">
              <ShieldCheck size={12} /> Verified Outstation Hub
            </span>
          </div>

          {/* Title & Tagline */}
          <h1 className="font-sans text-3xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-3">
            {district.name} <span className="text-brand-600 italic">District Blog</span>
          </h1>

          <p className="font-sans text-sm md:text-xl text-slate-200 max-w-3xl leading-relaxed mb-6">
            {district.tagline || `Complete Travel Guide, Iconic Landmarks & White Taxi Booking for ${district.name}.`}
          </p>

          {/* Key Highlight Chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="bg-black/50 backdrop-blur-md border border-brand-600/50 text-brand-300 px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5">
              <Landmark size={14} className="text-brand-600" />
              <span>
                Iconic Landmark: <strong>{district.landmarkName}</strong>
              </span>
            </div>
            <div className="bg-black/50 backdrop-blur-md border border-white/20 text-slate-200 px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
              <Compass size={14} className="text-brand-600" />
              <span>{district.popularPlaces?.length || 0} Popular Spots Featured</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Full Editorial Blog Content (8 Cols) */}
        <article className="lg:col-span-8 space-y-8">
          {/* Section 1: Overview & Cultural Heritage */}
          <div className="bg-white border border-hairline rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-600/40 text-[11px] font-bold uppercase tracking-wider text-brand-700">
              <Sparkles size={12} className="text-brand-600" />
              <span>Heritage &amp; Travel Overview</span>
            </div>

            <h2 className="font-sans text-2xl md:text-4xl font-bold text-ink">
              Exploring {district.name}: What Makes it Famous
            </h2>

            <p className="text-sm md:text-base text-ink-muted leading-relaxed font-sans">
              {district.famousFor ||
                `${district.name} is one of the most culturally significant districts in Tamil Nadu. Known for its historical grandeur, sacred temples, natural landscapes, and vibrant local cuisine.`}
            </p>

            {/* Quick Travel Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-hairline/60">
              <div className="bg-surface-sunken p-3 rounded-2xl border border-hairline">
                <span className="text-[11px] uppercase font-bold text-brand-700 block mb-1">Best Route</span>
                <span className="text-xs font-semibold text-ink">NH 44 / NH 45 GST Road</span>
              </div>
              <div className="bg-surface-sunken p-3 rounded-2xl border border-hairline">
                <span className="text-[11px] uppercase font-bold text-brand-700 block mb-1">Taxi Fare</span>
                <span className="text-xs font-semibold text-ink">From ₹14/km (One-Way Only)</span>
              </div>
              <div className="bg-surface-sunken p-3 rounded-2xl border border-hairline">
                <span className="text-[11px] uppercase font-bold text-brand-700 block mb-1">Pristine Cabs</span>
                <span className="text-xs font-semibold text-ink">White Sedan &amp; SUV Fleet</span>
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Popular Places Blog Articles */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-brand-600/30 pb-4">
              <div>
                <h2 className="font-sans text-2xl md:text-3xl font-bold text-ink flex items-center gap-2">
                  <Compass className="text-brand-600" size={28} />
                  Top Tourist Destinations &amp; Popular Places
                </h2>
                <p className="text-xs text-ink-subtle">
                  Complete blog guide with photos, details, and direct taxi pickup points.
                </p>
              </div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-600/40 hidden sm:inline-block">
                {district.popularPlaces?.length || 0} Places Guide
              </span>
            </div>

            {/* List of Popular Places as Rich Editorial Blog Cards */}
            {(district.popularPlaces || []).map((place: any, index: number) => {
              const p = typeof place === "string" ? { name: place, description: "", images: [], keywords: [] } : place;
              const hasImages = p.images && p.images.filter(Boolean).length > 0;

              return (
                <section
                  key={index}
                  id={`place-${index}`}
                  className="bg-white border border-hairline hover:border-brand-600 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 space-y-0"
                >
                  {/* Photo Gallery / Header Image */}
                  {hasImages ? (
                    <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-900 group">
                      <Image
                        src={p.images[activeImageIndex[index] || 0] || p.images[0]}
                        alt={p.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Number Badge */}
                      <span className="absolute top-4 left-4 bg-brand-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                        Spot #{index + 1}
                      </span>

                      {/* Multi-Image Thumbnails */}
                      {p.images.filter(Boolean).length > 1 && (
                        <div className="absolute bottom-4 right-4 flex gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
                          {p.images.filter(Boolean).map((img: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => setActiveImageIndex((prev) => ({ ...prev, [index]: i }))}
                              className={`w-10 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                                (activeImageIndex[index] || 0) === i
                                  ? "border-brand-600 scale-110"
                                  : "border-transparent opacity-70 hover:opacity-100"
                              }`}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-2 bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700" />
                  )}

                  {/* Blog Card Content */}
                  <div className="p-6 md:p-8 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline/60 pb-3">
                      <div>
                        <span className="text-[11px] uppercase tracking-widest font-bold text-brand-700">
                          Popular Place in {district.name}
                        </span>
                        <h3 className="font-sans text-xl md:text-2xl font-bold text-ink">{p.name}</h3>
                      </div>

                      <button
                        onClick={() => handleBookCab(district.name, p.name)}
                        className="self-start sm:self-auto bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white border border-brand-600/50 font-sans text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Car size={13} />
                        <span>Taxi to {p.name}</span>
                      </button>
                    </div>

                    {/* Blog Description Paragraphs */}
                    {p.description ? (
                      <div className="prose prose-stone text-xs md:text-sm text-ink-muted leading-relaxed space-y-3">
                        {p.description.split("\n\n").map((para: string, i: number) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-ink-subtle italic">
                        {p.name} is a premier attraction in {district.name}. Book an Aurelle outstation cab for a
                        hassle-free visit directly from your doorstep.
                      </p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </article>

        {/* Right Column: Sticky Cab Booking & Quick Specs Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Booking Widget Card */}
          <div className="bg-white border-2 border-brand-600 rounded-3xl p-6 shadow-xl sticky top-24 space-y-5">
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-600/40 inline-block">
                Instant Outstation Booking
              </span>
              <h3 className="font-sans text-xl font-bold text-ink">Book Cab to {district.name}</h3>
              <p className="text-xs text-ink-subtle">Verified Pristine White Cabs &bull; Zero Return Charges</p>
            </div>

            {/* Price Preview */}
            <div className="bg-surface-sunken border border-hairline p-4 rounded-2xl space-y-2 text-center">
              <span className="text-[11px] text-brand-700 uppercase font-bold block">One-Way Drop Fare</span>
              <div className="text-2xl font-sans font-bold text-ink">
                From <span className="text-brand-600">₹14</span>{" "}
                <span className="text-xs font-sans text-slate-500">/ km</span>
              </div>
              <p className="text-[11px] text-ink-muted">Includes Driver Batta &bull; Toll Extra</p>
            </div>

            {/* Quick Action Buttons */}
            <button
              onClick={() => handleBookCab(district.name)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-sans text-xs uppercase tracking-wider font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Car size={16} />
              <span>Book Taxi Now</span>
            </button>

            <a
              href="tel:+919876543210"
              className="w-full bg-brand-50 hover:bg-brand-50 text-brand-700 border border-brand-600/50 font-sans text-xs uppercase tracking-wider font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall size={14} />
              <span>Call Dispatch Desk</span>
            </a>

            {/* Value Props */}
            <div className="pt-4 border-t border-hairline space-y-2.5 text-xs text-ink-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-brand-600 shrink-0" />
                <span>Pick up from any location in Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-brand-600 shrink-0" />
                <span>Tamil speaking experienced drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-brand-600 shrink-0" />
                <span>Pristine White Dzire, Etios, Innova</span>
              </div>
            </div>

            {/* Share Page */}
            <div className="pt-3 border-t border-hairline flex justify-between items-center text-xs text-brand-700">
              <span className="font-semibold">Share {district.name} Guide:</span>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `${district.name} Travel Blog`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Blog link copied to clipboard!");
                  }
                }}
                className="p-2 hover:bg-brand-50 rounded-xl transition-colors"
                title="Share Blog"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer CTA Banner */}
      <footer className="bg-surface-alt text-ink-muted py-12 border-t border-hairline">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200 text-xs font-semibold">
            <Compass size={14} />
            <span>38 Districts Intra-State Network</span>
          </div>
          <h3 className="font-sans text-2xl md:text-4xl font-bold text-ink">Ready to Explore {district.name}?</h3>
          <p className="text-xs md:text-sm text-ink-muted max-w-xl mx-auto">
            Book pristine white outstation cabs with transparent rates and dedicated regional drivers.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleBookCab(district.name)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Book Cab to {district.name}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
