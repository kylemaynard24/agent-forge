# RBAC and Security

**Area:** Production Kubernetes / AKS

## Intent

Harden every pod and namespace so that a compromised container cannot escalate privileges, move laterally to other services, or access the host node — and enforce these policies automatically so teams cannot bypass them.

## When to use

- Every production workload — securityContext on every container, NetworkPolicy in every namespace
- Multi-tenant clusters — RBAC isolation between teams' namespaces
- Regulated environments (PCI, HIPAA, SOC 2) — OPA/Gatekeeper policies enforced as admission webhooks

## Why it matters

The default Kubernetes security posture is wide open. A container can run as root, write to the host filesystem, call the Kubernetes API with elevated permissions, and communicate with any other pod in the cluster. These are not edge cases — they are defaults.

A single compromised container in an unrestricted cluster is a foothold into the entire workload. An attacker who escapes a container running as root with access to the host PID namespace can potentially compromise the node. An attacker with a flat network can probe every service without restriction. Most real-world Kubernetes breaches follow this exact path: container compromise → privilege escalation → lateral movement.

The security controls in this topic are not theoretical. They are the specific settings that close the specific attack paths that appear in Kubernetes security post-mortems.

## Core concepts

- **securityContext (container)** — sets Linux security options for a specific container
- **runAsNonRoot: true** — rejects the container if its image runs as root (UID 0); requires the image to declare a non-root user
- **runAsUser / runAsGroup** — sets the UID/GID the process runs as regardless of what the image declares
- **readOnlyRootFilesystem: true** — mounts the container's root filesystem as read-only; process cannot write to its own filesystem (use `emptyDir` volumes for temp files)
- **allowPrivilegeEscalation: false** — prevents the process from gaining more privileges than its parent (blocks `setuid` binaries and `sudo`); should always be set
- **capabilities** — Linux capability system; default Kubernetes containers have a set of capabilities (NET_BIND_SERVICE, CHOWN, etc.); `drop: ["ALL"]` removes all of them; add back only what you need
- **seccompProfile** — limits the syscalls a container can make; `RuntimeDefault` uses the container runtime's default profile (covers most apps); `Unconfined` (the default) allows all syscalls
- **securityContext (pod)** — applies settings to all containers in the pod; container-level overrides pod-level
- **Pod Security Standards** — three built-in policies enforced by namespace labels: `privileged` (no restrictions), `baseline` (blocks most obvious privilege escalation), `restricted` (enforces all best practices including non-root and seccomp)
- **NetworkPolicy** — a namespace-scoped resource that restricts pod-to-pod network traffic; requires a CNI that supports it (Azure CNI + Azure NPM, Calico); default is allow-all
- **default-deny ingress** — a NetworkPolicy with an empty podSelector (matches all pods) and no ingress rules; blocks all inbound traffic to all pods in the namespace; then add explicit allow rules
- **OPA/Gatekeeper** — an admission webhook that evaluates custom Rego policies before resources are created; `ConstraintTemplate` defines the policy logic, `Constraint` defines the instances; enforces org-wide standards
- **Azure RBAC for Kubernetes** — use Azure AD groups and Azure RBAC roles (Azure Kubernetes Service Cluster User, Admin) instead of local KUBECONFIG certificates; integrated with Entra ID Conditional Access

## Common mistakes

- **Overly permissive ClusterRoleBindings** — giving a ServiceAccount `cluster-admin` "temporarily" and forgetting to remove it; fix: use least-privilege roles, audit with `kubectl auth can-i --list --as=system:serviceaccount:default:my-sa`
- **No NetworkPolicies (flat network)** — any compromised pod can reach any service; fix: add a `default-deny-ingress` NetworkPolicy to every namespace on day one, then add explicit allow rules
- **Not setting securityContext** — container runs as root, can write anywhere, can escalate; fix: add the full securityContext block to every container in every production Deployment
- **readOnlyRootFilesystem without temp volumes** — an app that writes to `/tmp` will crash with "read-only filesystem"; fix: mount an `emptyDir` volume at `/tmp` before enabling read-only root

