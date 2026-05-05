# Homework — Forming Engineering Opinions

## Exercise 1: Opinion audit

Think about a technical decision that was made recently in your work — a framework choice, an architectural decision, a data model, a deployment approach, anything with real trade-offs.

Write down:
1. What was decided?
2. Do you have an opinion about whether it was the right call? What is it?
3. What evidence supports your opinion? (direct experience, analogous situations, things you've read, things you've seen fail)
4. What evidence might challenge your opinion?
5. Is your opinion a preference, a principle, or a grounded contextual opinion? Apply the distinction from the README.

## Exercise 2: Consequence reflection

Pick one technical decision you made in the last 6-12 months that you can now evaluate with hindsight. Write:

1. What did you decide?
2. What were the consequences — good and bad?
3. What does the outcome tell you about the quality of your original reasoning?
4. What would you decide differently? Why?

This is the core taste-building loop described in `04-engineering-judgment/building-taste/`. The act of writing it makes it deliberate rather than accidental.

## Exercise 3: Engage with a technical disagreement

Find a real technical discussion — a code review where there's a disagreement, a design discussion, a team debate about a tool or approach — and participate with a stated position.

Write after the fact:
1. What was the disagreement?
2. What was your position and what was your reasoning?
3. Were you pushed back on? How did you respond?
4. Did your position change? If so, what changed it? If not, why not?

The goal is not to be right — it is to practice the cycle of forming and defending a position in real conditions.

## Exercise 4: Read something with intent

Pick one engineering blog post, architecture RFC, or post-mortem (see suggestions in `04-engineering-judgment/learning-from-production/`) and read it for the decision-making, not the information.

Write:
1. What was the key decision the author or team made?
2. What alternatives did they consider?
3. Do you agree with their reasoning? What would you have done differently and why?
4. What is one thing this reading changed or added to your mental model?

---

## Clean Code Lens

**Principle in focus:** Make the implicit explicit; evidence-backed assertions

"I believe this approach is better" is the opinion equivalent of an undocumented function — it asserts a result without showing the reasoning. "I believe X because I observed Y in three codebases and it caused Z each time" is a named claim with named evidence, which is both more persuasive and more useful to challenge productively. Engineering opinions with named evidence are auditable in the same way well-commented code is.

**Exercise:** Take your strongest technical opinion from Exercise 1 and rewrite it so that every claim is backed by a named piece of evidence — a specific codebase, a specific incident, a specific post-mortem — and remove any sentence that is only a feeling.

**Reflection:** If a colleague pushed back on your opinion and asked "what's that based on?", would you have specific named evidence ready — or would you be reaching for generalities?
