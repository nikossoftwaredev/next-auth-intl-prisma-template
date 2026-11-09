---
name: lenis-gsap
description: How this template wires Lenis smooth scroll to GSAP and ScrollTrigger. Use when adding scroll-driven animation, smooth scroll, ScrollTrigger, parallax, pinned sections, scroll-to links, or any GSAP code in this project, and when debugging scroll that jumps, lags, or keeps moving behind a modal.
---

# Lenis + GSAP in this template

Written for this repo; there is no official Lenis skill. The general GSAP skills (`gsap-core`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance`, `gsap-utils`) cover the APIs. This one covers how they are wired here.

## How it is wired

| Piece | File | What it does |
| --- | --- | --- |
| Plugin registry | `lib/gsap.ts` | Registers `useGSAP` and `ScrollTrigger` once, re-exports `gsap`, `ScrollTrigger`, `useGSAP` |
| Smooth scroll | `components/smooth-scroll.tsx` | One root `ReactLenis`, driven by `gsap.ticker`, feeding `ScrollTrigger.update` |
| Scope | `app/[locale]/(site)/layout.tsx` | Mounts `<SmoothScroll />` for public pages only; the admin panel keeps native scroll |

Lenis runs with `autoRaf: false` (the GSAP ticker drives it, one frame loop for both), `anchors: true` (in-page `#links` glide), and `gsap.ticker.lagSmoothing(0)`.

## Rules

1. **Import GSAP from `@/lib/gsap`**, never from `"gsap"` directly. A new plugin (SplitText, Flip, ScrollToPlugin) is added to the `registerPlugin` call there. All GSAP plugins are free and ship in the public `gsap` package, including the former Club ones; no private registry or token is ever needed.
2. **Never create a second Lenis instance** or another `ReactLenis`. Read the existing one with `useLenis()` from `lenis/react`.
3. **No `ScrollTrigger.scrollerProxy()`.** Lenis moves the real page scroll, so ScrollTrigger reads it natively. The proxy pattern in the generic GSAP skill is for scrollers that transform a wrapper, which Lenis does not.
4. **Programmatic scrolling goes through Lenis**: `lenis?.scrollTo("#contact", { offset: -80 })`. A plain `window.scrollTo` fights the smoothing.
5. **Nested scrollable areas** (a ScrollArea inside a custom panel, a long dropdown, an embedded map) get `data-lenis-prevent`, or the wheel scrolls the page instead of the panel.
6. **Modals are already handled.** Radix dialogs and sheets set `<body data-scroll-locked>`, and `SmoothScroll` skips events while it is present. A custom overlay that does not use Radix must call `lenis.stop()` on open and `lenis.start()` on close.
7. **Reduced motion.** Lenis falls back to native 1:1 scrolling on its own (`respectReducedMotion` defaults to true). GSAP does not: wrap every motion in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`, and make sure the reduced state shows the final content. Nothing may stay at `opacity: 0` waiting for an animation that never runs; `/site-qa` checks for this.
8. **`useGSAP` with a scope ref** in every client component. It reverts tweens, ScrollTriggers and `matchMedia` on unmount. Wrap event handlers in `contextSafe`.
9. **Content that changes height after load** (lazy images without fixed dimensions, accordions, fetched lists) needs `ScrollTrigger.refresh()` afterwards, or trigger positions drift.

## Pattern: reveal on scroll

```tsx
"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

export const Reveal = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          y: 40,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        });
      });
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
};
```

`gsap.from` leaves the element visible when the media query does not match, so reduced-motion users see the content immediately.

## Pattern: scroll-to link

```tsx
"use client";

import { useLenis } from "lenis/react";

export const ScrollToButton = ({ target, label }: { target: string; label: string }) => {
  const lenis = useLenis();

  return <button onClick={() => lenis?.scrollTo(target, { offset: -80 })}>{label}</button>;
};
```

Plain `<a href="#contact">` links already glide because `anchors: true`.

## React Bits components

React Bits (`pnpm exec shadcn add @react-bits/<Name>-TS-TW`) lands in `components/<Name>.tsx`. Those files import `gsap` directly and call `registerPlugin` themselves. Leave that as it is: registering twice is harmless, and keeping them close to upstream makes updates easy. Their license is MIT + Commons Clause: fine inside client sites, never resold or redistributed as a component pack.

## Debugging

- Scroll feels doubled or laggy: a second Lenis instance, or a CSS `scroll-behavior: smooth` on a nested scroller. The one on `html` in `globals.css` is fine, because Lenis scrolls with `behavior: "instant"`.
- ScrollTrigger markers drift: content changed height without `ScrollTrigger.refresh()`.
- Page scrolls behind an overlay: the overlay is not a Radix component; see rule 6.
- Wheel scrolls the page instead of a panel: rule 5.
