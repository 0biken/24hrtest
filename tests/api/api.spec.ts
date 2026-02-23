import { test, expect } from "@playwright/test";
import { apiRequest } from "../helpers/test-helpers";

/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  API TEST SUITE — 24hourservice-Backend              ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Tags: @api
 * Priority: P0/P1
 *
 * Validates actual backend endpoints from 24hourservice-Backend.
 * Endpoints sourced from: src/routes/auth.routes.js, ticket.routes.js, etc.
 *
 * Run backend first: cd 24hourservice-Backend && node app.js
 */

test.describe("API Tests — Backend @api", () => {
    let authToken: string;

    // ─── Health Check ────────────────────────────────────

    test("API-HEALTH-001: Health endpoint returns OK @smoke", async ({ request }) => {
        const response = await apiRequest(request, "GET", "/health");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "ok");
    });

    // ─── Authentication Endpoints (/api/v1/) ─────────────

    test("API-AUTH-001: Login with valid credentials returns token", async ({ request }) => {
        const response = await apiRequest(request, "POST", "/api/v1/loginUser", {
            data: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            },
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        authToken = response.body?.token;
    });

    test("API-AUTH-002: Login with invalid password returns error", async ({ request }) => {
        const response = await apiRequest(request, "POST", "/api/v1/loginUser", {
            data: {
                email: process.env.ADMIN_EMAIL,
                password: "WrongPassword123!",
            },
        });

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test("API-AUTH-003: Login with missing email returns error", async ({ request }) => {
        const response = await apiRequest(request, "POST", "/api/v1/loginUser", {
            data: {
                password: "SomePassword123!",
            },
        });

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test("API-AUTH-004: Get profile without token returns 401", async ({ request }) => {
        const response = await apiRequest(request, "GET", "/api/v1/profile");

        expect(response.status).toBe(401);
    });

    test("API-AUTH-005: Get profile with valid token returns user", async ({ request }) => {
        // First login to get a token
        const loginResp = await apiRequest(request, "POST", "/api/v1/loginUser", {
            data: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            },
        });
        const token = loginResp.body?.token;

        const response = await apiRequest(request, "GET", "/api/v1/profile", {
            token,
        });

        expect(response.status).toBe(200);
    });

    // ─── Users Endpoints ─────────────────────────────────

    test("API-USR-001: List users", async ({ request }) => {
        const loginResp = await apiRequest(request, "POST", "/api/v1/loginUser", {
            data: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            },
        });
        const token = loginResp.body?.token;

        const response = await apiRequest(request, "GET", "/api/v1/users", {
            token,
        });

        expect(response.status).toBe(200);
    });

    // ─── Tickets Endpoints ───────────────────────────────

    test("API-TKT-001: List tickets (authenticated)", async ({ request }) => {
        const loginResp = await apiRequest(request, "POST", "/api/v1/loginUser", {
            data: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            },
        });
        const token = loginResp.body?.token;

        const response = await apiRequest(request, "GET", "/api/v1/tickets", {
            token,
        });

        expect(response.status).toBe(200);
    });

    test("API-TKT-002: List tickets without token returns 401", async ({ request }) => {
        const response = await apiRequest(request, "GET", "/api/v1/tickets");

        expect(response.status).toBe(401);
    });

    // ─── Organization ────────────────────────────────────

    test("API-ORG-001: Get organization (authenticated)", async ({ request }) => {
        const loginResp = await apiRequest(request, "POST", "/api/v1/loginUser", {
            data: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            },
        });
        const token = loginResp.body?.token;

        const response = await apiRequest(request, "GET", "/api/v1/organizations", {
            token,
        });

        expect(response.status).toBe(200);
    });

    // ─── Service Providers ───────────────────────────────

    test("API-SP-001: List service providers (authenticated)", async ({ request }) => {
        const loginResp = await apiRequest(request, "POST", "/api/v1/loginUser", {
            data: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            },
        });
        const token = loginResp.body?.token;

        const response = await apiRequest(request, "GET", "/api/v1/service-providers", {
            token,
        });

        expect(response.status).toBe(200);
    });

    // ─── Drivers ─────────────────────────────────────────

    test("API-DRV-001: List drivers (authenticated)", async ({ request }) => {
        const loginResp = await apiRequest(request, "POST", "/api/v1/loginUser", {
            data: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            },
        });
        const token = loginResp.body?.token;

        const response = await apiRequest(request, "GET", "/api/v1/drivers", {
            token,
        });

        expect(response.status).toBe(200);
    });

    // ─── Policies ────────────────────────────────────────

    test("API-POL-001: List policies (authenticated)", async ({ request }) => {
        const loginResp = await apiRequest(request, "POST", "/api/v1/loginUser", {
            data: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            },
        });
        const token = loginResp.body?.token;

        const response = await apiRequest(request, "GET", "/api/v1/policies", {
            token,
        });

        expect(response.status).toBe(200);
    });
});
