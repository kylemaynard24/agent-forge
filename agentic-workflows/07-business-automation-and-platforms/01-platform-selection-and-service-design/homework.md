# Homework — Platform Selection and Service Design

> Pick the platform that fits the delivery model, not the platform that flatters your ego.

## Exercise

Choose three scenarios:

1. a local service business that wants lead capture and follow-up
2. a B2B team that wants internal handoffs and reporting automation
3. a client that wants an AI assistant connected to company knowledge

For each one, write:

- the recommended platform
- one strong alternative
- why the recommendation wins
- what would make you switch later

## Constraints

- one choice must favor speed over flexibility
- one choice must favor control over convenience
- one answer must say "do not use an agent platform here"

## Reflection

- Which recommendation was hardest to justify honestly?
- Where did business constraints change the technical answer?
- Which tool looked best at first but lost once maintenance entered the picture?

## Done when

- you can explain platform choice in business and engineering language
- each recommendation includes a real trade-off
- at least one scenario rejects unnecessary complexity

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names; make decisions explicit

Platform selection documentation that says "we chose n8n because it was easier" is the prose equivalent of a variable named `result` — it records the output but not the reasoning. A clean decision record names the specific criteria evaluated, the specific constraints that applied, and the specific trade-off that tipped the choice; this makes the decision auditable and reversible when context changes.

**Exercise:** Rewrite one of your platform recommendations as a structured decision record: name the criteria explicitly, score each option against each criterion, and state the recommendation as a logical conclusion from that structure — not as an assertion followed by justification.

**Reflection:** If your client's volume doubles 18 months from now and the platform choice needs to be revisited, does your current documentation give the next engineer everything they need to make an informed decision — or will they be starting from scratch?
