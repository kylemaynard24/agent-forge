# Settings and Permissions

**Category:** Claude Code primitives

## Why this is its own topic

The harness — Claude Code's runtime — is highly configurable. Settings control:

- Which tools are allowed / denied / require confirmation.
- Environment variables.
- Hooks (covered in their own topic).
- MCP server registrations.
- Model selection, status line, theme, IDE integration.
- Plugin and skill configurations.

For an agentic engineer, the **permissions** subsection is the most important. Permissions are how you draw the line between "agent helps me work" and "agent breaks something."

## Settings hierarchy

Three layers, applied in order (later overrides earlier):

1. **User settings** — `~/.claude/settings.json`. Your defaults across all projects.
2. **Project settings** — `<project>/.claude/settings.json`. Repo-specific config; checked in.
3. **Local project settings** — `<project>/.claude/settings.local.json`. Personal overrides; gitignored.

This lets you:
- Set personal defaults (model, keybindings) at the user level.
- Set team conventions (allowed tools, hooks) at the project level (in version control).
- Override per-machine without polluting the team's config.

## The `permissions` field

The most consequential setting. Three categories:

```json
{
  "permissions": {
    "allow": ["Read", "Grep", "Glob", "Bash(git status)"],
    "deny": ["Bash(rm:*)", "Edit(/etc/**)"],
    "ask":  ["Bash", "Edit"]
  }
}
```

- **`allow`** — auto-approve these. No prompt; just do it.
- **`deny`** — never allow, even if asked. Safety guardrail.
- **`ask`** — prompt the user each time.

Patterns can match tool names, tool name + argument prefix, or globs.

## Permission patterns

### Read-only allowlist
For a cautious default:

```json
{
  "permissions": {
    "allow": ["Read", "Grep", "Glob"],
    "ask":   ["Edit", "Write", "Bash"]
  }
}
```

The agent can investigate freely, but you confirm every change.

### Bash specifics
Allow specific commands, prompt on others:

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)", "Bash(git log)", "Bash(git diff)",
      "Bash(ls)", "Bash(cat)", "Bash(grep)"
    ],
    "deny": [
      "Bash(rm:*)", "Bash(sudo:*)", "Bash(curl:* -d:*)"
    ],
    "ask": ["Bash"]
  }
}
```

You're saying: "These specific commands are fine. These are never fine. Anything else, ask."

### MCP per-tool
Once you have MCP servers, each tool is a permission target:

```json
{
  "permissions": {
    "allow": ["mcp__sqlite__query", "mcp__github__list_issues"],
    "ask":   ["mcp__github__create_issue"],
    "deny":  ["mcp__sqlite__execute", "mcp__github__delete_repo"]
  }
}
```

## Designing your permission policy

Start restrictive. Loosen specific things as you trust them:

1. **Default ask.** Don't auto-allow Bash and Edit globally.
2. **Allow read-only.** Read, Grep, Glob — auto-allow.
3. **Deny destructive patterns.** `rm:*`, `sudo:*`, anything writing to system paths.
4. **Allow specific safe Bash.** Git read commands, ls, cat — auto-allow.
5. **Iterate.** Each time you find yourself approving a safe command repeatedly, add it to allow.

After a few weeks, your settings.local.json becomes a high-confidence allowlist of what you trust in your workflow.

## The `dangerouslyDisableSandbox` and friends

Some settings can disable safety features. **Don't enable them lightly.** A single bypass in production is the kind of incident you remember.

Anti-patterns:
- Allow-listing everything to "stop the prompts." You're now operating without guardrails.
- Enabling experimental flags that disable confirmations.
- Sharing aggressive settings.local.json between machines.

## Settings vs hooks vs prompts

For controlling agent behavior, you have three layers:

| Layer | What it controls | How | Reliability |
|---|---|---|---|
| Prompt | What the agent prefers | "Always X" | Probabilistic |
| Hook | What the harness enforces | Shell command on event | Deterministic |
| Permission | What the agent CAN do | Allow / ask / deny lists | Absolute |

**Permissions are the strongest tool you have for safety.** A prompt that says "don't edit secrets" is a polite request. A hook that runs on Edit can detect and block. A permission deny rule means the agent literally cannot invoke that operation; the harness rejects it.

## Anti-patterns

- **Settings as a kitchen sink.** A 500-line settings file with magical fields. Hard to maintain.
- **Local settings checked in.** `settings.local.json` should be gitignored.
- **Different machines, divergent settings.** Use project settings for team conventions; local for personal.
- **Permissions as a substitute for thinking.** Allow-listing everything because "I trust Claude." Trust is earned per-action.

## Trade-offs

**Pros of careful settings**
- Safety: dangerous actions blocked.
- Trust: you can let the agent run more autonomously knowing the floor is solid.
- Team alignment: project settings encode team conventions.

**Cons**
- Overhead: too many `ask` rules and the agent feels chatty.
- Drift: settings rot if not maintained.
- Foot-guns: an over-permissive `allow` is silent until something breaks.

**Rule of thumb:** When in doubt, deny or ask. Loosen on evidence.

## Real-world analogies

- A firewall config. Default deny; allow specific known-safe traffic.
- An employee's access permissions. Restricted by default; granted by need.
- A dev server with feature flags. Defaults on; specific flags toggled.

## Run the demo

```bash
node demo.js
```

The demo prints three example settings configurations — defensive, balanced, permissive — and explains the trade-offs of each.
