export type FiddlerSession = {
  id: string;
  result: number;
  protocol: "HTTPS" | "HTTP";
  host: string;
  url: string;
  method: "GET" | "POST" | "OPTIONS";
  contentType: string;
  bodySize: number;
  process: string;
  durationMs: number;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
  requestBody?: string;
  responseBody: string;
  notes: string;
};

export const fiddlerCapture = {
  title: "Portfolio traffic capture",
  proxy: "127.0.0.1:8888",
  gateway: "System proxy (simulated)",
};

export const fiddlerSessions: FiddlerSession[] = [
  {
    id: "s1",
    result: 200,
    protocol: "HTTPS",
    host: "localhost:3000",
    url: "/",
    method: "GET",
    contentType: "text/html",
    bodySize: 48210,
    process: "chrome:main",
    durationMs: 86,
    requestHeaders: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept-Language": "en-US,en;q=0.9",
    },
    responseHeaders: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0",
      "X-Portfolio": "homepage",
    },
    responseBody: `<!doctype html>
<html lang="en">
  <head><title>Cristhian Alcocer · QA Lead & Senior QA Engineer</title></head>
  <body>
    <a href="#main">Skip to main content</a>
    <main id="main">...portfolio markup...</main>
  </body>
</html>`,
    notes: "Initial document navigation for the portfolio homepage.",
  },
  {
    id: "s2",
    result: 200,
    protocol: "HTTPS",
    host: "localhost:3000",
    url: "/_next/static/css/app.css",
    method: "GET",
    contentType: "text/css",
    bodySize: 22140,
    process: "chrome:main",
    durationMs: 24,
    requestHeaders: {
      Accept: "text/css,*/*;q=0.1",
      Referer: "http://localhost:3000/",
    },
    responseHeaders: {
      "Content-Type": "text/css; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    responseBody: `:root{--accent:#f0b429;--bg:#090b10}body{background:var(--bg);color:#f2f4f8}`,
    notes: "Static stylesheet for the amber terminal theme.",
  },
  {
    id: "s3",
    result: 200,
    protocol: "HTTPS",
    host: "localhost:3000",
    url: "/tools/",
    method: "GET",
    contentType: "text/html",
    bodySize: 39120,
    process: "chrome:main",
    durationMs: 71,
    requestHeaders: {
      Accept: "text/html,application/xhtml+xml",
      Referer: "http://localhost:3000/",
    },
    responseHeaders: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Portfolio": "tools-lab",
    },
    responseBody: `<!doctype html><html lang="en"><body><main id="main">Tools lab shell...</main></body></html>`,
    notes: "Navigation to the Tools lab route.",
  },
  {
    id: "s4",
    result: 200,
    protocol: "HTTPS",
    host: "localhost:3000",
    url: "/api/profile",
    method: "GET",
    contentType: "application/json",
    bodySize: 812,
    process: "chrome:main",
    durationMs: 48,
    requestHeaders: {
      Accept: "application/json",
      Origin: "http://localhost:3000",
      "X-Tools": "postman-sim",
    },
    responseHeaders: {
      "Content-Type": "application/json",
      "x-portfolio-mock": "true",
    },
    responseBody: JSON.stringify(
      {
        name: "Cristhian Alcocer",
        role: "QA Lead & Senior QA Engineer",
        location: "Cochabamba, Bolivia",
        openToWork: true,
      },
      null,
      2,
    ),
    notes: "Mock API call from the Postman simulation.",
  },
  {
    id: "s5",
    result: 201,
    protocol: "HTTPS",
    host: "localhost:3000",
    url: "/api/contact",
    method: "POST",
    contentType: "application/json",
    bodySize: 246,
    process: "chrome:main",
    durationMs: 93,
    requestHeaders: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
    },
    requestBody: JSON.stringify(
      {
        name: "Hiring Manager",
        email: "hiring@example.com",
        message: "Interested in a QA Lead conversation.",
      },
      null,
      2,
    ),
    responseHeaders: {
      "Content-Type": "application/json",
      "x-portfolio-mock": "true",
    },
    responseBody: JSON.stringify(
      {
        id: "msg_demo",
        delivery: "mailto-simulated",
        to: "cristhianalcoceririarte@gmail.com",
      },
      null,
      2,
    ),
    notes: "Contact form submission captured as API traffic.",
  },
  {
    id: "s6",
    result: 200,
    protocol: "HTTPS",
    host: "fonts.gstatic.com",
    url: "/s/dmsans/v1/font.woff2",
    method: "GET",
    contentType: "font/woff2",
    bodySize: 18400,
    process: "chrome:main",
    durationMs: 112,
    requestHeaders: {
      Accept: "*/*",
      Origin: "http://localhost:3000",
    },
    responseHeaders: {
      "Content-Type": "font/woff2",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=31536000",
    },
    responseBody: "[binary font payload]",
    notes: "Third-party font asset used by the portfolio typography.",
  },
  {
    id: "s7",
    result: 302,
    protocol: "HTTPS",
    host: "wa.me",
    url: "/59179969931",
    method: "GET",
    contentType: "text/html",
    bodySize: 0,
    process: "chrome:main",
    durationMs: 140,
    requestHeaders: {
      Accept: "text/html",
      Referer: "http://localhost:3000/",
    },
    responseHeaders: {
      Location: "https://api.whatsapp.com/send/?phone=59179969931",
    },
    responseBody: "",
    notes: "WhatsApp deep-link redirect from the Contact section.",
  },
  {
    id: "s8",
    result: 200,
    protocol: "HTTPS",
    host: "localhost:3000",
    url: "/api/health",
    method: "GET",
    contentType: "application/json",
    bodySize: 128,
    process: "jmeter:thread-1",
    durationMs: 31,
    requestHeaders: {
      Accept: "application/json",
      "User-Agent": "Apache-JMeter-sim",
    },
    responseHeaders: {
      "Content-Type": "application/json",
      "x-portfolio-mock": "true",
    },
    responseBody: JSON.stringify(
      {
        status: "healthy",
        service: "cristhian-alcocer-portfolio-api",
      },
      null,
      2,
    ),
    notes: "Health check sampler from the JMeter simulation.",
  },
];

export const fiddlerFilters = [
  "All",
  "HTML",
  "JSON",
  "CSS",
  "Font",
  "Redirect",
] as const;

export function matchesFiddlerFilter(
  session: FiddlerSession,
  filter: (typeof fiddlerFilters)[number],
) {
  if (filter === "All") return true;
  if (filter === "HTML") return session.contentType.includes("html");
  if (filter === "JSON") return session.contentType.includes("json");
  if (filter === "CSS") return session.contentType.includes("css");
  if (filter === "Font") return session.contentType.includes("font");
  if (filter === "Redirect") return session.result >= 300 && session.result < 400;
  return true;
}
