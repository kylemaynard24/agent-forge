// Iterator — binary search tree with multiple traversal orders
// Run: node demo.js

class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() { this.root = null; }

  insert(value) {
    const node = new BSTNode(value);
    if (!this.root) { this.root = node; return; }
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left)  { current.left  = node; return; }
        current = current.left;
      } else {
        if (!current.right) { current.right = node; return; }
        current = current.right;
      }
    }
  }

  // Default iterator is in-order (sorted for a BST)
  [Symbol.iterator]() { return this.inOrder(); }

  *inOrder(node = this.root) {
    if (!node) return;
    yield* this.inOrder(node.left);
    yield node.value;
    yield* this.inOrder(node.right);
  }

  *preOrder(node = this.root) {
    if (!node) return;
    yield node.value;
    yield* this.preOrder(node.left);
    yield* this.preOrder(node.right);
  }

  *postOrder(node = this.root) {
    if (!node) return;
    yield* this.postOrder(node.left);
    yield* this.postOrder(node.right);
    yield node.value;
  }
}

// --- Demo ---

console.log('=== Iterator demo ===\n');

const tree = new BinarySearchTree();
[5, 3, 8, 1, 4, 7, 9].forEach(v => tree.insert(v));

console.log('In-order   (default):', [...tree].join(' '));
console.log('Pre-order:          ', [...tree.preOrder()].join(' '));
console.log('Post-order:         ', [...tree.postOrder()].join(' '));

console.log('\nFirst three sorted values:');
let count = 0;
for (const v of tree) {
  console.log(`  ${v}`);
  if (++count === 3) break;
}

console.log('\nKey idea: the client never saw a BSTNode. The tree exposed');
console.log('ordered iteration via Symbol.iterator and extra orders via generators.');
