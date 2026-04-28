# Pipes and Filters

**Category:** System Architecture

## Intent
Compose computation as a **pipeline of stages** (filters), each transforming its input and passing it on through a **pipe** (channel/stream). Stages are independent; you can rearrange, swap, or insert them.

The Unix shell (`grep | sort | uniq -c | head -10`) is the canonical example.

## When to use
- A sequence of independent transformations on streaming data.
- ETL: extract, transform, load.
- Compilers, image processing, log processing, audio mixing.
- When stages are independently testable and reusable across pipelines.

## Trade-offs
**Pros**
- Simple mental model: data flows through stages.
- Stages are highly reusable (a `tokenize` filter works in many pipelines).
- Stages are independently testable.
- Easy to parallelize: each stage can run on its own thread/process.

**Cons**
- Each stage's output schema must agree with the next's input schema. Mismatches at the wrong place are confusing.
- State that crosses stages becomes awkward (you end up passing context blobs).
- Errors mid-pipeline need a clear story (drop? retry? dead-letter?).

**Rule of thumb:** Pipes-and-filters is at its best when each stage is **stateless** and **does one thing.** When stages need to share state, you're heading back into a different architecture.

## Real-world analogies
- A car wash: pre-rinse → soap → scrub → rinse → dry. Each station does one thing; pull a station out and the line still runs.
- A factory assembly line.
- A musical signal chain: pickup → compressor → distortion → reverb → amp.

## Run the demo
```bash
node demo.js
```

The demo runs a text pipeline: `lowercase → strip-punct → tokenize → count`, showing how each filter can be composed, swapped, or replaced.
