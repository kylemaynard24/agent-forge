# Homework — Law of Demeter

> Tell, don't ask. Talk to immediate friends only.

## Exercise: Refactor a deep chain

**Scenario:** Your codebase has many lines like:

```js
order.getCustomer().getAddress().getCountry().getCode()
order.getCart().getItems()[0].getProduct().getCategory().getName()
user.getProfile().getSettings().getNotifications().setEmailEnabled(true)
```

Three different "telescope chains" reaching through 3–4 levels of structure. Changing any inner object breaks dozens of callers.

**Build:**
- For each chain, ask: what is the caller actually trying to *accomplish*? (Not "get the code", but "look up the country code for shipping.")
- Add a method on the OUTER object that names the operation. e.g. `order.shippingCountry()`, `order.firstItemCategoryName()`, `user.enableEmailNotifications()`.
- Update callers to use the named method.
- Make the inner accessors private (or at least drop the `get*` chain).

**Constraints (these enforce the concept):**
- No caller chains more than 2 dots after the receiver.
- The new methods are named for the *intent* (not the structure).
- Inner objects' getters that were used only by the chains can become package-private (or removed).
- Pure data pipelines (`list.filter().map()`) are exempt — these are not LoD chains.

## Stretch
Find one place in your refactor where applying LoD made the code WORSE (e.g., you had to add 4 delegate methods to satisfy a one-off caller). Document the trade-off honestly.

## Reflection
- "Tell, don't ask" pushes behavior onto the object that owns the data. How does this interact with SRP?
- A pure-functional codebase (e.g., reducers operating on plain values) often has long chains and isn't violating LoD. What's the distinction?

## Done when
- [ ] No `getX().getY().getZ()` style chain remains in the call sites.
- [ ] The new methods read like a verb the domain expert would use.
- [ ] You can articulate when LoD goes too far.

---

## Clean Code Lens

**Principle in focus:** Reveal Intent Through Method Names (Tell, Don't Ask)

A LoD violation is also a naming failure: `order.getCustomer().getAddress().getCountry().getCode()` names four structural layers but zero intent, while `order.shippingCountryCode()` names the *why* in three words. The chain leaks private knowledge that the caller has no business knowing; the wrapper method gives that knowledge a name that lives at the right level of abstraction.

**Exercise:** For each chain you refactored, compare the old chain with your new method name and ask: could a domain expert (someone who knows orders and shipping but not your object model) read the new name and know immediately what it returns? If they'd have to ask a follow-up question, the name is still describing structure rather than intent — revise it until the follow-up is unnecessary.

**Reflection:** Every delegate method you add to `Order` in order to satisfy LoD adds to `Order`'s public surface. At what point does adding delegate methods start to violate SRP — and how do you decide whether to add a delegate or to push the caller's behavior somewhere closer to the data it actually needs?
