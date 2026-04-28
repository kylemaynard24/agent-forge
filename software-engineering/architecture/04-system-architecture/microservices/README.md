# Microservices

**Category:** System Architecture

## Intent
Multiple independently deployable services, each owning its own data and exposing a network API. Each service is small enough that a single team can own it end-to-end. Services communicate over the network — typically HTTP, gRPC, or messaging.

## When to use
- The monolith has hit a *real* limit: a hot module is starving others; teams can't ship without coordinating; deploy frequency varies wildly across features.
- Different parts of the system have very different scaling needs (one slice needs 100 instances, another needs one).
- You have the platform engineering capacity to run them (CI/CD, observability, service discovery, secrets, etc.).

## Trade-offs
**Pros**
- Independent deploy cadence — teams ship without coordinating.
- Independent scaling — each service sized for its load.
- Failure isolation (when done right) — one service down doesn't crash the others.
- Polyglot — different services can use different languages/runtimes.

**Cons**
- Operationally **expensive**: service discovery, distributed tracing, deployment pipelines, schema versioning.
- Network is unreliable — every call needs retries, timeouts, circuit breakers.
- Cross-service transactions become sagas with compensations.
- Eventual consistency replaces "just one transaction."
- Debugging requires cross-service traces, not just stack traces.
- Most "microservices" projects fail by being premature monolith-splits.

**Rule of thumb:** You probably don't need this yet. The right number of services is the smallest number that lets your teams move quickly *and* keeps the platform team sane.

## Real-world analogies
- A modern airport: ticketing, security, baggage, gates, concessions — each a service with its own staff. Failures are isolated; coordination is heavy.
- A city of specialized shops vs a single department store: more independence, more friction.

## Run the demo
```bash
node demo.js
```

The demo simulates two services in one Node process, communicating ONLY over an HTTP-shaped channel (no shared variables, no direct function calls). Each service has its own data store. This makes the network cost visible.
