# Observer

**Category:** Behavioral

## Intent

Define a one-to-many dependency between objects: when one (the **subject**) changes state, all its dependents (the **observers**) are notified automatically.

## When to use

- A change in one object should trigger updates in many others, and you don't want the subject to know who they all are.
- The set of observers changes at runtime.
- You want loose coupling between emitters and listeners.

## Structure

```
Subject                          Observer (interface)
 - observers: Observer[]           + update(subject)
 + subscribe(o)                        ▲
 + unsubscribe(o)                      │
 + notify()       ──────────────►  ConcreteObserverA, B, C, ...
 + setState(s)
```

When `subject.setState(...)` is called, `notify()` walks the observer list and calls `update()` on each.

## Two communication styles

- **Push** — subject passes the change details to observers: `observer.update(subject, change)`.
- **Pull** — subject just says "something changed"; observers ask what: `observer.update(subject)` then `subject.getState()`.

The demo uses push since it's simpler; pull is better when different observers care about different subsets of state.

## Trade-offs

**Pros**
- Loose coupling between emitter and listeners
- Listeners can be added/removed at runtime
- Natural fit for GUI events, data binding, pub/sub

**Cons**
- Unexpected update cascades (A notifies B, B modifies A, A notifies everyone again…)
- Memory leaks — forgotten observers prevent subjects from being garbage collected
- Order of notification is usually unspecified

## JavaScript note

Node.js has `EventEmitter` built in; browsers have `addEventListener`; libraries like RxJS formalize observable streams. The pattern below is shown "by hand" so the machinery is visible.

## Observer vs. Mediator

- **Observer** — subject → N observers. Broadcast.
- **Mediator** — many peers ↔ one mediator. Routed.

## Real-world analogies

- Stock tickers → trading apps, dashboards, loggers
- Newsletter — one sender, many subscribers
- `EventEmitter` / DOM events

## Run the demo

```bash
node demo.js
```

Demonstrates a `StockTicker` subject with three observers: a UI display, a portfolio that tracks net change, and a logger. Subscribing and unsubscribing works at runtime.
