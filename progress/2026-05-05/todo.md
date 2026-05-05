# 2026-05-05 — Today's slice

> **Active sprint:** [progress/sprints/2026-04-30/sprint.md](../sprints/2026-04-30/sprint.md)
> **Sprint progress:** 0 of 13 items complete · 11 remaining after today's slice
> **Working folder:** `progress/2026-05-05/working-folder/<subject>/` (scaffolded; gitignored)

> **Carried forward (again).** S-01 and S-02 were originally assigned 2026-05-01, carried to 2026-05-04, and remain unchecked. Re-listed here for today.

## Round 1 (~120 min)

A complete "read + apply" cycle for one subject (agentic workflows). Saving `Prove-it questions` (S-03) for round 2 — answer them after the apply task lands so your answers are grounded in real code.

### S-01: Read `what-is-an-agent` README

**Time:** ~30 min · **Subject:** agentic workflows · **Sprint section:** ["Agentic workflows"](../sprints/2026-04-30/sprint.md) in sprint.md

Read [`agentic-workflows/01-foundations/what-is-an-agent/README.md`](../../agentic-workflows/01-foundations/what-is-an-agent/README.md) (132 lines). The defining test for "agent vs chatbot vs workflow" is **who decides what to do next at runtime**. The four-piece anatomy is LLM + tools + loop + goal. The autonomy gradient runs 0→4 — start at the lowest level that does the job.

For deeper context, the sprint section has a Primer + Key concepts + Watch-for + a 250-word Deep dive on why the **loop** is the underrated piece (the place where reliability lives). Worth scanning before clicking into the README.

**Done when:**
- README is read end-to-end (not skimmed).
- 3–5 takeaways written in the Notes section below.
- At least one item from "Why agents work (and why they fail)" included.

- [ ] Mark this item complete here AND in `progress/sprints/2026-04-30/items.md` when finished.

---

### S-02: Apply — Build `TinyAgent.cs`

**Time:** ~90 min · **Subject:** agentic workflows · **Sprint section:** ["Agentic workflows" → Apply](../sprints/2026-04-30/sprint.md) in sprint.md

Build a four-piece tiny agent in C# with these elements:
- An `ILlm` interface with one method: `LlmResponse Decide(string context);`
- A `LlmResponse` record: `(string Action, string? ToolName, string? ToolArg)`
- A `StubLlm` implementation that returns canned next-actions (e.g., step 0 returns `("ToolCall", "CountLines", "data.txt")`; later steps return `("Done", null, "Result: N")`)
- A `Tools` static class with `int CountLines(string path) => File.ReadAllLines(path).Length;`
- A `TinyAgent` class with constructor `(ILlm llm, string goal)` and a `Run(int maxIterations = 3)` method containing the loop: ask LLM → execute tool → feed result back → repeat
- A `Main` that builds the agent and runs it on a real file (e.g., the `progress/README.md` you have)

Aim for ~50 lines total. Print each loop iteration so you can watch the four pieces (LLM stub deciding, tool executing, loop continuing, goal eventually met) actually working.

**Save to:** `progress/2026-05-05/working-folder/agentic-workflows/TinyAgent.cs` (gitignored — your scratch).

**Run with:** `dotnet new console -n TinyAgent && cd TinyAgent && (replace Program.cs with your file) && dotnet run`

**Reference:** `software-engineering/csharp-and-dotnet/04-interfaces-and-abstract-classes/` if the `ILlm` interface mechanics need a refresher (this is the canonical "depend on the smallest abstraction" pattern in C#).

**Done when:**
- `TinyAgent.cs` exists at the working-folder path.
- `dotnet run` produces output for each loop iteration ending in a goal-completion message.
- The LLM is a stub (no real API call); you can read every line and see exactly where each of the four pieces lives.

- [ ] Mark this item complete here AND in `progress/sprints/2026-04-30/items.md` when finished.

---

When you finish all of today's items, check the boxes and re-run `/daily-tasks` for the next slice (likely S-03 + S-04: answer agentic questions + read `separation-of-concerns`). Or pick this up tomorrow — the skill will see what you've done.

## Notes

_(Free space — jot insights, blockers, things to revisit. Persists across rounds today.)_

### Takeaways from S-01 (`what-is-an-agent`)

1.
2.
3.

### Notes from S-02 (`TinyAgent.cs` apply)

- Surprises:
- Choices made:
- What I'd change:
