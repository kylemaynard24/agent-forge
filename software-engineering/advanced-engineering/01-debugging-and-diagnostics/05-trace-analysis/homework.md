# Homework — Trace Analysis

> Use span timing and call trees to locate the slow or broken boundary.

## Exercise

Work through a small scenario involving a request that touches several services before timing out.

**Build:**
- one reproducible failure or narrowed scenario
- a written hypothesis list
- one observation that disproves at least one hypothesis

**Constraints:**
- you may not start by editing production logic
- at least one plausible idea must be disproven
- your final note must distinguish symptom from cause

## Reflection

- What part of Trace Analysis felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Trace Analysis without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, reveal intent at every layer

Span names in a distributed trace are the naming problem applied across service boundaries: `process`, `execute`, and `handle` tell you the system did something, while `validate-payment-token`, `reserve-inventory`, and `send-confirmation-email` tell you exactly which concern is slow or broken. Good span naming is the same investment as good function naming — the reader (or on-call engineer) should never have to open the source code to understand what a span represents.

**Exercise:** Design the ideal trace for the multi-service timeout scenario in this homework. List every span you would instrument, name each one using a verb-noun pattern that encodes the service boundary and the business operation, and identify which three spans, if any one of them showed unexpected latency, would immediately point to the root cause without further investigation.

**Reflection:** In a system you have traced recently, did the span names let you locate the slow boundary in under a minute — and if not, which spans would you rename first?
