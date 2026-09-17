const topics = [
  "Single-Threaded Architecture & Concurrency Model",
  "Blocking vs Non-Blocking Operations",
  "Asynchronous File I/O with fs Module",
  "Node.js Runtime Environment & Internal Mechanics",
];

const fs = require("fs");
const os = require("os");
const v8 = require("v8");
const path = require("path");
const { readFile, writeFile } = require("fs").promises;

//__dirname is the
// .. is 1 step up = WEEK3 | another .. is 2 steps up = GrowBootcamp | then enter 'dailyReports'
const reportsPath = path.join(__dirname, "..", "..", "dailyReports");
console.log(reportsPath);

fs.readdir(reportsPath, (err, data) => {
  if (err) console.log("[Error]");
  data.forEach((d) => {
    const [name, ext] = d.split(".");
    console.log(`File Name: ${name} || File Extension: ${ext}`);
  });
  console.log(data);
});

// // == 1. Single-Threaded Architecture & Concurrency Model ==

// /*
// Real-World Scenario: API Gateway Request Simulator
// You are building an API gateway that forwards requests to 5 microservices.
// Each service has a different response time. All 5 requests arrive at the
// same time. Demonstrate that Node.js handles them concurrently on a single
// thread using the event loop — all requests START at roughly the same time
// but FINISH at different times.

// What this proves:
// - The call stack is single-threaded (only one JS runs at a time)
// - The event loop schedules callbacks without blocking
// - setTimeout callbacks are queued and executed by libuv
// */

// const simulateRequest = (serviceName, responseTimeMs) => {
//   const startTime = Date.now();
//   console.log(
//     `[GATEWAY] Request dispatched to ${serviceName} at ${startTime}ms`,
//   );

//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const endTime = Date.now();
//       console.log(
//         `[GATEWAY] ${serviceName} responded in ${endTime - startTime}ms`,
//       );
//       resolve({ service: serviceName, duration: endTime - startTime });
//     }, responseTimeMs);
//   });
// };

// const runConcurrencyDemo = async () => {
//   console.log("\n--- 1. Single-Threaded Concurrency Demo ---\n");
//   console.log("[GATEWAY] 5 requests arriving simultaneously...\n");

//   // Such Data comes from the Database(Relational or Non-Relational)?
//   const services = [
//     { name: "User Service", time: 200 },
//     { name: "Product Catalog", time: 800 },
//     { name: "Payment Gateway", time: 1500 },
//     { name: "Email Service", time: 500 },
//     { name: "Search Engine", time: 2000 },
//   ];

//   const results = await Promise.all(
//     services.map((s) => simulateRequest(s.name, s.time)),
//   );

//   console.log("\n[GATEWAY] Summary:");
//   results.forEach((r) => {
//     console.log(`  - ${r.service}: ${r.duration}ms`);
//   });
//   console.log("[GATEWAY] Total wall-clock time: ~2000ms (not 5000ms)");
//   console.log(
//     "[PROOF] All requests started within ~0ms of each other (non-blocking)\n",
//   );
// };

// // == 2. Blocking vs Non-Blocking Operations ==

// /*
// Real-World Scenario: File Download Manager
// A media company needs to download 3 large video files from a CDN.
// - Version A (Blocking): Downloads files one by one. Each must finish
//   before the next starts. Total time = sum of all times.
// - Version B (Non-Blocking): Downloads all 3 simultaneously. Total time
//   = max of all times (whichever takes longest).

// This demonstrates why blocking I/O kills performance in Node.js.
// */

// const simulateDownload = (fileName, sizeMB) => {
//   const downloadTimeMs = sizeMB * 100; // 100ms per MB simulated
//   console.log(`  [DOWNLOAD] Starting: ${fileName} (${sizeMB}MB)`);
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log(`  [DOWNLOAD] Completed: ${fileName}`);
//       resolve({ file: fileName, sizeMB, timeMs: downloadTimeMs });
//     }, downloadTimeMs);
//   });
// };

// const blockingDownloads = async () => {
//   console.log("\n--- 2a. Blocking Download (Sequential) ---\n");
//   const start = Date.now();

//   const r1 = await simulateDownload("interview-video.mp4", 3);
//   const r2 = await simulateDownload("promo-reel.mp4", 2);
//   const r3 = await simulateDownload("webinar-recording.mp4", 4);

//   const total = Date.now() - start;
//   console.log(`\n  Total time: ${total}ms (3 + 2 + 4 = 9 units)\n`);
//   return total;
// };

// const nonBlockingDownloads = async () => {
//   console.log("--- 2b. Non-Blocking Download (Parallel) ---\n");
//   const start = Date.now();

//   const [r1, r2, r3] = await Promise.all([
//     simulateDownload("interview-video.mp4", 3),
//     simulateDownload("promo-reel.mp4", 2),
//     simulateDownload("webinar-recording.mp4", 4),
//   ]);

//   const total = Date.now() - start;
//   console.log(`\n  Total time: ${total}ms (max of 3, 2, 4 = 4 units)\n`);
//   return total;
// };

