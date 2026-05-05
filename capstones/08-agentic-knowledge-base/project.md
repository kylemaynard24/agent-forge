# Capstone 08 — Agentic Knowledge Base

## Context

Retrieval-Augmented Generation (RAG) is the pattern that makes LLMs useful for questions that require specific, current, or proprietary knowledge. Instead of relying on the model's training data, you retrieve relevant context from a knowledge store and include it with the query. The model answers from that context rather than from memory.

But basic RAG — retrieve the top-k chunks, stuff them in the prompt, generate — has well-documented failure modes: retrieved chunks may be irrelevant, answers may contradict each other, complex questions may require synthesizing information from multiple documents that weren't retrieved together.

This capstone builds a knowledge base system that uses an agent to handle the cases where basic RAG fails. The agent can: ask clarifying questions when the query is ambiguous, search multiple times with different queries when the first search doesn't find what's needed, synthesize across documents explicitly, and say "I don't know" when the knowledge base genuinely doesn't have the answer.

## Primary domains

| Domain | What this capstone exercises |
| --- | --- |
| `agentic-workflows` | tool design, memory patterns, single-agent design, evals, structured output |
| `architecture` | data patterns, caching, query patterns, pipeline design |
| `advanced-engineering` | testing and verification for AI systems, performance |

## What you'll build

**Ingestion pipeline**: reads documents from a source (markdown files, PDFs, web pages), chunks them, generates embeddings, and stores them in a vector database with metadata.

**Retrieval layer**: given a query, searches the vector store for semantically similar chunks. Returns a ranked list of chunks with their source documents and similarity scores.

**Basic RAG endpoint**: takes a query, retrieves top-k chunks, generates an answer with citations, and returns the result. This is the baseline.

**Agentic query handler**: an agent that handles queries the basic RAG can't answer well. It has tools: `search(query)` (vector search), `get_document(id)` (retrieve a full document), `ask_clarification(question)` (ask the user for clarification). It can call these multiple times per query, reasoning about what it found and what it still needs.

**Evaluation framework**: measures the quality of answers against a golden set. Tracks improvement over time as you tune the system.

**Admin interface**: add documents, remove documents, view what the knowledge base contains, run evaluation.

## Milestones

### Milestone 1: Ingestion pipeline (3-5 hours)
Build a pipeline that ingests markdown files. For each file: read the content, split it into chunks (decide on chunk size and overlap — this matters more than you expect), generate embeddings using an embedding model, and store in a vector database.

Start with a small corpus: 10-20 markdown documents. Use the READMEs in this repo if you want a convenient test corpus.

**Deliverable**: ingestion pipeline that correctly ingests a corpus of 20 documents. A documented chunking strategy with the reasoning behind it. A test: ingest 20 documents, verify all chunks are stored with correct metadata.

---

### Milestone 2: Retrieval and basic RAG (3-5 hours)
Implement vector similarity search. Given a query, embed it and find the k most similar chunks. Build the basic RAG endpoint: retrieve top-5 chunks, generate an answer with citations, return the result.

Test it with 10 questions you know the answers to from your corpus. How often is the answer correct? Where does it fail?

**Deliverable**: working basic RAG. A test report on 10 questions: correct answers, wrong answers, and analysis of why the failures happened.

---

### Milestone 3: Agentic query handler (6-10 hours)
Build the agent for queries that basic RAG gets wrong. The agent has:
- `search(query)` — does a vector search and returns the top chunks
- `get_document(doc_id)` — retrieves a full document by ID
- `ask_clarification(question)` — sends a clarifying question to the user (your test harness should handle these)

The agent decides when to call each tool. It can search multiple times with different queries. It should cite its sources explicitly.

Test it on the questions where basic RAG failed. Does the agent get them right?

**Deliverable**: working agentic handler. A comparison of basic RAG vs. agent performance on the same 10 questions. Analysis: what kinds of questions benefit most from the agent? What kinds are no better?

---

