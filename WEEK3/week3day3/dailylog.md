TECHNICAL LEARNING REPORT

Internship Program — MERN Track

Date: September 15, 2026
Week / Day: Week 3 — Day 3
Topic: Node.js Internals, Concurrency Model & Asynchronous I/O
Mentor: Santosh Upadhyay

1. Objective

The objective of Day 3 (Week 3) is to understand how Node.js works under the hood — its runtime environment, V8 engine, libuv, the event loop, and how it handles concurrency on a single thread. This session covers building practical demos for blocking vs non-blocking operations, asynchronous file I/O with callbacks and promises, and a server health check diagnostic tool.

2. Technical Breakdown

A. Node.js Runtime Environment and Internal Mechanics

Node.js is a JavaScript runtime built on Chrome's V8 engine. It embeds V8 into a C++ program along with libuv (a cross-platform library for async I/O), C++ bindings for OS-level features, and built-in modules like http, fs, and crypto.

Core components:

- V8 Engine — compiles JavaScript to machine code using JIT compilation
- libuv — provides the event loop, thread pool, and cross-platform async I/O
- C++ Bindings — connect JavaScript to low-level OS features

Execution flow:

1. Node starts, initializes V8 and libuv
2. Parses the entry JavaScript file
3. V8 compiles JS into machine code
4. libuv runs the event loop to handle async operations
5. When the call stack is empty and no pending callbacks, Node exits

The Server Health Check Diagnostic uses process, os, and v8 modules to gather runtime information:

```javascript
const os = require("os");
const v8 = require("v8");

console.log("[NODE] Version:", process.version);
console.log("[NODE] V8 Engine:", process.versions.v8);
console.log("[OS] Platform:", os.platform());
console.log("[OS] Total Memory:", (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), "GB");
console.log("[OS] Free Memory:", (os.freemem() / 1024 / 1024 / 1024).toFixed(2), "GB");
console.log("[OS] CPU Cores:", os.cpus().length);
console.log("[PROCESS] PID:", process.pid);
console.log("[PROCESS] Uptime:", process.uptime().toFixed(1), "seconds");

const memUsage = process.memoryUsage();
console.log("[MEMORY] Heap Used:", (memUsage.heapUsed / 1024 / 1024).toFixed(2), "MB");
console.log("[MEMORY] Heap Total:", (memUsage.heapTotal / 1024 / 1024).toFixed(2), "MB");

const heapStats = v8.getHeapStatistics();
console.log("[V8] Heap Size Limit:", (heapStats.heap_size_limit / 1024 / 1024).toFixed(2), "MB");
```

B. Single-Threaded Architecture and Concurrency Model

Node.js uses a single main thread for JavaScript execution. Concurrency is achieved through the event loop, not multiple threads.

Event loop phases (simplified):

1. Timers — executes setTimeout() and setInterval() callbacks
2. I/O callbacks — handles completed I/O events (file reads, network responses)
3. Idle/prepare — internal use only
4. Poll — retrieves new I/O events; executes I/O-related callbacks
5. Check — executes setImmediate() callbacks
6. Close callbacks — handles close events (e.g., socket.on('close'))

The libuv thread pool (default 4 threads) offloads heavy tasks: file I/O, DNS lookups, crypto operations. Node.js 10+ supports Worker Threads for true multi-threading when needed.

Key insight: the single thread handles orchestration, while libuv handles blocking work in the background.

The API Gateway Request Simulator demonstrates that all 5 requests start at roughly the same time but finish at different times, proving non-blocking concurrency:

```javascript
const simulateRequest = (serviceName, responseTimeMs) => {
  const startTime = Date.now();
  console.log(`[GATEWAY] Request dispatched to ${serviceName} at ${startTime}ms`);

  return new Promise((resolve) => {
    setTimeout(() => {
      const endTime = Date.now();
      console.log(`[GATEWAY] ${serviceName} responded in ${endTime - startTime}ms`);
      resolve({ service: serviceName, duration: endTime - startTime });
    }, responseTimeMs);
  });
};

const services = [
  { name: "User Service", time: 200 },
  { name: "Product Catalog", time: 800 },
  { name: "Payment Gateway", time: 1500 },
  { name: "Email Service", time: 500 },
  { name: "Search Engine", time: 2000 },
];

const results = await Promise.all(
  services.map((s) => simulateRequest(s.name, s.time)),
);
// Total wall-clock time: ~2000ms (not 5000ms)
```

C. Blocking vs Non-Blocking Operations

Blocking operations freeze the entire event loop — no other code runs until completion. Non-blocking operations return immediately and notify via callback/promise when done. Blocking is suitable for startup/config tasks; non-blocking is essential for runtime performance.

Blocking I/O Example:

