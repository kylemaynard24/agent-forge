# Homework — Clean Architecture (Onion)

> Dependencies point inward. The entity at the center knows nothing of the world.

## Exercise: Implement "post a comment" cleanly

**Scenario:** Build the use case "user posts a comment on an article." Required behavior: validate the comment (non-empty, max 500 chars), check the user is not banned, persist the comment, publish a `CommentPosted` domain event.

**Build:**
- `entities/Comment.js`, `entities/User.js`, `entities/Article.js`. Pure data + domain methods. Nothing else.
- `usecases/PostCommentUseCase.js`. Imports entities. Declares ports for `CommentRepository`, `UserRepository`, `EventPublisher`. Has no other imports.
- `adapters/http/PostCommentController.js`. Imports the use case; receives a request-shaped object.
- `adapters/postgres/CommentRepository.js` (stub) and `adapters/test/InMemoryCommentRepository.js`.
- `composition-root.js` wires everything.

**Constraints (these enforce the concept):**
- Nothing in `entities/` imports anything outside `entities/`.
- Nothing in `usecases/` imports `adapters/`, framework code, or `Date.now()` directly (use a `Clock` port).
- Adapters don't import each other.
- A unit test of `PostCommentUseCase` uses only test adapters; runs in milliseconds.

## Stretch
Add an `ArticleClosedForCommenting` rule. Where does it live? (Hint: it's a *domain* rule, not an *application* rule.)

## Reflection
- "Use case" vs "service" — what's the difference? (Hint: a use case is named after a goal; a service is named after a noun.)
- Why does Clean tell you to put DB schemas in the *outer* ring? (Hint: schemas change with vendor; entities don't.)

## Done when
- [ ] `grep -r 'express\|pg\|knex' usecases/ entities/` returns nothing.
- [ ] You can swap the postgres adapter for the in-memory one with one line.
- [ ] The use case test runs in <50ms and uses no real I/O.

---

## Clean Code Lens

**Principle in focus:** Naming Conventions as Dependency Rule Enforcement

In Clean/Onion Architecture, the folder and class naming convention is not aesthetic — it is the dependency rule made visible. A file named `adapters/postgres/CommentRepository.js` signals "this is infrastructure"; a file named `usecases/PostCommentUseCase.js` signals "this is application logic" — and a `grep` for SDK imports in the wrong folder becomes a mechanical boundary check. When a naming convention is broken (a use case named `CommentService`, an entity with `pg` in its import list), the ring boundary has almost certainly been violated.

**Exercise:** After completing the exercise, run a naming audit: list every file path and ask whether the folder name (`entities/`, `usecases/`, `adapters/`) correctly predicts what the file is allowed to import. Then check the stretch item — the `ArticleClosedForCommenting` rule — and verify that its file lives in `entities/` and not `usecases/`: if it ended up in `usecases/`, the name of the correct ring tells you where to move it.

**Reflection:** The homework distinguishes "use case" (named after a goal) from "service" (named after a noun) — how does the goal-named form `PostCommentUseCase` make it immediately obvious which ring a file belongs to in a way that `CommentService` does not?
