# Homework — Capacity Planning

> Estimate the next bottleneck before growth turns into surprise downtime.

## Exercise

Work through a small scenario involving a product feature expected to multiply traffic over one quarter.

**Build:**
- a baseline measurement
- one improvement attempt
- a before/after summary with trade-offs

**Constraints:**
- you may not claim success without numbers
- the workload or traffic shape must be named
- you must state one cost introduced by the optimization

## Reflection

- What part of Capacity Planning felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Capacity Planning without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Document assumptions explicitly, name your variables, make the reasoning auditable

A capacity plan is clean code for infrastructure: every input assumption is a variable that should be named and sourced, every derived estimate is a formula that should be readable, and every conclusion should be traceable back to its inputs. A spreadsheet or document where numbers appear without explanation — "we need 8 nodes" with no derivation — is the infrastructure equivalent of a magic number in code.

**Exercise:** For the traffic-multiplication scenario in this homework, write your capacity model as a named-variable calculation rather than a sequence of raw numbers. Define each input as a named assumption with its source (e.g., `CURRENT_RPS = 400  # p95 from last 30 days dashboard`), each growth factor as a named multiplier (e.g., `EXPECTED_GROWTH_FACTOR = 3  # product estimate for Q3 launch`), and each output as a derived named value. Then identify the two assumptions whose uncertainty most affects the conclusion, and write the revised capacity recommendation for the optimistic and pessimistic values of each.

**Reflection:** In a capacity plan you have contributed to, were the assumptions named and sourced — or were the final numbers presented without a derivation that a future engineer could audit, update, or disprove when conditions change?
