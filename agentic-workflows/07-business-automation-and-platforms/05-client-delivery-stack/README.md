# Client Delivery Stack

**Category:** Business automation and agent platforms

## Intent

Learn the surrounding software stack that makes automation work commercially: data stores, CRM, communication surfaces, documentation systems, portals, and billing.

## Why this matters

Most automation businesses do not fail because the flow editor was wrong. They fail because the surrounding system was vague:

- where does the source of truth live?
- who approves exceptions?
- how is the client notified?
- how is status exposed?
- where do credentials, logs, and billing live?

The orchestration platform is only one layer. The business is built on the full delivery stack.

## A practical business stack

| Layer | Common choices | Why it matters |
| --- | --- | --- |
| database / backend | Supabase, Postgres | durable state, auth, files, logs, and reporting |
| lightweight ops database | Airtable | fast operator views and flexible internal ops |
| docs / client handoff | Notion | operating docs, SOPs, implementation notes |
| CRM / marketing | HubSpot | lead lifecycle, contact records, pipeline actions |
| messaging | Slack | alerts, approvals, human-in-the-loop |
| billing / payments | Stripe | monetized workflows, subscriptions, usage billing |

You do not need all of these on every engagement. You do need to decide which ones own which responsibilities.

## A useful architecture habit

For any client system, explicitly name:

1. the system of record
2. the operator console
3. the notification surface
4. the approval surface
5. the billing or commercial boundary

If those are fuzzy, the automation is not ready.

## Resource shelf

- Supabase docs: <https://supabase.com/docs>
- Airtable support: <https://support.airtable.com/>
- Notion help: <https://www.notion.so/help>
- HubSpot Academy: <https://academy.hubspot.com/>
- Slack platform docs: <https://api.slack.com/>
- Stripe docs: <https://docs.stripe.com/>
- YouTube search — `Supabase tutorial`: <https://www.youtube.com/results?search_query=supabase+tutorial>
- YouTube search — `Airtable tutorial`: <https://www.youtube.com/results?search_query=airtable+tutorial>
- YouTube search — `HubSpot tutorial`: <https://www.youtube.com/results?search_query=hubspot+tutorial>
- YouTube search — `Stripe tutorial`: <https://www.youtube.com/results?search_query=stripe+tutorial>

## Good business uses

- client portals backed by workflow events
- internal operator dashboards for exceptions
- human approval loops before outbound communication
- monetized automations with subscription or usage billing
- implementation handoff packages that clients can actually operate

## Common mistakes

- storing business truth in too many tools at once
- treating Airtable like a forever production backend without saying so
- forgetting the operator experience while optimizing the customer experience
- building alerts with no owner and dashboards with no decision attached
- skipping documentation because "the workflow is self-explanatory"

## Rule of thumb

The business becomes real when the workflow has a clear source of truth, a clear operator surface, and a clear support path.

## Run the demo

```bash
node demo.js
```

## Scenario questions

### Scenario 1 — "The automation works, but nobody knows where to inspect or intervene"

**Question:** Is that a stack problem, not just a workflow problem?

**Answer:** Yes.

**Explanation:** Delivery includes visibility, approval, ownership, and operations, not just successful API calls.

### Scenario 2 — "The client wants to own the system later"

**Question:** Should that affect the surrounding stack choices now?

**Answer:** Absolutely.

**Explanation:** Handoffability is part of architecture, especially when the business model includes transfer of ownership.
