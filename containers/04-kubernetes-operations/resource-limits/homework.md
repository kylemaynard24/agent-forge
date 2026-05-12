# Homework — Resource Limits

> The app works fine in dev. In production, under real load, it crashes with OOMKilled every 2 hours. You have never looked at its resource configuration.

## Exercise: Size It Right

**Scenario:** You are inheriting a .NET 8 API Deployment with no resource limits configured. Your job is to: deliberately break it with a too-low memory limit, observe the crash, then calibrate the right limits using real usage data and a LimitRange to protect the namespace.

**Build:**
1. Deploy the API Deployment (use `nginx:1.25` or `polinux/stress` as a stand-in) with deliberately low limits: `memory: "20Mi"`, `cpu: "50m"`
2. Run a load test using `kubectl run` with a `busybox` pod to send continuous requests to the service
3. Watch the pod get OOMKilled — record the `kubectl describe pod` output and restart count
4. Increase memory to a reasonable value (`256Mi` request, `512Mi` limit) and re-run the load test — confirm no OOMKill
5. Apply a `LimitRange` to the namespace with sane defaults so that future pods without resource specs inherit them

**Constraints:**
- The Deployment must have both a request and a limit set for CPU and memory — no BestEffort QoS
- Memory limit must be at least 1.5x the memory request — document why in a comment
- You must capture the OOMKilled event from `kubectl describe pod` in your `observations.md`
- The LimitRange must prevent any container from setting a memory limit above `1Gi` — use the `max` field

## Stretch 1

Install the Vertical Pod Autoscaler in `Off` mode (recommendation only). Deploy your app and run a 5-minute load test. After the test, run:

```bash
kubectl describe vpa <vpa-name>
```

Record the VPA's CPU and memory recommendations in `observations.md`. Compare them to what you set manually. Adjust your Deployment's requests to match the VPA's `target` recommendations.

## Stretch 2

Add a `ResourceQuota` to the namespace that limits total memory requests to `2Gi` and total CPU requests to `2000m`. Then try to deploy a second copy of the Deployment that would push the namespace over the quota. Document what Kubernetes returns — the error message and the object it rejects.

## Reflection

- What is the difference between a pod being OOMKilled and a pod being evicted? When does each happen?
- Why is setting `cpu limit = cpu request` (Guaranteed QoS) sometimes the wrong choice for a web API even though it sounds safer?
- A teammate argues "just set very high limits — it costs nothing if the pod doesn't use them." Is this correct? What are the actual consequences?

## Done when

- [ ] OOMKilled event is captured in `observations.md` with restart count > 0
- [ ] Updated Deployment runs under load without OOMKill
- [ ] `kubectl get pod -o jsonpath='{.status.qosClass}'` shows `Burstable` for the production Deployment
- [ ] LimitRange is applied and verified with `kubectl describe limitrange`
- [ ] You can explain the difference between CPU throttling and OOMKill to a teammate

---

## Clean Code Lens

**Principle in focus:** Make It Explicit

A Deployment with no resource specification is a lie of omission. It appears to work, but it makes a hidden assumption: that the cluster has infinite capacity available and that no neighboring pod will ever compete for resources. In code, this is equivalent to a function that silently swallows exceptions — it appears to succeed until it spectacularly does not.

Explicit resource specifications are a form of documentation. They tell the next engineer: "this service needs at least 256MB and 250m CPU to run correctly; under load it may use up to 512MB and 1 CPU." That information is more valuable than a comment, because the scheduler actually enforces it. The LimitRange and ResourceQuota take explicitness further — they make the namespace's capacity contract visible and enforceable.

**Exercise:** Look at a Deployment in your project (or a sample from this curriculum). Identify every implicit assumption it makes about its runtime environment: CPU, memory, disk, network, external services. Which of these can be made explicit in Kubernetes YAML? Write the explicit version.

**Reflection:** If "make it explicit" is a clean code principle, does the same logic apply to environment variables, connection strings, and feature flags? What would the Kubernetes equivalent of "explicit configuration" look like for those?
