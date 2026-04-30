# 2026-04-30 — Daily todo

## Yesterday

Sprint starting — no prior day.

---

## Agentic workflows — Level 1 (Beginner — Foundations)

**Topic:** `what-is-an-agent` (#1 in level) — step: `read`

**Files:**
- Master syllabus: [learning-syllabuses/agentic-workflows.md](../../learning-syllabuses/agentic-workflows.md)
- README: [agentic-workflows/01-foundations/what-is-an-agent/README.md](../../agentic-workflows/01-foundations/what-is-an-agent/README.md)
- Demo: [agentic-workflows/01-foundations/what-is-an-agent/demo.js](../../agentic-workflows/01-foundations/what-is-an-agent/demo.js)
- Homework: [agentic-workflows/01-foundations/what-is-an-agent/homework.md](../../agentic-workflows/01-foundations/what-is-an-agent/homework.md)
- Today's working-folder: `progress/2026-04-30/working-folder/agentic-workflows/`

**Reading material — orient yourself before opening the README:**

> _Primer:_ "Agent" is the most overloaded word in the current AI conversation. The README cuts through this by giving a precise, working definition: an LLM put inside a loop, given tools to act on the world, and pointed at a goal. The defining test for whether something is an agent — versus a chatbot or a workflow — is **who decides what to do next at runtime**. This is the vocabulary anchor for the entire 6-month dojo: every later topic refines one of the four pieces introduced here.

> _Key concepts you'll meet:_
> - **Agent** — LLM + tools + loop + goal. Decides each next move at runtime.
> - **Loop** — the runtime that asks the LLM "what now?", executes the chosen action, feeds the result back, asks again.
> - **Tool** — a concrete capability. Without tools, an agent is just a chatbot.
> - **Autonomy gradient** — a 0→4 spectrum from "human acts on every output" to "agent acts unsupervised in production."

> _Watch for as you read:_ The "Don't reach for one when" list is more useful than the "When to reach for an agent" list. Also: the thermostat counter-example sharpens what an agent **is not**.

> _Excerpt (verbatim from the linked README):_
> > "The defining difference is **who decides what to do next**. In a chatbot, the user does. In a workflow, the developer did (at design time). In an agent, the LLM does — at runtime, every step."

**Today:**
- [ ] **Step:** Read `what-is-an-agent/README.md` (132 lines, ~30 min). Capture 3–5 takeaways in Notes, including at least one item from "Why agents work (and why they fail)."
- [ ] **Apply:** Write a 20-line `tiny-agent.js` containing the four-piece anatomy: stub LLM (returns canned next-action), one tool (`countLines(filename)`), a loop (max 3 iterations), a goal. Print each iteration. Save to `progress/2026-04-30/working-folder/agentic-workflows/tiny-agent.js`.

**Prove it — answer in the Answers + explanations section at the bottom:**
1. Pick a tool you actually use — is it agent / chatbot / workflow by the README's "who decides what to do next" test? One sentence.
2. The README says agents fail when "the tool set is too rich (paralysis) or too sparse (impossibility)." Give one concrete example of each.

---

## Software architecture — Level 1 (Beginner — Fundamentals + Principles)

**Topic:** `separation-of-concerns` (#1 in level) — step: `read`

**Files:**
- Master syllabus: [learning-syllabuses/architecture.md](../../learning-syllabuses/architecture.md)
- README: [software-engineering/architecture/01-fundamentals/separation-of-concerns/README.md](../../software-engineering/architecture/01-fundamentals/separation-of-concerns/README.md)
- Demo: [software-engineering/architecture/01-fundamentals/separation-of-concerns/demo.js](../../software-engineering/architecture/01-fundamentals/separation-of-concerns/demo.js)
- Homework: [software-engineering/architecture/01-fundamentals/separation-of-concerns/homework.md](../../software-engineering/architecture/01-fundamentals/separation-of-concerns/homework.md)
- Today's working-folder: `progress/2026-04-30/working-folder/architecture/`

**Reading material — orient yourself before opening the README:**

> _Primer:_ Separation of Concerns is the most-cited word in software design and the foundation of nearly every later architecture topic. Each module owns one focus area, so a change in one place doesn't ripple in three directions. The hard part isn't agreeing with the principle — everyone does — it's knowing how far to take it. Over-applied SoC produces ceremony, anemic modules, and indirection harder to follow than the mess it replaced. The most useful skill from this topic is being able to argue about *when not to split*.

> _Key concepts you'll meet:_
> - **Concern** — one focus area: validation, business logic, persistence, notification, UI rendering.
> - **Locality of change** — the goal: edit one concern without touching the others.
> - **Anemic module** — a SoC failure mode: the module exists but does nothing meaningful, just forwards calls.
> - **Rule of thumb (3 reasons)** — "if you can name three independent reasons a function might change, it's three functions in disguise."

> _Watch for as you read:_ The "Cons" list is shorter than the "Pros" list — but the cons are where most real architecture mistakes happen. Read those lines twice.

> _Excerpt (verbatim from the linked README):_
> > "Each module, file, or class owns one focus area. When a single piece of code mixes UI, business rules, and persistence, every change ripples in three directions."

**Today:**
- [ ] **Step:** Read `separation-of-concerns/README.md` (73 lines, ~15 min). Capture 3–5 takeaways in Notes — at least one **trade-off**.
- [ ] **Apply:** Write a 30-line script that mixes three concerns (reads CSV, computes stat, writes report). Then split into `parse.js` (pure), `compute.js` (pure), `report.js` (I/O). Save to `progress/2026-04-30/working-folder/architecture/before.js` and `progress/2026-04-30/working-folder/architecture/after/`. The "after" should let you swap `report.js` for a no-op without touching the others.

**Prove it — answer in the Answers + explanations section at the bottom:**
1. Pick a function you've written recently — name three reasons it might change. Is it really one concern or three?
2. What's the equivalent of pastry / grill / dish stations for a typical "create an order" web feature? Name three stations and what each owns.

---

## Design patterns — Level 1 (Beginner — Foundations of pattern thinking) — Head First Ch 1

**Topic:** `Ch 1: Welcome to Design Patterns` (#1 in level) — step: `read`
**Pattern(s):** Strategy
**Running example:** SimUDuck

**Files:**
- Master syllabus: [learning-syllabuses/design-patterns.md](../../learning-syllabuses/design-patterns.md)
- Head First chapter: read in your physical/digital copy of *Head First Design Patterns* (2nd ed, 2020) — Chapter 1
- Repo Strategy reference — README: [software-engineering/design-patterns/behavioral/strategy/README.md](../../software-engineering/design-patterns/behavioral/strategy/README.md)
- Repo Strategy reference — Demo: [software-engineering/design-patterns/behavioral/strategy/demo.js](../../software-engineering/design-patterns/behavioral/strategy/demo.js)
- Repo Strategy reference — Homework: [software-engineering/design-patterns/behavioral/strategy/homework.md](../../software-engineering/design-patterns/behavioral/strategy/homework.md)
- Today's working-folder: `progress/2026-04-30/working-folder/design-patterns/`

**Reading material — context if the book isn't in front of you:**

> _Primer:_ Chapter 1 is the book's "why patterns matter" chapter, taught entirely through SimUDuck — a duck simulation whose first design uses inheritance to share behavior. As the team adds new duck types (rubber ducks that don't quack, decoy ducks that don't fly), the inheritance hierarchy breaks in ways override-and-suppress can't fix cleanly. The chapter walks you through that pain on purpose, then introduces three OO design principles that resolve it: identify what varies and encapsulate it, program to an interface not an implementation, and favor composition over inheritance.

> _Key concepts you'll meet:_
> - **Strategy pattern** — define a family of algorithms behind a common interface, make them interchangeable at runtime.
> - **Encapsulate what varies** — separate the parts that change from the parts that stay the same.
> - **Program to an interface (or supertype)** — clients depend on an abstraction; concrete implementations are swappable.
> - **Composition over inheritance** — give an object a behavior reference rather than inheriting; far more flexible at runtime.

> _Watch for as you read:_ The deliberate "wrong" first design — they show inheritance breaking before they fix it. Don't skim that part; the discomfort is the lesson.

> _Excerpt (verbatim from the repo's secondary-reference README — `software-engineering/design-patterns/behavioral/strategy/README.md`):_
> > "Define a family of algorithms, encapsulate each one behind a common interface, and make them **interchangeable at runtime**. The client holds a strategy object and delegates the algorithmic work to it."

**Today:**
- [ ] **Step:** Start Head First Ch 1 — aim for ~30–60 minutes today. Read at least through the SimUDuck "inheritance breaks" reveal and the introduction of "encapsulating what varies."
- [ ] **Apply:** Type (don't paste) a 15-line example: a `Sorter` class with a swappable `compare` Strategy. Two strategies (`byLength`, `byAlphabetical`), instantiate twice, sort `["bee", "a", "elephant"]` with both, print results. Save to `progress/2026-04-30/working-folder/design-patterns/sorter-strategy.js`.

**Prove it — answer in the Answers + explanations section at the bottom:**
1. What specifically broke when they tried to put `fly()` on the Duck base class? What did inheritance promise it couldn't deliver?
2. Name a Strategy hiding in code you've worked with under a different name (common aliases: "policy", "handler", "provider", "selector", "comparator"). What's the strategy interface, and what concrete strategies exist?

---

## DevOps (Azure shop) — Level 2 (Intermediate — Composable infrastructure)

**Topic:** `Bicep modules + parameters` (#1 in Level 2) — step: `read`

> Personal note: skipping Level 1. You already deploy Azure resources daily and are comfortable with Docker, Bicep basics, and GitHub workflows — Level 1 is preserved in the syllabus for friends starting fresh.

**Files:**
- Master syllabus: [learning-syllabuses/devops.md](../../learning-syllabuses/devops.md) (see Level 2 row 1 for the topic + deeper-reading + deliverable)
- Bicep docs root: [https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- Bicep modules doc: [https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/modules](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/modules)
- Bicep parameters doc: [https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/parameters](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/parameters)
- Azure Verified Modules: [https://aka.ms/avm](https://aka.ms/avm) — read 2–3 modules to see professional patterns
- Today's working-folder: `progress/2026-04-30/working-folder/devops/`

**Reading material — context for an external-only topic:**

> _Primer:_ A monolithic Bicep file is the IaC equivalent of a 2000-line function: it works, until it doesn't. **Modules** are Bicep's separation-of-concerns mechanism — small reusable units of infrastructure with explicit inputs (parameters), explicit outputs, and zero hidden state between them. **Parameters** are the typed contract: a module declares what it needs to receive from its caller, with optional `@description`, `@allowed`, `@minLength`, `@secure`, and default values. Together they let one Bicep template scale from "one Storage Account" to "the entire shape of an environment" without becoming unmaintainable. Today's read is the bridge from "I can write Bicep" to "I write Bicep that other engineers can read, reuse, and trust."

> _Key concepts you'll meet:_
> - **Module** — a Bicep file referenced by another via `module myThing 'storage.bicep' = { ... }`. Compiles to a nested ARM deployment.
> - **Parameter** — a typed input declared with `param name string = 'default'` and consumed in resource bodies via interpolation.
> - **`@decorator`** — annotations like `@description('...')`, `@allowed([...])`, `@minLength(3)`, `@secure()` that constrain or document a parameter.
> - **`output`** — a value a module returns to its caller (often a resource ID or a connection string). Outputs are how modules talk to each other.
> - **Parameter file** (`*.bicepparam`) — a typed parameter source that replaces the older `.parameters.json`. Type-checked against the template.
> - **`bicepconfig.json`** — repo-level config for the Bicep linter, registry aliases, and analyzer rules.

> _Watch for as you read:_ The most common mistake is making modules **too small** (one module per resource) — you end up with the same wiring overhead Java developers used to complain about with EJBs. Aim for modules that represent **a meaningful unit of capability** (a "secure storage tier," a "web app + its hosting plan + its app insights"), not single resources. Also: read the docs on **module aliases** in `bicepconfig.json` — that's how teams version and share modules across repos without copy-paste.

> _Doc reference:_ Microsoft Learn — *Structure your Bicep code for collaboration* (search by name) is the most important hands-on path for this topic; it's a 4-module sequence and worth the full ~60–90 minutes.

> _Deep dive:_
>
> **The mental model: modules are functions, parameters are arguments, outputs are return values, and Azure resources are side effects.** Every Bicep module compiles down to a nested ARM deployment, which means parameter passing, output return, and dependency tracking all happen at the deployment-engine level — not as a syntax convenience. This has two practical consequences: (1) module calls are **idempotent unit boundaries** — if a module fails, only that nested deployment is marked failed and you can re-run just that module via `--what-if-result-format` and selective deployment. (2) Outputs are **resolved at deployment time, not template-compile time**, so you can use one module's output as another module's input safely even when the underlying resource doesn't exist yet at compile time.
>
> **The most common practitioner mistake** is parameterizing for hypothetical future flexibility instead of for actual variation. A module with 14 parameters where 12 of them have defaults that are never overridden is a smell — it suggests the author didn't know what was supposed to vary. The fix: start with **zero parameters** and add one only when a real caller needs to override it. Rule of thumb: a parameter without at least two distinct callers using different values should probably be a constant inside the module.
>
> **Worked example in prose:** imagine your team has three apps, each with the same shape — App Service + App Insights + Storage Account + Key Vault. The wrong move is one big module per app. The right move is **four small modules** (`appService.bicep`, `appInsights.bicep`, `storage.bicep`, `keyVault.bicep`), each parameterized only on `name`, `location`, and a few app-specific knobs (SKU, retention). Then one **per-app composition module** (`webapp-stack.bicep`) that calls all four and wires them together (App Service reads its connection string from Key Vault, which holds Storage's key). Each app's `main.bicep` is now ~10 lines: pick a name, pick a region, call `webapp-stack.bicep`. New app? 10 more lines. The four base modules and the composition module never change.
>
> **Connecting back:** in Level 1 you wrote a single-resource Bicep file. The leap here is teaching that file to participate in a **composition** — to be one piece of a larger templated system. Every Level-2 and Level-3 topic from here builds on this: outputs feed Key Vault (topic 2), modules get versioned and published to ACR (Level 4), `what-if` operates per-module (Level 3 topic 3). Get this one solid.

**Today:**
- [ ] **Step:** Read the Bicep *Modules* doc and the *Parameters and outputs* doc (~30–45 min total). Then start the MS Learn path *Structure your Bicep code for collaboration* (~60 min). Capture 3–5 takeaways in Notes including at least one **anti-pattern** you've personally seen (or now suspect you've written).
- [ ] **Apply:** Take a Storage Account Bicep you've already written (or write a quick one). Refactor into a module taking `name`, `location`, `sku`, `tags`. Call it from `main.bicep` to deploy two storage accounts (e.g., `dev` and `prod` tier). Add a `bicepconfig.json` with the linter at `error` for `no-hardcoded-location`. Save to `progress/2026-04-30/working-folder/devops/bicep-modules/` (`main.bicep`, `modules/storage.bicep`, `bicepconfig.json`). Tear down the deployed RG when done (`az group delete -n <name> --yes --no-wait`).

**Prove it — answer in the Answers + explanations section at the bottom:**
1. The Deep dive argues a parameter without two distinct callers using different values should probably be a constant. Look at one of your team's Bicep templates — pick a parameter that fails this test. What would you do instead, and why might the original author have added it?
2. The Deep dive frames modules as "functions, parameters as arguments, outputs as return values." Pick a non-Bicep system in your daily work that uses the same pattern (some module/function decomposition). What does Bicep's module system do *better* than that system, and what does it do *worse*?

---

## Answers + explanations

_All Prove-it questions consolidated here. Write your **Answer** (be brief — one sentence is fine) and your **Explanation** (the reasoning — this is where the learning compounds). Don't skip the explanation; the answer alone doesn't prove understanding._

### 1. Agentic workflows Q1

**Q:** Pick a tool you actually use — is it agent / chatbot / workflow by the README's "who decides what to do next" test? One sentence.

**Answer:**

**Explanation:**

### 2. Agentic workflows Q2

**Q:** The README says agents fail when "the tool set is too rich (paralysis) or too sparse (impossibility)." Give one concrete example of each.

**Answer:**

**Explanation:**

### 3. Software architecture Q1

**Q:** Pick a function you've written recently — name three reasons it might change. Is it really one concern or three?

**Answer:**

**Explanation:**

### 4. Software architecture Q2

**Q:** What's the equivalent of pastry / grill / dish stations for a typical "create an order" web feature? Name three stations and what each owns.

**Answer:**

**Explanation:**

### 5. Design patterns Q1

**Q:** What specifically broke when they tried to put `fly()` on the Duck base class? What did inheritance promise it couldn't deliver?

**Answer:**

**Explanation:**

### 6. Design patterns Q2

**Q:** Name a Strategy hiding in code you've worked with under a different name (common aliases: "policy", "handler", "provider", "selector", "comparator"). What's the strategy interface, and what concrete strategies exist?

**Answer:**

**Explanation:**

### 7. DevOps Q1

**Q:** The Deep dive argues a parameter without two distinct callers using different values should probably be a constant. Look at one of your team's Bicep templates — pick a parameter that fails this test. What would you do instead, and why might the original author have added it?

**Answer:**

**Explanation:**

### 8. DevOps Q2

**Q:** The Deep dive frames modules as "functions, parameters as arguments, outputs as return values." Pick a non-Bicep system in your daily work that uses the same pattern (some module/function decomposition). What does Bicep's module system do *better* than that system, and what does it do *worse*?

**Answer:**

**Explanation:**
