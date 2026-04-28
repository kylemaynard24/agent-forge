// BFF — two backends-for-frontends over the same shared services
// Run: node demo.js
// Same process; each BFF is just a function that shapes the response for its client.

// --- Shared backend services (generic, NOT client-specific) ---

const userService = {
  async get(id) {
    return {
      id,
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      avatarUrl: 'https://cdn.example.com/avatars/ada-1024.png',
      avatarThumbUrl: 'https://cdn.example.com/avatars/ada-64.png',
      bio: 'Mathematician and writer, chiefly known for her work on Charles Babbage\'s proposed mechanical general-purpose computer.',
      preferences: { theme: 'dark', locale: 'en-US', notifications: true },
      addresses: [
        { line1: '10 Downing St', city: 'London', country: 'UK' },
        { line1: 'Office', city: 'Cambridge', country: 'UK' },
      ],
    };
  },
};

const orderService = {
  async listFor(userId) {
    return [
      {
        id: 'o1',
        userId,
        total: 49.99,
        status: 'shipped',
        createdAt: '2026-04-20T10:00:00Z',
        items: [{ sku: 'BK-001', name: 'Notebook', qty: 2, price: 12.99 }],
        shipping: { carrier: 'UPS', trackingNumber: '1Z9999', address: 'redacted' },
      },
      {
        id: 'o2',
        userId,
        total: 19.95,
        status: 'pending',
        createdAt: '2026-04-25T08:30:00Z',
        items: [{ sku: 'PN-002', name: 'Pen', qty: 1, price: 19.95 }],
        shipping: null,
      },
    ];
  },
};

// --- BFF for web — full payload, owns its own shape ---

async function webDashboard(userId) {
  const [user, orders] = await Promise.all([userService.get(userId), orderService.listFor(userId)]);
  return {
    user, // everything the web app might want
    orders, // full nested order info
    summary: {
      orderCount: orders.length,
      totalSpent: orders.reduce((s, o) => s + o.total, 0),
    },
  };
}

// --- BFF for mobile — trimmed for bandwidth ---

async function mobileDashboard(userId) {
  const [user, orders] = await Promise.all([userService.get(userId), orderService.listFor(userId)]);
  return {
    user: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatarThumbUrl, // small image
    },
    recentOrders: orders.slice(0, 3).map((o) => ({
      id: o.id,
      total: o.total,
      status: o.status,
    })),
    summary: { orderCount: orders.length },
  };
}

// --- Demo ---

(async () => {
  console.log('=== BFF demo ===\n');

  const web = await webDashboard(42);
  const mobile = await mobileDashboard(42);

  const webBytes = Buffer.byteLength(JSON.stringify(web));
  const mobileBytes = Buffer.byteLength(JSON.stringify(mobile));

  console.log('Web BFF response:');
  console.dir(web, { depth: 4 });
  console.log(`\nWeb payload size:    ${webBytes} bytes\n`);

  console.log('Mobile BFF response:');
  console.dir(mobile, { depth: 4 });
  console.log(`\nMobile payload size: ${mobileBytes} bytes`);

  console.log(
    `\nMobile is ${Math.round((1 - mobileBytes / webBytes) * 100)}% smaller.` +
      ' Same backend services, different BFFs.'
  );
})();
