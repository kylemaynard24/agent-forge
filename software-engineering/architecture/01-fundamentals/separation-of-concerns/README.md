# Separation of Concerns

**Category:** Fundamentals

## Intent
Each module, file, or class owns one focus area. When a single piece of code mixes UI, business rules, and persistence, every change ripples in three directions.

## When to use
- A function does more than one thing (validating + computing + saving + notifying).
- A small change in one area keeps breaking unrelated areas.
- Testing one slice requires standing up unrelated infrastructure (DB, network, mailer).
- Two people can't work on adjacent features without stepping on each other.

## Trade-offs
**Pros**
- Localized change — edit one concern without touching others.
- Easier testing — each concern is testable in isolation.
- Independent evolution — swap an implementation without ripples.

**Cons**
- More files, more wiring.
- Over-applied it produces ceremony and anemic modules.
- New folks have to learn the seams before they can read the code.

**Rule of thumb:** If you can name three independent reasons a function might change, it's three functions in disguise.

## Real-world analogies
- A restaurant kitchen: pastry, grill, and dish station own distinct concerns; one slammed station doesn't stop the others.
- A house: kitchen, bathroom, and bedroom each have one purpose. Mixing plumbing and bedroom is a code smell in carpentry too.

## Run the demo
```bash
node demo.js
```

The demo refactors a bloated `handleOrder` that mixes validation, persistence, and notification into three single-purpose modules and shows you can swap the mailer for a no-op without touching anything else.
