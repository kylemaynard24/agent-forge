# Homework — Config and Env Drift

> Notice when code is fine but runtime configuration is lying to you.

## Exercise

Work through a small scenario involving a deployment that only fails in staging or one specific region.

**Build:**
- one reproducible failure or narrowed scenario
- a written hypothesis list
- one observation that disproves at least one hypothesis

**Constraints:**
- you may not start by editing production logic
- at least one plausible idea must be disproven
- your final note must distinguish symptom from cause

## Reflection

- What part of Config and Env Drift felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Config and Env Drift without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Meaningful names, one source of truth, make intent explicit

Configuration key names are a cross-environment contract: when the same setting is called `DB_URL` in staging, `DATABASE_CONNECTION_STRING` in production, and `connection.db` in the local config file, every deployment is a guessing game. Applying the clean code naming standard — be precise, encode the scope, avoid synonyms — to config keys is what makes drift visible before it causes a failure.

**Exercise:** Audit the config keys used in the staging-vs-production drift scenario. For any key with an ambiguous name, write a replacement that encodes: the resource type, the environment scope (if environment-specific), and the unit or format where relevant (e.g., `PAYMENTS_DB_CONNECTION_STRING_PRIMARY`, `EMAIL_SMTP_PORT_INT`). Then write a startup validation function that asserts the presence and basic format of each required key and fails fast with a descriptive error rather than silently using a default.

**Reflection:** In a system you deploy, could a new engineer look at the config keys alone and correctly understand what each one controls — or are there keys whose purpose is only clear from reading the code that uses them?
