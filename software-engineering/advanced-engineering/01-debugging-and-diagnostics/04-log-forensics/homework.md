# Homework — Log Forensics

> Extract signal from noisy logs and reconstruct what actually happened.

## Exercise

Work through a small scenario involving a burst of API failures mixed into normal request traffic.

**Build:**
- one reproducible failure or narrowed scenario
- a written hypothesis list
- one observation that disproves at least one hypothesis

**Constraints:**
- you may not start by editing production logic
- at least one plausible idea must be disproven
- your final note must distinguish symptom from cause

## Reflection

- What part of Log Forensics felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Log Forensics without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, don't be cute, make intent explicit

Log messages are the clean code of observability: a log that says `error: null` or `request failed` is the diagnostic equivalent of a variable named `x` — it tells you something happened but not what, where, or why. Structured fields with deliberate names (`order_id`, `failure_reason`, `retry_count`) and correct severity levels turn noisy logs into a searchable timeline.

**Exercise:** Take five log lines from the API failure scenario in this homework — or invent representative ones — and rewrite each using structured key-value fields, a meaningful message string, and a justified severity level. Then write the Kibana or Splunk query you would use to find the root cause using only your improved logs, and note which queries would have been impossible against the original versions.

**Reflection:** In a system you operate, what is the least useful log message you regularly see under pressure, and what three fields would make it actionable?
