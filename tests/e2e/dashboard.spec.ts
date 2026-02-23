import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/dashboard.page";

/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  DASHBOARD & NAVIGATION TEST SUITE                   ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Target: https://dev.24hrtruckfix.com
 * Source: 24hr-New-UI/components/main-nav.tsx (sidebar)
 *         24hr-New-UI/components/top-nav.tsx  (header)
 *
 * Sidebar links (admin/super_admin):
 *   Home → /tickets, Global Agent → /chat, Safety → /safety,
 *   Tasks → /tasks, Agents → /agents, Call Activity → /ai-activity,
 *   Service Providers → /service-providers, Clients → /clients,
 *   Messages → /message, Applications → /sp-applications
 *
 * Header: theme toggle, bell notifications, avatar dropdown (Profile, Settings, Log out)
 *
 * Tags: @dashboard, @smoke, @regression
 */

test.describe("Dashboard & Navigation @dashboard", () => {

    test("TC-DASH-001: Dashboard loads with sidebar and header @smoke", async ({ page }) => {
        const dash = new DashboardPage(page);
        await dash.goto();

        // Sidebar should have nav links
        await expect(dash.sidebar.first()).toBeVisible();
        // Header with notification bell
        await expect(dash.header).toBeVisible();
    });

    test("TC-DASH-002: Sidebar shows correct nav items for admin @regression", async ({ page }) => {
        const dash = new DashboardPage(page);
        await dash.goto();

        // These are the links visible to admin/super_admin (from main-nav.tsx)
        await expect(dash.homeLink.first()).toBeVisible();
        await expect(dash.agentsLink).toBeVisible();
        await expect(dash.serviceProvidersLink).toBeVisible();
        await expect(dash.clientsLink).toBeVisible();
        await expect(dash.tasksLink).toBeVisible();
    });

    test("TC-DASH-003: Navigate to Clients @regression", async ({ page }) => {
        const dash = new DashboardPage(page);
        await dash.goto();
        await dash.navigateTo("Clients");
        await expect(page).toHaveURL(/clients/);
    });

    test("TC-DASH-004: Navigate to Service Providers @regression", async ({ page }) => {
        const dash = new DashboardPage(page);
        await dash.goto();
        await dash.navigateTo("Service Providers");
        await expect(page).toHaveURL(/service-providers/);
    });

    test("TC-DASH-005: Navigate to Agents @regression", async ({ page }) => {
        const dash = new DashboardPage(page);
        await dash.goto();
        await dash.navigateTo("Agents");
        await expect(page).toHaveURL(/agents/);
    });

    test("TC-DASH-006: Navigate to Tasks @regression", async ({ page }) => {
        const dash = new DashboardPage(page);
        await dash.goto();
        await dash.navigateTo("Tasks");
        await expect(page).toHaveURL(/tasks/);
    });

    test("TC-DASH-007: Navigate to Messages @regression", async ({ page }) => {
        const dash = new DashboardPage(page);
        await dash.goto();
        await dash.navigateTo("Messages");
        await expect(page).toHaveURL(/message/);
    });

    test("TC-DASH-008: User can log out @smoke", async ({ page }) => {
        const dash = new DashboardPage(page);
        await dash.goto();
        await dash.logout();

        await expect(page).toHaveURL(/signin/);
    });
});
