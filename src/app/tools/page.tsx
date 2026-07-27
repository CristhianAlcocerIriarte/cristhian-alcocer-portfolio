import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ToolsShell } from "@/components/tools/ToolsShell";

export const metadata: Metadata = {
  title: "Tools Lab · Cristhian Alcocer",
  description:
    "Interactive Postman, Playwright, JMeter, Jira, Confluence and SQL simulations powered by portfolio data.",
};

export default function ToolsPage() {
  return (
    <>
      <Nav />
      <main id="main" className="section-pad pt-28 sm:pt-32">
        <div className="container-narrow">
          <ToolsShell />
        </div>
      </main>
      <Footer />
    </>
  );
}
