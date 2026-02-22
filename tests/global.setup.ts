import { test as setup, expect } from "@playwright/test";
import path from "path";

const adminAuthFile = path.join(__dirname, "../playwright/.auth/admin.json");

/**
 * Global Setup — Authenticates as Admin and saves browser state.
 *
 * Targets: https://dev.24hrtruckfix.com
 *
 * IMPORTANT: The signin page has a useEffect that calls logOut() on mount
 * (clears cookies + localStorage). We must wait for React to fully hydrate
 * and the logout effect to complete before filling credentials.
 *
 * All projects that depend on "auth-setup" will reuse this
 * authenticated session, so login only runs once per test suite.
 */
setup("authenticate as admin", async ({ page }) => {
    // Give setup extra time — dev server can be slow
    setup.setTimeout(120000);

    const email = process.env.ADMIN_EMAIL!;
    const password = process.env.ADMIN_PASSWORD!;

    // 1. Navigate to login page
    await page.goto("/auth/signin", { waitUntil: "domcontentloaded" });

    // 2. Wait for React to hydrate — the #email input must be visible & ready
    await page.locator("#email").waitFor({ state: "visible", timeout: 30000 });

    // 3. Small delay to let the signin page's logOut() useEffect complete
    //    (it clears cookies + localStorage on mount)
    await page.waitForTimeout(2000);

    // 4. Fill credentials
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);

    // 5. Click sign in
    await page.getByRole("button", { name: /sign in/i }).click();

    // 6. Handle 2FA if the app redirects to /auth/2fa-auth
    const went2FA = await page
        .waitForURL("**/auth/2fa-auth**", { timeout: 10000 })
        .then(() => true)
        .catch(() => false);

    if (went2FA) {
        const codeInput = page.locator('input[type="text"], input[type="number"]').first();
        await codeInput.fill(process.env.TEST_2FA_CODE || "123456");
        await page.getByRole("button", { name: /verify|submit|confirm/i }).click();
    }

    // 7. Wait for dashboard to load (confirms successful login)
    //    Admin/super_admin redirects to /tickets
    await page.waitForURL("**/tickets**", { timeout: 60000 });

    // 8. Save authenticated state
    await page.context().storageState({ path: adminAuthFile });
});
