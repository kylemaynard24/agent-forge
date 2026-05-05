# Sprint items — 2026-04-30

13 items. ~9–10 hours total. Sized for ~1 week of part-time work at 1–2 hours/day.

`/daily-tasks` reads this file to pick today's slice. Item state:
- `[ ]` — not started
- `[~]` — assigned to a daily slice (in progress)
- `[x]` — complete

When you finish an item in your daily todo, mark it `[x]` here too. Or let `/daily-tasks` mark it on the next run when you say "yes, finished."

---

## Agentic workflows — `what-is-an-agent` (read step)

- [~] **S-01** — (~30 min) Read `agentic-workflows/01-foundations/what-is-an-agent/README.md` (132 lines). Capture 3–5 takeaways. See sprint section "Agentic workflows". (assigned 2026-05-01 round 1; carried forward to 2026-05-04 round 1)
- [~] **S-02** — (~90 min) Apply: Build `TinyAgent.cs` with `ILlm` interface + `StubLlm` + `CountLines` tool + 3-iteration loop. Save to `progress/<today>/working-folder/agentic-workflows/TinyAgent.cs`. See sprint section "Agentic workflows" → Apply. (assigned 2026-05-01 round 1; carried forward to 2026-05-04 round 1)
- [ ] **S-03** — (~20 min) Answer agentic Q1 + Q2 in writing in your daily todo's Notes (or in the sprint's Answers section). Questions are in sprint section "Agentic workflows" → Prove it.

## Software architecture — `separation-of-concerns` (read step)

- [ ] **S-04** — (~15 min) Read `software-engineering/architecture/01-fundamentals/separation-of-concerns/README.md` (73 lines). Capture 3–5 takeaways including at least one trade-off.
- [ ] **S-05** — (~60 min) Apply: Build `OrderHandlerBad.cs` (one class, three concerns mixed), then refactor into `OrderHandlerGood.cs` + 3 injected interface dependencies. Save to `progress/<today>/working-folder/architecture/`. See sprint section "Software architecture" → Apply.
- [ ] **S-06** — (~20 min) Answer architecture Q1 + Q2 in writing.

## Design patterns — Head First Ch 1 (SimUDuck / Strategy) (read step)

- [ ] **S-07** — (~60 min) Read Head First Design Patterns Ch 1 — at least through the SimUDuck "inheritance breaks" reveal and the introduction of "encapsulating what varies." Reference: physical/digital copy of the book, OR `software-engineering/design-patterns/behavioral/strategy/README.md` for a written version.
- [ ] **S-08** — (~60 min) Apply: Type (don't paste) the SimUDuck example in C# — abstract `Duck` base + `MallardDuck` + `RubberDuck` + `IFlyBehavior` interface + `FlyWithWings` + `FlyNoWay` implementations. Save to `progress/<today>/working-folder/design-patterns/simuduck/`. See sprint section "Design patterns" → Apply.
- [ ] **S-09** — (~20 min) Answer design-patterns Q1 + Q2 in writing.

## DevOps — `Bicep modules + parameters` (read step)

- [ ] **S-10** — (~30 min) Read the [Bicep Modules doc](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/modules) and the [Parameters doc](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/parameters). Capture 3–5 takeaways including at least one anti-pattern you've seen.
- [ ] **S-11** — (~60 min) Work through the MS Learn path "Structure your Bicep code for collaboration" (search by name on learn.microsoft.com).
- [ ] **S-12** — (~90 min) Apply: Refactor a Storage Account Bicep into a parameterized module. Call from `main.bicep` to deploy two storage accounts (e.g., `dev` + `prod` tier). Add `bicepconfig.json` with linter at `error` for `no-hardcoded-location`. Save to `progress/<today>/working-folder/devops/bicep-modules/`. **Tear down** with `az group delete` when done.
- [ ] **S-13** — (~30 min) Answer devops Q1 + Q2 in writing.

---

## Progress

When all 13 items are `[x]`, the sprint is complete. Run `/next-sprint` to generate the next one. State advances to `demo` step for each subject.
