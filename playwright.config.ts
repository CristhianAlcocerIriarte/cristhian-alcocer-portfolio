import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const repoName = "cristhian-alcocer-portfolio";
const isStatic = process.env.E2E_MODE === "static";
const port = 4173;

const baseURL = isStatic
  ? `http://127.0.0.1:${port}/${repoName}/`
  : "http://localhost:3000/";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: isStatic
    ? {
        command: `npx --yes serve "${path.resolve("site")}" -l ${port} --no-port-switching`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : {
        command: "npm run dev -- --port 3000",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
