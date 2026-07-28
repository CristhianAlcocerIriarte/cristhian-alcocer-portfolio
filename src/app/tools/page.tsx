import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ToolsShell } from "@/components/tools/ToolsShell";

export const metadata: Metadata = {
  title: "Tools Lab · Cristhian Alcocer",
  description:
    "Interactive Postman, Playwright, JMeter, Jira, Confluence, SQL, WCAG and Mobile simulations powered by portfolio data.",
};

export default function ToolsPage() {
  return (
    <>
      <Nav />
      <main
        id="main"
        className="overflow-x-hidden px-[clamp(1.25rem,4vw,2.5rem)] pb-[clamp(2.5rem,5vw,3.75rem)] pt-28 sm:pt-32 md:pt-36"
      >
        <div className="container-narrow min-w-0">
          <ToolsShell />
        </div>
      </main>
      <Footer />
    </>
  );
}
