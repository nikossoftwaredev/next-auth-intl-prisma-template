# Site QA

Final QA pass before a site is delivered. Run it after `/impeccable audit`. Delivery requires **zero open Blockers**.

It drives the running site with the Playwright CLI (`@playwright/cli`, a devDependency, called through `pnpm exec playwright-cli`). Do not install or use the CLI's bundled agent skill: it failed the SkillSpector gate (DO_NOT_INSTALL). Use only the commands in this file.

Argument: the base URL. Without one, start `pnpm dev` and read the `Local:` line for the port. Never assume 3000.

## Rules

- **Report, don't fix.** Collect every finding first, show the report, then ask which ones to fix.
- Every finding carries evidence: a screenshot path or the eval output.
- Read every screenshot you take with the Read tool. A screenshot nobody looked at proves nothing.

## Setup

1. Pages: every `page.tsx` under `app/[locale]/(site)/`, in every locale from `lib/i18n/routing.ts`.
2. One session for the whole run:
   ```bash
   pnpm exec playwright-cli -s=qa open <base-url>/<locale>
   ```
3. Screenshots go to `screenshots/qa/` (gitignored), named `<page>-<locale>-<width>.png`.

## Checks per page and locale

### 1. Layout at three widths (375x812, 768x1024, 1440x900)

```bash
pnpm exec playwright-cli -s=qa resize 375 812
pnpm exec playwright-cli -s=qa goto <url>
pnpm exec playwright-cli -s=qa screenshot --full-page --filename=screenshots/qa/home-en-375.png
pnpm exec playwright-cli -s=qa --raw eval "() => document.documentElement.scrollWidth > window.innerWidth"
```

- Blocker: horizontal overflow (`true` above), cut or overlapping text, a broken image, a navbar or mobile menu that does not work.
- Warning: uneven spacing, misalignment, tap targets under 44px on mobile.

### 2. Console

```bash
pnpm exec playwright-cli -s=qa console warning
```

- Blocker: any error. Warning: any warning (hydration mismatches count).

### 3. SEO

```bash
pnpm exec playwright-cli -s=qa --raw eval "() => ({ title: document.title, description: document.querySelector('meta[name=description]')?.content ?? null, h1: document.querySelectorAll('h1').length, lang: document.documentElement.lang, canonical: document.querySelector('link[rel=canonical]')?.href ?? null, ogTitle: document.querySelector('meta[property=\"og:title\"]')?.content ?? null, ogImage: document.querySelector('meta[property=\"og:image\"]')?.content ?? null, robots: document.querySelector('meta[name=robots]')?.content ?? null, imagesWithoutAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.src) })"
```

- Blocker: missing or duplicate `title` across pages, missing description, not exactly one `h1`, `lang` not equal to the locale, a canonical that is relative or points at a `*.vercel.app` or `localhost` origin in production (see `.claude/rules/deployment-urls.md`), a public page marked `noindex`.
- Warning: missing `og:title` or `og:image`, an `og:image` that is not absolute, images without `alt`.

### 4. hreflang

```bash
pnpm exec playwright-cli -s=qa --raw eval "() => [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => l.hreflang + ' ' + l.href)"
```

- Blocker: missing alternates. Every page needs one absolute link per locale plus `x-default`, and the other locale's page must link back.

### 5. Reduced motion

```bash
pnpm exec playwright-cli -s=qa set-reduced-motion reduce
pnpm exec playwright-cli -s=qa reload
pnpm exec playwright-cli -s=qa --raw eval "() => [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && el.textContent.trim() && getComputedStyle(el).opacity === '0'; }).map((el) => el.tagName + ' ' + el.textContent.trim().slice(0, 40))"
pnpm exec playwright-cli -s=qa screenshot --filename=screenshots/qa/home-en-reduced.png
pnpm exec playwright-cli -s=qa clear-reduced-motion
```

- Blocker: text in the viewport stuck at `opacity: 0` (an entrance animation that never runs), or anything still sliding, scaling or parallaxing. GSAP motion must sit behind `gsap.matchMedia()`, and Lenis already falls back to native scrolling.

## Site-wide checks (once)

```bash
pnpm exec playwright-cli -s=qa goto <base-url>/robots.txt
pnpm exec playwright-cli -s=qa --raw eval "() => document.body.innerText"
pnpm exec playwright-cli -s=qa goto <base-url>/sitemap.xml
pnpm exec playwright-cli -s=qa --raw eval "() => document.documentElement.outerHTML"
```

- Blocker: relative URLs, a `*.vercel.app` or `localhost` origin in production, a public page missing from the sitemap, `/admin` listed in the sitemap or not disallowed in `robots.txt`.

Close the session at the end:

```bash
pnpm exec playwright-cli -s=qa close
```

## Report

One table, Blockers first:

| Severity | Page | Locale | Viewport | Finding | Evidence |
| --- | --- | --- | --- | --- | --- |

End with the verdict: **Ready** (zero Blockers) or **Not ready** (count of Blockers), then ask which findings to fix.
