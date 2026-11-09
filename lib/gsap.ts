"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// The one place GSAP plugins are registered. Components import gsap, its
// plugins and useGSAP from here, never from "gsap" directly, so every plugin
// is registered once before first use. Add new plugins to this call.
gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };
