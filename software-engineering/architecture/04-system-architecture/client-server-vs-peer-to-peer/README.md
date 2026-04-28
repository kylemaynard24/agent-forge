# Client-Server vs Peer-to-Peer

**Category:** System Architecture

## Intent
Two competing **topologies** for distributed systems:

- **Client-Server**: a centralized server provides services to many clients. Clients don't talk to each other directly. Examples: classic web, REST APIs, SQL databases.
- **Peer-to-Peer (P2P)**: every node is both client and server. Nodes talk directly to each other. Examples: BitTorrent, blockchain, Bluetooth mesh, gossip protocols.

The choice is fundamentally about who holds **authority**, who holds **data**, and how the system **discovers** participants.

## When client-server fits
- One trusted authoritative source of state (a bank, a social graph).
- Clients need consistent service regardless of their neighbors' availability.
- Most business applications.

## When peer-to-peer fits
- No single party should be in charge (resilience, censorship resistance).
- Bandwidth or compute scales with number of participants (BitTorrent: more peers = faster).
- Latency benefits from direct connections (peer-to-peer gaming, video calling).
- Network partitions are common and you must keep working.

## Trade-offs
**Client-Server pros:** simple authority, easy debugging, cheap consistency, well-tooled.
**Client-Server cons:** single point of failure, server is the bottleneck, limited offline behavior.

**P2P pros:** no SPOF, scales with participants, fault-tolerant, often censorship-resistant.
**P2P cons:** discovery is hard, consistency is hard, security is hard, debugging is *very* hard, bootstrap is hard. (Five "is hard"s for a reason.)

**Rule of thumb:** Default to client-server. Reach for P2P only when its specific properties (no SPOF, censorship resistance, peer-multiplied bandwidth) are *essential* to the problem.

## Real-world analogies
- Client-server: a library with a central catalog and circulation desk.
- P2P: a book club where everyone owns books and lends them directly. No central catalog.

## Run the demo
```bash
node demo.js
```

The demo simulates the same chat scenario two ways: 4 clients all routing through a server, and 4 peers gossiping messages directly. Shows how each handles a node going offline.

## Deeper intuition

System architecture topics change the unit of thinking from classes to deployable pieces and interaction styles. The important question is no longer just 'is this code clean?' but 'what does this topology make easy, expensive, risky, or organizationally awkward?'

A strong grasp of **Client-Server vs Peer-to-Peer** means you can explain what cost it is buying down and what new cost it introduces. That is the practical test for architecture knowledge: not whether you can define the term, but whether you can use it to reason honestly about trade-offs in a real system.

## Questions to carry into the demo

- What kind of coupling does this idea reduce, and what coupling does it still allow?
- What gets easier to change if I adopt this approach?
- What operational or organizational cost am I accepting in return?
- What simpler alternative would I try before reaching for this in a small system?
