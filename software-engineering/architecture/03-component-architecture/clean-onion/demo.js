// Clean Architecture (Onion) — dependencies point inward only.
// Run: node demo.js

// === RING 1: ENTITIES (innermost, most stable) ===
// Knows nothing but the domain.
class User {
  constructor({ id, email, passwordHash, status = 'active' }) {
    this.id = id; this.email = email; this.passwordHash = passwordHash; this.status = status;
  }
  isActive() { return this.status === 'active'; }
  deactivate() { this.status = 'inactive'; }
}

// === RING 2: USE CASES (application rules) ===
// Imports entities. Defines port interfaces (repos, services it needs). Knows nothing of HTTP or DBs.
class CreateUserUseCase {
  constructor({ users, hasher, idgen }) {
    this.users = users;       // UserRepository port
    this.hasher = hasher;     // PasswordHasher port
    this.idgen = idgen;       // IdGenerator port
  }

  async execute({ email, password }) {
    if (!email.includes('@')) throw new Error('invalid email');
    if (await this.users.findByEmail(email)) throw new Error('email taken');
    const user = new User({
      id: this.idgen.next(),
      email,
      passwordHash: this.hasher.hash(password),
    });
    await this.users.save(user);
    return user;
  }
}

// === RING 3: INTERFACE ADAPTERS ===
// Translate between use cases and the outside. Implement use case ports.

class InMemoryUserRepo {
  constructor() { this.byEmail = new Map(); }
  async findByEmail(e) { return this.byEmail.get(e) ?? null; }
  async save(u) { this.byEmail.set(u.email, u); }
}

class FakeHasher { hash(p) { return `H(${p})`; } }
class IncrementingIdGen { constructor() { this.n = 0; } next() { return `u-${++this.n}`; } }

// HTTP-ish controller: turns request into a use case call, formats the response.
class UserController {
  constructor(useCases) { this.uc = useCases; }
  async POST_users(body) {
    try {
      const user = await this.uc.createUser.execute(body);
      return { status: 201, body: { id: user.id, email: user.email } };
    } catch (e) {
      return { status: 400, body: { error: e.message } };
    }
  }
}

// === RING 4: FRAMEWORKS & DRIVERS (composition root simulates this) ===
const repo = new InMemoryUserRepo();
const createUser = new CreateUserUseCase({
  users: repo,
  hasher: new FakeHasher(),
  idgen: new IncrementingIdGen(),
});
const controller = new UserController({ createUser });

(async () => {
  console.log(await controller.POST_users({ email: 'kyle@x.com', password: 'p' }));
  console.log(await controller.POST_users({ email: 'kyle@x.com', password: 'p' })); // duplicate
  console.log(await controller.POST_users({ email: 'bad', password: 'p' }));
})();

// Direction of imports:
//   Controller   -> UseCase -> Entity
//   InMemoryRepo -> UseCase port (NOT use case impl)
// Nothing in the inner rings knows about the outer rings.
