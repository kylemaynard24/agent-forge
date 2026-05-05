# Homework — Least Privilege

> Give components only the permissions they need so failure stays containable.

## Exercise

Work through a small scenario involving an internal tool running with production-wide credentials because it was easy.

**Build:**
- a named trust boundary
- one protective control
- a note on residual risk

**Constraints:**
- you must distinguish what is trusted from what is merely present
- you must state one accepted risk explicitly
- the control has to match the boundary, not just the feature

## Reflection

- What part of Least Privilege felt more subtle than it first sounded?
- Which observation or decision created the most clarity?
- What simpler but weaker approach would have been tempting here?

## Done when

- you can explain the value of Least Privilege without using buzzwords
- the result is concrete enough that another engineer could inspect it
- your written note makes the trade-off visible

---

## Clean Code Lens

**Principle in focus:** Intention-revealing names + abstraction integrity

Least privilege is clean code for permissions: a permission scope named `admin` that is actually used to read one field is an abstraction violation — the name implies far more access than is needed. Naming permissions for what they actually grant (`read_report_summary`) rather than for a role that approximates the access makes the principle of least privilege legible in the permission definition itself.

**Exercise:** List the permissions used in your scenario and rename any that describe a role (admin, superuser, manager) rather than the specific action they grant. Then confirm that each renamed permission makes overly broad access immediately visible as a mismatch between name and actual usage.

**Reflection:** If a permission is granted incorrectly and someone audits the permission names, would the name of the over-granted permission make its scope obvious enough that the error is detectable without reading the underlying access control implementation?
