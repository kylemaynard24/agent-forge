# Homework — Health Checks

> A pod that starts fast in dev mysteriously crash-loops in production. The fix is two lines of YAML — but only if you understand which probe does what.

## Exercise: Three Probes, Three Behaviors

**Scenario:** You are deploying a .NET 8 API to a staging cluster. The API runs EF Core migrations on startup (simulated as a 25-second sleep). It exposes `/healthz` (returns 200 while the process is alive) and `/readyz` (returns 200 only after migrations complete and the DB is reachable). A slow DB query occasionally causes `/readyz` to return 503 temporarily — you do not want the pod restarted when that happens.

**Build:** Deploy the app (you can use the `nginx:1.25` image as a stand-in, using init containers to simulate the startup time and a ConfigMap-mounted script to simulate the different probe responses). Configure all three probes correctly so that:
1. The pod is not killed during the 25-second startup window
2. A `/readyz` failure removes the pod from Service endpoints but does not trigger a restart
3. A `/healthz` failure (simulated by stopping the nginx process) triggers a restart

**Constraints:**
- The startup probe must cover at least a 30-second window — use `failureThreshold` and `periodSeconds` to achieve this without setting `initialDelaySeconds` on liveness/readiness
- The liveness probe must point at a different path than the readiness probe — document why in a comment in your YAML
- You must demonstrate all three behaviors using `kubectl describe`, `kubectl get endpoints`, and restart counts — record the output in a file called `observations.md`
- The readiness probe must have `timeoutSeconds: 3` — explain in your notes why 1 second is dangerous for a DB-backed endpoint

## Stretch 1

Add a `tcpSocket` probe variant. Deploy a second pod where the liveness probe checks TCP connectivity to port 5432 (as if it were a Postgres sidecar). Show that blocking that port causes liveness to fail. Compare the behavior with the exec probe and the httpGet probe — note the trade-offs in `observations.md`.

## Stretch 2

Write a minimal ASP.NET Core health check endpoint using `Microsoft.Extensions.Diagnostics.HealthChecks`. Register two checks: one that always returns `Healthy` (for `/healthz`) and one that checks `IConfiguration["DB_READY"] == "true"` (for `/readyz`). Deploy it to your cluster and show Kubernetes using the real endpoints — not a simulated nginx stand-in.

## Reflection

- What happens to in-flight requests when a pod fails its readiness probe? Does Kubernetes drain them gracefully?
- If you set `successThreshold: 2` on your readiness probe, what changes about recovery behavior when a pod comes back up?
- Why is `failureThreshold: 1` dangerous on a liveness probe but acceptable on a startup probe?

## Done when

- [ ] All three probes are configured and the YAML is applied to the cluster
- [ ] `kubectl get pods` shows the pod is not killed during the 25-second init window
- [ ] `kubectl get endpoints` confirms a readiness failure removes the pod from the Service
- [ ] Restart count increments after a simulated liveness failure
- [ ] `observations.md` documents the output of `kubectl describe pod` events for both failure types
- [ ] You can explain out loud why `/healthz` and `/readyz` must check different things

---

## Clean Code Lens

**Principle in focus:** Single Responsibility

A probe endpoint should do exactly one thing and do it well. The `/healthz` liveness endpoint has a single responsibility: confirm the process is alive and responsive. The moment you add a database check to it, the endpoint is now responsible for both process health and dependency health — two separate concerns, two separate failure modes, two separate response strategies.

This is the same principle you apply to classes and functions. A `UserService` that also sends emails has two reasons to change (user logic changes, email provider changes). A liveness probe that also checks the database has two reasons to fail (process crashes, database drops). In both cases, the mix of responsibilities causes the wrong action at the wrong time: restarting a perfectly healthy process because an external dependency is down.

**Exercise:** Audit the probe configuration for a real or sample application. List every check performed in each probe endpoint. Draw a table with three columns: check, probe type it belongs in, and why. Verify your assignments against the principle: liveness = "is the process alive?", readiness = "is the process ready for traffic?", startup = "has the process finished initializing?".

**Reflection:** If Single Responsibility applies to probe endpoints, does it also apply to Kubernetes health check endpoints in your ASP.NET Core application code? What would a violation look like in that code, and how would you refactor it?
