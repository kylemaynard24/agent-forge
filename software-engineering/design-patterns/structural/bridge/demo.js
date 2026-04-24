// Bridge — Shape abstraction bridged to Renderer implementation
// Run: node demo.js

// --- Implementor hierarchy ---

class Renderer {
  drawCircle(_x, _y, _r) { throw new Error('drawCircle()'); }
  drawSquare(_x, _y, _s) { throw new Error('drawSquare()'); }
}

class VectorRenderer extends Renderer {
  drawCircle(x, y, r) { console.log(`<circle cx="${x}" cy="${y}" r="${r}" />`); }
  drawSquare(x, y, s) { console.log(`<rect x="${x}" y="${y}" width="${s}" height="${s}" />`); }
}

class RasterRenderer extends Renderer {
  drawCircle(x, y, r) {
    const pixels = Math.PI * r * r;
    console.log(`rasterize: ~${pixels.toFixed(0)} pixels for circle at (${x},${y})`);
  }
  drawSquare(x, y, s) {
    console.log(`rasterize: ${s * s} pixels for square at (${x},${y})`);
  }
}

// --- Abstraction hierarchy ---

class Shape {
  constructor(renderer) {
    this.renderer = renderer; // the bridge
  }
  draw() { throw new Error('draw()'); }
}

class Circle extends Shape {
  constructor(renderer, x, y, r) {
    super(renderer);
    this.x = x; this.y = y; this.r = r;
  }
  draw() { this.renderer.drawCircle(this.x, this.y, this.r); }
}

class Square extends Shape {
  constructor(renderer, x, y, side) {
    super(renderer);
    this.x = x; this.y = y; this.side = side;
  }
  draw() { this.renderer.drawSquare(this.x, this.y, this.side); }
}

// --- Demo ---

console.log('=== Bridge demo ===\n');

const vector = new VectorRenderer();
const raster = new RasterRenderer();

const shapes = [
  new Circle(vector, 10, 20, 5),
  new Square(vector, 0, 0, 8),
  new Circle(raster, 10, 20, 5),
  new Square(raster, 0, 0, 8),
];

for (const s of shapes) s.draw();

console.log('\nWithout Bridge, 2 shapes × 2 renderers = 4 classes.');
console.log('With Bridge, 2 shapes + 2 renderers = 4 classes — but adding a new shape');
console.log('adds 1 class (not 2), and adding a new renderer adds 1 class (not 2).');
