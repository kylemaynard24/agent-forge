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
