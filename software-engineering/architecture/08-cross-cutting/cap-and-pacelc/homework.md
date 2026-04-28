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
