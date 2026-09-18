TECHNICAL LEARNING REPORT

Internship Program — MERN Track

Date: September 17, 2026
Week / Day: Week 3 — Day 4
Topic: Node.js Event Loop, Event-Driven Architecture & Basic Routing

1. Objective

Understand the Node.js Event Loop phases in depth, learn event-driven
architecture using the `events` module, and implement basic HTTP routing
with Node's built-in `http` module.

2. Technical Breakdown

A. Node.js Event Loop Phases

The event loop runs through 6 phases sequentially in each tick:

Phase What Runs
───────────────── ──────────────────────────────────────

1. Timers setTimeout / setInterval callbacks
2. I/O Callbacks Completed I/O events (file, network)
3. Idle/Prepare Internal (libuv bookkeeping)
4. Poll New I/O events; waits for work here
5. Check setImmediate callbacks
6. Close Callbacks socket.on('close'), etc.

Microtasks (process.nextTick, Promise callbacks) run BETWEEN phases,
before the next phase starts. process.nextTick has priority over
Promise microtasks.

Order demo:

```javascript
setTimeout(() => console.log("1"), 0);
setImmediate(() => console.log("2"));
process.nextTick(() => console.log("3"));
Promise.resolve().then(() => console.log("4"));
// Output: 3, 4, then 1 or 2 (varies by system clock)
```

setTimeout vs setImmediate order is not guaranteed — it depends on
the system clock resolution. process.nextTick and Promise always
execute before either because they are microtasks, not phase tasks.

B. Event-Driven Architecture with the `events` Module

Node.js uses the Observer pattern. Objects (emitters) emit named
events, and other objects (listeners) react to them. Nearly every
core module (http, stream, process) extends EventEmitter.

Key methods:

Method Description
──────────────────────────── ──────────────────────────────
emitter.on(event, fn) Add listener (called every emit)
emitter.once(event, fn) Add one-time listener
emitter.emit(event, ...args) Fire event with optional data
emitter.removeListener() Remove specific listener
emitter.removeAllListeners() Remove all listeners for an event

Error handling: always add an 'error' listener. Without it, an
emitted error event throws and crashes the process immediately.

```javascript
const emitter = new EventEmitter();
emitter.on("error", (err) => console.error("Handled:", err.message));
emitter.emit("error", new Error("Something went wrong"));
```

C. Basic HTTP Routing (Built-in `http` Module)

http.createServer(callback) receives (req, res) for every request.
Without Express, routing is manual:

1. Parse req.url and req.method
2. Match routes with if/else or switch
3. Extract dynamic params (e.g., /:id) via string splitting
4. Parse JSON body for POST/PUT using req.on('data') chunks
5. Send responses with res.writeHead() + res.end(JSON.stringify())

Routes implemented:

Method Route Action
────── ────────────── ──────────────────────────
GET / Welcome message
GET /api/users List all users
GET /api/users/:id Get user by ID
POST /api/users Create user (JSON body)
PUT /api/users/:id Update user (JSON body)
DELETE /api/users/:id Delete user

D. Difficulties Faced

1. Event loop phase timing — setTimeout vs setImmediate order varies
   depending on system clock resolution; process.nextTick always runs
   first because it executes before the next event loop phase.
2. URL parsing for dynamic routes — extracting :id from a path like
   /api/users/42 requires manual string splitting; no built-in route
   parameter parser exists in the http module.

E. Key Findings

Area Best Practice
────────────────────── ───────────────────────────────────────
Event Loop Understand phases to debug timing issues
Microtasks process.nextTick > Promise.then in priority
EventEmitter Always handle 'error' event to prevent crash
HTTP Routing Manual routing is possible but tedious;
Express abstracts this for production use
State Management In-memory array works for demos; use a
database for persistence in real apps

3. Key Findings

The event loop's 6 phases control execution order. Microtasks
(process.nextTick) always run before the next phase completes. The
events module implements the Observer pattern — emitters broadcast,
listeners react. Always attach an error listener to EventEmitters to
prevent process crashes. HTTP routing with Node's built-in module is
manual but teaches how frameworks like Express handle requests
internally.

4. Conclusion

Day 4 covered Event Loop phases, event-driven architecture, and basic
HTTP routing. Understanding event loop timing prevents subtle bugs in
async code. The EventEmitter pattern is foundational to Node.js —
streams, HTTP servers, and child processes all use it. Manual HTTP
routing builds intuition for how frameworks like Express abstract
request handling. These concepts bridge the gap between understanding
Node internals and building real server applications.
