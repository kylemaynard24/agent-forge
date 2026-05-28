# Stretch prompt — 2026-05-27

**Theme:** Distributed systems fundamentals

**Question:** What is consistent hashing, what specific problem does it solve that plain `hash(key) % N` does not, and how do real systems use it?

**Why this matters:** Consistent hashing is the backbone of how distributed caches, databases, and load balancers spread keys across nodes while keeping rebalancing cheap when a node joins or leaves — a foundational idea you'll keep running into in system design.

**Angles to cover:**
- Walk through the failure of naive modulo hashing: what happens to cached keys when `N` changes from 4 nodes to 5?
- Explain the hash ring and how a key maps to a node; then explain virtual nodes (vnodes) and what problem they fix.
- Name 2–3 real systems that use it (e.g., Amazon Dynamo, Cassandra, memcached clients, CDNs) and one concrete trade-off or limitation.

---

## My response

_(Write ~300–500 words here.)_
