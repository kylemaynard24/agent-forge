# Structural patterns

Structural patterns deal with **object composition** — the question of *"how do I combine objects and classes into larger structures while keeping them flexible and loosely coupled?"*

They matter when:
- You need to integrate code that doesn't share an interface
- You want to add behavior without subclass explosion
- You want to hide complexity behind a simpler surface
- You want different dimensions of variation (shape × renderer, etc.) without a combinatorial explosion of classes

## The seven patterns

| Pattern | In one line |
| --- | --- |
| [Adapter](adapter/) | Make an incompatible interface look like the one your code expects |
| [Bridge](bridge/) | Split two varying dimensions into separate hierarchies and wire them at runtime |
| [Composite](composite/) | Let a client treat a group of objects the same way as a single object |
| [Decorator](decorator/) | Wrap an object to add behavior without modifying its class |
| [Facade](facade/) | Hide a complex subsystem behind a simpler interface |
| [Flyweight](flyweight/) | Share identical object data across many contexts to save memory |
| [Proxy](proxy/) | Stand in for another object to add access control, caching, or lazy loading |

## How they relate

- **Adapter** vs. **Facade** — Both simplify. Adapter changes *one* object's interface to match a specific target. Facade provides a *new* interface over a *whole subsystem*.
- **Decorator** vs. **Proxy** — Both wrap an object. Decorator adds *behavior*. Proxy controls *access* (caching, lazy loading, remote, permissions).
- **Decorator** vs. **Composite** — Both use recursive composition. Composite treats groups and leaves the same way. Decorator adds responsibilities to a single component.
- **Bridge** vs. **Strategy** (behavioral) — Both pass one object into another. Bridge is about parallel class hierarchies; Strategy is about algorithm swapping at runtime.

## What this family trains you to notice

Structural patterns are largely about **boundary shape**. They teach you how to join pieces together without forcing every consumer to understand every implementation detail. The skill here is recognizing when a system needs compatibility, composition, simplification, separation of dimensions, or a controlled stand-in for the real object.

This family becomes much easier once you stop comparing wrappers by appearance alone. Several structural patterns look like "one object wraps another," but the real question is why the wrapper exists. Intent is the whole game.

## A good comparison habit

When studying structural patterns, keep asking:

- what relationship is being reshaped
- whether the wrapper changes interface, adds behavior, hides complexity, or controls access
- whether composition is replacing inheritance
- what the client is now allowed to ignore that it previously had to know
