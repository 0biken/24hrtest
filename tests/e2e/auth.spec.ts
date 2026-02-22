import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  AUTH TEST SUITE — Login, Logout & Access Control    ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * IMPORTANT: Auth tests use a FRESH browser context (no stored auth)
 * so that the login page is actually visible.
 *
 * Source: 24hr-New-UI/app/(auth)/auth/signin/page.tsx
 */

// Use a fresh context for ALL auth tests — no storageState
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Authentication @auth", () => {

    test("TC-AUTH-001: Login page loads with correct elements @smoke", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await expect(loginPage.cardTitle).toBeVisible();
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.signInButton).toBeVisible();
        await expect(loginPage.forgotPasswordLink).toBeVisible();
        await expect(loginPage.signUpLink).toBeVisible();
    });

    test("TC-AUTH-002: Valid admin login redirects to /tickets @smoke", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.login(
            process.env.ADMIN_EMAIL!,
            process.env.ADMIN_PASSWORD!
        );

        // Handle 2FA if the app redirects to /auth/2fa-auth
        const went2FA = await page
            .waitForURL("**/auth/2fa-auth**", { timeout: 8000 })
            .then(() => true)
            .catch(() => false);

        if (went2FA) {
            const codeInput = page.locator('input[type="text"], input[type="number"]').first();
            await codeInput.fill(process.env.TEST_2FA_CODE || "123456");
            await page.getByRole("button", { name: /verify|submit|confirm/i }).click();
        }

        // Admin/super_admin goes to /tickets
        await loginPage.expectRedirectToDashboard();
    });

    test("TC-AUTH-003: Invalid password shows error toast @regression", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.login(process.env.ADMIN_EMAIL!, "WrongPassword!@#123");

        // Sonner toast with error
        await loginPage.expectError();
        await expect(page).toHaveURL(/signin/);
    });

    test("TC-AUTH-004: Empty submit triggers validation @regression", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.signInButton.click();

        // react-hook-form fires toast.error for required fields
        const toastOrValidation = await page
            .locator('[data-sonner-toast]')
            .first()
            .isVisible({ timeout: 5000 })
            .catch(() => false);

        expect(toastOrValidation).toBeTruthy();
    });

    test("TC-AUTH-005: Forgot password navigates to /auth/forgot-password @regression", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.forgotPasswordLink.click();
        await expect(page).toHaveURL(/forgot-password/);
    });

    test("TC-AUTH-006: Sign up link navigates to /auth/signup @regression", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.signUpLink.click();
        await expect(page).toHaveURL(/signup/);
    });

    test("TC-AUTH-007: Unauthenticated access to /tickets redirects to login @smoke", async ({ page }) => {
        // Already using fresh context via test.use above (no cookies/storage)
        await page.goto("/tickets");
        await page.waitForLoadState("domcontentloaded");

        // The app may redirect server-side or client-side to signin
        // Wait up to 15s for a redirect to happen
        await page.waitForURL(/signin|login|auth/, { timeout: 15000 }).catch(() => { });

        // Check if we ended up on an auth page, OR if the page is empty/loads signin
        const url = page.url();
        const isOnAuth = /signin|login|auth/.test(url);
        const hasLoginForm = await page.locator("#email").isVisible({ timeout: 3000 }).catch(() => false);

        expect(isOnAuth || hasLoginForm).toBeTruthy();
    });

    test("TC-AUTH-008: Password visibility toggle works @regression", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await expect(loginPage.passwordInput).toHaveAttribute("type", "password");

        await loginPage.passwordToggle.click();
        await expect(loginPage.passwordInput).toHaveAttribute("type", "text");

        await loginPage.passwordToggle.click();
        await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
    });
});
