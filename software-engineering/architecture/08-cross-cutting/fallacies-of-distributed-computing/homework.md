# Homework — Fallacies of Distributed Computing

> Apply each fallacy to real code. The **constraints** are the point.

## Exercise: Audit and harden a client SDK

**Scenario:** You inherit a client SDK that calls a remote service. It currently looks like `await fetch(url, { body: payload })`. Audit it against all eight fallacies and rewrite it to defend against each.

**Build:**
- A `Client` class with `send(payload)` that takes a payload and returns a result.
- A simulated unreliable network (use the demo's `unreliableSend` or build your own).
- A short audit document mapping each fallacy to the specific defense in code (a comment block at the top of the file is fine).

**Constraints (these enforce the concept):**
- For each of the 8 fallacies, point to a **specific line** of code that addresses it.
- No global timeouts only — every individual call must have its own deadline.
- Payload must be size-checked and chunked if too large (fallacy 3).
- Payload integrity must be verified on receipt (fallacy 4) — if HMAC fails, treat as a network error.
- Peer list must be configurable at runtime, not a constant (fallacy 5/6).
- Cost-tracking: count bytes sent and total wall-clock time per `send` (fallacy 7).

## Stretch
- Add a **chaos mode** where you crank up failure probabilities and watch all defenses kick in together.
- Compare metrics: bytes-per-successful-call, calls-per-success, P99 latency. Did chunking help or hurt?

## Reflection
- Pick the fallacy you find hardest to defend against. Why is that one harder than the others?

## Done when
- [ ] All 8 fallacies are addressed and labeled in code.
- [ ] Under chaotic conditions (drops, latency, MITM), the client still produces correct results or an explicit error.
- [ ] You can articulate, in plain language, what *each* defense costs (latency, complexity, dollars).

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — each fallacy has a corresponding code smell with a clean alternative name

Code that believes the network is reliable looks like `await fetch(url)` with no timeout or error handling; the clean name for the defense is not just "add a timeout" but `fetchWithDeadline(url, deadlineMs)` — a function name that makes the constraint visible at every call site. Naming the defense by what it guarantees (not merely what it does) is the clean code discipline that makes fallacy-hardened code self-documenting.

**Exercise:** For each of the 8 fallacies in your audit document, write the "code smell name" (the pattern you'd find in naive code) and the "clean code name" (the function, class, or constant name that makes the defense explicit). For example: smell = `fetch(url)`, clean = `fetchWithDeadlineMs(url, timeoutMs)`. These pairs become your team's vocabulary for code review.

**Reflection:** Which of your eight defenses has a name that would still be understood by a developer who has never read the fallacies list — and which defenses are only clear if you already know the fallacy they address?
