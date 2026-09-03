# Day 3 Learning Log — JavaScript Functions, Objects & Arrays

**Date:** September 3, 2026
**Intern:** Subodh Shah

---

## Function Types

| Type                | Feature                         | Syntax                     |
|---------------------|---------------------------------|----------------------------|
| Function Expression | Not hoisted, assigned to var    | `const fn = function() {}` |
| Arrow Function      | Concise syntax, lexical `this`  | `const fn = () => {}`      |
| Anonymous Function  | No name, used as callback       | `function() {}`            |
| IIFE                | Runs immediately, private scope | `(() => {})()`             |

---

## Function Conversion

Same function written in three different forms:

| From                                   | To Arrow                                   | To IIFE                                       |
|----------------------------------------|--------------------------------------------|-----------------------------------------------|
| `function add(a, b) { return a + b; }` | `const add = (a, b) => { return a + b; };` | `(function(a, b) { return a + b; })(10, 40);` |

---

## Object Methods

| Method             | Purpose                                         |
|--------------------|-------------------------------------------------|
| `Object.keys()`    | Returns array of keys                           |
| `Object.values()`  | Returns array of values                         |
| `Object.entries()` | Returns array of `[key, value]` pairs           |
| `Object.assign()`  | Copies properties from source to target         |
| `Object.freeze()`  | Prevents modification or addition of properties |

---

## Array Methods

| Method     | Purpose                                    |
|------------|--------------------------------------------|
| `push()`   | Adds element to end of array               |
| `pop()`    | Removes last element from array            |
| `map()`    | Transforms each element, returns new array |
| `filter()` | Keeps elements matching condition          |
| `reduce()` | Accumulates array into single value        |
| `find()`   | Returns first element matching condition   |
| `.length`  | Property that returns array size           |

---

## Inventory Analytics Engine

Built a reusable engine using closures and higher-order functions:

| Function                        | Methods Used                                          | Purpose                             |
|---------------------------------|-------------------------------------------------------|-------------------------------------|
| `calculateGrossRevenue()`       | `filter()`, `reduce()`                                | Total revenue from completed orders |
| `lowStockAlert()`               | `Object.values()`, `filter()`, `map()`                | Items with stock less than 5        |
| `totalAssetValuation()`         | `Object.values()`, `reduce()`                         | Total inventory value in currency   |
| `categorySummary()`             | `Object.values()`, `reduce()`                         | Stock count grouped by category     |
| `promotionalCatalogGenerator()` | `Object.values()`, `map()`, spread `{}`               | Catalog with 10% discount applied   |
| `csvFormatter()`                | `Object.keys()`, `Object.values()`, `map()`, `join()` | Convert inventory to CSV            |

---

## Key Takeaways

1. Arrow functions inherit `this` from surrounding scope — ideal for callbacks
2. IIFEs create private scope, preventing global namespace pollution
3. `Object.freeze()` is shallow — nested objects can still be mutated
4. `reduce()` is the most versatile array method — can replace `filter` + `map` patterns
5. Closures let inner functions retain access to outer function variables
6. `Object.values()` + `reduce()` is a powerful combo for aggregation tasks
7. Template literals and spread operator make object/array manipulation cleaner
