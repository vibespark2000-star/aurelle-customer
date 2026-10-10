"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseSilkRevealOptions {
  triggerOnce?: boolean;
  delay?: number;
  stagger?: number;
  start?: string;
}

export const useSilkReveal = <T extends HTMLElement = HTMLDivElement>(options: UseSilkRevealOptions = {}) => {
  const containerRef = useRef<T | null>(null);
  const { triggerOnce = true, delay = 0, stagger = 0.08, start = "top 85%" } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if prefers-reduced-motion is true
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Just make items visible immediately if reduced motion is preferred
      const items = container.querySelectorAll(".silk-item");
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const items = container.querySelectorAll(".silk-item");
    if (items.length === 0) return;

    // A restrained fade-up: no skew or rotation, so text never renders distorted.
    gsap.set(items, { opacity: 0, y: 24 });

    const anim = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: stagger,
      delay: delay,
      scrollTrigger: {
        trigger: container,
        start: start,
        toggleActions: triggerOnce ? "play none none none" : "play reverse play reverse",
      },
    });

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [triggerOnce, delay, stagger, start]);

  return containerRef;
};
