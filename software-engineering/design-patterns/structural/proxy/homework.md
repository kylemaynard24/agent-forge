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
