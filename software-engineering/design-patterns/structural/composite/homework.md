# Homework — Composite

> Treat individual objects and groups of objects uniformly through a shared interface.

## Exercise: Filesystem model

**Scenario:** Model a filesystem. `File` and `Directory` share a `Node` interface. `Directory` contains a list of `Node` (which may be files or other directories).

**Build:**
- A `Node` base type with `size()`, `find(predicate)`, `print(indent = 0)`.
- `File` (leaf) holding bytes.
- `Directory` (composite) holding children and forwarding operations recursively.
- A demo that builds a 3-level tree, computes total size, finds files matching a predicate, and prints the tree.

**Constraints (these enforce the pattern):**
- No `instanceof Directory` checks anywhere outside the classes themselves.
- `size()`, `find()`, `print()` are each defined ONCE per class — clients never branch on type.
- The recursion lives in `Directory`, not in callers.

## Stretch

Handle a symlink-shaped cycle (`a/b → a`) without infinite-looping. Decide: detect and throw? detect and skip? Document the choice.

## Reflection

- What changes about Composite when leaves and composites have *genuinely different* operations? (Hint: it stops fitting cleanly.)

## Done when

- [ ] `directory.size()` correctly sums all nested files.
- [ ] `find(n => n.name.endsWith('.js'))` works on both leaves and composites with no special-casing.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Open/Closed Principle

The component interface name is the claim that unifies the hierarchy — `Node` says "these things participate in the tree in the same way," and it should name the *capability*, not the structural role. Applied cleanly, the interface expresses a capability vocabulary (`size()`, `find()`, `print()`) so that calling code reads as domain logic over that capability with no awareness of whether it is talking to a leaf or a composite. Applied messily, an interface named `FileSystemElement` or `AbstractNode` with methods like `getChildren()` or `isLeaf()` exposes the structural distinction the pattern is meant to erase, forcing callers to check type before every operation.

**Exercise:** Read your demo's top-level calls on the root `Directory` — `root.size()`, `root.find(...)`, `root.print()` — and cover the class definitions. Do those three calls read as domain operations on "a filesystem node" with no visible hint that a tree is involved? If you can see the recursion from the call site, the interface is leaking structure.

**Reflection:** The constraint bans `instanceof Directory` checks outside the classes — but `instanceof` is really a symptom, not the problem. What is the underlying design question: if `Directory` has a method that `File` cannot sensibly implement (e.g., `addChild`), does it belong on the shared interface, and what does your answer imply about the interface's name?
