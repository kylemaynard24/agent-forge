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
