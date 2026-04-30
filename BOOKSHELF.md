# Bookshelf

A curated reference library structured around the four daily-tasks sprint subjects (agentic workflows, software architecture, design patterns, devops) plus the `advanced-engineering` tracks. Skips beginner JavaScript intentionally — assumes the reader is already programming professionally.

> **Companion to [`READING-LIBRARY.md`](READING-LIBRARY.md)**, not a replacement. The other file is organized per repo subdirectory and covers everything including the JavaScript intro. This file is opinionated and curated — fewer titles per subject, with reading levels, specific picks, and a wider mix of references (papers, conference talks, official docs, free online texts).

## How this is organized

Each subject section has:

- 🌱 **Foundation** — builds the vocabulary. Start here if you're new to the subject.
- 🌿 **Intermediate** — tests the vocabulary against real systems. Pick up after the foundation has clicked.
- 🌳 **Depth** — earns its time *after* you've shipped something using the concept. Premature reading wastes the book.
- 📄 **Papers / canonical docs** — short, high-signal reading.
- 🎤 **Talks / videos** — when the speaker's framing teaches faster than a book.
- 🆓 **Free online** — full text available online, gratis.

For each entry, the why-this-one note matters as much as the title. Don't read by title alone.

## A reading rhythm that actually works

Most engineers stall on book lists because they try to read three at once. A stronger pattern:

1. **One foundation book per subject, in parallel.** Four foundation books × 30 min/week each = ~2 hours/week, sustainable for a year.
2. **Promote one to intermediate** when its foundation feels obvious in conversation. Don't promote them all at once.
3. **Read depth books AFTER a shipped project** in that subject. The second pass is when the real understanding lands.
4. **Papers and talks are espresso shots** — read/watch one when you're stuck on a specific question, not for general study.

> The books below are the *bookshelf*. Reading them is not the curriculum. The curriculum is the daily-tasks loop in this repo. Books deepen what the loop teaches; they don't substitute.

---

## 1. Agentic workflows

The newest of the four subjects, so the literature is uneven. Lean on official Anthropic + paper reading more here than for the others.

### 🌱 Foundation

- **[Anthropic — *Building Effective Agents*](https://www.anthropic.com/engineering/building-effective-agents)** (2024, free, ~30 min read)
  Short, opinionated, and the best single starting point. Defines what an agent actually is, distinguishes it from workflows and chatbots, and walks through the patterns Anthropic actually uses. Read this before any book.
- **Hands-On Large Language Models** — Jay Alammar and Maarten Grootendorst (2024)
  The best current introduction to how modern LLM systems behave. Alammar's diagrams (he's the *Illustrated Transformer* author) make the mechanics legible. Skip the chapters on training; focus on inference, prompting, RAG, and tool use.

### 🌿 Intermediate

- **Designing Machine Learning Systems** — Chip Huyen (2022)
  Not agent-specific but the best general book for thinking about AI systems in production: monitoring, drift, evaluation, infrastructure. Most agentic engineering becomes systems engineering by month 3.
- **Prompt Engineering for Generative AI** — James Phoenix and Mike Taylor (2024)
  Practical handbook. Useful when you're stuck on the gap between "the model can do X" and "I can reliably get the model to do X."

### 🌳 Depth

- **Designing Data-Intensive Applications** — Martin Kleppmann (2017)
  Yes, the same DDIA. Once your agent uses queues, distributed state, retries, and observability, this is the book that explains *why* the patterns Anthropic recommends are the ones that work. Read after you've shipped a stateful agent.

### 📄 Papers

- **ReAct: Synergizing Reasoning and Acting in Language Models** — Yao et al. (2022). The original "thought + action + observation" loop. The vocabulary you'll see everywhere.
- **Chain-of-Thought Prompting Elicits Reasoning in Large Language Models** — Wei et al. (2022). Foundational; essentially mandatory reading.
- **Reflexion: Language Agents with Verbal Reinforcement Learning** — Shinn et al. (2023). On agents critiquing their own output to improve.
- **Constitutional AI** — Bai et al. (2022, Anthropic). For thinking about guardrails and value alignment.
- **Toolformer** — Schick et al. (2023). On models learning to use tools.

