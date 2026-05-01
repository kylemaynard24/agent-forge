# Questions — Quick syntax catchup

Three questions to check you've absorbed the *judgment* underneath the syntax. Try to answer in your own words first; the explanations after are how to think about each.

---

### Q1. When is `var` the right choice, and when should you use the explicit type?

**How to think about it:**

`var` is C#'s type-inference shortcut. The compiler still computes a specific type at compile time — the variable is exactly as strongly typed as if you wrote it out — but the source code doesn't show it. The argument for `var` is concision and refactor safety: when the right-hand side changes type, the declaration adjusts automatically. The argument against is *legibility for the reader*: if I'm scanning code I haven't seen before, `var orders = GetThing();` tells me nothing about what `orders` is, while `IReadOnlyList<Order> orders = GetThing();` is self-documenting.

The dominant convention in modern .NET, codified in the .NET coding guidelines, is: use `var` when the type is **obvious from the right-hand side** (`var orders = new List<Order>();` — yes; `var x = 5;` — also yes), and use the explicit type when the type **isn't obvious or is doing important work** (return values from methods whose signature you don't have memorized; APIs where the type signals something to the reader).

The deeper principle: code is read more times than it's written. If `var` makes a line harder to skim than the explicit type would, use the explicit type. If the explicit type adds noise without information, use `var`. Reach for whichever produces the more obviously-correct line of code at the call site.

---

### Q2. Why does C# distinguish `string` from `string?` even though both can hold a string?

**How to think about it:**

In older C# (pre-version 8), every reference type could hold `null`, and the type system gave you no way to express "this variable will not be null." `string name` could be null at any time, and the only way to know was to test at runtime — every method had to defensively check, and even then you'd miss cases. The "billion-dollar mistake" (Tony Hoare's term for null) bit C# just like it bit every C-family language.

Modern C# (with nullable reference types **enabled**, which is the project default since .NET 6) lets the type signature express intent: `string` means "this is not null" and `string?` means "this can be null." The compiler tracks this through the program and warns when you might dereference a null. The result: most NullReferenceExceptions become compile-time warnings. You move the cost of null safety from "every runtime call site" to "the type system catches it at compile time."

The reason it's a separate type at the syntax level — `string?` rather than just letting `string` accept null — is precisely so the compiler can enforce the distinction. If both meant the same thing at compile time, the type couldn't help you. The friction of writing the `?` is the feature: it forces a deliberate decision at every variable declaration.

The senior-engineer view: nullability annotations are part of the API contract, not a stylistic preference. A method that returns `User?` is telling the caller "you must handle the null case." A method that returns `User` is promising "you'll always get one." Honoring those contracts makes large codebases tractable; ignoring them puts the project right back to the pre-NRT world.

---

### Q3. Why does the modern C# style guide prefer `foreach` over `for` for iteration?

**How to think about it:**

A `for` loop with an index is a *generic iteration mechanism* — it works for arrays, lists, anything indexable — but it requires you to manage three things explicitly: the start value, the termination condition, and the increment. Each of those is a chance to introduce bugs (off-by-one errors, infinite loops, wrong increment, mutation that invalidates the bounds).

`foreach` works for *any sequence* (anything implementing `IEnumerable<T>`) and abstracts away the index entirely. It expresses intent at a higher level: "do this once for each element." The compiler handles the iteration mechanics. You can't write an off-by-one bug in a `foreach`, and the resulting code is shorter.

The `for` loop earns its place when:

- You need the **index** as part of the work (e.g., `for (int i = 0; i < items.Length; i++) { Console.WriteLine($"{i}: {items[i]}"); }`).
- You need to **iterate non-sequentially** (every other element, in reverse, etc.).
- You're working with a primitive array in a performance-critical hot loop where avoiding the iterator allocation matters.

For the 90% case — "do something with each element" — `foreach` is shorter, harder to break, and reads at the level of intent rather than implementation.

The deeper principle this teaches: prefer language constructs that **express what you want**, not how the machine should do it. `foreach` says "for each element"; `for` says "for an index from N to M, with a step." When the *what* is the same, the language form that says it more directly is the right one. This is the same philosophy that makes LINQ (topic 06) preferable to manual loops for filter/map/aggregate work — they express intent rather than mechanics.
