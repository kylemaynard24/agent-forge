# Peer Review and Pull Requests

**Area:** Incident Response and Engineering Execution

## Intent

Make every pull request a net positive for the author, the codebase, and the team — through reviews that are specific, actionable, and honest about trade-offs.

## When to use

- you are reviewing a pull request and want to give real value, not just approval
- you are submitting a PR and want it reviewed well
- the team is stuck in a pattern of slow, shallow, or combative reviews
- "LGTM" is shipping as approval with nobody actually reading the code

---

## Why it matters

Code review is the highest-leverage quality gate a team has. It is also the most commonly wasted. The failure modes are predictable: reviewers skim and approve, nitpick style while missing correctness, or block on preference without explaining the cost. Authors write PR descriptions that say nothing, or write nothing at all.

The result is either a rubber stamp that catches nothing, or a friction machine that burns engineers' time without improving the code.

A good PR review does three things that a bad one doesn't:

1. It finds problems the author couldn't see (missing test case, edge condition, security gap).
2. It makes the author a stronger engineer by explaining the *why*, not just flagging the *what*.
3. It leaves the codebase easier to reason about for the next person who opens the file.

---

## The PR author's job

The review starts before any reviewer opens the diff.

**Write a real description.** A blank description or a commit list is not a description. The reviewer needs to understand what changed, why it changed, and what you considered but rejected. One paragraph is usually enough. If it is longer than three paragraphs, the PR is probably too large.

A useful format:

```
What: one sentence on the change.
Why: the motivation — bug, feature request, refactor, compliance, etc.
How: the approach you chose and why (especially if you considered alternatives).
What to watch: areas where you are least confident, constraints that aren't obvious, known gaps left for a follow-up.
```

**Keep the PR small.** A 50-line diff gets a real review. A 2000-line diff gets LGTM. If your change is large, look for a natural seam: extract a preparatory refactor first, then the behavior change. Two small PRs are always better than one large one.

**Respond to every comment.** Clicking "Resolve" without a reply means the reviewer cannot tell whether their concern was addressed, misunderstood, or ignored. Write one sentence. "Fixed in latest commit" is enough. "I considered this but kept the original approach because X" is better.

---

## The reviewer's job

### Before you open the diff

Read the PR description. If there isn't one, ask the author to write one before you review. A description-free PR means you are guessing what the intent is, and a guessing reviewer misses things.

Understand the context:

- what ticket or requirement does this close?
- is this a hotfix, a feature, a refactor?
- what is the expected behavior change?

This takes two minutes and it makes the entire review sharper.

### Review the design before the implementation

Open the file tree view, not the line diff. Read the shape of the change:

- which files changed and which didn't?
- are there tests? Do they look like they test the right thing?
- does the approach match what the description said?

If the design is wrong, you don't need to read the implementation line by line. Flag the design concern first. Implementation notes on a PR with the wrong design are noise.

### Separate your comments by weight

Every comment you leave is a decision request for the author. Weight them accordingly.

**Blocking (must fix before merge):**
- correctness: the code does not do what it claims, or breaks an invariant
- security: credentials exposed, input not validated, trust boundary crossed
- missing test coverage for a behavior that will break in production
- architecture regression: the change makes the system harder to reason about in a way the author may not have seen

**Non-blocking (should fix, author decides when):**
- the code works but there is a cleaner approach that reduces complexity
- naming that will confuse the next reader
- a missing edge case that is unlikely but worth noting

**Nitpick (take it or leave it):**
- style preferences not covered by the linter
- minor naming opinions
- ways to make the code marginally shorter

Mark your nitpicks explicitly — write `nit:` at the start of the comment. An author should never have to guess whether you will block the merge over a nitpick.

### How to write a useful comment

**Bad:** "This is fragile."

**Good:** "This will break when `userId` is null — the API does not guarantee it is set for anonymous sessions. If that happens, line 34 throws. Either guard at the top of the function or add a test that proves the caller always provides it."

The pattern is: *what is the problem* + *when it manifests* + *what to do about it*.

