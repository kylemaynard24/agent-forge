# /adr

Captures a technical decision as an Architecture Decision Record (ADR) in standard format and saves it to the ADR directory.

## Usage

```
/adr "use PostgreSQL instead of MongoDB for the user data store"
/adr "adopt trunk-based development for this repo"
/adr  (captures the most recent significant decision from context)
```

## What it does

1. **Parses the decision** — understands what was decided
2. **Infers context** — uses the current codebase and conversation context to fill in background
3. **Generates the ADR** — produces a complete, concise ADR
4. **Assigns a sequential number** — checks the ADR directory for the next available number
5. **Saves to `docs/adr/`** — creates `ADR-NNNN-[slug].md`

## ADR format

```markdown
# ADR-NNNN: [Decision Title]

**Date**: YYYY-MM-DD  
**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-NNNN

## Context
[What situation made this decision necessary? What constraints existed?
What were we trying to achieve? 3-5 sentences max.]

## Decision
[What was decided, stated clearly and unambiguously in one or two sentences.]

## Options Considered
- **[Option A]**: [One-sentence description] — [key trade-off]
- **[Option B]**: [One-sentence description] — [key trade-off]
- **[Option C]**: [One-sentence description] — [key trade-off]

## Consequences

### Positive
- [Expected benefit]
- [Expected benefit]

### Negative / Trade-offs
- [Cost or constraint accepted]
- [Cost or constraint accepted]

### Risks
- [What could go wrong that this decision assumes won't]
```

## Skill instructions

You are capturing an architecture decision record. The goal is to record the reasoning behind a decision so that future engineers (or the current engineer six months from now) can understand why it was made without having to reconstruct the context from code and conversation history.

Key principles:
- **Be concise.** An ADR is one page, not five. If the context section is longer than 5 sentences, it is too long.
- **Be honest about trade-offs.** An ADR that only lists benefits is not a useful record — it omits the costs that were accepted and the constraints that made this the right choice.
- **Use past tense for the decision.** "We decided to use PostgreSQL" not "We will use PostgreSQL."
- **Name the options that were rejected.** Future readers often wonder "did they consider X?" — the options section answers this.

To find the next ADR number: check `docs/adr/` for existing ADRs. If none exist, start at ADR-0001. If ADRs exist, use the next number in sequence.

If the user provides only a brief description, infer the context from the current codebase. If the context is genuinely ambiguous (you don't know what system this is for or what constraints applied), ask one focused question before generating.

Save to `docs/adr/ADR-NNNN-[kebab-case-slug].md`.
