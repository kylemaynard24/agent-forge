# Composite

**Category:** Structural

## Intent

Compose objects into **tree structures** to represent part-whole hierarchies, so clients can treat **individual objects and compositions uniformly**. A "file" and a "folder" support the same operations (`size()`, `listing()`), even though one is a leaf and the other contains children.

## When to use

- You have a tree-shaped domain (filesystem, UI widgets, organizational chart, AST, product bundles).
- Client code should recurse through the tree without caring whether each node is a leaf or a composite.
- You want leaves and composites to share an interface so operations can be uniform.

## Structure

```
Component (interface)
   │
   ├── Leaf                (no children)
   └── Composite           (has children: Component[])
                           └─ delegates operations to children
```

A typical `Composite.operation()` iterates its children and calls `operation()` on each, accumulating results.

## Trade-offs

**Pros**
- Clients stay simple — they don't branch on "is this a leaf?"
- Adding a new kind of leaf or composite is localized
- Natural fit for recursive structures

**Cons**
- The shared interface can become too permissive — a `Leaf` that "shouldn't" support `add(child)` is awkward
- Type safety weakens (you can't always tell leaf from composite at compile time)

## Real-world analogies

- **Filesystems** — files and folders share `size()`, `move()`, etc.
- **UI widgets** — buttons and panels both respond to `render()` and `click()`.
- **Product bundles** — a single product and a bundle both have a `price()`.

## Run the demo

```bash
node demo.js
```

Demonstrates a mini filesystem with `File` (leaf) and `Folder` (composite). Both implement `size()` and `print()`; the client prints a whole tree without knowing or caring which nodes are folders.
