# Homework — Tools as the World Interface

> Design the tool set, not just the agent. Most agent bugs are tool bugs in disguise.

## Exercise: Design a tool set for a research agent

**Scenario:** You're building an agent that helps a user research a topic. It can search the web, fetch URLs, summarize text, and save notes. Design the tool set.

**Build:**
- 4–6 tools.
- Each with a name, a description (3–5 sentences, written like a small prompt), and a JSON-Schema-ish input shape.
- A "finish" tool with a specific output structure (a summary + 3 key citations).

**Constraints (these enforce good tool design):**
- **Verb names.** `web_search` not `search_handler`. `fetch_url` not `url_tool`.
- **Single-purpose.** No `do_research(action, ...)` super-tool.
- **Strict schemas.** Every required arg marked. No "any" types.
- **Predictable failure.** Document what each tool returns on success vs failure. Pick one error contract.
- **No more than 6 tools.** If you have a 7th, justify it. (If you can't, drop one.)

## Exercise 2: Stress test

Take your tool set and write three "bad agent" scenarios — situations where the agent will likely use the tools wrong:

1. **The wrong tool.** A scenario where two of your tools could plausibly apply, and the agent might pick the wrong one. How would you fix the description to disambiguate?
2. **Bad arguments.** A scenario where the LLM is likely to omit a required field or fabricate a value. How would you catch this at the schema layer?
3. **Right tool, wrong behavior.** A scenario where the agent makes a valid call but with a *destructive* effect (e.g., overwriting a saved note). What guard do you add?

Document each fix as a 2-line annotation on the tool description or schema.

## Stretch: Compose vs grow

Take two of your tools that the agent is likely to chain together (e.g., `web_search` → `fetch_url` → `summarize_text`). Add a higher-level tool `research_topic(query)` that does the chain in one call.

Now: **measure the cost of each.** For an LLM that costs $X per call, when does the higher-level tool save money? When does it lose flexibility you needed?

This is the core trade-off of tool design — write your conclusion in 3 sentences.

## Reflection

- Tool descriptions are documentation written for an LLM. How is that different from documentation written for humans? (Hint: LLMs are surprisingly literal about "use this when…"; humans skim past it.)
- A junior engineer often wants to add tools. A senior engineer often wants to remove them. Why?
- "If your agent is dumb, blame the tools." Defend or refute in one paragraph.

## Done when

- [ ] Your tool set has 4–6 tools, each verb-named, single-purpose, strict-schemaed.
- [ ] Each description tells the LLM when to use, when not to use, and what's returned.
- [ ] You've documented at least three failure scenarios and the design choice that prevents each.
- [ ] You can articulate when you'd compose tools vs grow a higher-level one.

---

## Clean Code Lens

**Principle in focus:** Intention-Revealing Names + Single Responsibility

A tool name is the only documentation available to the model at the moment it decides which tool to call — there is no hover-over, no IDE autocomplete, no colleague to ask. A tool named `process` or `handle_data` forces the LLM to read the entire description to understand intent, the same way a function named `doStuff` forces a human reader to read the body; a tool named `fetch_url` communicates its contract before the description is ever read.

**Exercise:** Take your 4–6 research-agent tools and cover up every description. Can you predict — from the name alone — what each tool does, what it takes as input, and what it returns? For any tool where you can't, rename it until you can.

**Reflection:** The homework forbids a `do_research(action, ...)` super-tool. What is the clean code smell that pattern violates, and where else in software design have you seen the same temptation to collapse multiple operations into one flexible entry point?
