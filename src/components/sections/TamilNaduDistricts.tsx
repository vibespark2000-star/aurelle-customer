"use client";
import {
  BookOpen,
  Car,
  CheckCircle as CheckCircle2,
  Compass,
  Bank as Landmark,
  MapPin,
  NavigationArrow as Navigation,
  MagnifyingGlass as Search,
  ShieldCheck,
  X,
} from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TN_DISTRICTS_DATA, DistrictInfo, REGIONS_LIST } from "@/data/districts";
import { useBooking } from "@/context/BookingContext";

import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const COVERAGE_POINTS = [
  {
    icon: CheckCircle2,
    title: "38-district hub network",
    body: "Cabs stationed across every district headquarters and major highway junction.",
  },
  {
    icon: Navigation,
    title: "Highway toll optimisation",
    body: "Smooth travel on NH 44, NH 45 (GST Road), NH 83 and NH 183 with automated FASTag.",
  },
  {
    icon: ShieldCheck,
    title: "Verified cabs and drivers",
    body: "Tamil-speaking vetted drivers who know district tourist spots, bypasses and weather alerts.",
  },
];

export const TamilNaduDistricts: React.FC = () => {
  const containerRef = useSilkReveal<HTMLDivElement>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All 38 Districts");
  const [districtsList, setDistrictsList] = useState<DistrictInfo[]>(TN_DISTRICTS_DATA);

  const { setPickupCity, setDropCity, calculateTariff } = useBooking();

  // Live districts from the CMS; falls back to the bundled defaults.
  useEffect(() => {
    apiFetch("/api/districts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setDistrictsList(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const query = searchTerm.trim().toLowerCase();

  const filteredDistricts = districtsList.filter((district) => {
    const matchesSearch =
      !query ||
      district.name.toLowerCase().includes(query) ||
      district.landmarkName?.toLowerCase().includes(query) ||
      district.famousFor?.toLowerCase().includes(query) ||
      (district.popularPlaces || []).some((place: any) => {
        const name = typeof place === "string" ? place : place.name;
        return name?.toLowerCase().includes(query);
      });

    const matchesRegion = selectedRegion === "All 38 Districts" || district.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  /** Pre-fill the trip planner with this district as the destination. */
  const handleBookTaxi = (districtName: string) => {
    setPickupCity("Chennai");
    setDropCity(districtName);
    calculateTariff();
    document.getElementById("booking-widget")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={containerRef} id="tamil-nadu-districts" className="py-12 md:py-16 bg-surface">
      <div className="shell space-y-7">
        <SectionHeading
          title="Every District,"
          titleRest="Every Landmark"
          subtitle="Open a district to read its travel guide and popular places, or book a cab there straight away with transparent per-km billing."
          className="silk-item"
        />

        {/* Filters */}
        <div className="silk-item space-y-5">
          <div className="relative max-w-md mx-auto">
            <label htmlFor="district-search" className="sr-only">
              Search districts and landmarks
            </label>
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none"
            />
            <input
              id="district-search"
              type="search"
              placeholder="Search a district, temple, beach or hill station…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="field pl-11 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {REGIONS_LIST.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                aria-pressed={selectedRegion === region}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold border transition-colors cursor-pointer ${
                  selectedRegion === region
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "bg-white border-hairline text-ink-muted hover:text-brand-600 hover:border-brand-200"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* District grid */}
        {filteredDistricts.length === 0 ? (
          <div className="card text-center max-w-lg mx-auto py-14 px-8">
            <Compass size={28} className="mx-auto text-ink-subtle mb-3" />
            <h3 className="text-[16px] font-bold text-ink mb-1.5">No district matches &ldquo;{searchTerm}&rdquo;</h3>
            <p className="text-[13px] text-ink-muted">
              All 38 districts of Tamil Nadu are covered — try a different spelling.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedRegion("All 38 Districts");
              }}
              className="btn-secondary btn-sm mt-5"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDistricts.map((district) => {
              const slug = district.id || district.name.toLowerCase().replace(/[^a-z0-9]/g, "");
              const places = district.popularPlaces || [];

              return (
                <article key={district.id || district.name} className="card-hover overflow-hidden flex flex-col group">
                  {/* Only the image and title are a link, so the Book button stays valid markup. */}
                  <Link href={`/district/${slug}`} className="block relative h-40 overflow-hidden bg-surface-sunken">
                    <Image
                      src={district.heroImage}
                      alt={district.landmarkName || district.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    <span className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur px-2 py-1 rounded text-[11px] font-semibold text-ink">
                      <MapPin size={10} className="text-brand-600" />
                      {district.region}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{district.name}</h3>
                      {district.landmarkName && (
                        <span className="inline-flex items-center gap-1 text-[12px] text-gray-200 mt-1">
                          <Landmark size={11} className="shrink-0" />
                          <span className="truncate">{district.landmarkName}</span>
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    {places.length > 0 && (
                      <>
                        <span className="text-[11px] font-semibold text-ink-subtle mb-2">Popular places</span>
                        <ul className="flex flex-wrap gap-1.5 mb-4">
                          {places.slice(0, 3).map((place: any, i: number) => (
                            <li
                              key={i}
                              className="text-[11px] bg-surface-sunken text-ink-muted px-2 py-1 rounded font-medium"
                            >
                              {typeof place === "string" ? place : place.name}
                            </li>
                          ))}
                          {places.length > 3 && (
                            <li className="text-[11px] bg-brand-50 text-brand-600 px-2 py-1 rounded font-semibold">
                              +{places.length - 3} more
                            </li>
                          )}
                        </ul>
                      </>
                    )}

                    <div className="flex items-center gap-2 mt-auto pt-3 border-t border-hairline">
                      <Link href={`/district/${slug}`} className="btn-secondary btn-sm flex-1">
                        <BookOpen size={13} />
                        Guide
                      </Link>
                      <button
                        onClick={() => handleBookTaxi(district.name)}
                        className="btn-primary btn-sm flex-1"
                        title={`Book a cab to ${district.name}`}
                      >
                        <Car size={13} />
                        Book
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Coverage highlights */}
        <div className="silk-item grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-hairline">
          {COVERAGE_POINTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center">
              <span className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 inline-flex items-center justify-center mb-3">
                <Icon size={21} weight="duotone" />
              </span>
              <h3 className="text-[15px] font-bold text-ink mb-1.5">{title}</h3>
              <p className="text-[13px] text-ink-muted leading-relaxed max-w-xs mx-auto">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
