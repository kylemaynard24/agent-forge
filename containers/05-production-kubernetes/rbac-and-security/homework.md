# Homework — RBAC and Security

> The penetration test report landed. An attacker who compromised a single pod was able to read every Secret in the cluster, write to the host filesystem, and pivot to the database. None of this required any CVE exploitation — it was all misconfigurations.

## Exercise: Lock It Down

**Scenario:** You have an existing Deployment with no security controls. Your job is to harden it to the point where a compromised container cannot do meaningful damage.

**Build:**
1. Deploy the baseline insecure pod (no securityContext, BestEffort resources):
   ```yaml
   # intentionally insecure baseline — document what the attacker can do from here
   ```
2. Run these "attacker reconnaissance" commands from inside the pod and record the results in `observations.md`:
   ```bash
   kubectl exec -it <pod> -- whoami
   kubectl exec -it <pod> -- cat /proc/1/status | grep CapEff
   kubectl exec -it <pod> -- touch /etc/i-am-an-attacker
   kubectl exec -it <pod> -- cat /var/run/secrets/kubernetes.io/serviceaccount/token | cut -c 1-50
   ```
3. Add the full securityContext (runAsNonRoot, runAsUser: 1000, readOnlyRootFilesystem, allowPrivilegeEscalation: false, drop ALL, seccompProfile: RuntimeDefault)
4. Mount `emptyDir` volumes at any path the app needs to write to (`/tmp`, `/var/cache`, `/var/run`)
5. Re-run the same attacker commands — document what changes in `observations.md`

**Constraints:**
- The pod must start and pass a readiness probe after hardening — do not just add securityContext and call it done; fix whatever breaks
- `kubectl exec -- whoami` must not return `root` after hardening
- `kubectl exec -- touch /etc/test` must fail with "read-only file system" after hardening
- Document every `emptyDir` volume you had to add and why the app needed it

## Part 2: NetworkPolicy

1. Deploy two pods: `frontend` and `backend`. The `frontend` pod is the only one that should reach `backend`
2. Apply a `default-deny-ingress` NetworkPolicy to the namespace
3. Verify `frontend` CANNOT reach `backend` (as expected under default-deny)
4. Add a targeted NetworkPolicy that allows only `frontend` pods to reach `backend` on port 8080
5. Verify `frontend` CAN now reach `backend` and record the `wget` output
6. Verify a third pod (`attacker`) CANNOT reach `backend`

**Constraints:**
- The `default-deny` NetworkPolicy must match ALL pods (empty podSelector)
- The allow rule must use `podSelector` to identify the allowed source, not `ipBlock`
- Document the NetworkPolicy YAML in `observations.md` with inline comments explaining each field

## Stretch 1

Install OPA/Gatekeeper:

```bash
helm repo add open-policy-agent https://open-policy-agent.github.io/gatekeeper/charts
helm install gatekeeper open-policy-agent/gatekeeper -n gatekeeper-system --create-namespace
```

Create a `ConstraintTemplate` and `Constraint` that rejects any Pod that does not set `runAsNonRoot: true`. Test it by trying to apply a Pod without the securityContext — confirm Gatekeeper blocks it with a clear error message.

## Stretch 2

Verify with `kubectl auth can-i` that your Deployment's ServiceAccount has the minimum required permissions. It should be able to read its own namespace's ConfigMaps but not Secrets, not Pods in other namespaces, and definitely not ClusterRoles.

```bash
kubectl auth can-i get secrets --as system:serviceaccount:<ns>:<sa-name> -n <ns>
kubectl auth can-i list pods --as system:serviceaccount:<ns>:<sa-name> --all-namespaces
```

If any permission is overly broad, create a scoped Role and RoleBinding to replace the default ServiceAccount's access.

## Reflection

- Why does dropping ALL capabilities not break most web APIs? What capability do you need to add back if your app needs to bind to port 80?
- A NetworkPolicy's `podSelector: {}` matches all pods. What does `namespaceSelector: {}` match, and what is the security implication?
- Your team uses `kubectl exec` into production pods for debugging. How do you reconcile this with a production security posture that disallows shell access to containers?

## Done when

- [ ] Hardened pod is running and passes readiness probe
- [ ] `whoami` returns a non-root UID inside the hardened pod
- [ ] Writing to `/etc` fails with "read-only file system" in the hardened pod
- [ ] `observations.md` has before/after attacker reconnaissance results
- [ ] `default-deny` NetworkPolicy is applied
- [ ] `frontend` → `backend` communication works; `attacker` → `backend` is blocked
- [ ] NetworkPolicy YAML is commented and in `observations.md`

---

## Clean Code Lens

**Principle in focus:** Defense in Depth (Layered Protection)

In software architecture, defense in depth means not relying on a single security control — you layer them so that a failure in any one layer does not mean complete compromise. In Kubernetes, this principle maps directly to the security controls in this topic.

Each control is a layer: securityContext limits what the process can do, NetworkPolicy limits where it can go, RBAC limits what it can access in the Kubernetes API. No single control is sufficient. A pod with a perfect securityContext but no NetworkPolicy can still pivot to the database. A pod with perfect NetworkPolicy but running as root can still write malicious files to its own container.

Clean code applies the same thinking to error handling: a function does not just return an error code — it validates inputs, handles the error at the right layer, logs with context, and exposes meaningful signals to the caller. Defense in depth for code.

**Exercise:** Map the four security controls (securityContext, NetworkPolicy, RBAC, PodSecurityStandards) to their equivalent defensive layer in traditional application security (input validation, authentication, authorization, audit logging). Draw the analogy table. Where does the mapping break down?

**Reflection:** Defense in depth can become theater — adding controls that look impressive but do not address real attack paths. How do you evaluate whether a Kubernetes security control is genuinely reducing risk versus just satisfying a compliance checkbox? What is your test?
