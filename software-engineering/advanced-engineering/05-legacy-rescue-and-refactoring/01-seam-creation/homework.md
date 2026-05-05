# Homework — Seam Creation

> Create a controlled boundary where new behavior can attach safely.

## Exercise

Work through a small scenario involving a giant module whose callers all know too much.

**Build:**
- one seam or safe boundary
- one behavior-preserving change
- a short next-step migration note

**Constraints:**
- you may not rewrite the whole system
- behavior must stay stable before structure gets prettier
- you must explain rollback or safe fallback

## Reflection

- What part of Seam Creation felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Seam Creation without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names + boundaries as first-class concepts

A seam is a named boundary where behavior can change without modifying surrounding code — but a seam that is not named is a seam that does not exist yet as a concept. Extracting an interface or a function is only half the work; naming it so that readers understand it is the place where implementations can be swapped is what turns a structural change into a communicable design decision.

**Exercise:** Take the seam you created and write its name on a whiteboard. If you cannot explain in one sentence what behavior it isolates and why that boundary exists there, rename it until you can. The name should make the swap point obvious without needing to read the implementation.

**Reflection:** If a teammate needed to swap the implementation behind your seam six months from now, would the name of the seam tell them it is the right place to make the change — or would they have to read the code to figure out where the boundary is?
