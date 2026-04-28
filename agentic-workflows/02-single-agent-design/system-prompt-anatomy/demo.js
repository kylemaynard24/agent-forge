// System Prompt Anatomy — six named blocks, composed.
// Run: node demo.js

// === Reusable BLOCKS ===

const role = {
  security_reviewer: `You are a senior security reviewer. Your purpose is to identify vulnerabilities in code changes before they merge.`,
  perf_reviewer:     `You are a senior performance reviewer. Your purpose is to identify performance regressions in code changes.`
};

const capabilities = (toolNames) => `You have access to:\n${toolNames.map(n => `- ${n}`).join('\n')}`;

const rules = `## Operating rules

You MUST cite file:line for every issue you raise.
You MUST NOT edit code; you only review.
When unsure: ask one clarifying question and stop.`;

const output_format = `## Output format

Submit via finish() with JSON matching:
{
  "issues": [{ "file": string, "line": number, "severity": "low"|"med"|"high", "message": string }],
  "files_reviewed": [string],
  "confidence": "low" | "med" | "high"
}`;

const examples = `## Example

Clean review:
{ "issues": [], "files_reviewed": ["a.py"], "confidence": "high" }

One issue:
{ "issues": [{ "file": "x.py", "line": 42, "severity": "med", "message": "eval() with user input" }],
  "files_reviewed": ["x.py"], "confidence": "high" }`;

const edge_cases = `## Edge cases

If the diff contains secrets: do NOT include the secret value. Mark severity "high".
If asked to review yourself: refuse politely.`;

// === Composer ===

function composePrompt({ roleKey, tools }) {
  return [
    role[roleKey],
    capabilities(tools),
    rules,
    output_format,
    examples,
    edge_cases
  ].join('\n\n');
}

// === Compose two agents from shared blocks ===

const tools = ['Read(path)', 'Grep(query)', 'finish(report)'];

const securityPrompt = composePrompt({ roleKey: 'security_reviewer', tools });
const perfPrompt     = composePrompt({ roleKey: 'perf_reviewer',     tools });

console.log('=== SECURITY-REVIEWER PROMPT ===\n');
console.log(securityPrompt);
console.log(`\nLength: ${securityPrompt.length} chars\n`);

console.log('=== PERF-REVIEWER PROMPT ===\n');
console.log(perfPrompt);
console.log(`\nLength: ${perfPrompt.length} chars\n`);

console.log('--- Composition payoff ---');
console.log('Two agents, ONE block changed (role). Rules, output format, examples, and edge cases reused.');
console.log('Want to add a "readability-reviewer"? Add one role[…] entry, done.');
console.log('Want to tighten the rules globally? Edit `rules`, all agents get the update.');
