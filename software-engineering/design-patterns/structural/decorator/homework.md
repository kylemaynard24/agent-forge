# Homework — Decorator

> Add behavior to an object without subclassing — by wrapping it.

## Exercise: Composable byte streams

**Scenario:** Start with a `ByteStream` that just writes bytes to memory. Add three decorators: `BufferedStream`, `GzipStream`, `EncryptedStream`. They must compose in any order.

**Build:**
- A `ByteStream` interface with `write(bytes)` and `read()`.
- A `MemoryStream` base implementation.
- Three decorators wrapping any `ByteStream` and adding their behavior.
- A round-trip demo: `new Encrypted(new Gzip(new Buffered(stream)))` — write data through, read it back, verify equality.

**Constraints (these enforce the pattern):**
- Each decorator implements the same `ByteStream` interface as its inner.
- The base stream must work without any decorators.
- Order of decoration must be observable in behavior (not just code).

## Stretch

Show a matching reader chain that reverses the writer chain. Why is `new Buffered(new Gzip(new Encrypted(stream)))` fundamentally different from `new Encrypted(new Gzip(new Buffered(stream)))`?

## Reflection

- Why is **encrypt-then-compress** almost always wrong in practice? (Hint: ciphertext entropy.)
- When does Decorator beat subclassing? When does it lose?

## Done when

- [ ] All 6 permutations either round-trip cleanly or fail with a clear reason.
- [ ] Adding a `Base64Stream` decorator requires zero edits to existing code.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Single Responsibility Principle

Each decorator's name is an additive claim — `GzipStream` says "this is a stream that also compresses," and the name should describe the one thing the decorator adds, not the full stack. Applied cleanly, a stack like `new EncryptedStream(new GzipStream(new BufferedStream(base)))` reads as a layered specification from the outside in, and each decorator's single responsibility is visible in its name without opening any class. Applied messily, a decorator named `SecureBufferedStream` that does both buffering and encryption has merged two responsibilities into one, making it impossible to reorder, swap, or omit one layer independently.

**Exercise:** For each of your three decorators, write a one-sentence contract: "This decorator adds X to any `ByteStream` it wraps, and changes nothing else." If the sentence requires "and" for a single decorator, split it. Then verify that the construction order `new Encrypted(new Gzip(new Buffered(stream)))` maps naturally onto those three independent contracts.

**Reflection:** The stretch goal asks why `new Buffered(new Gzip(new Encrypted(stream)))` is fundamentally different from `new Encrypted(new Gzip(new Buffered(stream)))` — but from the perspective of clean names, both stacks are equally readable. What does this tell you about the limits of naming as a design tool when order-of-composition carries semantic meaning that the names cannot express?
