// Shared database — two services on the same store; observe the coupling
// Run: node demo.js
// One process; the "DB" is a shared mutable object both services hold a reference to.

// --- The shared "DB" (this is the smell) ---

const db = {
  users: [
    { id: 1, full_name: 'Ada Lovelace', email: 'ada@example.com', signup_date: '2025-01-10' },
    { id: 2, full_name: 'Alan Turing', email: 'alan@example.com', signup_date: '2025-02-05' },
  ],
};

// --- Service A: Profile service ---
// Reads users.full_name and email.
function profileService() {
  return {
    getProfile(id) {
      const u = db.users.find((u) => u.id === id);
      if (!u) throw new Error('not found');
      return { id: u.id, name: u.full_name, email: u.email };
    },
  };
}

// --- Service B: Marketing service ---
// Reads users.full_name and writes users.signup_date.
function marketingService() {
  return {
    welcomeBlast() {
      return db.users.map((u) => `Welcome, ${u.full_name}! You joined on ${u.signup_date}.`);
    },
    backdateSignup(id, date) {
      const u = db.users.find((u) => u.id === id);
      u.signup_date = date;
    },
  };
}

const profile = profileService();
const marketing = marketingService();

// --- Demo ---

console.log('=== Shared Database demo ===\n');

console.log('Both services work fine — for now:');
console.log('  profile.getProfile(1) ->', profile.getProfile(1));
console.log('  marketing.welcomeBlast() ->');
for (const m of marketing.welcomeBlast()) console.log('    ' + m);

// --- Schema change initiated by one team ---
// "Let's rename full_name -> name. It's cleaner."
// They update their service. They forget to coordinate. (This happens.)
console.log('\n--- Schema change: full_name renamed to name ---');
for (const u of db.users) {
  u.name = u.full_name;
  delete u.full_name;
}

// Profile service was updated to use `name`:
const profileV2 = {
  getProfile(id) {
    const u = db.users.find((u) => u.id === id);
    return { id: u.id, name: u.name, email: u.email };
  },
};
console.log('  profileV2.getProfile(1) ->', profileV2.getProfile(1));

// Marketing was NOT updated. It silently breaks.
console.log('  marketing.welcomeBlast() (NOT updated) ->');
for (const m of marketing.welcomeBlast()) console.log('    ' + m);

console.log('\nNotice: "Welcome, undefined!" — implicit coupling, silent failure.');
console.log('In a private-DB world, this rename would have been invisible to marketing.');
