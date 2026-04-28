// Liskov Substitution — subclasses must honor the parent's contract.
// Run: node demo.js

// === BEFORE: a "natural" hierarchy that violates LSP ===

class Rectangle {
  constructor(w, h) { this._w = w; this._h = h; }
  setWidth(w)  { this._w = w; }
  setHeight(h) { this._h = h; }
  width()  { return this._w; }
  height() { return this._h; }
  area()   { return this._w * this._h; }
}

class Square extends Rectangle {
  constructor(s) { super(s, s); }
  // To preserve the "all sides equal" invariant, Square must override BOTH setters
  // — which silently breaks Rectangle's contract.
  setWidth(w)  { this._w = w; this._h = w; }
  setHeight(h) { this._w = h; this._h = h; }
}

function increaseWidth(rect) {
  // A caller using the Rectangle contract assumes:
  // "set the width and the height stays the same."
  const oldH = rect.height();
  rect.setWidth(rect.width() + 1);
  if (rect.height() !== oldH) {
    return `LSP violation: height changed from ${oldH} to ${rect.height()}`;
  }
  return `ok: area is now ${rect.area()}`;
}

console.log('Rectangle 3x5 ->', increaseWidth(new Rectangle(3, 5)));
console.log('Square    5  ->', increaseWidth(new Square(5)));
console.log('A Square is NOT a Rectangle in the contract sense.\n');

// === AFTER: drop the inheritance; both implement Shape ===

class Shape {
  area() { throw new Error('abstract'); }
}

class Rect extends Shape {
  constructor(w, h) { super(); this.w = w; this.h = h; }
  area() { return this.w * this.h; }
}

class Sq extends Shape {
  constructor(s) { super(); this.s = s; }
  area() { return this.s ** 2; }
}

// Callers depend on `Shape.area()`. There is no `setWidth` to violate.
function totalArea(shapes) { return shapes.reduce((s, x) => s + x.area(), 0); }

console.log('Total area, mixed:', totalArea([new Rect(3, 5), new Sq(4)]));
console.log('No LSP violation possible — Sq does not pretend to be a Rect.');
