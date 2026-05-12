# Namespaces and RBAC

**Area:** Kubernetes Foundations

## Intent

Divide a Kubernetes cluster into logical tenants using namespaces, and control exactly who (or what) can perform which operations using Role-Based Access Control — applying least-privilege from day one rather than retrofitting it.

## When to use

- When multiple teams or environments share a cluster (nearly always)
- When you need to enforce resource quotas per team or environment
- When a CI/CD system needs deploy permissions but must not be able to delete production resources
- When setting up a new service account for an application workload

## Why it matters

Without namespaces, every resource in a cluster shares the same flat namespace. In practice, this means dev, staging, and prod workloads can interact with each other, teams can accidentally delete each other's Deployments, and a runaway pod in a dev environment can consume all cluster CPU. Namespaces provide a boundary for naming, resource quotas, and RBAC scoping.

Without RBAC, every authenticated entity has the same access. In practice, this means a compromised CI service account can delete Deployments, read Secrets, and even modify RBAC policies. The principle of least privilege — give each entity the minimum access it needs to do its job — is not just good practice, it's the difference between a contained incident and a complete cluster compromise.

RBAC is not complex conceptually: you define what actions a Role allows, and then you bind that Role to an identity. The complexity comes from understanding the namespace-scoping distinction and avoiding the temptation to grant `cluster-admin` because it's easier than thinking through permissions.

## Core concepts

- **Namespace** — a virtual cluster within the physical cluster; provides scope for names (two Deployments can have the same name in different namespaces), RBAC boundaries, and resource quotas; does NOT provide network isolation (that requires a NetworkPolicy)
- **`default` namespace** — where resources go when you don't specify a namespace; bad practice for production; use explicit namespaces for every workload
- **`kube-system` namespace** — where Kubernetes system components (CoreDNS, kube-proxy, metrics-server) run; don't deploy your workloads here
- **`kube-public` namespace** — readable by all users; contains a single ConfigMap with cluster info; rarely used directly
- **ResourceQuota** — a per-namespace object that limits the total CPU, memory, pod count, and other resources that can be requested in that namespace; enforced by the admission controller
- **LimitRange** — a per-namespace object that sets default resource requests/limits for pods that don't specify them; ensures no pod in the namespace runs without resource controls
- **Role** — defines a set of permitted API operations (verbs: get, list, watch, create, update, patch, delete) on specific resource types within a single namespace
- **ClusterRole** — like a Role but cluster-scoped; either applies to cluster-wide resources (Nodes, PersistentVolumes) or can be bound in any namespace via a RoleBinding
- **RoleBinding** — binds a Role (or ClusterRole) to a subject (user, group, or service account) within a specific namespace
- **ClusterRoleBinding** — binds a ClusterRole to a subject cluster-wide; grants access to all namespaces; use sparingly
- **Subject** — the identity being granted access: `kind: User` (a human), `kind: Group`, or `kind: ServiceAccount` (a pod identity)
- **ServiceAccount** — a Kubernetes-native identity for pods; automatically mounted as a token at `/var/run/secrets/kubernetes.io/serviceaccount/token`; every pod runs as a service account (default is `default` in its namespace)
- **`kubectl auth can-i`** — tests whether the current user (or a given user/service account) can perform a specific action: `kubectl auth can-i create deployments --namespace=prod` or `kubectl auth can-i --as=system:serviceaccount:myns:my-sa delete pods`
- **Least-privilege principle** — grant only the permissions actually needed; start with no permissions and add; never start with `cluster-admin` and try to remove

## Common mistakes

- **Everything in the `default` namespace** — this works until it doesn't; without namespace separation, every team can accidentally affect every other team's workloads and you have no natural boundary for quotas or RBAC
- **Granting `cluster-admin` to application service accounts** — a pod with a `cluster-admin` service account can do anything to any resource in the cluster; if that pod is compromised, the attacker owns the cluster; application pods should only have the minimum K8s API access they actually need (often none)
- **Confusing namespace isolation with network isolation** — namespaces do NOT prevent pods from communicating across namespaces; networking is flat by default; add NetworkPolicies for network isolation
- **Using ClusterRoleBinding when RoleBinding would suffice** — a ClusterRoleBinding grants access cluster-wide; if you only need namespace-scoped access, use a RoleBinding (which can bind a ClusterRole to a namespace)
- **Forgetting to add new resource types when the application evolves** — RBAC is point-in-time; if your app starts using ConfigMaps after its Role was written, the Role doesn't automatically update; you must add the ConfigMap resource type

## Tiny example

A CI service account that can deploy but not delete:

```yaml
# Role: allows create + update on Deployments, but not delete
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deploy-bot
  namespace: prod
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch"]
  # notice: "delete" is absent

---
# ServiceAccount for the CI system
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ci-deploy-bot
  namespace: prod

---
# Bind the Role to the ServiceAccount
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: deploy-bot-binding
  namespace: prod
subjects:
- kind: ServiceAccount
  name: ci-deploy-bot
  namespace: prod
roleRef:
  kind: Role
  name: deploy-bot
  apiGroup: rbac.authorization.k8s.io
```

Verify: `kubectl auth can-i delete deployments --as=system:serviceaccount:prod:ci-deploy-bot -n prod` → `no`

## Run the demo

```bash
bash demo.sh
```

The demo creates a namespace with a ResourceQuota, creates a ServiceAccount, defines a Role (get/list pods only), binds it, and tests access with `kubectl auth can-i`.

## Deeper intuition

Think of RBAC in Kubernetes as the same model as IAM in AWS or Azure — but scoped to cluster resources. Every API call goes through the authorization layer: "Is this authenticated identity allowed to perform this verb on this resource in this namespace?" If the answer is no, the API server returns 403. The question of "who is allowed" is resolved by looking for any Role or ClusterRole binding that grants the required verb+resource combination. Permissions are additive — if multiple bindings grant access, the union of permissions applies; there's no explicit deny in standard RBAC.

This additive model means you can't accidentally grant too little access with multiple roles (the union always includes everything). But it does mean you can accidentally grant too much if you're not careful about which bindings exist. Regular RBAC audits — `kubectl get rolebindings,clusterrolebindings -A` — are good hygiene.

## Scenario questions

### Scenario 1 — "Our dev namespace is consuming all cluster CPU and the prod team is getting throttled"
**Question:** How do you prevent a dev namespace from starving production?
**Answer:** Apply a ResourceQuota to the dev namespace: `kubectl create quota dev-limits --hard=cpu=4,memory=8Gi,pods=20 -n dev`. Any pod creation or update request that would exceed the quota is rejected. For prod, apply a generous but bounded quota as a safety net.
**Explanation:** ResourceQuotas are the guardrails that make multi-tenant clusters feasible. Without them, one team's poorly-configured pod with no resource limits can consume the entire cluster. With them, each namespace operates within a defined envelope and impacts are contained.

### Scenario 2 — "A security audit found that our application pod can list and delete Secrets"
**Question:** How did this happen, and how do you fix it?
**Answer:** The pod is using the `default` service account, which may have accumulated broad permissions over time, or someone bound it to a permissive ClusterRole. Check: `kubectl get rolebindings,clusterrolebindings -A | grep default`. Fix: create a specific service account for the application with only the permissions it needs, and set `automountServiceAccountToken: false` if the app doesn't use the K8s API at all.
**Explanation:** The `default` service account in each namespace gets mounted into every pod in that namespace automatically unless you opt out. If anyone has granted permissions to the `default` service account, every pod in the namespace inherits them. Best practice: create a dedicated service account per application, grant minimum permissions, and disable token automounting for apps that don't call the K8s API.
