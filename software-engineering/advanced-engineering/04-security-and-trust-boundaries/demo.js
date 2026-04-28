// Security and Trust Boundaries — authn is not authz.
// Run: node demo.js

const invoices = {
  inv1: { tenantId: 'acme', amount: 1200 },
  inv2: { tenantId: 'globex', amount: 950 }
};

function insecureGetInvoice(user, invoiceId) {
  if (!user) return { error: 'unauthenticated' };
  return invoices[invoiceId] ?? { error: 'missing' };
}

function secureGetInvoice(user, invoiceId) {
  if (!user) return { error: 'unauthenticated' };
  const invoice = invoices[invoiceId];
  if (!invoice) return { error: 'missing' };
  if (invoice.tenantId !== user.tenantId) return { error: 'forbidden' };
  return invoice;
}

const acmeUser = { id: 'u1', tenantId: 'acme' };

console.log('insecure access:', insecureGetInvoice(acmeUser, 'inv2'));
console.log('secure access:', secureGetInvoice(acmeUser, 'inv2'));
console.log('lesson: authentication says who you are; authorization says what you may touch.');
