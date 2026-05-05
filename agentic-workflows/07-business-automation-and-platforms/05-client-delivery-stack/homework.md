# Homework — Client Delivery Stack

> The workflow is only one piece. Design the operating surface around it.

## Exercise

Take one automation idea and design the surrounding stack:

- where records live
- where operators review exceptions
- where users or clients see status
- where notifications land
- how the work is documented

## Constraints

- name one primary system of record
- include one human approval or intervention path
- include one operational alert path
- explain one handoff decision if the client takes over later

## Reflection

- Which layer felt most neglected at first?
- What looked easy until ownership and support were considered?
- Which part of the stack would create the most rework if chosen badly?

## Done when

- the system of record is explicit
- an operator knows where to look during failure
- the design includes support and handoff, not just automation

---

## Clean Code Lens

**Principle in focus:** Make the implicit explicit; intention-revealing names for integration points

Client delivery documentation that says "data flows from the form to the CRM" names two systems but leaves the integration contract implicit — ambiguous integration descriptions are support tickets waiting to happen. Clean delivery documentation names each integration point, names the data fields crossing each boundary, names the failure mode if a boundary breaks, and names who owns the resolution path.

**Exercise:** For each integration point in your stack design, write a one-line contract: "system A sends [named fields] to system B on [named trigger]; if this fails, [named owner] is alerted via [named channel]." Verify that no system name, field name, or failure mode is left implicit.

**Reflection:** When a client's operator opens a support ticket at 9 AM because something broke overnight, does your documentation tell them within two minutes which integration point failed, what data was affected, and who to contact?
