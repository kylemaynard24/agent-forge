# Homework — Proxy

> A stand-in for the real object, controlling access to it.

## Exercise: Three proxies for one image

**Scenario:** A `RemoteImage` fetches an image over the network. You want three behaviors layered over it: lazy loading, caching, access control.

**Build:**
- An `Image` interface with `render()`.
- A `RemoteImage` that simulates a slow network fetch on `render()`.
- A `LazyLoadingProxy` that defers the fetch until `render()` is first called.
- A `CachingProxy` that memoizes the result keyed by URL.
- An `AccessControlProxy` that throws unless `user.isAuthenticated`.

**Constraints (these enforce the pattern):**
- All four classes implement the same `Image` interface.
- Stacking is the composition style: `new AccessControl(new Cache(new LazyLoad(realImage)))`.
- The caller of the outer proxy can't tell which proxies are in the stack.

## Stretch

The order of stacking matters. What happens if you put `Cache` outside `AccessControl`? (You'd serve cached results to unauthorized users.) Write a test that proves the *correct* stack order is enforceable, e.g., a runtime check.

## Reflection

- Decorator and Proxy share the same structure. What's the distinction in intent? (Hint: same vs different responsibility from wrapped object.)

## Done when

- [ ] Calling render() on the full stack: enforces auth, caches result, defers fetch until needed.
- [ ] You can articulate why proxy ≠ decorator in *purpose* even though their UML looks the same.

---

## Clean Code Lens

**Principle in focus:** Single Responsibility Principle + Transparent Interfaces

The proxy is clean precisely when it is invisible — the caller uses the `Image` interface and cannot tell whether it is talking to the real object or a proxy, which means the proxy must forward everything it does not intercept without transformation or opinion. Applied cleanly, `CachingProxy` intercepts only `render()`, memoizes the result, and forwards the call identically on a cache miss — the only code that exists is the one concern (caching) and everything else is a transparent pass-through. Applied messily, a proxy that modifies return values, swallows errors silently, or adds logging alongside access control has merged multiple responsibilities into one class, making it impossible to remove a proxy from the stack without auditing every method it intercepts.

**Exercise:** For each proxy in your stack, list the methods it intercepts and the methods it forwards untouched. The intercepted list should contain only the single concern named in the class (`LazyLoadingProxy` intercepts `render()` to defer the fetch — nothing else). If a proxy intercepts more than one method for more than one reason, it is doing too much.

**Reflection:** The stretch goal shows that `Cache` outside `AccessControl` serves cached results to unauthorized users — a security bug caused by stacking order, not by any individual proxy's code. If the correct order is not enforced, the proxies are individually clean but collectively wrong. What does this tell you about the limits of single-responsibility naming when the semantics of a design depend on composition order?
