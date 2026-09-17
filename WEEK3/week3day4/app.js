const http = require("http");
const { EventEmitter } = require("events");

// ============================================================
//  WEEK 3 DAY 4 — Event Loop, Event-Driven Architecture & Basic Routing
// ============================================================

// ------------------------------------------------------------
//  TASK 1: Event Loop Phases Deep Dive
// ------------------------------------------------------------
// Demonstrate the 6 phases of the Node.js event loop and the
// execution order of setTimeout, setImmediate, process.nextTick,
// and Promise.resolve.
//
// Expected order: nextTick → Promise → setTimeout/setImmediate
// setTimeout vs setImmediate order varies by system clock.
//
// Steps:
//   1. Call console.log with a label in each callback
//   2. Observe the execution order in terminal
//   3. Explain why process.nextTick always runs first

// ------------------------------------------------------------
//  TASK 2: Custom EventEmitter
// ------------------------------------------------------------
// Create a custom EventEmitter class (or use EventEmitter directly)
// to simulate a User Service that emits events when users are
// created, updated, or deleted.
//
// Methods to use:
//   emitter.on(event, listener)    — add listener
//   emitter.once(event, listener)  — add one-time listener
//   emitter.emit(event, ...args)   — fire event with data
//   emitter.removeListener(event, listener) — remove listener
//
// Steps:
//   1. Create emitter instance
//   2. Add listeners for 'userCreated', 'userUpdated', 'userDeleted'
//   3. Add a once() listener that fires only on first userCreated
//   4. Emit events with sample user data
//   5. Demonstrate removeListener

// ------------------------------------------------------------
//  TASK 3: EventEmitter Error Handling
// ------------------------------------------------------------
// Show what happens when an error event is emitted WITHOUT an
// error listener (process crashes), then show the proper pattern.
//
// Steps:
//   1. Emit 'error' without a listener → observe crash
//   2. Add error listener → emit again → graceful handling
//   3. Best practice: always attach error listener

// ------------------------------------------------------------
//  TASK 4: Built-in Module Events
// ------------------------------------------------------------
// Demonstrate that Node.js core modules (http, process, streams)
// are EventEmitters and use events internally.
//
// Steps:
//   1. Create http.Server, listen for 'request' and 'listening' events
//   2. Listen for process 'uncaughtException' and 'SIGTERM'
//   3. Create a readable stream, listen for 'data' and 'end' events

// ------------------------------------------------------------
//  TASK 5: Basic HTTP Routing (Built-in http Module)
// ------------------------------------------------------------
// Build a simple REST API using only Node's built-in http module.
// Implement manual route matching for an in-memory users store.
//
// Routes:
//   GET    /              → welcome message
//   GET    /api/users     → list all users
//   GET    /api/users/:id → get user by ID
//   POST   /api/users     → create user (JSON body)
//   PUT    /api/users/:id → update user (JSON body)
//   DELETE /api/users/:id → delete user
//
// Steps:
//   1. Create http.createServer with request handler
//   2. Parse req.url and req.method
//   3. Match routes with if/else or switch
//   4. Extract dynamic :id from URL path
//   5. Parse JSON body for POST/PUT using req.on('data')
//   6. Return JSON responses with proper status codes
//   7. Store users in a simple array (in-memory)

// ============================================================
//  YOUR IMPLEMENTATION GOES BELOW
// ============================================================
