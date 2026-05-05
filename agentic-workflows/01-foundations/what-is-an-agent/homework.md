# Homework — What is an agent?

> Build a minimal agent. Make every piece visible. The point isn't to make it smart — it's to make the architecture obvious.

## Exercise: Replace the stub LLM with a *rule* LLM

**Scenario:** Take the demo's `stubLLM` and replace its hardcoded script with a tiny rule-based "decider" that picks the next action by looking at the conversation history. It should still solve "count lines in todo.txt" — but now the agent's behavior is driven by *rules over observations*, not a fixed script.

**Build:**
- A `ruleLLM(history)` function. It inspects the last message and decides:
  - If the user asks about a file → return `read_file`.
  - If the last observation is a string that contains newlines → return `count_lines`.
  - If the last observation is a number → return `finish` with an answer formatted using it.
- Run the loop with this `ruleLLM`. Same output as the canned demo.

**Constraints (these enforce the architecture):**
- Don't change the loop. Only `stubLLM` is replaced.
- The rule LLM must not call tools directly — it only *picks* what should happen next.
- All actual side effects still go through the tool dispatch step in the loop.

## Stretch 1: Add a third tool

Add a `word_count` tool that returns the number of words in a text. Update the rule LLM so the user can ask either "how many lines" or "how many words." The agent picks the right tool.

**Constraint:** Don't add an `if user_says('words')` shortcut that picks the tool inside the loop. The decision lives in the LLM (rule) layer; the loop dispatches whatever the LLM returns.

## Stretch 2: Add a real Claude call

Swap `ruleLLM` for an actual call to the Anthropic API (or use the Claude Agent SDK). Same loop, same tools, same goal. Watch the model figure out the right tool calls without hardcoded rules. (You can use the Anthropic SDK's tool-use feature; the schema-vs-loop mapping is exercise #3.)

## Reflection

- The demo's `stubLLM` is hardcoded. Your `ruleLLM` is hand-coded. A real LLM is *learned*. What changes about the agent's behavior at each level? What stays the same? (Hint: the loop and tools don't change. That's the point.)
- You added a third tool. How would the agent behave if you added 50 tools? 500? At what point does "more tools = better agent" stop being true? (Foreshadowing: see `02-single-agent-design/tool-design-principles`.)
- If you replaced the loop's `for (... maxSteps)` with `while (true)`, what bad thing happens? Name two real-world failures that bound is preventing.

## Done when

- [ ] Rule LLM solves the original goal without canned responses.
- [ ] You can swap rule LLM for a fully canned LLM and the loop is unchanged.
- [ ] You added a third tool and the rule LLM picks correctly between counts.
- [ ] You can articulate the four pieces of an agent without re-reading the README.

---

## Clean Code Lens

**Principle in focus:** Single Responsibility + Meaningful Names

Each of the four agent components — model, tools, loop, and memory — maps cleanly to a single responsibility; when any one of them starts doing two things (e.g., a tool that also updates state, or a loop that also parses LLM output), the whole architecture blurs in the same way a function named `processAndSave` does. The names you give each component are load-bearing: a function called `ruleLLM` tells a reader exactly which layer is responsible for decisions, while a function called `handler` could mean anything.

**Exercise:** Write a one-sentence responsibility statement for each of the four components in your `ruleLLM` agent (e.g., "The loop is responsible for advancing state; it neither decides what to do nor executes side effects"). If any statement contains the word "and," split that component.

**Reflection:** If you had to expose the four components as a public API with named interfaces, what would you call each one — and would those names still hold when you swap the stub LLM for a real model?
