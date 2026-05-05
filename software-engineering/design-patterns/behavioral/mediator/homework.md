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

---

## Clean Code Lens

**Principle in focus:** Single Responsibility Principle + Functions Should Do One Thing

The mediator's purpose is to be the single place that understands routing policy — but that single place can still be clean or messy depending on how that logic is organized internally. Applied cleanly, the mediator's methods each encode one routing rule (`broadcast`, `dm`, `notifyTyping`), and the class reads as a precise specification of the room's communication contract. Applied messily, a bloated mediator with a single `handleEvent(type, payload)` plus a long `switch` is a god-object in disguise — same structural role, but the responsibility has leaked from the pattern into the implementation.

**Exercise:** After implementing `ChatRoom`, count its public methods and ask whether each one represents a distinct, nameable coordination responsibility. If two methods could be collapsed into one `handle(eventType, ...)` without loss, you have a naming problem — the individual names are carrying information that would otherwise be lost.

**Reflection:** The homework constraint says adding "user typing" should only modify the mediator — but if the mediator has grown to 200 lines, is that still a win? At what size or complexity does "change only the mediator" stop being a clean-code argument and start being a warning sign?
