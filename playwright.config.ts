import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  // ─── Test Directory ──────────────────────────────────
  testDir: "./tests",

  // ─── Global Test Timeout ─────────────────────────────
  // Dev server (dev.24hrtruckfix.com) is slow; 60s gives enough room
  timeout: 60000,

  // ─── Parallel Execution ──────────────────────────────
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // ─── Reporting ───────────────────────────────────────
  reporter: [
    ["html", { open: "never" }],
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],

  // ─── Global Settings ────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL || "https://dev.24hrtruckfix.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 60000,
  },

  // ─── Projects (Browsers) ────────────────────────────
  projects: [
    // --- Setup: Authenticate & save state ---
    {
      name: "auth-setup",
      testMatch: /global\.setup\.ts/,
    },

    // --- Desktop Browsers ---
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/admin.json",
      },
      dependencies: ["auth-setup"],
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/admin.json",
      },
      dependencies: ["auth-setup"],
    },

    // --- Mobile Viewport ---
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
        storageState: "playwright/.auth/admin.json",
      },
      dependencies: ["auth-setup"],
    },
  ],
});
