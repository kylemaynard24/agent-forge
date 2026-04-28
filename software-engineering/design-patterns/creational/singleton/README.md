# Singleton

**Category:** Creational

## Intent

Ensure a class has exactly **one** instance, and provide a single global access point to it.

## When to use

- Something in your system genuinely should exist once (app config, a connection pool, an in-process cache).
- You want controlled access to that shared resource.
- You want lazy, on-demand creation instead of constructing at program start.

## Structure

```
┌─────────────────────────────┐
│  Singleton                  │
├─────────────────────────────┤
│  - static instance          │  <-- holds the one instance
│  - (private) constructor    │  <-- prevents `new` from outside
├─────────────────────────────┤
│  + static getInstance()     │  <-- the access point
│  + operation()              │
└─────────────────────────────┘
```

## Trade-offs

**Pros**
- Controlled single point of access
- Lazy initialization
- Avoids re-creating expensive resources

**Cons**
- Global state — makes testing harder (hidden dependencies, test pollution between runs)
- Hides a dependency (callers don't declare they need it — they just grab it)
- Often a code smell: the thing that "must be one" rarely turns out to be true (multi-tenant, test harness, sharding)

**Rule of thumb:** before writing a Singleton, ask whether a plain module, an injected dependency, or a factory would do the job without the tax.

## Real-world analogies

- The `console` object in Node.js / browsers
- `process.env` — one per process
- A printer spooler — one queue coordinating all print jobs

## JavaScript note

JavaScript modules are already singletons — `require`'d twice, they return the same instance. In most real code you'd just export an object from a module. The class form below exists to show the *pattern* clearly.

## Run the demo

```bash
node demo.js
```

The demo shows that `Logger.getInstance()` always returns the same object, that its history persists across all callers, and that directly calling `new Logger()` is blocked.

## Deeper intuition

Creational patterns are about dependency control at the moment of construction. They matter because the way objects come into existence often leaks into the rest of the codebase, forcing callers to know concrete types, lifecycle rules, or assembly details they should not have to carry.

When you study **Singleton**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
