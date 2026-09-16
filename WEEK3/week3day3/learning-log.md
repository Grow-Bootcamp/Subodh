# Week 3 Day 3 — Node.js Internals, Concurrency Model & Asynchronous I/O

## Topics Covered

### 1. Nature, Runtime Environment & Internal Mechanics of Node.js

- Node.js is a **JavaScript runtime** built on Chrome's V8 engine, not a framework or library
- It allows JavaScript to run **outside the browser** by embedding V8 into a C++ program
- **Core components:**
  - **V8 Engine** — compiles and executes JavaScript; uses JIT (Just-In-Time) compilation
  - **libuv** — cross-platform C library that provides the event loop, thread pool, and async I/O
  - **C++ Bindings** — glue code that connects JavaScript to low-level OS features (file system, networking)
  - **Dependencies** — modules like `http`, `fs`, `crypto` are implemented in C/C++ and exposed to JS
- **Execution flow:**
  1. Node starts, initializes V8 and libuv
  2. Parses the entry JS file
  3. V8 compiles JS into machine code
  4. libuv runs the event loop to handle async operations
  5. When the call stack is empty and no pending callbacks, Node exits

### 2. Single-Threaded Architecture & Concurrency Model

- Node.js uses a **single main thread** for JavaScript execution
- The **call stack** is single-threaded — only one function executes at a time
- Concurrency is achieved through the **event loop**, not multiple threads
- **Event loop phases (simplified):**
  1. **Timers** — executes `setTimeout()` and `setInterval()` callbacks
  2. **I/O callbacks** — handles completed I/O events (file reads, network responses)
  3. **Idle/prepare** — internal use only
  4. **Poll** — retrieves new I/O events; executes I/O-related callbacks
  5. **Check** — executes `setImmediate()` callbacks
  6. **Close callbacks** — handles `close` events (e.g., `socket.on('close')`)
- **libuv thread pool** (default 4 threads) offloads heavy tasks: file I/O, DNS lookups, crypto operations
- Node.js 10+ supports **Worker Threads** for true multi-threading when needed
- Key insight: the single thread handles **orchestration**, while libuv handles **blocking work** in the background

### 3. Blocking vs Non-Blocking Operations

- **Blocking operations** freeze the entire event loop — no other code runs until completion
- **Non-blocking operations** return immediately and notify via callback/promise when done
- Blocking is suitable for startup/config tasks; non-blocking is essential for runtime performance

**Blocking I/O Example:**

```javascript
const fs = require('fs');

// BLOCKING — thread is stuck until file is fully read
const data = fs.readFileSync('/etc/passwd', 'utf-8');
console.log('File read complete');
console.log(data.substring(0, 100));

// This code CANNOT run while the file is being read
console.log('This runs after the file read');
```

**Non-Blocking I/O Example:**

```javascript
const fs = require('fs');

// NON-BLOCKING — returns immediately, callback runs later
fs.readFile('/etc/passwd', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log('File read complete');
  console.log(data.substring(0, 100));
});

// This code runs IMMEDIATELY — doesn't wait for the file
console.log('This runs before the file read completes');
```

**Performance Comparison:**

```javascript
const fs = require('fs');
const start = Date.now();

// Blocking — reads 3 files sequentially
fs.readFileSync('file1.txt');
fs.readFileSync('file2.txt');
fs.readFileSync('file3.txt');
console.log(`Blocking: ${Date.now() - start}ms`); // ~300ms (sequential)

// Non-blocking — reads 3 files in parallel
const start2 = Date.now();
fs.readFile('file1.txt', () => {});
fs.readFile('file2.txt', () => {});
fs.readFile('file3.txt', () => {});
// Note: can't measure completion this way — use setTimeout for comparison
```

### 4. Asynchronous File I/O with the `fs` Module

#### Callback-Based API (Error-First Callbacks)

```javascript
const fs = require('fs');

// Reading a file with callback
fs.readFile('./data.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err.message);
    return;
  }
  console.log('File contents:', data);
});

// Writing a file with callback
fs.writeFile('./output.txt', 'Hello, Node.js!', (err) => {
  if (err) {
    console.error('Error writing file:', err.message);
    return;
  }
  console.log('File written successfully');
});

// Appending to a file
fs.appendFile('./log.txt', 'New log entry\n', (err) => {
  if (err) throw err;
  console.log('Data appended');
});
```

#### Promise-Based API (fs/promises)

```javascript
const fs = require('fs').promises;
// OR: const { readFile, writeFile } = require('fs/promises');

async function fileOperations() {
  try {
    // Reading a file with promises
    const data = await readFile('./data.txt', 'utf-8');
    console.log('File contents:', data);

    // Writing a file with promises
    await writeFile('./output.txt', 'Hello from Promises!');
    console.log('File written successfully');

    // Appending to a file
    await fs.appendFile('./log.txt', 'New log entry\n');
    console.log('Data appended');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

fileOperations();
```

#### Callback vs Promise Comparison

| Aspect | Callbacks | Promises |
|--------|-----------|----------|
| Syntax | Nested callbacks ("callback hell") | Flat chaining with `.then()` or `async/await` |
| Error handling | Manual `if (err)` checks in each callback | Centralized `try/catch` with async/await |
| Readability | Degrades with complexity | Remains clean at any depth |
| Return value | No return value; data passed to callback | Returns a Promise object |
| Composability | Hard to parallelize | Easy with `Promise.all()` |

#### Parallel File Operations with Promises

```javascript
const { readFile, writeFile } = require('fs/promises');

async function parallelRead() {
  try {
    // Read multiple files in parallel
    const [users, config, template] = await Promise.all([
      readFile('./users.json', 'utf-8'),
      readFile('./config.json', 'utf-8'),
      readFile('./template.html', 'utf-8'),
    ]);

    console.log('All files loaded');
    console.log('Users:', JSON.parse(users).length, 'records');
  } catch (err) {
    console.error('One or more files failed:', err.message);
  }
}

parallelRead();
```

## Key Takeaways

1. Node.js is a **runtime**, not a framework — it embeds V8 and libuv to run JavaScript outside the browser
2. The **single-threaded event loop** enables high concurrency without the overhead of thread management
3. The **libuv thread pool** (4 threads by default) handles blocking operations like file I/O in the background
4. **Blocking code** freezes the event loop and should be avoided in server contexts; use non-blocking alternatives
5. The `fs` module offers both **callback** and **promise** APIs — promises with `async/await` are preferred for readability
6. **`Promise.all()`** enables parallel file operations, significantly improving I/O performance
7. Understanding the event loop phases helps debug timing issues and optimize application performance
