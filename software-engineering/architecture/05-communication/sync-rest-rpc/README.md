# Synchronous REST / RPC

**Category:** Communication

## Intent
Caller sends a request and **waits** for the response on the same connection. The two services are temporally coupled: if the callee is down or slow, the caller is down or slow.

## When to use
- The caller genuinely needs the result before it can proceed (e.g. authorization, price lookup).
- Latency budget is tight and a round trip is acceptable.
- Operations are naturally request/response: `GET /users/42`, `POST /orders`.
- You want simple debugging — one request, one response, one stack trace.

## Trade-offs
**Pros**
- Dead simple mental model and tooling (curl, browser, Postman).
- Strong, immediate feedback: success and failure are explicit.
- Easy to reason about consistency — you got the answer or you didn't.

**Cons**
- Temporal coupling: callee outage cascades to caller.
- Tail latency adds up across chains of calls.
- Retries and timeouts must be handled at every hop.
- Synchronous fan-out amplifies failure (one slow dependency stalls everything).

**Rule of thumb:** use sync when the caller cannot make progress without the answer. Otherwise, prefer async messaging.

## Real-world analogies
- A phone call — both parties must be available simultaneously.
- A bank teller window — you wait at the counter until the transaction completes.
- Ordering at a restaurant counter and standing there for the food.

## Run the demo
```bash
node demo.js
```

The demo spins up an HTTP server on a random port, then a client makes two GET requests and a POST, prints the round-trip latency for each, and shuts the server down.
