"use client";

import "lenis/dist/lenis.css";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

// Radix dialogs and sheets lock scrolling by marking <body data-scroll-locked>.
// Lenis ignores event.defaultPrevented, so without this it keeps scrolling the
// page behind an open modal. Skipping the event hands it back to Radix, which
// blocks it outside the modal and allows it inside.
const isScrollLocked = (node: HTMLElement) => node.hasAttribute("data-scroll-locked");

// autoRaf off: the GSAP ticker drives Lenis, so both share one frame loop.
// anchors on: in-page links (#services) glide through Lenis.
const LENIS_OPTIONS = { autoRaf: false, anchors: true, prevent: isScrollLocked };

/**
 * Page-wide smooth scroll for the public site. Lenis honors
 * prefers-reduced-motion on its own (respectReducedMotion defaults to true),
 * so reduced-motion users get native 1:1 scrolling.
 */
export const SmoothScroll = () => {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const update = (time: number) => lenis.raf(time * 1000);
    const offScroll = lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      offScroll();
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's defaults, for the admin panel
    };
  }, [lenis]);

  return <ReactLenis root options={LENIS_OPTIONS} />;
};
