// Flyweight — glyph sharing for a text document
// Run: node demo.js

// --- Flyweight: intrinsic state only (shared across uses) ---

class Glyph {
  constructor(char, font, size) {
    this.char = char;
    this.font = font;
    this.size = size;
    Object.freeze(this); // flyweights must be immutable
  }
  render(x, y) {
    return `${this.char} @ (${x},${y}) [${this.font}/${this.size}pt]`;
  }
}

// --- Flyweight factory: ensures sharing ---

class GlyphFactory {
  constructor() {
    this._cache = new Map();
    this._requests = 0;
    this._misses = 0;
  }
  get(char, font, size) {
    this._requests++;
    const key = `${char}|${font}|${size}`;
    if (!this._cache.has(key)) {
      this._cache.set(key, new Glyph(char, font, size));
      this._misses++;
    }
    return this._cache.get(key);
  }
  stats() {
    return { requests: this._requests, unique: this._misses, cached: this._cache.size };
  }
}

// --- Client: holds extrinsic state (position) per character ---

class TextDocument {
  constructor(factory) {
    this.factory = factory;
    this.chars = []; // each entry: { glyph, x, y }
  }

  addString(text, font, size, startX = 0, y = 0) {
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const glyph = this.factory.get(char, font, size); // shared
      this.chars.push({ glyph, x: startX + i * 8, y });
    }
  }

  preview(n = 5) {
    return this.chars.slice(0, n).map(c => c.glyph.render(c.x, c.y));
  }
}

// --- Demo ---

console.log('=== Flyweight demo ===\n');

const factory = new GlyphFactory();
const doc = new TextDocument(factory);

doc.addString('The quick brown fox jumps over the lazy dog.', 'Arial', 12, 0, 0);
doc.addString('Hello, world! Hello again.',              'Arial', 12, 0, 20);
doc.addString('HEADING',                                 'Arial', 24, 0, 40);

const stats = factory.stats();
console.log(`Characters in document: ${doc.chars.length}`);
console.log(`Glyph requests:         ${stats.requests}`);
console.log(`Unique glyphs created:  ${stats.unique}`);
console.log(`Cache size:             ${stats.cached}`);
console.log(`Sharing ratio:          ${(stats.requests / stats.cached).toFixed(2)}× reuse`);

console.log('\nFirst few characters in the doc:');
for (const line of doc.preview(5)) console.log('  ' + line);

console.log('\nKey idea: every repeated (char, font, size) refers to the SAME');
console.log('Glyph object. Only position (extrinsic) varies per use.');
