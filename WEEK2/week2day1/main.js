const topics = [
  "ES6 features",
  "callbacks & promises",
  "built-in objects",
  "Prototypes",
  "Object-Oriented Programming (OOP)",
  "DOM Manipulation",
  "JS Modules (import/export)",
  "RESTful API design principles",
  "URL design conventions",
  "error handling patterns",
  "HTTP status codes in API design",
];

// ES6 features

const car = {
  name: "Ferrari",
  color: "black",
  distance: 0,
  price: 20000000,
  speed: "350 km/hr",
  start() {
    // Arrow functions
    setInterval(() => {
      this.distance += Number.parseFloat(this.speed) / 60;
      console.log(
        // Lexical this due to arrow functions
        `${this.name} runs with the speed of ${this.speed} and has travelled ${this.distance.toFixed(2)}km till now`,
      );
    }, 60000);
  },
};

car.start();

// Set: Removing duplicates
const rawData = ["Hello", "Hello", "Hi", "World", "world", "world"];
const uniqueData = new Set(rawData);
console.log(uniqueData);

// Weak Map: Garbage collection private state
const privateData = new WeakMap();
class UserSession {
  constructor(token) {
    privateData.set(this, { secretToken: token });
  }
}
