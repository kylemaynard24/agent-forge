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

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Open/Closed Principle

The event name is the contract between producer and consumer — naming it as a past-tense fact (`priceUpdated`, `userJoined`, `thresholdExceeded`) keeps the subject ignorant of what anyone will do with the event, which is the whole point of the pattern. Applied cleanly, the ticker publishes `priceUpdated` and each subscriber reads that name as a fact it can react to however it chooses. Applied messily, event names like `triggerAlert` or `updateDisplay` bake the subject's assumption about subscriber behavior directly into the contract, creating invisible coupling.

**Exercise:** Go through every event name in your `Ticker` and ask: does this name describe what happened (a fact about the subject), or what should happen next (an instruction to subscribers)? Rename any that are instructions — the test is whether a new subscriber type could reasonably react to the event in a way the original author never imagined.

**Reflection:** Your three subscribers — logger, moving-average calculator, threshold alerter — all receive the same `priceUpdated` event but do completely unrelated things with it. If you had instead designed three separate methods on the ticker (`notifyLogger`, `notifyCalculator`, `notifyAlerter`), what clean-code properties would you have lost, and which architectural property does the observer pattern restore?
