// Modular Monolith — explicit public APIs; internals stay internal.
// Run: node demo.js

// We simulate module boundaries by attaching `_internal` markers to fields/functions
// and a guard that rejects access. Real codebases use eslint or package boundaries.

// === Module: users ===
const usersInternal = {
  byId: new Map(),
  validateName(n) { if (!n || n.length < 2) throw new Error('name too short'); }
};
const Users = {
  // Public API only:
  create(name) {
    usersInternal.validateName(name);
    const id = `u-${usersInternal.byId.size + 1}`;
    usersInternal.byId.set(id, { id, name });
    return id;
  },
  get(id) { return usersInternal.byId.get(id); }
};

// === Module: posts ===
const postsInternal = { list: [] };
const Posts = {
  create(authorId, title) {
    if (!Users.get(authorId)) throw new Error('unknown author');
    const post = { id: `p-${postsInternal.list.length + 1}`, authorId, title };
    postsInternal.list.push(post);
    return post.id;
  },
  list() { return [...postsInternal.list]; }
};

// === Module: comments — uses Posts and Users via PUBLIC API only ===
const commentsInternal = { list: [] };
const Comments = {
  add(postId, userId, text) {
    if (!Posts.list().some(p => p.id === postId)) throw new Error('unknown post');
    if (!Users.get(userId)) throw new Error('unknown user');
    commentsInternal.list.push({ postId, userId, text });
  },
  forPost(postId) { return commentsInternal.list.filter(c => c.postId === postId); }
};

// === Demo: well-behaved ===
const kyle = Users.create('Kyle');
const post = Posts.create(kyle, 'hello');
Comments.add(post, kyle, 'first');
console.log('Posts:', Posts.list());
console.log('Comments:', Comments.forPost(post));

// === Module: admin (the bad citizen) ===
// Imagine a careless dev did this:
//   import { usersInternal } from '../users/internal/state'   <-- forbidden
// Lint rule would block it. We simulate with a runtime guard:

function importGuard(targetName) {
  console.log(`\n[guard] DENY: import from internal '${targetName}'`);
  console.log('       In a real codebase, eslint no-restricted-imports / package boundaries blocks this at build time.');
}
importGuard('users/internal/state');

// What WAS allowed? The public API.
const userFromPublicApi = Users.get(kyle);
console.log('\n[guard] ALLOW: Users.get(id) returns', userFromPublicApi);

console.log('\nThe boundary is the seam. If we ever extract Users into its own service,');
console.log('only the public API needs to keep working — internals can churn freely.');
