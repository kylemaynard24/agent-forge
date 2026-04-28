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
