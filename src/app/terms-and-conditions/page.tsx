"use client";
import { ArrowLeft, FileText, ShieldCheck } from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface CmsItem {
  _id: string;
  type: string;
  title: string;
  content: string;
  updatedAt?: string;
}

export default function TermsAndConditionsPage() {
  const [terms, setTerms] = useState<CmsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/cms?type=terms_conditions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setTerms(data.data[0]);
        }
      })
      .catch((err) => console.error("Error loading Terms & Conditions:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-ink font-sans antialiased selection:bg-brand-600 selection:text-white pb-20">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-hairline px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={16} /> Return to Homepage
          </Link>
          <span className="font-sans font-bold text-sm text-ink">
            AURELLE <span className="text-brand-600">WHITE CABS</span>
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 pt-12 space-y-8">
        <div className="space-y-4 border-b border-hairline pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-600/40 shadow-sm">
            <FileText size={14} className="text-brand-600" />
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-brand-700">
              Rider Agreement &amp; Service Rules
            </span>
          </div>

          <h1 className="font-sans text-3xl md:text-5xl font-bold tracking-tight text-ink">Terms &amp; Conditions</h1>

          <p className="text-xs text-gray-500 font-medium">
            Last Updated: {terms?.updatedAt ? new Date(terms.updatedAt).toLocaleDateString() : "July 2026"} &bull;
            Aurelle Cabs Legal &amp; Passenger Guidelines
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-gray-500 font-medium">Loading Terms &amp; Conditions...</div>
        ) : (
          <div className="bg-white border-2 border-hairline rounded-3xl p-8 md:p-12 shadow-sm space-y-6 leading-relaxed">
            <h2 className="font-sans text-xl font-bold text-ink">
              {terms?.title || "Aurelle Cabs — Terms & Conditions of Service"}
            </h2>

            <div className="prose text-xs md:text-sm text-ink-muted whitespace-pre-line space-y-4">
              {terms?.content ||
                `1. Booking Acceptance: All bookings are subject to driver availability and dispatch confirmation.
2. Passenger Conduct: Riders are requested to maintain courteous decorum inside cabs. Smoking and contraband substances are strictly prohibited inside all Aurelle cabs.
3. Cancellation & Refunds: Cancellations made 2 hours prior to scheduled pickup time qualify for 100% full refund.`}
            </div>

            <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-alt p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <ShieldCheck size={24} className="text-brand-600 shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-ink">Need trip assistance or clarification?</h4>
                  <p className="text-xs text-gray-500">Our customer support is available 24/7.</p>
                </div>
              </div>
              <a
                href="https://wa.me/918610201546"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-600 hover:bg-brand-700 text-white font-sans text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
              >
                Contact Support Desk
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
