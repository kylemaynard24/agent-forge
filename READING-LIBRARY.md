# Reading Library

This file is the companion bookshelf for the repository.

`agent-forge` is already the practice curriculum. This guide answers the next question: **what should I read if I want deeper theory, stronger judgment, and better long-term mastery behind each subject in the repo?**

No book list can fully "master" every topic for you. Mastery comes from the loop the repo is already built around: read, run the demo, do the homework, build the project, then explain the trade-off back in your own words. The books below are meant to deepen that loop, not replace it.

## How to use this library well

1. For each repo section, start with **one foundation book**, not three at once.
2. Add **one deeper technical book** once the repo material has made the vocabulary familiar.
3. Keep **one execution-oriented book** in parallel at all times so your reading stays grounded in delivery, failure, and communication.
4. Revisit the book **after** you finish a project or capstone in the matching repo section. The second pass is usually where the real understanding lands.

## Repository-wide backbone shelf

If you wanted a small "own these first" shelf for the whole repo, this would be a strong start:

1. **The Pragmatic Programmer** — Andrew Hunt and David Thomas
2. **A Philosophy of Software Design** — John Ousterhout
3. **Designing Data-Intensive Applications** — Martin Kleppmann
4. **Release It!** — Michael T. Nygard
5. **Staff Engineer** — Will Larson
6. **Designing Machine Learning Systems** — Chip Huyen

Those six will not cover every topic, but they create a strong default mental model for design, trade-offs, production reality, technical leadership, and modern AI systems.

## Subject-by-subject library

### `software-engineering/super-beginner-javascript/`

- **Eloquent JavaScript** — Marijn Haverbeke  
  Best first serious JavaScript book for learners who want concepts and code together.
- **You Don't Know JS Yet** — Kyle Simpson  
  Best follow-up once syntax stops being scary and you want to understand scope, objects, and the language model more deeply.
- **JavaScript: The Definitive Guide** — David Flanagan  
  Best long-term reference once you are building beyond exercises.
- **Exercises for Programmers** — Brian P. Hogan  
  Good companion if you want more deliberate programming reps instead of only reading.

### `software-engineering/design-patterns/`

- **Head First Design Patterns** — Eric Freeman and Elisabeth Robson  
  Best first pass if you want the patterns to feel usable instead of ceremonial.
- **Design Patterns: Elements of Reusable Object-Oriented Software** — Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides  
  The canonical source. Read it after the repo material, not before.
- **Refactoring to Patterns** — Joshua Kerievsky  
  Excellent for learning how patterns emerge from code instead of appearing from theory.
- **A Philosophy of Software Design** — John Ousterhout  
  Pairs well with this section because it helps you see when a pattern is helping and when it is just extra machinery.

### `software-engineering/architecture/01-fundamentals/` and `02-principles/`

- **A Philosophy of Software Design** — John Ousterhout  
  Probably the best short book for separation of concerns, interface design, and complexity control.
- **Clean Architecture** — Robert C. Martin  
  Useful for principles, dependency direction, and component thinking, even if you disagree with parts of it.
- **The Pragmatic Programmer** — Andrew Hunt and David Thomas  
  Good for engineering habits, local design judgment, and restraint.

### `software-engineering/architecture/03-component-architecture/`

- **Domain-Driven Design** — Eric Evans  
  The foundational text for bounded contexts, ubiquitous language, and modeling complex domains.
- **Implementing Domain-Driven Design** — Vaughn Vernon  
  More practical than Evans once you want to turn the ideas into real designs.
- **Patterns of Enterprise Application Architecture** — Martin Fowler  
  Strong companion for repositories, layers, service boundaries, and enterprise application structure.

### `software-engineering/architecture/04-system-architecture/`

- **Fundamentals of Software Architecture** — Mark Richards and Neal Ford  
  Great overview book for architectural styles, trade-offs, and reasoning.
- **Software Architecture: The Hard Parts** — Neal Ford, Mark Richards, Pramod Sadalage, and Zhamak Dehghani  
  Excellent once the "easy diagram phase" is over and the trade-offs get painful.
- **Monolith to Microservices** — Sam Newman  
  Strong corrective for teams who want distributed systems before they need them.

### `software-engineering/architecture/05-communication/`

- **Designing Data-Intensive Applications** — Martin Kleppmann  
  The best book in the repo for communication, consistency, messaging, and system behavior under load.
- **Enterprise Integration Patterns** — Gregor Hohpe and Bobby Woolf  
  Still one of the best vocabularies for messaging and coordination design.
- **Building Microservices** — Sam Newman  
  Useful for practical communication boundaries, service contracts, and operational consequences.

