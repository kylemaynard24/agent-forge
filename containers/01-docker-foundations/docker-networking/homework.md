# Homework — Docker Networking

> Build something to prove you understand the concept, not just read about it.

## Exercise: Web + Database Network Isolation

**Scenario:** Your team is setting up a local development environment for a web application backed by a PostgreSQL database. The security-conscious lead developer has one rule: the database must not be directly reachable from the developer's host machine (no accidental `psql` from the wrong environment), but the web container must be able to reach it by name. Prove both constraints hold.

**Build:** Create a two-container setup using a user-defined bridge network. Use an `nginx` container as a stand-in for the "web" tier and a `postgres` container for the database tier. Prove that:

1. The web container can resolve and reach the database container by name.
2. The database container is NOT reachable from the host (no port published to the host for postgres).
3. The web container IS reachable from the host (publish nginx's port 80 to host port 8088).

**Constraints:**
- Create a named user-defined bridge network (e.g., `homework-net`) — do not use the default bridge.
- Run the postgres container with `POSTGRES_PASSWORD=localdev` and `POSTGRES_DB=appdb` environment variables. Do NOT publish its port to the host.
- Run the nginx container connected to the same network and publish its port to host port 8088.
- Prove database isolation: try `psql -h localhost -p 5432 -U postgres appdb` from the host — it should fail with a connection refused error (because no port is published).
- Prove web container can reach the database: exec into the nginx container and run `nc -zv postgres 5432` — it should succeed (because they are on the same network).
- Document your findings: after each test, print a one-line statement of what you observed and what it proves.

## Stretch 1: Connect a Third Container to the Database Directly

Run a third container — a `psql` client — on the same network and use it to actually connect to the postgres database and run a query. The command will be something like:

```bash
docker run --rm --network homework-net postgres:16 \
  psql -h postgres -U postgres -d appdb -c "SELECT version();"
```

This proves that database access is controlled by network membership, not by which machine you're sitting at. If you are on the network, you can reach the service by name.

## Stretch 2: Inspect iptables Rules (Linux only)

On a Linux host (not Docker Desktop for Mac/Windows), run `sudo iptables -t nat -L -n` before and after creating the user-defined network. Identify the rules Docker added to route traffic between the bridge and the host interface. Write a comment explaining what each relevant rule does. This exercise makes the networking machinery concrete rather than magical.

On Docker Desktop (Mac/Windows), instead: use `docker network inspect homework-net` and draw the network topology — which containers are attached, what their IPs are, what subnet the bridge occupies. Screenshot or write out the topology.

## Reflection

- You added a third container (a migration job) to the system. Should it be on the same `homework-net` network as the web and database containers? What is the argument for and against giving migration jobs the same network access as the running application?
- A teammate says "just publish all ports for development, we'll lock it down in production." What are the two specific risks of this approach, even in a development environment?
- Container A is on `network-1`. Container B is on `network-2`. Can you connect container B to `network-1` without restarting it? How?

## Done when

- [ ] User-defined network `homework-net` created and confirmed with `docker network ls`
- [ ] nginx and postgres containers running on `homework-net`
- [ ] `curl http://localhost:8088` from host returns an HTTP response (nginx reachable)
- [ ] `psql -h localhost -p 5432 -U postgres appdb` from host fails with connection refused (postgres not published)
- [ ] `docker exec <nginx-container> nc -zv postgres 5432` succeeds (internal connectivity works)
- [ ] All containers and network cleaned up after the exercise

---

## Clean Code Lens

**Principle in focus:** Interface Segregation Principle

ISP says clients should not be forced to depend on interfaces they don't use. Applied to container networking: services should only be connected to the networks they actually need to communicate on. A batch job that writes to a database doesn't need to be on the same network as the public-facing web tier. A monitoring scraper doesn't need to be on the application database network.

Network segmentation at the Docker level (and later at the Kubernetes NetworkPolicy level) is ISP applied to infrastructure. Each service gets access to only the network segments its actual communication pattern requires. The blast radius of a compromised container is limited to the networks it is connected to.

**Exercise:** Design the network topology for a system with four services: a public-facing API, an internal admin service, a shared PostgreSQL database, and a Redis cache. The API talks to the database and cache. The admin service talks only to the database. Redis and PostgreSQL are never directly reached from outside the system. Draw or describe which services share which networks, and write the `docker network create` commands that implement it.

**Reflection:** How does this principle apply when your team adds a fifth service? What is the default you should reach for — "put it on the existing shared network" or "create a new network and add the minimum required connections"? What changes your answer?
