// Classes and OOP — beginner JavaScript demo.
// Run: node demo.js

console.log('topic: Classes and OOP');
console.log('example: modeling a bank account, game character, or shopping cart');
class BankAccount {
  constructor(owner, balance) {
    this.owner = owner;
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
  }
}

const account = new BankAccount('Maya', 50);
account.deposit(25);
console.log(account);
console.log('lesson: Organize behavior and data together when the problem starts to feel object-shaped.');
