"use client";
import { ArrowRight, Clock, Eye, Tag, User } from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlogPostItem } from "@/data/blogs";

export const BlogShowcase: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setBlogs(data.data.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && blogs.length === 0) return null;

  return (
    <section id="blogs-section" className="py-12 md:py-16 bg-surface">
      <div className="shell space-y-8">
        {/* Header with inline CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            align="left"
            title="Travel Guides"
            titleRest="&amp; Outstation Tips"
            subtitle="Expert notes on cab pricing, temple pilgrimage routes, hill station drives and highway safety across Tamil Nadu."
          />

          <Link href="/blog" className="btn-secondary shrink-0 group">
            Explore all articles
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="card p-4 space-y-4 animate-pulse" aria-hidden="true">
                  <div className="w-full aspect-[16/10] bg-surface-sunken rounded-lg" />
                  <div className="h-3 bg-surface-sunken rounded w-1/3" />
                  <div className="h-5 bg-surface-sunken rounded w-3/4" />
                  <div className="h-12 bg-surface-alt rounded w-full" />
                </div>
              ))
            : blogs.map((blog) => (
                <article key={blog.id} className="card-hover overflow-hidden flex flex-col group">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-surface-sunken"
                  >
                    <Image
                      src={
                        blog.coverImage ||
                        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop"
                      }
                      alt={blog.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3.5 left-3.5 flex items-center gap-1 bg-white/95 backdrop-blur px-2 py-1 rounded text-[11px] font-semibold text-ink">
                      <Tag size={10} className="text-brand-600" />
                      {blog.category}
                    </span>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-[12px] text-ink-subtle mb-3">
                      <span className="flex items-center gap-1.5">
                        <User size={12} />
                        {blog.author.split(" ")[0]}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {blog.readTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye size={12} />
                        {blog.views || 100}+
                      </span>
                    </div>

                    <h3 className="text-[17px] font-bold text-ink leading-snug line-clamp-2 mb-2.5">
                      <Link href={`/blog/${blog.slug}`} className="group-hover:text-brand-600 transition-colors">
                        {blog.title}
                      </Link>
                    </h3>

                    <p className="text-[13px] text-ink-muted leading-relaxed line-clamp-3">{blog.excerpt}</p>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 hover:text-brand-700 mt-5 pt-4 border-t border-hairline group/link"
                    >
                      Read full guide
                      <ArrowRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
};
