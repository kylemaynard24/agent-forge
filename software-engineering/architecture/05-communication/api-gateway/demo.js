// API Gateway — routing, auth, aggregation
// Run: node demo.js
// Backend services are simulated as in-process async functions.

// --- Backend services ---

const usersService = {
  async getUser(id) {
    await sleep(60);
    const users = { 1: { id: 1, name: 'Ada', email: 'ada@example.com' } };
    if (!users[id]) throw new Error('user not found');
    return users[id];
  },
};

const ordersService = {
  async listOrdersForUser(userId) {
    await sleep(80);
    return [
      { id: 'o1', userId, total: 49.99 },
      { id: 'o2', userId, total: 19.95 },
    ];
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Gateway ---

class ApiGateway {
  #routes = new Map();
  #middlewares = [];

  use(mw) {
    this.#middlewares.push(mw);
  }

  route(method, path, handler) {
    this.#routes.set(`${method} ${path}`, handler);
  }

  async handle(req) {
    // Run cross-cutting middleware (auth, logging, rate-limit).
    for (const mw of this.#middlewares) {
      const blocked = await mw(req);
      if (blocked) return blocked;
    }
    const handler = this.#routes.get(`${req.method} ${req.path}`);
    if (!handler) return { status: 404, body: { error: 'no route' } };
    try {
      const body = await handler(req);
      return { status: 200, body };
    } catch (err) {
      return { status: 500, body: { error: err.message } };
    }
  }
}

// --- Wire it up ---

const gateway = new ApiGateway();

// Auth middleware — single place, applies to every route.
gateway.use(async (req) => {
  if (req.headers.authorization !== 'Bearer secret') {
    return { status: 401, body: { error: 'unauthorized' } };
  }
});

// Routes
gateway.route('GET', '/users/:id', async (req) => usersService.getUser(req.params.id));
gateway.route('GET', '/orders', async (req) => ordersService.listOrdersForUser(req.query.userId));

// Aggregation route — one client call, many backend calls in parallel.
gateway.route('GET', '/dashboard', async (req) => {
  const [user, orders] = await Promise.all([
    usersService.getUser(req.query.userId),
    ordersService.listOrdersForUser(req.query.userId),
  ]);
  return { user, orders, total: orders.reduce((s, o) => s + o.total, 0) };
});

// --- Demo ---

(async () => {
  console.log('=== API Gateway demo ===\n');

  const make = (path, opts = {}) => ({
    method: 'GET',
    path,
    headers: opts.auth ? { authorization: 'Bearer secret' } : {},
    params: opts.params || {},
    query: opts.query || {},
  });

  console.log('1) No auth header:');
  console.log('  ', await gateway.handle(make('/users/:id', { params: { id: 1 } })));

  console.log('\n2) Authed user lookup:');
  console.log('  ', await gateway.handle(make('/users/:id', { auth: true, params: { id: 1 } })));

  console.log('\n3) Aggregated dashboard (gateway calls both backends in parallel):');
  const start = Date.now();
  const dash = await gateway.handle(make('/dashboard', { auth: true, query: { userId: 1 } }));
  console.log(`   took ${Date.now() - start}ms (sequential would be ~140ms)`);
  console.log('  ', dash);

  console.log('\nClients see one URL. Internally, the gateway routed and aggregated.');
})();
