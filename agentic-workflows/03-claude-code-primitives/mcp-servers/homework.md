# Homework — MCP Servers

> Connect to a real MCP server. Then build a tiny one.

## Exercise 1: Use a real MCP server

Pick one from the [MCP server registry](https://github.com/modelcontextprotocol/servers) — `filesystem`, `sqlite`, `github`, `brave-search`, `memory`, etc.

**Constraints:**
- Pick one whose capabilities are genuinely useful for your work.
- Configure it in `mcp.json`.
- Set up permissions in `.claude/settings.json` to allow the tools you want and deny anything destructive.
- Use it in Claude Code. Note which tools fire well and which the LLM stumbles on.

If you don't have time to install a server, READ its repo and write down 3 questions you'd ask before deploying it.

## Exercise 2: Build a minimal MCP server

Build an MCP server that exposes 2-3 tools. Suggested:
- A `notes` server: `add_note`, `list_notes`, `delete_note`. Backed by a JSON file.
- A `calculator` server: `add`, `multiply`, `solve_quadratic`.
- A `prompt-templates` server: `list_templates`, `render_template(name, args)`.

**Constraints:**
- Use the official MCP SDK (Node, Python, or another supported language).
- Each tool has a strict input schema with required fields marked.
- Errors are returned as proper MCP errors, not silent nulls.
- Register it in your local Claude Code; verify Claude can use it.

## Exercise 3: Permission discipline

For your server, define permissions:
- Which tools are auto-allowed?
- Which require user confirmation each time?
- Which are denied outright?

Put this in `.claude/settings.json` and document the rationale.

**Constraint:** anything that *modifies* state should require confirmation by default. Read-only tools can be auto-allowed.

## Stretch: A custom tool that *should* be MCP

In your work, identify one capability you've integrated as a custom tool (or thought about as one) that probably belongs in an MCP server because it's reusable.

Plan the migration:
- What's the tool boundary?
- What's the auth model?
- How do you version the schema?

Write it up in 1-2 pages.

## Reflection

- MCP standardizes the *interface* between LLMs and tools. What's the analog in the web/API world? (Hint: REST/GraphQL/gRPC are interface standards for the same general purpose.)
- A custom tool inside Claude Code is "private to this client." An MCP server is "any client can use." When does that switch from value to liability?
- The MCP server registry is full of community servers. What's the trust model? (Hint: think of npm packages — the same risks apply.)

## Done when

- [ ] You've connected to at least one external MCP server (or read deeply enough to discuss it).
- [ ] You've built a minimal MCP server with 2-3 tools.
- [ ] You've defined permissions and documented your rationale.
- [ ] You can articulate when MCP wins over a custom tool and when it doesn't.

---

## Clean Code Lens

**Principle in focus:** Intention-Revealing Names + Narrow Tool Interfaces

An MCP tool name is the entire documentation available at the point of use — there is no surrounding codebase to browse, no IDE to interrogate, and the description may not be read if the name already commits the model to a choice. A tool named `render_template` communicates its contract; a tool named `process` or `handle` does not. Because MCP tools are consumed by any client that connects — not just the one you built them for — the naming standard is the same as for a public library API: the name must survive context loss.

**Exercise:** Take the 2–3 tools in your minimal MCP server and apply the "remove the description" test: with only the tool name and input schema visible, can a new LLM-based client predict what the tool does, what it returns, and when not to call it? For any tool that fails the test, rename it and tighten the schema field names until it passes.

**Reflection:** MCP standardises the interface between clients and tool servers. The homework notes that MCP tools are reusable across clients while custom tools are private to one. What is the clean code principle that governs when to extract a private helper into a shared library — and does the same heuristic apply to the decision of when to promote a custom tool to an MCP server?
