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
