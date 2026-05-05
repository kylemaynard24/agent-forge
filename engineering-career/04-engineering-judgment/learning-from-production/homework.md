# Homework — Learning from Production

## Exercise 1: Read a post-mortem deeply

Find a real post-mortem from one of the sources listed in the README (Cloudflare, GitHub, Stripe, AWS, etc.). A longer, more detailed one is better for this exercise.

Read it twice. First time for the story. Second time for the structure.

On the second read, write down:

1. **Triggering event**: what was the immediate cause?
2. **Underlying conditions**: what was already true that made the trigger catastrophic? (There are usually 2-4 of these.)
3. **Detection failure**: why didn't the team know something was wrong sooner?
4. **Recovery friction**: what made restoring normal service take as long as it did?
5. **The design decision**: somewhere in the contributing factors is a decision that was made months or years earlier. What was it? At the time it was made, would you have made the same decision?

## Exercise 2: Your own mini post-mortem

Think about a bug, outage, performance problem, or unexpected failure you were involved in at work — even a small one.

Write a short post-mortem (1-2 pages maximum):

1. **What happened**: the symptom and the timeline
2. **Root cause**: what was actually wrong
3. **Contributing factors**: what conditions were already present that made this possible or worse
4. **Detection**: how did you find out? What could have made detection faster?
5. **Resolution**: what did you do to fix it?
6. **Lessons**: what would you change — in the code, the monitoring, the process, or the design?

Share it with a colleague or use it as a design review artifact. The habit of writing post-mortems — even for small things — is one of the highest-return engineering practices.

## Exercise 3: Pattern matching

After reading at least two or three post-mortems, write down:

1. What patterns do you see across incidents? List at least three recurring structural causes.
2. Do you see any of these patterns in systems you currently work on?
3. If you found one of these patterns in your own system, what would you do about it?

## Exercise 4: Instrument something

Pick a service, a function, or a component you own or work on that currently has no or minimal observability. Add:

1. At minimum: a log statement at the start and end with enough context to reconstruct what happened
2. Ideally: a metric (a counter or a latency measurement) that would have helped detect the last bug you fixed in this area

After adding it, ask: "If this component started failing silently right now, how long would it take me to know?" If the answer is "hours" or "when a user reports it," the observability is insufficient.
