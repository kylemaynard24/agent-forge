# Homework — n8n

> Build a workflow that would still make sense after the sales call is over.

## Exercise

Design one realistic n8n workflow for a small business. Examples:

- lead form -> enrichment -> CRM -> Slack alert
- inbound email -> classification -> ticket or calendar route
- uploaded document -> extraction -> approval -> database write

## Constraints

- at least one step must use an external API
- at least one branch must handle failure explicitly
- one section must explain where AI is helpful and where it is unnecessary
- the workflow name must describe business intent

## Reflection

- Which step felt safest to automate fully?
- Which step deserved human review?
- What part would become painful if this workflow doubled in complexity?

## Done when

- the flow has a clear trigger, processing path, and failure path
- another person could infer the business purpose from the workflow
- your design does not depend on unexplained magic in one code node

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names in business context

An n8n node named "HTTP Request" is the workflow equivalent of a function named `doStuff` — it describes the mechanism, not the purpose. `send_order_confirmation_email` or `enrich_lead_from_clearbit` names the business action, making the workflow readable to someone who maintains it six months later and never attended the sales call where the requirements were discussed.

**Exercise:** Audit every node name in your workflow design and rename any that describe the technical action (HTTP Request, Code, Set) to names that describe the business intent — then verify that the workflow diagram is self-documenting to a non-technical stakeholder.

**Reflection:** If a non-technical business owner needs to explain your workflow to a new employee, can they read the node names and describe what the workflow does — or do they need a developer to translate?
