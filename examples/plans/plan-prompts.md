# Plan prompt templates

Plan mode is only as useful as your prompt. Enter plan mode (Shift+Tab, or `/plan`) and use these templates as starting points — fill in the bracketed parts with specifics.

## Feature plan

> Plan a new feature: **<one-sentence description>**.
>
> Constraints:
> - <constraint 1, e.g. "must not change the public API">
> - <constraint 2, e.g. "needs to coexist with the existing X module">
>
> Show me:
> - Files that will change, with what changes in each
> - Migration order if any
> - Tests I should expect
> - Open questions or ambiguities

## Refactor plan

> Plan a refactor to: **<goal>**.
>
> Current pain: <what's wrong today>.
> Success criteria: <how we'll know it's done>.
>
> Identify:
> - Scope (what's in, what's out)
> - Order of operations
> - Rollback strategy if something breaks mid-flight
> - Alternatives you considered and why you rejected them

## Bug-fix plan

> Plan a fix for this bug: **<symptom + reproduction>**.
>
> Before proposing a fix:
> - Identify the root cause, not just the surface symptom
> - Show me 2–3 plausible hypotheses you considered and how you'd rule each in or out
> - Name a regression test that would have caught this

## Migration plan

> Plan the migration from **<old>** to **<new>**.
>
> Must-haves:
> - No flag day — existing sessions / data keep working through the transition
> - Observable rollout — we can tell if it's going wrong
> - Reversible mid-flight
>
> Break into phases with success criteria for each phase.

## Diagnosis plan (read-only investigation)

> Investigate: **<question>**.
>
> Plan the investigation — don't propose fixes yet:
> - Which files / symbols / logs to look at, in order
> - What signals would confirm vs. rule out each hypothesis
> - How you'll report findings
>
> We'll agree on the diagnosis before anyone edits code.

## Large-task plan (when you want phases, not a blob)

> Plan **<goal>** as a sequence of reviewable chunks.
>
> For each chunk:
> - What it does
> - Why it's independently shippable (or, if not, why we still want this seam)
> - Estimated size (rough: S/M/L)
>
> I want to be able to approve chunks one at a time rather than the whole plan at once.

## Review of my own plan

> I've drafted a plan: <paste plan>.
>
> Don't rewrite it. Do one pass of *critique only*:
> - Things I'm missing
> - Hidden assumptions
> - Ordering risks
> - Scope that should be split or merged
>
> Finish with: "ship this plan" / "revise before shipping" / "rework from scratch".

---

## Using these well

- **Be specific about constraints.** "Needs to work with X" is better than "don't break anything."
- **Name success criteria up front.** "How we'll know it's done" shapes every step of the plan.
- **Ask for rejected alternatives.** A plan without rejections is a plan that didn't consider any.
- **Demand open questions.** The best plans surface ambiguity rather than hide it.
