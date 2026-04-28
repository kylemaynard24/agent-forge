// Observability — a tiny tracer + counter + structured logger.
// Run: node demo.js

let nextSpanId = 1;

class Tracer {
  constructor() { this.spans = []; this.stack = []; }

  startSpan(name, attrs = {}) {
    const span = {
      id: nextSpanId++,
      parentId: this.stack.length ? this.stack[this.stack.length - 1].id : null,
      name,
      attrs,
      startedAt: Date.now(),
      endedAt: null,
      children: [],
    };
    if (span.parentId !== null) {
      const parent = this.spans.find((s) => s.id === span.parentId);
      parent.children.push(span);
    }
    this.spans.push(span);
    this.stack.push(span);
    return span;
  }

  endSpan() {
    const span = this.stack.pop();
    if (!span) return;
    span.endedAt = Date.now();
  }

  printTree() {
    const roots = this.spans.filter((s) => s.parentId === null);
    const draw = (s, depth) => {
      const pad = '  '.repeat(depth);
      const dur = (s.endedAt ?? Date.now()) - s.startedAt;
      const attrs = Object.keys(s.attrs).length
        ? ' ' + JSON.stringify(s.attrs)
        : '';
      console.log(`${pad}- ${s.name} [${dur}ms]${attrs}`);
      for (const c of s.children) draw(c, depth + 1);
    };
    for (const r of roots) draw(r, 0);
  }
}

class Counter {
  constructor(name) { this.name = name; this.value = 0; }
  inc(by = 1) { this.value += by; }
  read() { return { name: this.name, value: this.value }; }
}

function logEvent(level, msg, fields = {}) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    msg,
    ...fields,
  });
  console.log(line);
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

const tracer = new Tracer();
const requestsHandled = new Counter('requests_handled_total');

async function dbQuery(sql) {
  tracer.startSpan('db.query', { sql });
  await sleep(15);
  tracer.endSpan();
  return [{ id: 1 }];
}

async function callPricingApi() {
  tracer.startSpan('http.client', { peer: 'pricing-svc' });
  await sleep(25);
  tracer.endSpan();
  return { price: 1299 };
}

async function handleRequest(reqId, userId) {
  const root = tracer.startSpan('http.server', { route: '/checkout', reqId, userId });
  try {
    await dbQuery('SELECT * FROM cart WHERE user = ?');
    await callPricingApi();
    await sleep(5);
    requestsHandled.inc();
    logEvent('info', 'request handled', { reqId, userId, route: '/checkout', durationMs: Date.now() - root.startedAt });
  } finally {
    tracer.endSpan();
  }
}

async function main() {
  console.log('=== Observability demo ===\n');

  console.log('--- structured logs ---');
  await handleRequest('req-1', 'u-7');
  await handleRequest('req-2', 'u-7');

  console.log('\n--- counter ---');
  console.log(requestsHandled.read());

  console.log('\n--- trace tree ---');
  tracer.printTree();

  console.log('\nNote: in production, traces ship to a collector (OTLP), metrics to Prometheus,');
  console.log('and logs to a structured aggregator. The shapes are the same as above.');
}

main();
