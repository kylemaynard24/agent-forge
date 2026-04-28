# Homework — Mediator

> Centralize complex N-to-N communication into a single object.

## Exercise: Chat room

**Scenario:** Model a chat room. `User` objects send messages but never reference each other directly. Only the `ChatRoom` mediator knows who's in the room and how messages route.

**Build:**
- A `ChatRoom` with `join(user)`, `leave(user)`, `broadcast(from, msg)`, `dm(from, toName, msg)`.
- `User` objects that hold a reference to the room and call `room.broadcast(this, ...)` to speak.
- A demo with 4 users joining, broadcasting, leaving, and DMing.

**Constraints (these enforce the pattern):**
- A `User` has zero references to other `User` objects.
- Adding a "user typing indicator" feature only modifies `ChatRoom` and the participants who care about it.
- Removing a user from the room must not require any other user to be notified-by-class — only via the mediator.

## Stretch

Support overlapping rooms (a user can be in two rooms simultaneously). Should the user know about the rooms or the rooms know about the user? Decide and justify.

## Reflection

- A mediator can grow into a god-object. When do you split it?

## Done when

- [ ] No `User` holds a reference to another `User`.
- [ ] Adding a "user typing" feature requires changes only inside the mediator.