// const runBlockingVsNonBlocking = async () => {
//   console.log("--- 2. Blocking vs Non-Blocking File Downloads ---\n");

//   const blockingTime = await blockingDownloads();
//   const nonBlockingTime = await nonBlockingDownloads();

//   console.log(
//     "  [RESULT] Blocking: " +
//       blockingTime +
//       "ms vs Non-Blocking: " +
//       nonBlockingTime +
//       "ms",
//   );
//   console.log(
//     "  [RESULT] Non-blocking was ~" +
//       Math.round(blockingTime / nonBlockingTime) +
//       "x faster\n",
//   );
// };

// // == 3. Asynchronous File I/O with fs Module ==

// /*
// Real-World Scenario: Application Config Loader
// A production app needs to load configuration from multiple JSON files
// (package.json for app identity, config.json for runtime settings),
// merge them, and return a unified config object.

// Implement this 3 ways:
//   A) Callbacks — traditional error-first callbacks
//   B) Promises — .then() chaining
//   C) Async/Await — modern, clean, readable

// Also demonstrate:
//   - Error handling for missing files
//   - Parallel file reads with Promise.all()
// */

// // --- 3a. Callback Approach ---

// const loadConfigWithCallbacks = () => {
//   console.log("\n--- 3a. Config Loader (Callbacks) ---\n");

//   fs.readFile("./package.json", "utf-8", (err, packageData) => {
//     if (err) {
//       console.log("  [ERROR] Could not read package.json:", err.message);
//       return;
//     }

//     fs.readFile("./config.json", "utf-8", (err, configData) => {
//       if (err) {
//         console.log("  [ERROR] Could not read config.json:", err.message);
//         return;
//       }

//       const pkg = JSON.parse(packageData);
//       const config = JSON.parse(configData);

//       const merged = {
//         name: pkg.name,
//         version: pkg.version,
//         environment: config.environment,
//         port: config.port,
//         features: config.features,
//       };

//       console.log(
//         "  [CALLBACK] Merged config:",
//         JSON.stringify(merged, null, 2),
//       );
//     });
//   });
// };

// // --- 3b. Promise Approach ---

// const loadConfigWithPromises = () => {
//   console.log("--- 3b. Config Loader (Promises) ---\n");

//   fs.promises
//     .readFile("./package.json", "utf-8")
//     .then((packageData) => {
//       return fs.promises
//         .readFile("./config.json", "utf-8")
//         .then((configData) => {
//           const pkg = JSON.parse(packageData);
//           const config = JSON.parse(configData);

//           const merged = {
//             name: pkg.name,
//             version: pkg.version,
//             environment: config.environment,
//             port: config.port,
//             features: config.features,
//           };

//           console.log(
//             "  [PROMISE] Merged config:",
//             JSON.stringify(merged, null, 2),
//           );
//           return merged;
//         });
//     })
//     .catch((err) => {
//       console.log("  [ERROR] Failed to load config:", err.message);
//     });
// };

// // --- 3c. Async/Await Approach ---

// const loadConfigWithAsyncAwait = async () => {
//   console.log("--- 3c. Config Loader (Async/Await) ---\n");

//   try {
//     const [packageData, configData] = await Promise.all([
//       readFile("./package.json", "utf-8"),
//       readFile("./config.json", "utf-8"),
//     ]);

//     const pkg = JSON.parse(packageData);
//     const config = JSON.parse(configData);

//     const merged = {
//       name: pkg.name,
//       version: pkg.version,
//       environment: config.environment,
//       port: config.port,
//       features: config.features,
//     };

//     console.log(
//       "  [ASYNC/AWAIT] Merged config:",
//       JSON.stringify(merged, null, 2),
//     );
//     return merged;
//   } catch (err) {
//     console.log("  [ERROR] Failed to load config:", err.message);
//   }
// };

// // --- 3d. Error Handling Demo ---

// const loadConfigWithErrorHandling = async () => {
//   console.log("--- 3d. Error Handling (Missing File) ---\n");

//   try {
//     const data = await readFile("./nonexistent-file.json", "utf-8");
//     console.log("  This line never runs");
//   } catch (err) {
//     console.log("  [HANDLED] Gracefully caught error:");
//     console.log("    Code:", err.code);
//     console.log("    Message:", err.message);
//     console.log("    Path:", err.path);
//     console.log("  App continues running despite missing file.\n");
//   }
// };

// // --- 3e. Parallel Reads ---

// const loadMultipleFilesParallel = async () => {
//   console.log("--- 3e. Parallel File Reads with Promise.all() ---\n");

//   const start = Date.now();

//   try {
//     const [packageData, configData] = await Promise.all([
//       readFile("./package.json", "utf-8"),
//       readFile("./config.json", "utf-8"),
//     ]);

//     const elapsed = Date.now() - start;
//     console.log(`  Read 2 files in ${elapsed}ms (parallel)`);
//     console.log(`  package.json: ${packageData.length} bytes`);
//     console.log(`  config.json: ${configData.length} bytes\n`);
//   } catch (err) {
//     console.log("  [ERROR]", err.message);
//   }
// };

