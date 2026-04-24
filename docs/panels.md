# Panels

> **Heads up.** If you came here looking for docs on *multi-agent orchestration* — spawning several agents to work on one project — that's a different thing. See [multi-agent.md](multi-agent.md).

A **panel** in the Claude Code ecosystem is the **sidebar / chat UI** the Claude Code extension exposes inside a host editor (VS Code, Cursor, JetBrains). It's not a Claude Code *primitive* and you don't create one — it's just the UI container the extension draws in.

## Where the term comes from

"Panel" isn't defined in Anthropic's official docs as a feature. It shows up in:

- GitHub issues on `anthropics/claude-code` — e.g. "Claude Code panel doesn't initialize in Cursor", "Option to run Claude Code in Terminal Panel"
- VS Code community usage — VS Code itself uses "panel" and "sidebar" to describe dockable UI regions, and people apply that vocabulary to Claude Code's chat window
- Settings like `preferredLocation` in the VS Code extension that control where the panel docks

So when someone says "the Claude panel," they mean "the Claude Code chat UI rendered inside my editor."

## What the panel actually is

- A dockable view inside VS Code / Cursor / JetBrains that hosts the Claude Code conversation
- Functionally the same agent as the `claude` CLI — same tools, same session model, same `.claude/` configuration
- Can typically be moved between the sidebar, the secondary sidebar, and the terminal panel region

You don't configure the panel through Claude Code itself — you configure it through your editor's view/layout controls, or through the extension's settings.

## Opening and controlling it

In VS Code / Cursor:

- **Command palette** → "Claude Code: Focus Chat" (or similar) to bring the panel forward
- **Drag the view** between sidebar / panel area like any other VS Code view
- **`/ide`** (run this inside Claude Code) — manage the IDE integration itself

From the CLI side:

- `/desktop` — continue the current session in the Claude Code Desktop app (macOS/Windows)
- `/teleport` — pull a web session back into a terminal. Alias: `/tp`
- `/remote-control` — expose this session to be driven from claude.ai. Alias: `/rc`

## Panel vs. terminal — does it matter which you use?

Mostly no. The agent is identical. Differences are ergonomic:

| | Terminal CLI | Editor panel |
| --- | --- | --- |
| Keybindings | Terminal's | Editor's + Claude's |
| File inspection | `Read` tool | Same, plus editor jumps to `path:line` |
| Diff viewer | `/diff` opens in-term | Integrates with editor's diff UI |
| Multiple sessions | Multiple terminals | Tabs within the panel (feature request) |
| Voice / images | Terminal-dependent | Editor integration |

Pick whichever fits your workflow. The panel is friendlier for browsing results; the terminal is faster if you live there anyway.

## If "panel" meant something else to you

People sometimes use "panel" colloquially for **a group of expert agents reviewing the same artifact** ("a panel of judges"). That's a real pattern, but in Claude Code it's built out of subagents and slash commands, not a `panel` primitive. See [multi-agent.md](multi-agent.md) for how to assemble one.

## Where to go next

- Multi-agent orchestration patterns → [multi-agent.md](multi-agent.md)
- Subagents under the hood → [agents.md](agents.md)
- `/ide`, `/desktop`, `/teleport`, `/remote-control` → [built-in-commands.md](built-in-commands.md)
