import { SmoothScroll } from "@/components/smooth-scroll";

// Public site pages live in this route group so they get Lenis smooth scroll.
// The admin panel sits outside it and keeps native scrolling.
const SiteLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <SmoothScroll />
    {children}
  </>
);

export default SiteLayout;
