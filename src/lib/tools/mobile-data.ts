export type MobilePlatform = "android" | "ios";
export type MobileOrientation = "portrait" | "landscape";

export type MobileDevice = {
  id: string;
  name: string;
  platform: MobilePlatform;
  /** Logical CSS viewport width (portrait) */
  width: number;
  /** Logical CSS viewport height (portrait) */
  height: number;
  /** Device pixel ratio for display label */
  dpr: number;
  os: string;
  framework: string;
};

export type MobileCheckDef = {
  id: string;
  category: string;
  title: string;
  how: string;
  platforms: Array<MobilePlatform | "both">;
};

export const mobileDevices: MobileDevice[] = [
  {
    id: "pixel-8",
    name: "Pixel 8",
    platform: "android",
    width: 412,
    height: 915,
    dpr: 2.625,
    os: "Android 14",
    framework: "Espresso · UI Automator",
  },
  {
    id: "galaxy-s24",
    name: "Galaxy S24",
    platform: "android",
    width: 360,
    height: 780,
    dpr: 3,
    os: "Android 14",
    framework: "Espresso · UI Automator",
  },
  {
    id: "pixel-fold",
    name: "Pixel Fold (cover)",
    platform: "android",
    width: 373,
    height: 841,
    dpr: 2.6,
    os: "Android 14",
    framework: "Espresso · UI Automator",
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    platform: "ios",
    width: 393,
    height: 852,
    dpr: 3,
    os: "iOS 17",
    framework: "XCUITest",
  },
  {
    id: "iphone-se",
    name: "iPhone SE (3rd)",
    platform: "ios",
    width: 375,
    height: 667,
    dpr: 2,
    os: "iOS 17",
    framework: "XCUITest",
  },
  {
    id: "ipad-mini",
    name: "iPad mini",
    platform: "ios",
    width: 768,
    height: 1024,
    dpr: 2,
    os: "iPadOS 17",
    framework: "XCUITest",
  },
];

export const mobileChecks: MobileCheckDef[] = [
  {
    id: "viewport-meta",
    category: "Viewport",
    title: "Viewport meta enables responsive layout",
    how: "Inspect meta[name=viewport] for width=device-width",
    platforms: ["both"],
  },
  {
    id: "no-user-scalable-lock",
    category: "Viewport",
    title: "Zoom is not disabled (a11y)",
    how: "Reject user-scalable=no / maximum-scale=1 locks",
    platforms: ["both"],
  },
  {
    id: "no-horizontal-overflow",
    category: "Layout",
    title: "No horizontal page overflow at device width",
    how: "Compare scrollWidth vs clientWidth on documentElement",
    platforms: ["both"],
  },
  {
    id: "touch-targets",
    category: "Interaction",
    title: "Primary CTAs meet 44×44px touch target",
    how: "Measure hero CTA bounding boxes",
    platforms: ["both"],
  },
  {
    id: "mobile-nav",
    category: "Navigation",
    title: "Compact nav affordance exists on small screens",
    how: "Find Menu / mobile-nav control when width < 1024",
    platforms: ["both"],
  },
  {
    id: "tap-not-hover-only",
    category: "Interaction",
    title: "Primary actions use click/tap links (not hover-only)",
    how: "Hero CTAs are <a> or <button> elements",
    platforms: ["both"],
  },
  {
    id: "body-font-size",
    category: "Typography",
    title: "Body text is at least 16px (avoids iOS input zoom)",
    how: "Computed font-size on body ≥ 16",
    platforms: ["ios", "both"],
  },
  {
    id: "safe-scroll-margin",
    category: "Layout",
    title: "Section anchors reserve sticky-header scroll margin",
    how: "Check scroll-margin-top on #about / #contact",
    platforms: ["both"],
  },
  {
    id: "skip-link",
    category: "Accessibility",
    title: "Skip link remains available on mobile",
    how: "Find skip-to-main link",
    platforms: ["both"],
  },
  {
    id: "main-landmark",
    category: "Accessibility",
    title: "Main content landmark is present",
    how: "Find main#main",
    platforms: ["both"],
  },
  {
    id: "android-touch-action",
    category: "Android",
    title: "Interactive controls use touch-action manipulation",
    how: "Sample buttons/links for touch-action",
    platforms: ["android"],
  },
  {
    id: "ios-tap-highlight",
    category: "iOS",
    title: "Focusable controls remain keyboard/VoiceOver reachable",
    how: "Primary CTAs are focusable anchors",
    platforms: ["ios"],
  },
];

export const mobileLab = {
  title: "Mobile testing simulation",
  subtitle:
    "Device lab for Android and iOS: preview the portfolio at real viewports and run mobile QA checks (touch targets, viewport, overflow, nav).",
  appiumNote: "Mapped conceptually to Appium · Espresso / UI Automator · XCUITest",
} as const;

export function devicesForPlatform(platform: MobilePlatform) {
  return mobileDevices.filter((device) => device.platform === platform);
}

export function checksForPlatform(platform: MobilePlatform) {
  return mobileChecks.filter(
    (check) =>
      check.platforms.includes("both") || check.platforms.includes(platform),
  );
}
