# Proxy

**Category:** Structural

## Intent

Provide a **surrogate** for another object to control access to it. The proxy has the same interface as the real subject; clients can't tell the difference, but the proxy can do things around the real call: defer creation, cache, authorize, log, meter, or forward to a remote.

## Common kinds of proxy

| Kind | Purpose |
| --- | --- |
| **Virtual proxy** | Lazy creation — build the expensive real subject only on first use |
| **Protection proxy** | Check permissions before forwarding |
| **Remote proxy** | Hide that the real subject is on another machine |
| **Caching proxy** | Memoize results; return cached output when inputs repeat |
| **Smart reference** | Reference counting, logging, metering around each access |

## Structure

```
Client ──► Subject (interface)
                ▲
      ┌─────────┴─────────┐
      │                   │
  RealSubject           Proxy
                          │
                          └──► RealSubject  (lazy, controlled, cached, etc.)
```

## Trade-offs

**Pros**
- Defer expensive work or hide expensive access (remote, disk)
- Cross-cutting concerns (auth, logging) without touching real subject
- Transparent to client code

**Cons**
- Another layer of indirection
- If the proxy's behavior diverges from the real subject's (e.g. stale cache), bugs are confusing

## Proxy vs. Decorator

Both wrap an object with the same interface. Intent differs:
- **Decorator** adds new *responsibilities* the real subject doesn't have.
- **Proxy** controls *access to* the real subject (lazy, cached, authorized, remote).

Structurally they can look identical; the pattern you're using is the one whose intent you mean.

## Real-world analogies

- **Lazy image loading** on a web page — a placeholder stands in until the image is needed.
- **HTTP caching** — the browser acts as a cache proxy over the server.
- **ORM lazy loading** — `user.posts` triggers a query on first access, nothing before.

## Run the demo

```bash
node demo.js
```

Demonstrates a `ProxyImage` that lazily creates an expensive `RealImage` only on first `display()`. A photo gallery builds hundreds of proxies instantly; only the ones you actually view load.

## Deeper intuition

Structural patterns are about reshaping relationships without rewriting the underlying behavior. They earn their keep when a system needs compatibility, composition, simplification, access control, or independent variation across different dimensions of the design.

When you study **Proxy**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
