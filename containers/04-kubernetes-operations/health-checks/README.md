# Health Checks

**Area:** Kubernetes Operations

## Intent

Configure liveness, readiness, and startup probes so Kubernetes knows precisely when to route traffic to your pod, when to wait for it, and when to restart it.

## When to use

- Every production workload — all three probe types should be considered for every Deployment
- Readiness is required whenever your app has an initialization phase (cache warm-up, migration check, schema load)
- Startup probe is required whenever your app takes more than a few seconds to become live under a load

## Why it matters

Without probes, Kubernetes routes traffic to your pod the moment the container process starts — before your app is listening on its port. Users get connection refused errors. When your app enters a deadlock or infinite loop, Kubernetes does not know it needs to restart the process — it just sits there returning 500s.

Probes give Kubernetes a feedback loop. Readiness controls the Service endpoint list: a pod that fails readiness is removed from rotation but stays running, which is the right behavior for a temporarily overloaded app or one waiting on a dependency. Liveness controls restarts: a pod that fails liveness is killed and replaced, which is right for a crashed or deadlocked app. Getting this distinction wrong is one of the most common causes of cascading failures in Kubernetes clusters.

## Core concepts

- **Liveness probe** — answers "is this process still alive?" — failure triggers a restart
- **Readiness probe** — answers "is this process ready to serve requests?" — failure removes the pod from Service endpoints without restarting it
- **Startup probe** — answers "has this process finished starting up?" — disables liveness and readiness until it passes; designed for slow-starting apps
- **httpGet** — sends an HTTP GET to a path and port; 2xx/3xx response = success
- **tcpSocket** — opens a TCP connection to a port; successful connection = success; useful when you have no HTTP endpoint
- **exec** — runs a command inside the container; exit code 0 = success; use as a last resort — it forks a process every interval
- **grpc** — calls the gRPC health protocol (requires `grpc.health.v1.Health/Check`)
- **initialDelaySeconds** — how long to wait after container start before the first probe fires
- **periodSeconds** — how often the probe runs (default 10)
- **failureThreshold** — how many consecutive failures before the action triggers (default 3)
- **successThreshold** — how many consecutive successes before the probe is considered passing (default 1; for liveness must be 1)
- **timeoutSeconds** — how long to wait for a probe response before counting it as a failure (default 1)
- **/healthz** — conventional path for liveness; should return 200 as long as the process is alive, even if dependencies are down
- **/readyz** — conventional path for readiness; should return 200 only when the app is ready to serve traffic

## Common mistakes

- **Liveness probe too aggressive** — setting `initialDelaySeconds` too low or `failureThreshold: 1` causes restart loops during normal startup; fix: use a startup probe to cover the init window
- **Same probe for liveness and readiness** — pointing both probes at `/healthz` means a slow dependency causes restarts instead of just traffic removal; fix: `/healthz` for liveness (process-only check), `/readyz` for readiness (dependency check)
- **Probing the database in the liveness probe** — if the DB goes down, all your pods restart in a loop, making recovery much harder; fix: only check DB reachability in the readiness probe; the pod should stay alive but out of rotation when the DB is unreachable
- **Not setting timeoutSeconds** — the default is 1 second; if your `/readyz` endpoint does a real DB ping it may regularly timeout under load; fix: set `timeoutSeconds: 3` and make the probe endpoint fast

## Tiny example

You have a .NET API that runs EF Core migrations on startup (takes ~20 seconds). Here is a correct probe configuration:

```yaml
startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 15       # 15 * 2s = 30s maximum startup window
  periodSeconds: 2

livenessProbe:
  httpGet:
    path: /healthz            # fast process-only check
    port: 8080
  initialDelaySeconds: 0      # startup probe already covered the delay
  periodSeconds: 10
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /readyz             # checks DB connectivity
    port: 8080
  periodSeconds: 5
  failureThreshold: 3
```

The startup probe fires every 2 seconds, giving a 30-second window. Once it passes once, liveness and readiness take over. If the DB becomes unreachable later, readiness fails and the pod is removed from the Service — but liveness continues to pass and the pod is not restarted.

## Run the demo

```bash
bash demo.sh
```

The demo deploys a pod with all three probe types, then deliberately breaks the readiness and liveness endpoints in sequence. You watch what Kubernetes does differently in each case.

## Deeper intuition

Think of the three probes as three different people asking three different questions about your pod:

The **startup probe** is the bouncer checking if the kitchen is open yet. Nobody gets in until the kitchen says yes.

The **liveness probe** is the manager doing a welfare check — "are you conscious?" If the answer is no, they call an ambulance (restart). The welfare check should be trivial — just "am I responding at all?" It should never require the DB to be up.

The **readiness probe** is the host checking if a table is ready for guests. The table might be occupied (handling a long request), the waiter might be refilling water (warming a cache), or the restaurant might be at capacity. In all those cases, the right answer is "send the next guests to another table," not "flip the table over and start fresh."

This mental model is why the liveness and readiness endpoints must check different things.

## Scenario questions

### Scenario 1 — "We deployed a new version. Pods are crash-looping. kubectl describe shows 'Liveness probe failed: HTTP probe failed with statuscode: 500'."
**Question:** The app's `/healthz` endpoint calls the database. The database is down for maintenance. Is this probe configuration correct?
**Answer:** No. The liveness probe is triggering restarts when the database is down, but the app process itself is fine.
**Explanation:** A liveness probe should only verify that the application process is alive and responsive. It should never check external dependencies. Move the database health check to the readiness probe. When the database is down, readiness fails (pod leaves Service rotation), but liveness passes (pod stays running and can recover automatically when the database comes back).

### Scenario 2 — "Our new service starts in about 40 seconds but we're getting 'Back-off restarting failed container' right away."
**Question:** What is happening and what is the fix?
**Answer:** The liveness probe is firing during the startup window and restarting the container before it finishes initializing.
**Explanation:** Add a startup probe with `failureThreshold * periodSeconds` greater than 40 seconds (e.g., `failureThreshold: 30, periodSeconds: 2` = 60s window). The startup probe disables both liveness and readiness until it succeeds. Once it passes, normal probe evaluation begins.

### Scenario 3 — "During a traffic spike, our API pods are healthy but the Service stops routing requests to two of the five pods."
**Question:** Is this a bug or expected behavior? What should you investigate?
**Answer:** This is expected Kubernetes behavior — the two pods are failing their readiness probes.
**Explanation:** Kubernetes is doing exactly what it should: removing overloaded or temporarily degraded pods from the Service load-balancing pool while keeping them alive to recover. Investigate what the readiness probe checks — it may be a dependency (database, cache) that is responding slowly under the spike, or the pods themselves may be at memory/CPU limits. Check `kubectl describe pod` and `kubectl top pod` for evidence.
