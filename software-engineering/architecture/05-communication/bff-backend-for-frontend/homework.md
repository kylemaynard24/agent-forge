# Homework — BFF (Backend For Frontend)

> Apply per-client tailoring. The **constraints** are the point.

## Exercise: Two BFFs for a media app

**Scenario:** A media-streaming app has a web client (large screen, full metadata) and a watch-OS client (tiny screen, minimal metadata, low bandwidth).

**Build:**
- A shared `mediaService` returning rich items (title, synopsis, cast, multiple poster sizes, trailers, runtime, ratings).
- A `webBFF` returning `/home` with full items grouped by category.
- A `watchBFF` returning `/home` with `{ id, title, posterTinyUrl }` only.
- A measurable byte-size difference printed for the same logical request.

**Constraints (these enforce the concept):**
- Both BFFs must call the **same** `mediaService` — no forking it per client.
- Each BFF owns its own response shape; do not share a response DTO.
- Neither BFF may contain domain rules ("featured if rating > 4.5"). That belongs in the service.
- The watch BFF must produce a payload at least 70% smaller than the web BFF for the same input.

## Stretch
- Add a TV BFF that batches three home rows into one request. Notice when shared aggregation becomes duplicated and what to do about it.
- Move BFF auth into a shared library used by both. Where do you put it, and who owns it?

## Reflection
- A frontend team wants to add a new field. With one shared API, how many teams would they have to coordinate with? With a BFF, how many?

## Done when
- [ ] Two BFFs, one shared service.
- [ ] Watch BFF response measurably smaller (>= 70%).
- [ ] No business logic in either BFF — only shaping and aggregation.

---

## Clean Code Lens

**Principle in focus:** Meaningful Names — use the client's vocabulary, not the backend's

A BFF response field named `mediaAssetThumbnailUrlSmall` leaks the backend's internal domain model onto the client; the watch OS team thinks in terms of `posterUrl`, so that is what the field should be called. Using the frontend's vocabulary in the BFF's response shape is the same principle as naming a variable after what it means to the reader, not to the writer.

**Exercise:** Compare your `webBFF` and `watchBFF` response field names against the names used in your `mediaService`. Identify every field where the BFF passes through an internal name unchanged, and rename those fields to match the terminology a frontend engineer would naturally use.

**Reflection:** When a backend field is renamed in `mediaService`, which of your BFF field names would still make sense to a mobile engineer — and which would expose that a rename happened underneath?
