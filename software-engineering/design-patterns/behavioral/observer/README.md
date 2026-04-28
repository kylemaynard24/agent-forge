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

## Deeper intuition

Behavioral patterns are about where decisions live and how control flows between objects. They become useful when logic is correct in isolation but hard to follow as a system because too many objects know too much about each other or because behavior varies in ways that are currently trapped in conditionals.

When you study **Observer**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
