# Legacy Rescue and Refactoring

**Category:** Advanced engineer track

## Intent

Change important systems safely even when they are old, tangled, and under-documented. Most real engineering is not greenfield. It is careful change in systems that already matter.

## When to use

- The code works but resists change
- Rewrites are politically or operationally unrealistic
- Important behavior is hidden inside large functions or shared globals
- A small improvement must happen without destabilizing revenue paths

## What this area trains

- seam creation
- behavior-preserving refactors
- adapters and anti-corruption boundaries
- incremental migration
- rewrite skepticism

## Trade-offs

**Pros**
- Safer change in valuable systems
- Better long-term maintainability
- Lower blast radius than heroic rewrites

**Cons**
- Progress can feel slower than rebuilding
- Temporary bridges add complexity
- Old constraints may outlive your patience

## Rule of thumb

When the system is critical, prefer extracting one safe seam over planning one glorious rewrite.

## Run the demo

```bash
node demo.js
```

The demo shows a legacy payment module wrapped in a stable adapter so new code can move first while old code survives a little longer.

See also: [homework.md](homework.md) and [project.md](project.md)
