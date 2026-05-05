# Homework — Property-Based Testing

> Test invariants over many generated inputs instead of a few named examples.

## Exercise

Work through a small scenario involving a parser or calculator whose edge cases are easy to miss manually.

**Build:**
- one small verification target
- at least two different boundary choices
- a note explaining why one boundary is the better fit

**Constraints:**
- each check must answer one clear question
- at least one boundary choice must be justified in writing
- you must name one low-value test idea and reject it

## Reflection

- What part of Property-Based Testing felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Property-Based Testing without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Reveal intent, tests as specification, meaningful names

In property-based testing, the property name is the specification: `sortedArrayContainsAllOriginalElements` and `parserRoundTripsAnyValidInput` are self-documenting invariants, while `prop1` and `testProperty` tell the next engineer nothing about what behavior the system is supposed to guarantee. Because property tests generate hundreds of cases automatically, the property name carries even more weight than an example test name — it is the only human-readable summary of what the entire generated test suite is verifying.

**Exercise:** For the parser or calculator scenario in this homework, write four property names and the invariant each expresses in plain English. For each property, ask: if this property failed on a randomly generated input, would the name alone let an engineer explain the bug to a product manager without reading the assertion code? Revise any name where the answer is no.

**Reflection:** Could you list, from memory and property names alone, every behavioral invariant your most complex module is currently tested against — and if not, what gap does that reveal in your test specification?
