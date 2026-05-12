# Homework — Autoscaling

> Traffic doubles every 6 months and you are hand-bumping replicas in your deployment YAML on Friday afternoons. There is a better way.

## Exercise: HPA Under Load

**Scenario:** You are deploying a .NET 8 API that processes HTTP requests and has variable daytime traffic. You need to configure an HPA that: scales out when CPU exceeds 60%, scales back in conservatively (to avoid flapping), and never drops below 1 replica or exceeds 5.

**Build:**
1. Deploy the API with correct resource requests (`cpu: "100m"`, `memory: "128Mi"`) and limits (`cpu: "500m"`, `memory: "256Mi"`)
2. Create an HPA with `minReplicas: 1`, `maxReplicas: 5`, target CPU at `60%`, and a `scaleDown.stabilizationWindowSeconds: 120`
3. Run a load test using a `busybox` pod in the same namespace:
   ```bash
   kubectl run load -n <namespace> --image=busybox:1.36 --restart=Never -- \
     /bin/sh -c "while true; do wget -q -O- http://my-api/; done"
   ```
4. Watch `kubectl get hpa -w` until you see replicas increase beyond 1
5. Delete the load generator pod and watch replicas decrease after the stabilization window

**Constraints:**
- The Deployment must have resource requests set — HPA will not function without them
- Do not set `scaleDown.stabilizationWindowSeconds` below 60 seconds — document why shorter windows cause flapping
- Record the HPA `TARGETS` column output before load, during peak load, and after cooldown in `observations.md`
- Prove scale-in happened: capture `kubectl get hpa` showing replicas returning to 1

## Stretch 1

Install KEDA:

```bash
helm repo add kedacore https://kedacore.github.io/charts
helm repo update
helm install keda kedacore/keda --namespace keda --create-namespace
```

Create a ScaledObject for a `queue-worker` Deployment that:
- Uses a cron trigger (e.g., scale to 2 replicas from 09:00 to 17:00 on weekdays, scale to 0 otherwise)
- Sets `minReplicaCount: 0` so the deployment scales to zero outside business hours

```yaml
triggers:
- type: cron
  metadata:
    timezone: America/Chicago
    start: "0 9 * * 1-5"
    end: "0 17 * * 1-5"
    desiredReplicas: "2"
```

Watch `kubectl get pods` at the boundary time (or manually test by adjusting the cron expression to fire in 2 minutes).

## Stretch 2

Run the VPA recommender in `Off` mode alongside the HPA. After the load test, inspect the VPA recommendation:

```bash
kubectl describe vpa my-api-vpa
```

Compare the VPA's `target` CPU and memory recommendations to your manually configured requests. Adjust your Deployment's requests to match the VPA recommendation and document whether HPA behavior changes.

## Reflection

- HPA computes `desiredReplicas = ceil(currentReplicas * (currentMetric / targetMetric))`. Walk through the math: if you have 3 replicas and current CPU is 80% against a target of 60%, what does HPA want to scale to?
- Why is `minReplicas: 0` not supported in standard HPA but supported in KEDA?
- If you use HPA on CPU and VPA in Auto mode at the same time, what failure mode do you get? How would you detect it?

## Done when

- [ ] HPA is deployed and shows `TARGETS` above 60% during the load test
- [ ] `kubectl get hpa -w` output is captured showing scale-up then scale-down
- [ ] Scale-down happens after the stabilization window (not immediately after load stops)
- [ ] `observations.md` contains HPA status snapshots: before, during, and after load
- [ ] You can explain the stabilization window trade-off verbally

---

## Clean Code Lens

**Principle in focus:** Don't Repeat Yourself (DRY)

Manually setting `replicas: 3` in a Deployment is repeating yourself in a loop — every deploy, every incident, every traffic change requires you to re-evaluate the number and update it by hand. HPA makes the policy explicit once (min, max, target) and then the system applies it continuously. The goal is to encode the decision logic, not the decision's current output.

This is the same insight behind configuration-over-code in clean architecture. A function that has `if isProd: replicas = 5` baked in has the same smell as a Deployment with a hardcoded replica count — both embed a policy decision in the wrong layer. HPA moves that policy to the right layer: the runtime control plane, where it can react to real data.

**Exercise:** Look at your current Deployment YAML files (or sample ones from this curriculum). Identify all values that are currently hardcoded but that you change by hand when conditions change (replica count, resource limits, image tags). For each one, identify the right Kubernetes object or pattern that would make the decision automatic rather than manual.

**Reflection:** DRY applied to infrastructure means "express each policy once, in the right place." What is the Kubernetes equivalent of a DRY violation — what does it look like when the same operational decision is encoded in multiple places that can get out of sync?
