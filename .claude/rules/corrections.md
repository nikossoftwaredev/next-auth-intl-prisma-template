# Corrections & Non-Negotiables

<!-- No `paths` frontmatter: this file loads every session. It is the incident log.
     Append the abstracted rule after ANY correction from the user. Keep it lean;
     anything path-specific belongs in a scoped rule file next to this one. -->

Rules learned from actual corrections. These are binding.

## Always

- **pnpm only**, never npm or yarn. This project uses PNPM workspaces.
- **Latest stable package versions.** When adding a dependency, install the current stable release. Never pin an outdated version without an explicit, stated reason.
- **Error-checking protocol.** After finishing work on any file: (1) `pnpm tsc --noEmit`, (2) `pnpm lint`, (3) fix ALL errors before moving on. Never grep-filter the output, because pre-existing errors must stay visible so new ones aren't masked.
- **Screenshot verification.** After each meaningful UI change, screenshot and visually inspect it. Do not batch every change and check once at the end.
- **No em dashes anywhere.** See the Writing Style section of CLAUDE.md. This covers UI copy, translations, code comments, commit messages, docs, and chat responses.
- **Corrections go in THIS file**, not the auto-memory system. After any correction from the user, add the abstracted rule here (or to the scoped rule file it belongs to) immediately.
- **Google reviews are cached for one week, never fetched per page load.** The Places API is paid and the landing page renders on every request, so `lib/google/reviews.ts` wraps the call in `unstable_cache` with `revalidate: ONE_WEEK_IN_SECONDS` (604800). Never call the Places API outside that cached function, never shorten the window without the user asking, and give any other paid or rate-limited third-party API the same treatment (server-side cache with an explicit lifetime, never a request per visitor).
- **Code-review mindset.** Question whether the implementation is actually correct, push back on wrong requirements, prefer native or library solutions over reinventing, and check current best practices (context7, web) rather than trusting recall.

## Known traps

- **A wrong canonical origin is permanent damage.** Never paste a `*.vercel.app` URL as the site base to unblock a build. Full rule: `.claude/rules/deployment-urls.md`.
- **`tsc` + `lint` passing does not mean it works.** next-intl message caching, Prisma client staleness, and env-var inlining all survive a green typecheck. Drive the feature in the running app.
- **Read the port `pnpm dev` actually bound.** If 3000 is taken, Next silently moves to 3001, and screenshots of `localhost:3000` capture a different app. Check the `Local:` line before verifying anything.
- **`fetch` with `next.revalidate` caches errors too.** Next stores every HTTP 200 response, and APIs like Google Places return errors (`REQUEST_DENIED`, `OVER_QUERY_LIMIT`) as 200 with a `status` field, so one bad response sticks for the whole revalidate window. For long cache windows, wrap the call in `unstable_cache` (or `"use cache"` if `cacheComponents` is ever enabled) and throw on a non-OK body, because thrown results are never cached.
- **Restart the dev server** after changing `messages/*.json`, the Prisma schema, or any `NEXT_PUBLIC_*` variable. A running server holds stale caches and will lie to you.
