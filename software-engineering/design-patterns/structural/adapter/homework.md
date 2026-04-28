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
