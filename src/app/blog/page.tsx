"use client";
import {
  ArrowRight,
  BookOpen,
  CaretRight as ChevronRight,
  Clock,
  Compass,
  MagnifyingGlass as Search,
  User,
} from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useEffect, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { LenisProvider } from "@/components/providers/LenisProvider";

import { BlogPostItem } from "@/data/blogs";

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Outstation Taxi", "Travel Guide", "Temple Tours", "Hill Stations"];

  useEffect(() => {
    fetchBlogs();
  }, [activeCategory]);

  const fetchBlogs = (search?: string) => {
    setLoading(true);
    let url = "/api/blogs";
    const params = new URLSearchParams();
    if (activeCategory !== "All") params.append("category", activeCategory);
    if (search || searchQuery) params.append("search", search || searchQuery);

    if (params.toString()) url += `?${params.toString()}`;

    apiFetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setBlogs(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs(searchQuery);
  };

  const featuredBlog = blogs[0];
  const regularBlogs = blogs.slice(1);

  return (
    <LenisProvider>
      <div className="min-h-screen bg-white text-ink">
        <Navbar />

        {/* Header Banner */}
        <section className="relative pt-32 pb-20 bg-white border-b border-hairline/60 text-ink overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-6 text-center">

            <h1 className="font-sans text-4xl md:text-6xl font-bold tracking-tight text-ink">
              Tamil Nadu <span className="text-brand-600">Travel Insights</span> &amp; Guides
            </h1>

            <p className="font-sans text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover curated temple tour circuits, outstation cab pricing rules, hill station driving tips, and Tamil
              Nadu travel guides to plan your perfect chauffeur journey.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-4">
              <div className="relative flex items-center shadow-lg rounded-2xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search routes, temple guides, taxi rates..."
                  className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-gray-300 text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600 text-xs md:text-sm font-medium"
                />
                <Search size={18} className="absolute left-4 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-brand-600 hover:opacity-90 text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-md"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Category Navigation Bar */}
        <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-hairline/60 shadow-sm py-4">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-brand-600 text-white shadow-md"
                    : "bg-gray-100 text-ink-muted hover:bg-brand-50 hover:text-brand-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-10">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-gray-500">Loading travel articles...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 space-y-4 max-w-md mx-auto">
              <BookOpen size={48} className="mx-auto text-brand-600/40" />
              <h3 className="font-sans text-xl font-bold text-ink">No Articles Found</h3>
              <p className="text-xs text-gray-500">
                We couldn&apos;t find any blog posts matching your search query or category filter.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                  fetchBlogs("");
                }}
                className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured Hero Article */}
              {featuredBlog && activeCategory === "All" && !searchQuery && (
                <div className="bg-white rounded-3xl border-2 border-brand-600/30 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 relative h-72 lg:h-[450px] w-full">
                    <SmartImage
                      src={featuredBlog.coverImage}
                      alt={featuredBlog.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute top-6 left-6 bg-brand-600 text-white px-3.5 py-1 rounded-full text-[11px] uppercase font-bold tracking-widest shadow-md">
                      Featured SEO Guide
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-8 lg:p-10 space-y-6">
                    <div className="flex items-center gap-3 text-xs text-brand-700">
                      <span className="bg-brand-50 px-3 py-1 rounded-full border border-brand-600/30 font-bold uppercase tracking-wider text-[11px]">
                        {featuredBlog.category}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock size={12} /> {featuredBlog.readTime}
                      </span>
                    </div>

                    <h2 className="font-sans text-2xl md:text-3xl font-bold text-ink leading-snug hover:text-brand-600 transition-colors">
                      <Link href={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                    </h2>

                    <p className="font-sans text-xs md:text-sm text-ink-muted leading-relaxed line-clamp-4">
                      {featuredBlog.excerpt}
                    </p>

                    <div className="pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <User size={14} className="text-brand-600" />
                        <span>{featuredBlog.author}</span>
                      </div>

                      <Link
                        href={`/blog/${featuredBlog.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:opacity-90 text-white text-xs font-bold rounded-full transition-all shadow-md"
                      >
                        <span>Read Article</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Articles */}
              <div className="space-y-6">
                <h3 className="font-sans text-2xl font-bold text-ink flex items-center gap-2">
                  <Compass className="text-brand-600" size={20} />
                  All Tamil Nadu Guides &amp; Articles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(activeCategory === "All" && !searchQuery ? regularBlogs : blogs).map((blog) => (
                    <article
                      key={blog.id}
                      className="group bg-white rounded-2xl border border-hairline/60 hover:border-brand-600 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden"
                    >
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                        <SmartImage
                          src={blog.coverImage}
                          alt={blog.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-brand-700 uppercase tracking-wider shadow-sm border border-brand-600/30">
                          {blog.category}
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1">
                          <Clock size={11} className="text-brand-400" />
                          <span>{blog.readTime}</span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[11px] text-ink-subtle">
                            <span>{blog.author}</span>
                            <span>&bull;</span>
                            <span>{blog.views || 80}+ reads</span>
                          </div>

                          <h4 className="font-sans text-lg font-bold text-ink group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                          </h4>

                          <p className="font-sans text-xs text-ink-muted leading-relaxed line-clamp-3">
                            {blog.excerpt}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <Link
                            href={`/blog/${blog.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider"
                          >
                            <span>Read Full Post</span>
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </LenisProvider>
  );
}
