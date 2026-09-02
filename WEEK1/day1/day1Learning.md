# Day 1 Learning Log — HTML5, CSS & JavaScript Fundamentals

**Date:** September 1, 2026  
**Intern:** Subodh Shah

---

## HTML — Semantic Structure

Used semantic elements in `index.html` to build a newspaper-style layout:

| Element | Purpose |
|---|---|
| `<header>` | News headline banner |
| `<nav>` | Masthead with title and date |
| `<main>` | Container for articles + sidebar |
| `<section>` | Groups the two articles together |
| `<article>` | Individual news stories (2 used) |
| `<aside>` | Impact assessment table sidebar |
| `<footer>` | Copyright notice |

**Key takeaway:** Semantic elements improve accessibility and SEO by giving meaning to the page structure.

---

## CSS — Box Model

Applied a global reset using `border-box`:

```css
*, *::before, *::after {
    box-sizing: border-box;
    padding: 3px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 1rem;
}
```

**What I learned:**
- `content-box` (default) adds padding/border on top of width — causes overflow
- `border-box` includes padding/border in the width — prevents layout breaks
- Including `::before` and `::after` in the reset ensures pseudo-elements also get `border-box`

---

## CSS — Selectors Used

| Selector | Type | Example from project |
|---|---|---|
| Tag | Simple | `h1, h2, h3, h4, h5, h6` |
| Class | Simple | `.container`, `.heading`, `.navSection` |
| Child combinator | Combinator | `.mainSection > section` — targets only direct `<section>` child |

**Studied but not applied:** Descendant selector, sibling selectors, pseudo-classes (`:hover`, `:nth-child`), pseudo-elements (`::before`, `::after` for decorative content).

---

## CSS — Flexbox Layout

Used Flexbox for the main page structure:

```css
/* Vertical column for the page */
.container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Horizontal with space-between for nav */
.navSection {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Horizontal with items aligned to top */
.mainSection {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}
```

**Key takeaway:** Flexbox handles 1D layouts well — `justify-content` for main axis, `align-items` for cross axis.

---

## CSS — Grid Layout

Used Grid for the image gallery:

```css
.imagesGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 250px;
    grid-auto-flow: dense;
    gap: 8px;
}

.imagesGrid img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

**What I learned:**
- `repeat(3, 1fr)` creates 3 equal columns using the fractional unit
- `object-fit: cover` fills the cell while maintaining aspect ratio (crops overflow)
- Grid handles 2D layouts (rows + columns) better than Flexbox

**Studied but not applied:** CSS `position` property (relative, absolute, fixed, sticky).

---

## JavaScript — Data Types

```js
let x = 10;            // Number (primitive)
let y = 'Subodh';      // String (primitive)
```

**Studied the 7 primitives:** Number, String, Boolean, undefined, null, Symbol, BigInt.  
**Reference type:** Objects — demonstrated with array of objects:

```js
const customerDetails = [
    { name: 'Subodh', age: 25, city: 'Dhangadhi' },
    { name: 'John', age: 30, city: 'Los Angeles' },
    // ...
];
```

---

## JavaScript — Comparison Operators

```js
if (x == y) {          // Loose equality — type coercion
    console.log('Equal');
}
if (x !== y) {         // Strict inequality — preferred
    console.log('Not Equal');
}
```

**Key takeaway:** Always use `===` / `!==` (strict) instead of `==` / `!=` (loose) to avoid type coercion bugs.

**Studied but not applied:** Arithmetic, logical, assignment operators; nullish coalescing (`??`).

---

## JavaScript — Functions & Control Flow

Implemented a recursive binary search function:

```js
function binarySearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;
    let mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) {
        return mid;
    }
    else if (arr[mid] < target) {
        low = mid + 1;
        return binarySearch(arr.slice(low, high + 1), target);
    }
    else {
        high = mid - 1;
        return binarySearch(arr.slice(low, high + 1), target);
    }
}
```

**What I learned:**
- Function declaration syntax
- Recursion — function calls itself with a smaller array slice
- `Math.floor()` for integer division, `arr.slice()` for shallow copying
- `if/else if/else` branching

---

## JavaScript — Arrays & Iteration

Used `.forEach()` with template literals and arrow functions:

```js
customerDetails.forEach((customer) => {
    console.log(`Name: ${customer.name}, Age: ${customer.age}, City: ${customer.city}`);
});
```

**What I learned:**
- `.forEach()` iterates over each array element
- Template literals (backticks with `${}`) — cleaner than string concatenation
- Arrow functions (`(param) => {}`) — concise syntax for callbacks

---

## Key Takeaways

1. Always use `* { box-sizing: border-box; }` reset
2. Flexbox for 1D, Grid for 2D layouts
3. Prefer `===` over `==`
4. `object-fit: cover` is essential for responsive images in grid/flex layouts
5. Semantic HTML makes the document accessible and self-documenting
