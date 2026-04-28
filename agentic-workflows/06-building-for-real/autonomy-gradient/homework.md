# Homework — The Autonomy Gradient

> Pick the right level per action. Earn the next level.

## Exercise 1: Audit one of your agents

For an agent you use, list every action it can take. For each:
- What's the cost of being wrong?
- Reversible?
- Frequency?
- Current level (gate / auto / deny)?
- Right level (in your view)?

Document the gap between current and right.

## Exercise 2: Write a promotion plan

Pick one action you'd like to *move up* the gradient. Write a promotion plan:

1. **Current state**: action gates every time.
2. **Promotion criteria**: e.g., "after 50 successful uses with no rejection, promote."
3. **Observability**: what data is collected to support the criteria?
4. **Rollback**: how do you go back if the promotion is wrong?

**Constraints:**
- The criteria are objective (count of approvals, time period, error rate).
- Observability is in place BEFORE the promotion.
- Rollback is a one-step operation.

## Exercise 3: Promote one action

Implement the plan. Move one action from "gate every time" to "auto-allow." Run the agent. Watch.

After a week (or a number of uses), re-evaluate:
- Did anything go wrong?
- Did the user notice the time savings?
- Should you stay at the new level?

## Stretch: A demotion

Pick an action that is currently at a high autonomy level. Demote it (move it back to "gate"). Document why.

This is harder than it sounds — usually we resist demotions because they feel like progress reversed. But sometimes demotion is right (the cost of being wrong rose; an incident happened; the action's pattern changed).

## Reflection

- "Default to the lowest level that does the job." Argue this principle.
- A hot-take: "Most agents in production are at the wrong level — too high." Defend or refute.
- "Earned autonomy isn't permanent." Why might you need to demote a high-trust agent? (Hint: world changes; agent changes; new threats.)

## Done when

- [ ] You've audited one agent's actions and identified per-action levels.
- [ ] You've documented one promotion plan with measurable criteria.
- [ ] You've executed one promotion and observed it.
- [ ] You can articulate when promotion is right vs premature.
