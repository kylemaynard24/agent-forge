# Games — board-game-inspired 3D project ideas

A creative sandbox separate from the `daily-tasks` learning sprint. The premise: take a popular board game, translate it into a 3D web-based experience, and use the build as a real capstone for the architecture + devops + design-patterns + agentic-workflows learning happening in parallel.

Each idea below is a substantive write-up: concept, why this game, core mechanics, suggested tech stack (Azure-native where possible — fits the devops sprint), scope phases, trade-offs, and connections back to the four learning tracks.

## Why board games

Board games are **already game-design-balanced**. Someone else did the playtesting; the rules are public; you skip 80% of design work and spend your time on the parts that actually exercise software-engineering skill: state modeling, networking, rendering, AI opponents, deployment. They're also **scoped** — a board game has a clear endpoint (someone wins) and a finite ruleset, so the project doesn't open-endedly grow.

## The three ideas

| File | Game | Scope | Primary tech focus | Why this one |
|---|---|---|---|---|
| [catan-3d.md](catan-3d.md) | Settlers of Catan | Medium (3-6 months part-time) | Multiplayer state, hex grid rendering, AI opponents | The "do the classic well" pick. Well-known rules, mainstream appeal, rich state management. |
| [pandemic-3d.md](pandemic-3d.md) | Pandemic | Large (6-12 months) | World-map rendering, AI threat simulation, cooperative multiplayer | Cooperative gameplay (rare in 3D games). The disease IS an agent — fits the agentic-workflows angle directly. |
| [codenames-llm.md](codenames-llm.md) | Codenames + LLM spymaster | Small (4-8 weeks) | LLM agent for clue generation, minimal 3D | Quickest to ship. The novelty is the AI spymaster — uses your `claude-api` skill directly. |

## Suggested order

1. **Codenames LLM first** (small, ships fast, exercises the Claude API + a simple deploy). Builds confidence and gives you a finished thing.
2. **Catan 3D second** (medium, exercises real game state + multiplayer + Azure Web PubSub). The "I built a real game" project.
3. **Pandemic 3D third** (large, only if the first two went well and you want to keep going). Capstone-grade.

Don't start the next one until the previous one is **shipped to a URL someone can play at**. The discipline of finishing > the satisfaction of starting.

## A note on scope creep

Every one of these games has the option to grow into "and then I added [legacy mode / online tournaments / mobile app / ...]". Resist. Pick a scope, build it, ship it, write a retrospective, then decide whether to extend or move on. The retrospective is mandatory — that's where the learning compounds.
