# Built-in slash commands

Reference for the `/` commands that ship with Claude Code. Type `/` in the CLI to see them with autocomplete; this doc groups them so you know which ones matter when.

> **Note.** Not every command is available on every install — some depend on your plan, platform, or environment variables. Run `/help` to see your active list.
>
> **Skill vs. hard-coded.** Commands marked **(skill)** are implemented as skills — they hand a prompt to Claude rather than being baked into the CLI. They behave the same way from the user side, but you can inspect/override them like any other skill.

## Start here (the handful you'll use daily)

| Command | What it does |
| --- | --- |
| `/help` | List all commands available in your install. |
| `/clear` | Start a new conversation, empty context. Aliases: `/reset`, `/new`. |
| `/resume [session]` | Re-open a prior session or use the picker. Alias: `/continue`. |
| `/config` | Open settings (theme, model, output style). Alias: `/settings`. |
| `/model [name]` | Switch model. |
| `/init` | Generate a `CLAUDE.md` for this project. |
| `/plan [description]` | Drop straight into plan mode with an optional task. |
| `/compact [instructions]` | Summarize the conversation to free context. |
| `/cost` | Show session cost and usage. Aliases: `/usage`, `/stats`. |

## Session management

| Command | Description |
| --- | --- |
| `/clear` | New conversation, empty context. |
| `/resume [session]` | Pick up a prior session by name/ID. |
| `/branch [name]` | Fork the current conversation at this point. Alias: `/fork`. |
| `/rewind` | Rewind conversation and/or code to a checkpoint. Aliases: `/checkpoint`, `/undo`. |
| `/rename [name]` | Rename the current session. |
| `/recap` | One-line summary of where the session is. |
| `/export [filename]` | Export the conversation as plain text. |
| `/exit` | Quit the CLI. Alias: `/quit`. |

## Configuration

| Command | Description |
| --- | --- |
| `/config` | Main settings UI. Alias: `/settings`. |
| `/model [name]` | Choose a model (Opus/Sonnet/Haiku variants). |
| `/effort [low\|medium\|high\|xhigh\|max\|auto]` | Set model effort level. |
| `/theme` | Change color theme. |
| `/color [color\|default]` | Prompt bar color for this session only. |
| `/keybindings` | Open or create your keybindings file. |
| `/terminal-setup` | Configure terminal for Shift+Enter and friends. |
| `/tui [default\|fullscreen]` | Swap renderer mode. |
| `/statusline` | Customize the status line. |
| `/voice [hold\|tap\|off]` | Toggle voice dictation. |
| `/fast [on\|off]` | Toggle fast mode (Opus 4.6 only). |
| `/focus` | Toggle fullscreen focus view. |

## Workspace & context

| Command | Description |
| --- | --- |
| `/add-dir <path>` | Extend file access to another directory for this session. |
| `/context` | Visualize context usage with optimization hints. |
| `/compact [instructions]` | Summarize to free context. |
| `/diff` | Interactive diff viewer for uncommitted + per-turn changes. |
| `/copy [N]` | Copy last (or Nth) assistant response to clipboard. |
| `/memory` | Edit `CLAUDE.md`, view and manage auto-memory. |
| `/agents` | Manage agent configurations. |
| `/plan [description]` | Enter plan mode directly. |

## Permissions, tools, plugins

| Command | Description |
| --- | --- |
| `/permissions` | Manage allow/ask/deny rules. Alias: `/allowed-tools`. |
| `/hooks` | View current hook configuration. |
| `/mcp` | Manage MCP server connections and auth. |
| `/plugin` | Manage Claude Code plugins. |
| `/reload-plugins` | Reload plugins without restarting. |
| `/skills` | List available skills (press `t` to sort by token cost). |
| `/ide` | Manage IDE integrations. |
| `/tasks` | List/manage background tasks. Alias: `/bashes`. |

## Code review

| Command | Description |
| --- | --- |
| `/review [PR]` | Review a PR locally in this session. |
| `/security-review` | Scan pending branch changes for security issues. |
| `/diff` | Interactive diff viewer. |

## Built-in skills (the useful ones)

