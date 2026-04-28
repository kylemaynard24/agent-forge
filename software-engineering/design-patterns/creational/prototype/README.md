# Prototype

**Category:** Creational

## Intent

Create new objects by **cloning an existing instance** (the prototype) rather than instantiating a class from scratch. Useful when construction is expensive, when you want to pre-configure "template" objects, or when the class of the object to create isn't known until runtime.

## When to use

- Instantiation is expensive (reads from a file, calls a service, allocates a lot).
- You want to start from a pre-configured "template" and tweak a few fields.
- You want the client to add new product variants at runtime by registering prototype instances, instead of writing new subclasses.

## Structure

```
Prototype                    (has clone() method)
  │
  ├── ConcretePrototypeA ──► clone() returns a copy of self
  └── ConcretePrototypeB ──► clone() returns a copy of self
```

Clients hold a prototype registry (e.g. a `Map<name, prototype>`), look one up, clone it, and modify the copy.

## Trade-offs

**Pros**
- Skip expensive construction by reusing a pre-built instance
- Add new variants at runtime without new classes
- Natural fit for "document templates" or "enemy variants in a game"

**Cons**
- Deep cloning of complex object graphs is tricky (cycles, external references, class identity)
- Cloning can accidentally share state if you do a shallow copy where a deep copy was needed

## JavaScript note

JavaScript's own object model is *prototypal* — every object has a `[[Prototype]]` link. `Object.create(proto)` makes an object whose prototype is `proto`. That's a language feature, not the GoF pattern. The GoF Prototype pattern is about an *instance* cloning *itself*, typically via a `clone()` method.

Common cloning strategies in JS:
- `structuredClone(obj)` — built-in deep clone (Node 17+)
- `JSON.parse(JSON.stringify(obj))` — works for plain data, loses functions and class identity
- Custom `clone()` method — the GoF-style approach, and what the demo uses

## Real-world analogies

- Cell division — an organism reproducing by copying itself.
- Spawning enemies in a game: one `goblin` prototype, cloned many times with small variations.
- Document templates (a résumé template, copied and edited).

## Run the demo

```bash
node demo.js
```

Demonstrates a `GameEntity` with a `clone()` method. A registry of prototype enemies lets the game spawn fully-configured instances via `registry.spawn('archer')` instead of reconstructing each one.

## Deeper intuition

Creational patterns are about dependency control at the moment of construction. They matter because the way objects come into existence often leaks into the rest of the codebase, forcing callers to know concrete types, lifecycle rules, or assembly details they should not have to carry.

When you study **Prototype**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
