// Layered Architecture — controller -> service -> repository.
// Run: node demo.js

// === DATA LAYER ===
// Knows persistence. No HTTP, no rules.
class TodoRepository {
  constructor() { this.store = []; this.next = 1; }
  save(todo) { todo.id = this.next++; this.store.push(todo); return todo; }
  findById(id) { return this.store.find(t => t.id === id); }
  findAll() { return [...this.store]; }
}

// === BUSINESS LAYER ===
// Knows domain rules. Calls down to the repo. Never touches HTTP.
class TodoService {
  constructor(repo) { this.repo = repo; }
  create(text) {
    if (!text || text.trim().length < 3) throw new Error('todo must be >= 3 chars');
    return this.repo.save({ text: text.trim(), done: false });
  }
  complete(id) {
    const todo = this.repo.findById(id);
    if (!todo) throw new Error('not found');
    todo.done = true;
    return todo;
  }
  listOpen() { return this.repo.findAll().filter(t => !t.done); }
}

// === PRESENTATION LAYER ===
// Translates HTTP-ish I/O to/from the service. No SQL, no business rules.
class TodoController {
  constructor(service) { this.service = service; }
  POST_create(body) {
    try { return { status: 201, body: this.service.create(body.text) }; }
    catch (e) { return { status: 400, body: { error: e.message } }; }
  }
  POST_complete(id) {
    try { return { status: 200, body: this.service.complete(Number(id)) }; }
    catch (e) { return { status: 404, body: { error: e.message } }; }
  }
  GET_open() { return { status: 200, body: this.service.listOpen() }; }
}

// === Composition root: the only place that knows all three layers ===
const ctl = new TodoController(new TodoService(new TodoRepository()));

console.log('--- Create two ---');
console.log(ctl.POST_create({ text: 'write the syllabus' }));
console.log(ctl.POST_create({ text: 'commit the dojo' }));

console.log('\n--- Reject invalid ---');
console.log(ctl.POST_create({ text: 'no' }));

console.log('\n--- Complete one ---');
console.log(ctl.POST_complete(1));

console.log('\n--- List open ---');
console.log(ctl.GET_open());

// Dependency direction in source:
//   Controller -> Service -> Repository
// The repo has no clue there's a service. The service has no clue there's a controller.
// This is what makes the service unit-testable without a web server.
