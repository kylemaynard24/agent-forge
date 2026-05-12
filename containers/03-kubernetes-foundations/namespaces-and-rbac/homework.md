# Homework — Namespaces and RBAC

> The correct default access for an application service account is: nothing. Add permissions only when the application breaks, and then only the minimum required.

## Exercise: Namespace with Quota and a Restricted Deploy-Bot

**Scenario:** Your team is setting up a new application namespace on a shared cluster. The platform team requires:
1. A namespace named `app-dev` with CPU/memory quotas so the dev environment can't starve other teams
2. A service account `deploy-bot` that can create and update Deployments but CANNOT delete them — protecting against a runaway CI script accidentally deleting production workloads
3. Proof via `kubectl auth can-i` that the permissions are correct

**Build:**

**Step 1 — Create the namespace and ResourceQuota:**

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: app-dev
```

ResourceQuota (must enforce these limits):
- `requests.cpu: "4"` — total CPU requests across all pods cannot exceed 4 cores
- `requests.memory: "8Gi"` — total memory requests cannot exceed 8 Gi
- `pods: "20"` — no more than 20 pods in this namespace

**Step 2 — Create the deploy-bot service account and Role:**

The `deploy-bot` Role must allow:
- `get`, `list`, `watch`, `create`, `update`, `patch` on `deployments` (apps API group)
- `get`, `list`, `watch` on `pods` and `pods/log` (core API group)
- `get`, `list` on `services` (core API group)

The Role must NOT allow:
- `delete` on any resource
- Any access to `secrets`
- Any access outside the `app-dev` namespace

**Step 3 — Verify with `kubectl auth can-i` (capture all output):**

```bash
SA="system:serviceaccount:app-dev:deploy-bot"

# These must return "yes"
kubectl auth can-i create deployments --as="$SA" -n app-dev
kubectl auth can-i update deployments --as="$SA" -n app-dev
kubectl auth can-i get pods --as="$SA" -n app-dev

# These must return "no"
kubectl auth can-i delete deployments --as="$SA" -n app-dev
kubectl auth can-i delete pods --as="$SA" -n app-dev
kubectl auth can-i get secrets --as="$SA" -n app-dev
kubectl auth can-i create deployments --as="$SA" -n default   # wrong namespace
kubectl auth can-i create deployments --as="$SA" -n kube-system  # definitely wrong
```

**Step 4 — Prove the ResourceQuota works:**

Try to create more than 20 pods (use a Deployment with 25 replicas). Observe the error. Then reduce to 15 replicas and confirm it succeeds. Capture both attempts and their outcomes.

**Step 5 — Prove the quota is enforced for the right scope:**

```bash
kubectl describe resourcequota -n app-dev
```
Show the "Used" column after creating the 15-replica Deployment.

**Constraints:**
- Everything must be applied via `kubectl apply -f` with manifest files — no imperative-only (`kubectl create role` without saving the YAML)
- The deploy-bot ServiceAccount must have `automountServiceAccountToken: false` — the CI system doesn't need to call the K8s API from inside a pod
- All four manifest files must be named: `namespace.yaml`, `resourcequota.yaml`, `serviceaccount.yaml`, `rbac.yaml` (Role + RoleBinding in one file)

## Stretch 1: LimitRange for Default Resource Controls
Add a LimitRange to `app-dev` that sets default resource requests (`cpu: 100m`, `memory: 128Mi`) and limits (`cpu: 500m`, `memory: 512Mi`) for any container that doesn't specify them. Create a pod with NO resource spec and prove (via `kubectl describe pod`) that the defaults were applied automatically.

## Stretch 2: Audit All ClusterRoleBindings
Run `kubectl get clusterrolebindings -o json | jq '.items[] | select(.roleRef.name == "cluster-admin") | .subjects'` to find every subject that has cluster-admin access. Document what you find and propose a remediation for any service accounts or non-admin users that appear in the output. (In a real cluster, cluster-admin should only appear for human cluster operators — never for application service accounts.)

## Reflection

- You used a Role (namespace-scoped) rather than a ClusterRole. What would it mean if you had used a ClusterRole + ClusterRoleBinding instead? Why is that more dangerous?
- The `default` service account in every namespace gets no permissions by default. But it gets automatically mounted as a token into every pod in the namespace. What's the security risk of leaving `automountServiceAccountToken` at its default (`true`) for the `default` service account, even if you haven't granted it any RBAC permissions?
- A developer asks for `cluster-admin` "just temporarily" to debug an issue. What's the alternative that gives them what they need without cluster-admin, and how do you ensure the elevated access is revoked when the debugging is done?

## Done when

- [ ] `namespace.yaml` created and `app-dev` namespace exists
- [ ] `resourcequota.yaml` applied — `kubectl describe resourcequota -n app-dev` shows the limits
- [ ] `serviceaccount.yaml` applied — `deploy-bot` has `automountServiceAccountToken: false`
- [ ] `rbac.yaml` applied — Role and RoleBinding both present
- [ ] All 8 `kubectl auth can-i` checks pass (yes/yes/yes and no/no/no/no/no)
- [ ] 25-replica Deployment was rejected by the quota; 15-replica Deployment succeeded
- [ ] `kubectl describe resourcequota -n app-dev` shows non-zero "Used" values

---

## Clean Code Lens

**Principle in focus:** Principle of Least Privilege (a security-specific expression of Minimal Interface)

In code design, a minimal interface exposes only what a client needs — no more. A class that exposes 30 methods when the caller only needs 3 is harder to understand, harder to test, and more likely to be misused. RBAC applies the same principle to identity: a service account exposes only the API operations it genuinely needs to perform its function.

The CI deploy-bot needs to create and update Deployments. It does not need to delete them, read Secrets, list Nodes, or modify RBAC policies. Granting those permissions "just in case" is the RBAC equivalent of exposing a method you're not sure is needed. Every unnecessary permission is a capability an attacker can use if they compromise the identity. The attack surface of a service account is exactly the set of API operations it's authorized to perform.

Minimum-privilege RBAC also makes the system easier to reason about. When an incident occurs and you're asking "could this service account have done X?", `kubectl auth can-i --as=<sa>` gives you a definitive answer. With `cluster-admin`, the answer to every question is "yes, trivially" — which is useless for incident analysis.

**Exercise:** Find a Kubernetes service account in a project you have access to (or design one from scratch for a hypothetical CI/CD system). List every RBAC verb it's been granted. For each verb, write a one-sentence justification: "This service account needs `delete` on `deployments` because it must clean up preview environments." If you can't write a justification, the permission shouldn't be there.

**Reflection:** RBAC in Kubernetes is purely additive — there is no explicit deny. How does this affect your threat model if a bad actor gains the ability to create new RoleBindings? What RBAC permission would you want to restrict most tightly to prevent privilege escalation?
