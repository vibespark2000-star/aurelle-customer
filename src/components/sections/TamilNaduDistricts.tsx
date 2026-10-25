"use client";
import {
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  Compass,
  Bank as Landmark,
  MapPin,
  MagnifyingGlass as Search,
  X,
} from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useState, useEffect } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import Link from "next/link";
import { TN_DISTRICTS_DATA, DistrictInfo, REGIONS_LIST } from "@/data/districts";
import { useBooking } from "@/context/BookingContext";

import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ALL = "All 38 Districts";
/** Cards shown before "Show all" when no filter is applied. */
const PREVIEW_COUNT = 8;

type Place = string | { name?: string };
const placeName = (place: Place) => (typeof place === "string" ? place : place.name ?? "");

export const TamilNaduDistricts: React.FC = () => {
  const containerRef = useSilkReveal<HTMLDivElement>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(ALL);
  const [showAll, setShowAll] = useState(false);
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
  const filtering = query !== "" || selectedRegion !== ALL;

  const filteredDistricts = districtsList.filter((district) => {
    const matchesSearch =
      !query ||
      district.name.toLowerCase().includes(query) ||
      district.landmarkName?.toLowerCase().includes(query) ||
      district.famousFor?.toLowerCase().includes(query) ||
      ((district.popularPlaces || []) as Place[]).some((place) => placeName(place).toLowerCase().includes(query));

    const matchesRegion = selectedRegion === ALL || district.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const visible = filtering || showAll ? filteredDistricts : filteredDistricts.slice(0, PREVIEW_COUNT);

  /** Pre-fill the trip planner with this district as the destination. */
  const handleBookTaxi = (districtName: string) => {
    setPickupCity("Chennai");
    setDropCity(districtName);
    calculateTariff();
    document.getElementById("booking-widget")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={containerRef} id="tamil-nadu-districts" className="bg-white py-12 md:py-16">
      <div className="shell space-y-8">
        <SectionHeading
          title="Every district."
          titleRest="Every landmark."
          subtitle="Open a district for its travel guide and must-see places, or book a cab there straight away."
          className="silk-item"
        />

        {/* Filters */}
        <div className="silk-item flex flex-col items-center gap-4">
          <div className="relative w-full max-w-xl">
            <label htmlFor="district-search" className="sr-only">
              Search districts and landmarks
            </label>
            <Search size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-subtle" />
            <input
              id="district-search"
              type="search"
              placeholder="Search a district, temple, beach or hill station…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 w-full rounded-full border border-hairline-strong bg-white pl-12 pr-12 text-[15px] font-medium text-ink shadow-sm outline-none transition-all placeholder:font-normal placeholder:text-ink-subtle focus:border-brand-500 focus:shadow-[0_0_0_4px_rgba(191,1,35,0.12)]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface-sunken text-ink-muted transition-colors hover:text-ink"
              >
                <X size={13} weight="bold" />
              </button>
            )}
          </div>

          <div className="no-scrollbar -mx-5 flex max-w-full gap-2 overflow-x-auto px-5">
            {REGIONS_LIST.map((region) => {
              const active = selectedRegion === region;
              return (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  aria-pressed={active}
                  className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 ${
                    active
                      ? "bg-brand-600 text-white shadow-md"
                      : "border border-hairline bg-white text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>

        {/* District grid */}
        {filteredDistricts.length === 0 ? (
          <div className="card mx-auto max-w-lg px-8 py-14 text-center">
            <Compass size={30} className="mx-auto mb-3 text-ink-subtle" />
            <h3 className="mb-1.5 text-[16px] font-bold text-ink">No district matches &ldquo;{searchTerm}&rdquo;</h3>
            <p className="text-[13px] text-ink-muted">All 38 districts of Tamil Nadu are covered — try a different spelling.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedRegion(ALL);
              }}
              className="btn-secondary btn-sm mt-5"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((district) => {
              const slug = district.id || district.name.toLowerCase().replace(/[^a-z0-9]/g, "");
              const places = (district.popularPlaces || []) as Place[];

              return (
                <article
                  key={district.id || district.name}
                  className="group relative h-[300px] overflow-hidden rounded-[1.75rem] bg-night-900"
                >
                  <SmartImage fallbackLabel={district.name}
                    src={district.heroImage}
                    alt={district.landmarkName || district.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/40 to-transparent" />

                  <span className="glass-dark absolute left-4 top-4 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white">
                    <MapPin size={11} weight="fill" className="text-brand-400" />
                    {district.region}
                  </span>

                  <Link
                    href={`/district/${slug}`}
                    aria-label={`${district.name} travel guide`}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-brand-600 group-hover:text-white"
                  >
                    <ArrowUpRight size={16} weight="bold" />
                  </Link>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-white">
                      <Link href={`/district/${slug}`}>{district.name}</Link>
                    </h3>
                    {district.landmarkName && (
                      <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-white/75">
                        <Landmark size={12} className="shrink-0" />
                        <span className="truncate">{district.landmarkName}</span>
                      </p>
                    )}

                    {/* Places + Book reveal on hover (always shown on touch, where there's no hover). */}
                    <div className="grid grid-rows-[1fr] transition-all duration-500 [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-focus-within:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        {places.length > 0 && (
                          <ul className="mt-3 flex flex-wrap gap-1.5">
                            {places.slice(0, 3).map((place, i) => (
                              <li key={i} className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                                {placeName(place)}
                              </li>
                            ))}
                          </ul>
                        )}
                        <button
                          onClick={() => handleBookTaxi(district.name)}
                          className="btn-primary btn-sm mt-4 w-full"
                          title={`Book a cab to ${district.name}`}
                        >
                          Book a cab to {district.name}
                          <ArrowRight size={13} weight="bold" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!filtering && filteredDistricts.length > PREVIEW_COUNT && (
          <div className="flex justify-center">
            <button onClick={() => setShowAll((v) => !v)} className="btn-secondary btn-lg group" aria-expanded={showAll}>
              {showAll ? "Show fewer districts" : `Show all ${filteredDistricts.length} districts`}
              <CaretDown size={15} weight="bold" className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
