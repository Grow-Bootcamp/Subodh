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

// Asynchronous Programming – Handling Waiting

// Callback
function cFetchData(callback) {
  setTimeout(() => {
    const data = { name: "Subodh", aga: 21 };
    callback(data);
  }, 2000);
}

cFetchData((data) => {
  console.log(`Success: `, data);
});

// Promise
function pFetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let success = Math.random() > 0.2; //this is the part where we do asynchronous operations instead of settimeout
      if (success) resolve("Data received successfully");
      else reject("Failed to receive the data");
    }, 1000);
  });
}

pFetchData()
  .then((res) => {
    console.log("Success: " + res);
  })
  .catch((error) => {
    console.error("Error: " + error);
  });

// Async await
function aFetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let success = Math.random() > 0.2;
      if (success) resolve("Data received successfully");
      else reject("Failed to retrieve the data");
    }, 2000);
  });
}

async function getUserData() {
  try {
    let data = await aFetchData(); // Perfoem some asynchronous operations
    if (data) console.log("Success: " + data);
  } catch (err) {
    console.error("Error: " + err.message);
  }
}

getUserData();

// Prototype and OOP

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Student(name, age, faculty, semester, subjects) {
  this.name = name;
  this.age = age;
  this.faculty = faculty;
  this.semester = semester;
  this.subjects = subjects;
}

Student.prototype.getDetails = function () {
  console.log(
    `${capitalize(this.name)} is studying ${this.faculty} and is currently at ${this.semester}'th semester. It's core subjects are:\n- ${this.subjects.join(",\n- ")}`,
  );
};

let subjectsFor7thSem = [
  "ECommerce",
  "Advance Java",
  "OOAD",
  "Database Administration",
  "Data Warehouse and Mining",
];

let student1 = new Student("subodh", 21, "B.Sc.CSIT", 7, subjectsFor7thSem);
student1.getDetails();

// ES6 class : Syntatic sugar over prototypes
class cStudent {
  constructor(name, age, faculty, semester, subjects) {
    this.name = name;
    this.age = age;
    this.faculty = faculty;
    this.semester = semester;
    this.subjects = subjects;
  }

  getDetails() {
    console.log(
      `${capitalize(this.name)} is studying ${this.faculty} and is currently at ${this.semester}'th semester. It's core subjects are:\n- ${this.subjects.join(",\n- ")}`,
    );
  }
}

let student2 = new cStudent("samit", 21, "B.Sc.CSIT", 7, subjectsFor7thSem);
student2.getDetails();

// RestFul URL Structure for a sample resource(users, products) following REST conventions
