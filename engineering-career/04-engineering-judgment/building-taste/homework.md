# Homework — Building Taste

## Exercise 1: The consequence audit

Pick a piece of code you wrote 3-6 months ago. Read it as though you did not write it.

Write down:
1. What did you get right?
2. What would you do differently now?
3. What made the parts that are hard to read or change hard? Was it naming? Coupling? Missing abstraction? Wrong abstraction?
4. What did you learn about how you were thinking at the time that you now find limited?

The discomfort in this exercise is the taste-building mechanism working correctly.

## Exercise 2: Read someone else's code for the decisions

Pick a meaningful function or module from a codebase you work in or an open source project you use. Read it not to understand what it does, but to understand what decisions the author made.

Write:
1. What decisions did the author make about naming, structure, or abstraction?
2. Which of those decisions do you agree with? Why?
3. Which do you disagree with? What would you do differently?
4. What constraints might have led to the choices you'd make differently? (Legacy, performance, team context?)

The goal is not to judge the code but to build the habit of reading for decisions rather than just for behavior.

## Exercise 3: Post-mortem reading

Read one post-mortem from the sources listed in `learning-from-production/README.md`. While reading, focus specifically on the contributing factors section (or equivalent).

Write:
1. What design decision made this failure possible or worse than it needed to be?
2. When that decision was probably made, did it seem like a reasonable choice?
3. What pattern does this failure represent? (cascading failure, missing circuit breaker, tight coupling, insufficient instrumentation, etc.)
4. Where might you have made the same decision in a system you own? Does it concern you?

## Exercise 4: Taste vocabulary

Engineering taste often gets described as a feeling ("this feels off") before it gets described as reasoning. The goal of this exercise is to convert the feeling into vocabulary.

Think about a piece of code, a system design, or a technical decision that gave you an uneasy feeling — something that seemed "off" even before you could articulate why.

Write:
1. What was it?
2. What was the feeling? (Fragile? Confusing? Too clever? Hard to change? Hard to understand?)
3. What specific structural property caused the feeling? (High coupling, poor naming, too many responsibilities in one place, too much implicit knowledge required, etc.)
4. What would make it better?

Doing this exercise regularly converts intuition into vocabulary. Vocabulary makes it possible to communicate taste to others — which is what code review and design review require.

---

## Clean Code Lens

**Principle in focus:** Name the smells; convert intuition to transferable vocabulary

Engineering taste that lives only as a feeling is like a function that works but cannot be tested — it produces correct outputs but you cannot explain why, and you cannot teach it. Naming the pattern you recognize ("this is a violation of the single responsibility principle; this function is both parsing the input and making the API call") converts taste from personal intuition into transferable judgment that can be written into code review comments, shared in design reviews, and built on by teammates.

**Exercise:** For each code smell you identify in Exercise 4, write it as a named pattern ("implicit temporal coupling", "abstraction at the wrong level", "single responsibility violation") before writing your preferred fix — the name forces precision about what is actually wrong.

**Reflection:** When you give code review feedback, do you name the structural property that makes you uncomfortable — or do you describe the symptom? If you describe the symptom, what named principle would make the feedback more useful to the author?
