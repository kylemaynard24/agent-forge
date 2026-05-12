# Homework — Deployments and ReplicaSets

> A deployment that you can't roll back in 60 seconds is a deployment you're not ready to ship.

## Exercise: Deploy, Break, and Recover Under Pressure

**Scenario:** You're the on-call engineer. A colleague just pushed a new image with a bad tag to your staging Kubernetes cluster. Pods are failing to start, but because you configured the rollout correctly, some old pods are still serving traffic. Your job is to roll back, investigate, annotate, and implement the canary stretch to prevent this class of failure in the future.

**Build a 3-replica nginx Deployment with these properties:**

1. Uses `nginx:1.25` as the initial image
2. Rolling update strategy with `maxUnavailable: 0` and `maxSurge: 1` — no pod should go down until a replacement is healthy
3. `minReadySeconds: 10` — a pod must be ready for 10 seconds before the rollout proceeds
4. A `readinessProbe` that checks GET `/` on port 80 every 5 seconds
5. Resource requests set (`cpu: 50m`, `memory: 32Mi`)
6. An initial `kubernetes.io/change-cause` annotation: `"Initial deploy — nginx 1.25 stable"`

**Steps to complete:**

**Step 1 — Deploy and verify:**
```bash
kubectl apply -f deployment.yaml
kubectl rollout status deployment/webserver
kubectl get pods -o wide
```

**Step 2 — Trigger a bad update:**
Update the image to `nginx:this-tag-definitely-does-not-exist`. Watch the rollout fail. Document what you see in `kubectl get pods` — specifically which pods are in what states. Answer: why are some old pods still running?

**Step 3 — Roll back with a reason:**
Run `kubectl rollout undo deployment/webserver`. Then annotate the current revision:
```bash
kubectl annotate deployment/webserver \
  kubernetes.io/change-cause="ROLLBACK: reverted bad image tag — was nginx:this-tag-definitely-does-not-exist" \
  --overwrite
```
Capture `kubectl rollout history deployment/webserver` showing at least 3 revisions.

**Step 4 — Verify recovery:**
Prove all 3 replicas are running and serving traffic:
```bash
kubectl get pods
kubectl exec -it <any-pod> -- curl -s -o /dev/null -w "%{http_code}" http://localhost/
```
Expected: `200`

**Constraints:**
- `maxUnavailable` must be `0` — prove this by showing that during the failed rollout, `kubectl get pods` always shows at least 3 pods in a running state
- The deployment manifest must be in a file called `deployment.yaml` — no imperative-only approaches
- The rollout history must show the `CHANGE-CAUSE` annotations (not just "Update image nginx=...")

## Stretch 1: Canary with Two Deployments
Implement a canary deployment alongside the stable one. Create:
- `webserver-stable` deployment: 4 replicas of `nginx:1.25`, label `app: webserver, track: stable`
- `webserver-canary` deployment: 1 replica of `nginx:1.26`, label `app: webserver, track: canary`
- A single Service with selector `app: webserver` (matches both)

Verify traffic hits both versions by exec-ing into a debug pod and running `curl http://webserver/` multiple times, then checking which nginx version responds (hint: `curl -s http://localhost/ | grep nginx` won't help directly — try `curl -si` and read the server header, or use different content). After validating, "promote" the canary: update `webserver-stable` to `nginx:1.26` and delete `webserver-canary`.

## Stretch 2: Resource-Based Autoscaling
Install the metrics-server on your cluster if not already present. Add a HorizontalPodAutoscaler (HPA) to your webserver Deployment that scales between 2 and 10 replicas based on CPU utilization (target 50%). Simulate load with `kubectl run load-gen --image=busybox -- sh -c "while true; do wget -q -O- http://webserver/; done"` and watch the HPA scale up.

## Reflection

- `kubectl rollout undo` is fast. Why? (Hint: what is it actually doing to the ReplicaSets, and does it need to pull any images?)
- You set `minReadySeconds: 10` but your app actually takes 30 seconds to warm up its caches. What's the consequence, and what's the correct fix?
- The Deployment controller keeps old ReplicaSets around (scaled to 0) for rollback. `revisionHistoryLimit` defaults to 10. If you set it to 0, what do you gain and what do you lose?

## Done when

- [ ] `deployment.yaml` is written with correct rolling update strategy (`maxSurge: 1`, `maxUnavailable: 0`)
- [ ] Initial rollout completes successfully (3 pods Running, all passing readiness probes)
- [ ] Bad image update was applied and pods observed in `ImagePullBackOff` or `ErrImagePull`
- [ ] At least 3 pods remained Running during the failed rollout (proving `maxUnavailable: 0` worked)
- [ ] `kubectl rollout undo` completed and all 3 replicas are healthy
- [ ] `kubectl rollout history` output shows 3+ revisions with `CHANGE-CAUSE` annotations
- [ ] Curl from inside a pod returns HTTP 200

---

## Clean Code Lens

**Principle in focus:** Fail Fast

In application code, Fail Fast means detecting and surfacing errors as early as possible rather than propagating invalid state through the system. In Kubernetes deployments, the equivalent discipline is configuring rollouts to fail fast when something goes wrong, rather than letting a bad rollout slowly take down your entire fleet.

The `progressDeadlineSeconds`, `minReadySeconds`, `maxUnavailable`, and readiness probes are all Fail Fast mechanisms. Without a readiness probe, Kubernetes marks a pod Ready the moment its containers start — even if the app isn't actually serving requests. The rollout proceeds, old pods are terminated, and you have a fleet of pods that look healthy but return 500. With a readiness probe, a pod only becomes Ready when the app is actually ready, and the rollout pauses if enough pods are failing their probes. The failure is detected at the deployment stage, not after traffic shifts.

`progressDeadlineSeconds` is the Fail Fast timer for the entire rollout. If the rollout doesn't make forward progress (new pods becoming ready) within this window, Kubernetes marks the rollout as Failed and stops trying. This surfaces a stuck rollout immediately rather than silently hanging your pipeline for hours.

**Exercise:** Review the readiness probe configuration in your `deployment.yaml`. What is the worst-case time between a pod becoming unhealthy and the rollout pausing to protect your users? Calculate: `initialDelaySeconds` + (`failureThreshold` × `periodSeconds`). Is this acceptable for your SLA?

**Reflection:** You've configured `maxUnavailable: 0` to protect users during rollouts. But this means a rollout on a fully-saturated cluster (all nodes at capacity) will stall — there's no room to add the surge pod. How do you design your cluster capacity to account for rollout headroom?
