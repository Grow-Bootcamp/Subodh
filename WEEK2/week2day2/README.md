# Week 2 Day 2

Demos covering Docker containerization, Docker Compose multi-container orchestration, Google OAuth, TypeScript fundamentals, and caching/memoization patterns.

## Projects

### docker-demo

Express.js app that demonstrates POST request handling, containerized using Docker. Listens on port 4000 and responds to browser-based POST calls with JSON.

Topics:

- What Docker is and why we containerize apps
- Dockerfile structure: `FROM` (base image), `WORKDIR` (working directory), `COPY` (copying files), `RUN` (executing commands), `EXPOSE` (port declaration), `CMD` (startup command)
- Building images with `docker build`
- Running containers with `docker run` and port mapping
- Express.js `express.json()` middleware for parsing JSON bodies
- Listening on `0.0.0.0` to expose server outside the container
- Frontend served inline via `res.send()` with HTML/JS

### docker-compose-demo

Multi-container application orchestrated with Docker Compose, consisting of a PostgreSQL database, an Express.js API, and a React client. Demonstrates how Docker Compose manages service dependencies, networking, and persistent storage.

Topics:

- `docker-compose.yml` structure: `services`, `image`, `build`, `ports`, `volumes`, `environment`, `depends_on`, `healthcheck`
- Defining multiple services: `postgres`, `api`, `client`
- PostgreSQL 16 Alpine image with user/password/database environment variables
- Named volumes (`pgdata`) for persistent database storage across container restarts
- Health checks: `pg_isready` to verify the database is accepting connections before dependent services start
- `depends_on` with `condition: service_healthy` to enforce startup order
- Multi-stage Docker builds for the client: builder stage (Node + Vite build) → production stage (nginx serving static files)
- `nginxinc/nginx-unprivileged:alpine-slim` for serving built React assets on port 8080
- Express.js API using `pg.Pool` with `DATABASE_URL` connection string
- Inter-service communication via Docker's internal DNS (e.g., `postgres:5432` from within the API container)
- Running the full stack with `docker compose up`

### oauth-demo

Express.js app implementing Google OAuth 2.0 login. Users authenticate via Google, and their profile (name, email, picture) is stored in a server-side session.

Topics:

- OAuth 2.0 authorization code flow (why it exists, how it works)
- Google Cloud Console: creating OAuth credentials, setting redirect URIs
- `google.auth.OAuth2` client setup with client ID, secret, callback URL
- `generateAuthUrl()` with scopes (`openid`, `email`, `profile`)
- Exchanging authorization code for access tokens via `getToken()`
- Fetching user info with `google.oauth2` API
- `express-session` for persisting login state across requests
- `dotenv` for managing secrets in `.env` files
- The three-step flow: `/login` -> `/callback` -> `/me`
- Static file serving with `express.static("public")`

### typescript-demo

TypeScript project demonstrating core language features including types, interfaces, functions, and generics. Transpiles from `src/` to `dist/` via `tsc`.

#### 1. Project Setup & Configuration

- `tsconfig.json` tells the TypeScript compiler how to build your code
- `target: "ES2020"` which JavaScript version to output (ES2020 supports modern features like optional chaining)
- `module: "commonjs"` module system used by Node.js (`require`/`module.exports`)
- `strict: true` turns on all strict checks (catches more bugs at compile time)
- `outDir: "./dist"` compiled JS goes here
- `rootDir: "./src"` source TS lives here
- Real world: Every TypeScript project starts with `tsconfig.json`. Companies like Airbnb, Slack, and Shopify use strict mode to catch bugs before code reaches production.

#### 2. Primitive Types (`types.ts:1-3`)

- `let userName: string = "John"` tells TypeScript this variable will always be text
- `let age: number = 25` numbers (both integers and decimals, no separate types)
- `let isActive: boolean = true` only `true` or `false`
- Why it matters: Without types, you could accidentally do `age = "twenty"` and crash at runtime. Types catch this at compile time.
- Real world: Form inputs (name, email), API responses (status codes, counts), feature flags (isPremium, isAdmin) everything in a codebase has a type, and declaring it prevents bugs.

#### 3. Collections (`types.ts:5-6`)

- `let numbers: number[] = [1, 2, 3]` an array where every element must be a number
- `let person: [string, number] = ["John", 25]` a tuple: fixed length, each position has a specific type
- Tuple access: `person[0]` is always `string`, `person[1]` is always `number`
- Real world: Arrays are everywhere product lists, user records, error messages. Tuples are used for fixed-format data like coordinate pairs `[lat, lng]`, database rows with known column order, or React's `useState` return value `[state, setState]`.

#### 4. Enums (`types.ts:8-9`)

