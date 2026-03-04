# Lessons Learned

Rules, style preferences, and best practices. Review at session start.

---

## Package Manager

- **Always use pnpm** - Never npm or yarn.

## Code Style

- **ALWAYS use arrow functions** - Never use `function` declarations or expressions. This includes components, callbacks, utilities, everything.
  - `const functionName = () => {}` for all functions
  - `const functionName = async () => {}` for async functions
- **If/else consistency** - Match formatting between if and else:
  - Both single-line: no braces for either
  - One is multi-line: braces for both
  - Never mix

  ```typescript
  // GOOD - Both single-line, no braces
  if (condition) doSomething();
  else doSomethingElse();

  // GOOD - One is multi-line, both use braces
  if (condition) {
    doSomething();
    doMore();
  } else {
    doSomethingElse();
  }

  // BAD - Inconsistent formatting
  if (condition) doSomething();
  else {
    doSomethingElse();
    doMore();
  }
  ```

- **Object parameters for 3+ args** - Functions with more than 2 parameters should take a single object parameter.
- **Static objects outside components** - Define constants and config objects outside component bodies to prevent recreation on every render.

## Component Architecture

- **Server/client separation** - Keep `page.tsx` and `layout.tsx` as server components. Never add `"use client"` to these files. Create separate client components when interactivity is needed.
- **Component structure order**: State > Callbacks > useEffects > Return. No exceptions.
- **useEffect placement** - ALL useEffects go immediately before the return statement, after all callbacks.
- **Interface location** - Component interfaces immediately before component definition. Shared interfaces in `/types` folder.

## React Best Practices

### useEffect Guidelines

- **Minimal dependencies** - Only include what's actually used AND should trigger re-runs. Never include state that the effect itself updates (circular dependency).
- **Prefer derived state** - Compute values directly instead of syncing with useEffect when possible.
- **Memory leak prevention** - Use `isMountedRef` pattern for async operations in useEffects.
- **Always clean up** - Return cleanup function for subscriptions, timers, listeners.

### Performance

- **Always use `useCallback`/`useMemo`** when passing functions or computed values to child components.
- **Don't over-optimize** - Only memoize when there's an actual performance concern.
- **Prefer derived state over useEffect** for computed values.

### Loading States

- **NEVER use "..." dots** for loading states in buttons. Always use the reusable `<Spinner />` component from `@/components/ui/spinner`.
- Pattern: `{isSubmitting ? <Spinner /> : t("save")}`

### Form Labels

- **Add Lucide icons to form labels** where applicable. Use `inline size-3.5` class on the icon.
- Pattern: `<FormLabel><User className="inline size-3.5" /> {t("name")}</FormLabel>`

## UI / Styling

### Button Component

- **ALWAYS use shadcn/ui Button** with ONLY variants and sizes.
- **NEVER add Tailwind classes** that duplicate what a variant already provides.
- Available variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `primary`, `gradient`, `link`
- Available sizes: `sm`, `default`, `lg`, `xl`, `icon`
- Only add `className` for: layout positioning (`w-full`, `flex-1`) or conditional states (`isOpen && "border-primary"`)

### Typography Components

Always use typography components from `@/components/ui/typography.tsx`:

- `TypographyH1` through `TypographyH4` for headings
- `TypographyRegular`, `TypographyMedium` for body text
- `TypographySmallReg`, `TypographySmallMedium` for smaller text
- `TypographyMiniReg`, `TypographyMiniMedium` for tiny text
- `TypographyMono` for monospace text

### ScrollArea (shadcn/ui) — PREFERRED for all scrollable areas

- **Always prefer ScrollArea** over native overflow scrolling. Use it for any scrollable content area.
- **Radix uses `display: table` internally** on the Viewport, which breaks height calculation in flex containers.
- **Always add `min-h-0`** to ScrollArea when it's a flex child (e.g., `className="flex-1 min-h-0"`).
- **Always add `viewportClassName="!overflow-y-scroll"`** to force the viewport to scroll — the `!important` is required to override Radix's inline styles.
- **Parent flex container must have a fixed/constrained height** (e.g., `h-screen`, `h-[80vh]`) — `h-auto` will NOT work because the container grows with content instead of constraining it.
- **Never use `h-auto` with `max-h-*`** on a ScrollArea's parent flex container — use a fixed height instead (e.g., `md:h-[80vh]` not `md:h-auto md:max-h-[80vh]`).
- **Use `h-0 flex-1` pattern** as an alternative — `h-0` provides a definite base height (0px), `flex-1` grows it. The viewport's `height: 100%` then resolves correctly.
- **For admin-style layouts**: constrain the shell to viewport height (`h-svh max-h-svh overflow-hidden`), then use `<ScrollArea className="h-0 flex-1">` for the content area.

```tsx
// CORRECT pattern for ScrollArea in flex layouts
<div className="h-screen flex flex-col">
  <header>...</header>
  <ScrollArea className="flex-1 min-h-0" viewportClassName="!overflow-y-scroll">
    <div className="p-4">{content}</div>
  </ScrollArea>
  <footer>...</footer>
</div>
```

### Color

- **Semantic color naming** - Use `text-foreground`, `bg-background`, etc. Never use raw color values.

## Next.js Patterns

- **Always await params in pages/layouts** - Next.js 16 requirement. `params` is a `Promise<{ locale: string }>`, not a plain object.
- **Never place `redirect()` inside try-catch blocks** - `redirect()` throws internally to trigger navigation; catching it silently breaks the redirect.

  ```typescript
  // GOOD
  const data = await fetchData();
  if (!data) redirect("/error");

  // BAD
  try {
    if (!data) redirect("/error"); // Gets caught!
  } catch (error) {
    // Redirect fails
  }
  ```

## Workflow

- **Lessons go in `tasks/lessons.md`** - NEVER use the auto memory system for coding rules or user preferences. After ANY correction from the user, immediately update THIS file. Read this file at session start.
- **Error Checking Protocol** - After completing work on any file: (1) Run `pnpm tsc --noEmit`, (2) Run `pnpm lint`, (3) Fix ALL errors before moving on.
- **Code Review Mindset** - Question if implementation is correct. Push back on incorrect requirements. Prefer native solutions over reinventing the wheel. Check for latest best practices.

---

_Update this file after any correction from the user. Write rules that prevent the same mistake._
