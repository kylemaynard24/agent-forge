# Homework — Observer

> One subject notifies many listeners when it changes.

## Exercise: Stock price ticker

**Scenario:** A stock-price `Ticker` emits price updates. Three subscribers attach: a console logger, a 5-tick moving-average calculator, a threshold alerter that fires when price > $100.

**Build:**
- A `Ticker` with `subscribe(fn) → unsubscribe`, `unsubscribe(fn)`, `publish(price)`.
- Three subscriber implementations.
- A demo simulating a stream of 20 price ticks with subscribers attached, detached, and re-attached mid-stream.

**Constraints (these enforce the pattern):**
- A subscriber must be able to unsubscribe **itself** from inside its own callback during a `publish()` without crashing or skipping other subscribers.
- The ticker has zero knowledge of what subscribers do.
- Adding a fourth subscriber type requires zero edits to the ticker.

## Stretch

Implement both **push** (event carries the price) and **pull** (subscriber re-queries the ticker for current state) variants. When is each preferable?

## Reflection

- What memory leak does naive Observer cause? (Hint: subscribers holding references back to subjects.) How do you prevent it?

## Done when

- [ ] All three subscribers receive 20 ticks and behave correctly.
- [ ] A subscriber that unsubscribes itself mid-broadcast does not break the rest of the broadcast.
