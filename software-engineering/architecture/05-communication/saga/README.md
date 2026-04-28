# Saga

**Category:** Communication

## Intent
Coordinate a long-running business transaction across multiple services without distributed locks or two-phase commit. Each step is committed locally; if a later step fails, **compensating actions** undo the earlier steps' business effects.

## When to use
- A workflow spans multiple services or aggregates that cannot share a transaction.
- Steps are individually fast and committable, but the overall outcome must be all-or-nothing in business terms.
- Booking, ordering, provisioning — any "reserve, reserve, reserve, charge" pattern.
- 2PC is not available, not desirable, or not affordable at your scale.

## Trade-offs
**Pros**
- No distributed locks; each service stays autonomous.
- Naturally async-friendly; works over message buses.
- Failure handling is explicit and visible (the compensation list is a feature).
- Scales: no global coordinator holding locks.

**Cons**
- Compensations are not always perfect inverses (refund != "undo charge"; there is a record).
- Visibility windows: between step 1 and rollback, partial state is observable. Design for it.
- Idempotency is mandatory at every step and every compensation.
- Orchestrator vs choreography is a real architectural choice with long-term consequences.

**Rule of thumb:** if you cannot wrap it in one DB transaction and the steps cross services, you need a saga. Pretending otherwise is how you create money leaks.

## Real-world analogies
- Booking a vacation: book the flight, then the hotel, then the car. If the car booking fails, you cancel the hotel and the flight.
- A surgical checklist with backout procedures at each step.
- A multi-stage rocket launch with abort modes per stage.

## Run the demo
```bash
node demo.js
```

The demo runs a "book trip" saga: reserve flight, reserve hotel, reserve car. The car step is forced to fail, triggering the saga to compensate the hotel reservation, then the flight reservation, leaving the system in a consistent state.
