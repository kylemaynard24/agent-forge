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
