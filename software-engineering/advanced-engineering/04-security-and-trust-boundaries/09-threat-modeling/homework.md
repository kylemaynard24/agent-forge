# Homework — Threat Modeling

> Systematically name assets, actors, entry points, and abuse paths before coding deeper.

## Exercise

Work through a small scenario involving a new product flow that feels simple until you ask who could misuse it.

**Build:**
- a named trust boundary
- one protective control
- a note on residual risk

**Constraints:**
- you must distinguish what is trusted from what is merely present
- you must state one accepted risk explicitly
- the control has to match the boundary, not just the feature

## Reflection

- What part of Threat Modeling felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Threat Modeling without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Readable documentation + explicit naming of concepts

A threat model written clearly enough that a new engineer can identify the trust boundaries from it is the clean code standard for security documentation. If the boundaries exist only in a veteran's head and not in the named structure of the document, the model cannot be reviewed, tested, or updated — it has the same problem as undocumented code.

**Exercise:** Take your threat model and highlight every actor, entry point, and trust boundary. Then hand it (or describe it) to someone unfamiliar with the system and check whether they can name the boundaries without you pointing them out. Revise until they can.

**Reflection:** Does your threat model use terms consistently enough that a new engineer reading it would apply the same boundary labels you intended, or would they need to interpret context to understand what is trusted and what is not?
