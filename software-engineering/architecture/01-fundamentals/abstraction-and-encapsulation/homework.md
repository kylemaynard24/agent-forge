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

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Hide Implementation Details

A well-named abstraction like `Money` earns its keep when its public method names (`add`, `subtract`, `toString`) express *what the caller wants to accomplish*, not *how the internal representation works* — callers never need to know that amount is stored as integer cents. The moment a caller has to read private fields or understand internal storage to use the type correctly, the abstraction has leaked and the name has become a lie.

**Exercise:** Audit `Money`'s public surface: write out every method name and ask "does this name tell a caller everything they need and nothing they don't?" Then try renaming `multiply` to `scale` — does the new name communicate *why* you'd call it (scaling a price by a quantity) better than the arithmetic term does? Pick the name that fits the domain, not the operation.

**Reflection:** If you were handed `Money` as a black box with no source code, which method names would immediately tell you this is a *financial* abstraction rather than a generic numeric wrapper — and which names still feel like math leaking through?
