// Performance and Capacity — naive scan vs indexed lookup.
// Run: node demo.js

function makeOrders(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `order-${i}`,
    customerId: `customer-${i % 1000}`,
    total: (i % 17) * 10
  }));
}

const orders = makeOrders(200000);
const target = 'customer-777';

console.time('naive scan');
const naive = orders.filter(order => order.customerId === target);
console.timeEnd('naive scan');

console.time('build index');
const byCustomer = new Map();
for (const order of orders) {
  const bucket = byCustomer.get(order.customerId) ?? [];
  bucket.push(order);
  byCustomer.set(order.customerId, bucket);
}
console.timeEnd('build index');

console.time('indexed lookup');
const indexed = byCustomer.get(target) ?? [];
console.timeEnd('indexed lookup');

console.log({ naiveCount: naive.length, indexedCount: indexed.length });
console.log('lesson: measure both query speed and indexing cost.');
