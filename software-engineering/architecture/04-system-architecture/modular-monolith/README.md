# Modular Monolith

**Category:** System Architecture

## Intent
Still **one** deployable, **one** process — but with **enforced module boundaries**. Each module exposes an explicit public API; other modules cannot reach into its internals. The shape of microservices, without the operational tax.

A modular monolith is what most teams *should* mean when they say "we need to break things up." It's the cheapest path to clean boundaries.

## When to use
- Your monolith has grown enough that "where does this go?" stops having an obvious answer.
- Multiple teams want autonomy over a slice without the cost of separate deployments.
- You want the *option* to extract microservices later without committing now.

## Trade-offs
**Pros**
- All the upsides of monolith (one DB, in-process calls, easy refactor).
- Boundaries are visible and enforced (lint rules, package boundaries, public API exports).
- Easier to extract a service later — the seam is already there.

**Cons**
- Discipline-dependent: if the language doesn't enforce boundaries, drift is inevitable.
- Slightly more ceremony than a free-for-all monolith.
- Module boundaries are only as good as the public APIs you write — leaky APIs leak.

**Rule of thumb:** Reach for modular monolith when you're tempted to say "microservices." 80% of the benefit at 5% of the cost.

## How to enforce boundaries
1. Each module is its own folder/package with an `index.js` (or `public-api.js`) that re-exports the public surface.
2. Other modules import only from that public surface — never from internal paths.
3. A lint rule (eslint `no-restricted-imports`) prevents `import from 'modules/foo/internal/bar'`.
4. Modules communicate via interfaces (function signatures or in-process events), not by reaching into each other's data.

## Real-world analogies
- A house with floors: rooms within a floor share walls; doors are explicit.
- A LEGO set: studs (public APIs) are the only connection points — pieces don't fuse internally.

## Run the demo
```bash
node demo.js
```

The demo defines three modules with explicit public APIs. A fourth module ("admin") tries to reach into the internals of one — and the lint-style guard blocks it.
