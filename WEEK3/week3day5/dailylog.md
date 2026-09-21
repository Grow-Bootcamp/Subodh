TECHNICAL LEARNING REPORT

Internship Program — MERN Track

Date: September 18, 2026
Week / Day: Week 3 — Day 5
Topic: Middleware, Template Engines & npm Package Versioning
Mentor: Santosh Upadhyay

1. Objective

Study middleware concepts in backend applications, understand template
engines for rendering dynamic content, learn npm semantic versioning
(semver) including `^`, `~`, and exact version specifiers. Prepare and
deliver a summary presentation covering Days 1-4 of Week 3.

2. Technical Breakdown

A. Middleware in Backend Applications

Middleware functions are functions that have access to the request
object (`req`), the response object (`res`), and the `next` function
in the application's request-response cycle. Middleware can:

- Execute any code
- Modify `req` or `res` objects
- End the request-response cycle
- Call the next middleware in the stack via `next()`

Express middleware signature:

```typescript
function middleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Do something
  next(); // Pass control to the next middleware
}
```

The order of `app.use()` calls determines the execution order.
Middleware runs sequentially — each call to `next()` passes control
to the next registered middleware.

Types of middleware studied:

1. Application-level middleware — registered via `app.use()` or
   `app.METHOD()` (e.g., `app.get()`, `app.post()`).

2. Built-in middleware — Express ships with `express.json()` and
   `express.urlencoded()` for parsing request bodies.

3. Third-party middleware — packages like `cors`, `morgan`, `helmet`
   that add functionality without writing boilerplate.

Logging Middleware:

```typescript
const logger = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  console.log(req.method, req.url);
  next();
};
app.use(logger);
```

Authentication Middleware:

```typescript
const auth = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("Unauthorized");
  next();
};
app.use(auth);
```

Key takeaway: middleware functions form a pipeline. If `next()` is not
called, the request hangs. If an error occurs, `next(err)` passes
control to Express error-handling middleware (4 parameters).

B. Template Engines

A template engine lets you generate dynamic HTML pages on the server.
Instead of sending raw HTML, the server parses a template file,
injects data, and sends the rendered HTML to the client.

EJS (Embedded JavaScript) was used in this project:

