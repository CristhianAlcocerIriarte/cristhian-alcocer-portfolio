"use client";

import { useEffect } from "react";

function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "instant", block: "start" });
}

export function HashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      // Double rAF: wait for layout after client navigations (e.g. /tools → /#contact).
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => scrollToId(id));
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
}
