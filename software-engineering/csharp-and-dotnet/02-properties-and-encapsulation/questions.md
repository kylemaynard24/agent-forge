# Questions — Properties and encapsulation

Three questions on the design judgment behind property forms and access control.

---

### Q1. The homework required `WeatherStation.Readings` to expose `IReadOnlyList<Temperature>` rather than `List<Temperature>`. What's the actual benefit, and why does it matter at scale?

**How to think about it:**

`List<T>` is a *mutable* type. Returning it means giving the caller permission to `Add`, `Remove`, `Sort`, `Clear`, even reorder the underlying storage. The caller may not realize they're modifying your internal state — they just see a `List` and treat it like one.

`IReadOnlyList<T>` is an *interface* exposing only the read-only operations: indexer, count, enumeration. Behind the scenes, the actual instance is still a `List<T>` (because `List<T>` implements `IReadOnlyList<T>`), so there's no copy and no performance cost. But the type at the boundary signals "you can read this; you cannot mutate it."

The benefit is **encapsulation that the type system enforces**. Without it, your encapsulation depends on every caller "knowing not to" mutate. They won't all know. The bug appears when someone, somewhere, calls `station.Readings.Add(fakeReading)` to "test" something, and now your station's invariants are silently broken.

At scale (large team, long-lived codebase), this matters because: (1) you can change the internal representation later — swap `List<T>` for `T[]` or `ImmutableArray<T>` — without breaking any caller, since they only depend on the read-only interface; (2) the public API of your class is *honestly described* by its return types, which makes reasoning about it easier; (3) code reviewers can catch encapsulation violations by reading the type, not the call sites.

The senior principle: **return the most restrictive interface that satisfies the caller's needs.** `IEnumerable<T>` if they only need to iterate. `IReadOnlyCollection<T>` if they also need a count. `IReadOnlyList<T>` if they need indexed access. Reach for `List<T>` in a return type only when the caller genuinely needs to mutate — which is rare in well-designed APIs.

---

### Q2. C# has properties (`int Age { get; }`) and methods (`int GetAge()`). They can do nearly the same thing. Why does the language have both, and how do you pick?

**How to think about it:**

Mechanically, properties are syntactic sugar for one or two methods (`get_Age()` and `set_Age(int value)`). The compiler generates them; the IL output of `obj.Age` and `obj.GetAge()` is essentially identical. So the question isn't "which is more powerful" — it's "what does each *signal*."

The convention, written down in the .NET design guidelines and reinforced by every C# style guide, is:

- **Properties** signal **field-like access**. Reading a property should *look* and *feel* like reading a field — fast, side-effect-free, idempotent. The caller should be able to read it twice in a row and get the same answer (or at least, the same answer modulo external state changes they expect).
- **Methods** signal **operations** — work that may take time, have side effects, throw on the normal path, or vary in surprising ways.

Concretely:

| Use a property when... | Use a method when... |
|---|---|
| The value is cheap to compute or already stored | The work is non-trivial (I/O, large compute) |
| There are no side effects | Calling has side effects (mutation, network, etc.) |
| It feels like an attribute of the object | It feels like a verb |
| Two reads in a row would return the same value | The result depends on parameters or external state |
| It can't fail in expected ways | It can fail and the caller should be ready |

Examples that follow this:

- `string.Length` is a property — instant, no side effects.
- `string.ToUpper()` is a method — allocates a new string (work being done; not free).
- `DateTime.Now` is a property — *technically* changes between calls, but feels like reading a clock.
- `File.Exists(path)` is a method — does I/O; could be slow; arguably should fail in some scenarios.
- `list.Count` is a property — pre-stored, O(1).
- `list.Where(pred)` is a method — actual work.

The senior-engineer instinct: if reading `obj.X` makes a network call, that's the wrong shape. Make it `obj.GetXAsync()` so the caller knows they're paying for I/O. The cost of confusing the two is hidden performance bugs and surprising failures — a class that *looks* like it has cheap data access but actually opens a file every time will tank under load and nobody will know why.

---

### Q3. The homework had you use `init` properties almost everywhere instead of `set`. Why is "settable only at construction time" usually the right default, and when do you actually need a regular `set`?

**How to think about it:**

Mutable state is the source of most non-trivial bugs. Once an object can change after creation, every piece of code that holds a reference to it has to assume it might change at any time. Reasoning becomes "what's the state RIGHT NOW?" instead of "what is this thing?" — and "right now" is hard to nail down in any non-trivial program.

Init-only properties (`{ get; init; }`) let you build immutable objects without giving up the convenience of object-initializer syntax. You write `new Customer { Name = "Kyle", Email = "..." }` exactly like before, but after construction, those properties can never change. Any code that holds a reference to that `Customer` knows: this object will not mutate from under me.

The benefits compound at scale:

1. **Concurrency safety, free.** Immutable objects are safe to share across threads without locks. Mutable ones aren't.
2. **Easier reasoning.** A method that takes an immutable `Customer` doesn't have to defend against the customer changing mid-method.
3. **Aliasing safety.** If two parts of your code hold the same `Customer` reference, neither can surprise the other with a mutation.
4. **Easier testing.** You don't have to set up "the state of the world" — the object's state IS its construction.

When *do* you need a regular `set`?

- When the property genuinely models **changeable real-world state** that the object owns. A `Counter.Value` that increments. A `Game.Score` that grows. A `Cart.Items` collection. These are real cases — the world *is* mutable; pretending otherwise produces awkward code.
- When you'd otherwise have to construct a whole new object on every change, and the cost of that construction is significant (large objects, hot paths). Most of the time, "construct a new one with `with`" is fine — but for high-frequency mutation, in-place mutation is the right tool.
- When the framework you're working with requires it — some serialization libraries, some ORMs, some UI frameworks need settable properties to populate objects. (Modern versions of all of these handle init-only fine, but legacy code may not.)

The default should be: **start with `init`. Promote to `set` only when you have a real reason.** It's much easier to add a setter later (no callers break) than to remove one (every caller that uses it breaks). The asymmetry of cost should drive the default.

The deepest version of this principle: **a class with a mostly-immutable surface is a class you can refactor with confidence.** You can change internals freely because no caller is relying on mutation patterns. A class full of public setters has accidentally exposed its implementation as its API — every refactor risks breaking someone.