Template file (`views/index.ejs`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
</head>
<body>
  <h1><%= title %></h1>
  <p>Welcome to the Express + EJS template engine.</p>
</body>
</html>
```

Express setup:

```typescript
import express from "express";
import path from "path";

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index", { title: "Template Engine" });
});
```

Key concepts:

- `app.set("view engine", "ejs")` — registers EJS as the default
  template engine so `res.render("filename")` auto-appends `.ejs`.
- `app.set("views", ...)` — sets the directory where template files
  live. Defaults to `./views`.
- `res.render(view, data)` — compiles the template with the given
  data object and sends the rendered HTML.
- EJS syntax: `<%= expr %>` outputs escaped HTML; `<%- expr %>`
  outputs raw HTML; `<% code %>` runs JavaScript without outputting.
- Template engines decouple presentation from logic — the same
  template can render different data without changing server code.

C. npm Package Versioning (Semantic Versioning)

npm uses semantic versioning (semver) in `package.json`:

Format: `MAJOR.MINOR.PATCH`

- MAJOR — breaking changes (API incompatibilities)
- MINOR — new features (backward-compatible)
- PATCH — bug fixes (backward-compatible)

Version prefixes in `package.json`:

Prefix	Meaning	Example	Allows
─────── ────────────────────── ──────────── ──────────────────
(none)	Exact version	"1.2.3"	Only 1.2.3
^	Caret — compatible with	"^1.2.3"	>=1.2.3 <2.0.0
~	Tilde — approximately	"~1.2.3"	>=1.2.3 <1.3.0

Practical examples from the project's `package.json`:

```json
"express": "^5.2.1"
"ejs": "^6.0.1"
"typescript": "^7.0.2"
```

With `^5.2.1`, npm can install any version from 5.2.1 up to (but not
including) 6.0.0. This allows new features and bug fixes within the
same major version.

With `~3.1.14` (e.g., nodemon), npm installs from 3.1.14 up to
(but not including) 3.2.0. This is more conservative — only bug
fixes within the same minor version.

`package-lock.json`:

- Locks exact dependency versions for reproducible installs
- Generated automatically on `npm install`
- Should be committed to version control
- Ensures all team members install identical dependency trees
- Overrides `package.json` version ranges during installation

Key differences:

Aspect	package.json	package-lock.json
─────── ────────────────────── ───────────────────────────
Purpose	Specify version ranges	Lock exact versions
Content	Version ranges with prefixes	Resolved exact versions + hashes
Editable	Manually edited	Auto-generated by npm
Commit	Always committed	Always committed

D. Summary of Week 3 — Days 1 to 4

Day 1 — MongoDB Basics and CRUD Operations:

- Installed MongoDB and MongoDB Compass for GUI management
- Learned database and collection operations (create, drop, list)
- Practiced CRUD operations: insertOne, insertMany, find, findOne,
  updateOne, updateMany, deleteOne, deleteMany
- Explored query operators: `$gt`, `$lt`, `$in`, `$regex`
- Used projection to include/exclude specific fields

Day 2 — MongoDB Aggregation, Schema Validation & Data Modeling:

- Built aggregation pipelines with stages: `$match`, `$group`,
  `$sort`, `$limit`, `$project`, `$unwind`, `$lookup`, `$addFields`
- Implemented schema validation using `$jsonSchema` validators
- Learned numeric types: `NumberInt`, `NumberLong`, `NumberDouble`,
  `NumberDecimal` and their use cases
- Studied embedding vs referencing patterns for data modeling
- Used `$lookup` for relational-style joins between collections

Day 3 — Node.js Internals, Concurrency & Asynchronous I/O:

- Explored Node.js runtime architecture (V8, libuv, C++ bindings)
- Studied the single-threaded event loop and its 6 phases
- Compared blocking vs non-blocking I/O with practical demos
- Built an API Gateway Request Simulator showing non-blocking
  concurrency (all requests start together, finish at different times)
- Used `fs` module with callbacks and promises for file operations
- Leveraged `Promise.all()` for parallel file operations
- Built a Server Health Check Diagnostic tool using `process`, `os`,
  and `v8` modules

Day 4 — Event Loop, Event-Driven Architecture & HTTP Routing:

- Studied event loop phases in depth: Timers, I/O Callbacks,
  Idle/Prepare, Poll, Check, Close Callbacks
- Learned microtasks (process.nextTick, Promise) run BETWEEN phases
- Used the `events` module implementing the Observer pattern
- Built custom EventEmitters with error handling
- Implemented HTTP routing with Node's built-in `http` module
- Created RESTful routes: GET, POST, PUT, DELETE for user management
- Manual URL parsing and JSON body handling

E. Difficulties Faced

1. Middleware ordering — Placing auth middleware before logging
   middleware caused the logger to miss requests rejected by auth.
   The fix was to register logging middleware first, then auth.

2. Template engine path resolution — `res.render()` threw "Failed to
   lookup view" when `views` directory was not set correctly. Using
   `path.join(__dirname, "views")` resolved the issue by providing
   an absolute path.

3. Semver prefix confusion — Initially confused `^` and `~` behavior.
   The `^` prefix allows MINOR and PATCH updates (within same MAJOR),
   while `~` only allows PATCH updates (within same MINOR). Reading
   the npm documentation clarified the exact rules.

F. Key Findings

Area	Best Practice
───────────────────────── ───────────────────────────────────────
Middleware	Always call next() unless ending the response; order
	matters — register logging before auth
Template Engines	Decouple HTML from server logic; use EJS for
	simple templates, React for complex UIs
npm Versioning	Use `^` for libraries (allows feature updates);
	use `~` for tools (only bug fixes); use exact for
	critical dependencies
package-lock.json	Always commit to version control for
	reproducible builds across environments
Code Organization	Separate concerns — middleware, routes, and
	views in distinct directories

3. Key Findings

Middleware functions form a pipeline in Express — each function
receives `req`, `res`, and `next`. Calling `next()` passes control
forward; omitting it terminates the request. Middleware ordering
matters: logging should precede authentication so all requests are
logged regardless of auth outcome.

Template engines like EJS let servers generate dynamic HTML by
combining templates with data. Express requires only two settings
(view engine and views directory) to enable rendering. The
`res.render()` method compiles the template and sends the result.

npm semantic versioning uses MAJOR.MINOR.PATCH format. The `^` prefix
allows compatible updates up to the next major version. The `~` prefix
allows only patch-level updates within the same minor version.
`package-lock.json` locks exact versions for reproducible installs
and should always be committed to version control.

The Week 3 daily learning logs covered MongoDB operations and
aggregation, Node.js internals and async patterns, event-driven
architecture, HTTP routing, middleware, template engines, and npm
versioning. Together these topics form a solid foundation for
building full-stack applications with the MERN stack.

4. Conclusion

Day 5 of Week 3 covered three essential backend development topics:
middleware, template engines, and npm versioning. Middleware is the
backbone of Express applications — it enables modular request
processing for logging, authentication, validation, and more.
Template engines bridge the gap between server-side logic and
client-side presentation. npm versioning with semantic versioning
ensures dependency management is predictable and reproducible.

The week concluded with a comprehensive summary of Days 1-4,
reinforcing MongoDB operations, Node.js internals, event-driven
architecture, and HTTP routing. These topics collectively build the
foundation for full-stack MERN development, connecting database
management with server-side JavaScript and dependency management.
