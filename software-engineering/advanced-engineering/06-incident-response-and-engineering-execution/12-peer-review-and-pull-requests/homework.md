# Homework — Peer Review and Pull Requests

> Make every pull request a net positive for the author, the codebase, and the team.

## Exercise

Find a pull request — from a real project you work on, an open-source repository, or one you invent from a small change to your own code.

**Build:**
- a written PR description using the What / Why / How / What to watch format
- a complete review of that PR with comments classified as blocking, non-blocking, or nit
- at least one positive comment on something worth explicitly noting
- a one-paragraph author response to the most important blocking comment

**Constraints:**
- every blocking comment must include what the problem is, when it manifests, and what to do about it
- you may not write "this seems fragile" or "this could be better" without specifying the failure scenario
- at least one comment must be a question rather than a conclusion
- nit comments must be marked with `nit:` at the start

## Reflection

- Which comment took the longest to write, and why?
- What did you notice in the second pass through the diff that you missed in the first?
- Were any of your blocking concerns actually just preferences in disguise? How did you tell the difference?

## Done when

- you can classify every comment by weight without second-guessing yourself
- the blocking comments each explain a concrete failure scenario, not a general concern
- an author reading the review could act on every comment without needing to ask a follow-up question
- the PR description makes the change legible without needing to read the diff first

---

## Clean Code Lens

**Principle in focus:** Intention-revealing documentation + consistent structure

PR descriptions are documentation, and a PR description that names what changed, why it changed, and what to look for in the review is the clean code standard for changes. A description that just repeats the commit message forces every reviewer to reconstruct the intent from the diff — the same problem as code that forces you to execute it mentally to understand what it does.

**Exercise:** Write the PR description for your scenario using the What / Why / How / What to watch structure, then cover the description and read only the diff. Note every question a reviewer would need to ask that the description would have answered. Each unanswered question is a gap in the description's clarity.

**Reflection:** If the PR description disappeared and a reviewer had only the diff and the commit messages, what would they misunderstand or overlook about the intent of the change — and does that gap belong in the description or in the code's own names and comments?
