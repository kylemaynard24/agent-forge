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

## Scenario questions

### "A library I need to use has the wrong interface for my codebase"

**Likely pick:** **Adapter**

**Why pick it:** the real problem is shape mismatch. Your code expects one contract; the dependency offers another.

**Why not Facade:** Facade is broader and usually subsystem-wide. If the issue is one incompatible object or API, Adapter is the sharper tool.

### "A subsystem is powerful but miserable to use"

**Likely pick:** **Facade**

**Why pick it:** clients should not need to know five setup steps and seven object interactions just to do one common thing.

**Why not Adapter:** Adapter translates one shape into another. Facade simplifies a larger cluster of behavior behind a friendlier surface.

### "I need caching, lazy loading, or permission checks around a real object"

**Likely pick:** **Proxy**

**Why pick it:** the problem is controlled access to the real subject.

**Why not Decorator:** Decorator is a better story when the main intent is adding optional responsibilities. Proxy is a better story when the wrapper is acting as a stand-in for the real thing.

### "I want to add behavior without subclass explosion"

**Likely pick:** **Decorator**

**Why pick it:** you can compose behaviors at runtime instead of creating a combinatorial subclass tree.

**Why not Proxy:** if the wrapper's story is "I am adding optional behavior," Decorator communicates that intent better than Proxy.

### "I have trees of objects and I want leaves and groups treated uniformly"

**Likely pick:** **Composite**

**Why pick it:** client code can talk to one interface whether it receives a single object or a nested structure.

**Why not Decorator:** Decorator wraps one component to add behavior. Composite organizes many components into a recursive part-whole structure.

### "I have two independent axes of change"

**Likely pick:** **Bridge**

**Why pick it:** when abstraction and implementation both vary independently, Bridge keeps the class space from exploding.

**Why not Strategy first:** Strategy swaps one algorithm behind a context. Bridge is more structural: it separates two dimensions of a design that would otherwise multiply each other.

### "My analytics service should look the same whether it writes locally or remotely"

**Likely pick:** **Proxy**

**Why pick it:** the client contract stays stable while the proxy hides remoteness or delayed access.

**Why not Adapter:** if the interfaces already match, translation is not the core problem.

### "We need a one-call onboarding API over several noisy services"

**Likely pick:** **Facade**

**Why pick it:** onboarding may involve accounts, emails, permissions, and billing setup, but most callers should not coordinate those pieces manually.

**Why not Composite:** the pain is not a tree structure; it is subsystem complexity.

### "A rendering system has shape types and rendering backends both changing"

**Likely pick:** **Bridge**

**Why pick it:** shapes and renderers are two dimensions that should vary independently without multiplying subclasses.

**Why not Decorator:** Decorator adds responsibilities around one component. Bridge separates two axes in the core design.

### "A dashboard card should gain optional features like border, shadow, and badge"

**Likely pick:** **Decorator**

**Why pick it:** these are composable responsibilities that should stack without subclass explosion.

**Why not Facade:** the need is not simplification of a subsystem; it is layered behavior around one component.

### "A file-system browser should treat folders and files with one interface"

**Likely pick:** **Composite**

**Why pick it:** the whole point is uniform treatment of leaves and groups.

**Why not Proxy:** Proxy stands in for another object, while Composite defines recursive part-whole structure.

### "A vendor object needs both translation and caching"

**Likely pick:** often **Adapter** plus **Proxy** or **Decorator**

**Why pick them together:** Adapter solves the interface mismatch; Proxy or Decorator can then address access control or extra behavior.

**Why this matters:** sometimes the design problem is plural. One pattern can translate the shape, another can handle runtime concerns around the adapted object.

### "A UI toolkit creates too many wrapper subclasses because every feature combination has its own class"

**Likely pick:** **Decorator**

**Why pick it:** behavior combinations can be composed at runtime.

**Why not inheritance:** inheritance locks combinations into class names and makes growth painful.

### "An image-heavy app repeats identical icon metadata thousands of times"

**Likely pick:** **Flyweight**

**Why pick it:** shared intrinsic state is the central savings.

**Why not Builder:** Builder can make icon construction cleaner, but it will not solve memory duplication.

## Why you would not pick a structural pattern

Don't reach for one just because "a wrapper seems elegant." Structural patterns pay off when the relationship between parts is the design problem. If the code is already easy to use and the boundary is not actually painful, the extra layer is just ceremony.
