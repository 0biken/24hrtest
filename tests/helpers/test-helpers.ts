import { type Page, type APIRequestContext } from "@playwright/test";

/**
 * Test Helpers — Shared utilities for all tests.
 */

/**
 * Wait for API response and return parsed JSON
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
    const response = await page.waitForResponse(
        (resp) =>
            typeof urlPattern === "string"
                ? resp.url().includes(urlPattern)
                : urlPattern.test(resp.url())
    );
    return {
        status: response.status(),
        body: await response.json().catch(() => null),
    };
}

/**
 * Take a labeled screenshot for debugging
 */
export async function screenshot(page: Page, name: string) {
    await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}

/**
 * Generate a unique string for test data (avoids collisions)
 */
export function uniqueId(prefix = "test"): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * API helper — make authenticated API calls within tests
 */
export async function apiRequest(
    request: APIRequestContext,
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    options?: { data?: Record<string, unknown>; token?: string }
) {
    const baseUrl = process.env.API_BASE_URL || "https://api.24hrtruckfix.com";
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (options?.token) {
        headers["Authorization"] = `Bearer ${options.token}`;
    }

    const response = await request[method.toLowerCase() as "get" | "post" | "put" | "delete"](
        `${baseUrl}${endpoint}`,
        {
            data: options?.data,
            headers,
        }
    );

    return {
        status: response.status(),
        body: await response.json().catch(() => null),
    };
}
