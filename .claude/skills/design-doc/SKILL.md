# /design-doc

Generates a structured design document from a description, following the format defined in `engineering-career/02-engineering-opinion/design-docs-and-rfcs/`.

## Usage

```
/design-doc "add rate limiting to the checkout API"
/design-doc "migrate user sessions from in-memory to Redis"
/design-doc  (reads from context — what are you currently working on?)
```

## What it does

1. **Parses the description** — understands what problem is being solved
2. **Asks clarifying questions** — identifies missing information before generating (requirements, constraints, options to consider)
3. **Generates the design doc** — produces a complete document with all required sections
4. **Saves to the right location** — creates the file in `docs/design/` or the appropriate project location

## Output structure

Every generated design doc includes:

```markdown
# [Feature/System Name]

**Date**: YYYY-MM-DD  
**Status**: Draft | Review | Accepted  
**Author**: [from git config]

## Problem Statement
[What problem are we solving? Why now? Who is affected?]

## Requirements
### Functional
- [What the solution must do]

### Non-functional
- [Reliability, latency, security, scalability requirements]

## Options Considered

### Option A: [Name]
[Description]

**Trade-offs:**
- ✓ [Advantage]
- ✗ [Disadvantage]

### Option B: [Name]
...

## Recommendation
[Which option and why — connected explicitly to the requirements above]

## Implementation Plan
1. [High-level step]
2. [High-level step]
...

## Open Questions
- [Things still unknown that affect the decision]
```

## Skill instructions

You are generating a design document for a technical decision. Follow the format from `engineering-career/02-engineering-opinion/design-docs-and-rfcs/README.md`.

Before generating:
- If the description is vague, ask 2-3 specific clarifying questions. Do not generate a doc with obvious gaps — ask for the information instead.
- If the problem statement is unclear, ask the user to describe the problem in terms of who is affected and what currently breaks or is impossible.

When generating:
- The problem statement must be specific enough that a new engineer reading it would understand why this work is needed
- The options section must contain at least two genuinely viable options — no straw man alternatives
- Every option must be evaluated on the same dimensions so the comparison is fair
- The recommendation must connect explicitly to the requirements — "I recommend Option A because it satisfies the 99.9% availability requirement without requiring a new operational dependency"
- Open questions must be specific and actionable — "what is the expected peak traffic?" not "what are the requirements?"

Save the generated doc to `docs/design/YYYY-MM-DD-[slug].md` unless the user specifies a different location.
