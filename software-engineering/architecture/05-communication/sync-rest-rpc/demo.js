// Synchronous REST/RPC — tiny HTTP server + client
// Run: node demo.js
// Both server and client run in the same process for clarity.

const http = require('http');

// --- Server ---

const users = {
  1: { id: 1, name: 'Ada Lovelace' },
  2: { id: 2, name: 'Alan Turing' },
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname.startsWith('/users/')) {
    const id = url.pathname.split('/')[2];
    const user = users[id];
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'not found' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(user));
  }

  if (req.method === 'POST' && url.pathname === '/users') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const parsed = JSON.parse(body);
      const id = Object.keys(users).length + 1;
      const user = { id, ...parsed };
      users[id] = user;
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

// --- Client ---

function request(port, method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        method,
        path,
        headers: data
          ? { 'Content-Type': 'application/json', 'Content-Length': data.length }
          : {},
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () =>
          resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null })
        );
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function timed(label, fn) {
  const start = Date.now();
  const result = await fn();
  console.log(`${label} -> ${Date.now() - start}ms`, result);
}

// --- Demo ---

server.listen(0, async () => {
  const { port } = server.address();
  console.log(`=== Sync REST/RPC demo (server on :${port}) ===\n`);

  await timed('GET /users/1   ', () => request(port, 'GET', '/users/1'));
  await timed('GET /users/999 ', () => request(port, 'GET', '/users/999'));
  await timed('POST /users    ', () =>
    request(port, 'POST', '/users', { name: 'Grace Hopper' })
  );
  await timed('GET /users/3   ', () => request(port, 'GET', '/users/3'));

  console.log('\nThe caller blocked on each response. That is the defining feature.');
  server.close();
});
