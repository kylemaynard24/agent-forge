# Homework — Security and Trust Boundaries

> Identify the boundary before you validate the feature.

## Exercise: Threat-model a small app

**Scenario:** You have a small app with login, profile editing, file upload, and an admin-only reporting endpoint. It works. The question is whether it is safe enough to trust.

**Build:**
- A lightweight threat model listing actors, assets, entry points, and trust boundaries
- One authentication check and one authorization check that are intentionally distinct
- Input validation for one risky surface such as file upload or query parameters
- A secret-handling note describing where credentials live and how they rotate

**Constraints:**
- You must distinguish at least 3 threat categories: misuse, data exposure, and privilege escalation
- You must identify one boundary that looked harmless at first
- You must describe residual risk, not only mitigated risk

## Stretch

Add a multi-tenant rule and show how the design changes when tenant isolation becomes non-negotiable.

## Reflection

- What risk would have been easiest to miss in a normal feature review?
- Which control is preventive versus detective?
- What are you trusting that you should verify instead?

## Done when

- [ ] The trust boundaries are visible on paper
- [ ] Authn and authz are not conflated
- [ ] At least one risky input path is validated deliberately
- [ ] Residual risk is written down honestly
