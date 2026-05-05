# Homework — Prompts as Programs

> Refactor a prose prompt into a structured, composable, versioned one. Then write a regression test for it.

## Exercise 1: Refactor a kitchen-sink prompt

**Scenario:** A teammate gives you this system prompt for an "incident-summary agent":

> "You're a helpful incident analyst. Read the logs and write a clear summary. Be concise but include detail. Identify the root cause if you can, otherwise say so. Be professional. Use markdown if it helps. Include timestamps. Don't make stuff up. End with a 'next steps' section. Maybe 200 words."

**Build:**
- Refactor into a structured prompt with clear sections: role, capabilities, operating rules, output format, examples (1–2).
- Resolve any contradictions (e.g., "concise" + "include detail").
- Replace negative-only rules with positive replacements ("don't be verbose" → "respond in 200 words or fewer").

**Constraints:**
- Each rule is unambiguous — a tester reading the prompt can list every constraint.
- The output format is a JSON schema, not free text.
- Negative instructions ("don't make stuff up") are replaced with affirmative ones ("only state facts present in the logs; mark unknowns as 'not in logs'").

## Exercise 2: Make it composable

Break your refactored prompt into reusable blocks:
- `incident_role.md` — the role description, reusable for "incident summary," "incident replay," etc.
- `analyst_rules.md` — the rules for any analytical agent.
- `summary_output.json` — the structured output schema.

Write a `composePrompt(parts)` function that assembles the final prompt from blocks.

**Constraint:** the same `incident_role` and `analyst_rules` blocks must work for at least *two* different agents (the summary one + a "post-mortem writer" one).

## Exercise 3: Version + regression test

- Add a version number to each block (`v1`, `v2`, ...).
- Build a small eval set: 5 example logs, each with the expected summary structure.
- Write a runner that calls the LLM (or a stub LLM, if you don't have an API key) with each log and checks the output against the expected structure.
- Bump the version, change one block, re-run. Detect any regressions.

**Constraints:**
- The runner outputs a clear pass/fail per case.
- Version numbers are recorded in the LLM call's metadata so you can attribute outputs to prompt versions.
- The eval set lives in version control next to the prompts.

## Stretch: Inline-vs-tool-schema

Take a prompt that says "Output JSON like this: …" with an inlined JSON example. Convert it to use a structured-output / tool-call schema instead. Compare:
- Robustness (does the model still hallucinate fields?)
- Token cost (the inline example takes tokens; the schema is part of the API call).
- Maintainability (where does the schema live?).

Write your conclusion in 3 sentences.

## Reflection

- "Treat your prompt like code." Which engineering practices most help with prompt quality? (Hint: review, test, version, composition. *Not* copy-paste-and-tweak.)
- An over-structured prompt can be worse than a free-form one. What's the failure mode? (Hint: the model spends attention on the structure instead of the task.)
- Why is "negative-only" prompting fragile? (Hint: there are infinite ways to violate "don't be verbose"; only one way to satisfy "respond in 50 words.")

## Done when

- [ ] Your refactored prompt has 5 clear sections and zero internal contradictions.
- [ ] You can compose two different agents from shared blocks.
- [ ] You have an eval that detects regressions when blocks change.
- [ ] You can articulate the difference between "the prompt as instruction" and "the prompt as program."

---

## Clean Code Lens

**Principle in focus:** Function Structure + Positive Assertions over Negative Guards

A system prompt is a function definition: the role section is the signature (what this function is), the rules section is the contract (what it guarantees), and the output format section is the return type. Just as a function that says "don't return the wrong thing" is weaker than one with a typed return signature, a prompt that says "don't make stuff up" is weaker than one that says "only state facts present in the logs; mark unknowns as 'not in logs'" — the positive form is specific enough to be tested.

**Exercise:** Take your refactored incident-summary prompt and write a unit test for each rule section: given a sample log, assert that the output satisfies the constraint expressed in that rule. If a rule is too vague to write a test for, rewrite the rule until it is testable.

**Reflection:** The homework asks you to replace negative instructions with affirmative ones. In regular code, what is the equivalent of a negative-only guard clause — and what refactoring patterns do developers use to convert them to something more expressive and testable?
