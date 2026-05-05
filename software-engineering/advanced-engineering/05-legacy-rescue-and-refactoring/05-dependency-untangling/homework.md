# Homework — Dependency Untangling

> Reduce circular or hidden dependencies so change paths become visible.

## Exercise

Work through a small scenario involving a service layer where every change touches unrelated files.

**Build:**
- one seam or safe boundary
- one behavior-preserving change
- a short next-step migration note

**Constraints:**
- you may not rewrite the whole system
- behavior must stay stable before structure gets prettier
- you must explain rollback or safe fallback

## Reflection

- What part of Dependency Untangling felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Dependency Untangling without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names + single responsibility

Untangling a dependency is also an opportunity to rename it: a module called `utils` or `helpers` is almost certainly a dependency that needs both untangling and renaming, because the name signals that everything in it was too small to deserve its own concept. When a dependency is extracted and given a name that describes exactly one responsibility, the remaining tangle becomes visible — anything still named `utils` is the part that has not been untangled yet.

**Exercise:** After untangling the dependency in your scenario, rename the resulting module or class so the name expresses its single responsibility. Then check: are there other references still pointing at a vaguely-named `utils` or `shared` module? Each one is a dependency that likely needs the same treatment.

**Reflection:** When you look at your import list after untangling, do the module names tell you what each dependency does — or do some names still force you to read the implementation to understand the relationship?
