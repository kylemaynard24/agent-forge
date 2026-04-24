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
