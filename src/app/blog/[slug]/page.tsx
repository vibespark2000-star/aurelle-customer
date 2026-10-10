"use client";
import {
  ArrowLeft,
  Car,
  CheckCircle as CheckCircle2,
  CaretRight as ChevronRight,
  Clock,
  Eye,
  PhoneCall,
  ShareNetwork as Share2,
  Tag,
  User,
} from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useBooking } from "@/context/BookingContext";
import { LenisProvider } from "@/components/providers/LenisProvider";

import { BlogPostItem } from "@/data/blogs";

function BlogDetailContent({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<BlogPostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { setBookingDrawerOpen, setSelectedVehicleId } = useBooking();

  useEffect(() => {
    apiFetch(`/api/blogs/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setBlog(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-500">Loading Article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center bg-white p-8 rounded-3xl border border-gray-200 shadow-md max-w-md space-y-4">
          <h2 className="font-sans text-2xl font-bold text-gray-900">Blog Article Not Found</h2>
          <p className="text-xs text-gray-500">The requested travel guide or blog article could not be located.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
          >
            <ArrowLeft size={14} /> Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Schema.org JSON-LD for Google Search SEO Indexing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    image: blog.coverImage,
    author: {
      "@type": "Organization",
      name: blog.author || "Aurelle Outstation Cabs",
    },
    publisher: {
      "@type": "Organization",
      name: "Aurelle Outstation Cabs Tamil Nadu",
      logo: {
        "@type": "ImageObject",
        url: "https://aurellecabs.com/logo.png",
      },
    },
    datePublished: blog.createdAt || new Date().toISOString(),
    keywords: blog.seoKeywords?.join(", ") || "outstation taxi, tamil nadu cab rates, outstation sedan",
  };

  return (
    <>
      {/* Inject Structured Data for Google */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="min-h-screen bg-white text-ink">
        <Navbar />

        {/* Hero Section */}
        <header className="relative pt-32 pb-16 bg-white border-b border-hairline/60 text-ink overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-bold uppercase tracking-wider hover:underline"
            >
              <ArrowLeft size={14} /> Back to All Articles
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-[11px] uppercase font-bold tracking-widest shadow-sm">
                {blog.category}
              </span>
              <span className="text-gray-600 text-xs flex items-center gap-1">
                <Clock size={13} className="text-brand-600" /> {blog.readTime}
              </span>
              <span className="text-gray-600 text-xs flex items-center gap-1">
                <Eye size={13} className="text-gray-400" /> {blog.views || 150}+ views
              </span>
            </div>

            <h1 className="font-sans text-3xl md:text-5xl font-bold tracking-tight text-ink leading-tight">
              {blog.title}
            </h1>

            <p className="font-sans text-sm md:text-base text-gray-700 leading-relaxed border-l-4 border-brand-600 bg-brand-50/60 p-4 rounded-r-2xl italic">
              {blog.excerpt}
            </p>

            <div className="pt-4 flex items-center justify-between border-t border-gray-200 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <User size={14} className="text-brand-600" />
                <span className="text-ink font-bold">{blog.author}</span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 bg-white hover:bg-brand-50 border border-gray-300 hover:border-brand-600 px-3.5 py-2 rounded-xl text-ink font-bold transition-all shadow-sm cursor-pointer"
              >
                <Share2 size={13} className="text-brand-600" />
                <span>{copied ? "Link Copied!" : "Share Article"}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image src={blog.coverImage} alt={blog.title} fill priority unoptimized className="object-cover" />
          </div>
        </div>

        {/* Main Content & Sidebar CTA Grid */}
        <main className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article Body */}
          <div className="lg:col-span-8 space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-hairline/60 shadow-sm">
            {/* HTML Article Content */}
            <div
              className="prose prose-amber max-w-none text-xs md:text-sm text-ink-muted leading-relaxed space-y-6 [&_h2]:font-sans [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:font-sans [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-brand-600 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags list */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="pt-8 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <Tag size={14} className="text-brand-600" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">SEO Keywords:</span>
                {blog.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-ink-muted text-[11px] font-medium px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar: Cab Booking Widget */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 bg-ink text-white p-6 rounded-3xl border border-brand-600/40 shadow-xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/20 text-brand-600 border border-brand-600/30 text-[11px] font-bold uppercase tracking-wider">
                <Car size={12} /> Direct Booking CTA
              </div>

              <h3 className="font-sans text-xl font-bold leading-snug">Need an Outstation Cab for this Trip?</h3>

              <p className="text-xs text-gray-300 leading-relaxed">
                Book 100% pristine white sedans and SUVs with transparent per-km rates &amp; zero return fees.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-brand-300 font-medium">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>White Sedan from ₹14/km</span>
                </div>
                <div className="flex items-center gap-2 text-brand-300 font-medium">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Verified Highway Chauffeur</span>
                </div>
                <div className="flex items-center gap-2 text-brand-300 font-medium">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Instant Booking Confirmation</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedVehicleId("sedan-tier");
                  setBookingDrawerOpen(true);
                }}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-xl font-sans text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Book White Cab Now</span>
                <ChevronRight size={15} />
              </button>

              <div className="pt-4 border-t border-white/10 text-center">
                <a
                  href="tel:+918610201546"
                  className="inline-flex items-center gap-2 text-xs text-gray-300 hover:text-white font-medium"
                >
                  <PhoneCall size={14} className="text-emerald-400" />
                  <span>Call Chauffeur Desk: +91 8610201546</span>
                </a>
              </div>
            </div>
          </aside>
        </main>

        <Footer />
      </article>
    </>
  );
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  return (
    <LenisProvider>
      <BlogDetailContent slug={params.slug} />
    </LenisProvider>
  );
}
