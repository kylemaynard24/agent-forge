# Homework — Settings and Permissions

> Set up a permission policy that fits your work. Iterate as you learn what to trust.

## Exercise 1: Audit your current settings

Open `~/.claude/settings.json` and `<project>/.claude/settings.json`.

For each rule in `allow` and `deny`:
- Why is it there?
- When was the last time it mattered?
- Is the pattern correctly scoped (not too broad)?

Write a one-line justification for each. If you can't, consider removing it.

## Exercise 2: Tighten permissions over a week

For one week:

1. Start with a defensive baseline (read-only auto-allow; everything else asks).
2. Each time the harness prompts you to confirm, ask yourself: "is this the kind of thing I'll always approve?"
3. If yes, add to `allow` (with the most specific pattern that captures it).
4. If sometimes-yes-sometimes-no, leave in `ask`.
5. If never-yes, add to `deny`.

After the week, your settings should feel finely tuned: rare prompts, but every prompt earns its keep.

**Constraint:** Don't bulk-allow `Bash` or `Edit`. Each entry is a specific subcommand or path glob.

## Exercise 3: Project-level settings for a team

For a project you work on, write `.claude/settings.json` (project-scoped, in the repo) that codifies team conventions:

- Allow: read-only operations, common safe Bash (git status, npm test, etc.).
- Deny: anything destructive against shared infrastructure (npm publish, force-push, rm).
- Ask: anything in between.
- Hooks: any policy that should apply to the whole team (e.g., format on edit).

**Constraints:**
- The settings are reviewable like code.
- Each rule has a comment or commit message explaining why.
- `settings.local.json` is in `.gitignore`.

## Stretch 1: Per-tool permission for an MCP server

Take an MCP server you use. Define per-tool permissions:
- Read-only tools → allow.
- Mutating tools → ask.
- Destructive tools → deny.

Put this in `settings.json` and document why each is in its bucket.

## Stretch 2: A permission "drill"

Set up a deliberately throwaway environment (a temp git repo, a sandbox VM, a Docker container). Run Claude with `permissive` settings.

Try to break something on purpose:
- Ask it to do something destructive.
- Set up a scenario where it's tempted to take a shortcut you wouldn't approve.

Note: what did the safety net catch? what didn't it? Tighten your real settings accordingly.

(You're not testing Claude — you're testing your *settings*.)

## Reflection

- "When in doubt, deny." This is a defensive principle. When does it become anti-productivity? (Hint: too many prompts and the engineer disengages from the prompt entirely.)
- Why are user, project, and local settings separated? Construct a scenario where merging them would break a team.
- A skill is suggestion-shaped. A hook is enforcement-shaped. A permission is hard-stop-shaped. Walk through a scenario where you need each level.

## Done when

- [ ] You've audited your existing settings and pruned what you couldn't justify.
- [ ] You've tuned for a week and your settings feel earned.
- [ ] You have a project `settings.json` reviewable as code.
- [ ] You can articulate the safety hierarchy (prompt < skill < hook < permission deny).

---

## Clean Code Lens

**Principle in focus:** Principle of Least Privilege + Explicit over Implicit

A broad permission like `allow: Bash` is the settings equivalent of a public mutable global variable — it grants access to everything without naming what is actually needed, which means that any future tool call inherits the permission even if it was never intended to. A narrow permission like `allow: npm test, git status, cat` is the settings equivalent of a function that declares exactly which dependencies it takes as parameters: the scope is visible, reviewable, and bounded.

**Exercise:** Take each entry in your project `settings.json` `allow` list and rewrite it as a comment: "This allows `<operation>` because `<specific scenario>` and it is safe because `<constraint>`." Any entry you cannot complete that sentence for should be moved to `ask` until you can justify it — treat the exercise as a code review of your own permission policy.

**Reflection:** The homework separates user, project, and local settings. In software design, what layer architecture does this mirror — and why is the rule "project settings are in the repo, personal overrides are gitignored" the same principle that separates shared configuration from environment-specific secrets?
