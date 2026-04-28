# MCP Servers

**Category:** Claude Code primitives

## What they are

**MCP** (Model Context Protocol) is a standard way to expose tools and data sources to LLMs. An **MCP server** is a process that speaks MCP and provides:

- **Tools** that the LLM can call.
- **Resources** that the LLM can read (files, query results).
- **Prompts** that the LLM can use as templates.

Claude Code can connect to MCP servers and surface their tools as if they were built-in. Connect a Postgres MCP server, and now Claude has a `query` tool that runs against your DB. Connect a Slack MCP server, and Claude can post messages.

It's the "USB-C of LLM tools" — a uniform plug for arbitrary capabilities.

## Why this matters

Without MCP, every tool you want to expose to Claude requires custom integration in the harness. With MCP:

- Anyone can write a server.
- Servers are reusable across LLM clients (Claude Code, Anthropic Claude.app, Cursor, etc.).
- Tool schemas, descriptions, error contracts are standardized.

For agentic workflow design, this changes who builds tools: not just the harness developer, but anyone with a capability to expose.

## Server types

MCP servers come in flavors based on transport:

- **stdio** — the server is a process the harness spawns; communication via stdin/stdout. Simple for local dev.
- **HTTP / SSE** — server is hosted; harness connects over the network. Right for shared tools.

## Examples of MCP servers in the wild

- **Filesystem** — read/write files (with allowlists).
- **Postgres / SQLite** — query databases.
- **GitHub** — list issues, comment on PRs, manage repos.
- **Slack** — post messages, list channels.
- **Brave Search** — web search.
- **Memory / KV stores** — persistent agent memory.
- Hundreds of community servers across language runtimes.

## Why design tools as MCP servers

If you're going to expose a capability to an LLM, MCP gives you:

- **Reusability** — works in Claude Code today, your other LLM tooling tomorrow.
- **Standard schema** — JSON Schema for inputs; standardized error shapes.
- **Discoverability** — servers can advertise their tools dynamically.
- **Security boundary** — the server is a separate process; you can sandbox it, log it, audit it.

If you're prototyping, sometimes a quick custom tool is fine. For anything you'd reuse, MCP wins.

## How they integrate with Claude Code

Configure servers in `mcp.json` (or via `/mcp` commands). Once registered, their tools appear in Claude's tool list, indistinguishable (to the model) from built-in tools — but with a namespace prefix like `mcp__server-name__tool-name`.

Permission rules apply per-tool: you can allow `mcp__github__list_issues` while denying `mcp__github__delete_repo`.

## When to write an MCP server

- You have a *reusable* capability (DB access, internal API, etc.).
- You want it usable from multiple LLM clients.
- The capability deserves its own process for security or operational reasons.
- A custom tool would proliferate awkwardly.

## When not to

- One-off, project-specific tools — a slash command or skill is fine.
- Tools that need rich access to the host process (rare in MCP's model).
- Latency-critical paths where IPC overhead matters.

## Anti-patterns

- **An MCP server with one tool.** Could be a slash command or skill. Don't over-architect.
- **A general-purpose "swiss army knife" server.** A `do_anything` tool defeats the schema benefits.
- **An MCP server with no auth.** If it can read your DB, it can also be reached by anything else on your machine.

## Trade-offs

**Pros**
- Reusable across clients.
- Standardized.
- Process boundary = security boundary.

**Cons**
- More moving parts (a separate process to maintain).
- Higher latency than in-process tools.
- Versioning surface (server protocol vs your client).

**Rule of thumb:** Build a custom tool first. If you find yourself wanting it elsewhere, port to MCP. (Note for AI app builders: if you're building **with the Claude API directly** rather than Claude Code, you'd implement tools using Anthropic's SDK tool-use primitive, not MCP — MCP is the right primitive when you want to plug into existing LLM clients.)

## Real-world analogies

- A REST API: a long-running process that exposes capabilities over a wire protocol. MCP is "REST for LLM tools."
- A printer driver: standardizes how programs talk to printers. MCP standardizes how LLMs talk to tools.

## Run the demo

```bash
node demo.js
```

The demo isn't a runnable MCP server (that's beyond a 100-line demo). It's an annotated config file showing how an MCP server is registered with Claude Code, plus a sketch of what a minimal MCP server looks like.
