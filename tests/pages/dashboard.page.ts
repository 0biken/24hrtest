import { type Page, type Locator } from "@playwright/test";

/**
 * Dashboard Page Object Model
 *
 * Source: 24hr-New-UI/components/main-nav.tsx  (sidebar)
 *         24hr-New-UI/components/top-nav.tsx   (header)
 *
 * Sidebar links for admin/super_admin/ai role:
 *   "Home" → /tickets       (icon: Home)
 *   "Global Agent" → /chat  (icon: BotMessageSquare, custom ChatNavItem component)
 *   "Safety" → /safety      (expandable, custom SafetyNavItem component)
 *   "Tasks" → /tasks        (icon: CheckSquare, has badge)
 *   "Agents" → /agents      (icon: Users)
 *   "Call Activity" → /ai-activity   (icon: Brain)
 *   "Service Providers" → /service-providers  (icon: Wrench)
 *   "Clients" → /clients    (icon: UserCircle, has badge)
 *   "Messages" → /message   (icon: MessagesSquare, has badge)
 *   "Applications" → /sp-applications (icon: Contact)
 *
 * Top nav (header):
 *   - ThemeToggle
 *   - Bell icon (notifications)
 *   - Avatar dropdown → Profile (/profile), Settings (/settings), Log out
 */
export class DashboardPage {
    readonly page: Page;

    // Sidebar (from main-nav.tsx)
    readonly sidebar: Locator;
    readonly homeLink: Locator;
    readonly ticketsLink: Locator;
    readonly agentsLink: Locator;
    readonly clientsLink: Locator;
    readonly serviceProvidersLink: Locator;
    readonly tasksLink: Locator;
    readonly messagesLink: Locator;
    readonly applicationsLink: Locator;

    // Header (from top-nav.tsx)
    readonly header: Locator;
    readonly notificationBell: Locator;
    readonly avatarButton: Locator;
    readonly profileMenuItem: Locator;
    readonly settingsMenuItem: Locator;
    readonly logoutMenuItem: Locator;

    constructor(page: Page) {
        this.page = page;

        // Sidebar: nav links render as <Link> with <span>{label}</span>
        this.sidebar = page.locator("nav");
        this.homeLink = page.getByRole("link", { name: "Home" });
        this.ticketsLink = page.getByRole("link", { name: "Tickets" }).first();
        this.agentsLink = page.getByRole("link", { name: "Agents" });
        this.clientsLink = page.getByRole("link", { name: "Clients" });
        this.serviceProvidersLink = page.getByRole("link", { name: "Service Providers" });
        this.tasksLink = page.getByRole("link", { name: "Tasks" });
        this.messagesLink = page.getByRole("link", { name: "Messages" });
        this.applicationsLink = page.getByRole("link", { name: "Applications" });

        // Header: top-nav has border-b, h-16
        this.header = page.locator(".h-16.border-b");
        this.notificationBell = page.locator("button").filter({ has: page.locator(".lucide-bell") });
        // Avatar trigger button from top-nav.tsx: <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        this.avatarButton = page.locator('button.rounded-full, button[class*="rounded-full"]').first();

        // Dropdown menu items (visible after clicking avatar)
        this.profileMenuItem = page.getByRole("menuitem").filter({ hasText: "Profile" });
        this.settingsMenuItem = page.getByRole("menuitem").filter({ hasText: "Settings" });
        this.logoutMenuItem = page.getByRole("menuitem").filter({ hasText: "Log out" });
    }

    async goto() {
        await this.page.goto("/tickets", { waitUntil: "domcontentloaded" });
    }

    async navigateTo(section: string) {
        await this.page.getByRole("link", { name: section }).click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async openUserMenu() {
        // From screenshot: header (.h-16) contains buttons: theme toggle, bell, avatar (last)
        const header = this.page.locator('.h-16');
        const avatarBtn = header.getByRole('button').last();
        await avatarBtn.click();
        // Wait for dropdown to appear
        await this.page.waitForTimeout(500);
    }

    async logout() {
        await this.openUserMenu();
        // Radix DropdownMenuItem may use 'menuitem' role or just render as div/button
        // Try role-based first, then text-based fallback
        const logoutBtn = this.page.getByText('Log out').first();
        await logoutBtn.waitFor({ state: 'visible', timeout: 5000 });
        await logoutBtn.click();
        await this.page.waitForURL('**/auth/signin**', { timeout: 30000 });
    }
}
