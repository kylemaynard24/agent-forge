# Homework — Testing and Verification

> Choose the boundary before you choose the framework.

## Exercise: Test a checkout workflow deliberately

**Scenario:** You have a checkout flow with pricing, inventory reservation, payment authorization, and email confirmation. The team currently has either too many tiny tests or not enough trustworthy ones, depending on who you ask.

**Build:**
- 3-5 unit tests around pure business rules
- 1-2 integration tests around a meaningful workflow boundary
- 1 contract test for an external or cross-module interface
- A short note on what you intentionally left untested

**Constraints:**
- No test may depend on unrelated setup
- Each failure should point to one likely owner or boundary
- At least one test must protect an interface, not just an implementation detail
- You must identify one likely flake risk and either remove it or quarantine it

## Stretch

Add one mutation or fault-injection pass mentally: what tiny production change should your tests definitely catch, and which one could still slip through?

## Reflection

- Which test gave the highest confidence per line of code?
- What did the integration test catch that the unit tests could not?
- Which assertion would become brittle if the code were refactored cleanly?

## Done when

- [ ] You can explain why each test exists
- [ ] The suite covers rule, boundary, and contract
- [ ] You documented what you deliberately chose not to test
