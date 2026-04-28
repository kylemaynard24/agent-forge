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
