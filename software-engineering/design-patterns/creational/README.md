# Creational patterns

Creational patterns deal with **object creation** — the question of *"how do I construct this object without tightly coupling my code to a specific concrete class?"*

They matter when:
- The exact class you want depends on configuration or runtime data
- Construction is complex (many parameters, many steps)
- You want to control how many instances exist
- You want to share a family of related products without knowing their concrete types

## The five patterns

| Pattern | In one line |
| --- | --- |
| [Singleton](singleton/) | One instance, globally accessible |
| [Factory Method](factory-method/) | Subclass decides what to instantiate |
| [Abstract Factory](abstract-factory/) | A factory that produces a family of related products |
| [Builder](builder/) | Step-by-step construction of a complex object |
| [Prototype](prototype/) | Clone an existing instance instead of calling `new` |

## How they relate

- **Factory Method** vs. **Abstract Factory** — Factory Method is about *one* product (overridden in a subclass). Abstract Factory is about *families* of products (passed in as an object of factory methods).
- **Builder** vs. **Abstract Factory** — Both create complex objects. Builder emphasizes *the construction process* and returns a single finished object at the end. Abstract Factory emphasizes *families of products* and returns each immediately.
- **Singleton** vs. **Prototype** — Opposites, in a sense. Singleton says "one instance forever." Prototype says "clone cheaply, have as many as you want."

## What this family trains you to notice

Creational patterns teach you that object creation is never just `new`. The moment lifecycle, configuration, families of products, or construction order matter, creation becomes part of the design. These patterns are about controlling that moment so callers depend on capabilities and contracts instead of on concrete setup details.

The deeper lesson is that creation choices tend to leak outward. If you get them wrong, the rest of the codebase starts importing concrete classes, repeating construction rules, or carrying around half-built objects. If you get them right, the rest of the system can stay focused on behavior.

## A good comparison habit

For each creational pattern, ask:

- who chooses the concrete type
- when validation happens
- whether the caller receives one object or a family of related objects
- whether the pattern reduces knowledge or merely relocates it

## Scenario questions

### "I know I need objects, but I don't want callers hard-coding classes"

**Likely pick:** **Factory Method** or **Abstract Factory**

Choose **Factory Method** when one product type varies and subclasses can decide which concrete implementation to create.

Choose **Abstract Factory** when *families* of related products must stay consistent — for example, a light-theme button paired with a light-theme dialog and menu.

**Do not pick Builder first** unless the real pain is *step-by-step assembly*. Builder is about construction complexity, not family consistency.

### "The constructor has too many parameters and half are optional"

**Likely pick:** **Builder**

**Why:** the pain is readability and validation of a complex object under construction.

**Why not Singleton:** Singleton controls instance count, not construction clarity.

**Why not Abstract Factory:** Abstract Factory selects among related product families; it does not make one large object easier to assemble.

### "Cloning existing configured objects would be cheaper than rebuilding them"

**Likely pick:** **Prototype**

**Why:** the main advantage is copying a known-good instance rather than replaying a long creation process.

**Why not Builder:** Builder is for controlled assembly. Prototype is for fast creation *from an existing exemplar*.

**Why not Factory Method:** Factory Method still centralizes `new`; it does not inherently preserve the exact configured state of a prior object.

### "I truly need one shared instance everywhere"

**Likely pick:** **Singleton**, cautiously

**Why:** one instance can be appropriate for a configuration registry, process-wide coordinator, or in-memory cache — especially when lifecycle really is global.

**Why not pick it casually:** many times what you actually want is dependency injection or a module-level instance, not a globally reachable hidden dependency. If tests get harder and dependencies become implicit, Singleton is often the smell, not the solution.

### "A plugin system should decide which parser or exporter gets created"

**Likely pick:** **Factory Method**

**Why:** one product type varies, and subclasses or plugin implementations can decide which concrete product to instantiate.

**Why not Abstract Factory:** use Abstract Factory only when several related product types must vary together.

### "A document editor must create matching toolbar, canvas, and shortcut objects per mode"

**Likely pick:** **Abstract Factory**

**Why:** the design problem is a family of related objects that must remain compatible as a set.

**Why not Factory Method:** Factory Method is too narrow if several related objects need coordinated creation.

### "A saved template object is almost right, only a few fields differ"

**Likely pick:** **Prototype**

**Why:** cloning a near-perfect exemplar may be cheaper and clearer than replaying a construction process.

**Why not Builder:** Builder shines when correctness comes from ordered assembly and validation; Prototype shines when the starting point already exists.

### "Environment-specific infrastructure must be produced consistently"

**Likely pick:** **Abstract Factory**

**Why:** test, staging, and production often need matching but different implementations of several related components.

**Why not Singleton:** environment selection is not an instance-count problem.

### "Creating the object is easy, but validating the final combination is hard"

**Likely pick:** **Builder**

**Why:** Builder lets validation happen at or near `build()` when the full configuration is known.

**Why not Prototype:** cloning preserves a prior state; it does not inherently validate a new combination of settings.

### "I need one process-wide scheduler, but I also want test seams"

**Likely pick:** maybe **Singleton**, but only after asking whether dependency injection or a module instance solves it more honestly.

**Why:** this is the kind of scenario where Singleton is tempting and sometimes valid.

**Why not pick it automatically:** if tests, replacement, or explicit dependency graphs matter, Singleton can make the design worse even if it feels convenient.

### "I want to hide which persistence backend gets used, but the caller only needs one repository"

**Likely pick:** **Factory Method**

**Why:** one product type varies behind a stable contract.

**Why not Abstract Factory:** if the caller does not need a coordinated family of products, Factory Method is simpler.

### "I need several expensive preconfigured game objects spawned quickly"

**Likely pick:** **Prototype**

**Why:** preconfigured exemplars are a natural source for cheap repeated creation.

**Why not Factory Method:** Factory Method still centralizes creation but does not preserve the exact tuned state of a complex exemplar.

## Why you would not pick a creational pattern

Don't force a creational pattern when:

- one constructor call is already clear
- the concrete class is not expected to vary
- the lifecycle problem is imaginary, not real
- the object is tiny and validation is trivial

Creational patterns help when object creation has become part of the design problem. Before that, `new` is fine.
