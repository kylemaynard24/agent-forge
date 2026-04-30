# Pandemic 3D

A web-based, 3D, **cooperative** Pandemic game. Players are CDC specialists racing to cure four diseases before the world collapses. The disease itself is the antagonist — and it's an autonomous system the players have to outpace.

## Concept

Render the world map as a 3D rotating globe. City connections glow as routes. Disease cubes appear as small colored crystalline clusters that grow on city nodes — when a city outbreaks, the cubes visibly cascade to neighboring cities with an animation. Players control character pawns (Medic, Researcher, Scientist, etc.) that fly between cities; their movements are visible as small jet-trail arcs across the globe.

The 3D is functional: the global view is what makes you *feel* the geographic spread, and rotating the globe shows you the regional patterns of disease that flat boards hide. When the infection rate hits 4 cubes/turn and outbreaks start chaining, the visualization should make your stomach drop.

Cooperative gameplay over real-time multiplayer (2-4 humans), or single-player controlling all roles.

## Why Pandemic

- **Cooperative is rare in 3D games** — most multiplayer 3D games are competitive. Cooperative requires different design (no hidden info between teammates, but communication overhead, and the game must scale difficulty so it doesn't auto-win)
- **The disease IS an agent** — it follows rules (infect, spread on outbreak), reacts to player actions, and has internal state (infection rate, outbreak count). This maps directly onto agentic-workflows concepts
- **World map is visually compelling** — globe rendering, geographic data, animated cube spread = the most cinematic of the three ideas
- **Time pressure built into the game design** — the infection deck driving inevitable acceleration is one of the best mechanics in modern board games

## Core mechanics to translate

| Board mechanic | Software/UX implementation |
|---|---|
| 48 cities on a world map, connected by routes | 3D globe with city nodes (geographic coords); routes as great-circle arcs |
| 4 colored diseases, cubes accumulate on cities | Crystalline cluster meshes per city, color-tinted, scale with cube count |
| Infection deck dictates which cities get infected each turn | Card-deck visualization; "infection rate" visible as tempo indicator |
| Outbreaks: when a 4th cube is added, spread to neighbors (chain) | Cascading animation; chains visible as ripples on the globe |
| Player roles with unique abilities (7 in base game) | Character cards / pawn models with role-specific UI affordances |
| Discover cures by playing 5 same-color cards at a research station | Card-collection UI; cure unlock animation |
| Win by curing all 4 diseases; lose if 8 outbreaks OR infection deck empties OR player deck empties | Multi-condition win/loss state visualizers |
| **Epidemics** in player deck force infection-deck shuffle | Dramatic epidemic event with narration |

## Suggested tech stack (Azure-native)

Same stack shape as Catan-3D but with a few differences:

| Layer | Pick | Why |
|---|---|---|
| 3D engine | **Three.js** (better globe libraries) or **Cesium** (geo-specialized) | Geographic rendering ecosystem |
| Map data | Natural Earth or simple GeoJSON | Real city coordinates feel authentic |
| Backend | **Azure Container Apps** | Real-time game session per group |
| Real-time multiplayer | **Azure Web PubSub** | Same as Catan |
| State | **Cosmos DB** | Per-game session document |
| Auth | Magic-link email or anonymous join | Cooperative groups want low-friction join |
| Static hosting | **Azure Static Web Apps** | Same as Catan |
| IaC | **Bicep** | Same as Catan |
| CI/CD | **GitHub Actions** with OIDC | Same as Catan |
| **Disease simulation** | Server-authoritative tick loop (the disease "agent") | Cheating must be impossible |

## Scope phases

- **Phase 1 — Single-player + flat 2D map (5 weeks).** Get the rules right first. No globe, no fancy graphics — just a 2D map that proves the disease engine works correctly. Most of Pandemic's complexity is in the rules, not the rendering. **Ship this**.
- **Phase 2 — 3D globe rendering (4 weeks).** Replace the 2D map with the globe. All gameplay unchanged — this is purely a visual upgrade.
- **Phase 3 — Disease cascade animation (3 weeks).** Outbreak chains, cube spread, infection-rate tempo. This is what makes the game *feel* like Pandemic.
- **Phase 4 — Multiplayer cooperative (8 weeks).** Real-time sync between 2-4 players. Voice chat (Web RTC) is a stretch — text-only is fine for v1.
- **Phase 5 — Polish + scenarios (5 weeks).** Difficulty levels (4/5/6 epidemic cards), unlockable scenarios (Mutation, Bio-Terrorist), victory replay, leaderboard.

## Trade-offs / risks

- **Pandemic is rule-heavy.** Read the rules carefully. Edge cases are nasty: does the Medic's auto-cure trigger on entry to an infected city? Do Quarantine Specialist effects stack? Get the rules right BEFORE any rendering work.
- **Globe rendering is harder than flat maps.** Great-circle arcs, projection issues, click-targeting on a curved surface — all real problems. If you're new to 3D, do Catan-3D first.
- **Cooperative multiplayer balance.** Without competitive pressure, the game can feel slow if any player overthinks. UX needs to make turns visible and timer-bounded if needed.
- **The game lasts 45-60 minutes.** Long sessions = high cost of dropped connections + high cost of bugs that trigger late. Save+resume is essentially required.
- **Pandemic IP.** Z-Man Games' design is recognizable. Same advice as Catan: rename + restyle for public release, or keep it personal/portfolio.

## Connections back to the four learning tracks

- **Software architecture:** the disease engine is a textbook simulation: clear inputs (player actions), clear outputs (board state), clear invariants (cube counts conserved, outbreak chain terminates). It MUST be cleanly separated from the rendering and from the network sync, or every change breaks something. This is your real-world "separation of concerns" project.
- **Design patterns:** Strategy for role-specific abilities (Medic, Researcher each have different `act()` implementations); Observer for game-state-change notifications to all clients; Command + Memento for undo (cooperative players will *demand* undo when someone misclicks); State for turn-phase machine.
- **DevOps:** the cooperative real-time backend is more demanding than Catan's turn-based. You'll exercise more of the Azure stack: Web PubSub for sync, Cosmos DB change feed for spectator updates, App Insights for game-session telemetry (avg game length, outbreak frequency — actually useful product metrics), maybe Front Door for global low-latency.
- **Agentic workflows:** **the disease is the agent**. It has a goal (terminate the world), tools (infect, outbreak), a loop (each turn it acts), and an "autonomy gradient" (it acts autonomously but its rules are deterministic). Modeling it cleanly as an agent — instead of as scattered "if outbreak then..." conditionals — is the architectural insight that makes the codebase clean. Stretch goal: an LLM-driven adaptive disease that picks its infection cards strategically against player composition.
