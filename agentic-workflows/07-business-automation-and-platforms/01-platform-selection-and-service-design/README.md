# Platform Selection and Service Design

**Category:** Business automation and agent platforms

## Intent

Choose the right delivery platform for the job instead of defaulting to the tool you learned first.

## Why this matters

In client work, the wrong platform choice can hurt you twice:

1. it slows the build
2. it ruins the margin on maintenance

The useful question is not "which tool is best?" The useful question is "which tool fits this workflow, this client's tolerance, this team's skill set, and this support model?"

## The main families in this stage

| Family | Best for | Typical trade-off |
| --- | --- | --- |
| `n8n` | flexible orchestrations, self-hosting, AI + APIs + custom logic | stronger power, more responsibility |
| `Make` | visually rich business automation with branching and transforms | fast builds, but platform dependence and cost can creep |
| `Zapier` | very fast internal workflows and broad app coverage | easiest start, but least attractive for complex logic and margin-sensitive work |
| `Flowise` / `Langflow` / `Dify` | visual AI apps, chatflows, RAG, agent builders | faster AI prototyping, but another layer to govern and debug |
| code-first stack | teams with engineering capacity and long-lived product needs | most control, slowest initial delivery |

## What to evaluate before choosing

### Delivery model

- Are you building a one-off internal workflow, a repeatable productized service, or a platform you will support for years?
- Who owns the system after launch: you, the client, or a mixed team?

### Control surface

- Do you need self-hosting?
- Do you need git-friendly change control?
- Do you need custom code, branching, retries, and queue-like behavior?

### Business fit

- Can the client pay for the recurring platform cost?
- Will the tool support your margin if you manage many small automations?
- Can a non-engineer on the client side safely operate it later?

### Risk profile

- How visible are failures?
- How easy is rollback?
- How painful is vendor lock-in?
- How portable is the workflow logic if you outgrow the platform?

## A practical selection rule

Start by asking what the workflow is **mostly** made of:

- business app plumbing -> start with **Zapier** or **Make**
- API-heavy, custom, or self-hosted orchestration -> start with **n8n**
- AI application flows and agent prototyping -> start with **Flowise**, **Langflow**, or **Dify**
- long-lived product differentiation -> bias toward a **code-first** stack, possibly with automation tools around the edges

## Service-design lens

When you are building a business, platform choice affects your offer structure:

- **fastest delivery offer** -> Zapier or Make
- **custom automation retainers** -> n8n
- **AI prototype / chatbot offer** -> Flowise, Langflow, or Dify
- **product buildout** -> code-first with selective platform usage

The tool is part of the service design, not just an implementation detail.

## Resource shelf

- n8n docs: <https://docs.n8n.io/>
- Make help center: <https://www.make.com/en/help>
- Zapier learning resources: <https://zapier.com/learn>
- Flowise docs: <https://docs.flowiseai.com/>
- Langflow docs: <https://docs.langflow.org/>
- Dify docs: <https://docs.dify.ai/>
- YouTube search — `n8n tutorial`: <https://www.youtube.com/results?search_query=n8n+tutorial>
- YouTube search — `Make.com tutorial`: <https://www.youtube.com/results?search_query=make.com+tutorial>
- YouTube search — `Zapier tutorial`: <https://www.youtube.com/results?search_query=zapier+tutorial>
- YouTube search — `Flowise tutorial`: <https://www.youtube.com/results?search_query=flowise+tutorial>
- YouTube search — `Langflow tutorial`: <https://www.youtube.com/results?search_query=langflow+tutorial>
- YouTube search — `Dify tutorial`: <https://www.youtube.com/results?search_query=dify+tutorial>

## Anti-patterns

- choosing a platform because it looks impressive in a sales call
- choosing an AI builder when the workflow is mostly CRUD and notifications
- choosing Zapier for a workflow that obviously needs loops, branching, and custom control
- choosing n8n for a client who will panic the first time they see operational settings
- choosing a platform without considering who debugs it at 2 a.m.

## Rule of thumb

**Optimize for the maintenance model, not the demo.**

## Run the demo

```bash
node demo.js
```

## Scenario questions

### Scenario 1 — "A small client wants quick results and uses common SaaS apps"

**Question:** Should your first instinct be a heavy self-hosted stack?

**Answer:** Usually no.

**Explanation:** If the main need is fast movement across common apps, simpler hosted automation tools often beat more flexible platforms.

### Scenario 2 — "A workflow needs custom APIs, AI steps, and serious failure handling"

**Question:** Is that a sign to move beyond the easiest beginner tool?

**Answer:** Usually yes.

**Explanation:** Once control, retries, and custom integration matter, platform depth often beats onboarding speed.
