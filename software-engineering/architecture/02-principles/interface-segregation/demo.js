// Interface Segregation — many small interfaces beat one fat one.
// Run: node demo.js

// === BEFORE: a fat interface ===
// Every "worker" must implement work() AND eat(). Fine for humans, dishonest for robots.

class FatWorker {
  work() { throw new Error('abstract'); }
  eat()  { throw new Error('abstract'); }
}

class HumanWorker extends FatWorker {
  work() { console.log('[human] coding'); }
  eat()  { console.log('[human] eating lunch'); }
}

class RobotWorker extends FatWorker {
  work() { console.log('[robot] welding'); }
  eat()  { throw new Error('robots do not eat'); }   // <-- LSP violation!
}

// Callers can't tell whether eat() will throw, so they need instanceof checks.
function dailyRoutine(w) {
  w.work();
  // Is it safe to call w.eat()? Depends on the runtime type. ISP smell.
}

// === AFTER: small, focused interfaces (in JS, by convention/duck typing) ===

// Workable: any object with `work()`
// Eatable:  any object with `eat()`

class Human {
  work() { console.log('[human] coding'); }
  eat()  { console.log('[human] eating lunch'); }
}

class Robot {
  work() { console.log('[robot] welding'); }
  // No eat() — and no need to lie about it.
}

// The lunch coordinator only cares about Eatables.
function lunchTime(eatables) {
  for (const e of eatables) e.eat();
}

// The work coordinator only cares about Workables.
function workTime(workables) {
  for (const w of workables) w.work();
}

// === Demo ===

const human = new Human();
const robot = new Robot();

console.log('--- Workers (human + robot) ---');
workTime([human, robot]);

console.log('\n--- Lunchers (humans only — robot is just not eligible) ---');
lunchTime([human]);

console.log('\nNotice: nobody throws "not supported." The robot simply isn\'t Eatable.');
