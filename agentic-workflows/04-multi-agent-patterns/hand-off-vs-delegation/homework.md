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

---

## Clean Code Lens

**Principle in focus:** Explicit Contracts + Ownership Clarity

Hand-off and delegation are different ownership contracts, and that difference should be declared explicitly in each agent's description — not inferred from runtime behavior. An agent that receives a delegation returns a result and expects the caller to remain responsible for the outcome; an agent that receives a hand-off owns the rest of the conversation. Leaving the ownership model implicit is the agentic equivalent of a function that mutates a parameter without documenting it: the caller cannot know whether it still owns the value, which produces bugs that are only visible at runtime.

**Exercise:** For each agent you built — the research orchestrator and the router — add a single sentence to the top of its system prompt that explicitly declares its ownership model: either "I own this outcome end-to-end and report back to my caller" (delegation worker) or "I own this conversation from the point of hand-off; the router has no further role" (hand-off recipient). Then check whether the agent's actual behavior matches that declaration.

**Reflection:** The homework notes that "bidirectional control swapping is usually a smell." In software design, what pattern does bidirectional control resemble — and why does making ownership one-directional and explicit generally produce systems that are easier to test and reason about?
