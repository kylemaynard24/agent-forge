# 2026-05-13 — Today's slice

> **Active sprint:** [progress/sprints/2026-04-30/sprint.md](../sprints/2026-04-30/sprint.md)
> **Sprint progress:** 0 of 13 items complete · 12 remaining after today's slice
> **Working folder:** `progress/2026-05-13/working-folder/agentic-workflows/` (scaffolded; gitignored)

## Round 1 (~30 min)

### S-01: Read `what-is-an-agent` README and capture takeaways

**Time:** ~30 min · **Subject:** Agentic workflows · **Sprint section:** "Agentic workflows" in [sprint.md](../sprints/2026-04-30/sprint.md)

Read [what-is-an-agent](../../agentic-workflows/01-foundations/what-is-an-agent/README.md) (~252 lines). This is the vocabulary anchor for the whole curriculum — the README gives a precise working definition of an agent (LLM + tools + loop + goal) and the key test: *who decides what to do next at runtime?* Chatbot = user. Workflow = developer (at design time). Agent = LLM (at runtime, every step).

Key things to look for as you read:
- The **autonomy gradient** (0–4 scale from "human acts on every output" to "acts unsupervised in prod")
- The **"Don't reach for one when"** list — more useful than the positive list
- The **thermostat counter-example** — sharpens what an agent is *not*

Capture 3–5 takeaways in the Notes section below, including at least one item from "Why agents work (and why they fail)."

**Done when:**
1. You've read the full README
2. You've written at least 3 takeaways in Notes
3. At least one takeaway is from the failure/success section

- [x] Mark this item complete here AND in `progress/sprints/2026-04-30/items.md` when finished.

---

When you finish all of today's items, check the boxes and re-run `/daily-tasks` for the next slice (if you have time today). Or pick this up tomorrow.

## Notes

_(Free space — jot insights, blockers, things to revisit. Persists across rounds today.)_

1. Definitions that are important:
- LLM - the decision-maker. Reads context, returns either an action or a final answer
- A tool set - concrete capabilities (read a file, run a command, query a DB,send an email). Without Tools, an agaent is just a chatbot. - not an MCP - MCP is the standard way to expose/invoke capabilities
- a loop - a runtime that asks the LLM "what now?", executes the chosen action, feeds the result back, and asks again
- A goal (or task) - the user's intent, supplied as a prompt or task definition

2. Why Agents work and why they fail
    - the difference between an llm and a human branch - nondeterminate vs determinate,
        cleaner version: 
            - LLM Branch - the next step is chosen by the model, so it's probabilistic and may vary run to run.
            - Human branch: the next step is chose by a person, so itsa manual/external decision point
    - analysis paralysis vs too sparse (ambiguity)- so this has become an art?


3. Questions to carry with you when evaluating an agentic system: 
    - What failure is this preventing?
    - Where is autonomy allowed vs constrained?
    - How will I know this helps in real use?
    - What breaks if I remove it?

4. There is a bunch of great information at the end of the readme... Human-in-the-loop is used as a first-class pattern