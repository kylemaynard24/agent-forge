# Design Intent and Project Docs

**Area:** Incident Response and Engineering Execution

## Intent

Choose the right engineering document, make design intent explicit, and write project docs people can actually use.

## When to use

- a project is large enough that verbal alignment is starting to fail
- the team is arguing about implementation details because the real goals were never written down
- an architecture role needs to explain why a design should exist, not only what code will be written
- multiple documents are possible and the team needs to know which artifact will create the most clarity

## Why it matters

Good project documentation is written engineering leverage. It reduces rework, shortens review loops, preserves decision context, and helps teams move without pretending that everyone remembers the same conversation.

Design intent documentation matters because architecture is not just system shape. It is the discipline of making desired behavior, boundaries, constraints, and trade-offs legible before complexity hardens into code.

## What "design intent" means

A **design intent (DI) document** explains the shape the system is supposed to take and why. It is not just a feature summary and it is not a pile of implementation notes.

A strong DI document usually answers:

- what problem or pressure is driving this work
- what outcomes the design must produce
- what boundaries, constraints, or invariants must hold
- which trade-offs are being accepted on purpose
- what is deliberately out of scope
- how the team will know whether the design is working

If an ADR records **one decision**, a DI document usually frames the **whole design posture** around a project or subsystem.

## Pick the right document

| Artifact | Best for | Main question it answers |
| --- | --- | --- |
| DI doc | Explaining the intended shape of a system or change | "What should this become, and why?" |
| RFC | Socializing a proposed change before commitment | "Should we do this, and what concerns need review?" |
| ADR | Capturing a specific decision once made | "What did we decide, and what trade-off came with it?" |
| Project brief or execution plan | Sequencing work across milestones and owners | "How will we deliver this?" |
| Rollout or migration plan | Introducing change safely in production | "How do we switch over without breaking users?" |
| Runbook | Responding to a known operational situation | "What should someone do right now?" |
| Postmortem | Learning from an incident or failure | "What happened, why, and what changes now?" |

Teams get into trouble when they use one document to impersonate all the others.

## A practical DI document structure

You do not need a giant template. You need headings that force the important thinking to happen.

1. **Context and problem** — Explain the current pain, missed goal, scaling limit, risk, or architectural pressure.
2. **Goals** — State the outcomes the design must achieve.
3. **Non-goals** — Say what this document is not trying to solve so the discussion stays bounded.
4. **Constraints and invariants** — Capture rules the design must respect: compliance, latency, tenancy, backward compatibility, budget, staffing, platform limits.
5. **Proposed design** — Describe the major components, interactions, ownership boundaries, and data or control flow.
6. **Alternatives considered** — Compare serious options, not strawmen.
7. **Risks and failure modes** — Name what could go wrong and where the design is brittle.
8. **Operational plan** — Cover rollout, observability, migration, fallback, and recovery expectations.
9. **Open questions** — Leave unresolved items visible instead of hiding them in chat.

## How to write it well

- **Lead with the pressure.** Start from the problem, not from the diagram.
- **Write the decision logic, not just the final answer.** Readers need to see why this path won.
- **Separate facts, assumptions, and decisions.** Mixing them makes review fuzzy.
- **Use stable headings.** Predictable structure makes documents easier to scan under time pressure.
- **Prefer concrete nouns over slogans.** "Tenant-isolated job queue" is better than "robust scalable architecture."
- **Show the trade-off explicitly.** Good architecture writing admits what got worse in exchange for what got better.
- **Keep implementation detail at the right altitude.** Enough detail to judge the design, not enough to recreate every ticket.
- **Write for future readers, not just current reviewers.** A good doc still helps six months later.
- **Use diagrams to support the text, not replace it.** If the diagram vanished, the argument should still stand.
- **Make review cheap.** Call out the sections where you want disagreement, confirmation, or help.

## What strong project documentation usually includes

Good project documentation is often a **small pack**, not one heroic file:

- a DI or RFC that explains the intended shape and trade-offs
- one or more ADRs that record irreversible or important decisions
- an execution plan that breaks the work into milestones, dependencies, and ownership
- a rollout or migration plan for production change
- a runbook if the change creates a new operational surface

Architecture roles are usually effective when they can connect those documents into one story: intent, decision, execution, operation, and learning.

## Common mistakes

- writing a DI doc after the implementation is effectively finished
- turning the document into architecture fan fiction with no delivery path
- listing goals without naming non-goals
- hiding the rejected alternatives because the team wants to look certain
- copying ticket language instead of describing system behavior
- writing for approval theater rather than actual engineering alignment

## Tiny example

Suppose a product team needs asynchronous document processing. A weak document says, "Introduce event-driven microservices for scalability." A stronger DI doc says:

> We need uploads to stop blocking web requests, preserve tenant isolation, and allow retries without duplicate processing. We will move processing into a queue-backed worker service. We are explicitly not splitting the whole application into many services. We accept slightly higher operational complexity to gain retryability, backpressure control, and clearer ownership around document processing.

That version makes the pressure, scope, trade-off, and boundary visible.

## Run the demo

```bash
node demo.js
```

The demo is intentionally small. It shows how a project can turn one fuzzy request into a clearer set of engineering documents.

## Scenario questions

These questions are meant to turn **Design Intent and Project Docs** into an operational instinct.

### Scenario 1 — "The team is debating details, but nobody wrote down the real point"

**Question:** A meeting is stuck on implementation arguments, and each person is optimizing for a different success condition. Is this a signal to write a DI document?

**Answer:** Usually yes.

**Explanation:** The missing artifact is often not more code discussion. It is a document that names the actual goals, non-goals, constraints, and trade-offs so the team can disagree in the right place.

### Scenario 2 — "One doc is trying to do five jobs"

**Question:** A project plan contains architecture, migration steps, ADR history, support procedures, and launch comms all in one file. Is that efficient?

**Answer:** Usually no.

**Explanation:** A single source of context is good. A single overloaded artifact is not. Good documentation keeps the documents connected while letting each one answer its own question clearly.
