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

> _Primer:_ "Agent" is the most overloaded word in the current AI conversation. The README cuts through this by giving a precise, working definition: an LLM put inside a loop, given tools to act on the world, and pointed at a goal. The defining test for whether something is an agent — versus a chatbot or a workflow — is **who decides what to do next at runtime**. This is the vocabulary anchor for the entire 6-month curriculum: every later topic refines one of the four pieces introduced here.

> _Key concepts you'll meet:_
> - **Agent** — LLM + tools + loop + goal. Decides each next move at runtime.
> - **Loop** — the runtime that asks the LLM "what now?", executes the chosen action, feeds the result back, asks again.
> - **Tool** — a concrete capability. Without tools, an agent is just a chatbot.
> - **Autonomy gradient** — a 0→4 spectrum from "human acts on every output" to "agent acts unsupervised in production."

> _Watch for as you read:_ The "Don't reach for one when" list is more useful than the "When to reach for an agent" list. Also: the thermostat counter-example sharpens what an agent **is not**.

> _Excerpt (verbatim from the linked README):_
> > "The defining difference is **who decides what to do next**. In a chatbot, the user does. In a workflow, the developer did (at design time). In an agent, the LLM does — at runtime, every step."

> _Deep dive:_
>
> The four-piece anatomy (LLM + tools + loop + goal) isn't an academic taxonomy — it's a **debugging checklist**. When a real agent misbehaves, the failure almost always traces to one of those four pieces being the wrong shape: the LLM is too small for the reasoning required, the tools are too coarse or too fine-grained, the loop has no termination condition or runs unbounded, or the goal is ambiguous and gets reinterpreted mid-run.
>
> The most underrated piece is **the loop**. People focus on the LLM (which model, what prompt) and the tools (which capabilities). But the loop is where reliability lives. A well-designed loop has explicit termination conditions ("done when the test passes", "give up after 5 iterations", "stop if cost exceeds $X"), structured state passed between iterations (not just appending to a chat history that grows forever), and a way to detect circular reasoning (LLM keeps trying the same failing approach). Loop design is the leverage point that lets a 70%-reliable model produce a 95%-reliable agent.
>
> The autonomy gradient is the second underrated concept. Most production agent failures aren't "the agent did something wrong" — they're "the agent was given more autonomy than the task warranted." Level 4 ("acts unsupervised in production") is rare and dangerous outside narrow well-scoped domains. Most production agents should sit at Level 2–3: act in a sandbox or with guardrails, with humans reviewing aggregates rather than every action.
>
> **Connecting forward:** the next topic, `the-agentic-loop`, is a deep dive on the loop itself — termination, ReAct, observation handling. The piece you'll spend the most time on for the rest of this curriculum is the loop, because it's the piece you have the most control over.

> _Extra credit (optional — papers, talks, posts for going deeper):_
> - **Building Effective Agents** — Anthropic engineering team (2024). The modern definition of what an agent actually is, including the patterns Anthropic uses internally. ~30 min read. [anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)
> - **ReAct: Synergizing Reasoning and Acting in Language Models** — Yao et al. (2022). The foundational paper on the agent loop pattern (thought + action + observation). The vocabulary you'll see everywhere downstream. [arxiv.org/abs/2210.03629](https://arxiv.org/abs/2210.03629)

> _C# extra credit (optional — go deeper on the language idioms):_
> - **C# topic 04: interfaces-and-abstract-classes** — today's `TinyAgent.cs` apply task hinges on the `ILlm` interface + `StubLlm` implementation pattern; the topic 04 README explains the deeper "depend on the smallest abstraction" reasoning behind why the agent takes `ILlm` rather than `StubLlm` directly. README + demo + questions at `software-engineering/csharp-and-dotnet/04-interfaces-and-abstract-classes/`.

