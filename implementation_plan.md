# HubSpot Health Check Tool: Implementation Plan

This plan outlines the creation of a gated online tool designed to audit HubSpot instances and generate leads.

## User Review Required
> [!IMPORTANT]
> **Subdomain Deployment**: The tool will be developed as a standalone app to be hosted on a subdomain (e.g., `audit.yourbrand.com`). This ensures zero risk to the main site and allows for rapid, independent updates.
> [!NOTE]
> **Authentication Method**: We recommend using **OAuth 2.0 (Read-Only)** for the "Instant Audit". This is the gold standard for security. Users will see exactly what data we are requesting (Read-only access to CRM objects).

## Proposed Changes

### [Component] Lead Generation App (Side App)
A standalone web application built with **Next.js** and **Vanilla CSS**.

#### [NEW] `index.html` (Landing Page)
- High-impact hero section: "Is your HubSpot Portal healthy?"
- First Name & Email capture form.
- Choice between "Instant Automated Audit" and "10-Minute Manual Audit".

#### [NEW] `auth/hubspot` (OAuth Flow)
- Secure OAuth 2.0 integration.
- Scopes: `crm.objects.contacts.read`, `crm.objects.companies.read`, `crm.objects.deals.read`, `settings.users.read`.
- No data storage of actual CRM records—only the **audit results/scores** will be saved.

#### [NEW] `audit-engine.js` (Logic)
Calculates scores based on:
1. **Data Hygiene**: Duplicate detection (approximate via API search).
2. **Setup Consistency**: Checking for default property usage vs. empty fields.
3. **Usage Stats**: Basic checks for inactive users or empty pipelines.

#### [NEW] `report-dashboard.js` (Result)
- A "WebGrader" style report.
- Visual score (0-100).
- Categorized findings (Performance, Security, Data Quality).
- Call-to-Action: "Book an Audit Strategy Call."

## Verification Plan

### Automated Tests
- Mock HubSpot API responses to verify the scoring engine logic.
- Browser-based tests (Playwright/Cypress) to ensure the lead capture form functions and redirects correctly.

### Manual Verification
1. **User Flow Test**: Walk through the "Gated" entry to ensure email validation works.
2. **OAuth Handshake**: Verify the redirection to HubSpot and back.
3. **Privacy Check**: Ensure that no sensitive CRM data (Names, PII) is stored on our server, only the audit metrics.
