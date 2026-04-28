// Database per service — two services, two private stores, API-only access
// Run: node demo.js
// One process, but each service's store is closed over and not exported.

// --- User service ---

function makeUserService() {
  const users = new Map([
    [1, { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' }],
    [2, { id: 2, name: 'Alan Turing', email: 'alan@example.com' }],
  ]);

  return Object.freeze({
    async getUser(id) {
      const u = users.get(id);
      if (!u) throw new Error(`user ${id} not found`);
      return { ...u };
    },
    async listUsers() {
      return [...users.values()].map((u) => ({ ...u }));
    },
    // No "raw access" — there is no exported reference to `users`.
  });
}

// --- Order service ---

function makeOrderService() {
  const orders = new Map([
    ['o1', { id: 'o1', userId: 1, total: 49.99 }],
    ['o2', { id: 'o2', userId: 1, total: 19.95 }],
    ['o3', { id: 'o3', userId: 2, total: 5.0 }],
  ]);

  return Object.freeze({
    async getOrder(id) {
      return { ...orders.get(id) };
    },
    async ordersForUser(userId) {
      return [...orders.values()].filter((o) => o.userId === userId).map((o) => ({ ...o }));
    },
  });
}

const userService = makeUserService();
const orderService = makeOrderService();

// --- Caller: composes data through APIs only ---
// There is no JOIN. There is no shared DB. There are two services and an aggregator.

async function userWithOrders(userId) {
  const [user, orders] = await Promise.all([
    userService.getUser(userId),
    orderService.ordersForUser(userId),
  ]);
  return { ...user, orders, totalSpent: orders.reduce((s, o) => s + o.total, 0) };
}

// --- Demo ---

(async () => {
  console.log('=== Database-per-service demo ===\n');

  console.log('Each service exposes only methods, never raw stores:');
  console.log('  userService methods:  ', Object.keys(userService));
  console.log('  orderService methods: ', Object.keys(orderService));

  console.log('\nComposing a "user with orders" view from two services:');
  console.dir(await userWithOrders(1), { depth: 3 });

  console.log('\nIf you wanted "all users with their order totals" reporting,');
  console.log('you would call both APIs and join in memory — never via SQL.');
  const all = await userService.listUsers();
  const enriched = await Promise.all(
    all.map(async (u) => ({
      ...u,
      orderCount: (await orderService.ordersForUser(u.id)).length,
    }))
  );
  console.table(enriched);

  console.log('Two services. Two private stores. No cross-database access.');
})();
