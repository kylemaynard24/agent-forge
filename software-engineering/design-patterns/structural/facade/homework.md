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
