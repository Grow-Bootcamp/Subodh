# Day 4 Learning Log — JS Advanced Concepts

**Date:** September 4, 2026
**Intern:** Subodh Shah

---

## Errors & Debugging

`try/catch/finally` for graceful error handling. Common types: `SyntaxError`, `TypeError`, `ReferenceError`. `finally` always runs — use for cleanup.

Debug methods: `console.error()`, `console.warn()`, `console.trace()` (stack trace), `console.table()`.

---

## Map & Set

**Map** — key-value pairs, keys any type: `set()`, `get()`, `has()`, `delete()`.

**Set** — unique values only, duplicates ignored: `add()`, `has()`, `delete()`.

---

## Spread & Rest

**Spread** expands: `const arr2 = [...arr1, 3, 4];`

**Rest** collects: `function sum(...nums) { return nums.reduce((a,c)=>a+c,0); }`

---

## The `this` Keyword

| Context           | `this`                          |
|-------------------|---------------------------------|
| Object method     | The object                      |
| Plain function    | `window` / `undefined` (strict) |
| Arrow function    | Lexical scope (inherits)        |

Arrow functions fix `this` in callbacks — prefer them for event handlers.

---

## Closures

Function that remembers outer scope variables. Foundation of modules, memoization, and event handlers.

```js
function createCounter() {
  let count = 0;
  return function () { count++; return count; };
}
```

---

## Memory Management

JS uses automatic garbage collection. Nullify references when done, clean up timers/listeners, use `WeakMap`/`WeakSet` for caches.

---

## Web Storage

| Feature     | localStorage   | sessionStorage | Cookies      |
|-------------|----------------|----------------|--------------|
| Size        | 5–10 MB        | 5 MB           | 4 KB         |
| Lifetime    | Until cleared  | Tab closes     | Configurable |
| HTTP sent   | No             | No             | Yes          |

---

## Key Takeaways

1. `try/catch/finally` for risky ops, `console.trace()` for debugging
2. `Map` for flexible keys, `Set` for uniqueness
3. Spread expands, Rest collects
4. Arrow functions inherit `this`
5. Closures enable encapsulation
6. Clean up references to avoid leaks
7. Pick storage by lifetime/server needs
