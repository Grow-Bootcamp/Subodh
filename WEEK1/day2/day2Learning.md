# Day 2 Learning Log — JavaScript Advanced Concepts

**Date:** September 2, 2026 (Day 2)  
**Intern:** Subodh Shah

---

## JavaScript — Event Loop

Execution order: Call Stack → MicroTask Queue → MacroTask Queue

```js
console.log('1. Start');
setTimeout(() => console.log('2. MacroTask'), 2000)
Promise.resolve().then(() => console.log('3. MicroTask'))
console.log('5. End')

// Output: 1. Start → 5. End → 3. MicroTask → 2. MacroTask
```

| Queue       | Handler                  | Priority |
|-------------|--------------------------|----------|
| Call Stack  | Synchronous code         | First    |
| MicroTask   | Promises                 | Second   |
| MacroTask   | setTimeout, setInterval  | Third    |

**Key takeaway:** MicroTasks (Promises) always resolve before MacroTasks (setTimeout).

---

## JavaScript — Hoisting

| Declaration         | Before Init     | Scope    |
|---------------------|-----------------|----------|
| Function Declaration| Works           | Function |
| `var`               | `undefined`     | Function |
| `let`               | `ReferenceError`| Block    |
| `const`             | `ReferenceError`| Block    |

**Key takeaway:** `let`/`const` throw errors if accessed before initialization due to the Temporal Dead Zone.

---

## JavaScript — Core Data Type Methods

### Array

```js
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
arr.map(n => n * 10)       // [10, 20, 30, 40, 50, 60, 70, 80, 90]
arr.filter(n => n < 5)     // [1, 2, 3, 4]
arr.reduce((a, c) => a * c, 1)  // 362880
arr.find(n => n > 5)       // 6
arr.slice(2, 5)            // [3, 4, 5]
arr.splice(2, 2)           // removed: [3, 4], mutates orifunctionsginal
```

| Method   | Mutates? | Returns          |
|----------|----------|------------------|
| `map`    | No       | New array        |
| `filter` | No       | New array        |
| `reduce` | No       | Single value     |
| `find`   | No       | Element          |
| `slice`  | No       | New array        |
| `splice` | Yes      | Removed elements |

### Object

```js
let obj = { fname: 'Subodh', age: 21 }
Object.keys(obj)     // ['fname', 'age']
Object.values(obj)   // ['Subodh', 21]
Object.entries(obj)  // [['fname', 'Subodh'], ['age', 21]]
```

| Method            | Returns       |
|-------------------|---------------|
| `Object.keys()`   | Array of keys |
| `Object.values()` | Array of values |
| `Object.entries()`| Array of pairs |

### String

```js
let str = '  Subodh  '
str.includes('Subodh')  // true
str.trim()              // 'Subodh'
str.toLowerCase()       // '  subodh  '
str.split(' ')          // ['', '', 'Subodh', '', '']
```

| Method          | Returns |
|-----------------|---------|
| `includes()`    | Boolean |
| `trim()`        | String  |
| `toLowerCase()` | String  |
| `split()`       | Array   |

### Number

```js
let num = 99.99
num.toFixed(1)    // "100.0"
Math.floor(num)   // 99
Math.round(num)   // 100
Math.random()     // 0 - 1
```

| Method          | Returns |
|-----------------|---------|
| `toFixed()`     | String  |
| `Math.floor()`  | Integer |
| `Math.round()`  | Integer |
| `Math.random()` | Float   |

---

## JavaScript — Timers

```js
setTimeout(() => console.log('runs once'), 1000)

let id = setInterval(() => {
    console.log('repeats')
    clearInterval(id)  // always clear when done
}, 1000)
```

| Function         | Purpose                  |
|------------------|--------------------------|
| `setTimeout()`   | Execute once after delay |
| `setInterval()`  | Execute repeatedly       |
| `clearInterval()`| Stop interval            |

**Key takeaway:** Always `clearInterval` to prevent memory leaks.

---

## JavaScript — Promises & Async/Await

```js
// Promise chain
fetchData(500, 'Task 1')
    .then(res => fetchData(800, 'Task 2'))
    .then(res => console.log(res))
    .catch(err => console.error(err))

// Async/Await — cleaner syntax
const run = async () => {
    let r1 = await fetchData(1000, 'Task 1')
    let r2 = await fetchData(1200, 'Task 2')
}
```

| Approach         | Syntax            |
|------------------|-------------------|
| Promise chaining | `.then().catch()` |
| Async/Await      | `await` in async  |

**Key takeaway:** `async/await` is syntactic sugar over Promises — makes async code read like sync code.

---

## JavaScript — Async Task Queue

```js
const runQueue = async () => {
    let results = []
    for (const task of tasks) {
        let result = await executeTask(task)
        results.push(result)
    }
    console.log('Results:', results)
}
```

**Key takeaway:** `for...of` with `await` executes promises sequentially.

---

## Key Takeaways

1. MicroTasks resolve before MacroTasks
2. `let`/`const` throw `ReferenceError` before init; `var` returns `undefined`
3. `.splice()` mutates; `.slice()` does not
4. `async/await` makes async code readable
5. `for...of` with `await` = sequential execution
