# Capstone 03 — Production API Platform

## Context

Most APIs built in courses and tutorials work correctly under ideal conditions: authenticated requests, valid input, cooperative clients, healthy downstream services. Production APIs work under adversarial conditions: unauthenticated traffic, malformed input, DDoS attempts, slow or unavailable dependencies, and clients that retry incorrectly.

This capstone asks you to build an API that is production-ready in the full sense: secure, observable, resilient, deployable, and operable. Not production-like — actually deployable and runnable.

The domain of the API is secondary. The architecture and operational properties are the point.

## Primary domains

| Domain | What this capstone exercises |
| --- | --- |
| `architecture` | API gateway, rate limiting, circuit breaker, caching, resilience patterns, authentication |
| `design-patterns` | decorator, proxy, chain of responsibility, command, facade |
| `devops` | IaC, CI/CD, observability, SLO definitions |
| `advanced-engineering` | security and trust boundaries, testing and verification |

## What you'll build

A REST API with a simple domain (choose one: task management, inventory, short URLs, or bookmarks — it does not matter). The domain is small so the infrastructure work is the focus.

**Core API**: CRUD operations for your chosen domain. Standard REST conventions. Validation on all inputs. Proper HTTP status codes. Idempotent writes where appropriate.

**Authentication**: JWT-based auth with access tokens and refresh tokens. Endpoints that require authentication should not be reachable without a valid token — not just a missing check, but a tested guarantee.

**Rate limiting**: per-user and per-endpoint rate limiting with sensible defaults. 429 responses with `Retry-After` headers. Rate limit headers on every response (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`).

**Circuit breaker**: if your API calls a downstream service (add one: a fake notification service, a fake payments service), the circuit breaker prevents cascading failures when the downstream is slow or unavailable.

**Distributed tracing**: every request gets a trace ID. Every downstream call includes the trace ID. Logs reference the trace ID. Given a trace ID, you can reconstruct the complete request path.

**Infrastructure as Code**: every resource is defined in IaC. No manual portal operations. The entire infrastructure can be destroyed and recreated from code.

**CI/CD pipeline**: on push to main, the pipeline runs tests, builds the container, pushes to a registry, and deploys. No manual deployment steps.

**SLO dashboard**: latency (p50, p95, p99), error rate, and throughput visible in a dashboard. At least one SLO defined with a burn rate alert.

## Milestones

### Milestone 1: Core API with validation (3-5 hours)
Build the CRUD API for your chosen domain. Every endpoint validates its inputs — not just "required field missing" but meaningful validation (field formats, value ranges, business rules). Invalid requests return structured error responses, not stack traces.

**Deliverable**: all endpoints working with tests. A test that confirms invalid inputs are rejected. A test that confirms error responses are structured consistently.

---

### Milestone 2: Authentication (4-6 hours)
Add JWT authentication. Access tokens expire after a short period (15 minutes). Refresh tokens allow clients to get new access tokens without re-authenticating. All protected endpoints require valid tokens — test this by confirming every endpoint returns 401 without a token and 200 with a valid one.

Write a threat model: what could go wrong with your auth implementation? What attacks does it not defend against? Be honest.

**Deliverable**: auth working end-to-end. A documented threat model (even a short one). At minimum one security test that attempts an attack your implementation should block.

---

### Milestone 3: Rate limiting (3-5 hours)
Implement per-user rate limiting. When a user exceeds their rate limit, return 429 with a `Retry-After` header. When they are within limits, include rate limit headers in every response. Test that rate limiting cannot be bypassed by changing user agents or IP addresses.

Decision to document: where does rate limiting state live? (In-memory? Redis? Database?) What are the trade-offs between these options at different scales? This is a real architectural decision — write an ADR for it.

**Deliverable**: rate limiting working with tests. An ADR for the rate limit storage decision.

---

### Milestone 4: Circuit breaker and resilience (4-6 hours)
Add a downstream service dependency (implement a simple fake service alongside your API). Call it from one or more of your endpoints. Add a circuit breaker: when the downstream service fails too many times in a window, stop calling it and return a degraded response instead of failing hard.

The degraded response is a design question: what should the client receive when the downstream is unavailable? An error? Cached data? A partial response? There is no universally correct answer — write a design doc.

**Deliverable**: circuit breaker working and tested. Tests that simulate downstream failure and verify the circuit breaker fires. A design doc explaining the degraded response decision.

---

### Milestone 5: Distributed tracing (3-5 hours)
Add a trace ID to every request. Log it. Pass it to downstream calls. Given a trace ID, reconstruct the complete lifecycle of a request. This is not about adding an APM tool — it is about making the concept explicit in your implementation, then optionally adding a tool on top.

**Deliverable**: every request log contains a trace ID. You can grep for a trace ID and see all log lines for that request, including downstream calls.

---

### Milestone 6: Infrastructure as Code (4-8 hours)
Define all infrastructure in Bicep (Azure) or equivalent IaC. This includes: compute resource, database, cache, container registry, networking if applicable. Destroy everything and recreate from IaC to verify completeness.

**Deliverable**: complete IaC. A documented runbook section: "recreate from scratch in under 30 minutes."

---

### Milestone 7: CI/CD pipeline (3-5 hours)
Build a pipeline: test → build → push → deploy. No manual steps. The pipeline should fail fast — if tests fail, the build doesn't proceed. The deployment should be the same image that passed tests (promote by digest, not by tag).

**Deliverable**: working pipeline. A demo of end-to-end: push code to main, watch the pipeline, verify the deployment. A note on the failure modes: what breaks and how would you know?

---

### Milestone 8: SLO dashboard and alerting (3-5 hours)
Define one SLO: "99th percentile latency under 500ms for 99.9% of requests in a 30-day window." Wire an alert that fires when the error budget burn rate is high. Build a dashboard with latency, error rate, and throughput.

**Deliverable**: a working dashboard that you would actually look at if something went wrong. An honest assessment: what does this dashboard tell you that you couldn't learn from logs alone?

---

## Technical guidance

**Domain choice is a distraction**. Spend 10 minutes deciding and move on. The interesting work is in the infrastructure, not the domain.

**Test the auth failure cases as carefully as the success cases**. Most auth implementations are tested for "valid token works." The important tests are "missing token returns 401," "expired token returns 401," "token for a different user cannot access another user's resource."

**Write a realistic threat model**. A threat model is not a list of attack types you have heard of. It is a structured analysis of: who are the attackers, what do they want, what paths exist to get it, which paths does your implementation close. The OWASP Top 10 is a starting point, not a complete answer.

**Rate limiting at scale is a hard problem**. For this capstone, build a solution that works. Document the trade-offs of your approach and what you would change at 10x scale.

## Skills to build while working on this capstone

- `/api-test` — runs the test suite for the API with a formatted summary
- `/slo-status` — reports current SLO compliance and error budget remaining
- `/load-test` — fires a configurable number of requests and reports latency and error distributions

## Further depth

- `software-engineering/architecture/07-resilience-and-scale/circuit-breaker/`
- `software-engineering/architecture/07-resilience-and-scale/rate-limiting/`
- `software-engineering/advanced-engineering/04-security-and-trust-boundaries/`
- `devops/03-production-operations/observability/`
