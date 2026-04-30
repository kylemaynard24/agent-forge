# Catan 3D

A web-based, 3D, multiplayer Settlers of Catan. The "do the classic well" pick.

## Concept

Render the Catan island as a 3D hex-tiled board with stylized terrain (forests, hills, mountains, fields, pastures, deserts) — viewable from any angle, with smooth camera transitions when it's your turn. Players join via a shareable URL, see each other's settlements/cities/roads in real time, trade resources via in-game UI, and watch dice rolls as actual rolling 3D dice that bounce on the table.

The "3D-ness" is functional, not decorative: settlements occlude each other so you have to rotate the camera to see the corner you're about to build on; the robber is a tall mini that sits *on* a tile so its position is visible from across the table; the trade UI lets you drag resource cards to other players' avatars.

Single-player mode plays against AI opponents (3 difficulty levels). Multiplayer mode is real-time over a managed connection (one game lasts 30-90 minutes — connections need to survive that long).

## Why Catan

- **Well-known rules** — you skip 100% of game design and spend it on engineering
- **Rich state model** — board, players, hands, dev cards, longest road, largest army, turn order, dice rolls, pending trades
- **Hex grid is a classic graphics problem** — coordinate systems (axial / cube coordinates), neighbor lookup, edge/vertex addressing
- **AI opponents are non-trivial** — basic heuristics work, expectimax is a stretch goal, MCTS is a far stretch goal
- **Multiplayer is essential** — the game is no fun against AI alone, so you have to solve real-time sync

## Core mechanics to translate

| Board mechanic | Software/UX implementation |
|---|---|
| Hex tile board, 19 tiles + harbors | Three.js or Babylon.js scene, axial-coordinate hex addressing |
| Roll 2d6 each turn, distribute resources | Animated 3D dice; resource animation flowing from tiles to player UI |
| Build settlements at vertices, cities upgrade them, roads at edges | Click-to-build UI with valid-position highlighting |
| Trade resources with other players or the bank | Drag-drop resource UI; pending-trade modal that sticks until accepted/rejected |
| Development cards (knights, road building, year of plenty, etc.) | Card hand UI; reveal animation |
| Robber blocks tiles + steals; longest road, largest army achievements | State-derived bonuses; visual indicators |
| Win at 10 victory points | End-game animation + scoreboard |

## Suggested tech stack (Azure-native)

| Layer | Pick | Why |
|---|---|---|
| 3D engine | **Babylon.js** (or Three.js) | Browser-native, no install, microsoft-backed (Babylon), TS-friendly |
| Frontend framework | React or SvelteKit | Whatever you're fastest in; UI is mostly menus + HUD over the canvas |
| Game state | Authoritative server (don't trust client) | Cheating is trivial in client-state games |
| Backend | **Azure Container Apps** (Node/TS or .NET) | Hits the devops syllabus Level 2-3 |
| Real-time multiplayer | **Azure Web PubSub** (or SignalR) | Managed real-time without standing up sockets yourself |
| State persistence | **Cosmos DB** (game session document per game) | TTL'd; one document per active game |
| Auth | Entra ID guest accounts OR magic-link email | Lightweight; players don't want to make an account |
| Static hosting | **Azure Static Web Apps** | Built-in GHA integration, free tier covers a lot |
| IaC | **Bicep** | Practice for the devops syllabus |
| CI/CD | **GitHub Actions** with OIDC to Azure | Practice for the devops syllabus |

The whole stack is buildable on the Azure free tier for development; production runs maybe $20-50/mo at modest concurrency.

## Scope phases

- **Phase 1 — Hot-seat single-device (4 weeks).** No networking. Just the board, hex math, build/trade/roll, win condition. Pass-and-play around one screen. **Ship this** before phase 2 — even if the only "deploy" is a static page on Azure Static Web Apps.
- **Phase 2 — AI opponents (3 weeks).** Add 1-3 AI players with rule-based heuristics ("expand toward best resources", "trade when needed", "play knights when blocked"). Doesn't need to be smart — needs to be a credible human substitute.
- **Phase 3 — Real-time multiplayer (6 weeks).** Stand up the Azure Container Apps + Web PubSub backend. Handle reconnects (someone WILL drop mid-game). Add a lobby. Add spectator mode.
- **Phase 4 — Polish (4 weeks).** Animations, sound, settings (color-blind palette, animation speed), tutorial mode, mobile-friendly camera controls.

After Phase 1, every subsequent phase is optional — if you finish and don't want to keep going, you've still shipped a real game.

## Trade-offs / risks

- **Hex coordinate math is annoying.** Pick axial or cube coordinates and stick with it. Don't invent your own.
- **Multiplayer balance with reconnects is hard.** Players drop. Connections fail. Decide upfront: do you pause the whole game when a player drops, or do they get an AI takeover after N seconds? (Recommend: AI takeover, with a "rejoin" link valid for 5 minutes.)
- **AI is a rabbit hole.** Heuristic AI is fine. Don't try to write expectimax/MCTS until everything else ships and you genuinely want to.
- **Catan IP.** Klaus Teuber's design is clearly recognizable. For a public deployment, either license it (probably not) or rename + restyle (Settlers of [Your Theme] — same mechanics, different art). Personal/portfolio use is normally fine; check before publicizing.

## Connections back to the four learning tracks

- **Software architecture:** the server-authoritative state + client-replicated view IS the textbook example of separation of concerns + dependency direction. The hex grid + game rules + UI rendering are three concerns that should never bleed.
- **Design patterns:** Strategy for AI difficulty levels; Observer for state-change notifications; Command for "player did X" actions (also enables undo for hot-seat mode); State for turn-phase machine.
- **DevOps:** the entire Azure stack maps directly to your Level 2-3 syllabus topics — Container Apps, Web PubSub, Cosmos DB, OIDC pipelines, Bicep modules.
- **Agentic workflows:** the AI opponents are simple agents (perceive board → choose action → observe result). A stretch goal is replacing the heuristic AI with an LLM-driven agent that explains its moves ("I'm building here because the 8/9/10 cluster gives 28% per turn") — that's a real agent design exercise.
