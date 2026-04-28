// Monolith — three modules, one process, one store.
// Run: node demo.js

// === ONE shared data store ===
const db = { users: new Map(), posts: [], comments: [] };

// === Module A: users ===
const Users = {
  create(name) {
    const id = `u-${db.users.size + 1}`;
    db.users.set(id, { id, name });
    return id;
  },
  get(id) { return db.users.get(id); }
};

// === Module B: posts ===
// Direct function calls into Users — no network, no serialization.
const Posts = {
  create(authorId, title, body) {
    if (!Users.get(authorId)) throw new Error('unknown author');
    const post = { id: `p-${db.posts.length + 1}`, authorId, title, body };
    db.posts.push(post);
    return post.id;
  },
  list() { return db.posts.map(p => ({ ...p, author: Users.get(p.authorId).name })); }
};

// === Module C: comments ===
const Comments = {
  add(postId, userId, text) {
    if (!db.posts.find(p => p.id === postId)) throw new Error('unknown post');
    if (!Users.get(userId)) throw new Error('unknown user');
    db.comments.push({ id: `c-${db.comments.length + 1}`, postId, userId, text });
  },
  forPost(postId) {
    return db.comments
      .filter(c => c.postId === postId)
      .map(c => ({ ...c, author: Users.get(c.userId).name }));
  }
};

// === Demo ===
const kyle = Users.create('Kyle');
const alex = Users.create('Alex');

const post = Posts.create(kyle, 'Hello dojo', 'first post');
Comments.add(post, alex, 'great post');
Comments.add(post, kyle, 'thanks!');

console.log('Posts:', Posts.list());
console.log('Comments on first post:', Comments.forPost(post));

// Cross-module transaction (atomic in a real DB):
function deletePostAndComments(postId) {
  db.comments = db.comments.filter(c => c.postId !== postId);
  db.posts    = db.posts.filter(p => p.id !== postId);
  // In a microservices world this would be 2 services + a saga + idempotency.
  // Here it's 2 lines.
}

deletePostAndComments(post);
console.log('\nAfter delete:', Posts.list(), Comments.forPost(post));

console.log('\nMonolith strength: cross-module mutation is trivial. No network, no eventual consistency.');
