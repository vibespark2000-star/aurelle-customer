"use client";
import { ArrowRight, ArrowUpRight, Clock } from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useEffect, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import Link from "next/link";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlogPostItem } from "@/data/blogs";

const FALLBACK_COVER = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop";

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

  const [featured, ...rest] = blogs;

  return (
    <section id="blogs-section" className="bg-white py-12 md:py-16">
      <div className="shell space-y-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            title="Road-trip ideas"
            titleRest="& insider tips."
            subtitle="Cab pricing explained, temple circuits, hill-station drives and highway safety across Tamil Nadu."
          />
          <Link href="/blog" className="btn-secondary group shrink-0">
            All articles
            <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2" aria-hidden="true">
            <div className="h-[460px] animate-pulse rounded-[1.75rem] bg-surface-sunken" />
            <div className="grid gap-5">
              <div className="h-[220px] animate-pulse rounded-[1.75rem] bg-surface-sunken" />
              <div className="h-[220px] animate-pulse rounded-[1.75rem] bg-surface-sunken" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Featured */}
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-night-900 p-7 md:p-9"
              >
                <SmartImage fallbackLabel={featured.category}
                  src={featured.coverImage || FALLBACK_COVER}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/50 to-transparent" />
                <span className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-brand-600 group-hover:text-white">
                  <ArrowUpRight size={18} weight="bold" />
                </span>
                <div className="relative">
                  <span className="glass-dark inline-block rounded-full px-3 py-1 text-[11.5px] font-semibold text-white">
                    {featured.category}
                  </span>
                  <h3 className="mt-4 max-w-lg font-display text-[26px] font-extrabold leading-tight tracking-tight text-white md:text-[30px]">
                    {featured.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 max-w-lg text-[14.5px] leading-relaxed text-night-text">{featured.excerpt}</p>
                  <span className="mt-5 flex items-center gap-3 text-[12.5px] text-night-dim">
                    <span>{featured.author}</span>
                    <span className="h-1 w-1 rounded-full bg-night-dim" />
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {featured.readTime}
                    </span>
                  </span>
                </div>
              </Link>
            )}

            {/* Side list */}
            <div className="grid gap-5">
              {rest.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group flex flex-col gap-5 overflow-hidden rounded-[1.75rem] border border-hairline bg-white p-2 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift sm:flex-row"
                >
                  <div className="relative h-48 shrink-0 overflow-hidden rounded-[1.4rem] bg-surface-sunken sm:h-auto sm:w-[42%]">
                    <SmartImage fallbackLabel={blog.category}
                      src={blog.coverImage || FALLBACK_COVER}
                      alt=""
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-3 pb-4 sm:py-4 sm:pr-5">
                    <span className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-brand-600">{blog.category}</span>
                    <h3 className="mt-2 line-clamp-2 font-display text-[18px] font-bold leading-snug tracking-tight text-ink">
                      {blog.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-ink-muted">{blog.excerpt}</p>
                    <span className="mt-auto flex items-center justify-between pt-4 text-[12.5px] text-ink-subtle">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {blog.readTime}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-ink transition-colors group-hover:text-brand-600">
                        Read <ArrowRight size={13} weight="bold" />
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
