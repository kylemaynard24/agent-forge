# Homework — Iterator

> Traverse a collection without exposing its internals.

## Exercise: Three orders of a binary tree

**Scenario:** Build a `BinaryTree` and expose three iterators: in-order, pre-order, post-order. All must be lazy — no flattening to an array first.

**Build:**
- A `BinaryTree` with `insert(value)`.
- Three iterator factories: `tree.inOrder()`, `tree.preOrder()`, `tree.postOrder()` — each returning an iterable.
- Use JavaScript's iterator protocol (or generator functions).
- A demo that prints all three traversals for the same tree.

**Constraints (these enforce the pattern):**
- The tree's internal structure (nodes, links) must not leak to callers.
- Iteration must be lazy: pulling 5 values from `inOrder()` should not visit more than necessary.
- Multiple concurrent iterators on the same tree must not interfere — start two in-order iterators, advance one fully, then the other; both must produce the full sequence.

## Stretch

Add a fourth iterator that yields only leaf values. Add a fifth that yields values in a `filter(predicate)` style — implemented in terms of an existing iterator.

## Reflection

- JS already has `Symbol.iterator` and generators. What does the GoF Iterator buy you in a language that already supports it natively?

## Done when

- [ ] All three traversals produce the correct order for a known tree.
- [ ] Two concurrent iterators produce independent, complete sequences.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Separation of Concerns (intention-revealing interfaces)

An iterator's value to clean code is not just encapsulation — it's that consumer code can be written in the language of the domain rather than the language of the data structure. Applied cleanly, a loop over `tree.inOrder()` reads as a statement about the domain ("process values in sorted order"); applied messily, the consumer manually tracks a stack, checks for null children, and manages traversal state, hiding the domain intent under structural noise.

**Exercise:** Write the same tree traversal twice: once using your iterator and once by directly walking nodes. Count the number of lines in each version that describe *what you want* versus lines that describe *how the tree is structured*. The ratio tells you exactly how much clean-code value your iterator is delivering.

**Reflection:** Your iterator method is called `inOrder()` — if you renamed it to `getInOrderTraversalIterator()`, it would be more descriptive but less readable in a for-of loop. Where is the line between a name that reveals intent and a name that over-explains?
