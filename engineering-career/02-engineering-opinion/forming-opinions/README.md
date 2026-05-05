# Forming Engineering Opinions

An engineering opinion is a reasoned position on a specific technical situation. It is built from evidence, calibrated by experience, and defensible without being inflexible.

The problem is that most engineers wait for opinions to arrive fully formed. They don't. Engineering opinions are grown through a specific process, and understanding that process lets you accelerate it.

## The inputs that build opinions

### 1. Building things and observing consequences

The most reliable source of engineering opinion is direct experience with outcomes. When you choose approach A over approach B, implement it, and then deal with the consequences over weeks and months — something is deposited. You learn not just what A does, but what it feels like to maintain it, debug it, extend it, and operate it.

This is why opinions from people who have only read about patterns are structurally weaker than opinions from people who have built with them. Not because reading is bad — reading is essential — but because reading gives you the concept without the consequence data. The consequence data is what calibrates the concept.

**Practical implication**: don't just build the thing and move on. Spend time with what you built. Own it past the shipping date. Read back through your own code three months later. Note what you got right and what you'd do differently.

### 2. Reading other people's code and systems

Your direct experience is necessarily narrow. Reading widely — other people's codebases, open source implementations, architectural RFCs, design documents, and engineering blog posts from companies running systems at scale — expands your pattern library beyond what you could build yourself.

What to read specifically:
- Open source implementations of things you use (databases, queues, web frameworks). Not all of it — the core path and the interesting edge cases.
- Engineering blog posts from companies that operate at scale: Cloudflare, GitHub, Stripe, Netflix, Dropbox, Slack. These are typically written by practitioners and describe real trade-offs under real constraints.
- Architecture RFCs and design docs when you can find them. Many large open source projects publish RFCs for non-trivial changes. Reading the decision rationale is where the opinion-building material is.
- Post-mortems. They are the most concentrated source of "what can go wrong and why" available in writing.

### 3. Engaging with technical disagreements

Arguments — handled well — are one of the fastest ways to build and refine opinions. Not shouting matches, but genuine technical discussions where you have to defend a position under pressure.

When someone pushes back on your approach, you have two options:
- Update your position because their argument is valid. This is learning.
- Hold your position because their argument doesn't change your assessment. This is judgment.

Both require that you had a position in the first place. Engineers who say "you're probably right" under any pushback are not demonstrating deference — they are demonstrating that they didn't have a grounded position to begin with.

**Practical implication**: engage in code review discussions. Not defensively, but substantively. When a reviewer suggests a different approach, think about whether you agree and why — and say so either way.

### 4. Writing, especially design docs

Writing a design doc forces you to convert implicit intuitions into explicit claims. When you write "Option A has these trade-offs and Option B has these trade-offs and I recommend A because..." you discover very quickly whether your reasoning holds up or whether it was vaguer than you thought.

Writing is not just a communication tool — it is a thinking tool. The act of writing surfaces holes in your reasoning that conversation doesn't catch.

## Calibration: being opinionated without being dogmatic

The goal is not to have strong opinions on everything. The goal is to have calibrated opinions: confident where you have genuine evidence, uncertain where you don't, and honest about the difference.

The failure modes on either side:

**Under-opinionated**: you defer to whoever speaks most confidently, regardless of the quality of their reasoning. You say "it depends" and stop there, without saying what it depends on. You are technically capable but invisible in decisions.

**Over-opinionated**: you apply patterns without checking whether the context fits. You reached a conclusion and defend it regardless of new evidence. You dismiss different approaches because they're unfamiliar, not because they're wrong.

The calibration signal is how you respond to evidence that challenges your position. An opinionated-but-calibrated engineer updates visibly and quickly when they encounter strong counter-evidence. An over-opinionated engineer doesn't update, or updates very slowly and reluctantly.

## Opinion vs preference vs principle

It is worth keeping these three things distinct:

- **Preference**: "I find TypeScript easier to work with than plain JavaScript." This is about your experience and comfort. It is valid but not universally persuasive.
- **Principle**: "Code should be easy to delete." This is a general rule that applies broadly. It is persuasive when the context fits, but doesn't always fit.
- **Opinion**: "Given that this team has three junior engineers and we need to onboard two more in six months, TypeScript will reduce the class of bugs they will introduce and the time it takes to understand unfamiliar modules. The tooling setup cost is worth it here." This is context-specific, evidence-based, and defensible.

In technical discussions, preferences lose to opinions. Principles win when the context matches, lose when it doesn't. Opinions are the most powerful because they are the most specific.
