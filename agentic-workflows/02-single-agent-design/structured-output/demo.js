// Structured Output — free text vs structured for the same task.
// Run: node demo.js

// Pretend an LLM returned the following two outputs for "review this code".

// === FREE TEXT (what you get when you ask for a "review") ===
const freeText = `
Looking at this code, I see a few issues. The first is on line 42 of api.py — it's calling eval() on user input, which is a security concern (high). Also, in db.py line 78, the function does N+1 queries (medium severity). I'm fairly confident in these findings.

Files reviewed: api.py, db.py.
`;

// To consume this in a downstream tool, you'd write a regex parser.
// You'd handle line variants ("L42" vs "line 42"), tone variants, etc.
// You'd parse "fairly confident" → "med" via heuristic. Brittle.

console.log('=== FREE TEXT ===');
console.log(freeText);

// Try to parse it... ugh:
function attemptParse(text) {
  const issues = [];
  const fileLine = /(\w+\.\w+).+line\s+(\d+)/g;
  let m;
  while ((m = fileLine.exec(text)) !== null) {
    issues.push({ file: m[1], line: Number(m[2]), severity: 'unknown' });
  }
  return issues;
}
console.log('Best-effort regex parse:', attemptParse(freeText));
console.log('(Severity, message, confidence — all lost or fragile.)\n');

// === STRUCTURED OUTPUT (what you get with tool-calling) ===
const structured = {
  issues: [
    { file: 'api.py', line: 42, severity: 'high', message: 'eval() called on user input' },
    { file: 'db.py',  line: 78, severity: 'med',  message: 'N+1 query in user listing' }
  ],
  files_reviewed: ['api.py', 'db.py'],
  confidence: 'med'
};

console.log('=== STRUCTURED ===');
console.log(JSON.stringify(structured, null, 2));

// === Validation ===
function validateReview(obj) {
  const errs = [];
  if (!Array.isArray(obj.issues)) errs.push('issues must be an array');
  for (const [i, issue] of (obj.issues ?? []).entries()) {
    if (typeof issue.file !== 'string') errs.push(`issues[${i}].file not string`);
    if (typeof issue.line !== 'number') errs.push(`issues[${i}].line not number`);
    if (!['low', 'med', 'high'].includes(issue.severity)) errs.push(`issues[${i}].severity not in enum`);
    if (typeof issue.message !== 'string') errs.push(`issues[${i}].message not string`);
  }
  if (!['low', 'med', 'high'].includes(obj.confidence)) errs.push('confidence not in enum');
  if (!Array.isArray(obj.files_reviewed)) errs.push('files_reviewed must be array');
  return errs;
}

console.log('\nValidation result:', validateReview(structured));
console.log('Empty array = valid.');

// === If structured is wrong, validation tells us EXACTLY what's wrong ===
const broken = { issues: [{ file: 'x.py', line: '42', severity: 'critical' }], files_reviewed: [], confidence: 'sure' };
console.log('\nBroken structured output:', JSON.stringify(broken));
console.log('Validation result:', validateReview(broken));
console.log('You can return this to the LLM and ask it to retry with the specific errors.');

console.log(`
Lessons:
  1. Free text downstream = regex misery + lost information.
  2. Structured output = JSON.parse + schema validation.
  3. Failed validation isn't a crisis: it's a precise message you can return to the LLM.
  4. In modern APIs (Claude, OpenAI), use tool-calling natively — you don't manage the JSON yourself.
`);