### `software-engineering/architecture/06-data/`

- **Designing Data-Intensive Applications** — Martin Kleppmann  
  The anchor text for replication, partitioning, streams, logs, and data trade-offs.
- **Database Internals** — Alex Petrov  
  Great deeper read if you want to understand storage engines and why databases behave the way they do.
- **Streaming Systems** — Tyler Akidau, Slava Chernyak, and Reuven Lax  
  Strong for event pipelines, stream processing, and thinking beyond CRUD.

### `software-engineering/architecture/07-resilience-and-scale/` and `08-cross-cutting/`

- **Release It!** — Michael T. Nygard  
  One of the highest-value books in the entire repo for production realism.
- **Site Reliability Engineering** — Betsy Beyer, Chris Jones, Jennifer Petoff, and Niall Richard Murphy  
  Essential for reliability, observability, failure budgets, and operational thinking.
- **Distributed Systems Observability** — Cindy Sridharan  
  Best deeper book for learning how to see real systems instead of just instrumenting them superficially.

### `software-engineering/advanced-engineering/01-debugging-and-diagnostics/`

- **Debugging: The 9 Indispensable Rules for Finding Even the Most Elusive Software and Hardware Problems** — David J. Agans  
  Short, memorable, and extremely reusable.
- **Why Programs Fail** — Andreas Zeller  
  Stronger theory for debugging as hypothesis narrowing rather than random poking.
- **The Art of Debugging with GDB, DDD, and Eclipse** — Norman Matloff and Peter Jay Salzman  
  Useful when you want more concrete debugging technique, not just principles.

### `software-engineering/advanced-engineering/02-testing-and-verification/`

- **Unit Testing** — Vladimir Khorikov  
  Excellent for test boundaries, value, and what good unit tests are actually for.
- **xUnit Test Patterns** — Gerard Meszaros  
  The large reference work for test smells, fixtures, and testing vocabulary.
- **Growing Object-Oriented Software, Guided by Tests** — Steve Freeman and Nat Pryce  
  One of the best books for the relationship between design and tests.

### `software-engineering/advanced-engineering/03-performance-and-capacity/`

- **Systems Performance** — Brendan Gregg  
  The best general book for performance diagnosis across the stack.
- **BPF Performance Tools** — Brendan Gregg  
  Great second book if you want modern Linux performance instrumentation depth.
- **The Art of Capacity Planning** — John Allspaw  
  Strong companion for thinking about load, headroom, and scaling as engineering decisions instead of panic responses.

### `software-engineering/advanced-engineering/04-security-and-trust-boundaries/`

- **Threat Modeling** — Adam Shostack  
  Best first book for bringing security into design instead of treating it as an afterthought.
- **Alice and Bob Learn Application Security** — Tanya Janca  
  Practical and readable introduction to application security habits.
- **Security Engineering** — Ross Anderson  
  Deep, broad, and worth keeping for long-term reference.
- **The Web Application Hacker's Handbook** — Dafydd Stuttard and Marcus Pinto  
  Best offensive companion if your work touches web apps and you want to think like an attacker.

### `software-engineering/advanced-engineering/05-legacy-rescue-and-refactoring/`

- **Working Effectively with Legacy Code** — Michael Feathers  
  Mandatory reading for this section.
- **Refactoring** — Martin Fowler  
  The core book for disciplined code change.
- **Your Code as a Crime Scene** — Adam Tornhill  
  Strong for seeing legacy systems through behavioral and sociotechnical signals instead of only code aesthetics.
- **Monolith to Microservices** — Sam Newman  
  Useful here too because it teaches incremental change better than rewrite fantasies.

### `software-engineering/advanced-engineering/06-incident-response-and-engineering-execution/`

- **Site Reliability Engineering** — Betsy Beyer, Chris Jones, Jennifer Petoff, and Niall Richard Murphy  
  Best foundation for operations, reliability, and incident response.
- **The Site Reliability Workbook** — Betsy Beyer, Niall Richard Murphy, David K. Rensin, Kent Kawahara, and Stephen Thorne  
  More hands-on than the original SRE book and very usable for practice.
- **Staff Engineer** — Will Larson  
  Strong for technical leadership, design reviews, influence, and cross-team execution.
- **Docs for Developers** — Jared Bhatti, Zachary Sarah Corleissen, Jen Lambourne, and David Nunez  
  Good companion for the repo's work on ADRs, RFCs, design intent docs, runbooks, and project writing.

### `agentic-workflows/01-foundations/`

- **Hands-On Large Language Models** — Jay Alammar and Maarten Grootendorst  
  Best broad first book for understanding how modern LLM systems behave and how to work with them.
