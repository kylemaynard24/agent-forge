# Interface Segregation Principle (ISP)

**Category:** Principles (the **I** in SOLID)

## Intent
Clients should not be forced to depend on methods they don't use. Many small, focused interfaces beat one fat one. If a class implements an interface, it should *meaningfully* implement every method — no `throw new NotImplementedError`.

## When to use
- An interface is implemented by classes that don't use half of it.
- Test doubles for an interface require stubbing 12 methods to test 1.
- A change to a method causes ripples in classes that don't actually call it.

## Trade-offs
**Pros**
- Implementations stay honest — every method is real.
- Mocks and tests are smaller.
- New implementations don't have to lie about capabilities.

**Cons**
- More interfaces to learn.
- Some types end up implementing five small interfaces — a coordination cost.

**Rule of thumb:** If you can't write a test for a class without stubbing methods you don't care about, the interface is too wide.

## Real-world analogies
- USB-C ports come in flavors: power, data, video. A power-only cable doesn't pretend to do video. The connectors are physically the same; the *capabilities* are split.
- A driver's license certifies driving. It doesn't certify medical practice. We don't make every adult get a "general competence license" with 200 endorsements.

## Run the demo
```bash
node demo.js
```

The demo shows a fat `Worker` interface forcing `RobotWorker` to implement `eat()` (which it shouldn't), then splits into `Workable` and `Eatable` so each impl declares only what it does.