### 🆓 Free / official docs

- **[Anthropic Documentation](https://docs.anthropic.com/)** — tool use, prompt caching, citations, batch API. Read the *Tool Use* and *Prompt Caching* sections start to finish before doing serious agent work.
- **[Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)** — runnable examples; the *Tool Use* and *Misc/Building Agents* notebooks are particularly good.

---

## 2. Software architecture

The most mature literature of the four subjects. Heavy emphasis on judgment over rules.

### 🌱 Foundation

- **A Philosophy of Software Design** — John Ousterhout (2nd ed, 2021)
  Short, opinionated, judgment-dense. The single most efficient book on software design. Read it twice — once at the foundation level, once after a year of practice. The second read lands differently.
- **Fundamentals of Software Architecture** — Mark Richards and Neal Ford (2020)
  The clearest survey of architectural styles (layered, microservices, event-driven, microkernel, space-based, service-oriented) with honest trade-offs. Best book for "which architecture should I pick?" thinking.

### 🌿 Intermediate

- **Software Architecture: The Hard Parts** — Ford, Richards, Sadalage, Dehghani (2021)
  Sequel to *Fundamentals*. Focuses on the genuinely hard problems: decomposition, distributed transactions, contracts, data ownership. Chapter 5 (data ownership) alone is worth the book.
- **Domain-Driven Design** — Eric Evans (2003) — OR — **Implementing Domain-Driven Design** — Vaughn Vernon (2013)
  Evans is canonical but dense. Vernon is more practical and code-forward. Read one, not both. DDD's vocabulary (entity, aggregate, value object, bounded context) is the most reusable in this subject.
- **Patterns of Enterprise Application Architecture** — Martin Fowler (2002)
  Pre-microservices, but the patterns (Repository, Unit of Work, Identity Map, Service Layer, Domain Model) still describe what every modern web framework re-invents.

### 🌳 Depth

- **Designing Data-Intensive Applications** — Martin Kleppmann (2017)
  The canonical modern text on systems-at-scale: storage, replication, partitioning, transactions, consensus, batch and stream processing. Heavy. Best read one chapter at a time over months — finish chapter 3 (storage engines) before deciding it's not for you.
- **Building Evolutionary Architectures** — Neal Ford, Rebecca Parsons, Patrick Kua (2nd ed, 2022)
  How architectures change over time, and how to design so they CAN change. Introduces fitness functions for architecture — measurable invariants you commit to.
- **Release It!** — Michael T. Nygard (2nd ed, 2018)
  Production realities: what kills systems, what stability patterns prevent it (circuit breakers, bulkheads, timeouts, the "cascading failure" cookbook). Should be required reading after your first prod outage.

### 📄 Papers

- **Out of the Tar Pit** — Ben Moseley & Peter Marks (2006). On essential vs accidental complexity. ~30 pages, changes how you see codebases.
- **Dynamo: Amazon's Highly Available Key-value Store** — DeCandia et al. (2007). Foundational distributed-systems paper.
- **The Google File System** — Ghemawat, Gobioff, Leung (2003). For understanding why distributed storage is shaped the way it is.

### 🎤 Talks

- **Sam Newman — *Microservices: When and Why?*** Often given at QCon / GOTO; YouTube has multiple versions. The right framing for "should we be microservices?"
- **Mark Richards — Software Architecture Monday** (his YouTube series). Bite-sized 5-15 min videos covering one concept each. Great supplement.
- **Martin Fowler — *Microservices*** (the original 2014 talk). Even if you've read his article, the talk version is worth watching.

---

## 3. Design patterns

A small literature with a few standout texts. The current sprint already centers on Head First.

### 🌱 Foundation

- **Head First Design Patterns** — Eric Freeman and Elisabeth Robson (2nd ed, 2020)
  The current sprint book. Best on-ramp; the wrong-design-first pedagogy is genuinely effective. The 2nd edition uses Java 8+ examples that translate cleanly to other languages.

### 🌿 Intermediate

- **Refactoring: Improving the Design of Existing Code** — Martin Fowler (2nd ed, 2018, JavaScript)
  Patterns viewed from the *opposite direction*: you don't apply a pattern, you refactor toward it when conditions justify it. The 2nd edition is in JavaScript, which is excellent for any reader using a dynamic language. Read after Head First.
- **Refactoring to Patterns** — Joshua Kerievsky (2004)
  How patterns *emerge* from real code rather than being imposed on it. Pairs perfectly with Fowler's *Refactoring*.

### 🌳 Depth

- **Design Patterns: Elements of Reusable Object-Oriented Software** — Gamma, Helm, Johnson, Vlissides (1994) — the "Gang of Four"
  The canonical original. C++ and Smalltalk examples will feel dated, but the pattern descriptions are precise in a way later books aren't. Read the patterns you've actually used, not all 23. The "Consequences" sections are gold.
- **Patterns of Enterprise Application Architecture** — Martin Fowler (2002)
  The architectural cousin to GoF: patterns at the level of layers, not classes. Read after you've shipped a non-trivial CRUD application.

### 📄 Papers

- **A Behavioral Notion of Subtyping** — Barbara Liskov & Jeannette Wing (1994). The actual academic source for the Liskov Substitution Principle. The "L" in SOLID. Dense but worth skimming once.
- **On the Criteria To Be Used in Decomposing Systems into Modules** — David Parnas (1972). The original "information hiding" paper. Probably the most-cited paper in software design history; a 6-page foundational read.
- **Mock Roles, not Objects** — Steve Freeman, Nat Pryce, Tim Mackinnon, Joe Walnes (2004). Reframes mocks as a *design* tool for discovering roles, not just a testing trick. Pairs well with Strategy and dependency-inversion thinking.

### 🎤 Talks / posts

- **Sandi Metz — *All the Little Things*** (RailsConf 2014, YouTube). Refactoring a real codebase live, applying multiple patterns. Watch even if you don't write Ruby.
- **Sandi Metz — *SOLID Object-Oriented Design*** (Gotham Ruby Conference, 2009). Probably the best 30-minute introduction to SOLID anywhere.
- **Sandi Metz — *Nothing is Something*** (RailsConf 2015, YouTube). On the Null Object pattern, polymorphism, and removing conditionals. The clearest argument for "patterns reduce decisions."
- **Kent Beck — *Test-Driven Development*** writing collected on his Substack and at tidyfirst.substack.com. His four rules of simple design and the "tidy first?" sequencing of refactoring is the meta-level pattern that makes the GoF patterns useful.

---

## 4. DevOps (Azure-focused)

The literature splits into culture/practice (DevOps as a movement) and technical (specific tools). Both matter; the cultural ones are sneakily the higher-leverage read.

### 🌱 Foundation

- **The Phoenix Project** — Gene Kim, Kevin Behr, George Spafford (2013)
  A novel about a struggling IT director. Sounds gimmicky; it's not. The single best primer on *why* DevOps practices exist — debt, WIP limits, the four types of work, the three ways. Read it on a flight; it's a fast 4-hour read.
- **The DevOps Handbook** — Gene Kim, Jez Humble, Patrick Debois, John Willis (2nd ed, 2021)
  The structured companion to *The Phoenix Project*. Practical patterns for continuous delivery, learning organizations, and value-stream management.

### 🌿 Intermediate

- **Accelerate** — Nicole Forsgren, Jez Humble, Gene Kim (2018)
  The research book. Establishes the four key DORA metrics (deployment frequency, lead time, change fail rate, MTTR) as the predictors of high-performing engineering organizations. Short, dense, citation-heavy.
- **Continuous Delivery** — Jez Humble, David Farley (2010)
  The canonical CD reference. Older than the modern stack but the deployment-pipeline thinking is unchanged. Chapters 5 (deployment pipeline anatomy), 6 (build & deploy scripting), and 8 (automated acceptance testing) are the load-bearing ones.
- **Docker Deep Dive** — Nigel Poulton (regularly updated, latest 2024)
  The clearest practical Docker book. Skip Docker tutorials online; this is faster and more accurate.

### 🌳 Depth

- **Site Reliability Engineering** — Beyer, Jones, Petoff, Murphy (Google, 2016) 🆓
  How Google runs production. The chapters on SLI/SLO/error budgets, on-call, postmortems, and overload management are essential. Free online at [sre.google](https://sre.google/sre-book/table-of-contents/). Don't try to read straight through — skip to the chapters relevant to a problem you're actively facing.
- **The Site Reliability Workbook** — Beyer et al. (Google, 2018) 🆓
  More practical companion to the SRE book. Includes Google's actual templates (postmortem, SLO documents). Free online.
- **Cloud Native Patterns** — Cornelia Davis (2019)
  Patterns specific to building for cloud-native runtimes (12-factor done right, idempotent deployments, configuration management, observability). Less Azure-specific but the patterns map directly.
- **Kubernetes Up & Running** — Burns, Beda, Hightower, Villalba (3rd ed, 2022)
  Only worth reading if AKS becomes a significant part of your work. For most, Container Apps and App Service are enough; revisit when AKS shows up.

### 📄 Papers / canonical docs

- **The Twelve-Factor App** — Adam Wiggins (2011) 🆓 ([12factor.net](https://12factor.net/))
  Short web essay, foundational for SaaS app design. ~30-minute read; permanently cited.
- **Microservices** — James Lewis & Martin Fowler (2014) 🆓 ([martinfowler.com/articles/microservices.html](https://martinfowler.com/articles/microservices.html))
  Functions as a paper despite being a blog post — the canonical definition of microservices, with honest trade-offs. Read before deciding "we should be microservices."
- **Principles of Chaos Engineering** — Netflix team (2015) 🆓 ([principlesofchaos.org](https://principlesofchaos.org/))
  Short manifesto; the foundational text for chaos engineering. Pairs with the SRE chapter on "Designing For Failure."
- **The Tail at Scale** — Jeffrey Dean & Luiz André Barroso (Google, 2013). On p99 latency in distributed systems. Explains why request hedging, micro-partitioning, and tied requests exist. Highly cited.
- **Borg, Omega, and Kubernetes** — Brendan Burns et al. (Google, 2016). The lineage of cluster management at Google, leading to Kubernetes. Useful even if you'll never run AKS.
- **[Microsoft Learn — Azure documentation root](https://learn.microsoft.com/en-us/azure/)**
  The single most-referenced Azure resource. Bookmark the *Bicep*, *Container Apps*, *Key Vault*, *Cost Management*, and *Well-Architected Framework* sections.
- **[Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/)** 🆓
  Microsoft's own opinionated framework on cost, reliability, security, performance, operational excellence. Read each pillar's overview at minimum.
- **[Azure Verified Modules (AVM)](https://aka.ms/avm)** 🆓
  Microsoft's effort at first-party Bicep modules with consistent contracts. Reading 2-3 of their modules end-to-end is a faster path to writing professional Bicep than any book.
- **[Docker docs](https://docs.docker.com/)** 🆓
  The official documentation is unusually high quality; treat it as primary reading.
- **[GitHub Actions docs](https://docs.github.com/en/actions)** 🆓
  Same. The *Security hardening* and *OIDC for cloud providers* sections are particularly good.

### 🎤 Talks

- **Jez Humble — *Continuous Delivery and the Theory of Constraints*** (multiple conference versions on YouTube). The "why" behind CD practices in 45 minutes.
- **Adrian Cockcroft — *Microservices, Cloud, and Continuous Deployment*** (YOW! 2014 and later). Cockcroft led Netflix's cloud migration; the talks are foundational for cloud-native thinking.

### 🆓 Free / specialized

- **Cloud FinOps** — J.R. Storment, Mike Fuller (2nd ed, 2023). 🆓 Free PDF from the FinOps Foundation. Cost management is undervalued; this is the single best book on it.
- **Building Secure & Reliable Systems** — Adkins, Beyer, Blankinship, Lewandowski, Oprea, Stubblefield (Google, 2020) 🆓. Companion to the SRE book on the security side. Free online.
- **Microsoft Learn — *AZ-104* (administrator) and *AZ-400* (DevOps engineer) study paths.** Even if you don't take the certs, the paths are well-structured.

---

## 5. Beyond the four — Advanced Engineering tracks

The repo's `software-engineering/advanced-engineering/` covers six tracks not in the daily sprint. These are domain skills that make engineers shine in production work — debugging, testing, performance, security, refactoring, incident response. Worth pulling in when a project hits one of them.

### 01 — Debugging and diagnostics

- **Debugging: The 9 Indispensable Rules for Finding Even the Most Elusive Software and Hardware Problems** — David J. Agans (2002). Short, ageless, opinionated. The "make it fail" and "quit thinking and look" rules alone justify the book.
- **Why Programs Fail: A Guide to Systematic Debugging** — Andreas Zeller (2nd ed, 2009). More academic; covers delta debugging and statistical debugging.
- **Systems Performance** — Brendan Gregg (2nd ed, 2020). Mostly perf, but the diagnostic methodology (USE, RED) is foundational for any production debugging.
- 📄 **Yesterday, My Program Worked. Today, It Does Not. Why?** — Andreas Zeller (1999). The original delta-debugging paper. Explains how to systematically narrow down which change broke a working program.
- 📄 **The Five Whys** — Sakichi Toyoda (Toyota production system). Not a paper but a technique; reading the [Wikipedia entry](https://en.wikipedia.org/wiki/Five_whys) plus 1-2 critiques of it produces a more nuanced root-cause-analysis practice than most engineers ever develop.

### 02 — Testing and verification

- **xUnit Test Patterns: Refactoring Test Code** — Gerard Meszaros (2007). The test-design canonical text. Long; treat as a reference, not a cover-to-cover read.
- **Working Effectively with Legacy Code** — Michael Feathers (2004). The single best book on adding tests to systems that don't have them. Senior engineers often define legacy code as "code without tests"; this is the book that fixes that.
- **Property-Based Testing with PropEr, Erlang, and Elixir** — Fred Hébert (2019). Even if you're not in Erlang/Elixir, the approach (think in invariants, generate inputs, shrink failures) translates to any language with a property-test library (fast-check for JS, Hypothesis for Python).
- 📄 **[QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs](https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf)** — Claessen & Hughes (2000). The original property-based testing paper.
- 📄 **An Empirical Study of the Reliability of UNIX Utilities** — Miller, Fredriksen, So (1990). The original fuzzing paper. Foundational; explains why "throw random nonsense at it" works as a test technique.
- 🎤 **Hillel Wayne — *Why Don't People Use Formal Methods?*** ([hillelwayne.com](https://www.hillelwayne.com)). Wayne's writing on the testing/specification spectrum (typed, property-based, specifications, formal methods) is the best modern thinking on "what kinds of bugs do which tools catch?"

### 03 — Performance and capacity

- **Systems Performance** — Brendan Gregg (2nd ed, 2020). The reference. Covers Linux performance soup-to-nuts. Use as a lookup, not a read-through.
- **BPF Performance Tools** — Brendan Gregg (2019). The follow-up; deep on eBPF observability. Niche but powerful for production diagnosis.
- **Database Internals** — Alex Petrov (2019). For understanding why a database query is slow at the storage-engine level.
- 📄 **The Tail at Scale** — Jeffrey Dean & Luiz André Barroso (Google, 2013). On p99 latency in distributed systems. (Also listed in DevOps; doubly relevant here.)
- 📄 **Latency Numbers Every Programmer Should Know** — Jeff Dean 🆓 ([gist by colin-scott](https://colin-scott.github.io/personal_website/research/interactive_latency.html)). Interactive scaled view. Memorize the orders of magnitude.
- 📄 **The USE Method** — Brendan Gregg ([brendangregg.com/usemethod.html](https://www.brendangregg.com/usemethod.html)) 🆓. A 30-minute read that gives you a checklist for diagnosing any performance problem: Utilization, Saturation, Errors per resource.

### 04 — Security and trust boundaries

- **Security Engineering** — Ross Anderson (3rd ed, 2020) 🆓 ([free PDF from author](https://www.cl.cam.ac.uk/~rja14/book.html)). Encyclopedic. Treat as a reference. The chapters on auth, cryptography, and economic incentives in security are particularly accessible.
- **Building Secure & Reliable Systems** — Google (2020) 🆓 (mentioned above). The shorter, more practical companion.
- **The Tangled Web** — Michał Zalewski (2011). Web security specifically. Aging in places but the threat-model thinking is timeless.
- 📄 **[OWASP Top 10](https://owasp.org/www-project-top-ten/)** 🆓. Mandatory reading regardless of role.

### 05 — Legacy rescue and refactoring

- **Working Effectively with Legacy Code** — Michael Feathers (2004). (Mentioned in testing too — it's the one book that bridges testing + legacy + refactoring.)
- **Refactoring** — Martin Fowler (2nd ed, 2018). The bible. The 2nd edition's JavaScript examples are accessible.
- **Refactoring to Patterns** — Joshua Kerievsky (2004). When refactoring naturally produces a pattern.
- 📄 **A Refactoring Tool for Smalltalk** — Don Roberts, John Brant, Ralph Johnson (1997). The original "refactoring browser" paper that defined what an automated refactoring tool can guarantee. Useful for understanding what your modern IDE refactorings can and can't safely do.
- 📄 **Tidy First?** — Kent Beck (essay series, 2023+, [tidyfirst.substack.com](https://tidyfirst.substack.com)) 🆓. Beck's modern reframing of refactoring sequencing — when to tidy *before* a feature change vs *after*. Shorter and more practical than his book on the same topic.

### 06 — Incident response and engineering execution

- **Site Reliability Engineering** — Google (2016) 🆓. Specifically chapters on incident response, on-call, and postmortems.
- **The Field Guide to Understanding 'Human Error'** — Sidney Dekker (3rd ed, 2014). Reframes "operator error" as systems-design failure. Changes how you write postmortems.
- **Drift into Failure** — Sidney Dekker (2011). Why complex systems drift toward catastrophic failure even with no individual mistakes. Slow read; pays off for senior production-engineering work.
- 📄 **[How Complex Systems Fail](https://how.complexsystems.fail/)** — Richard Cook 🆓. 2-page essay. Read it; reread it yearly.

---

## A backbone shelf — if you can only own a few

Six books that, owned together, give the strongest cross-subject default mental model:

1. **A Philosophy of Software Design** — Ousterhout (architecture / design judgment)
2. **Designing Data-Intensive Applications** — Kleppmann (systems / data)
3. **Refactoring** (2nd ed, JavaScript) — Fowler (patterns / code quality)
4. **Site Reliability Engineering** — Google 🆓 (devops / production)
5. **Accelerate** — Forsgren/Humble/Kim (devops / measurement)
6. **Hands-On Large Language Models** — Alammar/Grootendorst (agentic / LLM systems)

If a seventh: *The Pragmatic Programmer* (20th anniversary ed, 2019) — Hunt & Thomas. Cross-cutting habits.

---

## Three questions to ask of every book

Borrowed from `READING-LIBRARY.md` because they're worth repeating:

1. What problem pressure is this book helping me notice?
2. What bad trade-off is it warning me away from?
3. What can I build right now to make the idea real?

If you keep answering those three, the bookshelf compounds. If you don't, it becomes furniture.
