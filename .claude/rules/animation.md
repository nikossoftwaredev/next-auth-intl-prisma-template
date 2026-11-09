---
paths:
  - "components/**"
  - "lib/gsap.ts"
  - "app/**"
---

<!-- Do NOT write `app/[locale]/**` here: glob treats `[locale]` as a character class. -->

# Animation: GSAP, Lenis, React Bits

Full wiring and patterns: the `lenis-gsap` skill. API detail: the `gsap-*` skills. Taste and timing: `emil-design-eng`.

- **GSAP comes from `@/lib/gsap`**, never from `"gsap"` directly. New plugins are registered there, once.
- **One Lenis instance**, mounted by `<SmoothScroll />` in `app/[locale]/(site)/layout.tsx`. Public pages go under `(site)` to get it; the admin panel stays outside with native scroll. Read the instance with `useLenis()`, scroll with `lenis.scrollTo()`.
- **Reduced motion is mandatory.** Lenis handles scrolling on its own. Every GSAP motion sits inside `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`, and the reduced state shows the final content.
- **`useGSAP` with a scope ref** in every animated client component; never a bare `useEffect` with GSAP.
- **Nested scrollers** get `data-lenis-prevent`. Radix dialogs and sheets are already handled; a custom overlay calls `lenis.stop()` and `lenis.start()`.
- **Animate `transform` and `opacity` only.** UI feedback (hover, press, dropdowns) stays under 300ms; hero and scroll storytelling may run longer.
- **React Bits** effects come from the registry: `pnpm exec shadcn add @react-bits/<Name>-TS-TW`, which writes `components/<Name>.tsx`. Leave their own GSAP imports as they are. License is MIT + Commons Clause: fine in client sites, never resold as a component pack.
