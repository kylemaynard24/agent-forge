# Homework — Tool Design Principles

> Design the tool API for a real-ish domain. Apply all 8 principles. Stress-test against the LLM's likely failure modes.

## Exercise: Design tools for a "task manager" agent

**Scenario:** The agent helps a user manage their personal task list. It can create, read, update, complete, and delete tasks. Tasks have a title, an optional description, a priority (low/med/high), and a status (open/in-progress/done).

**Build a tool API that has:**
- 5–7 tools, all verb-named, single-purpose.
- A consistent error contract — pick one (returns-or-throws OR tagged result OR error-prefix) and apply it everywhere.
- Strict schemas with required fields marked.
- Descriptions that include WHAT, WHEN to use, WHEN NOT to use, RETURN shape.

**Constraints (these enforce the principles):**
- No `task_op(action, ...)` super-tool.
- No optional-everything tool.
- No tool returns an unbounded blob (e.g., `list_tasks` must support filters and pagination).
- One write tool must be idempotent — caller can supply a `client_id` and a retry returns the same result.

## Exercise 2: Stress-test your tools against an LLM

Write down 5 user requests likely to land on your agent (e.g., "make a high-priority task to finish my taxes," "show me my open tasks," "delete the laundry one"). For each, predict:

1. Which tool the LLM should pick.
2. The most-likely *wrong* pick and why.
3. The most-likely fumble in argument shape.

Then refine the tool descriptions to disambiguate the wrong picks. (E.g., if `complete_task` and `update_task` could both mean "mark as done," tighten the descriptions so it's unambiguous.)

## Exercise 3: Versioning a tool

You ship `create_task({title, priority})`. Three months later, a stakeholder needs *due dates*. Two paths:

- **Backwards-compatible add:** add `due_date` as optional. Existing callers keep working.
- **Versioned tool:** introduce `create_task_v2({title, priority, due_date})`; deprecate v1.

Pick one. Implement it. Document the migration path in a `TOOLS_CHANGELOG.md`.

**Constraint:** Either way, an existing agent in the wild that doesn't know about due dates must keep working.

## Stretch: Idempotency in detail

Implement an idempotent `archive_task({task_id, client_id})`:
- First call archives.
- Second call with the same `client_id` returns the first call's result.
- After 24 hours, the idempotency record can be GC'd.

Why does this matter? Because the agent might retry on transient errors and you don't want to archive twice. Real agents experience this constantly.

## Reflection

- Why does "verb in the name" matter so much for LLM tool selection? (Hint: model attends to names; vague names produce vague calls.)
- "Strict schemas catch mistakes before you waste a tool call." Argue with someone who insists on free-form arguments.
- "When the agent fails, look at the tools first." Defend or refute, with one example each way.

## Done when

- [ ] Your tool API has 5–7 tools, each verb-named, single-purpose, strict-schemaed.
- [ ] One write tool is idempotent and tested.
- [ ] You've documented the predicted LLM failure modes and how the descriptions defend against each.
- [ ] You've decided on a versioning strategy and documented the migration of one tool.

---

## Clean Code Lens

**Principle in focus:** Intention-Revealing Names + Command-Query Separation

Tool design IS clean code for agent APIs — every principle that applies to function design applies here with higher stakes, because the LLM selects tools by name before it reads the description. A tool name that requires its description to be understood (`task_op`, `manage_item`, `process`) is a leaky abstraction: the name promises nothing and offloads all disambiguation to text the model may not attend to carefully. Clean tool design means the name alone narrows the LLM's decision to one plausible action.

**Exercise:** Take your 5–7 task-manager tools and stress-test the names by asking: "If I deleted every description, could the LLM still make the correct tool choice for 'mark this task as finished'?" If `complete_task` and `update_task` both survive the description-free test, the names are not disambiguating enough — rename one until only the correct choice passes.

**Reflection:** The homework requires one write tool to be idempotent via a `client_id`. In REST API design, which HTTP method carries the same idempotency contract — and why does that same guarantee matter even more for LLM-called tools than for human-called APIs?
