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

| Method             | Purpose                                              |
|--------------------|------------------------------------------------------|
| `Object.keys()`    | Returns array of keys                                |
| `Object.values()`  | Returns array of values                              |
| `Object.entries()` | Returns array of `[key, value]` pairs                |
| `Object.assign()`  | Copies properties from source to target              |
| `Object.freeze()`  | Prevents modification or addition of properties      |

**Note on `Object.freeze()`:** Freezing is shallow — nested objects can still be mutated. In strict mode (`"use strict"`), attempting to modify a frozen property throws a `TypeError`. In non-strict mode, the assignment fails silently. For currency values, use `.toFixed(2)` to format floats consistently.

---

## Array Methods & Properties

| Type       | Name       | Purpose                                         |
|------------|------------|-------------------------------------------------|
| Method     | `push()`   | Adds element to end of array                    |
| Method     | `pop()`    | Removes last element from array                 |
| Method     | `map()`    | Transforms each element, returns new array      |
| Method     | `filter()` | Keeps elements matching condition               |
| Method     | `reduce()` | Accumulates array into single value             |
| Method     | `find()`   | Returns first element matching condition        |
| Property   | `.length`  | Returns array size (read-only, not a method)    |

---

## Factory Function vs IIFE

The `inventoryAnalyticsEngine` is a **Factory Function**, not an IIFE. Understanding the distinction:

| Pattern          | Syntax                          | Invocation              | Use Case                          |
|------------------|---------------------------------|-------------------------|-----------------------------------|
| Factory Function | `const fn = () => { return {} }` | Called explicitly: `fn()` | Create reusable object instances   |
| IIFE             | `(() => { return {} })()`        | Runs immediately        | Private scope, initialization code |

The factory is assigned to a variable and called explicitly (`inventoryAnalyticsEngine()`), returning an object of methods. An IIFE would execute at the point of definition with no variable assignment.

---

## Inventory Analytics Engine

Built a reusable engine using a factory function pattern with closures and higher-order functions:

| Function                        | Methods Used                                          | Purpose                             |
|---------------------------------|-------------------------------------------------------|-------------------------------------|
| `calculateGrossRevenue()`       | `filter()`, `reduce()`                                | Total revenue from completed orders |
| `lowStockAlert()`               | `Object.values()`, `filter()`, `map()`                | Items with stock less than 5        |
| `totalAssetValuation()`         | `Object.values()`, `reduce()`                         | Total inventory value in currency   |
| `categorySummary()`             | `Object.values()`, `reduce()`                         | Stock count grouped by category     |
| `promotionalCatalogGenerator()` | `Object.values()`, `map()`, spread `{}`               | Catalog with 10% discount applied   |
| `csvFormatter()`                | `Object.keys()`, `Object.values()`, `map()`, `join()` | Convert inventory to CSV            |

**Key fixes applied to source code:**

1. **`calculateGrossRevenue`** — Reduced accumulator now starts at `0` (not the closure variable), preventing state accumulation across repeated calls.
2. **`totalAssetValuation`** — Same fix: uses local variable with `0` as initial accumulator.
3. **`csvFormatter`** — Added empty inventory guard clause to prevent `TypeError` when `Object.values(inventory)[0]` is `undefined`.

```javascript
const calculateGrossRevenue = (orders) => {
    const completedOrders = orders.filter((o) => o.status === "completed");
    return completedOrders.reduce((acc, order) => {
        order.items.forEach((item) => { acc += item.quantity * item.unitPrice; });
        return acc;
    }, 0);
};

const totalAssetValuation = (inventory) => {
    return Object.values(inventory).reduce((acc, item) => {
        return acc + (item.price * item.stock);
    }, 0);
};

const csvFormatter = (inventory) => {
    const entries = Object.values(inventory);
    if (entries.length === 0) return "";
    const csvKeys = Object.keys(entries[0]).join(",");
    const csvValues = entries.map((item) => Object.values(item).join(",")).join("\n");
    return `${csvKeys}\n${csvValues}`;
};
```

---

## Key Takeaways

1. Arrow functions inherit `this` from surrounding scope — ideal for callbacks, unsuitable for object methods
2. IIFEs create private scope, preventing global namespace pollution
3. Factory functions return object instances; IIFEs execute immediately at definition
4. `Object.freeze()` is shallow — nested objects can still be mutated
5. In strict mode, modifying a frozen property throws `TypeError`; non-strict fails silently
6. `reduce()` is the most versatile array method — can replace `filter` + `map` patterns
7. Always use `0` as initial accumulator in `reduce()` to avoid state mutation bugs
8. Guard against empty data before accessing `[0]` — `Object.values({})[0]` is `undefined`
9. Closures let inner functions retain access to outer function variables
10. `Object.values()` + `reduce()` is a powerful combo for aggregation tasks
11. Template literals and spread operator make object/array manipulation cleaner
