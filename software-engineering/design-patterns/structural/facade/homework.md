# Homework — Facade

> A simple front door over a messy subsystem.

## Exercise: Media player

**Scenario:** You have four subsystems: `VideoDecoder`, `AudioDecoder`, `Subtitler`, `Renderer`. Each has its own complex API. Build a `MediaPlayer.play(filePath)` facade that hides all four.

**Build:**
- Stub implementations of the four subsystems with multi-step APIs.
- A `MediaPlayer` class with `play(filePath)`, `pause()`, `stop()`.
- A demo where calling `player.play('movie.mkv')` does the right multi-step orchestration.

**Constraints (these enforce the pattern):**
- The facade must add NO new behavior — it only orchestrates calls to the subsystems.
- Power users must still be able to import and use any subsystem directly.
- The facade must not duplicate state the subsystems already track.

## Stretch

Add a `play()` overload that takes options (volume, subtitle language). Decide: do they go on the facade, the subsystems, or both? Justify.

## Reflection

- Adapter vs Facade: the lazy answer is "both wrap things." What's the actual distinction in intent?
- A facade can become a god-object if you keep growing it. What's your rule for when to split it?

## Done when

- [ ] One-line `player.play(file)` triggers the full orchestration.
- [ ] A power user can still call `videoDecoder.decode(...)` directly without going through the facade.

---

## Clean Code Lens

**Principle in focus:** Interface Segregation Principle + Meaningful Names

The facade's public API is a promise list — every method you expose is a commitment to maintain, document, and version. Applied cleanly, `MediaPlayer` exposes only `play`, `pause`, and `stop` because those are the three verbs the typical caller needs, and the method names map directly onto user intent rather than subsystem operations. Applied messily, a facade that leaks subsystem vocabulary (`decodeVideoStream`, `initializeRenderer`, `syncAudioBuffer`) is not simplifying anything — it is just a forwarding layer with a new name, and callers are still forced to understand the subsystem to use it correctly.

**Exercise:** Imagine you are a caller who has never seen the subsystems. Read only the `MediaPlayer` public API — method names and parameter types, nothing else. List every question you would need to ask to use it correctly. Each question is a gap in the facade's design: either the name should answer it, or a parameter should encode it.

**Reflection:** The constraint says the facade must add no new behavior — only orchestration. But method names like `play` are higher-abstraction than `decode` + `render` + `sync`, which means the facade IS adding something: a vocabulary. Where is the line between "adding vocabulary" and "adding behavior," and does that line matter for clean code?
