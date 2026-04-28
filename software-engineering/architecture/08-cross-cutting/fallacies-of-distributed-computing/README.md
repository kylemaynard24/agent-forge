# Fallacies of Distributed Computing

**Category:** Cross-Cutting

## Intent

Eight assumptions that are tempting in code but wrong in production. Internalize them and your distributed code will look paranoid in the right places.

The eight (Deutsch et al.):
1. The network is reliable.
2. Latency is zero.
3. Bandwidth is infinite.
4. The network is secure.
5. Topology doesn't change.
6. There is one administrator.
7. Transport cost is zero.
8. The network is homogeneous.

## When to use

- Code review of any service that calls another service.
- Designing client SDKs for an API.
- Postmortems — almost every distributed-systems incident is a fallacy made manifest.
- Whenever someone says "let's just call the other service inline."

## Trade-offs

**Pros**
- A short, sharp checklist for distributed code review.
- Names the concrete bug class for each fallacy.
- Pairs with retry, timeout, breaker, idempotency, observability — they are the *answers* to these fallacies.

**Cons**
- Memorizing them doesn't fix anything. You still have to apply them per call.
- Some, like "network is secure," need depth (TLS, mTLS, authn/authz) far beyond a checklist.
- The list is from 1994 — the spirit holds, but the specifics (e.g., bandwidth) have shifted.

**Rule of thumb:** in distributed code, every assumption you'd make for an in-process call is wrong. Plan for it.

## Real-world analogies

- Mailing a letter and assuming it arrives in zero seconds, never gets lost, and goes through one office run by one trusted person.
- A walkie-talkie conversation: muffled, intermittent, sometimes overheard, with bandwidth shared across the channel.
- A relay race where every baton hand-off can drop the baton.

## Run the demo

```bash
node demo.js
```

The demo runs a "naive client" that assumes all eight fallacies and a "correct client" that defends against them, against a simulated unreliable network. The naive client crashes or hangs; the correct client finishes successfully.
