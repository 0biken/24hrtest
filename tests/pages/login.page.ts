import { type Page, type Locator } from "@playwright/test";

/**
 * Login Page Object Model
 *
 * Source: 24hr-New-UI/app/(auth)/auth/signin/page.tsx
 *
 * Elements:
 *   - Input #email (Label: "Email", placeholder: "Enter your email")
 *   - Input #password (Label: "Password", placeholder: "Enter your password")
 *   - Button "Sign In" (type=submit, shows "Signing in..." when loading)
 *   - Eye/EyeOff toggle button for password visibility
 *   - Link "Forgot your password?" → /auth/forgot-password
 *   - Link "Sign up" → /auth/signup
 *   - Card title: "Sign in to your account"
 */
export class LoginPage {
    readonly page: Page;

    // Form elements (matched to actual DOM from signin/page.tsx)
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly passwordToggle: Locator;
    readonly forgotPasswordLink: Locator;
    readonly signUpLink: Locator;
    readonly cardTitle: Locator;
    readonly errorToast: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.signInButton = page.getByRole("button", { name: /sign in/i });
        this.passwordToggle = page.locator('button[type="button"]').filter({ has: page.locator('.lucide-eye, .lucide-eye-off') });
        this.forgotPasswordLink = page.getByRole("link", { name: /forgot your password/i });
        this.signUpLink = page.getByRole("link", { name: /sign up/i });
        this.cardTitle = page.getByText("Sign in to your account", { exact: true });
        this.errorToast = page.locator('[data-sonner-toast][data-type="error"]');
    }

    async goto() {
        await this.page.goto("/auth/signin", { waitUntil: "domcontentloaded" });
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

    /** After successful admin login, app redirects to /tickets */
    async expectRedirectToDashboard() {
        await this.page.waitForURL("**/tickets**", { timeout: 30000 });
    }

    /** Check for sonner error toast */
    async expectError() {
        await this.errorToast.waitFor({ state: "visible", timeout: 10000 });
    }
}
