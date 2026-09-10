//Function with number parameters and number return type
function add(a: number, b: number): number {
  return a + b;
}

//Function with string as parameters(second one is optional due to ?) and string return type
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

const multiply = (a: number, b: number): number => a * b;

//Function with number array as parameter  and number return type
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log("FUNCTIONS FILE START");
console.log(
  add(5, 3),
  greet("John"),
  greet("Hi", "Bob"),
  multiply(4, 2),
  sum(1, 2, 3),
);
console.log("FUNCTIONS FILE END");
