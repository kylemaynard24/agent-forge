# State

**Category:** Behavioral

## Intent

Let an object alter its behavior when its internal state changes. Instead of a sprawling `switch` or nested `if`s keyed on a status field, each state is its own class that encapsulates the behavior for that state — and can transition the object to a different state.

## When to use

- An object has well-defined states with different behavior in each.
- You find yourself writing `if (this.status === 'X') {...} else if (this.status === 'Y') {...}` across many methods.
- The set of states is likely to grow, and you want new states to be localized additions.

## Structure

```
Context                          State (interface)
 - state: State                    + handle(context)
 + request()       ──delegates──►     ▲
 + setState(s)                        │
                                 ConcreteStateA, B, C, ...
```

`Context.request()` delegates to `this.state.handle(this)`. States call `context.setState(new OtherState())` to transition.

## Trade-offs

**Pros**
- Behavior for each state is in one place
- Adding a new state is a new class, not a `switch` edit in every method
- State transitions are explicit (stored in code, not tangled into conditionals)

**Cons**
- Many small classes for a small number of states
- Transitions between states can be hard to discover unless you diagram them
- States may need to know about each other to transition — coupling creeps back in

## State vs. Strategy

Structurally identical — both compose a "behavior object" into a context. Intent differs:
- **Strategy** — the policy is chosen *by the client*. Strategies don't know about each other.
- **State** — the state transitions *itself* from within. States typically reference the next state(s).

## Real-world analogies

- Traffic lights, vending machines
- TCP connection state (LISTEN, SYN_SENT, ESTABLISHED, CLOSED…)
- Order lifecycle (pending → paid → shipped → delivered)
- Document lifecycle (draft → review → published → archived)

## Run the demo

```bash
node demo.js
```

Demonstrates a `TrafficLight` context whose behavior depends on `RedLight`, `GreenLight`, or `YellowLight`. `tick()` advances through states; each state decides its next state.
