// Debugging and Diagnostics — a tiny evidence-first debugging demo.
// Run: node demo.js

function calculateCheckoutTotal(items, taxRatePercent) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * taxRatePercent; // bug: taxRatePercent should be decimal-normalized
  return subtotal + tax;
}

const cart = [
  { name: 'book', price: 20, qty: 2 },
  { name: 'pen', price: 5, qty: 1 }
];

console.log('symptom: checkout total looks wildly too high');

const total = calculateCheckoutTotal(cart, 8.25);
console.log('observed total:', total);

console.log('\nstep 1: sharpen the expectation');
const expectedSubtotal = 45;
const expectedTax = expectedSubtotal * 0.0825;
console.log('expected subtotal:', expectedSubtotal);
console.log('expected tax:', expectedTax.toFixed(2));
console.log('expected total:', (expectedSubtotal + expectedTax).toFixed(2));

console.log('\nstep 2: inspect intermediate values');
const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
console.log({ subtotal, taxRatePercent: 8.25, computedTax: subtotal * 8.25 });

console.log('\nstep 3: state the root cause');
console.log('root cause: the function treats 8.25 as 825%, not 8.25%.');

function calculateCheckoutTotalFixed(items, taxRatePercent) {
  const subtotalFixed = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxFixed = subtotalFixed * (taxRatePercent / 100);
  return subtotalFixed + taxFixed;
}

console.log('\nfixed total:', calculateCheckoutTotalFixed(cart, 8.25).toFixed(2));
