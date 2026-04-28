# Hexagonal Architecture (Ports and Adapters)

**Category:** Component Architecture

## Intent
The domain core lives in the middle. **Ports** are interfaces the core defines for what it needs (driven ports: repos, gateways) and what it offers (driving ports: use cases). **Adapters** plug into ports — HTTP adapter, queue adapter, in-memory test adapter.

The shape gives the architecture its name: a hexagon with multiple sides, each a port that any matching adapter can plug into. The core doesn't know which adapter is talking to it.

## Driving vs driven
- **Driving** ports/adapters drive the application: HTTP routes, CLI commands, message subscribers. They *call into* the core.
- **Driven** ports/adapters are driven by the core: databases, third-party APIs, mailers. The core *calls them*.

## When to use
- You want the domain testable without infrastructure.
- You expect to swap delivery mechanisms (HTTP today, queue tomorrow, CLI for batch jobs).
- You want explicit, named seams for everything that touches the outside world.

## Trade-offs
**Pros**
- Domain is testable in isolation; tests are fast.
- Multiple delivery mechanisms work over the same core.
- Adapters can be mocked or replaced without touching the core.

**Cons**
- More files; more "interface vs implementation" navigation.
- Pure ceremony if you have one delivery mechanism and one DB and no plans to change.

**Rule of thumb:** Reach for hexagonal when "I want to test the rule without standing up the world" matters more than "minimize indirection."

## Real-world analogies
- An electric outlet: the wall is the core; the outlet is the port; the device is the adapter. Plug in any compliant device.
- A speaker with multiple inputs (RCA, optical, Bluetooth): the speaker doesn't care which adapter sends audio.

## Run the demo
```bash
node demo.js
```

The demo defines an `OrderService` core with a `Notifier` port; it runs identically with a `ConsoleNotifier` (production-ish) and a `RecordingNotifier` (test).
