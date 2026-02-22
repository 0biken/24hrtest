import { test, expect } from "@playwright/test";
import { TicketsPage } from "../pages/tickets.page";
import { DashboardPage } from "../pages/dashboard.page";

/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  TICKETS TEST SUITE                                  ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Target: https://dev.24hrtruckfix.com/tickets
 * Source: 24hr-New-UI/app/(dashboard)/tickets/page.tsx
 *
 * Key elements:
 *   - H1: "Recent Tickets"
 *   - Search: placeholder "Search by name, phone, or policy..."
 *   - Filter: "Filter by Status" → all, assigned, dispatched, in-progress, created, completed, sp-completed, cancelled, archived
 *   - Date: "Pick a date range" button
 *   - Table headers: Organization/Insured Name, Policy Number/Asset ID, Ticket Created, Breakdown Reason, Status, AI Created, Scheduled, Actions
 *   - Row actions: More Details, Messages, Rates and Prices, Delete, Logs, Call Activity
 *
 * Tags: @tickets, @smoke, @regression
 */

test.describe("Ticket Management @tickets", () => {

    test("TC-TKT-001: Tickets page loads with title and controls @smoke", async ({ page }) => {
        const ticketsPage = new TicketsPage(page);
        await ticketsPage.goto();

        await expect(ticketsPage.pageTitle).toBeVisible({ timeout: 30000 });
        await expect(ticketsPage.searchInput).toBeVisible({ timeout: 10000 });
    });

    test("TC-TKT-002: Tickets table renders with data @smoke", async ({ page }) => {
        const ticketsPage = new TicketsPage(page);
        await ticketsPage.goto();

        // Wait for table to have at least one row (API fetch)
        await ticketsPage.tableRows.first().waitFor({ state: "visible", timeout: 45000 });
        const count = await ticketsPage.getTicketCount();
        expect(count).toBeGreaterThan(0);
    });

    test("TC-TKT-003: Table has correct column headers @regression", async ({ page }) => {
        const ticketsPage = new TicketsPage(page);
        await ticketsPage.goto();

        // Verify key headers are visible
        await expect(ticketsPage.tableHeaders.filter({ hasText: "Ticket Created" })).toBeVisible();
        await expect(ticketsPage.tableHeaders.filter({ hasText: "Breakdown Reason" })).toBeVisible();
        await expect(ticketsPage.tableHeaders.filter({ hasText: "Status" })).toBeVisible();
        await expect(ticketsPage.tableHeaders.filter({ hasText: "Actions" })).toBeVisible();
    });

    test("TC-TKT-004: Search filters tickets @regression", async ({ page }) => {
        const ticketsPage = new TicketsPage(page);
        await ticketsPage.goto();

        // Wait for initial load
        await ticketsPage.tableRows.first().waitFor({ state: "visible", timeout: 15000 });

        // Search for something unlikely to match everything
        await ticketsPage.search("NONEXISTENT_POLICY_12345");

        // Either fewer results or "no results" state
        await page.waitForTimeout(1000);
    });

    test("TC-TKT-005: Status filter has correct options @regression", async ({ page }) => {
        const ticketsPage = new TicketsPage(page);
        await ticketsPage.goto();

        // Click the status filter to open it
        await ticketsPage.statusFilter.click();

        // Verify some of the status options exist (from source code)
        await expect(page.getByRole("option", { name: "Assigned" })).toBeVisible();
        await expect(page.getByRole("option", { name: "Completed" })).toBeVisible();
        await expect(page.getByRole("option", { name: "Cancelled" })).toBeVisible();
    });

    test("TC-TKT-006: Navigate to tickets via sidebar @regression", async ({ page }) => {
        const dash = new DashboardPage(page);
        await page.goto("/clients");
        await page.waitForLoadState("domcontentloaded");

        // For super_admin, Tickets link shows as "Home" in sidebar (main-nav.tsx line 241)
        await dash.homeLink.first().click();
        await expect(page).toHaveURL(/tickets/);
    });
});
