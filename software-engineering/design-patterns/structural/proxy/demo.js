// Proxy — virtual (lazy-loading) proxy for images
// Run: node demo.js

// --- Subject interface ---

class Image {
  display() { throw new Error('display()'); }
}

// --- Real subject: expensive to construct ---

class RealImage extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this._load();
  }
  _load() {
    // Simulate expensive work
    console.log(`[disk] loading ${this.filename}  (expensive)`);
  }
  display() {
    console.log(`[display] ${this.filename}`);
  }
}

// --- Proxy: defers construction of the real subject ---

class ProxyImage extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this._real = null;
  }
  display() {
    if (!this._real) {
      this._real = new RealImage(this.filename); // lazy
    }
    this._real.display();
  }
}

// --- Demo ---

console.log('=== Proxy demo ===\n');

console.log('Building gallery of 5 proxies...');
const gallery = [
  new ProxyImage('photo-1.jpg'),
  new ProxyImage('photo-2.jpg'),
  new ProxyImage('photo-3.jpg'),
  new ProxyImage('photo-4.jpg'),
  new ProxyImage('photo-5.jpg'),
];
console.log('(no disk activity yet — no RealImage has been created)\n');

console.log('User clicks photo 2:');
gallery[1].display();  // loads, then displays
gallery[1].display();  // already loaded, no more disk

console.log('\nUser clicks photo 5:');
gallery[4].display();

console.log('\nPhotos 1, 3, 4 were never viewed — never loaded.');
console.log('\nKey idea: proxy has the same interface as the real subject.');
console.log('The client never knew it was talking to a proxy.');
