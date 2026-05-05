# Homework — Input Validation

> Reject malformed or dangerous input at clear boundaries.

## Exercise

Work through a small scenario involving a form or API that accepts flexible but risky user data.

**Build:**
- a named trust boundary
- one protective control
- a note on residual risk

**Constraints:**
- you must distinguish what is trusted from what is merely present
- you must state one accepted risk explicitly
- the control has to match the boundary, not just the feature

## Reflection

- What part of Input Validation felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Input Validation without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names + descriptive errors

Validation function names should encode both what they validate and the invariant they enforce — `validatePositiveAmount` tells you more than `validate`, and `validateNonEmptyEmailAddress` tells you more than `checkInput`. When those names are paired with errors that name the violated rule (`AmountMustBePositive`, not `InvalidInput`), the caller gets complete information without reading the implementation.

**Exercise:** Rename every validation function in your scenario so it states the subject and the invariant, then rename every validation error message so it names the rule that was violated rather than merely saying the input was invalid.

**Reflection:** If a validation fails in production and you see only the error name in a log, can you determine which rule was violated and which field triggered it — without reading source code?
