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
