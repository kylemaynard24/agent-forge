# Homework — Make and Zapier

> Use the fast tool honestly: where it wins, where it stops winning.

## Exercise

Design two automations:

1. one that is a good fit for Zapier
2. one that is a better fit for Make

For each one, explain:

- the trigger
- the apps involved
- the critical transform or branch
- why the chosen tool wins
- what would make you migrate later

## Constraints

- at least one example must involve cost or volume as a real concern
- one example must reject AI because deterministic logic is enough
- one answer must name a concrete maintenance risk

## Reflection

- Which tool felt safer to hand off to a non-technical operator?
- Which workflow started to look too complex for the chosen platform?
- Where would a sales demo hide the real support burden?

## Done when

- you can explain the difference between "fast to build" and "cheap to own"
- the examples do not sound interchangeable
- one migration threshold is explicit

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names for a non-technical audience

In Make and Zapier, automation step names are the only documentation that non-technical operators will ever read — there is no source code to fall back on. The clean code principle of naming for the reader applies with even greater force here: `filter_orders_over_500_dollars` is self-explanatory to an operations manager; `Filter` is meaningless without context. Clean naming in no-code tools is not a cosmetic choice — it is the entire documentation layer.

**Exercise:** Rename every step in your automation designs so that a business owner unfamiliar with the platform could read the step list top-to-bottom and describe the workflow's business logic in plain language.

**Reflection:** When this automation breaks at 11 PM and a non-technical operator is the first to notice, will the step names tell them where to look — or will they have to call a developer to interpret what failed?
