# Security and Trust Boundaries

**Category:** Advanced engineer track

## Intent

Make the system explicit about who is trusted, what is allowed, and where input must be validated or rejected. Security is mostly boundary clarity under adversarial conditions.

## When to use

- Users, services, or tenants have different permissions
- Input crosses trust boundaries
- Secrets or tokens exist anywhere in the system
- The cost of being wrong is higher than a normal bug

## What this area trains

- threat modeling
- authentication versus authorization thinking
- input validation and output handling
- secrets hygiene
- multi-tenant and least-privilege design

## Trade-offs

**Pros**
- Fewer catastrophic surprises
- Cleaner boundaries and ownership
- Better design decisions before code exists

**Cons**
- More up-front friction
- Stricter controls can slow development if poorly designed
- Security work often feels invisible when it succeeds

## Rule of thumb

If you cannot draw the trust boundary, you probably cannot defend it.

## Run the demo

```bash
node demo.js
```

The demo shows how a missing authorization check turns an apparently correct feature into a broken trust boundary.

See also: [homework.md](homework.md) and [project.md](project.md)
