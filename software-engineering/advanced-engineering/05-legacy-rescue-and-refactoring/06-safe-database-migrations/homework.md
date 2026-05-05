# Homework — Safe Database Migrations

> Change data shape without betting the release on one irreversible step.

## Exercise

Work through a small scenario involving a table split or column rename on a live system.

**Build:**
- one seam or safe boundary
- one behavior-preserving change
- a short next-step migration note

**Constraints:**
- you may not rewrite the whole system
- behavior must stay stable before structure gets prettier
- you must explain rollback or safe fallback

## Reflection

- What part of Safe Database Migrations felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Safe Database Migrations without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names + permanent documentation

Migration names are permanent documentation — unlike code, they cannot be refactored later. A migration named `AddUserField` tells a future engineer nothing about why the field was added or what it enables; `AddEmailVerifiedAt_for_2fa_rollout` encodes the intent, the context, and the feature relationship so that the migration history is readable years later.

**Exercise:** Write two versions of the migration name for your scenario: the short generic version and the intent-revealing version. Then imagine reading both in a migration history two years from now — write one sentence describing what each tells you about the system's evolution.

**Reflection:** If a production incident required tracing which migration introduced a problematic column, would your migration name be enough to identify it without reading the migration body?