- `enum Status { Active, Inactive }` creates a set of named constants (Active = 0, Inactive = 1)
- `let userStatus: Status = Status.Active` variable can only hold values from this enum
- Why it matters: Instead of magic strings like `"active"` or `"inactive"` scattered through code, enums give you a single source of truth.
- Real world: Order statuses (`Pending`, `Shipped`, `Delivered`), user roles (`Admin`, `Editor`, `Viewer`), HTTP methods (`GET`, `POST`, `PUT`, `DELETE`), payment states (`Processing`, `Completed`, `Failed`).

#### 5. Union Types (`types.ts:11`)

- `let id: string | number = "abc"` this variable can be either a string or a number
- The `|` means "or" the type is a union of the two
- Type narrowing: after checking `typeof id === "string"`, TypeScript knows it's a string in that code block
- Real world: API endpoints that accept both numeric IDs (`/users/123`) and string slugs (`/users/john-doe`), function parameters that accept multiple input formats, event handlers that receive different event types.

#### 6. Type Aliases (`types.ts:13-14`)

- `type Point = { x: number; y: number }` gives a name to a complex type
- `let coord: Point = { x: 10, y: 20 }` must have `x` and `y`, both numbers
- Real world: Defining shapes for map coordinates, form data (`type FormData = { name: string; email: string; age: number }`), API request/response bodies, configuration objects.

#### 7. Interfaces (`interfaces.ts:1-12`)

- `interface User { name: string; age: number; email?: string }` defines what a "User" object looks like
- Required properties: `name` and `age` must be present
- Optional properties: `email?` can be omitted (note the `?`)
- Interface extension: `interface Employee extends User { employeeId: number }` inherits all User properties and adds its own
- Interface vs type alias: Interfaces support declaration merging (you can add to them later) and are more extensible. Use interfaces for object shapes that might be extended.
- Real world: Database models (`User`, `Product`, `Order`), API contracts (request/response types), component props in React (`interface ButtonProps { label: string; onClick: () => void; disabled?: boolean }`), SDK configurations.

#### 8. Function Typing (`functions.ts:1-13`)

- Parameter types: `function add(a: number, b: number): number` both inputs and output are typed
- Return type: specified after `)` with `: number`
- Optional parameters: `greeting?: string` must come after required params, defaults to `undefined`
- Default fallback: `greeting || "Hello"` when the optional param isn't provided
- Rest parameters: `...numbers: number[]` collects any number of arguments into an array
- Arrow functions: `const multiply = (a: number, b: number): number => a * b` concise syntax with same typing rules
- Real world: Every function in a typed codebase has annotations. API route handlers (`function getUser(id: number): Promise<User>`), utility functions (`function formatCurrency(amount: number, currency: string): string`), event handlers, middleware.

#### 9. Generics (`generics.ts:1-22`)

- `function identity<T>(value: T): T` `T` is a placeholder type; whatever you pass in, you get back
- `identity(42)` returns `number`, `identity("hello")` returns `string` TypeScript infers `T` from the argument
- Generic class: `class Box<T> { constructor(public value: T) {} }` a typed wrapper around any value
- Generic interface: `interface Pair<K, V> { key: K; value: V }` two type parameters for key-value pairs
- Generic data structure: `class Stack<T>` a type-safe stack where every item must be the same type
  - `private items: T[] = []` internal array stores items of type `T`
  - `push(item: T): void` add an item (returns nothing)
  - `pop(): T | undefined` remove and return an item, or `undefined` if empty
- Type assertion: `as Pair<number, string>` tells TypeScript the exact shape of an object
- Why generics matter: Without them, you'd need separate functions/classes for every type. Generics let you write one reusable, type-safe implementation.
- Real world: React components (`function List<T>({ items }: { items: T[] })`), API clients (`fetch<T>(url): Promise<T>`), data structures (Stack, Queue, Map), library code (lodash, axios all use generics heavily), state management.

#### 10. Module System (`main.ts:1-6`)

- Entry point file: `main.ts` imports all other modules
- Side-effect imports: `import "./types"` just importing runs the file (no named exports used)
- Module resolution: TypeScript finds files relative to `src/`
- Real world: Large apps are split into modules (auth, dashboard, settings). Each module has its own types, functions, and logic. The entry point wires them all together.

### caching

JavaScript memoization demo that caches function results to avoid redundant expensive computations. Uses a higher-order function to wrap any function with caching behavior.

Topics:

- Memoization: storing the results of expensive function calls and returning the cached result when the same inputs occur again
- Higher-order function pattern: `memoization(fn)` returns a new function that wraps the original with caching logic
- `Map` as an in-memory cache store for key-value pairs
- Cache key generation via `JSON.stringify(args)` to serialize function arguments into a unique string key
- Cache hit: when the key exists in the cache, return the stored result without re-running the function
- Cache miss: when the key is absent, execute the original function, store the result in the cache, then return it
- Performance measurement with `console.time` / `console.timeEnd` to compare execution time between cache hits and misses
- Practical use: API response caching, database query results, expensive DOM computations, recursive algorithm optimization (e.g., Fibonacci)
