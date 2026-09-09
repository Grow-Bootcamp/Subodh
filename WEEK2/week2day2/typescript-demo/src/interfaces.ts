interface User {
  name: string;
  age: number;
  email?: string;
}

interface Employee extends User {
  employeeId: number;
}

const user: User = { name: "John", age: 25 };
const emp: Employee = { name: "Jane", age: 30, employeeId: 123 };

console.log(user, emp);
