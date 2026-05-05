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
