"use strict";

let topics = [
  "functionTypes",
  "functionConversion",
  "objectManipulation",
  "arrayManipulation",
  "inventoryAnalyticsEngine",
];

// == Function Types ==

// 1. Function Expression - Not Hoisted unlike normal Function Declaration
const functionExpression = function () {
  console.log("1. Function Expression -- Not Hoisted");
};
functionExpression();

/* 
2. Arrow Functions 
- Set this to surrounding scope when called 
- Implicit single line return
- Optional Parantheses for single parameter
*/
const arrowfunction = () => {
  console.log("2. Arrow Function");
};
arrowfunction();

/*
3. Anonymous Function
- Function without name
- Used commonly for callbacks or inline handlers
*/
setTimeout(function () {
  console.log("3. Anonymous Function");
}, 0);

/*
4. Immedialely Invoked Function Expression(IIFE)
- It runs as soon as it is defined
- Creates private scope to stop polluting global namespace
*/
(() => {
  console.log("4. Immediatly invoked function expression (IIFE)");
})();

(function () {
  console.log("4. Immediatly invoked function expression (IIFE)");
});

// Function conversion

//Regular Function Declaration
function calculateSum(num1, num2) {
  return num1 + num2;
}

//Conversion to Arrow Function
const sum = (num1, num2) => {
  return num1 + num2;
};

//Conversion to IIFE
(function (num1, num2) {
  return num1 + num2;
})(10, 40);

/*
Objects Methods and Properties
- keys(obj): return array
- values(obj): return array
- entries(obj): return array of arrays
- assign({}, target, source): copys properties from source to target
- freeze(obj): Prevents modification or additionof properties to obj   
*/

let product = {
  name: "shoes",
  price: 2000,
  brand: "nike",
};

console.log(Object.keys(product));
console.log(Object.values(product));
console.log(Object.entries(product));

let productSale = {
  unitsSold: 10,
  totalPrice: 20000,
};

let updateProduct = Object.assign({}, product, productSale);

const config = Object.freeze({ apiEndpoint: "https://store.example.com" });
//config.apiEndpoint = "https://product.example.com"; // Fails silently or throw error - Depends on wheather "use strict" or not

/*
Arrays Methods and Properties
- push(value)
- pop()
- map(callback)
- filter(callback)
- reduce (callback)
- length
- find(callback)
*/

let productArray = Object.keys(product);
console.log(productArray.map((item) => item.includes("n")));
console.log(productArray.filter((item) => item.includes("a")));
console.log(productArray.pop());
console.log(productArray.push("brand"));
console.log(productArray.length);
console.log(productArray.find((item) => item.length >= 5));
