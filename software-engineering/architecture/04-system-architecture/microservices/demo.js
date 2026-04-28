// Microservices — two services in one process, talking ONLY over a network channel.
// Run: node demo.js
//
// We simulate "the network" with a function that serializes/deserializes JSON
// and adds simulated latency. The point is to make the cost of distribution visible.

// === Network simulator ===
async function networkCall(handler, request) {
  await new Promise(r => setTimeout(r, 5));            // simulated latency
  const body = JSON.parse(JSON.stringify(request));    // serialize/deserialize
  const response = await handler(body);
  return JSON.parse(JSON.stringify(response));
}

// === Service A: USERS ===
// Owns its own data. Exposes one HTTP endpoint.
const usersData = new Map();
let userCounter = 0;
async function usersHandler(req) {
  if (req.path === 'POST /users') {
    const id = `u-${++userCounter}`;
    usersData.set(id, { id, name: req.body.name });
    return { status: 201, body: { id } };
  }
  if (req.path === 'GET /users/:id') {
    const u = usersData.get(req.params.id);
    return u ? { status: 200, body: u } : { status: 404, body: { error: 'not found' } };
  }
  return { status: 404, body: { error: 'no route' } };
}

// === Service B: ORDERS ===
// Owns its OWN data. Has NO direct access to user data.
const ordersData = [];
let orderCounter = 0;

async function ordersHandler(req) {
  if (req.path === 'POST /orders') {
    // Cross-service call: we need to verify the user exists.
    const userResp = await networkCall(usersHandler, {
      path: 'GET /users/:id', params: { id: req.body.userId }
    });
    if (userResp.status !== 200) {
      return { status: 400, body: { error: 'unknown user' } };
    }
    const id = `o-${++orderCounter}`;
    ordersData.push({ id, userId: req.body.userId, total: req.body.total });
    return { status: 201, body: { id } };
  }
  if (req.path === 'GET /orders') {
    // To enrich orders with user names, we make N more network calls (N+1 problem!)
    const enriched = [];
    for (const o of ordersData) {
      const userResp = await networkCall(usersHandler, {
        path: 'GET /users/:id', params: { id: o.userId }
      });
      enriched.push({ ...o, userName: userResp.status === 200 ? userResp.body.name : '?' });
    }
    return { status: 200, body: enriched };
  }
  return { status: 404, body: { error: 'no route' } };
}

// === "Client" (some other service or UI) ===
(async () => {
  const u = await networkCall(usersHandler, { path: 'POST /users', body: { name: 'Kyle' } });
  console.log('Created user:', u);

  const o1 = await networkCall(ordersHandler, { path: 'POST /orders', body: { userId: u.body.id, total: 50 } });
  const o2 = await networkCall(ordersHandler, { path: 'POST /orders', body: { userId: u.body.id, total: 80 } });
  console.log('Created orders:', o1, o2);

  console.log('\nList orders enriched with user names (network calls per order!):');
  const list = await networkCall(ordersHandler, { path: 'GET /orders', body: {} });
  console.log(list);

  console.log('\nNotice: every cross-service step is a network call.');
  console.log('Latency, retries, partial failures, version skew all become design problems.');
})();
