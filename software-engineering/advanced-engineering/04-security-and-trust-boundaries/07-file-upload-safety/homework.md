# Homework — File Upload Safety

> Treat uploads as content plus metadata plus execution risk.

## Exercise

Work through a small scenario involving an upload endpoint that only checks filename extension.

**Build:**
- a named trust boundary
- one protective control
- a note on residual risk

**Constraints:**
- you must distinguish what is trusted from what is merely present
- you must state one accepted risk explicitly
- the control has to match the boundary, not just the feature

## Reflection

- What part of File Upload Safety felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of File Upload Safety without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names + making trust levels explicit in types

File handling code should make the trust level of each variable explicit in its name or type. A variable named `filename` tells you nothing about where it came from; a variable named `userSuppliedFilename` or `untrustedUploadPath` signals that it has not been validated, making any code that uses it without validation immediately suspicious during review.

**Exercise:** Walk through your upload scenario and rename every variable that holds user-supplied or unvalidated data so the untrusted origin is part of the name. Then confirm that every point where an untrusted variable is used without a preceding sanitization step is visible by reading just the variable names.

**Reflection:** After renaming, does the transition from `untrustedFilename` to `sanitizedFilename` (or equivalent) appear as a visible and deliberate step in your code — one that a reviewer would immediately notice if it were missing?
