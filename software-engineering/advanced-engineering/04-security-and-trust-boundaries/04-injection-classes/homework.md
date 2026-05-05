# Homework — Injection Classes

> Recognize how commands, queries, or templates become attack surfaces.

## Exercise

Work through a small scenario involving a search feature that stitches user input into a backend call.

**Build:**
- a named trust boundary
- one protective control
- a note on residual risk

**Constraints:**
- you must distinguish what is trusted from what is merely present
- you must state one accepted risk explicitly
- the control has to match the boundary, not just the feature

## Reflection

- What part of Injection Classes felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Injection Classes without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Abstraction integrity + no mixed levels

String concatenation to build a query mixes code and data at the same level of abstraction — it is an abstraction violation as much as a security risk. Parameterized queries restore the boundary: the structure of the command is code, the user-supplied values are data, and the separation is enforced structurally rather than depending on a developer remembering to sanitize.

**Exercise:** Take the search scenario and write both the string-concatenated version and the parameterized version side by side. Annotate the concatenated version to show exactly where the code/data boundary is violated, then confirm the parameterized version enforces that boundary by construction.

**Reflection:** If a future developer modifies the query, does the parameterized version make it structurally impossible to introduce injection, or does it rely on a convention they could accidentally break?
