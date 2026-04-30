# Codenames LLM

Web-based Codenames where the **spymaster is an LLM**. Players guess; the AI gives clever (or chaotic) one-word clues. Smallest scope of the three ideas, ships fastest, and exercises the Claude API + a real deploy without the multiplayer complexity of the others.

## Concept

A 5×5 grid of words sits on a stylized table. The Spymaster (you OR the LLM, configurable) sees which words belong to which team (red/blue/neutral/assassin); the Operatives only see the words. Spymaster gives a one-word clue + a number ("Ocean: 3"); Operatives try to guess which 3 words on the board match.

The novelty is the LLM Spymaster. Instead of needing two human teams, you can play **solo** (you operative against AI spymaster) or **co-op** (you+friends operative, AI spymaster) — the AI generates the clues, and the clues are *fun* in a way that pre-written clues never could be.

3D is minimal — the word cards are 3D-rendered with subtle physics (flip on reveal, slide off the table when claimed). The point of the project is the LLM agent, not the rendering.

## Why Codenames

- **Smallest scope.** No globe rendering, no hex grid, no real-time multiplayer required. Could ship in a month part-time.
- **The LLM is the project.** Building a clue-giver agent is genuinely interesting: the LLM has to find one word that connects 2+ target words while AVOIDING all other words on the board (especially the assassin). That's a real reasoning task — and it's fun to watch the AI struggle, then surprise you, then surprise you again.
- **Single-player works.** No multiplayer infrastructure required for v1. Add multi-human-operative co-op later if you want.
- **Direct hit on your `claude-api` skill.** Forces real engagement with prompt design, structured output, prompt caching, model selection, evals.

## Core mechanics to translate

| Board mechanic | Software/UX implementation |
|---|---|
| 25 word cards in a 5×5 grid | 3D card meshes; reveal flips card to show team color |
| Each game has a hidden 5×5 key (red/blue/neutral/assassin) | Per-game seed; key visible only to current spymaster |
| Spymaster gives one-word clue + a number | LLM call: prompt includes board state + key; expect structured `{clue, number, reasoning}` |
| Operatives guess; correct = card flips to team color, incorrect = turn ends | Click → reveal → state update |
| Game ends when one team finds all theirs OR someone hits the assassin | Win/loss state |
| **AI Spymaster gotchas:** must NEVER reveal opponents' words, must AVOID assassin association, must connect ≥ N target words | Prompt engineering + post-validation of clue against word list (cosine-similarity check that clue isn't on the board) |

## Suggested tech stack (Azure-native, simpler than the others)

| Layer | Pick | Why |
|---|---|---|
| 3D engine | **Three.js** | Lightweight; just rendering 25 card meshes |
| Frontend | React or SvelteKit + Vite | Fast iteration |
| LLM | **Claude API** (Sonnet for clues; Haiku for cheap eval helpers) | Use the `claude-api` skill |
| Backend | **Azure Functions** (HTTP trigger) | Serverless fits this perfectly — no persistent connection needed |
| API key handling | Azure Key Vault + managed identity in the Function | NEVER ship the key in the frontend |
| Game state | Local browser state (single-player) OR Cosmos DB (multi-human) | Start with local; add backend when multiplayer matters |
| Static hosting | **Azure Static Web Apps** | Built-in Functions integration, free tier |
| IaC | **Bicep** | Single template covers Static Web App + Functions + Key Vault + role assignment |
| CI/CD | **GitHub Actions** with OIDC | Same as the others |
| **Prompt eval suite** | Run weekly cron via GHA: 100 boards × N models, log clue quality | Fits agentic-workflows Level 3 (evals-for-agents) |

This is the **cheapest** of the three to run — Functions on consumption tier costs ~$0 idle, and Claude API costs are pennies per game.

## Scope phases

- **Phase 1 — Local-only single-player MVP (2 weeks).** 25-word grid, hardcoded word list (~400 words), AI spymaster only, browser-only state, deploy to Azure Static Web Apps + a Function for the LLM call. **Ship this in 2 weeks** and have something playable.
- **Phase 2 — Better clues (2 weeks).** Iterate on the prompt. Build an eval harness: 50 boards × 3 prompts × 2 models, score clues on (a) did operative find the right cards? (b) was the assassin avoided? (c) human rating of "delightful". Pick the winning prompt+model combo.
- **Phase 3 — Multi-human operative mode (3 weeks).** Add a backend so 2-4 humans can be operatives together; AI is still spymaster. Real-time via Web PubSub (small enough that this is overkill but good practice).
- **Phase 4 — Spymaster vs Spymaster (2 weeks).** AI spymasters on both teams; you spectate and watch the AI argue with itself. Surprisingly fun. Also a great evals data source.

## Trade-offs / risks

- **Clue quality is the whole product.** A bad clue ruins a game. Spend disproportionate time on the prompt + the eval harness. Prompt-cache the system prompt — board changes per game but the rules don't.
- **The assassin trap.** LLMs are bad at "avoid X" instructions. Verify clues programmatically: after the LLM returns a clue, embed the clue + every word on the board, check that the clue isn't suspiciously close to the assassin word; if it is, retry with a stronger negative example in the prompt.
- **"Codenames" word lists are copyrighted.** Use a public-domain word list or generate your own. Don't ship the actual game's 400-word deck.
- **Single-player gets old.** Phase 1 is fun for an evening. The multi-human-operative mode is what makes it replayable. Plan to do Phase 3.

## Connections back to the four learning tracks

- **Agentic workflows:** the spymaster is a constrained-reasoning agent — single-step (no loop, just one call per turn) but with a hard structured-output requirement and a non-trivial avoidance constraint. Perfect for the `tool-design-principles` and `structured-output` topics in your syllabus. The eval harness is the `evals-for-agents` topic in practice.
- **Software architecture:** clean separation between game logic (state machine, win conditions, turn order), LLM client (prompt building, API call, parsing), and rendering (card meshes, animations). Each is testable in isolation; each can be replaced.
- **Design patterns:** Strategy for spymaster type (HumanSpymaster, LLMSpymaster, CleverLLMSpymaster, ChaoticLLMSpymaster); Observer for clue events; Decorator for the prompt-cached LLM client wrapping the base client.
- **DevOps:** smallest of the three infrastructurally — but exercises the Azure-Function + Key Vault + managed-identity + Bicep modules pattern from devops-syllabus Level 2-3. The Claude API call from a Function with KV-stored secret is a common real-world pattern.

## Stretch ideas (only after Phase 4 ships)

- **Custom word packs:** users upload their own 400-word vocab (movie titles, programming terms, in-jokes from your group chat).
- **Spymaster personalities:** "Cautious", "Wordplay-loving", "Pop-culture", "Programmer" — each is a different system prompt + few-shot examples. Stylistic variation makes replays interesting.
- **Multi-language:** the LLM gives clues in language X, operatives guess in language X. Useful for language learning + interesting AI behavior.
- **Live-stream mode:** spymaster shows their reasoning as a side panel for spectators. Educational + entertaining.
