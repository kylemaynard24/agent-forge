// Peer Review and Pull Requests — comment classification simulation.
// Run: node demo.js

const pr = {
  description: 'Adds retry logic to the payment processor on transient failures',
  changedFiles: ['src/payments/processor.js', 'src/payments/processor.test.js'],
  linesChanged: 84,
};

const reviewComments = [
  {
    weight: 'blocking',
    file: 'src/payments/processor.js',
    line: 42,
    comment:
      'The retry loop has no cap on retries. If the downstream service is permanently down this will spin forever. Add a max-attempts guard and surface a clear error when it is exceeded.',
  },
  {
    weight: 'blocking',
    file: 'src/payments/processor.test.js',
    line: 11,
    comment:
      'The test only covers the happy path. There is no test for the case where all retries are exhausted. That path needs coverage before this ships.',
  },
  {
    weight: 'non-blocking',
    file: 'src/payments/processor.js',
    line: 67,
    comment:
      'The base delay is hard-coded at 500ms. Consider extracting it to a config constant so it can be adjusted in tests and production environments without a code change.',
  },
  {
    weight: 'nit',
    file: 'src/payments/processor.js',
    line: 29,
    comment:
      'nit: `attemptNumber` could be `attempt` — the "Number" suffix is redundant given the context.',
  },
  {
    weight: 'positive',
    file: 'src/payments/processor.js',
    line: 55,
    comment:
      'The jitter logic here is clean. Using Math.random() to spread retry windows is exactly the right call for avoiding thundering herd on transient failures.',
  },
];

function printReview(pr, comments) {
  console.log('PR:', pr.description);
  console.log('Files changed:', pr.changedFiles.join(', '));
  console.log('Lines changed:', pr.linesChanged);
  console.log('');

  const blocking = comments.filter(c => c.weight === 'blocking');
  const nonBlocking = comments.filter(c => c.weight === 'non-blocking');
  const nits = comments.filter(c => c.weight === 'nit');
  const positive = comments.filter(c => c.weight === 'positive');

  console.log(`BLOCKING (${blocking.length}) — must fix before merge:`);
  blocking.forEach(c => console.log(`  [${c.file}:${c.line}] ${c.comment}`));
  console.log('');

  console.log(`NON-BLOCKING (${nonBlocking.length}) — worth addressing:`);
  nonBlocking.forEach(c => console.log(`  [${c.file}:${c.line}] ${c.comment}`));
  console.log('');

  console.log(`NITS (${nits.length}) — take or leave:`);
  nits.forEach(c => console.log(`  [${c.file}:${c.line}] ${c.comment}`));
  console.log('');

  console.log(`POSITIVE (${positive.length}) — explicitly noted:`);
  positive.forEach(c => console.log(`  [${c.file}:${c.line}] ${c.comment}`));
  console.log('');

  const canMerge = blocking.length === 0;
  console.log('Verdict:', canMerge ? 'Approve' : `Blocked — ${blocking.length} issue(s) must be resolved`);
}

printReview(pr, reviewComments);
