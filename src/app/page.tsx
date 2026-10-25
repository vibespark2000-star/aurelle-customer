"use client";

import React from "react";

import { LenisProvider } from "@/components/providers/LenisProvider";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { FleetShowcase } from "@/components/sections/FleetShowcase";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { PopularRoutes } from "@/components/sections/PopularRoutes";
import { OurServices } from "@/components/sections/OurServices";
import { TamilNaduDistricts } from "@/components/sections/TamilNaduDistricts";
import { BookingWorkflow } from "@/components/sections/BookingWorkflow";
import { SafetyStandards } from "@/components/sections/SafetyStandards";
import { ServiceableCities } from "@/components/sections/ServiceableCities";
import { CtaBand } from "@/components/sections/CtaBand";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogShowcase } from "@/components/sections/BlogShowcase";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/sections/Footer";
import { QuickActions } from "@/components/ui/QuickActions";

/*
 * Section order follows the decision path: book (hero) → what you ride →
 * why it's cheaper → where people go → extras → trust → questions.
 */
export default function Home() {
  return (
    <LenisProvider>
      <div className="relative min-h-screen bg-white text-ink">
        <Navbar />
        <Hero />
        <TrustMarquee />
        <FleetShowcase />
        <WhyChooseUs />
        <PopularRoutes />
        <OurServices />
        <TamilNaduDistricts />
        <BookingWorkflow />
        <SafetyStandards />
        <ServiceableCities />
        <CtaBand />
        <Testimonials />
        <BlogShowcase />
        <FAQSection />
        <Footer />
        <QuickActions />
      </div>
    </LenisProvider>
  );
}
