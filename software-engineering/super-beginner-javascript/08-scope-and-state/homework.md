# Homework — Scope and State

> Understand where variables live and when values change over time.

## Exercise

Create a small script related to tracking score correctly without losing or leaking values.

**Build:**
- one clear example using the topic correctly
- one small variation where you change the input and predict the output first
- a short explanation in plain English of what the code is doing

**Constraints:**
- keep the script small enough to explain line by line
- do not copy code without changing at least one value yourself
- write down what you expect before you run it

## Reflection

- What part of Scope and State felt the most natural?
- What part still feels confusing or easy to mix up?
- Could you teach this exact example to a friend without reading the file?

## Done when

- you can run the script successfully
- you can predict the output before running it
- you can explain the code in plain language

---

## Clean Code Lens

**Principle in focus:** Minimize Scope; Keep State Close to Where It Is Used

Every variable declared at a wider scope than necessary is state that travels further than it needs to. The further state can travel — readable and writable from many places — the harder it becomes to answer the question "where was this changed?" Clean code keeps state as local as possible: declared inside the function that needs it, not leaked to the outer scope where unrelated code might accidentally touch it.

**Exercise:** Write your score-tracking script with all variables declared at the top of the file as globals. Then rewrite it so every variable lives in the tightest possible scope — inside the function or block where it is actually needed. Count how many variables moved inward. Each one that moved is a piece of state that can no longer be accidentally modified by unrelated code.

**Reflection:** Were there any variables that genuinely needed to live at a wider scope to work correctly? What was it about those specific values that required a broader lifetime — and does that feel like a necessary design choice or an accidental one?
