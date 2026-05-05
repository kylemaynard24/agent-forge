# Learning from Production

Production is where systems meet reality, and that collision produces the best learning material available to an engineer. No design document, no unit test, no architecture diagram tells you what production tells you: what actually breaks, how, under what conditions, and why your defenses didn't catch it.

The engineers who learn the fastest are the ones who mine production systematically — not just when things go wrong, but as a regular practice.

## Why production is the best teacher

In development, you control the conditions. The data is clean, the load is low, the users are you. You can make things work by assumption.

In production, the assumptions encounter reality. The data has edge cases you did not anticipate. The load is uneven. The users do things you did not design for. Dependencies are unreliable. Clocks drift. Networks partition. Disks fill up.

The gap between "works in development" and "works in production" is exactly where engineering judgment lives. An engineer who has shipped ten systems into production has a library of specific, concrete data points about what the gap looks like. An engineer who has only worked in development has theories.

## How to learn from your own production systems

### Instrument and observe

You cannot learn from production if you cannot see what it is doing. Instrumentation is the prerequisite.

At minimum, you want:
- Request rates and error rates for your endpoints
- Latency distributions (not just averages — p95 and p99 tell you what real users experience)
- Database query times and connection pool usage
- Queue depths and lag
- Memory and CPU usage, ideally over time so you can see trends

When something goes wrong — even something small — look at these metrics first. Build the habit of correlating the symptom you observed with the signals in the metrics. Over time, you develop an intuition for what "normal" looks like and what patterns precede problems.

### Run your own mini post-mortems

When you encounter a bug, a performance issue, or an unexpected failure, write down the five-minute version:

1. What was the symptom?
2. What was the actual cause?
3. How long did it take to find? Why?
4. What would have made it faster to detect or diagnose?
5. Was there a design decision that made this failure more likely or harder to find?

You do not need to share this with anyone. The act of writing it down forces you to extract the lesson rather than just fix the bug and move on.

## How to learn from production systems you were not involved in

One of the most underused learning resources is the large library of public post-mortems from companies running systems at scale. These are free, detailed, written by practitioners, and cover exactly the kinds of failures that are hard to generate in a controlled environment.

### How to read a post-mortem

When you read a post-mortem, the timeline of events is the least interesting part. The most interesting part is the contributing factors: what underlying conditions made this possible?

Questions to ask while reading:

**What was the triggering event?** (The direct cause — "a configuration change was deployed")

**What were the underlying conditions?** (The things that were already true that made the trigger catastrophic — "the service had no circuit breaker, so a downstream failure cascaded")

**What detection failed?** (Why didn't we know something was wrong sooner? Was there no alert? Was the alert not actionable? Was the alert suppressed?)

**What made recovery slow?** (Was the rollback procedure unclear? Did the system not support partial rollback? Was the oncall engineer not familiar with this part of the system?)

**What design decision, made months or years ago, contributed to the blast radius?** (Not to assign blame — to understand what structural choices affect outcomes when things go wrong)

### Good sources of public post-mortems

- **Cloudflare blog**: detailed, technically thorough post-mortems covering a wide range of distributed systems failures
- **GitHub engineering blog**: post-mortems on availability and performance incidents
- **Stripe engineering blog**: analysis of reliability and scale challenges
- **AWS service health dashboard**: brief post-mortems on major service events
- **The SRE Book** (sre.google): free online, contains case studies and a systematic approach to production learning
- **post-mortems.io** and similar aggregators: community-collected post-mortems from across the industry

The goal is not to memorize specific incidents. The goal is to accumulate a pattern library of how systems fail — the classes of failure, the structural causes, the detection gaps. After reading 30-40 detailed post-mortems, you will find that most serious incidents are variations on a small number of underlying patterns.

## Patterns that recur in production failures

After reading enough post-mortems, you start to see the same underlying conditions over and over:

**Cascading failures from missing circuit breakers or timeouts**: one slow dependency causes the entire call stack to block, which exhausts thread pools or connection pools, which causes every other operation to fail too.

**Configuration changes without gradual rollout**: a change is applied globally rather than incrementally, so when it causes problems, the blast radius is 100%.

**Missing idempotency in retry logic**: a retry after a timeout causes the same operation to execute twice, creating duplicate data, double charges, or conflicting state.

**Alert fatigue causing real alerts to be missed**: so many alerts are firing (often for non-urgent issues) that the one alert that actually mattered was treated as noise.

**Tight coupling between components that appear independent**: a failure in component A causes component B to fail even though they are not in the same request path, because they share a database, a cache, or a resource limit.

**The "works on my machine" network assumption**: code that assumes fast, reliable networking between services without considering the failure modes when that assumption breaks.

Recognizing these patterns in new systems — before they cause failures — is one of the practical outputs of learning from production.

## The production mindset

Engineers who have internalized production learning develop a specific mindset when designing new systems. They naturally ask:

- "How would I know if this is failing?"
- "What happens when this dependency is unavailable?"
- "What's the blast radius if this change is wrong?"
- "How do I roll this back if I need to?"
- "What will this look like at 10x the current load?"

These questions are not pessimism. They are the residue of having seen enough things break to understand that breakage is normal and that the design decisions made during development determine how bad the breakage is when it arrives.