```javascript
const fs = require('fs');

// BLOCKING — thread is stuck until file is fully read
const data = fs.readFileSync('/etc/passwd', 'utf-8');
console.log('File read complete');
console.log(data.substring(0, 100));

// This code CANNOT run while the file is being read
console.log('This runs after the file read');
```

Non-Blocking I/O Example:

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

File Download Manager demonstrates the performance difference:

- Blocking (Sequential): 3 files downloaded one after another. Total time = sum of all times (~900ms)
- Non-Blocking (Parallel): 3 files downloaded simultaneously. Total time = max of all times (~400ms)

Non-blocking was ~2x faster because all downloads ran simultaneously instead of sequentially.

D. Asynchronous File I/O with the fs Module

Callback-Based API (Error-First Callbacks):

```javascript
const fs = require('fs');

fs.readFile('./data.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err.message);
    return;
  }
  console.log('File contents:', data);
});

fs.writeFile('./output.txt', 'Hello, Node.js!', (err) => {
  if (err) {
    console.error('Error writing file:', err.message);
    return;
  }
  console.log('File written successfully');
});
```

Promise-Based API (fs/promises):

```javascript
const fs = require('fs').promises;

async function fileOperations() {
  try {
    const data = await fs.readFile('./data.txt', 'utf-8');
    console.log('File contents:', data);

    await fs.writeFile('./output.txt', 'Hello from Promises!');
    console.log('File written successfully');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

fileOperations();
```

Callback vs Promise Comparison:

Aspect	Callbacks	Promises
Syntax	Nested callbacks ("callback hell")	Flat chaining with .then() or async/await
Error handling	Manual if (err) checks in each callback	Centralized try/catch with async/await
Readability	Degrades with complexity	Remains clean at any depth
Return value	No return value; data passed to callback	Returns a Promise object
Composability	Hard to parallelize	Easy with Promise.all()

Parallel File Operations with Promises:

```javascript
const { readFile, writeFile } = require('fs/promises');

async function parallelRead() {
  try {
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

E. Difficulties Faced

1. Blocking vs Non-Blocking Output Confusion — The blocking and non-blocking demos used Date.now() for timing, but without await on the Promise.all() result, the timing output appeared before downloads completed. Fixed by properly awaiting the parallel operation and comparing wall-clock times.

2. File Path Resolution in fs.readdir — Used path.join(__dirname, "..", "..", "dailyReports") to navigate up two directories. Initially forgot that __dirname points to WEEK3/week3day3/, so the relative path needed two .. segments to reach the dailyReports folder at the project root.

3. Understanding libuv Thread Pool Size — The default thread pool size is 4, which means only 4 file I/O operations can run in parallel. If more are needed, set UV_THREADPOOL_SIZE environment variable (up to 1024). This was confusing because Promise.all() with more than 4 file reads would still be partially serialized.

F. Key Findings and Best Practices

Area	Best Practice
Runtime Architecture	Node.js is a runtime, not a framework — it embeds V8 and libuv to run JavaScript outside the browser
Concurrency Model	The single-threaded event loop enables high concurrency without the overhead of thread management
Thread Pool	libuv thread pool (4 threads by default) handles blocking operations like file I/O in the background
Blocking Code	Blocking code freezes the event loop and should be avoided in server contexts; use non-blocking alternatives
File I/O	The fs module offers both callback and promise APIs — promises with async/await are preferred for readability
Parallel Operations	Promise.all() enables parallel file operations, significantly improving I/O performance
Event Loop	Understanding the event loop phases helps debug timing issues and optimize application performance

3. Key Findings

Node.js is a runtime, not a framework — it embeds V8 and libuv to run JavaScript outside the browser. The single-threaded event loop enables high concurrency without the overhead of thread management.

The libuv thread pool (4 threads by default) handles blocking operations like file I/O in the background. Blocking code freezes the event loop and should be avoided in server contexts; use non-blocking alternatives.

The fs module offers both callback and promise APIs — promises with async/await are preferred for readability. Promise.all() enables parallel file operations, significantly improving I/O performance.

Understanding the event loop phases helps debug timing issues and optimize application performance. The default thread pool size is 4, which means only 4 file I/O operations can run in parallel without setting UV_THREADPOOL_SIZE.

4. Conclusion

Day 3 of Week 3 covered Node.js internals, the concurrency model, and asynchronous I/O. The session demonstrated how Node.js achieves high concurrency on a single thread through the event loop and libuv's thread pool.

Blocking vs non-blocking operations were compared through practical demos, showing that non-blocking parallel operations are significantly faster. The fs module provides both callback and promise APIs, with promises being the modern preferred approach.

Understanding the event loop phases, thread pool limitations, and proper async patterns is essential for building performant Node.js applications. These foundational concepts apply to all Node.js development, from simple scripts to production servers.
