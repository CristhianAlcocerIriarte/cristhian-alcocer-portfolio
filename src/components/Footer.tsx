import { site } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="container-narrow flex flex-col gap-3 px-[clamp(1.25rem,4vw,2.5rem)] py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-muted">
          © {year} {site.fullName}. All rights reserved.
        </p>
        <p className="font-mono text-xs text-muted/70">built with precision</p>
      </div>
    </footer>
  );
}
