# 03 — Technical Interviews

Interviewing is a learnable skill. It is not a fair test of engineering ability, but it is the gate between you and every external opportunity. Treating it as something that either goes well or doesn't — rather than as a skill with a clear structure that can be practiced and improved — is one of the most expensive passive decisions an engineer makes.

This section covers three topics:

| Topic | What it answers |
| --- | --- |
| [`what-interviews-actually-test/`](what-interviews-actually-test/) | The mental model: what interviewers are actually trying to measure, why the format is what it is, and how to use that understanding to perform better |
| [`system-design-interviews/`](system-design-interviews/) | How to approach open-ended system design interviews — from clarifying requirements to making trade-offs to operating under uncertainty |
| [`behavioral-interviews/`](behavioral-interviews/) | How behavioral interviews work, how to pick and structure stories, and how to calibrate your answers to the level you're targeting |

## The meta-point about interviews

Most interview advice treats interviews as an obstacle course: here are the tricks to get through it. That framing makes you worse at it, because it makes you perform rather than demonstrate.

The better frame: an interview is a short window where a stranger is trying to answer two questions about you — "can this person do the work?" and "would this person be good to work with?" Everything you do in the interview either gives them evidence toward one of those answers or leaves them with uncertainty. Your job is to reduce uncertainty and make the evidence legible.

That means:
- Think out loud. Silence is not neutral — it's negative evidence.
- Ask clarifying questions before diving into solutions. It signals that you don't just build things, you think about what to build.
- Handle feedback non-defensively. How you respond to being pushed back on in an interview is data about how you respond to it at work.
- Know what you don't know. Saying "I haven't worked with that at scale, but here's how I'd think about it" is stronger than bluffing.

## Interviews and the rest of the curriculum

System design interviews are directly trained by the architecture curriculum in `software-engineering/architecture/`. The more deeply you understand distributed systems trade-offs, CAP, consistency models, resilience patterns, and communication boundaries, the more naturally you can reason through a system design prompt out loud.

Behavioral interviews are trained by real work — but you have to consciously extract the stories. The homework in `behavioral-interviews/` is specifically about building that story library before you need it.
