let userName: string = "John";
let age: number = 25;
let isActive: boolean = true;

let numbers: number[] = [1, 2, 3];
let person: [string, number] = ["John", 25];

enum Status { Active, Inactive }
let userStatus: Status = Status.Active;

let id: string | number = "abc";

type Point = { x: number; y: number };
let coord: Point = { x: 10, y: 20 };

console.log(userName, age, isActive, numbers, person, userStatus, id, coord);
