# Homework — System Design Interviews

## Exercise 1: Design a system using the framework

Pick one of these prompts and design the system out loud or in writing, following the six-step framework from the README:

- Design a URL shortener
- Design a notification service
- Design a rate limiter
- Design a system that shows a user their recent activity feed

**Step 1 — Clarify**: write at least five clarifying questions you would ask before starting. Then write the assumptions you'll proceed with.

**Step 2 — Estimate**: back-of-envelope scale estimates for writes per second, reads per second, and data storage.

**Step 3 — High-level design**: sketch the major components and how they connect. You can describe this in words or draw it out.

**Step 4 — Deep dive**: pick the one component you consider most critical or most interesting and go deeper. How does it actually work? What are the edge cases?

**Step 5 — Trade-offs**: name the key decisions you made and what alternatives you considered.

**Step 6 — Operational concerns**: how would you know if this system was failing? What would you monitor?

After completing the exercise, reflect: which step was hardest? That is where to invest.

## Exercise 2: Architecture curriculum connection

Pick one topic from `software-engineering/architecture/` that you have studied. Write two to three paragraphs on: "How would I use what I know about [topic] in a system design interview?"

For example, if you studied `07-resilience-and-scale/circuit-breaker/`, how does circuit breaker thinking come up in a system design for a service that calls external APIs?

The goal is to actively connect your architecture knowledge to the interview context, rather than keeping them separate.

## Exercise 3: Mock interview

Do a 45-minute mock system design interview. You can:
- Ask a colleague to play interviewer (give them one of the standard prompts)
- Use Claude as an interviewer (ask Claude to give you a system design prompt and push back on your decisions)
- Record yourself designing a system out loud and play it back

Evaluate yourself on:
1. Did you clarify requirements before designing?
2. Did you stay on track or drift?
3. Did you make explicit trade-off statements or just describe components?
4. What did the interviewer push back on and how did you handle it?
5. What would you do differently?

## Exercise 4: Design dissection

Find a real system design blog post or architecture breakdown from an engineering blog (Cloudflare, GitHub, Stripe, Discord, etc.). Read it and then write:

1. What problem were they solving?
2. What options did they consider?
3. What did they decide and why?
4. What trade-offs did they accept?
5. How would you have answered the system design prompt for this system in an interview context?

This exercise connects real engineering decisions to the interview format, which makes the interview feel less artificial.

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names; explicit contracts at component boundaries

System design clarity in an interview is clean code at the architecture level: a diagram with boxes named "service" and "database" communicates no more than a codebase with variables named `x` and `data`. Named components with explicit contracts ("the notification service receives a `SendNotificationRequest` with a deduplicated `idempotency_key` and guarantees at-least-once delivery") show the interviewer that you think in interfaces, not just in boxes.

**Exercise:** In your Exercise 1 design, name every component, every data store, and every API boundary — then verify that every connection between components has an implied or stated contract about what is sent, in what shape, and what happens on failure.

**Reflection:** If the interviewer asked you to name the single most important design decision in your system and explain the trade-offs you accepted, could you answer in two sentences using only names you have already introduced — or would you need to introduce new concepts to answer?
