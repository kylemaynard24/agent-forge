# Homework — Trade-off Analysis (Capstone)

> Synthesize everything from the curriculum. The **constraints** are the point.

## Exercise: Design and defend an architecture

**Scenario:** Pick **one** of the following businesses. You will design a high-level architecture and write a defense. Output is a short document, not running code.

Pick one:
- (a) **A telemedicine app** — patients book and join video appointments with doctors. ~50k users, US only, HIPAA in scope.
- (b) **A point-of-sale system for food trucks** — runs on a tablet over flaky cellular. Must work offline; syncs when online. ~5k trucks.
- (c) **A real-time multiplayer puzzle game** — 100k concurrent players, low-latency moves, leaderboards.

**Build (write):**
1. **Constraint table**: team size, latency target, scale (rps, users, regions), budget, regulatory, time-to-market.
2. **Component diagram in ASCII** of services, datastores, and external dependencies.
3. **Pattern selection**: for each pattern in `07-resilience-and-scale/` and `08-cross-cutting/`, write one sentence on whether you'd use it now, later, or never — and why.
4. **CAP/PACELC choices** per stateful component, in a small table.
5. **Top three risks** and what you'd build to mitigate them.

**Constraints (these enforce the concept):**
- Defend each choice against a **specific** alternative — not "we picked X because it's standard." Say: "we picked X over Y because constraint Z dominates."
- Every component must justify its existence with a constraint it serves. If you cannot, delete it.
- At least three patterns must be marked **not yet** — list the constraint that would make you reach for them.
- The doc must fit on two pages. Brevity is part of the exercise.

## Stretch
- Write the **first ADR** (Architecture Decision Record) for the most consequential choice. Use the standard template: Context / Decision / Consequences.
- Imagine the team grows 10x and traffic 100x. Which decisions break first? Re-do the constraint table for that future and note which choices would change.

## Reflection
- Which choice did you find hardest to defend? Why? What did the difficulty teach you about your constraints?

## Done when
- [ ] Two-page doc with constraints, diagram, pattern table, CAP/PACELC table, and risks.
- [ ] Every choice references at least one constraint by name.
- [ ] At least one section says "we are not building X yet, here's the trigger that would change that."

---

## Clean Code Lens

**Principle in focus:** Clarity — a trade-off document is clean code for decision-making

A trade-off written as "we chose Postgres because it is reliable" is the documentation equivalent of a comment that says `// increment i` above `i++` — it restates the obvious without explaining the reasoning. The clean code standard for a trade-off document is: state the alternatives considered, name the constraint that dominated the decision, and record the consequence you are accepting — so a new engineer can evaluate whether that constraint still holds without reconstructing the original debate.

**Exercise:** Take the single hardest choice in your architecture document and rewrite it using this template: "We chose [X] over [Y] because [named constraint]. The consequence we accept is [specific downside]. We would revisit this if [trigger condition]." Then verify every other trade-off in the document meets the same bar — each one should name at least one alternative and one constraint.

**Reflection:** Which section of your document would be hardest for a new engineer to challenge — not because the decision is obviously correct, but because the reasoning is missing — and what would adding that reasoning cost you in words?