### Milestone 4: Evaluation framework (4-6 hours)
Build a golden set: 20 question/answer pairs where you know the correct answer. Run both the basic RAG and the agentic handler. Score them on:
- Answer accuracy (is the answer correct?)
- Citation quality (are the cited sources relevant?)
- Hallucination rate (does the answer contain claims not in the retrieved context?)

This is not just a test — it is the metric that tells you whether your tuning is actually improving the system or just changing it.

**Deliverable**: evaluation framework with 20 golden question/answer pairs. Baseline scores for basic RAG and agentic handler. An honest analysis of the failure modes.

---

### Milestone 5: Uncertainty and "I don't know" (3-5 hours)
The most important thing a knowledge base can do is accurately represent what it doesn't know. A hallucinated confident answer is worse than an honest "I couldn't find enough information to answer this."

Build confidence scoring: when the retrieved chunks are not very similar to the query (low similarity score), the system should indicate low confidence. The agentic handler should say "I couldn't find a reliable answer" rather than generating something plausible-sounding.

**Deliverable**: confidence scoring implemented. A test set of unanswerable questions (questions you know the corpus doesn't contain the answer to). Measure: how often does the system correctly refuse to answer vs. hallucinate?

---

### Milestone 6: Multi-document synthesis (4-6 hours)
Some questions require combining information from multiple documents. "What are all the trade-offs between option X and option Y across these five documents?" Basic RAG can't handle this — the relevant chunks are spread across documents, and no single chunk contains the answer.

The agent should be able to: identify that the question requires multiple sources, search for information from each angle, synthesize the results explicitly (not just concatenate them), and cite multiple sources.

**Deliverable**: multi-document synthesis working for at least 3 complex questions. An evaluation: does the synthesized answer correctly integrate information from all relevant sources?

---

### Milestone 7: Caching and performance (3-5 hours)
Vector search is not free. Common queries should be cached. Design and implement a caching strategy that handles the "same-ish query" problem: "what is an agent?" and "what are agents?" should ideally hit the same cache entry.

Measure the performance impact: what is the p95 latency before and after caching? What is the cache hit rate for a realistic query workload?

**Deliverable**: caching implemented. Performance measurements before/after. ADR for the cache invalidation strategy (when is a cached answer stale?).

---

### Milestone 8: Admin interface and evals over time (3-5 hours)
Build an admin interface for managing the knowledge base. It should support: add a document (triggers ingestion), remove a document (and all its chunks), view all documents in the knowledge base, run the evaluation suite and see the current score.

Track evaluation scores over time. Is the system improving as you tune it, or are changes you make to improve one class of questions hurting another?

**Deliverable**: working admin interface. A graph (even a simple table) of evaluation scores over at least 5 tuning iterations. An honest assessment: where is the system still weak?

---

## Technical guidance

**Chunking strategy matters enormously**. The most common mistake is choosing a chunk size that is either too small (chunks lose context) or too large (chunks retrieve too much irrelevant content). Experiment with chunk sizes of 200, 500, and 1000 tokens on your corpus before committing to one.

**Evaluate before tuning**. You need a baseline before you start changing things. Implement the evaluation framework at milestone 4, but run it after milestone 2 to get the basic RAG baseline. Changes without measurement are guesswork.

**The "I don't know" problem is underestimated**. Most RAG systems are evaluated on their ability to find the right answer when it exists. The ability to say "I don't have reliable information on this" is equally important and much harder to get right.

**Metadata is as important as content**. When you retrieve a chunk, the metadata (what document it came from, what section, when it was last updated) is what makes citations meaningful and what enables filtering (search only in documents from the last 30 days).

## Skills to build while working on this capstone

- `/kb-query <question>` — queries the knowledge base and returns the answer with citations
- `/kb-eval` — runs the evaluation suite and reports current accuracy metrics
- `/kb-ingest <path>` — ingests a document or directory into the knowledge base

## Further depth

- `agentic-workflows/02-single-agent-design/tool-design-principles/`
- `agentic-workflows/05-reliability-and-ops/evals-for-agents/`
- `software-engineering/architecture/06-data/caching-strategies/`
- `software-engineering/advanced-engineering/02-testing-and-verification/`