## Tiny example

A fully hardened container spec:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  runAsGroup: 1000
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop: ["ALL"]
  seccompProfile:
    type: RuntimeDefault
volumeMounts:
- name: tmp
  mountPath: /tmp
volumes:
- name: tmp
  emptyDir: {}
```

A default-deny NetworkPolicy with a targeted allow:

```yaml
# Block all ingress to all pods in this namespace
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}      # matches all pods
  policyTypes: ["Ingress"]
---
# Allow ingress only from the ingress-nginx namespace
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-ingress
spec:
  podSelector:
    matchLabels:
      app: my-api
  policyTypes: ["Ingress"]
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: ingress-nginx
    ports:
    - port: 8080
```

## Run the demo

```bash
bash demo.sh
```

The demo deploys a fully hardened pod, shows it works, then shows what changes when security controls are removed (root access, writable filesystem). It also applies a NetworkPolicy and verifies traffic is blocked.

## Deeper intuition

Think of container security as defense in depth — layers that each independently limit what an attacker can do even if the previous layer is bypassed.

Layer 1 (`runAsNonRoot`) — if the container is compromised, the attacker is not root inside the container. Many exploits require root and simply do not work.

Layer 2 (`readOnlyRootFilesystem`) — if the attacker is somehow root, they cannot install tools, write a reverse shell, or modify the application binary. The filesystem is immutable at runtime.

Layer 3 (`capabilities drop ALL`) — if the attacker bypasses the filesystem, they have no Linux capabilities to escalate with. No `CAP_NET_ADMIN` to reconfigure networking, no `CAP_SYS_PTRACE` to inspect other processes.

Layer 4 (`NetworkPolicy default-deny`) — if the attacker escapes the container, they cannot reach other services. The blast radius of the compromise is the single pod, not the entire cluster.

Each layer is independent. All four together make a compromise nearly useless for lateral movement.

## Scenario questions

### Scenario 1 — "A security scan flagged that our containers run as root. The team says it is required because the app writes to /var/log."
**Question:** Is running as root required for writing to /var/log? What is the correct fix?
**Answer:** No. Mount an `emptyDir` or a PersistentVolumeClaim at `/var/log` owned by the non-root user, and set `runAsUser` to the UID that owns those files.
**Explanation:** The app does not need root — it needs write access to a specific directory. You control that by: (1) building the image with a non-root user (`USER 1000` in the Dockerfile), (2) mounting a writable volume at the path the app writes to, and (3) setting `securityContext.runAsUser: 1000`. The volume is writable by UID 1000. No root required.

### Scenario 2 — "We applied a default-deny NetworkPolicy to our namespace. Now our app cannot reach the database in another namespace."
**Question:** What NetworkPolicy rule do you need to add, and where do you add it?
**Answer:** Add an Egress NetworkPolicy to the app's namespace that allows outbound traffic to the database pod's namespace and port. Apply it to the pods that need database access.
**Explanation:** A default-deny ingress policy does not affect egress by default. However, if you also set `policyTypes: ["Egress"]`, you need explicit egress rules. The rule would select the app pods and allow egress to the `namespaceSelector` matching the database namespace on port 5432. Also ensure the database namespace has an ingress policy allowing traffic from the app namespace.

### Scenario 3 — "We want to prevent all future deployments from running privileged containers, cluster-wide, without reviewing every team's Deployments manually."
**Question:** What is the scalable enforcement mechanism?
**Answer:** OPA/Gatekeeper with a ConstraintTemplate that rejects pods with `securityContext.privileged: true`, or the built-in Pod Security Standards with a `restricted` or `baseline` namespace label.
**Explanation:** The built-in Pod Security Standards are the simplest: label a namespace with `pod-security.kubernetes.io/enforce: restricted` and Kubernetes will automatically reject any pod creation that violates the restricted standard (which includes privileged containers). For more granular or custom policies (e.g., "no containers with tag 'latest'"), use OPA/Gatekeeper with a custom ConstraintTemplate written in Rego.
