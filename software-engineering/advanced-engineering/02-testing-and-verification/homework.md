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

---

## Clean Code Lens

**Principle in focus:** Single responsibility, meaningful names, don't repeat yourself

Test code is production code with a different audience: it will be read by engineers diagnosing failures, not by compilers, and it deserves the same naming, structure, and single-responsibility discipline as the code it covers. A test suite full of `test1`, shared setup that silently couples unrelated cases, and assertions that test five behaviors in one method is a maintenance liability that erodes the value of having tests at all.

**Exercise:** Review the checkout test suite from this homework and apply three clean code rules to the test files specifically: (1) every test name must describe the scenario and expected outcome in plain language, (2) every test must have exactly one logical assertion cluster, and (3) any setup shared between tests must be named to describe what state it creates, not how it creates it. Count how many tests need to be renamed or split.

**Reflection:** If a build fails at 2 a.m. and only the test name appears in the alert, would the on-call engineer know which business behavior broke — and if not, what is the test name actually communicating?