**Today:**
- [ ] **Step:** Read `what-is-an-agent/README.md` (132 lines, ~30 min). Capture 3–5 takeaways in Notes, including at least one item from "Why agents work (and why they fail)."
- [ ] **Apply (C#):** Build `TinyAgent.cs` containing the four-piece anatomy in C#: an `ILlm` interface with a `StubLlm` implementation that returns canned next-actions, one tool (a static `CountLines(path)` method), a loop (max 3 iterations), and a goal. Print each iteration. ~50 lines. Save to `progress/2026-04-30/working-folder/agentic-workflows/TinyAgent.cs`. New to C#? See `software-engineering/csharp-and-dotnet/01-classes-basics/` and `04-interfaces-and-abstract-classes/`. Run with `dotnet new console -n agentic-day-1 && cd agentic-day-1 && (replace Program.cs with the file) && dotnet run`.

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

> _Deep dive:_
>
> Separation of Concerns is a **force that pulls in two directions**, and the practitioner skill is knowing when each direction wins. The pull toward separation is obvious: edit one concern without rippling into others, test in isolation, parallelize team work. The pull *back* — under-applied SoC — is less obvious until you've felt it: a 30-line script that does one job is easier to read than the same logic split across 7 files in 3 directories with 2 abstract base classes mediating between them.
>
> The most common practitioner failure is **applying SoC too aggressively too early**. You read about Hexagonal Architecture, decide your CRUD app needs ports and adapters, and end up with `IUserRepository` interface + `UserRepositoryImpl` + `UserService` + `UserController` + `UserDTO` + `UserEntity` for what was 200 lines of direct DB-to-route code. The original was easier to maintain. The "clean" version is now 6 files of forwarding calls — the anemic-module failure mode the README warns about. You paid ceremony cost for hypothetical future flexibility that never arrived.
>
> The honest rule: **separate when you feel the pain, not when you read the principle**. The README's "three independent reasons to change → three functions" is a good test, but the underlying judgment is "have I actually had to change one without the other?" If yes, separate. If no, you're paying ceremony cost for a refactor you might never need. Senior engineers err toward keeping things together until concrete pressure forces a split — the pressure becomes evidence the split is worth its cost.
>
> **Connecting forward:** the next topic, `coupling-and-cohesion`, is the *measurement layer* for what SoC accomplishes. SoC tells you to split; coupling/cohesion tell you whether your split was a good one — high cohesion within each module, low coupling between them. Without coupling/cohesion as a check, "separated" can just mean "scattered."

> _Extra credit (optional — papers, talks, posts for going deeper):_
> - **On the Criteria To Be Used in Decomposing Systems into Modules** — David Parnas (1972). The original "information hiding" paper and probably the most-cited paper in software design history. 6 pages; foundational reading for any architecture work.
> - **Out of the Tar Pit** — Ben Moseley & Peter Marks (2006). On the distinction between *essential* and *accidental* complexity — the framing that makes "separation of concerns" earn its space. ~30 pages, free PDF widely available; changes how you see codebases.

> _C# extra credit (optional — go deeper on the language idioms):_
> - **C# topic 04: interfaces-and-abstract-classes** — the `OrderHandlerBad` → `OrderHandlerGood` refactor in today's apply IS the architectural-separation-via-interfaces story told in C#. Topic 04 question Q1 (depending on the smallest abstraction) and Q4 (Interface Segregation Principle) are directly relevant. README + demo + questions at `software-engineering/csharp-and-dotnet/04-interfaces-and-abstract-classes/`.

**Today:**
- [ ] **Step:** Read `separation-of-concerns/README.md` (73 lines, ~15 min). Capture 3–5 takeaways in Notes — at least one **trade-off**.
- [ ] **Apply (C#):** Write `OrderHandlerBad.cs` (~30 lines) — a single class that mixes three concerns: validates an `Order` record, persists it (write to a text file), and prints a notification. Then refactor into `OrderHandlerGood.cs` plus three small classes implementing `IOrderValidator`, `IOrderRepository`, `IOrderNotifier` — `OrderHandlerGood` takes them via constructor injection. Save both versions side-by-side under `progress/2026-04-30/working-folder/architecture/`. The "after" should let you swap `IOrderNotifier` for a no-op test double without touching the other classes. New to C#? See `software-engineering/csharp-and-dotnet/13-capstone-implement-with-the-four-tracks/` for a near-complete walkthrough of this exact pattern.

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

> _Deep dive:_
>
> What makes Head First Chapter 1 work as a teaching device is the **wrong-design-first pedagogy**. The book deliberately walks you into the inheritance trap, shows the override-and-suppress smell when you try to fix it, then introduces the three OO principles as the way out. By the time Strategy appears, you've already felt the design pressure that makes it the right answer — so the pattern feels inevitable rather than arbitrary.
>
> The deepest takeaway from Ch 1 isn't "use Strategy" — it's **"encapsulate what varies."** Strategy is one application of that meta-principle. Decorator (Ch 3), Factory (Ch 4), Command (Ch 6) are all different applications of the same core idea: take the part that changes, lift it out, give it an explicit name, make it pluggable. Once you internalize this, you'll start seeing pattern opportunities everywhere — but also, importantly, recognize when *not* to apply a pattern (when nothing actually varies, separation is just ceremony).
>
> The **most common practitioner mistake** when first learning Strategy is creating an interface with one concrete implementation and calling it "future-proof." That's not Strategy — that's premature abstraction. Strategy earns its keep when you have **two or more** real, currently-existing variants that need to coexist at runtime. One implementation behind an interface is a smell, not a pattern. Senior engineers wait for the second variant before extracting the interface, then extract it cheaply when the second appears.
>
> **Connecting forward:** Chapter 2 (Observer) introduces the second-most-used pattern in modern code, also via the "encapsulate what varies" lens — what varies is *who responds to events*. Chapter 3 (Decorator) does the same for *what wrapping behavior gets applied*. The four-chapter arc 1-2-3 is really one extended argument about composition over inheritance.

> _Extra credit (optional — papers, talks, posts for going deeper):_
> - **A Behavioral Notion of Subtyping** — Barbara Liskov & Jeannette Wing (1994). The actual academic source for the Liskov Substitution Principle. The "L" in SOLID. Strategy is partly about avoiding the inheritance traps Liskov's principle warns about — reading the source paper is illuminating.
> - **Sandi Metz — *Nothing is Something*** (RailsConf 2015, available on YouTube). On the Null Object pattern, polymorphism, and removing conditionals. The clearest practical demonstration of how "encapsulate what varies" plays out in real code. ~35 min watch.

> _C# extra credit (optional — go deeper on the language idioms):_
> - **C# topic 03: inheritance-and-polymorphism** — the SimUDuck apply uses an abstract `Duck` base class with virtual/override mechanics; topic 03 explains when this is the right call (closed taxonomy, semantic specialization) vs when composition wins (the Part 2 logger refactor in topic 03's homework). README + demo + questions at `software-engineering/csharp-and-dotnet/03-inheritance-and-polymorphism/`.
> - **C# topic 04: interfaces-and-abstract-classes** — `IFlyBehavior` + composition is exactly the modern Strategy form in C#; the demo.cs in topic 04 has the full SimUDuck implementation worked through.

**Today:**
- [ ] **Step:** Start Head First Ch 1 — aim for ~30–60 minutes today. Read at least through the SimUDuck "inheritance breaks" reveal and the introduction of "encapsulating what varies."
- [ ] **Apply (C#):** Type (don't paste) a piece of the **chapter's SimUDuck example** in C# — the actual code the book walks you through, modernized for C# 12 / .NET 8. Aim for ~50 lines: abstract `Duck` base class with `Swim()` + `Display()`; `MallardDuck` and `RubberDuck` subclasses; `IFlyBehavior` interface with `FlyWithWings` and `FlyNoWay` implementations; ducks compose an `IFlyBehavior` reference (constructor-injected) and call `PerformFly()` that delegates to it. Demo: instantiate one of each, call `PerformFly()`, see the difference. (Tomorrow's apply will extend this with `IQuackBehavior` per the book's order.) Save to `progress/2026-04-30/working-folder/design-patterns/simuduck/` (split into multiple files; conventional C# layout is one type per file). Reference: `software-engineering/csharp-and-dotnet/04-interfaces-and-abstract-classes/demo.cs` has a working SimUDuck.

**Prove it — answer in the Answers + explanations section at the bottom:**
1. What specifically broke when they tried to put `fly()` on the Duck base class? What did inheritance promise it couldn't deliver?
2. Name a Strategy hiding in code you've worked with under a different name (common aliases: "policy", "handler", "provider", "selector", "comparator"). What's the strategy interface, and what concrete strategies exist?

---

## DevOps — Level 2 (Intermediate — Composable infrastructure)

**Topic:** `Bicep modules + parameters` (#1 in Level 2) — step: `read`

> State file is starting at Level 2 — appropriate for a learner already comfortable with Level-1 fundamentals (deploying Azure resources, basic Docker, Bicep basics, GitHub Actions hello-world). Reset state.md to Level 1 row 1 if you want the foundations track instead.

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

> _Extra credit (optional — papers, talks, posts for going deeper):_
> - **The Twelve-Factor App** — Adam Wiggins (2011). Short web essay, foundational for any IaC/SaaS work. Section III ("Config") and section X ("Dev/prod parity") are particularly relevant to module-and-parameter design — they explain *why* parameters exist as a category. [12factor.net](https://12factor.net/)
> - **Azure Verified Modules (AVM)** — Microsoft's first-party Bicep module library. Read 2–3 modules end-to-end (e.g., `avm/res/storage/storage-account` or `avm/res/key-vault/vault`) to see how professional Bicep parameters and outputs are structured. The README of any AVM module is itself a teaching artifact. [aka.ms/avm](https://aka.ms/avm)

**Today:**
- [ ] **Step:** Read the Bicep *Modules* doc and the *Parameters and outputs* doc (~30–45 min total). Then start the MS Learn path *Structure your Bicep code for collaboration* (~60 min). Capture 3–5 takeaways in Notes including at least one **anti-pattern** you've personally seen (or now suspect you've written).
- [ ] **Apply (Bicep — devops tooling stays as-is):** Take a Storage Account Bicep you've already written (or write a quick one). Refactor into a module taking `name`, `location`, `sku`, `tags`. Call it from `main.bicep` to deploy two storage accounts (e.g., `dev` and `prod` tier). Add a `bicepconfig.json` with the linter at `error` for `no-hardcoded-location`. Save to `progress/2026-04-30/working-folder/devops/bicep-modules/` (`main.bicep`, `modules/storage.bicep`, `bicepconfig.json`). Tear down the deployed RG when done (`az group delete -n <name> --yes --no-wait`). (DevOps work stays in its native tools — Bicep, az CLI — not C#. Apply tasks switch to C# only for the other three sprint subjects.)

**Prove it — answer in the Answers + explanations section at the bottom:**
1. The Deep dive argues a parameter without two distinct callers using different values should probably be a constant. Look at one of your team's Bicep templates — pick a parameter that fails this test. What would you do instead, and why might the original author have added it?
2. The Deep dive frames modules as "functions, parameters as arguments, outputs as return values." Pick a non-Bicep system in your daily work that uses the same pattern (some module/function decomposition). What does Bicep's module system do *better* than that system, and what does it do *worse*?

---

## Your answers — attempt these BEFORE peeking at the model answers below

_All Prove-it questions consolidated. Write your own answer + reasoning for each. Don't scroll past this section yet — model answers + how-to-approach notes are below, and the learning compounds when you commit to your own answer first._

### Q1 — Agentic workflows

**Q:** Pick a tool you actually use — is it agent / chatbot / workflow by the README's "who decides what to do next" test? One sentence.

**Your answer:**

**Your reasoning:**

### Q2 — Agentic workflows

**Q:** The README says agents fail when "the tool set is too rich (paralysis) or too sparse (impossibility)." Give one concrete example of each.

**Your answer:**

**Your reasoning:**

### Q3 — Software architecture

**Q:** Pick a function you've written recently — name three reasons it might change. Is it really one concern or three?

**Your answer:**

**Your reasoning:**

### Q4 — Software architecture

**Q:** What's the equivalent of pastry / grill / dish stations for a typical "create an order" web feature? Name three stations and what each owns.

**Your answer:**

**Your reasoning:**

### Q5 — Design patterns

**Q:** What specifically broke when they tried to put `fly()` on the Duck base class? What did inheritance promise it couldn't deliver?

**Your answer:**

**Your reasoning:**

### Q6 — Design patterns

**Q:** Name a Strategy hiding in code you've worked with under a different name (common aliases: "policy", "handler", "provider", "selector", "comparator"). What's the strategy interface, and what concrete strategies exist?

**Your answer:**

**Your reasoning:**

### Q7 — DevOps

**Q:** The Deep dive argues a parameter without two distinct callers using different values should probably be a constant. Look at one of your team's Bicep templates — pick a parameter that fails this test. What would you do instead, and why might the original author have added it?

**Your answer:**

**Your reasoning:**

### Q8 — DevOps

**Q:** The Deep dive frames modules as "functions, parameters as arguments, outputs as return values." Pick a non-Bicep system in your daily work that uses the same pattern (some module/function decomposition). What does Bicep's module system do *better* than that system, and what does it do *worse*?

**Your answer:**

**Your reasoning:**

---

## Model answers + how to approach — peek after attempting

_Model answer (often a worked example), why it's the answer (grounding in mechanics), and how to approach this kind of question (the transferable reasoning move). The "how to approach" notes are the most valuable — they're patterns you can apply to similar future questions._

### Q1 — Agentic workflows

**Q:** Pick a tool you actually use — is it agent / chatbot / workflow by the README's "who decides what to do next" test? One sentence.

**Model answer:** Claude Code (this tool) is an **agent** — when given a goal, the LLM picks each next action (Read this, Edit that, run Bash) at runtime; I don't pre-script the sequence. By contrast, a CI pipeline is a **workflow** (steps fixed at design time) and ChatGPT-the-website is a **chatbot** (LLM responds, but I decide what to do with the response).

**Why this is the answer:** The test isn't whether an LLM is involved — it's whether the LLM picks the next move at runtime. Claude Code's loop hands control back to the LLM after every tool result, asking "what now?" CI pipelines also receive results, but they consult a YAML file written months ago, not a model. ChatGPT receives my message and replies, but the next *action* is mine, not the model's.

**How to approach this kind of question:** When evaluating any tool against this taxonomy, **ignore whether an LLM is involved** — many systems have LLMs in different structural roles. Ask instead: at runtime, who picks the next move? If a human → chatbot. If a developer at design time → workflow. If a model at runtime → agent. Watch for the trap of equating "uses AI" with "agent" — that's marketing language, not architecture.

### Q2 — Agentic workflows

**Q:** The README says agents fail when "the tool set is too rich (paralysis) or too sparse (impossibility)." Give one concrete example of each.

**Model answer:** **Too rich:** an agent given 50 tools (search, edit, deploy, message, schedule, browse, calendar, ticket, ...) for "fix this typo" often picks the wrong one or chains them unnecessarily — opening Slack to ask the author about the typo instead of just editing the file. **Too sparse:** an agent given only `Read` but asked to "commit a fix" literally cannot complete the task, no matter how good the LLM is.

**Why this is the answer:** Tool selection is part of the LLM's reasoning load — every available tool is in context every turn. With too many, the model burns tokens deliberating and frequently picks suboptimal combinations. With too few, capability is gated by the toolbox regardless of model quality. Right-sizing is a design decision; "more tools" is rarely the right answer.

**How to approach this kind of question:** When designing an agent's toolbox, ask **"what's the minimum set of tools that lets the agent complete its goals?"** Then add one only when a real failure mode justifies it. The default mistake is adding tools defensively ("just in case the agent needs to..."), which expands the deliberation surface for no gain. The opposite mistake — withholding necessary tools — is rarer but easy to spot when you watch the agent's trajectory: it'll loop trying to solve the unsolvable.

### Q3 — Software architecture

**Q:** Pick a function you've written recently — name three reasons it might change. Is it really one concern or three?

**Model answer:** Take a typical `submitOrder(order)`: (a) tax calculation rules change (business logic), (b) payment provider integration changes (external dependency), (c) the confirmation email template changes (notification format). Three independent reasons → three concerns hiding in one function.

**Why this is the answer:** None of those three changes should require the others to be touched. When all three live in `submitOrder`, a tax-rule change forces re-testing payment and notification paths, which makes you cautious, which slows everything down. Splitting into `validateAndPriceOrder` + `chargePayment` + `sendConfirmation` lets each evolve independently — and `submitOrder` becomes a thin orchestrator that's easy to read.

**How to approach this kind of question:** Apply the **"who would file the bug?"** test. For each potential change, ask which team or stakeholder would request it. If three different stakeholders (finance/tax, payments, marketing/comms) request three different changes, the function is doing three jobs. The number of reasons-to-change a piece of code has is a proxy for the number of concerns it owns; one concern = one reason = one stakeholder, ideally.

### Q4 — Software architecture

**Q:** What's the equivalent of pastry / grill / dish stations for a typical "create an order" web feature? Name three stations and what each owns.

**Model answer:** **(1) Validation** — does this order shape look right? Pure logic, no I/O (the prep cook). **(2) Persistence** — write order to DB, return the order ID; wraps the database (the grill, doing the heavy I/O work). **(3) Notification** — send confirmation email; wraps the email service (the dish station, the final hand-off to the customer).

**Why this is the answer:** Each station has one job and one external dependency. If the email provider goes down, validation and persistence still work; if the DB schema changes, validation logic doesn't care; if a new field is added to the order shape, only validation has to know first. The orchestrator reads top-to-bottom: validate → persist → notify. Failures of any one station are localized and recoverable, like a slammed pastry station not bringing down the grill.

**How to approach this kind of question:** When decomposing a feature into stations, **trace the failure modes**. Ask "if X breaks, what should still work?" If the answer is "everything else," then X belongs in its own station. The kitchen analogy is good because each station has its own equipment, its own staff, and its own crisis pattern — software components should too. A station with no clear failure-isolation answer probably isn't a station; it's just code you split because a principle told you to.

### Q5 — Design patterns

**Q:** What specifically broke when they tried to put `fly()` on the Duck base class? What did inheritance promise it couldn't deliver?

**Model answer:** Adding `fly()` to base `Duck` made *every* Duck fly — including `RubberDuck` (which shouldn't fly) and `DecoyDuck` (which can't). The "fix" of overriding `fly()` to do nothing on each non-flying subclass spreads the silently-do-nothing rule everywhere, is repetitive, and is easy to forget when adding the next duck type — `MountainDuck` will inherit a default `fly()` that's wrong for it too.

**Why this is the answer:** Inheritance promises code reuse via "is-a" relationships, but flying isn't an is-a property of all ducks — it's a behavior that **varies**. Encoding varying behavior in the type hierarchy means every variation becomes a hierarchy decision, and behaviors don't compose (a `JetSkiDuck` that flies AND dives can't easily inherit both). Strategy fixes this by making fly behavior a swappable composed object: ducks have-a `FlyBehavior` rather than is-a `FlyingDuck`.

**How to approach this kind of question:** When evaluating an inheritance hierarchy, ask **"is this behavior an essential property of every subclass, or does it vary?"** If it varies, inheritance is the wrong tool — you'll end up with overrides-that-suppress, which is a code smell signaling that the hierarchy doesn't reflect reality. The general move: when a behavior varies independently of the type, lift it out into a composed object the type holds. This is the "encapsulate what varies" principle, and it's the template for almost every GoF pattern that follows.

### Q6 — Design patterns

**Q:** Name a Strategy hiding in code you've worked with under a different name (common aliases: "policy", "handler", "provider", "selector", "comparator"). What's the strategy interface, and what concrete strategies exist?

**Model answer:** An auth **provider**: many codebases have a `LoginProvider` interface with a single `authenticate(credentials) -> Session` method, implemented concretely by `EmailPasswordProvider`, `GoogleSSOProvider`, `SAMLProvider`, `MagicLinkProvider`. The auth controller holds a reference to the configured provider (chosen per-tenant or per-environment) and delegates. Different name, exact Strategy structure.

**Why this is the answer:** Real codebases rarely use the GoF name "Strategy" — they use domain words. Watch for three signals: (1) an interface with a single (or very narrow) verb-shaped method, (2) multiple concrete implementations with totally different mechanics, and (3) a client object that holds one of them and delegates. When all three are present, you're looking at Strategy regardless of what it's called.

**How to approach this kind of question:** When pattern-spotting in real code, **ignore the names and look at the structure**. Names are domain-driven; structure is pattern-driven. Three useful structural signals: a thin interface, multiple wildly-different implementations, and a client that delegates rather than implements. Develop the reflex of mentally translating local domain names ("policy", "handler", "provider") into the GoF vocabulary so you can communicate at design speed across teams that name things differently.

### Q7 — DevOps

**Q:** The Deep dive argues a parameter without two distinct callers using different values should probably be a constant. Look at one of your team's Bicep templates — pick a parameter that fails this test. What would you do instead, and why might the original author have added it?

**Model answer:** Common offender: `param skuName string = 'Standard_LRS'` on a Storage Account module where every caller across dev, staging, and prod uses the default. Fix: replace with a literal `sku: { name: 'Standard_LRS' }` inside the module, or make it a `var` with a comment explaining the choice. The original author probably added it "in case we ever need different SKUs per env" — speculative flexibility before a real second caller existed.

**Why this is the answer:** Parameters carry visible cost: every caller has to know about them, every refactor has to consider them, every reader has to wonder if they vary in practice. Speculative parameters pay that cost for nothing. The cheap thing to do is *add the parameter when the second caller actually appears*, which is fast (a one-line module change). "Just in case" parameter-creep is a common Bicep code-review finding.

**How to approach this kind of question:** When evaluating any abstraction (parameter, interface, configuration option), apply **"rule of three"**: don't abstract until you have three concrete examples that genuinely vary. With one concrete example, an abstraction is premature; with two, it's a coin flip; with three, the shape of variation is clear enough to abstract well. The instinct to add flexibility ahead of need feels responsible but is one of the most common sources of long-term complexity. The senior move is to leave it concrete and refactor when forced.

### Q8 — DevOps

**Q:** The Deep dive frames modules as "functions, parameters as arguments, outputs as return values." Pick a non-Bicep system in your daily work that uses the same pattern (some module/function decomposition). What does Bicep's module system do *better* than that system, and what does it do *worse*?

**Model answer:** Closest analogue: **TypeScript modules with typed exports**, or React components with props + render output. **Bicep does better:** outputs are deployment-time-resolved, so dependency ordering between modules is automatic; the deployment engine handles idempotency without you writing retry/check-existence logic. **Bicep does worse:** there's no real higher-order composition — you can't pass a module to a module, can't build module factories, debugging is harder than reading a stack trace, the type system is far less expressive (no generics, no discriminated unions), and module reuse across repos requires a registry rather than `npm install`.

**Why this is the answer:** The structural similarity (named inputs, named outputs, encapsulated body) is real, but the **runtime is fundamentally different**. TS/React modules execute in a single process where you control control-flow; Bicep modules compile to nested ARM deployments where the deployment engine does orchestration. That trade gives you idempotency for free but loses expressiveness. Knowing this trade is what makes you write Bicep that "feels right" for the deployment engine instead of fighting it.

**How to approach this kind of question:** When comparing tools that share a surface-level abstraction, **separate the syntax from the runtime**. Same shape (functions / inputs / outputs) doesn't mean same semantics. Bicep modules and TS functions look alike syntactically and have completely different execution models — declarative-deployed-by-engine vs imperative-executed-by-process. The senior move is to design *with* the runtime, not against it: stop forcing patterns that work in one runtime onto a tool whose runtime makes those patterns expensive or impossible.
