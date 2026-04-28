# Homework — Hand-Off vs Delegation

> Pick deliberately. Build one of each. Observe the difference.

## Exercise 1: Build a delegation flow

A "research orchestrator" that:
- Receives a user's research question.
- Delegates to 2-3 specialist agents (each researches one aspect).
- Synthesizes their results.
- Replies to the user with a unified answer.

**Constraints:** the orchestrator stays in charge. Specialists return; they don't "own" the user.

## Exercise 2: Build a hand-off flow

A "router agent" that:
- Receives a user's request.
- Classifies the intent (e.g., "code-help" vs "writing-help" vs "math-help").
- Hands off the conversation to the appropriate specialist agent.
- The specialist replies directly to the user; the router is done.

**Constraints:** the router does no synthesis. It picks; it transfers.

## Exercise 3: Compare on a multi-turn scenario

Take both flows. Run a 3-turn conversation:

Turn 1: User asks about X.
Turn 2: User follows up with a related question.
Turn 3: User pivots to a different topic.

Observe:
- **Delegation:** how does turn 2 work? Did the orchestrator have to re-delegate? Did any context get lost?
- **Hand-off:** who handles turn 2? Turn 3? Was there a re-routing?

Document which pattern fit better for which kind of conversation.

## Stretch: A hybrid

Some real systems mix: the user starts with a router; the router hands off to a specialist; that specialist may *delegate* parts of its work to peers. Build it. Identify where each pattern ends and the other begins.

## Reflection

- "Default to delegation." Why? (Hint: easier to control; easier to audit; less context confusion.)
- When does hand-off truly win? (Hint: when the rest of the work belongs in a fundamentally different domain.)
- Bidirectional control swapping is usually a smell. Why?

## Done when

- [ ] You've built one delegation flow and one hand-off flow.
- [ ] You've run them on a multi-turn scenario and compared.
- [ ] You can articulate when to use each.