If you have a strong opinion but it is a preference, say so: "I would flatten this into a single loop, but I don't feel strongly — if you like the current shape that's fine." That sentence saves a back-and-forth thread.

### Ask questions before conclusions

If you don't understand why the author made a choice, ask. Don't assume it is wrong. "What's the reason for using a cache here instead of reading directly?" is a better comment than "This cache seems unnecessary." The author may know something you don't. The answer will also tell you whether the intent was deliberate or accidental.

### Praise what is good

If you see a clean abstraction, an elegant fix, or a test that properly covers a tricky case — say so. Positive feedback is feedback. It tells the author what to repeat. A review with only negative comments trains authors to dread the review process.

### Don't rewrite the code for them

If you see a better approach, describe it or sketch it. Don't paste a replacement. The author needs to understand the change, not just accept a diff. If you write "change this to X," you have robbed them of the chance to understand why X is better.

### Review quickly

A PR sitting for two days is a context-switch cost for the author. It also signals that reviews are not a priority, which causes authors to stop caring about them. A thirty-minute review done within a few hours of the request is worth more to the team than a perfect review done on Friday.

If you cannot review fully, say so and give an ETA: "I'll get to this tomorrow morning." That takes ten seconds and costs nothing.

---

## Common mistakes

**LGTM without reading.** Rubber-stamp approval gives the author false confidence and transfers the blast radius to the team. If you don't have time to review, say so.

**Style-only review.** The linter handles style. If your comments are 90% naming and formatting, you are not reviewing the code — you are reviewing the surface. Go deeper.

**Blocking on preference.** "I would have done it differently" is not a blocking concern unless the approach has a real cost: correctness, performance, security, or maintainability. Make the distinction explicit. If you can't name the cost, it's a preference.

**Drive-by without context.** A one-line comment with no explanation — "this seems off" — creates work for the author with no signal about what to do. If you flag something, explain it.

**Reviewing the wrong layer.** Leaving implementation comments on a PR that has a design problem wastes everyone's time. Call out the design issue first and hold implementation feedback until after the design is agreed.

**Letting the PR sit forever.** Silence is not neutrality. A review that never lands is a PR that never ships. If you start a review and don't finish, notify the author.

---

## The habits of a strong reviewer

- always read the description before the diff
- always separate blocking from non-blocking from nitpick, explicitly
- always explain the *why* in a correction comment
- always ask a question before assuming something is wrong
- always leave at least one specific positive comment when there is something worth noting
- always respond within one business day

---

## Scenario questions

These questions are designed to surface the moments where this skill is most useful — when pressure, habit, or timeline tempt you to shortcut it.

### Scenario 1 — "The PR is urgent and the author is waiting"

**Question:** You are asked to review a hotfix. The author says it is low-risk and just needs a quick LGTM. Should you review it properly?

**Answer:** Yes.

**Explanation:** Urgency is the most common reason reviews get skipped, and skipped reviews are how hotfixes introduce new bugs. Proper does not mean slow. It means: read the change, understand what it does, confirm there is no obvious blast radius. A five-minute review is still a real review. "Urgent" is a risk modifier, not a reason to abandon the quality gate.

### Scenario 2 — "The author is more senior than you"

**Question:** You find a correctness issue in a PR from a staff engineer. Do you still comment?

**Answer:** Yes.

**Explanation:** Code review is not a hierarchy exercise. If you see a real problem, the senior engineer would rather know before it hits production. Write the comment, mark the severity correctly, and explain your reasoning. If you are wrong, the explanation gives them something concrete to respond to. That exchange is exactly how engineers get better.

### Scenario 3 — "The PR has 47 comments and is stalling"

**Question:** A PR has been in review for a week with a long unresolved thread. What should you do?

**Answer:** Get both parties in the same conversation (sync or async) and aim for explicit resolution.

**Explanation:** Long threaded disagreements on PRs are almost always a communication problem, not a correctness problem. Someone is not understanding the other person's concern, or the cost of the disagreement is not being named. A five-minute sync resolves what a week of comments won't. After the conversation, one person writes a summary comment so the decision is on record.
