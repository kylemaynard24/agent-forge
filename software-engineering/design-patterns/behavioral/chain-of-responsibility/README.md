# Chain of Responsibility

**Category:** Behavioral

## Intent

Pass a request along a **chain of handlers**. Each handler decides whether to process the request or forward it to the next handler. The sender doesn't need to know which handler will ultimately respond.

## When to use

- More than one object might handle a request, and the right handler depends on runtime state.
- You want handlers to be composable — add, remove, or reorder them without changing callers.
- The set of handlers should be configurable (e.g. middleware, pipelines).

## Structure

```
Sender ──► Handler1 ──► Handler2 ──► Handler3 ──► (end)
                │           │            │
              handles    forwards     handles
```

Each handler holds a reference to the next. `handle(request)` either handles or calls `this.next.handle(request)`.

## Trade-offs

**Pros**
- Handlers are decoupled — each knows only its own responsibility and whether to forward
- Chain is runtime-configurable
- Easy to add new handlers

**Cons**
- No guarantee the request gets handled (might fall off the end)
- Debugging flow through a long chain can be painful
- Performance: in the worst case, every handler runs

## Real-world analogies

- **HTTP middleware** (Express, Koa, Django) — each middleware handles or passes to the next.
- **Event bubbling** in the DOM.
- **Corporate approval chains** — manager → director → VP, escalated by dollar amount.

## Chain of Responsibility vs. Decorator

Both are linked lists of wrappers. The key difference:
- **Decorator** — every wrapper *adds behavior* around a single underlying operation.
- **Chain of Responsibility** — each link might or might not handle, and may decide to stop.

## Run the demo

```bash
node demo.js
```

Demonstrates an expense approval chain — `Manager → Director → VP` — where each approver handles expenses up to their limit and escalates larger ones.

## Deeper intuition

Behavioral patterns are about where decisions live and how control flows between objects. They become useful when logic is correct in isolation but hard to follow as a system because too many objects know too much about each other or because behavior varies in ways that are currently trapped in conditionals.

When you study **Chain of Responsibility**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
