# Definition of Done — Website Deliverable

- **Mobile-friendly** — fully responsive across all screen sizes (mobile, tablet, desktop)
- **Fast** — optimized load times, minified assets, no unnecessary blocking resources
- **SEO optimized** — proper meta tags, headings structure, sitemap, and semantic HTML
- **Images optimized** — compressed, correctly sized, with alt text on all images
- **AEO optimized** — structured data / schema markup in place, content formatted for AI-driven answer engines
- **Bilingual** — both language versions fully functional, with correct routing/switching and no missing translations
- **Consistent color palette** — all UI elements follow the agreed brand colors throughout
- **Button consistency** — all buttons share unified style, sizing, and hover behavior across all pages
- **Footer** — present on all pages, includes "Made by Hexaigon" credit to the left of it use the https://lucide.dev/icons/hexagon from the library we have and make it primary color.
- **Open Graph image** — OG share image is a 1920x1080 screenshot of the website, used as the preview when sharing on social media
- **Favicon** — a `.ico` remove the vercel default one and make one using sharp based on logo png. and use this as favicon.ico
- **Navbar links work across ALL pages** — Use proper `Link` from `@/lib/i18n/navigation` with absolute paths (e.g., `href="/blog"`, `href="/#about"`). Never use bare `#section` anchors — they break on non-landing pages because they append `#section` to the current URL instead of navigating to `/#section`. Same-page anchors are only valid on the landing page; everywhere else, prefix with `/`. Verify by clicking every nav link from at least two different pages.
- **Every route group has a `loading.tsx`** — Use the reusable `LoadingScreen` component (`components/loading-screen.tsx`) which matches the app theme. When adding a new route group or page directory, always create a `loading.tsx` that imports and renders `<LoadingScreen />`.
