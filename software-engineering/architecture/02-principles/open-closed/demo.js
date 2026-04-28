// Open/Closed — extend without modifying.
// Run: node demo.js

// === BEFORE: every new shape edits the calculator ===

function areaBranchy(shape) {
  if (shape.type === 'circle')    return Math.PI * shape.radius ** 2;
  if (shape.type === 'rectangle') return shape.w * shape.h;
  // Adding 'triangle' here means editing this function. Bug risk to other shapes.
  throw new Error('unknown shape');
}

console.log('Branchy circle:', areaBranchy({ type: 'circle', radius: 1 }).toFixed(3));

// === AFTER: shapes are open for extension; calculator is closed ===

class Shape {
  area() { throw new Error('abstract — subclasses implement'); }
}

class Circle extends Shape {
  constructor(r) { super(); this.r = r; }
  area() { return Math.PI * this.r ** 2; }
}

class Rectangle extends Shape {
  constructor(w, h) { super(); this.w = w; this.h = h; }
  area() { return this.w * this.h; }
}

// New variant — added without editing anything else.
class Triangle extends Shape {
  constructor(b, h) { super(); this.b = b; this.h = h; }
  area() { return 0.5 * this.b * this.h; }
}

function totalArea(shapes) {
  return shapes.reduce((s, x) => s + x.area(), 0);
}

// === Demo ===

const shapes = [new Circle(1), new Rectangle(2, 3), new Triangle(4, 5)];
console.log('Total area:', totalArea(shapes).toFixed(3));

// Adding a Hexagon: just write a class. No edits to totalArea, Circle, Rectangle, or Triangle.
class Hexagon extends Shape {
  constructor(side) { super(); this.s = side; }
  area() { return (3 * Math.sqrt(3) / 2) * this.s ** 2; }
}

console.log('With hexagon:', totalArea([...shapes, new Hexagon(2)]).toFixed(3));
console.log('\nNotice: totalArea did not change. Closed for modification, open for extension.');
