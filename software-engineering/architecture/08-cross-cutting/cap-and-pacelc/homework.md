# Homework — CAP and PACELC

> Apply the trade-off explicitly per use case. The **constraints** are the point.

## Exercise: Classify and design

**Scenario:** You are building three features on top of the same backend:
1. **Bank balance display** for a user.
2. **Product catalog browse** on an e-commerce homepage.
3. **Concurrent inventory decrement** when a customer buys the last item.

For each, decide CAP behavior during a partition and PACELC behavior in steady state. Then implement a small simulator that shows the chosen behavior for each.

**Build:**
- A two-replica simulator (extend the demo).
- A `policy` per feature: `{ partitioned: 'CP'|'AP', steady: 'EL'|'EC' }`.
- A driver that, for each feature, performs reads/writes during a partition and prints the observable behavior.

**Constraints (these enforce the concept):**
- Each feature must declare its policy in code; behavior must follow from that declaration, not from ad-hoc branches.
- For CP features, partitioned reads/writes that cannot be confirmed must return an explicit error — never silently serve stale.
- For AP features, every response must include a `mayBeStale: true` flag when freshness cannot be guaranteed.
- For EC features, writes do not return success until peers acknowledge.
- For EL features, writes return immediately; replication runs async.

## Stretch
- Add a third replica and demonstrate quorum (e.g., write succeeds when 2 of 3 ack). What CAP/PACELC behavior does that give you?
- Show **read-your-writes** consistency on top of an AP system using session affinity or a version vector.

## Reflection
- For the inventory feature, what's the cost of getting CAP wrong? For the catalog feature? Why are the answers so different?

## Done when
- [ ] Each feature has a documented policy and behavior matches it.
- [ ] You can demo "CP refuses, AP serves stale" on the same partition for two different features.
- [ ] You can articulate, in one sentence per feature, the price the user pays for the choice.

---

## Clean Code Lens

**Principle in focus:** Comments as documentation — CAP/PACELC choices belong in the code as ADR-style comments, not in a wiki

The cleanest code for a distributed system component is one where the CAP/PACELC choice is documented at the declaration site — a comment that reads "CP: inventory decrement must not serve stale; we reject during partition rather than risk an oversell" is more durable than a Confluence page that diverges from the implementation over time. Clean code treats undocumented architectural decisions as technical debt equal to undocumented function behavior.

**Exercise:** Add a structured comment block at the top of each of your three feature simulators documenting: the chosen CAP behavior, the PACELC behavior, the user-visible consequence of each choice, and the trigger that would make you reconsider. Use a consistent format across all three so the comments are comparable at a glance.

**Reflection:** Six months after shipping, a new engineer needs to change the inventory decrement consistency policy. What in your current code would tell them what the original decision was and why — and what would force them to guess?
