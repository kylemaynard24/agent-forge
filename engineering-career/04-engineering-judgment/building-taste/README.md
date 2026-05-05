# Building Engineering Taste

Engineering taste is the ability to recognize good and bad design quickly, often before you can fully articulate why. It is what an experienced engineer is using when they look at a codebase for five minutes and say "this is going to be a mess to change" — before reading a single line closely.

Taste is not a personality trait. It is accumulated pattern recognition, calibrated by consequence. And it can be built deliberately.

## What taste actually is

Taste is the compressed residue of many cycles of: make a design decision → observe the consequences → update your model.

When someone with taste reads a function with five parameters, each a boolean, they feel discomfort. That discomfort is not an aesthetic reaction — it is a pattern match against every time they or someone else had to debug a call site that passed the wrong combination of five booleans in the wrong order. The feeling arrives before the explanation because the pattern recognition is faster than the verbal reasoning.

This is why taste is hard to teach directly. You cannot transmit the pattern recognition without the experiences that built it. What you can do is accelerate the accumulation of relevant experiences.

## How taste develops

### Consequence cycles

The core input to taste is consequence. You design something, ship it, and then live with it. The gap between "the code that seemed fine when I wrote it" and "the code I am now trying to debug or extend" is where taste is forged.

Most engineers who plateau technically are doing a lot of building but not a lot of consequence-observing. They ship and move on. They never read back through their own code six months later. They never ask "why was this hard to change?" in a systematic way.

**Practical habit**: when you fix a bug or extend a feature, spend five minutes asking why it was harder than it should have been. Was it the coupling? The naming? The missing abstraction? The wrong abstraction? Write it down. The act of articulating "this was hard because..." is how pattern recognition gets upgraded into explicit knowledge.

### Reading code with intent

Reading code is a taste-building activity — but only if you're reading with intent. Skimming code to understand "what does this do?" is different from reading code to understand "what decisions did the author make and how are those decisions affecting the readability and changeability of this code?"

Code to read with intent:

- **Well-regarded open source projects**: the standard library of a language you use, popular frameworks, reference implementations. These have been read by many people and the design choices are often deliberate and documented.
- **Code from engineers you respect**: when a colleague whose judgment you trust writes something, read it not just to understand it but to understand how they structured it. What did they name things? How did they organize the modules? What did they not include?
- **Your own code from six months ago**: you will be embarrassed sometimes. That embarrassment is taste in the process of developing. The code you wrote six months ago was the best you could do then; the ability to critique it now is progress.

### Post-mortems and incident reports

Post-mortems are concentrated taste-building material. They answer: what design decision, made months or years ago, contributed to this failure? What was the chain of consequence from a choice that seemed reasonable at the time to a production incident?

A well-written post-mortem has this shape:
- What happened (the incident)
- Timeline (the sequence of events)
- Contributing factors (the underlying conditions, not just the triggering event)
- Why defenses didn't catch it (the gap in the safety net)
- What we're changing (the lessons)

Reading the "contributing factors" section is where you train taste. The contributing factors in most serious incidents are not "someone did something dumb." They are structural: a missing abstraction that required humans to coordinate, a configuration that was easy to misread, a coupling that made the blast radius of a failure larger than it should have been.

Public post-mortems worth reading: Cloudflare, GitHub, Stripe, Slack, AWS, PagerDuty. Many are available on engineering blogs or on the web. The SRE book from Google (available free online) contains dozens of case studies.

### Being in code review with more senior engineers

Getting your code reviewed by someone with more experience — and engaging substantively with the feedback rather than just applying the changes — is one of the fastest ways to build taste. Every comment is a data point: here is a pattern that someone with more experience found worth commenting on, and here is why.

The key is to engage, not just comply. When a reviewer suggests a different approach, understand why before changing the code. Ask if you don't understand. Disagree if you think they're wrong. The discussion itself is where the learning is.

## The shortcut that doesn't exist

You cannot build taste without consequence. There is no amount of reading about good design that substitutes for building something, shipping it, and then dealing with it in production or maintenance mode.

AI accelerates the building loop significantly — you can experiment faster, generate more variations, and implement ideas that would have taken much longer alone. But the consequence loop is irreplaceable. If you use AI to generate code without then reading it critically, running it, debugging it, and eventually revisiting it, you are getting faster at generating code without building any taste.

The productive pattern: use AI to build more, then observe more. More experiments, more consequence cycles, more pattern accumulation. Not: use AI to build things I don't read or understand.

## Taste and opinion

Taste is the precondition for having genuine engineering opinions. You cannot form a credible opinion about whether a particular design choice is good without having enough accumulated pattern recognition to recognize why one thing is better than another in a specific context.

This is why the progression matters: build things → accumulate consequence cycles → develop taste → form opinions → articulate trade-offs → drive technical decisions. You cannot skip steps.
