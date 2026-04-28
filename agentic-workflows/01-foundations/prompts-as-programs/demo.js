// Prompts as Programs — composition vs kitchen sink.
// Run: node demo.js

// === Reusable building blocks (modules) ===

const roles = {
  research_assistant: `You are a research assistant. Your goal is to gather, evaluate, and summarize information from authoritative sources.`,
  code_reviewer:      `You are a senior code reviewer. Your goal is to find correctness, security, and performance issues, in that order.`
};

const capabilities = (tools) => `You have access to the following tools:\n` +
  tools.map(t => `- ${t.name}: ${t.description}`).join('\n');

const operating_rules = `## Operating rules

You MUST:
- Use a tool whenever the answer requires information you don't yet have.
- Cite sources when summarizing.
- Stop and ask if the goal is ambiguous, instead of guessing.

You MUST NOT:
- Speculate beyond what your sources support.
- Continue past 10 tool calls without checkpointing.`;

const output_format = `## Output format

When you have a final answer, call the \`finish\` tool with:
- summary: a 2-3 sentence answer
- key_facts: an array of facts, each with source
- confidence: low | medium | high`;

const examples = `## Examples

Good response:
{
  "summary": "Postgres 16 added logical replication of partitioned tables...",
  "key_facts": [{ "fact": "Available in 16.0", "source": "https://..." }],
  "confidence": "high"
}

Bad response (no source, vague):
{ "summary": "Postgres can replicate things.", "key_facts": [], "confidence": "high" }`;

// === Compose a clean prompt ===

function composePrompt({ role, tools }) {
  return [
    roles[role],
    capabilities(tools),
    operating_rules,
    output_format,
    examples
  ].join('\n\n');
}

const tools = [
  { name: 'web_search', description: 'Search the web. Returns top 5 results with snippets.' },
  { name: 'fetch_url',  description: 'Fetch a URL and return its text content.' },
  { name: 'finish',     description: 'Submit final answer (see output format).' }
];

const composed = composePrompt({ role: 'research_assistant', tools });

console.log('=== COMPOSED PROMPT ===\n');
console.log(composed);
console.log('\nLength:', composed.length, 'characters');

// === Anti-example: "kitchen sink" prompt — same role, but messy ===

const kitchen = `Hi! Please act as a helpful and professional assistant who is friendly and accurate. You should research things using your tools (we have search, fetch_url, finish) and try to be smart about it. Always be careful, but also be fast. Don't speculate but feel free to give your best guess if you're not sure. Cite when you can. Use the finish tool at the end with a summary, facts, and confidence (low/medium/high). Don't be too short, but also be concise. Make it good!`;

console.log('\n\n=== KITCHEN-SINK PROMPT (anti-pattern) ===\n');
console.log(kitchen);
console.log('\nLength:', kitchen.length, 'characters');

console.log('\n--- Compare ---');
console.log('1. The composed prompt is structured: a model reading it has section headings to anchor on.');
console.log('2. The kitchen-sink prompt has internal contradictions ("careful but fast", "not too short but concise").');
console.log('3. The composed prompt is *modular*: swap roles[research_assistant] for roles[code_reviewer], reuse the rest.');
console.log('4. Versioning the composed prompt = versioning each block. The kitchen-sink is one ball of string.');
