# Adapter

**Category:** Structural

## Intent

Make an **incompatible interface** work with client code that expects a different one. The Adapter is a translator: it keeps the old code intact but exposes it under the new interface.

## When to use

- You want to use an existing class, but its interface doesn't match what your code expects.
- You're integrating a third-party library or legacy code you can't change.
- You want a unified interface across several different underlying implementations.

## Structure

```
Client ──► Target  (the interface the client wants)
                ▲
                │ implements
                │
           Adapter  ──► Adaptee  (the existing incompatible class)
           (translates Target calls to Adaptee calls)
```

## Two flavors

- **Object adapter** (what this demo uses): the adapter *contains* an adaptee instance via composition. More flexible; works in JS.
- **Class adapter**: the adapter *inherits* from the adaptee. Requires multiple inheritance in general; not idiomatic in JS.

## Trade-offs

**Pros**
- Integrates legacy code without modifying it
- Decouples client from third-party specifics
- Lets you swap adaptees later without touching clients

**Cons**
- One more indirection for every call
- Can hide performance or semantic mismatches ("this adapter looks fast, but the adaptee is slow")

## Adapter vs. Facade

- **Adapter** conforms to a *specific pre-existing interface* that the client already depends on.
- **Facade** invents a *new, simpler* interface over a complex subsystem.

## Real-world analogies

- A USB-to-HDMI dongle — lets one device (USB-C laptop) work with another (HDMI monitor).
- Power plug adapters for international travel.
- A translator at a meeting — your words, their language.

## Run the demo

```bash
node demo.js
```

Demonstrates a modern `Logger` interface (`.log({ level, message })`) and a legacy `XmlShouter` library that only speaks `.shout(xmlString)`. An `XmlShouterAdapter` lets client code use both through the same interface.
