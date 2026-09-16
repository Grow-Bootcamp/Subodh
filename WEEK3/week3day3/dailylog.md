# Week 3 Day 3 — Node.js Internals, Concurrency Model & Asynchronous I/O

Deep-dived into how Node.js works under the hood — its runtime environment, V8 engine, libuv, the event loop, and how it handles concurrency on a single thread. Built practical demos covering blocking vs non-blocking operations, asynchronous file I/O with callbacks and promises, and a server health check diagnostic tool.

---

## Topics Implemented

### 1. Node.js Runtime Environment & Internal Mechanics

Node.js is a JavaScript runtime built on Chrome's V8 engine. It embeds V8 into a C++ program along with libuv (a cross-platform library for async I/O), C++ bindings for OS-level features, and built-in modules like `http`, `fs`, and `crypto`.

**Core components:**

- **V8 Engine** — compiles JavaScript to machine code using JIT compilation
- **libuv** — provides the event loop, thread pool, and cross-platform async I/O
- **C++ Bindings** — connect JavaScript to low-level OS features

**Execution flow:**

1. Node starts, initializes V8 and libuv
2. Parses the entry JavaScript file
3. V8 compiles JS into machine code
4. libuv runs the event loop to handle async operations
5. When the call stack is empty and no pending callbacks, Node exits

```javascript
const os = require("os");
const v8 = require("v8");

// Server Health Check Diagnostic
console.log("[NODE] Version:", process.version);
console.log("[NODE] V8 Engine:", process.versions.v8);

console.log("[OS] Platform:", os.platform());
console.log(
  "[OS] Total Memory:",
  (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
  "GB",
);
console.log(
  "[OS] Free Memory:",
  (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
  "GB",
);
console.log("[OS] CPU Cores:", os.cpus().length);

console.log("[PROCESS] PID:", process.pid);
console.log("[PROCESS] Uptime:", process.uptime().toFixed(1), "seconds");

const memUsage = process.memoryUsage();
console.log(
  "[MEMORY] Heap Used:",
  (memUsage.heapUsed / 1024 / 1024).toFixed(2),
  "MB",
);
console.log(
  "[MEMORY] Heap Total:",
  (memUsage.heapTotal / 1024 / 1024).toFixed(2),
  "MB",
);

const heapStats = v8.getHeapStatistics();
console.log(
  "[V8] Heap Size Limit:",
  (heapStats.heap_size_limit / 1024 / 1024).toFixed(2),
  "MB",
);
```

### 2. Single-Threaded Concurrency via Event Loop

Node.js uses a single main thread for JavaScript execution. Concurrency is achieved through the event loop, not multiple threads.

**Event loop phases:**

1. **Timers** — executes `setTimeout()` and `setInterval()` callbacks
2. **I/O callbacks** — handles completed I/O events
3. **Poll** — retrieves new I/O events
4. **Check** — executes `setImmediate()` callbacks
5. **Close callbacks** — handles close events

```javascript
const simulateRequest = (serviceName, responseTimeMs) => {
  const startTime = Date.now();
  console.log(
    `[GATEWAY] Request dispatched to ${serviceName} at ${startTime}ms`,
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      const endTime = Date.now();
      console.log(
        `[GATEWAY] ${serviceName} responded in ${endTime - startTime}ms`,
      );
      resolve({ service: serviceName, duration: endTime - startTime });
    }, responseTimeMs);
  });
};

// All 5 requests start roughly at the same time but finish at different times
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

### 3. Blocking vs Non-Blocking Operations

**Blocking** operations freeze the entire event loop — no other code runs until completion. **Non-blocking** operations return immediately and notify via callback/promise when done.

**Blocking downloads (sequential) — total = sum of all times:**

```javascript
const r1 = await simulateDownload("interview-video.mp4", 3); // 300ms
const r2 = await simulateDownload("promo-reel.mp4", 2); // 200ms
const r3 = await simulateDownload("webinar-recording.mp4", 4); // 400ms
// Total: 900ms
```

**Non-blocking downloads (parallel) — total = max of all times:**

```javascript
const [r1, r2, r3] = await Promise.all([
  simulateDownload("interview-video.mp4", 3),
  simulateDownload("promo-reel.mp4", 2),
  simulateDownload("webinar-recording.mp4", 4),
]);
// Total: 400ms
```

Non-blocking was ~2x faster because all downloads ran simultaneously instead of sequentially.

### 4. Asynchronous File I/O with `fs` Module

**Callback-based API (error-first callbacks):**

```javascript
const fs = require("fs");

fs.readFile("./data.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err.message);
    return;
  }
  console.log("File contents:", data);
});
```

**Promise-based API (async/await):**

```javascript
const { readFile, writeFile } = require("fs").promises;

async function fileOperations() {
  try {
    const data = await readFile("./data.txt", "utf-8");
    console.log("File contents:", data);

    await writeFile("./output.txt", "Hello from Promises!");
    console.log("File written successfully");
  } catch (err) {
    console.error("Error:", err.message);
  }
}
```

**Parallel file reads with Promise.all():**

```javascript
const [packageData, configData] = await Promise.all([
  readFile("./package.json", "utf-8"),
  readFile("./config.json", "utf-8"),
]);
console.log("Both files loaded simultaneously");
```

| Aspect         | Callbacks                | Promises                                      |
| -------------- | ------------------------ | --------------------------------------------- |
| Syntax         | Nested ("callback hell") | Flat chaining with `.then()` or `async/await` |
| Error handling | Manual `if (err)` checks | Centralized `try/catch`                       |
| Readability    | Degrades with complexity | Remains clean                                 |
| Parallel ops   | Hard to parallelize      | Easy with `Promise.all()`                     |

---

## Difficulties Faced

### 1. Blocking vs Non-Blocking Output Confusion

The blocking and non-blocking demos used `Date.now()` for timing, but without `await` on the `Promise.all()` result, the timing output appeared before downloads completed. Fixed by properly awaiting the parallel operation and comparing wall-clock times.

### 2. File Path Resolution in `fs.readdir`

Used `path.join(__dirname, "..", "..", "dailyReports")` to navigate up two directories. Initially forgot that `__dirname` points to `WEEK3/week3day3/`, so the relative path needed two `..` segments to reach the `dailyReports` folder at the project root.

### 3. Understanding libuv Thread Pool Size

The default thread pool size is 4, which means o3nly 4 file I/O operations can run in parallel. If more are needed, set `UV_THREADPOOL_SIZE` environment variable (up to 1024). This was confusing because `Promise.all()` with more than 4 file reads would still be partially serialized.

---

## Areas for Improvement

- **Add a real HTTP server** — currently demos are scripts, not serving requests
- **Error handling in async/await** — the `readFile` callback demo used `if (err)` but the promise version used `try/catch`; should demonstrate both patterns consistently
- **Explore Worker Threads** — the single-threaded model has limits; Worker Threads can handle CPU-intensive tasks
- **Measure event loop lag** — use `monitorEventLoopDelay()` from `perf_hooks` for production-grade diagnostics
- **Test with `node --prof`** — V8 profiler can identify performance bottlenecks in JavaScript execution
