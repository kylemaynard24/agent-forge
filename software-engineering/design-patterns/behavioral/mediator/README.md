# Mediator

**Category:** Behavioral

## Intent

Route communication between a set of peers through a central **mediator** object, so peers don't reference each other directly. The mediator encapsulates "how these objects interact" in one place.

## When to use

- A set of objects need to coordinate, and point-to-point references between them would become a tangled mesh.
- Interaction logic is growing scattered across the objects themselves and is getting hard to reason about.
- You want to reuse peers in a different configuration by swapping the mediator.

## Structure

```
           Mediator (interface)
                │
           ConcreteMediator
           ▲ ▲ ▲ ▲
           │ │ │ │  (peers register with the mediator)
           │ │ │ │
       Colleague1  Colleague2  Colleague3  ...
       (notify mediator of events, rely on mediator to reach others)
```

## Trade-offs

**Pros**
- Peers stay loosely coupled — they know the mediator, not each other
- Interaction rules live in one place (the mediator)
- Easier to reason about "how do these components talk?" — you read one class

**Cons**
- The mediator can become a god object if you let every interaction pour into it
- Over-centralizing hides logic in an unclear place
- Adding a new peer may still require touching the mediator

## Mediator vs. Observer

Both coordinate multiple objects. Key differences:
- **Observer** is **broadcast** — a subject notifies all subscribers blindly.
- **Mediator** is **routed** — the mediator decides who needs to know what based on the event.

## Real-world analogies

- **Air traffic control** — planes don't talk to each other, they talk to the tower.
- **Chat rooms** — users send to the room, the room delivers to other users.
- **UI frameworks**' form controllers — a controller listens to many fields and coordinates their state.

## Run the demo

```bash
node demo.js
```

Demonstrates a `ChatRoom` mediator with several `User` peers. Users never reference each other; they send messages to the chat room, and the chat room decides how to deliver (broadcast vs. direct message).

## Deeper intuition

Behavioral patterns are about where decisions live and how control flows between objects. They become useful when logic is correct in isolation but hard to follow as a system because too many objects know too much about each other or because behavior varies in ways that are currently trapped in conditionals.

When you study **Mediator**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
