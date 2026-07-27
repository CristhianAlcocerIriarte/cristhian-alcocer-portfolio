/**
 * Defense-in-depth policies for the static portfolio.
 * GitHub Pages cannot set custom HTTP headers, so production HTML embeds
 * CSP + Referrer-Policy via meta. `_headers` covers Cloudflare/Netlify if used later.
 */

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // Next/Tailwind/Framer use inline styles; static export cannot use nonces.
  "style-src 'self' 'unsafe-inline'",
  // App Router hydration needs inline bootstrap scripts on static export.
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "form-action 'self' mailto:",
  "upgrade-insecure-requests",
] as const;

/** CSP string for meta http-equiv and _headers. */
export const CONTENT_SECURITY_POLICY = cspDirectives.join("; ");

/** Referrer policy: send origin on cross-origin, full URL on same-origin. */
export const REFERRER_POLICY = "strict-origin-when-cross-origin";

/**
 * Full HTTP header set for hosts that honor `_headers` (Cloudflare Pages, Netlify).
 * Includes directives meta CSP cannot enforce (frame-ancestors, nosniff, etc.).
 */
export const SECURITY_HTTP_HEADERS = {
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
  "Referrer-Policy": REFERRER_POLICY,
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
} as const;

export function buildHeadersFile(): string {
  const lines = Object.entries(SECURITY_HTTP_HEADERS).map(
    ([name, value]) => `  ${name}: ${value}`,
  );
  return `/*\n${lines.join("\n")}\n`;
}
