# Homework — Adapter

> Make an incompatible interface fit. Don't modify either side — wrap.

## Exercise: Legacy payment provider

**Scenario:** A legacy `XmlPaymentProvider` has only one method: `submit(xmlString)` returning XML. Your modern app expects a `PaymentProcessor` with `charge({amount, currency, cardToken}) → Promise<{ok, txId}>`.

**Build:**
- An `XmlPaymentAdapter` implementing `PaymentProcessor`, internally translating to/from XML and delegating to `XmlPaymentProvider`.
- A demo that calls the adapter through the modern interface.

**Constraints (these enforce the pattern):**
- Don't modify the legacy class.
- Don't modify any caller of `PaymentProcessor`.
- The adapter must be the only place XML appears in the entire flow.

## Stretch

Add a second adapter for a `JsonPaymentProvider` (different shape again). The two adapters must be drop-in interchangeable behind `PaymentProcessor`.

## Reflection

- Adapter is often confused with Facade. What's the distinction in *intent*? (Hint: Adapter fits a known target; Facade simplifies.)
- What's the cost of an Adapter when the legacy interface evolves?

## Done when

- [ ] Modern caller uses the adapter without ever seeing XML.
- [ ] Swapping the JSON adapter in is a one-line change.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names + Single Responsibility Principle

The adapter's name is a translation contract expressed in a single identifier — `XmlPaymentAdapter` tells the reader exactly what is being translated and in which direction, while `PaymentAdapter` or `Adapter1` leaves the translation opaque. Applied cleanly, the adapter is a thin, named seam: all XML appears exactly once (inside this class), and every other file in the codebase uses only the modern interface vocabulary. Applied messily, an adapter that grows business logic — input validation, retry policy, currency conversion — is no longer translating an interface; it has become a service class that happens to also translate, and the naming problem is a symptom of the responsibility problem.

**Exercise:** Open your `XmlPaymentAdapter` and mark each line as either "translation" (converting data between formats) or "logic" (making decisions or adding behavior). Every "logic" line is a candidate for extraction — the adapter should be so thin that translation is all there is to read.

**Reflection:** The constraint says the adapter must be the only place XML appears — but that constraint is really a clean-code rule in disguise. What coupling does it prevent, and what would a codebase look like six months later if that constraint were relaxed?
