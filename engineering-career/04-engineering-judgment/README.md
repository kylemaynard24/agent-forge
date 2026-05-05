# 04 — Engineering Judgment

Judgment is the ability to make good calls in situations that don't have a clear playbook. It is what separates engineers who can operate in familiar territory from engineers who can operate anywhere.

Judgment cannot be downloaded. It develops through a specific process: exposure to systems and their consequences, reflection on why things went right or wrong, and the accumulation of enough patterns that new situations feel familiar even when they aren't.

This section covers two topics:

| Topic | What it answers |
| --- | --- |
| [`building-taste/`](building-taste/) | What engineering taste is, how it develops, and how to accelerate the process deliberately |
| [`learning-from-production/`](learning-from-production/) | How to use production systems, incidents, and post-mortems as learning material — even ones you weren't involved in |

## What judgment actually is

Engineers sometimes describe judgment as "knowing the right answer." That's not quite right. Judgment is knowing:

- what questions to ask before acting
- which part of the problem is the hard part
- which risks are worth taking and which aren't
- when the standard approach applies and when it doesn't
- what "good enough" looks like for this situation specifically

Judgment is pattern-matching plus calibration. The pattern-matching comes from exposure — you've seen enough systems that new situations feel like variations of things you've seen. The calibration comes from observing consequences — you know which of your patterns have failed and under what conditions.

## The difference between knowledge and judgment

Someone can read every architecture RFC, memorize every design pattern, and pass every system design interview while still having poor judgment when put in a real production situation. That is because knowledge is declarative ("I know what a circuit breaker is") and judgment is procedural ("I know when to add one, when not to, and what to check when it trips").

The exercises in this section are specifically about converting knowledge into judgment. That requires building things, observing outcomes, and being honest about what you got wrong.

## How AI changes this

AI accelerates the building loop — you can generate more experiments in less time. But AI does not observe consequences for you. If you use AI to write code without then running it, debugging it, and experiencing what it does in real conditions, you get faster at generating untested code without developing any additional judgment. The pairing that works: AI to build faster, you to observe and reflect.
