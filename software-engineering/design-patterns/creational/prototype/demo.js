// Prototype — game entity cloning
// Run: node demo.js

class GameEntity {
  constructor({ name, hp, attacks, inventory }) {
    this.name = name;
    this.hp = hp;
    this.attacks = attacks;          // array
    this.inventory = { ...inventory }; // object
  }

  clone() {
    // Deep enough for this shape: shallow-copy primitives, duplicate nested
    // containers so mutations on the clone don't leak back to the prototype.
    return new GameEntity({
      name: this.name,
      hp: this.hp,
      attacks: [...this.attacks],
      inventory: { ...this.inventory },
    });
  }

  describe() {
    const items = Object.entries(this.inventory).map(([k, v]) => `${k}×${v}`).join(', ');
    return `${this.name} (hp ${this.hp}) — attacks: [${this.attacks.join(', ')}], inv: {${items}}`;
  }
}

// --- Prototype registry ---

class EntityRegistry {
  constructor() { this._prototypes = new Map(); }

  register(key, prototype) { this._prototypes.set(key, prototype); }

  spawn(key) {
    const proto = this._prototypes.get(key);
    if (!proto) throw new Error(`No prototype registered for "${key}"`);
    return proto.clone();
  }
}

// --- Demo ---

console.log('=== Prototype demo ===\n');

const registry = new EntityRegistry();

registry.register('goblin', new GameEntity({
  name: 'Goblin',
  hp: 30,
  attacks: ['claw', 'bite'],
  inventory: { coin: 2 },
}));

registry.register('archer', new GameEntity({
  name: 'Elf Archer',
  hp: 55,
  attacks: ['bow'],
  inventory: { arrow: 20, bow: 1 },
}));

// Spawn instances — each is a fresh clone
const g1 = registry.spawn('goblin');
const g2 = registry.spawn('goblin');
g2.name = 'Goblin Chief';
g2.hp = 60;
g2.inventory.coin = 12;

const a1 = registry.spawn('archer');
a1.inventory.arrow = 5; // used some

console.log(g1.describe());
console.log(g2.describe());
console.log(a1.describe());

console.log('\nKey idea: no new subclasses were needed to get variants —');
console.log('the registry holds pre-built prototypes, and clone() produces fresh instances.');
