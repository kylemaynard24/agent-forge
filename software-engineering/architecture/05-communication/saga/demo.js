// Saga — multi-step booking with compensating actions on failure
// Run: node demo.js
// Services are simulated as plain functions in one process.

// --- Service stubs (each holds its own "DB") ---

const flights = new Map();
const hotels = new Map();
const cars = new Map();

const flightService = {
  reserve: (tripId) => {
    const ref = `FLT-${tripId}`;
    flights.set(ref, { tripId, status: 'reserved' });
    console.log(`  flight: reserved ${ref}`);
    return ref;
  },
  cancel: (ref) => {
    flights.get(ref).status = 'cancelled';
    console.log(`  flight: CANCELLED ${ref}`);
  },
};

const hotelService = {
  reserve: (tripId) => {
    const ref = `HTL-${tripId}`;
    hotels.set(ref, { tripId, status: 'reserved' });
    console.log(`  hotel:  reserved ${ref}`);
    return ref;
  },
  cancel: (ref) => {
    hotels.get(ref).status = 'cancelled';
    console.log(`  hotel:  CANCELLED ${ref}`);
  },
};

const carService = {
  reserve: (tripId, { forceFail = false } = {}) => {
    if (forceFail) throw new Error('no cars available');
    const ref = `CAR-${tripId}`;
    cars.set(ref, { tripId, status: 'reserved' });
    console.log(`  car:    reserved ${ref}`);
    return ref;
  },
  cancel: (ref) => {
    cars.get(ref).status = 'cancelled';
    console.log(`  car:    CANCELLED ${ref}`);
  },
};

// --- Saga orchestrator ---

async function bookTrip(tripId, opts = {}) {
  const compensations = []; // LIFO stack of undo actions
  try {
    const flightRef = flightService.reserve(tripId);
    compensations.unshift(() => flightService.cancel(flightRef));

    const hotelRef = hotelService.reserve(tripId);
    compensations.unshift(() => hotelService.cancel(hotelRef));

    const carRef = carService.reserve(tripId, opts);
    compensations.unshift(() => carService.cancel(carRef));

    return { ok: true, tripId, flightRef, hotelRef, carRef };
  } catch (err) {
    console.log(`  ! step failed: ${err.message}. Running compensations...`);
    for (const undo of compensations) {
      try {
        undo();
      } catch (compErr) {
        // In real life, log to a remediation queue. Compensations must eventually succeed.
        console.log(`  !! compensation failed: ${compErr.message}`);
      }
    }
    return { ok: false, tripId, reason: err.message };
  }
}

// --- Demo ---

(async () => {
  console.log('=== Saga demo ===\n');

  console.log('Trip 1 — happy path:');
  const r1 = await bookTrip('T1');
  console.log('  result:', r1);

  console.log('\nTrip 2 — car step fails, must compensate hotel and flight:');
  const r2 = await bookTrip('T2', { forceFail: true });
  console.log('  result:', r2);

  console.log('\nFinal state of each service:');
  console.log('  flights:', [...flights.values()]);
  console.log('  hotels: ', [...hotels.values()]);
  console.log('  cars:   ', [...cars.values()]);
  console.log('\nT2 left no dangling reservations. Compensations made it whole.');
})();
