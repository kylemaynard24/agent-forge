// Pipes and Filters — text-processing pipeline.
// Run: node demo.js

// === Filters: small, single-purpose, composable. ===

const lowercase   = s => s.toLowerCase();
const stripPunct  = s => s.replace(/[.,!?;:'"()]/g, '');
const tokenize    = s => s.split(/\s+/).filter(Boolean);
const countWords  = tokens => {
  const counts = new Map();
  for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
  return counts;
};
const top = n => counts =>
  [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

// === Pipe: compose filters left-to-right. ===
// pipe(f, g, h)(x)  ==  h(g(f(x)))
const pipe = (...fns) => x => fns.reduce((acc, f) => f(acc), x);

// === Pipeline 1: top words ===
const topWords = pipe(lowercase, stripPunct, tokenize, countWords, top(3));

const text = `
  The quick brown fox jumps over the lazy dog.
  The dog sleeps. The fox runs! The fox runs again!
`;

console.log('Top 3 words:', topWords(text));

// === Pipeline 2: same filters, different shape ===
// Just words, no count. Notice: same filters, no edits.
const wordList = pipe(lowercase, stripPunct, tokenize);
console.log('\nWord list (first 8):', wordList(text).slice(0, 8));

// === Pipeline 3: insert a stage ===
// Add a "remove stop words" filter without editing other filters.
const STOP = new Set(['the', 'a', 'an', 'over']);
const removeStop = tokens => tokens.filter(t => !STOP.has(t));

const topWordsNoStop = pipe(lowercase, stripPunct, tokenize, removeStop, countWords, top(3));
console.log('\nTop 3 words (no stopwords):', topWordsNoStop(text));

// === Pipeline 4: parallel application ===
// Two pipelines share a prefix; we can compute both off the same intermediate.
const cleaned = pipe(lowercase, stripPunct, tokenize)(text);
console.log('\nFrom cached intermediate:');
console.log('  count:', countWords(cleaned).size, 'distinct words');
console.log('  total tokens:', cleaned.length);

console.log('\nThe filters are pure, single-purpose, reusable. The pipeline is just composition.');
