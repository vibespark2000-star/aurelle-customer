"use client";
import { ShieldCheck } from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

interface CmsItem {
  _id: string;
  type: string;
  title: string;
  content: string;
  updatedAt?: string;
}

export default function PrivacyPolicyPage() {
  const [policy, setPolicy] = useState<CmsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/cms?type=privacy_policy")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPolicy(data.data[0]);
        }
      })
      .catch((err) => console.error("Error loading Privacy Policy:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-ink font-sans antialiased selection:bg-brand-600 selection:text-white">
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-8">
        <div className="space-y-4 border-b border-hairline pb-8">

          <h1 className="font-sans text-3xl md:text-5xl font-bold tracking-tight text-ink">Privacy Policy</h1>

          <p className="text-xs text-gray-500 font-medium">
            Last Updated: {policy?.updatedAt ? new Date(policy.updatedAt).toLocaleDateString() : "July 2026"} &bull;
            Aurelle Cabs Legal &amp; Compliance Desk
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-gray-500 font-medium">Loading Privacy Policy...</div>
        ) : (
          <div className="bg-white border-2 border-hairline rounded-3xl p-8 md:p-12 shadow-sm space-y-6 leading-relaxed">
            <h2 className="font-sans text-xl font-bold text-ink">
              {policy?.title || "Aurelle Cabs — Rider Privacy Policy"}
            </h2>

            <div className="prose text-xs md:text-sm text-ink-muted whitespace-pre-line space-y-4">
              {policy?.content ||
                `At Aurelle Cabs, we prioritize rider privacy and data protection. We collect minimal personal information (name, phone number, pickup location) exclusively for dispatching cabs and providing customer assistance. We do not sell or share rider personal data with unauthorized third parties. All trip transactions are processed securely.`}
            </div>

            <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-alt p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <ShieldCheck size={24} className="text-brand-600 shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-ink">Questions about your data?</h4>
                  <p className="text-xs text-gray-500">Contact our Compliance &amp; Privacy Officer anytime.</p>
                </div>
              </div>
              <a
                href="mailto:privacy@aurellecabs.in"
                className="bg-brand-600 hover:opacity-90 text-white font-sans text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-sm shrink-0"
              >
                Email Privacy Desk
              </a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
