# Capstone 07 — Multi-Tenant SaaS Backend

## Context

Building a single-tenant application is a solved problem. Building a multi-tenant application — where multiple customers share the same infrastructure but are completely isolated from each other — introduces a class of problems that do not exist in single-tenant systems.

Most of these problems are architectural: how do you store data for 1,000 tenants without leaking data between them? How do you ensure that a single misbehaving tenant cannot degrade service for others? How do you track usage per tenant for billing? How do you onboard a new tenant in seconds, not hours?

This capstone builds a production-quality multi-tenant SaaS backend. The domain is simple (it does not matter); the multi-tenancy architecture is the point.

## Primary domains

| Domain | What this capstone exercises |
| --- | --- |
| `architecture` | database-per-service, shared database, RBAC, rate limiting per tenant, resilience |
| `design-patterns` | strategy (tenant isolation strategy), factory (tenant provisioning), decorator |
| `devops` | per-tenant IaC, tenant-scoped observability, cost per tenant |
| `advanced-engineering` | security and trust boundaries, tenant data isolation |

## What you'll build

**Tenant model**: choose a data isolation strategy (see milestone 1 for the three options). Implement it. Document why you chose it and what you would change at different scales.

**Tenant-scoped authentication**: every request carries a tenant identifier. The authentication system validates both the user and the tenant. Users cannot access other tenants' data — this is tested, not assumed.

**Tenant provisioning automation**: onboarding a new tenant is automated. A single API call (or a simple admin action) creates the tenant record, provisions the necessary resources, and makes the tenant operational. No manual steps.

**Per-tenant usage tracking**: every significant action is attributed to a tenant. This forms the basis for billing: how many API calls, how much storage, how many users, what features were used.

**Tenant administration API**: a set of endpoints that allow tenant admins to manage their tenant: add/remove users, configure tenant settings, view their usage, generate data exports.

**Tenant-scoped observability**: errors, latency, and usage are broken down by tenant. You can answer: which tenant is consuming the most resources? Which tenant is experiencing the most errors?

## Milestones

### Milestone 1: Choose and implement a data isolation strategy (4-8 hours)
There are three common strategies. Understand all three, choose one, and implement it. Write an ADR.

**Strategy A — Database per tenant**: each tenant gets their own database instance. Strongest isolation; most expensive; simplest code (no tenant filter needed).

**Strategy B — Schema per tenant** (Postgres): each tenant gets their own schema within a shared database server. Moderate isolation; moderate cost; requires schema management automation.

**Strategy C — Row-level security**: all tenants share tables; every row has a `tenant_id` column; the application enforces a filter on every query. Least expensive; highest risk of data leaks if a query is missing the filter; requires discipline.

**Deliverable**: your chosen strategy implemented for one table. An ADR explaining your choice and what you would change at 10x the tenant count. A test that attempts to read another tenant's data and confirms it fails.

---

### Milestone 2: Tenant-scoped authentication (4-6 hours)
Build an authentication system where every token carries both user identity and tenant identity. Middleware validates both. Every data access is automatically scoped to the authenticated tenant.

The critical test: can a valid user from Tenant A read Tenant B's data by changing a parameter in the request? The answer must be "no" and this must be verified by a test.

**Deliverable**: working authentication with tenant scoping. A test suite that verifies cross-tenant data access is impossible through at least 5 different attack vectors (path parameter, query parameter, request body, header manipulation, token manipulation).

---

### Milestone 3: Tenant provisioning automation (3-5 hours)
Build an API endpoint that provisions a new tenant. The endpoint should: create the tenant record, set up the tenant's data isolation boundary (database, schema, or seed row-level security depending on your strategy), create a default admin user, and return credentials.

The entire process should complete in under 10 seconds. No manual steps.

**Deliverable**: working provisioning endpoint. An end-to-end test: call the endpoint, verify the new tenant is fully operational, verify the new tenant is isolated from existing tenants.

---

