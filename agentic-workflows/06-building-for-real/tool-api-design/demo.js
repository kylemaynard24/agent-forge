// Tool API Design — versioning, error contract, idempotency.
// Run: node demo.js

// === Convention: every tool returns either { ok: true, value } or { ok: false, error: { code, message, retryable, hint? } }
// === Errors are enumerated codes.

// === V1 of a tool — naive ===
function chargeCardV1(amount) {
  if (typeof amount !== 'number') throw new Error('amount must be number');
  if (amount <= 0) return null;            // <- inconsistent with throw
  // ... charge ...
  return { txId: 'tx-' + Math.random().toString(36).slice(2, 8) };
}

// Caller has to handle: null, throw, returned object. Inconsistent.

// === V2 — disciplined ===
const idempotencyKeys = new Map();

function chargeCardV2({ amount, currency, idempotency_key }) {
  if (typeof amount !== 'number') {
    return { ok: false, error: { code: 'invalid_input', message: 'amount must be number', retryable: false } };
  }
  if (amount <= 0) {
    return { ok: false, error: { code: 'invalid_input', message: 'amount must be positive', retryable: false } };
  }
  if (idempotency_key && idempotencyKeys.has(idempotency_key)) {
    return idempotencyKeys.get(idempotency_key);    // replay cached response
  }
  const result = { ok: true, value: { txId: 'tx-' + Math.random().toString(36).slice(2, 8) } };
  if (idempotency_key) idempotencyKeys.set(idempotency_key, result);
  return result;
}

// === Demo ===

console.log('=== V1 (naive) ===');
console.log(chargeCardV1(50));
try { console.log(chargeCardV1('bad')); } catch (e) { console.log('throw:', e.message); }
console.log(chargeCardV1(-5));
console.log('Caller has to handle: object, exception, null. Three different shapes for "result".\n');

console.log('=== V2 (disciplined) ===');
console.log(chargeCardV2({ amount: 50, currency: 'USD' }));
console.log(chargeCardV2({ amount: 'bad' }));
console.log(chargeCardV2({ amount: -5 }));
console.log('All three return { ok, value? | error? }. Agent learns one shape.\n');

console.log('=== Idempotency in action ===');
const r1 = chargeCardV2({ amount: 100, currency: 'USD', idempotency_key: 'order-42' });
const r2 = chargeCardV2({ amount: 100, currency: 'USD', idempotency_key: 'order-42' });
console.log('First:  ', r1);
console.log('Replay: ', r2);
console.log(`Same txId? ${r1.value.txId === r2.value.txId}  (idempotent: yes)`);

console.log(`
Take note:
  - One result shape across all tools = simpler agent code, fewer edge cases.
  - Enumerated error codes (invalid_input, transient, etc.) drive loop policy.
  - Idempotency keys make retries safe — the agent can retry without double-charging.
  - Schema evolution: v1 and v2 coexist; new agents use v2, old agents still work.
  - This is REST API discipline applied to LLM tools. Same shape, same wins.
`);
