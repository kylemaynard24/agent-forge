// State — traffic light with state objects
// Run: node demo.js

// --- State interface ---

class LightState {
  tick(_context) { throw new Error('tick()'); }
  describe()     { throw new Error('describe()'); }
}

// --- Concrete states ---

class GreenLight extends LightState {
  tick(context) {
    console.log('green  → yellow');
    context.setState(new YellowLight());
  }
  describe() { return 'GREEN — go'; }
}

class YellowLight extends LightState {
  tick(context) {
    console.log('yellow → red');
    context.setState(new RedLight());
  }
  describe() { return 'YELLOW — slow'; }
}

class RedLight extends LightState {
  tick(context) {
    console.log('red    → green');
    context.setState(new GreenLight());
  }
  describe() { return 'RED — stop'; }
}

// --- Context ---

class TrafficLight {
  constructor() {
    this.state = new RedLight();
  }

  setState(state) { this.state = state; }

  tick() { this.state.tick(this); }

  currentDescription() { return this.state.describe(); }
}

// --- Demo ---

console.log('=== State demo ===\n');

const light = new TrafficLight();

for (let i = 0; i < 7; i++) {
  console.log(`step ${i + 1}: ${light.currentDescription()}`);
  light.tick();
  console.log();
}

console.log('Key idea: TrafficLight.tick() never branches on state.');
console.log('Each state knows its own behavior and its own transition.');
