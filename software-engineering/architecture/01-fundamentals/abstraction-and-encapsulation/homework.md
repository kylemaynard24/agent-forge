# Homework — Abstraction and Encapsulation

> Make invariants impossible to violate by hiding state behind behavior.

## Exercise: A `Money` value type

**Scenario:** Your app handles prices in multiple currencies. Naively, you've been using `{ amount: number, currency: string }` plain objects everywhere. This causes bugs: someone added `usd + eur`, currencies got compared with strict equality but with mixed casing, and rounding went wild.

**Build:**
- A `Money` class encapsulating amount and currency.
- Methods: `add(other)`, `subtract(other)`, `multiply(factor)`, `equals(other)`, `toString()`.
- A static factory: `Money.of(123, 'USD')`.

**Constraints (these enforce the concept):**
- `Money` instances are **immutable** — `add` returns a new `Money`.
- Mixing currencies in `add`/`subtract`/`equals` throws a clear error.
- Internal storage is **private** (use `#` private fields). No way for callers to mutate `amount` or `currency` directly.
- Currency code is normalized internally (e.g., always uppercase) — callers can pass either case.
- Amount is stored as integer minor units (cents) internally to avoid floating-point drift; callers see major units in `toString`.

## Stretch
Add `Money.zero(currency)` and `Money.sum(moneys)`. Document what `Money.sum([])` should do — and pick a defensible answer.

## Reflection
- A naive `{amount, currency}` object is just data. Your `Money` is an *abstraction*. Which bug categories does it eliminate? Which does it not?
- When would using `Money` everywhere be overkill?

## Done when
- [ ] Adding USD + EUR throws.
- [ ] You cannot read or write `#amount` from outside the class.
- [ ] `Money.of(0.1, 'USD').add(Money.of(0.2, 'USD')).equals(Money.of(0.3, 'USD'))` is true (no float drift).
