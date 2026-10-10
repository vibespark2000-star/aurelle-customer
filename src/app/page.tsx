"use client";

import { Car } from "@phosphor-icons/react";
import React from "react";

import { LenisProvider } from "@/components/providers/LenisProvider";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TamilNaduDistricts } from "@/components/sections/TamilNaduDistricts";
import { FleetShowcase } from "@/components/sections/FleetShowcase";
import { OurServices } from "@/components/sections/OurServices";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { PopularRoutes } from "@/components/sections/PopularRoutes";
import { BlogShowcase } from "@/components/sections/BlogShowcase";
import { SafetyStandards } from "@/components/sections/SafetyStandards";
import { BookingWorkflow } from "@/components/sections/BookingWorkflow";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { ServiceableCities } from "@/components/sections/ServiceableCities";
import { CtaBand } from "@/components/sections/CtaBand";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/sections/Footer";


export default function Home() {
  return (
    <LenisProvider>
      <div className="relative min-h-screen bg-surface text-ink">
        {/* Persistent booking badge — bottom right. */}
        <a
          href="#booking-widget"
          className="fixed bottom-6 right-6 z-40 flex h-[72px] w-[72px] flex-col items-center justify-center gap-0.5
            rounded-full border-2 border-brand-600 bg-surface text-brand-600 shadow-lift
            transition-transform duration-200 hover:scale-105"
          title="Book a cab"
        >
          <Car size={20} weight="fill" />
          <span className="text-[9px] font-bold uppercase leading-tight tracking-[0.06em]">Book a Cab</span>
        </a>

        <Navbar />
        <Hero />
        <TamilNaduDistricts />
        <FleetShowcase />
        <OurServices />
        <WhyChooseUs />
        <PopularRoutes />
        <ServiceableCities />
        <CtaBand />
        <BlogShowcase />
        <SafetyStandards />
        <BookingWorkflow />
        <Testimonials />
        <TrustMarquee />
        <FAQSection />
        <Footer />
      </div>
    </LenisProvider>
  );
}
