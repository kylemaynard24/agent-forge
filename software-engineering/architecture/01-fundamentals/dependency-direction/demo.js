// Dependency Direction — high-level policy depends on an abstraction.
// Run: node demo.js

// === The abstraction (stable, owned by the policy layer) ===
// In TypeScript this would be an interface; in JS, it's a duck-typed shape:
//   { findByEmail(email): Promise<User|null>, save(user): Promise<void> }

// === The high-level policy ===
// It depends ONLY on the abstraction. It doesn't know about Postgres,
// in-memory maps, HTTP, or anything else.

class UserSignupPolicy {
  constructor(storage) {
    this.storage = storage;
  }

  async signup(email, password) {
    const existing = await this.storage.findByEmail(email);
    if (existing) throw new Error('email already taken');
    const user = { email, passwordHash: hash(password) };
    await this.storage.save(user);
    return user;
  }
}

function hash(s) { return `H(${s})`; }   // toy

// === Two implementations (volatile, can be swapped freely) ===

class InMemoryUserStorage {
  constructor() { this.users = new Map(); }
  async findByEmail(email) { return this.users.get(email) ?? null; }
  async save(user) { this.users.set(user.email, user); }
}

class FakePostgresUserStorage {
  constructor() { this.rows = []; }
  async findByEmail(email) {
    console.log(`[pg] SELECT * FROM users WHERE email='${email}'`);
    return this.rows.find(r => r.email === email) ?? null;
  }
  async save(user) {
    console.log(`[pg] INSERT INTO users(email, hash) VALUES ('${user.email}', '${user.passwordHash}')`);
    this.rows.push(user);
  }
}

// === Demo ===
//
// Notice the arrow of dependency in the SOURCE:
//   - UserSignupPolicy imports nothing about storage implementations.
//   - InMemoryUserStorage and FakePostgresUserStorage are passed in at the edge.
// At RUNTIME, the policy calls into the implementation — but in source, the
// implementation depends on (conforms to) the abstraction the policy expects.

(async () => {
  console.log('--- Policy + in-memory storage ---');
  const inMem = new UserSignupPolicy(new InMemoryUserStorage());
  console.log(await inMem.signup('a@x', 'p'));

  console.log('\n--- Same policy, swap to "Postgres" — zero code edits ---');
  const pg = new UserSignupPolicy(new FakePostgresUserStorage());
  console.log(await pg.signup('b@y', 'p'));

  console.log('\n--- Policy is unchanged. Only wiring at the edge changed. ---');
})();
