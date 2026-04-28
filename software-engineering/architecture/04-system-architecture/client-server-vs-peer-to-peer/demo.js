// Client-Server vs Peer-to-Peer — chat demo, two topologies.
// Run: node demo.js

// ============================================================
// 1) CLIENT-SERVER: every message routes through a central hub.
// ============================================================

class ChatServer {
  constructor() { this.clients = []; }
  connect(client) { this.clients.push(client); }
  disconnect(client) { this.clients = this.clients.filter(c => c !== client); }
  broadcast(from, message) {
    for (const c of this.clients) {
      if (c !== from) c.deliver(from.name, message);
    }
  }
}

class Client {
  constructor(name, server) { this.name = name; this.server = server; this.received = []; }
  send(msg)        { this.server.broadcast(this, msg); }
  deliver(from, m) { this.received.push(`${from}: ${m}`); }
}

console.log('=== Client-Server ===');
const server = new ChatServer();
const cs = ['alice', 'bob', 'carol', 'dave'].map(n => {
  const c = new Client(n, server); server.connect(c); return c;
});
cs[0].send('hi everyone');
console.log('bob received:', cs[1].received);

console.log('\n--- The server goes down ---');
const downServer = { broadcast() { throw new Error('server unreachable'); } };
const c5 = new Client('eve', downServer);
try { c5.send('anyone there?'); } catch (e) { console.log('eve says:', e.message); }
console.log('Single point of failure → all communication stops.\n');

// ============================================================
// 2) PEER-TO-PEER: peers gossip directly. No central node.
// ============================================================

class Peer {
  constructor(name) { this.name = name; this.peers = []; this.received = []; this.alive = true; this.seen = new Set(); }
  connect(other) { this.peers.push(other); other.peers.push(this); }
  send(msg) {
    const id = `${this.name}-${Math.random().toString(36).slice(2, 8)}`;
    this.gossip({ id, from: this.name, msg });
  }
  gossip(envelope) {
    if (this.seen.has(envelope.id)) return;     // dedup; otherwise gossip storms
    this.seen.add(envelope.id);
    if (envelope.from !== this.name) {
      this.received.push(`${envelope.from}: ${envelope.msg}`);
    }
    // Forward to all live neighbors
    for (const p of this.peers) {
      if (p.alive) p.gossip(envelope);
    }
  }
}

console.log('=== Peer-to-Peer ===');
const peers = ['p1', 'p2', 'p3', 'p4'].map(n => new Peer(n));
peers[0].connect(peers[1]);
peers[1].connect(peers[2]);
peers[2].connect(peers[3]);
// Topology: p1 — p2 — p3 — p4 (a chain).

peers[0].send('hello mesh');
console.log('p4 received via gossip:', peers[3].received);

console.log('\n--- p2 goes offline ---');
peers[1].alive = false;
peers[0].send('still going?');
console.log('p4 received (route p1→p2 broken; chain is severed):', peers[3].received);
console.log('Take note: P2P resilience depends on TOPOLOGY. Chain breaks; mesh would survive.');

console.log('\n--- Re-connect p1 directly to p3, then try again ---');
peers[0].connect(peers[2]);
peers[0].send('attempt 2');
console.log('p4 received:', peers[3].received);
console.log('No central authority needed — but discovery, dedup, and topology are now design problems.');
