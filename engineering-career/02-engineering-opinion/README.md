# 02 — Engineering Opinion

One of the clearest signals of seniority is whether an engineer has an opinion. Not stubbornness — opinion. The ability to look at a technical situation, form a grounded assessment, and articulate it with reasoning attached.

Junior and mid engineers are often hesitant to have opinions because they fear being wrong. Senior engineers have been wrong enough times to understand that having a reasoned opinion — even an incorrect one — is far more valuable to a team than silence or endless hedging.

This section covers three topics:

| Topic | What it answers |
| --- | --- |
| [`forming-opinions/`](forming-opinions/) | How engineering opinions actually develop — what the inputs are and how to calibrate so you're opinionated but not dogmatic |
| [`articulating-tradeoffs/`](articulating-tradeoffs/) | The core skill: how to compare options with explicit reasoning rather than saying "it depends" and stopping there |
| [`design-docs-and-rfcs/`](design-docs-and-rfcs/) | How to write design docs and RFCs — the primary medium through which senior engineers communicate and drive decisions |

## What an engineering opinion is

An engineering opinion is different from:

- **A preference**: "I like Postgres" is a preference. "Postgres is the right choice here because we need strong consistency across these two tables and the team already has operational experience with it" is an opinion.
- **A principle**: "We should always prefer composition over inheritance" is a principle. Applied to the current situation with reasoning attached, it becomes an opinion.
- **A guess**: "Maybe microservices would help?" is not an opinion. "Microservices would help if our bottleneck is independent deployability, but given that we only have two engineers and our coupling is in the data layer, not the service boundaries, a modular monolith is the better bet right now" is an opinion.

The distinguishing feature is the structure: **context + claim + reasoning + caveats**. An opinion is a reasoned position on a specific situation, not a general belief.

## Why this matters for career progression

Decisions get made in every engineering organization every day — about architecture, about tooling, about process, about priorities. Those decisions are made by whoever is in the room with a position. Engineers who can walk into a design review, a sprint planning, or an incident retrospective and say something grounded are the ones whose careers move. Engineers who sit quietly or defer to whoever speaks first are invisible, regardless of how good their code is.

You cannot skip this skill. Even if you are the best debugger or the fastest implementer on your team, you will stall in your career if you cannot hold and communicate a technical position.
