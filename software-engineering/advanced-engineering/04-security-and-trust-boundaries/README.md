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
