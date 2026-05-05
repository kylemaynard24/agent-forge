# Design Docs and RFCs

A design doc is a written document that describes a technical problem, proposes a solution, considers alternatives, and records the reasoning behind the decision. An RFC (Request for Comments) is the same thing with an emphasis on gathering feedback before committing.

Design docs are how senior engineers communicate at scale. They extend your influence beyond the conversations you can have in person. A well-written design doc can:

- align a team before building starts, preventing expensive rework
- surface objections from people who aren't in the room
- create a record of why a decision was made, invaluable when revisiting it six months later
- train other engineers on how to think about the problem space
- demonstrate that you think systemically, which is direct evidence for level progression

## When to write a design doc

You do not need a design doc for every change. A bug fix does not need one. A small feature with no architectural implications does not need one. A performance optimization to an existing pattern does not need one.

Write a design doc when:

- the change affects a system boundary (adding a new dependency, changing a communication pattern, introducing a new data store)
- the change has non-obvious trade-offs that the team should understand and agree on
- the implementation will take more than a few days and involves decisions that should be shared
- you are proposing something new that will require buy-in from people outside your immediate team
- you are making a decision that will be hard to reverse

When in doubt, write a short one. A two-page doc that creates alignment is worth far more than the 30 minutes it takes to write.

## The structure of a design doc

There is no universal template, but strong design docs consistently include these sections:

### Problem Statement

What problem are you solving? Why does it need to be solved now? Who is affected?

This section should be short and focused. If you cannot describe the problem in two or three paragraphs, you may not have a clear enough problem definition to start designing.

### Requirements

What does a good solution need to do? Separate functional requirements ("users can retrieve their history in under 200ms") from non-functional requirements ("the system must stay available during a single-node failure").

Requirements are what you evaluate options against. Without explicit requirements, option comparison is subjective.

### Options Considered

This is the hardest section to write well and the one that most defines the quality of the document.

List each option with its own trade-offs. Not a dismissal — a genuine analysis. Even the options you rejected should get a fair treatment, because:

- it signals that you thought seriously about alternatives, not just jumped to the first idea
- it records the reasoning so that when someone asks "did you consider X?" the answer is documented
- it often reveals something useful about the problem even when the option itself isn't viable

Apply the trade-off articulation structure from `articulating-tradeoffs/`: name the option, the relevant dimensions, and how it performs on each.

### Recommendation

Which option you are proposing and why. Connect the recommendation explicitly to the requirements and dimensions from the previous section.

This is your position. State it clearly. "I recommend Option B" is better than "Option B may be preferable in some cases."

### Implementation Plan

A high-level sequence of work. Not a detailed project plan — just enough to make the scope visible and to identify the risky or unknown parts.

### Open Questions

Anything you still don't know that affects the decision. This is one of the most important sections because it surfaces the gaps honestly and invites the input you actually need.

It is a sign of strong engineering thinking to list open questions clearly. It is not a sign of weakness.

## The difference between an RFC and a design doc

An RFC is a design doc written before the decision is made, with explicit invitation for others to change it. A design doc is often written as a record of a decision that has been made or is close to being made.

In practice, most team-level design docs function as lightweight RFCs: you circulate them for review, incorporate feedback, and then commit. The distinction matters less than the habit.

## Architecture Decision Records (ADRs)

An ADR is a short (typically one page or less) record of a single architectural decision. Unlike a full design doc, it does not explore the problem space in depth — it just records:

1. What decision was made
2. What context made this decision necessary
3. What options were considered
4. What the consequences (positive and negative) are expected to be

ADRs are useful for tracking decisions that were made informally — in a meeting, in a Slack thread — and would otherwise disappear from institutional memory. Keeping a directory of ADRs in a repo is a simple, low-overhead practice that has a high return on investment over time.

A basic ADR format:

```
# ADR-0001: Use PostgreSQL for user session storage

**Date**: 2025-11-15
**Status**: Accepted

## Context
We need a durable session store. We already operate Postgres for user accounts and have operational experience with it.

## Decision
Use Postgres for session storage rather than Redis.

## Consequences
+ No new infrastructure dependency
+ Transactional consistency with account data
- Higher read latency than Redis for pure key-value lookup (~5ms vs ~0.5ms at our scale)
- Will need to revisit if session volume grows past 10M active sessions
```

## Writing the options section well

The options section is where most design docs fail. The common failure modes:

- **Only listing one real option**: the "option A or option A" doc. This is not an options section; it is a justification.
- **Straw man alternatives**: listing Option B as "we could do nothing" or "we could use a completely different architecture." If those are genuinely not viable, say so briefly but do not use them as padding.
- **Inconsistent depth**: giving three paragraphs to the option you like and two sentences to the option you don't. This is suspicious and weakens the document.
- **No connection to requirements**: describing what each option does without saying how each option performs against the requirements. The requirements section exists to make option evaluation objective.

A good options section reads like a fair comparison. The reader should be able to understand why the recommended option was chosen even before reaching the recommendation section.

## Design docs as career evidence

Every design doc you write is a record of your engineering thinking at a level of depth that code alone doesn't provide. It shows:

- your ability to frame problems clearly
- your ability to consider alternatives rather than anchoring on the first idea
- your ability to reason through trade-offs explicitly
- your awareness of non-functional requirements (reliability, operability, security)
- your willingness to state a position and defend it

When promotion conversations happen, concrete artifacts matter. A design doc you wrote that aligned a team, prevented an architectural mistake, or shaped a system decision is exactly the kind of evidence that differentiates a senior engineer from a mid engineer who is doing good work quietly.

Start writing them now, even if they're short, even if the decision is modest. The habit of writing before building is one of the most high-return habits in engineering.
