interface User {
  name: string;
  age: number;
  email?: string; // optional due to ?
}

interface Employee extends User {
  employeeId: number;
}

const user: User = { name: "John", age: 25 };
const userWithEmail: User = {
  name: "Subodh",
  age: 21,
  email: "example@email.com",
};
const emp: Employee = { name: "Jane", age: 30, employeeId: 123 };

console.log("INTERFACES FILE START");
console.log(user, userWithEmail, emp);
console.log("INTERFACES FILE END");
