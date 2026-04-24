// Mediator — chat room routing messages between users
// Run: node demo.js

// --- Mediator ---

class ChatRoom {
  constructor(name) {
    this.name = name;
    this.users = new Map(); // name -> User
  }

  register(user) {
    this.users.set(user.name, user);
    user.chatRoom = this;
    console.log(`[${this.name}] ${user.name} joined`);
  }

  broadcast(from, text) {
    for (const user of this.users.values()) {
      if (user.name !== from) user.receive(from, text);
    }
  }

  direct(from, toName, text) {
    const to = this.users.get(toName);
    if (!to) {
      console.log(`[${this.name}] ${from}: unknown user "${toName}"`);
      return;
    }
    to.receive(from, `(DM) ${text}`);
  }
}

// --- Peer ---

class User {
  constructor(name) {
    this.name = name;
    this.chatRoom = null;
  }

  send(text) {
    this.chatRoom.broadcast(this.name, text);
  }

  dm(toName, text) {
    this.chatRoom.direct(this.name, toName, text);
  }

  receive(fromName, text) {
    console.log(`  [${this.name}] ← ${fromName}: ${text}`);
  }
}

// --- Demo ---

console.log('=== Mediator demo ===\n');

const room = new ChatRoom('#general');

const alice = new User('alice');
const bob   = new User('bob');
const carol = new User('carol');

room.register(alice);
room.register(bob);
room.register(carol);

console.log();
alice.send('hi everyone');
bob.send('yo');
carol.dm('alice', 'quick question');
alice.dm('carol', 'sure, what\'s up');

console.log('\nKey idea: users never reference each other — only the ChatRoom.');
console.log('Add a fourth user and no existing user code changes.');
