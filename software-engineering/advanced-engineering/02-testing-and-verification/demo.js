// Testing and Verification — one workflow, three test boundaries.
// Run: node demo.js

function calculateLineTotal(price, qty) {
  return price * qty;
}

function shippingQuote(address) {
  return address.country === 'US' ? { cents: 500, currency: 'USD' } : { cents: 1500, currency: 'USD' };
}

function checkout(input) {
  return {
    itemTotal: calculateLineTotal(input.price, input.qty),
    shipping: shippingQuote(input.address)
  };
}

console.log('unit test: does line total multiply correctly?');
console.log(calculateLineTotal(20, 3) === 60 ? 'PASS' : 'FAIL');

console.log('\ncontract test: does shippingQuote return the agreed shape?');
const contractResult = shippingQuote({ country: 'US' });
const contractPass =
  typeof contractResult.cents === 'number' &&
  typeof contractResult.currency === 'string';
console.log(contractPass ? 'PASS' : 'FAIL', contractResult);

console.log('\nintegration test: does checkout compose item total + shipping?');
const result = checkout({ price: 20, qty: 2, address: { country: 'US' } });
const integrationPass = result.itemTotal === 40 && result.shipping.cents === 500;
console.log(integrationPass ? 'PASS' : 'FAIL', result);

console.log('\nlesson: same behavior, different confidence boundaries.');