- **Natural Language Processing with Transformers** — Lewis Tunstall, Leandro von Werra, and Thomas Wolf  
  Stronger technical depth for transformer-based systems and practical experimentation.
- **Prompt Engineering for Generative AI** — James Phoenix and Mike Taylor  
  Good practical bridge from language models to useful prompting habits.

### `agentic-workflows/02-single-agent-design/`

- **Prompt Engineering for Generative AI** — James Phoenix and Mike Taylor  
  Best direct book match for prompts, structure, and output discipline.
- **Designing Machine Learning Systems** — Chip Huyen  
  Useful because good single-agent design quickly becomes a systems problem.
- **Machine Learning Design Patterns** — Valliappa Lakshmanan, Sara Robinson, and Michael Munn  
  Not agent-specific, but extremely valuable for operational design thinking.

### `agentic-workflows/03-claude-code-primitives/`

There is no book that maps perfectly to slash commands, skills, hooks, MCP servers, and project-scoped agent configuration. For this stage, the repo's own docs and the official Claude Code documentation should be the primary source.

Still, these books strengthen the surrounding judgment:

- **The Pragmatic Programmer** — Andrew Hunt and David Thomas  
  Great for automation, tool-making, and local leverage.
- **Docs for Developers** — Jared Bhatti, Zachary Sarah Corleissen, Jen Lambourne, and David Nunez  
  Helpful for writing clearer command docs, agent docs, and usage notes.
- **Staff Engineer** — Will Larson  
  Good for understanding when a reusable engineering artifact is actually worth creating.

### `agentic-workflows/04-multi-agent-patterns/`

- **Designing Machine Learning Systems** — Chip Huyen  
  Strong systems framing for any multi-component AI workflow.
- **Hands-On Large Language Models** — Jay Alammar and Maarten Grootendorst  
  Good modern foundation for the building blocks that multi-agent systems rely on.
- **Multiagent Systems: Algorithmic, Game-Theoretic, and Logical Foundations** — Yoav Shoham and Kevin Leyton-Brown  
  More theoretical and older than the LLM era, but still valuable for coordination and multi-agent thinking.

### `agentic-workflows/05-reliability-and-ops/`

- **Designing Machine Learning Systems** — Chip Huyen  
  The best general book in this library for AI system reliability and deployment thinking.
- **Practical MLOps** — Noah Gift and Alfredo Deza  
  Good for operational discipline, pipelines, and production habits.
- **Building Machine Learning Powered Applications** — Emmanuel Ameisen  
  Helpful for evaluation, iteration, feedback loops, and productizing intelligent systems.
- **Site Reliability Engineering** — Betsy Beyer, Chris Jones, Jennifer Petoff, and Niall Richard Murphy  
  Still one of the best books for reliability thinking even outside classical infrastructure.

### `agentic-workflows/06-building-for-real/`

- **Practical MLOps** — Noah Gift and Alfredo Deza  
  Very useful when the repo shifts from demos to deployable systems.
- **Designing Machine Learning Systems** — Chip Huyen  
  Remains the strongest systems-level anchor for real production AI work.
- **Machine Learning Engineering** — Andriy Burkov  
  Strong compact book for production framing and engineering decision-making.
- **Designing Data-Intensive Applications** — Martin Kleppmann  
  Not an AI book, but critical once your agents depend on queues, data flows, logs, and distributed state.

### `docs/` and `examples/`

These folders are mostly about **Claude Code concepts and runnable repo-scoped tooling**, so books are supportive rather than primary.

Use the repo docs and examples first, then pair them with:

- **The Pragmatic Programmer** — Andrew Hunt and David Thomas
- **Docs for Developers** — Jared Bhatti, Zachary Sarah Corleissen, Jen Lambourne, and David Nunez
- **Staff Engineer** — Will Larson
- **Designing Machine Learning Systems** — Chip Huyen

## If you want a realistic reading order

If you try to read everything at once, you will stall. A stronger sequence is:

1. **The Pragmatic Programmer**
2. **Eloquent JavaScript** or **Head First Design Patterns**, depending on where you are starting
3. **A Philosophy of Software Design**
4. **Designing Data-Intensive Applications**
5. **Release It!**
6. **Domain-Driven Design** or **Fundamentals of Software Architecture**
7. **Site Reliability Engineering**
8. **Designing Machine Learning Systems**
9. The deeper books for whichever repo path becomes your main specialization

## Final rule

For each book, ask three questions:

1. What problem pressure is this book helping me notice?
2. What bad trade-off is it warning me away from?
3. What can I build in this repo right now to make the idea real?

If you keep answering those three questions, the library will compound instead of turning into shelf decoration.
