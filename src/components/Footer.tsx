import { site } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="container-narrow px-[clamp(1.25rem,4vw,2.5rem)] py-8">
        <p className="font-mono text-xs text-muted">
          © {year} {site.fullName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
