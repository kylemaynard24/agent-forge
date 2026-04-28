// DRY / KISS / YAGNI — and a wrong-DRY abstraction being unwound.
// Run: node demo.js

// === ROUND 1: two functions, slightly different ===

function priceForCustomer(items)  { return items.reduce((s, i) => s + i.price, 0) * 1.0;  } // no tax
function priceForBusiness(items)  { return items.reduce((s, i) => s + i.price, 0) * 1.21; } // 21% VAT

// "Hey, these look almost identical. Let's DRY them up." (Often premature.)

// === ROUND 2: hasty abstraction ===

function priceWithMultiplier(items, mult) {
  return items.reduce((s, i) => s + i.price, 0) * mult;
}
// Fine for now. But the "knowledge" they share is "sum the prices" — NOT "multiply
// by a factor." We've couplied two distinct business rules to a generic shape.

// === ROUND 3: requirements drift, the abstraction grows flags ===

function priceWithMultiplierAndDiscount(items, mult, { discount = 0, freeShipping = false } = {}) {
  let total = items.reduce((s, i) => s + i.price, 0);
  total *= mult;
  total -= total * discount;
  if (freeShipping) total -= 10;          // a free-shipping discount lives here now??
  return total;
}
// This is *worse* than two separate functions. Every caller has to remember which
// flags apply to them. New requirement = new flag = more risk for unrelated callers.

// === ROUND 4: undo the wrong DRY ===

const subtotal = items => items.reduce((s, i) => s + i.price, 0);

function priceForCustomerV2(items) {
  return subtotal(items);                      // no tax
}

function priceForBusinessV2(items) {
  return subtotal(items) * 1.21;               // 21% VAT
}

function priceForLoyaltyMemberV2(items) {
  return subtotal(items) * 0.9 - 10;           // 10% off + free shipping
}

// We DRY'd what's actually shared (the subtotal computation, a real piece of
// arithmetic). We did NOT DRY the per-customer-type policies, because each
// is its own rule.

// === Demo ===

const items = [{ price: 100 }, { price: 50 }];

console.log('Customer  :', priceForCustomerV2(items));
console.log('Business  :', priceForBusinessV2(items));
console.log('Loyalty   :', priceForLoyaltyMemberV2(items));

console.log('\nLesson: DRY shared *knowledge*, not shared *shape*.');

// === YAGNI illustration ===
// Imagine someone wrote a `PricingEngine` plugin system in v1 for "future flexibility."
// Two years in, they have one plugin (default) and zero hypothetical second plugins.
// The plugin system is dead weight that complicates onboarding.
// YAGNI: when in doubt, don't build the framework. Build the feature.

// === KISS illustration ===
// `subtotal` is a 1-line reduce. We *could* have built a chain of functors and
// monoids to "generalize summing." We didn't. KISS.
