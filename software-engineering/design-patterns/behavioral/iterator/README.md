# Iterator

**Category:** Behavioral

## Intent

Provide a way to **access the elements of a collection sequentially** without exposing its underlying representation. The client iterates; the iterator knows how to traverse.

## When to use

- You want clients to walk a collection without learning its internals (tree, graph, ring buffer).
- You want multiple traversal orders over the same collection (pre-order, in-order, reverse).
- You want a collection to support multiple concurrent iterations.

## JavaScript note

JavaScript has **first-class iterators** via the `Symbol.iterator` / `Symbol.asyncIterator` protocols. Any object that implements them works with `for...of`, spread, destructuring, `Array.from`, etc. That's the idiomatic way to apply this pattern in JS — not a separate `Iterator` class.

```js
class MyCollection {
  *[Symbol.iterator]() {
    yield 1; yield 2; yield 3;
  }
}

for (const x of new MyCollection()) console.log(x); // 1, 2, 3
```

The generator (`*function`) syntax implements the iterator protocol for you.

## Structure (traditional GoF)

```
Iterator                         Aggregate
  + next()                         + createIterator()
  + hasNext()

ConcreteIterator              ConcreteAggregate
  - cursor                         - items
```

In JavaScript, `Symbol.iterator` replaces `createIterator()` and `for...of` replaces `hasNext() / next()`.

## Trade-offs

**Pros**
- Uniform traversal interface across collection types
- Supports multiple concurrent iterations
- Lets collections stay internally flexible (tree → array → skip list with no client changes)

**Cons**
- For trivial collections, it's overkill — arrays already have iteration built in
- Generator-based iterators can be hard to pause/inspect

## Real-world analogies

- `for...of` on any JS collection
- Database cursors
- `Iterator<T>` in Java, `IEnumerable<T>` in C#

## Run the demo

```bash
node demo.js
```

Demonstrates a binary search tree that supports **three** traversal orders (in-order, pre-order, post-order) through separate iterators. Each is a generator; `for...of` does the rest.
