# Homework — Client-Server vs Peer-to-Peer

> Pick the topology by understanding what each costs.

## Exercise: Design a leaderboard for a multiplayer game

**Scenario:** A 1v1 puzzle game with thousands of concurrent players. Players want a global leaderboard ("top 100"). They also want low-latency 1v1 matches with friends.

**Build:** Two designs — one client-server, one P2P-flavored — addressing both needs.

**Design A — Client-Server:**
- Central authoritative leaderboard (server).
- Match coordination through a central matchmaker.
- Game state authoritative on the server.

**Design B — P2P-flavored:**
- 1v1 match plays peer-to-peer (low latency, direct UDP).
- Result is *signed* by both peers and submitted to a central tally service (still client-server, just with less trust).
- Leaderboard remains centralized.

**Constraints (these enforce the concept):**
- For each design, list the failure modes ("what happens if the central server is down? if a peer cheats? if a peer disappears mid-match?").
- For each, name the cost: bandwidth, latency, trust, complexity.
- Pick the design you'd actually ship and defend the decision in 1-2 paragraphs.

## Stretch
Now design a true full-P2P version (no central tally). What hard problems do you have to solve? (Hint: Sybil attacks, double-spend on rankings, eclipse attacks, gossip-graph partitions, NAT traversal.)

This is why most "should be P2P" pitches downgrade to "P2P for the bandwidth-heavy parts; central authority for trust."

## Reflection
- Client-server scales by **stronger servers** (vertically) or **more servers behind a load balancer** (horizontally — but coordination becomes a problem).
- P2P scales by **adding peers** (more participants → more capacity).
- Why does the same property (more nodes = more capacity) not apply to client-server in the same way?

## Done when
- [ ] Both designs are sketched on paper / in a doc.
- [ ] You can list 3 failure modes per design.
- [ ] You've made a defensible choice for the actual game.
- [ ] You understand why "fully decentralized" is rare in commercial products.

---

## Clean Code Lens

**Principle in focus:** Names Should Reflect Actual Behavior, Not Aspirational Roles

System topology assigns names to participants — client, server, peer, coordinator, authority — and those names are behavioral contracts that should match what each node actually does. Calling a node a "peer" when it depends on a central tally service for trust and ranking is a naming lie that misleads both developers and operators about failure modes; the node is really a "semi-trusted client," and naming it accurately surfaces the architectural reality that the design is a hybrid, not true P2P.

**Exercise:** For your hybrid Design B, name every distinct participant role in the system (not just "client" and "server") based on what each node *actually does* in normal operation and in failure scenarios. For example, a peer that signs results and submits to a tally is doing something different from a peer that just plays the match — give each distinct behavioral role a distinct name. Check whether your names would still be accurate if the central tally service went offline.

**Reflection:** The Stretch exercise shows that "fully decentralized" requires solving Sybil attacks, double-spend, and NAT traversal. How does acknowledging these constraints upfront — by naming the relevant participant roles precisely — help a design document communicate risk more honestly than a diagram that just labels everything "peer"?
