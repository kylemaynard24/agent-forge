# Homework — Flowise, Langflow, and Dify

> Use the AI builder when the problem is actually AI-shaped.

## Exercise

Pick one use case:

- document Q&A assistant
- internal operations copilot
- customer-support drafting assistant

Then compare **Flowise**, **Langflow**, and **Dify** for that use case.

For each tool, write:

- why it might fit
- what hidden work still exists
- what would worry you in production

## Constraints

- one answer must mention evaluation or tracing
- one answer must mention data quality or retrieval quality
- one answer must say that a normal automation platform may be enough instead

## Reflection

- Which tool felt most product-like?
- Which tool felt most extensible?
- Where did the UI make the design look simpler than it really is?

## Done when

- the comparison is about system behavior, not branding
- at least one risk is operational rather than cosmetic
- you can explain when not to use this whole family

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names; single responsibility per node

A visual AI builder node named "LLM" describes a category of component, not what transformation it performs — it is the node equivalent of a function named `process`. `extract_invoice_line_items`, `classify_support_ticket_urgency`, and `generate_followup_email_draft` each name a single, specific transformation, making the canvas readable as a data flow diagram rather than a wiring diagram.

**Exercise:** In your tool comparison write-up, name each AI node in your proposed design after the transformation it applies — then check whether any node is doing two distinct things, which is a signal to split it.

**Reflection:** If you hand your visual flow to a teammate who has never seen the use case, can they read the node names and describe what the pipeline does — or do they need you to walk them through it?
