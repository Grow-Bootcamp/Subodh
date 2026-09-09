function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

const multiply = (a: number, b: number): number => a * b;

function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(add(5, 3), greet("John"), greet("Hi", "Bob"), multiply(4, 2), sum(1, 2, 3));
