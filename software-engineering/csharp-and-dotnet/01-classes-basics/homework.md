# Homework — Classes basics

Build a small system that exercises the four class forms (classic, primary-constructor, record, static) and the constructor-invariant principle.

## Build it

Create a console app `bank-basics` modeling a tiny bank-account system. Implement each of the four required types using a different class form on purpose:

1. **`Money` — a `record`.** Two properties: `decimal Amount`, `string Currency` (3-letter ISO code). Validate in a custom constructor body that `Amount >= 0` and `Currency.Length == 3`; throw `ArgumentException` otherwise. Hint: with a `record`, you can write `public record Money(decimal Amount, string Currency) { public Money { /* validation here */ } }`.

2. **`AccountId` — a `record struct`.** Wraps a `Guid`. Use the static factory pattern: `public static AccountId New() => new(Guid.NewGuid());`. The point of `record struct` here is value semantics + stack allocation for an identity type.

3. **`BankAccount` — a classic `class` with a private constructor and a public static factory.** The constructor takes an `AccountId`, a `Money` initial balance, and an owner name. The public static factory `Open(string ownerName, Money initialDeposit)` creates a new id and instantiates. The class has methods `Deposit(Money amount)` and `Withdraw(Money amount)` that mutate an internal `Money Balance` field. Reject deposits/withdrawals where the currency doesn't match the account's currency. Reject overdrafts.

4. **`AccountRegistry` — a `static class`.** Maintains a `Dictionary<AccountId, BankAccount>` and exposes `Register(BankAccount)` and `TryGet(AccountId, out BankAccount?)`. Static is appropriate here because there's exactly one in-memory registry per process and no per-instance state.

5. **In `Program.cs`, demonstrate:**
   - Open two accounts in two different currencies.
   - Deposit and withdraw successfully.
   - Try a wrong-currency deposit; show the exception.
   - Try an overdraft; show the exception.
   - Print each account's final balance and ID.

Aim for 100-150 lines total.

## Done when

- [ ] All four class forms used as specified above (record, record struct, classic class, static class).
- [ ] `BankAccount` has a private constructor; the only way to create one is `BankAccount.Open(...)`.
- [ ] Constructor / `Open` validates inputs and throws on bad state. There is no way to construct an invalid `BankAccount` from outside the class.
- [ ] Wrong-currency deposit and overdraft both throw with descriptive messages.
- [ ] You can articulate (in one sentence each) why each of the four types deserves its specific class form.

## Bonus

- Add a `Transfer(BankAccount from, BankAccount to, Money amount)` method on `AccountRegistry`. Make it atomic — if the deposit fails, the withdrawal must roll back.
- Add an `IReadOnlyList<Transaction>` history to `BankAccount` where `Transaction` is itself a `record`.

## Save to

`progress/<today>/working-folder/csharp-and-dotnet/01-bank-basics/` (multiple `.cs` files — convention is one type per file).

---

## Clean Code Lens

**Principle in focus:** Class Names as Domain Vocabulary

A class name is the most important name in the file — it is the concept you are introducing into your codebase's vocabulary. `BankAccount`, `Money`, and `AccountRegistry` each describe a real thing in the banking domain. A reader who knows banking already has a mental model before they read a single method. If your class were named `AccountHandler` or `BankingHelper`, you would be describing what the code does rather than what the concept is, and that is a weaker vocabulary word.

**Exercise:** After implementing your four types, write a one-sentence plain-English definition for each class name as if you were writing a glossary for a new team member — without mentioning any code. If you struggle to write a clean definition for `AccountRegistry` or `Money`, that difficulty reveals whether the class name is genuinely describing a domain concept or just a bag of code. The cleaner the definition, the better the name.

**Reflection:** The four class forms you used (`record`, `record struct`, classic `class`, `static class`) each signal something different to a reader. Did the names you chose reinforce those signals, or did any name make you wonder whether you chose the right form?
