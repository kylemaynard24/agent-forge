# Homework — Event-Driven Architecture

> Decouple reactions from the action that triggers them.

## Exercise: Convert a synchronous flow to events

**Scenario:** Today, `placeOrder` directly calls (in this order): `inventory.reserve`, `payments.charge`, `emails.sendConfirmation`, `analytics.recordSale`. Adding a new reaction (e.g., loyalty points) means editing `placeOrder`. Failures in any step abort the whole flow.

**Build:**
- An `EventBus` with `publish(eventName, payload)` and `on(eventName, handler)`.
- Refactor `placeOrder` to do only what's *required for the order itself* (validate, reserve, charge), then publish `OrderPlaced`.
- Move `email`, `analytics`, and `loyalty` to subscribers of `OrderPlaced`.

**Constraints (these enforce the concept):**
- `placeOrder` doesn't import the email, analytics, or loyalty modules.
- Adding a new subscriber (e.g., `tax-reporting`) requires zero edits to `placeOrder`.
- A failure in any subscriber must NOT roll back the order. (Subscribers handle their own failures.)
- Subscribers run concurrently — they don't depend on each other's order or success.

## Stretch
The hard part: payment fails AFTER `OrderPlaced` was published. You've now sent confirmation emails for an order that won't go through. Two options:
1. Don't publish `OrderPlaced` until payment succeeds. (Push the event later.)
2. Publish `OrderPlaced` early, then publish `OrderCancelled` on failure; subscribers subscribe to both.

Pick one and defend it.

## Reflection
- "Choreography vs orchestration": when is each better? (Hint: choreography is loose, easy to extend, hard to reason about; orchestration is centralized, easy to reason about, harder to extend.)
- What's the dark side of "anyone can subscribe to anything"? (Hint: hidden dependencies; no static call graph; debugging becomes archaeology.)

## Done when
- [ ] `placeOrder` publishes one event and stops caring about everything else.
- [ ] A new subscriber can be added with no edits to existing code.
- [ ] An exception in a subscriber doesn't break the order.
- [ ] You've articulated when this design is *wrong* (when reactions must be ordered or transactional).

---

## Clean Code Lens

**Principle in focus:** Event Names Are Domain Vocabulary — Past Tense, Meaningful, Specific

Event names in an event-driven system are the most visible vocabulary in the codebase: they appear in every publisher, every subscriber, and every log entry. `OrderPlaced` names a domain fact in the past tense — something happened, it is done, it cannot be undone. `DataChanged` or `UpdateTriggered` names an implementation signal with no domain meaning, forcing every subscriber author to decode what actually happened before they can react correctly.

**Exercise:** List every event name in your refactored system and evaluate each against three criteria: (1) is it past tense (a fact, not a command)? (2) does it name a domain concept that a product manager would recognize? (3) is it specific enough that two different business outcomes would use two different event names? Rename any event that fails one or more criteria, then check whether the rename also clarifies which subscribers legitimately need to react and which were subscribing because the old name was too vague.

**Reflection:** The Stretch exercise raises the case where `OrderPlaced` is published before payment succeeds, leading to a confirmation email for a failed order. Does this failure stem from a naming problem — that `OrderPlaced` was used to mean "order initiated" rather than "order confirmed" — and would a more precise name like `OrderConfirmed` have prevented the ambiguity?
