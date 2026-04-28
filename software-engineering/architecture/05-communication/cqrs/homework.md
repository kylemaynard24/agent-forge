# Homework — CQRS

> Apply write/read separation. The **constraints** are the point.

## Exercise: Tickets — write model and two read models

**Scenario:** A support-ticket system. Writes are infrequent (a few hundred a day) but reads are constant (dashboards, search, agent inbox).

**Build:**
- A write model with commands: `OpenTicket`, `AssignTicket`, `CommentOnTicket`, `CloseTicket`. Validates invariants (cannot assign a closed ticket, etc.).
- A read model A: **agent inbox** — open tickets grouped by assignee, sorted by age.
- A read model B: **search index** — flat list of every ticket with concatenated comment text.
- Both read models built by subscribing to the write model's events.

**Constraints (these enforce the concept):**
- Write model API must expose **no** queries — only commands. Make this enforceable.
- Read models must expose **no** mutators — only queries.
- Read models must not call into the write model. They consume events only.
- Demonstrate eventual consistency: print a "stale read" by querying immediately after writing.

## Stretch
- Add a third read model that materializes "agent productivity" stats. Notice how trivial it is to add.
- Make one read model fail mid-replay. How do you recover its state from the event log?

## Reflection
- A user files a bug: "I closed the ticket but the inbox still shows it." Is this a bug or expected behavior? How would you communicate this in the UI?

## Done when
- [ ] Commands rejected when they violate invariants.
- [ ] Both read models populated from the same event stream.
- [ ] One scenario where the read model lags the write — and you label that "eventual consistency".
