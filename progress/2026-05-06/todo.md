# 2026-05-06 — Today's slice

> **Active sprint:** [progress/sprints/2026-04-30/sprint.md](../sprints/2026-04-30/sprint.md)
> **Sprint progress:** 0 of 13 items complete · 11 remaining after today's slice
> **Working folder:** `progress/2026-05-06/working-folder/agentic-workflows/` (scaffolded; gitignored)

## Round 1 (~120 min)

### S-01: Read `what-is-an-agent/README.md` and capture takeaways

**Time:** ~30 min · **Subject:** Agentic workflows · **Sprint section:** "Agentic workflows" in [sprint.md](../sprints/2026-04-30/sprint.md)

Read [what-is-an-agent](../../agentic-workflows/01-foundations/what-is-an-agent/README.md) (132 lines). This is the vocabulary anchor for the whole curriculum — the README gives a precise, working definition of what makes something an **agent** vs a chatbot vs a workflow. The defining test: **who decides what to do next at runtime?**

Key concepts you'll meet:
- **Agent** = LLM + tools + loop + goal. The LLM decides each next move at runtime.
- **Loop** — the runtime that asks "what now?", executes the action, feeds back the result, asks again.
- **Tool** — a concrete capability. Without tools, an agent is just a chatbot.
- **Autonomy gradient** — a 0→4 spectrum from "human acts on every output" to "agent acts unsupervised in production."

Watch for: the "Don't reach for one when" list is more useful than the "When to reach for an agent" list. Also: the thermostat counter-example sharpens what an agent is NOT.

Capture 3–5 takeaways in the Notes section below. Include at least one item from "Why agents work (and why they fail)."

**Done when:**
- You've read all 132 lines (not just skimmed).
- You have 3–5 takeaways written in Notes, including one from the "why they fail" angle.
- You can explain the autonomy gradient in one sentence from memory.

- [ ] Mark this item complete here AND in `progress/sprints/2026-04-30/items.md` when finished.

---

### S-02: Build `TinyAgent.cs` — four-piece anatomy in C#

**Time:** ~90 min · **Subject:** Agentic workflows · **Sprint section:** "Agentic workflows" → Apply in [sprint.md](../sprints/2026-04-30/sprint.md)

Build the four-piece agent anatomy in C#. Save to `progress/2026-05-06/working-folder/agentic-workflows/TinyAgent.cs`.

What to implement (~50 lines):
1. **`ILlm` interface** — one method, e.g. `string Decide(string context)`.
2. **`StubLlm`** — implements `ILlm`, returns canned next-actions (a list you pop from, cycling through: "CountLines", "CountLines", "done").
3. **`CountLines` tool** — a static method `int CountLines(string path)` that reads a file and returns its line count.
4. **The loop** — max 3 iterations. Each iteration: ask the LLM what to do → execute the tool → print the result → feed back into context. Stop when the LLM returns "done" or you hit the limit.

Run with:
```
dotnet new console -n agentic-day-1
cd agentic-day-1
# replace Program.cs with TinyAgent.cs contents
dotnet run
```

New to C#? [01-classes-basics](../../software-engineering/csharp-and-dotnet/01-classes-basics/README.md) covers the basics. [04-interfaces-and-abstract-classes](../../software-engineering/csharp-and-dotnet/04-interfaces-and-abstract-classes/README.md) covers the `ILlm`/`StubLlm` pattern specifically.

**Done when:**
- `TinyAgent.cs` exists in the working folder and compiles cleanly.
- Running it prints 3 iterations (or stops at "done"), showing what action was taken and the result each turn.
- You can explain why `ILlm` (an interface) is used instead of `StubLlm` directly.

- [ ] Mark this item complete here AND in `progress/sprints/2026-04-30/items.md` when finished.

---

When you finish all of today's items, check the boxes and re-run `/daily-tasks` for the next slice (if you have time today). Or pick this up tomorrow.

## Notes

_(Free space — jot insights, blockers, things to revisit. Persists across rounds today.)_

### S-01 takeaways

_(Write 3–5 here after reading)_

### S-02 blockers / observations

_(Anything worth noting while building TinyAgent)_
