# Homework — Design Docs and RFCs

## Exercise 1: Write your first (or next) design doc

Pick something from your current work or a recent project that involves a non-trivial technical decision. It does not have to be large. Write a design doc with these sections:

1. **Problem Statement**: 1-3 paragraphs. What problem? Why now? Who is affected?
2. **Requirements**: functional and non-functional. What does a good solution need to do?
3. **Options Considered**: at least two real options with honest trade-offs for each
4. **Recommendation**: which option, and why — connected to the requirements
5. **Implementation Plan**: high-level sequence of work, 3-6 bullet points
6. **Open Questions**: what you still don't know that affects the decision

The doc should be 1-3 pages. Not shorter (that signals insufficient thought) and not longer (that signals unclear thinking or scope).

After writing it, share it with a colleague or use Claude to review it. Specifically ask: "Is the options section fair? Is the recommendation clearly connected to the requirements? Are there open questions I missed?"

## Exercise 2: Write an ADR for a past decision

Think about a technical decision that was made informally in the last 6 months — in a meeting, in Slack, verbally — that never got written down. Write an Architecture Decision Record for it using the format from the README:

- Title: a one-line summary of the decision
- Date
- Status (accepted, proposed, deprecated, superseded)
- Context: what made this decision necessary?
- Decision: what was decided?
- Consequences: what are the positive and negative expected outcomes?

Keep it to one page or less. The goal is to practice making implicit decisions explicit.

## Exercise 3: Read a real RFC or design doc

Find a real design document or RFC to read. Good sources:
- Python Enhancement Proposals (PEPs): peps.python.org
- Rust RFCs: github.com/rust-lang/rfcs
- Major open source project RFCs (Kubernetes, React, Svelte, etc.)
- AWS Architecture Blog or Google Cloud Architecture Blog

Read it for the *structure* as much as the content:

1. How did they frame the problem?
2. How many options did they consider?
3. How did they structure the trade-off analysis?
4. How explicit was the recommendation and how well was it connected to the requirements?
5. What would you do differently if you were writing this document?

## Reflection

After completing the exercises, write one paragraph on: "What is the hardest part of writing a design doc for me?" Is it framing the problem? Writing a fair options section? Making a recommendation you'll be accountable for? Open questions you don't want to surface?

The hardest part is usually the part that most needs practice.

---

## Clean Code Lens

**Principle in focus:** Single responsibility per section; explicit recommendation

A design doc is clean code applied to technical writing: the Problem Statement section has one job (frame the problem), the Options section has one job (present viable alternatives fairly), and the Recommendation section has one job (state a clear conclusion grounded in the requirements). A doc where the recommendation is buried in the options section, or where the problem statement does double duty as justification, is as hard to review as a function that does several things at once.

**Exercise:** Read your completed design doc from Exercise 1 and check that each section does exactly one thing — if any section is doing two things, split it; if any section is hedging instead of concluding, make it conclude.

**Reflection:** If someone reads only your Recommendation section and the Problem Statement, do they have everything they need to understand what you decided and why — or does the recommendation only make sense if you read the whole document?
