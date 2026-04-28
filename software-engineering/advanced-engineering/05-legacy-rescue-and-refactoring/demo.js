// Legacy Rescue and Refactoring — create a seam first.
// Run: node demo.js

const legacyPaymentModule = {
  doThing(amountInDollars, userName) {
    return `LEGACY_OK:${userName}:${amountInDollars.toFixed(2)}`;
  }
};

function legacyPaymentAdapter(legacyModule) {
  return {
    charge({ cents, customerId }) {
      const dollars = cents / 100;
      const raw = legacyModule.doThing(dollars, customerId);
      return { status: raw.startsWith('LEGACY_OK') ? 'ok' : 'error', raw };
    }
  };
}

const payments = legacyPaymentAdapter(legacyPaymentModule);
console.log(payments.charge({ cents: 2599, customerId: 'customer-42' }));
console.log('lesson: the seam lets new code depend on a stable contract before the old code is replaced.');
