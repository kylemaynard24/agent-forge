# API Gateway

**Category:** Communication

## Intent
A single entry point in front of many backend services. The gateway handles cross-cutting concerns — auth, rate limiting, routing, request shaping, response aggregation — so individual services don't have to.

## When to use
- You have many services and a public API; you don't want each service to redo auth, CORS, and rate limiting.
- Clients should not be coupled to your internal service topology.
- You want one place to enforce contract versioning and request shaping for the outside world.
- You need to aggregate calls (one client request -> several backend calls).

## Trade-offs
**Pros**
- Cross-cutting concerns live in one place.
- Internal services can change without breaking clients.
- Single chokepoint for security policy enforcement.
- Aggregation reduces client round trips.

**Cons**
- Single point of failure if not made HA.
- Easy to grow into a distributed monolith — gateways accrete logic over time.
- Adds a hop and a deploy unit.
- Risk of becoming a bottleneck for both traffic and team velocity.

**Rule of thumb:** use a gateway for cross-cutting concerns and routing. Resist putting business logic in it. The day you do, you've quietly built a new monolith.

## Real-world analogies
- A hotel concierge desk — one place to check in, ask about parking, book a tour, regardless of which department actually delivers each service.
- A building's reception desk — visitors don't wander the floors looking for the right person.
- A restaurant maitre d' — routes you to the right table and handles your initial needs.

## Run the demo
```bash
node demo.js
```

The demo runs an in-process gateway that routes `/users` and `/orders` to backend handlers, applies a fake bearer-token check, and aggregates a `/dashboard` response from both backends in parallel.
