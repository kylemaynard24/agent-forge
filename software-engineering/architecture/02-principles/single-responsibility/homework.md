# Homework — Single Responsibility

> One class, one reason to change. Find the actors.

## Exercise: Untangle an Order god-class

**Scenario:** An `Order` class with: `validate`, `persist`, `sendConfirmationEmail`, `generateInvoice`, `computeShippingLabel`, `refund`, `exportToTaxSystem`. Each method serves a different stakeholder.

**Build:**
- For each method, name the **actor** (stakeholder/department) who would request a change to it.
- Group methods by actor.
- Split into single-actor classes/modules. Keep `Order` as a plain value type holding data.
- An orchestrator at the edge wires them together.

**Constraints (these enforce the concept):**
- Each new class must be describable in an *and*-free sentence.
- `Order` itself has zero behavior — it's pure data.
- Tests can target one new class without spinning up the others.
- No new class has more than 5 public methods.

## Stretch
Pick TWO responsibilities that you intentionally keep together (despite SRP) and defend why — usually because the invariant requires the data and the rule to be co-located. SRP is a default, not a law.

## Reflection
- SRP and encapsulation can fight: enforcing an invariant on `balance` wants the rule next to the data, but the audit-log requirement wants the rule elsewhere. How do you decide?
- "Reason to change" is fuzzy. What's a sharper test? (Hint: who's the human asking for the change?)

## Done when
- [ ] Each class has one stakeholder.
- [ ] No method's name surprises you given the class name.
- [ ] You've articulated one place SRP would have been wrong, and why.

---

## Clean Code Lens

**Principle in focus:** Class Names Predict Their Contents — the "and" Test

SRP is the clean code principle at the class level, and the sharpest test for it is the name: if describing what a class does requires the word "and," it has two responsibilities and therefore two potential reasons to change. `OrderConfirmationEmailer` is a single responsibility; `OrderServiceAndMailer` announces the violation before you open the file.

**Exercise:** Take each class you created from the `Order` split and apply the "and-free description" test: write a one-sentence description of the class that names its stakeholder, its responsibility, and what it will never do. Then check every method name against that description — any method that surprises you relative to the class name either belongs in another class or reveals that your description was too narrow. Tighten either the description or the class until there are no surprises.

**Reflection:** You were asked to keep `Order` as pure data with zero behavior. But domain experts often say an order *validates itself* or an order *knows its total* — at what point does adding behavior back to `Order` strengthen the model rather than violate SRP, and who is the stakeholder for that decision?
