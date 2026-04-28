// Async messaging — in-memory queue, slow consumer
// Run: node demo.js
// Producer and consumer run in the same process; the queue simulates a broker.

class Queue {
  #items = [];
  #waiters = [];

  enqueue(item) {
    if (this.#waiters.length) {
      const resolve = this.#waiters.shift();
      resolve(item);
    } else {
      this.#items.push(item);
    }
  }

  dequeue() {
    if (this.#items.length) {
      return Promise.resolve(this.#items.shift());
    }
    return new Promise((resolve) => this.#waiters.push(resolve));
  }

  size() {
    return this.#items.length;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ts = () => `+${Date.now() - start}ms`;
const start = Date.now();

const queue = new Queue();

// --- Producer: fast, fire-and-forget ---

async function producer() {
  for (let i = 1; i <= 5; i++) {
    const job = { id: i, payload: `email-${i}` };
    queue.enqueue(job);
    console.log(`${ts()}  producer: enqueued job ${i} (queue size=${queue.size()})`);
    await sleep(2); // tiny gap, basically nothing
  }
  console.log(`${ts()}  producer: DONE — did not wait for any job to finish\n`);
}

// --- Consumer: slow, processes one at a time ---

async function consumer() {
  for (let i = 0; i < 5; i++) {
    const job = await queue.dequeue();
    console.log(`${ts()}  consumer: picked up job ${job.id} (${job.payload})`);
    await sleep(200); // simulate slow work
    console.log(`${ts()}  consumer: finished job ${job.id}`);
  }
  console.log(`${ts()}  consumer: DONE`);
}

// --- Demo ---

console.log('=== Async messaging demo ===\n');
console.log('Producer enqueues 5 jobs. Consumer takes 200ms per job.');
console.log('Watch: producer finishes long before consumer.\n');

(async () => {
  // Kick consumer off in the background.
  const consumerDone = consumer();
  await producer();
  await consumerDone;
  console.log(`\nTotal elapsed: ${Date.now() - start}ms`);
  console.log('Producer was decoupled from consumer throughput. That is the point.');
})();
