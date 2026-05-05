# Homework — Prototype

> Create new objects by cloning an existing one. The clone is a separate object — not a reference.

## Exercise: Level-editor enemy registry

**Scenario:** A game's level editor lets the designer define enemy templates (e.g., a `Goblin` with HP 30, speed 5, loadout `[rustySword, leatherArmor]`). The user stamps 100 goblins onto the map; each can be tweaked individually after stamping.

**Build:**
- An `Enemy` class with a `clone()` method returning a deep copy.
- A `TemplateRegistry` that holds named templates and produces fresh instances via `register(name, template)` and `spawn(name)`.
- A demo that spawns 100 goblins, tweaks one, and shows the others (and the template) untouched.

**Constraints (these enforce the pattern):**
- `clone()` must produce a deep copy — mutating `clone.loadout.weapon.durability` must not affect the template or any sibling clone.
- No use of a constructor that takes 12 parameters — the registry must clone, not re-construct.
- Templates remain mutable from the designer's tools but immutable from spawn-time clones (tweaks affect copies only).

## Stretch

Make `clone()` polymorphic — when an `Enemy` subclass adds new fields, its `clone()` should still deep-copy them without the parent class knowing about them.

## Reflection

- Why not just use `JSON.parse(JSON.stringify(obj))`? Where does that approach break? (Hint: functions, Dates, prototypes, cycles.)

## Done when

- [ ] A test mutates a clone's nested loadout and proves the template is untouched.
- [ ] Two clones from the same template have independent state.

---

## Clean Code Lens

**Principle in focus:** Encapsulation + Minimal Surface Area

The `clone()` method is a promise: "I give you an independent copy and you don't need to know how I'm structured internally." Applied cleanly, `clone()` is the only place in the codebase that knows about the enemy's nested structure — calling code simply calls `registry.spawn('goblin')` and receives a fully independent object without any knowledge of `loadout`, `weapon`, or `durability`. Applied messily, a clone that returns a shallow copy forces callers to perform additional deep-copy steps themselves, which means the internal structure of `Enemy` has leaked into every call site that uses `spawn`.

**Exercise:** Write a test that mutates every nested field on a spawned clone — `loadout`, `weapon.durability`, `stats.hp` — and then asserts the template is unchanged. The test is passing when `clone()` is the only code you had to write to make it pass; if you needed to add deep-copy logic anywhere outside `clone()`, the encapsulation is broken.

**Reflection:** The constraint says no constructor with 12 parameters — but `clone()` is a constructor in disguise. What does this tell you about when a copy constructor is cleaner than a `clone()` method, and when `clone()` is the right abstraction?
