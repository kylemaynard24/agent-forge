// Decorator — coffee with stackable add-ons
// Run: node demo.js

// --- Component interface ---

class Beverage {
  cost() { throw new Error('cost()'); }
  description() { throw new Error('description()'); }
}

// --- Concrete components ---

class Espresso extends Beverage {
  cost() { return 2.00; }
  description() { return 'Espresso'; }
}

class HouseBlend extends Beverage {
  cost() { return 1.50; }
  description() { return 'House Blend'; }
}

// --- Base decorator ---

class BeverageDecorator extends Beverage {
  constructor(beverage) {
    super();
    this.beverage = beverage;
  }
}

// --- Concrete decorators ---

class Milk extends BeverageDecorator {
  cost() { return this.beverage.cost() + 0.30; }
  description() { return `${this.beverage.description()}, milk`; }
}

class Sugar extends BeverageDecorator {
  cost() { return this.beverage.cost() + 0.10; }
  description() { return `${this.beverage.description()}, sugar`; }
}

class WhippedCream extends BeverageDecorator {
  cost() { return this.beverage.cost() + 0.50; }
  description() { return `${this.beverage.description()}, whipped cream`; }
}

// --- Demo ---

console.log('=== Decorator demo ===\n');

const format = (b) => `$${b.cost().toFixed(2)}  —  ${b.description()}`;

// Plain espresso
let drink = new Espresso();
console.log(format(drink));

// Espresso + milk
drink = new Milk(new Espresso());
console.log(format(drink));

// House blend + milk + double sugar + whipped cream
drink = new WhippedCream(new Sugar(new Sugar(new Milk(new HouseBlend()))));
console.log(format(drink));

// Same as above built step-by-step for clarity
let layered = new HouseBlend();
layered = new Milk(layered);
layered = new Sugar(layered);
layered = new Sugar(layered);
layered = new WhippedCream(layered);
console.log(format(layered));

console.log('\nKey idea: each decorator adds its increment without modifying');
console.log('the wrapped object, and decorators stack in any order.');