| Command | Description |
| --- | --- |
| `/loop [interval] [prompt]` | **(skill)** Run a prompt on a cadence (e.g. `/loop 5m /review`). Omit interval for model-paced. Alias: `/proactive`. |
| `/schedule [description]` | **(skill)** Create / list / run routines on a cron or one-time schedule. Alias: `/routines`. |
| `/batch <instruction>` | **(skill)** Fan out a large-scale change across many agents in isolated worktrees (5–30 parallel). |
| `/autofix-pr [prompt]` | Spawn a remote session that watches a PR and pushes fixes when CI or reviewers complain. |
| `/simplify [focus]` | **(skill)** Review recently-changed files for reuse/quality/efficiency and fix issues. |
| `/debug [description]` | **(skill)** Enable debug logging and help troubleshoot. |
| `/claude-api` | **(skill)** Load Claude API / Anthropic SDK reference for your project's language. |
| `/fewer-permission-prompts` | **(skill)** Scan your transcripts and add sensible allowlist entries to `.claude/settings.json`. |
| `/update-config` | **(skill)** Change `settings.json` — permissions, env vars, hooks. |
| `/keybindings-help` | **(skill)** Customize `~/.claude/keybindings.json`. |
| `/team-onboarding` | Generate an onboarding guide from your recent Claude Code usage. |
| `/insights` | Report on session patterns and friction points. |

> Rule of thumb: if the command ends in something like "-help" or "-config," it's a skill that edits files for you. If it's a verb ("review", "simplify", "debug"), it's usually a skill that drives a short workflow.

## Cloud + remote

| Command | Description |
| --- | --- |
| `/ultraplan <prompt>` | Draft a plan in a cloud session, review in browser, then execute remotely or locally. |
| `/ultrareview [PR]` | Multi-agent deep review in a cloud sandbox. |
| `/remote-control` | Expose this session for control from claude.ai. Alias: `/rc`. |
| `/teleport` | Pull a web session into this terminal. Alias: `/tp`. |
| `/desktop` | Continue this session in the Desktop app (macOS/Windows). Alias: `/app`. |
| `/web-setup` | Connect GitHub to Claude Code on the web. |

## Integrations

| Command | Description |
| --- | --- |
| `/install-github-app` | Set up the Claude GitHub Actions app on a repo. |
| `/install-slack-app` | Install the Slack app. |
| `/mobile` | Show a QR to install the mobile app. Aliases: `/ios`, `/android`. |
| `/chrome` | Chrome extension configuration. |

## Account

| Command | Description |
| --- | --- |
| `/login` / `/logout` | Sign in/out of your Anthropic account. |
| `/upgrade` | Open plan upgrade page. |
| `/extra-usage` | Configure extra usage beyond rate limits. |
| `/privacy-settings` | Adjust privacy (Pro/Max). |
| `/passes` | Share a free week with friends (if eligible). |

## Diagnostics & misc

| Command | Description |
| --- | --- |
| `/status` | Version, model, account, connectivity. |
| `/doctor` | Diagnose your installation. |
| `/release-notes` | Browse the changelog. |
| `/heapdump` | Write a JS heap snapshot to `~/Desktop` (high-memory debugging). |
| `/feedback [report]` | Submit feedback. Alias: `/bug`. |
| `/powerup` | Short interactive lessons on Claude Code features. |
| `/stickers` | Order stickers. |
| `/btw <question>` | Ask a side question that doesn't join the main conversation. |

## Environment-gated

These only appear when the relevant env var is set:

| Command | Requires |
| --- | --- |
| `/setup-bedrock` | `CLAUDE_CODE_USE_BEDROCK=1` |
| `/setup-vertex` | `CLAUDE_CODE_USE_VERTEX=1` |
| `/remote-env` | Remote environment config for web sessions. |

## Removed / renamed

| Command | Status |
| --- | --- |
| `/pr-comments [PR]` | Removed in 2.1.91 — just ask Claude to view PR comments. |
| `/vim` | Removed in 2.1.92 — use `/config` → Editor mode. |

## MCP prompts as commands

Any MCP server you connect can expose prompts that show up as `/mcp__<server>__<prompt>`. They won't appear in `/help` by default — check `/mcp` for what your servers offer.

## Where to go next

- Writing your own `/commands` → [slash-commands.md](slash-commands.md)
- Picking `/plan` vs. regular mode → [plans.md](plans.md)
- Understanding the `/agents` you see → [agents.md](agents.md)
