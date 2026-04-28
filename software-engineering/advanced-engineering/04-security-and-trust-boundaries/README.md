# Security and Trust Boundaries

**Category:** Advanced engineer track

## Intent

Threat modeling, validation, identity, secrets, and explicit trust boundaries.

## When to use

- you want stronger engineering judgment in security and trust boundaries
- the high-level ideas make sense but the real-world execution still feels slippery
- you need repeatable habits rather than one-off heroics
- you want to practice under realistic constraints instead of reading principles passively

## What this area trains

- naming who is trusted and what each actor may touch
- separating identity from authorization cleanly
- treating user input and external systems as adversarial by default
- reducing blast radius when secrets or privileges go wrong

## Subtopics

- [01-authn-vs-authz/](01-authn-vs-authz/) — Separate identity proof from permission checks so access control stays honest.
- [02-session-and-token-design/](02-session-and-token-design/) — Understand what state lives server-side, client-side, and how revocation really works.
- [03-input-validation/](03-input-validation/) — Reject malformed or dangerous input at clear boundaries.
- [04-injection-classes/](04-injection-classes/) — Recognize how commands, queries, or templates become attack surfaces.
- [05-ssrf/](05-ssrf/) — Treat server-side fetch capabilities as a trust boundary, not a convenience.
- [06-secrets-management/](06-secrets-management/) — Control where secrets live, how they rotate, and who can reach them.
- [07-file-upload-safety/](07-file-upload-safety/) — Treat uploads as content plus metadata plus execution risk.
- [08-multi-tenant-isolation/](08-multi-tenant-isolation/) — Make tenant boundaries explicit in both code and data access.
- [09-threat-modeling/](09-threat-modeling/) — Systematically name assets, actors, entry points, and abuse paths before coding deeper.
- [10-least-privilege/](10-least-privilege/) — Give components only the permissions they need so failure stays containable.

## What to notice as you work through it

- where untrusted data crosses into trusted logic
- what authority a token or session actually grants
- whether tenant or role boundaries are enforceable
- which controls prevent versus merely detect abuse

## Common mistakes

- conflating logged-in with allowed
- treating secrets storage as an implementation detail
- validating too late in the request path
- assuming one-tenant convenience will generalize safely

## How to use the materials

Each subtopic folder contains:

1. **README.md** — the concept and trade-offs
2. **demo.js** — a tiny runnable illustration
3. **homework.md** — a constrained exercise

Run any demo with:

```bash
node path/to/demo.js
```

Start with the earlier folders before the later ones. The ordering is intentional.

## Scenario questions

These questions are meant to turn **Security and Trust Boundaries** into an operational instinct. Read them like incident prompts: what are you seeing, what move should happen next, and what mistake are you trying to avoid under pressure?

### Scenario 1 — "The system is noisy, stressful, and people want to skip straight to action"

**Question:** You are in the middle of a real engineering problem and the room wants to jump ahead before the situation is legible. Is this topic the kind of move that should slow people down and sharpen the next step?

**Answer:** Usually yes.

**Explanation:** This topic matters when disciplined engineering beats improvisation. The point is not process for its own sake. The point is to reduce confusion, make the next move more informed, and avoid creating a second problem while reacting to the first.

**Why not jump first to Performance and Capacity or Legacy Rescue and Refactoring:** adjacent skills matter, but they often work best after **Security and Trust Boundaries** has made the problem clearer, safer, or more measurable.

### Scenario 2 — "A team keeps confusing activity with progress"

**Question:** An engineer says, "We're doing a lot already, so we must be handling this well." Does **Security and Trust Boundaries** help test whether the team is actually making the system easier to reason about?

**Answer:** Yes.

**Explanation:** Strong operational topics give you a quality bar for action. **Security and Trust Boundaries** is useful when you need to ask whether the current work is actually reducing uncertainty, restoring control, or increasing confidence instead of merely producing motion.

**Why not treat effort as evidence:** because under pressure, busy teams can still thrash. The value of **Security and Trust Boundaries** is that it gives you a sharper standard for what "better" looks like.
