# Homework — What Is a Container

> Build something to prove you understand the concept, not just read about it.

## Exercise: Shared Image, Separate Writable Layers

**Scenario:** Your team lead says "containers are cheap because they share image layers." You want to prove this is actually true, not just a talking point, and also verify that three containers from the same image cannot see each other's writes.

**Build:** Run 3 containers from the same Alpine image simultaneously. In each container, write a unique file to `/data/`. Then verify from each container that it can only see its own file — not the other two. Use `docker inspect` to confirm all three share the same image ID.

**Constraints:**
- Use `docker run -d` to keep all three alive at the same time, not sequentially — they must be running concurrently so you can interact with each one.
- Write different content to the same path (`/data/container-proof.txt`) in each container — this is the key test of layer isolation.
- Use `docker exec` to read the file from each container and show that each sees only its own version.
- Use `docker inspect <container> --format '{{.Image}}'` on all three and confirm the image SHA is identical.
- Clean up all three containers after you finish.

## Stretch 1: Prove PID Isolation with a Script

Write a shell script (`pid-isolation-proof.sh`) that:
1. Starts a container running `sleep 300` in the background.
2. Inside the container, runs `ps aux` and captures the output — the sleep process should appear as PID 1 or a very low PID.
3. On the host, runs `ps aux | grep sleep` and captures the host-side PID — which will be a high number.
4. Prints both PIDs side by side with a clear label: "Container sees PID: X — Host sees PID: Y — Same process, two namespaces."
5. Cleans up the container.

This is the single most clarifying exercise for understanding what namespaces actually do.

## Stretch 2: Inspect Cgroup Limits

Run a container with an explicit memory limit: `docker run -d --memory=128m --name limited alpine:3.19 sleep 300`. Then:
1. Use `docker inspect limited --format '{{.HostConfig.Memory}}'` to confirm the limit is set at the Docker level.
2. If you are on Linux (not Docker Desktop), inspect the actual cgroup file: `cat /sys/fs/cgroup/memory/docker/<container-id>/memory.limit_in_bytes`. Confirm it matches.
3. Run a container without a memory limit and inspect the same field. Observe that the value is 0 (no limit applied).
4. Explain in a comment in your notes: what happens to a container that exceeds its memory limit?

## Reflection

- What would happen if two containers from the same image both write to `/etc/hosts`? Would they conflict? Why or why not?
- Why can you run 50 containers from the same 500MB base image without using 25GB of disk?
- A colleague says "I'll just write the output files inside the container — it's fine for now." What is the production risk, and what is the correct fix?

## Done when

- [ ] Three containers are running simultaneously from alpine:3.19
- [ ] Each container has written a unique file to `/data/container-proof.txt`
- [ ] `docker exec` on each container shows only that container's version of the file
- [ ] `docker inspect` on all three shows the same image SHA
- [ ] All three containers are cleaned up
- [ ] (Stretch 1) `pid-isolation-proof.sh` runs and outputs both the in-container and host PIDs for the same process

---

## Clean Code Lens

**Principle in focus:** Single Responsibility Principle

A container should do one thing. Not because it's technically impossible to run multiple processes in one container, but because multi-process containers violate SRP at the infrastructure level: the container image becomes responsible for the lifecycle of multiple concerns simultaneously. If your web server needs to restart but your log shipper doesn't, you can't act on that independently. If your app crashes but the cron job is fine, you lose both when the container is replaced.

The SRP applied to containers means: one container per process concern. A web server container serves HTTP. A log aggregator container ships logs. A migration job container runs schema migrations and exits. When each container has one responsibility, you can scale them independently, replace them independently, and set resource limits that match their actual needs — not the combined worst-case of everything they do.

**Exercise:** Take any multi-process startup script you have seen (or can imagine — a startup.sh that starts nginx AND a background worker AND a cron job) and redesign it as three separate containers in a docker-compose.yml. Each service gets its own image, its own restart policy, and its own resource limits. Write the compose file.

**Reflection:** How does applying SRP at the container level make an on-call incident easier to respond to? Think about what you would look at first when one part of the system is slow, and how a single-container-per-responsibility model makes that investigation faster.
