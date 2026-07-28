import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/content";
import {
  CONTENT_SECURITY_POLICY,
  REFERRER_POLICY,
} from "@/lib/security";
import "./globals.css";

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const isProd = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  title: `${site.name} · ${site.role}`,
  description: site.intro,
  metadataBase: new URL(
    "https://cristhianalcoceririarte.github.io/cristhian-alcocer-portfolio/",
  ),
  openGraph: {
    title: `${site.name} · ${site.role}`,
    description: site.intro,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.role}`,
    description: site.intro,
  },
  referrer: REFERRER_POLICY,
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

const paletteBootScript = `(function(){try{var k='portfolio-palette';var a=['terminal','signal','cyan','amber'];var t=localStorage.getItem(k);if(!t||a.indexOf(t)<0)t='terminal';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','terminal');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="terminal"
      className={`${body.variable} ${display.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: paletteBootScript }} />
        {isProd ? (
          <meta
            httpEquiv="Content-Security-Policy"
            content={CONTENT_SECURITY_POLICY}
          />
        ) : null}
      </head>
      <body className="site-bg min-h-full font-sans text-text">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:min-h-11 focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-[var(--on-accent)]"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