### Milestone 4: Per-tenant rate limiting (2-4 hours)
Tenants share infrastructure. A misbehaving tenant (or a DDoS against a tenant's endpoints) should not degrade service for other tenants. Implement per-tenant rate limiting.

Also implement tenant tiers if relevant: a "premium" tenant has a higher rate limit than a "free" tenant. The tier is set at tenant creation and can be changed by an admin.

**Deliverable**: working per-tenant rate limiting. A test that confirms a throttled tenant cannot exceed their limit while other tenants are unaffected.

---

### Milestone 5: Usage tracking and billing primitives (4-6 hours)
Track usage per tenant. At minimum: API call count, data storage volume, active user count. These metrics should be accessible via the admin API and via an internal billing report.

Design the usage model: is usage tracked in real-time (a counter per API call) or batched (aggregated hourly)? What are the trade-offs? Write an ADR.

**Deliverable**: usage tracking implemented. An admin API endpoint that returns tenant usage for a configurable period. An ADR for the real-time vs. batched tracking decision.

---

### Milestone 6: Data export (GDPR primitive) (3-5 hours)
Tenants have a right to export all their data. Build a data export endpoint: given a request to export all data for a tenant, produce a complete, machine-readable export of every record owned by that tenant. The export should be complete (no hidden tables), structured (not a database dump), and downloadable.

This is also a good test of your isolation strategy: the export should contain exactly the requesting tenant's data and nothing else.

**Deliverable**: working data export. A test that verifies the export is complete and contains no other tenants' data.

---

### Milestone 7: Tenant-scoped observability (3-5 hours)
Add tenant dimension to your observability. Every metric and every error should be attributable to a tenant. Build a dashboard that shows: request count per tenant, error rate per tenant, latency per tenant, and usage per tenant. The dashboard should make it immediately visible if one tenant is behaving abnormally.

**Deliverable**: working per-tenant observability. A demo: simulate one tenant making 10x their normal request volume and show it is visible in the dashboard without affecting other tenants' metrics.

---

### Milestone 8: IaC for tenant infrastructure (4-6 hours)
If your isolation strategy requires per-tenant infrastructure (database per tenant) or per-tenant configuration (schema creation), make this part of the provisioning automation in IaC terms. The provisioning API should trigger IaC execution as part of tenant onboarding.

If you chose row-level security (no per-tenant infrastructure), use this milestone to build a deployment pipeline that can handle schema migrations across all tenants simultaneously and safely.

**Deliverable**: tenant provisioning that involves IaC execution. Documentation of the migration strategy: how do you add a column to a table that has 1,000 tenants' data?

---

## Technical guidance

**The isolation strategy is the most important decision you make**. Don't just pick the one that seems easiest to implement — pick the one you can justify based on isolation requirements, cost constraints, and operational complexity. Once you're in production with 100 tenants, switching strategies requires a full data migration.

**The cross-tenant data access test is non-negotiable**. You cannot claim your multi-tenant system is secure without a test that explicitly attempts cross-tenant access through multiple vectors. Tenant data leaks are catastrophic and often invisible until they become a breach.

**Test with at least 3 tenants from the start**. Many multi-tenancy bugs only appear when there are multiple tenants with overlapping operations. If you test with only one tenant, you will miss an entire class of bugs.

**Usage tracking shapes your billing model**. The usage data you track now determines what billing models you can offer later. Think about what dimensions of usage matter before implementing — adding a new usage dimension later is harder than getting it right initially.

## Skills to build while working on this capstone

- `/tenant-provision <name>` — provisions a new test tenant and returns credentials
- `/tenant-report <tenant-id>` — generates a usage report for a specific tenant
- `/isolation-test` — runs the cross-tenant isolation test suite and reports any failures

## Further depth

- `software-engineering/architecture/06-data/database-per-service/`
- `software-engineering/architecture/06-data/shared-database/`
- `software-engineering/advanced-engineering/04-security-and-trust-boundaries/`
- `software-engineering/architecture/07-resilience-and-scale/rate-limiting/`
