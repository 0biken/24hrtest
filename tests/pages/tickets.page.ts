import { type Page, type Locator } from "@playwright/test";

/**
 * Tickets Page Object Model
 *
 * Source: 24hr-New-UI/app/(dashboard)/tickets/page.tsx
 *
 * Key elements:
 *   - Heading: "Recent Tickets" (h1)
 *   - Search input: placeholder "Search by name, phone, or policy..."
 *   - Status filter: Select with "Filter by Status" placeholder
 *     Values: all, assigned, dispatched, in-progress, created, completed, sp-completed, cancelled, archived
 *   - Date picker: Button "Pick a date range"
 *   - Table headers: Organization|Insured Name, Policy Number|Asset ID, Ticket Created, Breakdown Reason, Status, AI Created, Scheduled, Actions
 *   - Each row has a MoreVertical (⋮) menu with: More Details, Messages, Rates and Prices, Delete, Logs, Call Activity
 */
export class TicketsPage {
    readonly page: Page;

    // Page-level elements
    readonly pageTitle: Locator;
    readonly searchInput: Locator;
    readonly statusFilter: Locator;
    readonly dateRangePicker: Locator;

    // Table
    readonly ticketTable: Locator;
    readonly tableRows: Locator;
    readonly tableHeaders: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageTitle = page.getByRole("heading", { name: "Recent Tickets" });
        this.searchInput = page.getByPlaceholder("Search by name, phone, or policy...");
        this.statusFilter = page.getByRole("combobox").first();
        this.dateRangePicker = page.getByRole("button", { name: /pick a date range/i });

        this.ticketTable = page.locator("table");
        this.tableRows = page.locator("table tbody tr");
        this.tableHeaders = page.locator("table thead th");
    }

    async goto() {
        await this.page.goto("/tickets", { waitUntil: "domcontentloaded" });
    }

    async gotoTicket(ticketId: string) {
        await this.page.goto(`/tickets/${ticketId}`);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async search(query: string) {
        await this.searchInput.fill(query);
        // Debounced — wait 600ms for search to trigger
        await this.page.waitForTimeout(600);
    }

    async filterByStatus(status: string) {
        await this.statusFilter.click();
        await this.page.getByRole("option", { name: status }).click();
    }

    async getTicketCount() {
        return await this.tableRows.count();
    }

    async clickTicketActions(rowIndex: number) {
        const row = this.tableRows.nth(rowIndex);
        await row.getByRole("button").click();
    }
}