// const runFileIODemo = async () => {
//   console.log("--- 3. Asynchronous File I/O with fs Module ---\n");

//   loadConfigWithCallbacks();

//   await new Promise((resolve) => setTimeout(resolve, 100));

//   loadConfigWithPromises();

//   await new Promise((resolve) => setTimeout(resolve, 100));

//   await loadConfigWithAsyncAwait();

//   await loadConfigWithErrorHandling();

//   await loadMultipleFilesParallel();
// };

// // == 4. Node.js Runtime Environment & Internal Mechanics ==

// /*
// Real-World Scenario: Server Health Check Diagnostic
// A DevOps engineer needs to inspect a running Node.js server.
// Build a diagnostic tool that gathers:
//   - Node.js version and V8 engine version
//   - System info: platform, total/free memory, CPU cores
//   - Process info: PID, uptime, memory usage, current directory
//   - V8 heap statistics: used, total, limit
//   - Environment info: NODE_ENV, key environment variables

// This is what tools like `pm2 monit`, `node --inspect`, and
// cloud health checks do internally.
// */

// const getServerDiagnostics = () => {
//   console.log("--- 4. Server Health Check Diagnostic ---\n");

//   // --- Node.js Version ---
//   console.log("  [NODE] Version:", process.version);
//   console.log("  [NODE] V8 Engine:", process.versions.v8);

//   // --- OS Information ---
//   console.log("\n  [OS] Platform:", os.platform());
//   console.log("  [OS] Architecture:", os.arch());
//   console.log(
//     "  [OS] Total Memory:",
//     (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
//     "GB",
//   );
//   console.log(
//     "  [OS] Free Memory:",
//     (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
//     "GB",
//   );
//   console.log("  [OS] CPU Cores:", os.cpus().length);
//   console.log("  [OS] CPU Model:", os.cpus()[0]?.model || "N/A");

//   // --- Process Information ---
//   console.log("\n  [PROCESS] PID:", process.pid);
//   console.log("  [PROCESS] Uptime:", process.uptime().toFixed(1), "seconds");
//   console.log("  [PROCESS] Current Dir:", process.cwd());

//   const memUsage = process.memoryUsage();
//   console.log(
//     "\n  [MEMORY] RSS (Total):",
//     (memUsage.rss / 1024 / 1024).toFixed(2),
//     "MB",
//   );
//   console.log(
//     "  [MEMORY] Heap Used:",
//     (memUsage.heapUsed / 1024 / 1024).toFixed(2),
//     "MB",
//   );
//   console.log(
//     "  [MEMORY] Heap Total:",
//     (memUsage.heapTotal / 1024 / 1024).toFixed(2),
//     "MB",
//   );
//   console.log(
//     "  [MEMORY] External:",
//     (memUsage.external / 1024 / 1024).toFixed(2),
//     "MB",
//   );

//   // --- V8 Heap Statistics ---
//   const heapStats = v8.getHeapStatistics();
//   console.log(
//     "\n  [V8] Heap Size Limit:",
//     (heapStats.heap_size_limit / 1024 / 1024).toFixed(2),
//     "MB",
//   );
//   console.log(
//     "  [V8] Total Heap Size:",
//     (heapStats.total_heap_size / 1024 / 1024).toFixed(2),
//     "MB",
//   );
//   console.log(
//     "  [V8] Used Heap Size:",
//     (heapStats.used_heap_size / 1024 / 1024).toFixed(2),
//     "MB",
//   );
//   console.log(
//     "  [V8] Heap Space Used:",
//     ((heapStats.used_heap_size / heapStats.total_heap_size) * 100).toFixed(1) +
//       "%",
//   );

//   // --- Environment ---
//   console.log("\n  [ENV] NODE_ENV:", process.env.NODE_ENV || "not set");
//   console.log("  [ENV] HOME:", process.env.HOME);
//   console.log("  [ENV] SHELL:", process.env.SHELL);

//   // --- Event Loop (Internal Mechanics) ---
//   console.log("\n  [EVENT LOOP] Event loop is managed by libuv");
//   console.log(
//     "  [EVENT LOOP] Thread pool size:",
//     process.env.UV_THREADPOOL_SIZE || "4 (default)",
//   );
//   console.log("  [EVENT LOOP] Single thread handles JS execution");
//   console.log("  [EVENT LOOP] libuv thread pool handles: fs, dns, crypto\n");
// };

// // == Run All Demos ==

// const runAll = async () => {
//   console.log("=".repeat(60));
//   console.log("  WEEK 3 DAY 3 — Node.js Tasks");
//   console.log("  Topics:", topics.join(" | "));
//   console.log("=".repeat(60));

//   await runConcurrencyDemo();
//   await runBlockingVsNonBlocking();
//   await runFileIODemo();
//   getServerDiagnostics();

//   console.log("=".repeat(60));
//   console.log("  All tasks completed.");
//   console.log("=".repeat(60));
// };

// runAll();
