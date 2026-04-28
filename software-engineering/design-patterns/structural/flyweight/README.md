# Flyweight

**Category:** Structural

## Intent

Support large numbers of fine-grained objects efficiently by **sharing** the parts that are the same. Split an object's state into:

- **Intrinsic state** — shared, immutable, context-free (e.g. the glyph for the letter "A" in Arial 12pt)
- **Extrinsic state** — unique per use, passed in by the client (e.g. *where* that A appears on the page)

## When to use

- Your application would otherwise create *huge* numbers of similar objects.
- Much of each object's state is the same across instances.
- Memory pressure is real — rendering characters in a document, particles in a game, tree types in a forest.

## Structure

```
Flyweight  (holds intrinsic state; has operation(extrinsic))
  │
  └── ConcreteFlyweight

FlyweightFactory  (caches flyweights; ensures sharing)
   - get(key) ──► returns existing or creates and caches

Client
  - holds extrinsic state
  - calls flyweight.operation(extrinsic)
```

## Trade-offs

**Pros**
- Drops memory usage dramatically when objects share state
- Performance often improves too (better cache locality)

**Cons**
- Only helps when the intrinsic/extrinsic split is clean
- Adds indirection — every call passes extrinsic state explicitly
- Can interact badly with mutation: shared flyweights must be immutable

## Real-world analogies

- **Characters in a text editor** — millions of glyphs, all drawn from a small set of unique (char, font, size) combinations.
- **Forests in a game** — 100,000 trees, but only 5 tree models reused at varying positions/rotations.
- **Emoji tables** — one sprite per emoji, referenced by millions of messages.

## Run the demo

```bash
node demo.js
```

Demonstrates a `GlyphFactory` that caches unique `(char, font, size)` triples. A document adds hundreds of characters that all share a handful of flyweights — the factory reports how many unique flyweights were actually created.

## Deeper intuition

Structural patterns are about reshaping relationships without rewriting the underlying behavior. They earn their keep when a system needs compatibility, composition, simplification, access control, or independent variation across different dimensions of the design.

When you study **Flyweight**, focus less on memorizing participants and more on spotting the design pressure it resolves. Patterns become powerful when you can recognize the force first and name the pattern second. The pattern is usually just the cleanest way of making an important distinction explicit.

## What to notice in real code

- What is the stable interface or responsibility, and what is allowed to vary?
- Which dependency or decision has been moved somewhere more explicit?
- What extra indirection does this pattern add, and is the payoff worth it here?
- Which nearby pattern would someone confuse with this one, and why is this a better fit?
