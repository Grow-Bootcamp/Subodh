# Week 2 Day 3 – Testing with Jest, Supertest & TypeScript

Built a TypeScript REST API with Express v5 and learned how to write both unit tests and integration tests. Covered testing pure utility functions with Jest, testing HTTP endpoints with Supertest, and structuring a typed Express application with proper separation of concerns.

---

## Topics Implemented

### 1. Express.js REST API with TypeScript

Built a REST API using Express v5 with fully typed route handlers. The API has three endpoints demonstrating different response patterns:

- **GET /health** – Simple health check returning `{ status: "ok" }`. Used to verify the server is running.
- **GET /api/users** – Returns all users wrapped in an API response envelope `{ success: true, data: [...] }`.
- **GET /api/users/:id** – Looks up a user by ID from a route parameter. Returns the matched user or a 404 error.

Route handlers use typed `Request` and `Response` from Express for type safety:

```ts
app.get("/api/users/:id", (req: Request, res: Response) => {
  const user = users.find((u) => u.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ success: false, error: "Not found" });
  }

  res.json({ success: true, data: user });
});
```

The `app` is exported separately from the server startup in `server.ts`:

```ts
import app from "./app.js";

app.listen(3000, () => {
  console.log("Server listening on 3000 port");
});
```

This separation is important because testing tools like Supertest need to import the app directly without actually starting a listener on a port.

### 2. TypeScript Interfaces for Data Modeling

Used TypeScript interfaces to define the shape of data objects. The `User` interface ensures every user in the data store has consistent fields:

```ts
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];
```

- Interfaces enforce that every object in the array matches the defined shape
- If a field is missing or has the wrong type, TypeScript catches it at compile time
- In real-world projects, interfaces model database tables, API request/response bodies, and component props

### 3. String Utility Functions

Two pure utility functions demonstrating common patterns in TypeScript:

**capitalize()** – Capitalizes the first letter of each word in a string. Uses `split()` to break into words, `map()` to process each word, and `join()` to recombine:

```ts
function capitalize(str: string): string {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
```

- Guard clause (`if (!str) return ''`) handles empty or undefined input
- `charAt(0).toUpperCase()` capitalizes the first character
- `slice(1).toLowerCase()` lowercases the rest of the word
- `split(' ').map(...).join(' ')` processes each word independently

**slugify()** – Converts a string to a URL-friendly slug. Uses method chaining to transform text step by step:

```ts
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

- `toLowerCase()` normalizes to lowercase
- `trim()` removes leading/trailing whitespace
- First `replace()` swaps any non-alphanumeric characters for hyphens
- Second `replace()` strips leading/trailing hyphens
- Method chaining makes the transformation pipeline readable

### 4. Unit Testing with Jest

Unit tests verify that pure functions return expected outputs for given inputs. Tests are organized with nested `describe` blocks and use `expect().toBe()` for exact value matching:

```ts
import { capitalize, slugify } from "./stringUtils.js";

describe("UserInputTest", () => {
  describe("CapitalizeTest", () => {
    test("returns capital letter for single word", () => {
      const userName: string = capitalize("subodh");
      expect(userName).toBe("Subodh");
    });
    test("returns capital letter for single word with special characters", () => {
      const userName: string = capitalize("subodh-shah");
      expect(userName).toBe("Subodh-shah");
    });
    test("returns capital letter for multiple words", () => {
      const userName: string = capitalize("subodh shah");
      expect(userName).toBe("Subodh Shah");
    });
  });
  describe("SlugifyTest", () => {
    test("returns slugify string for two words", () => {
      const slugifyStr: string = slugify("Subodh Shah");
      expect(slugifyStr).toBe("subodh-shah");
    });
    test("returns slugify string for multiple words", () => {
      const slugifyStr: string = slugify(
        "Subodh Shah is programming right now",
      );
      expect(slugifyStr).toBe("subodh-shah-is-programming-right-now");
    });
  });
});
```

- `describe()` groups related tests under a common name
- `test()` (or `it()`) defines a single test case with a descriptive name
- `expect(value).toBe(expected)` asserts strict equality (`===`)
- Unit tests run fast because they test pure logic with no network or file I/O

### 5. Integration Testing with Supertest

Supertest lets you test Express endpoints by making HTTP requests against the app without starting a real server. This is faster and more reliable than testing against a running instance:

```ts
import request from "supertest";
import app from "./app.js";

describe("Users API", () => {
  describe("GET /health", () => {
    it("responds with 200 and status ok", async () => {
      const { status, body } = await request(app).get("/health");

      expect(status).toBe(200);
      expect(body).toEqual({ status: "ok" });
    });
  });
});
```

**Partial matching with toMatchObject** – Useful when you want to check the shape of a response without asserting every field:

```ts
it("returns a successful response with a list of users", async () => {
  const { status, body } = await request(app).get("/api/users");

  expect(status).toBe(200);
  expect(body).toMatchObject({
    success: true,
    data: expect.any(Array),
  });
  expect(body.data.length).toBeGreaterThan(0);
});
```

**Structural type assertions** – Verify the shape of individual objects without strict equality:

```ts
it("returns users with the expected shape", async () => {
  const { body } = await request(app).get("/api/users");

  expect(body.data[0]).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
    }),
  );
});
```

**Testing error cases** – Verify that the API returns correct status codes and error payloads:

```ts
it("returns 404 with an error when the id does not exist", async () => {
  const { status, body } = await request(app).get("/api/users/999");

  expect(status).toBe(404);
  expect(body).toEqual({
    success: false,
    error: "Not found",
  });
});
```

- `toMatchObject()` checks that the response contains at least the specified fields
- `expect.any(Type)` matches any value of the given type
- `expect.objectContaining()` matches an object that has the specified properties
- Supertest handles request/response plumbing so tests stay focused on assertions

### 6. API Response Envelope Pattern

Used a consistent response format across all endpoints. Every response includes a `success` boolean and either `data` or `error`:

**Success response:**
```ts
res.json({ success: true, data: users });
// or for a single item:
res.json({ success: true, data: user });
```

**Error response:**
```ts
res.status(404).json({ success: false, error: "Not found" });
```

- The envelope pattern gives the frontend a predictable structure to work with
- `success` makes it easy to branch on whether the request succeeded
- `data` contains the payload on success, `error` contains the message on failure
- This is a common pattern in production APIs (similar to JSON:API or JSend)

---

## Difficulties Faced

### 1. capitalize() test failures

The original `capitalize()` function only capitalized the first character of the entire string:

```ts
// Original - only capitalizes first char of entire string
function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
```

Tests expected multi-word capitalization (`"subodh shah"` → `"Subodh Shah"`), but the function returned `"Subodh shah"`. Had to rewrite using `split(' ').map(...).join(' ')` to process each word independently. Also discovered that the test for `"subodh-shah"` expecting `"Subodh Shah"` was incorrect — `capitalize()` handles space-separated words, not hyphens. Corrected the expectation to `"Subodh-shah"`.

### 2. Migrating app.listen() from app.ts to server.ts

Initially the Express app and server startup were in the same file. When trying to test with Supertest, importing the file would start a listener on port 3000, causing port conflicts during tests. The fix was separating concerns:

- `app.ts` – Creates and configures the Express app, exports it as default
- `server.ts` – Imports the app and starts the listener

This pattern allows Supertest to import `app` directly without triggering `app.listen()`, keeping tests clean and avoiding port collisions.

### 3. Jest + ESM + TypeScript configuration

Getting Jest to work with ES Modules and TypeScript required aligning multiple pieces:

- `NODE_OPTIONS='--experimental-vm-modules'` flag in the test script (Jest needs this for ESM support)
- `ts-jest/presets/default-esm` preset in jest.config.ts
- `extensionsToTreatAsEsm: ['.ts']` to tell Jest to treat TypeScript files as ESM
- `moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' }` to resolve `.js` extensions in imports back to extensionless TypeScript files

Without all four pieces in place, tests would fail with module resolution errors. This was the most time-consuming configuration hurdle.

### 4. toMatchObject vs toEqual confusion

Initially used `toEqual()` for all assertions, which requires an exact match. When the API response included extra fields or nested structures, tests failed unnecessarily. Learned that:

- `toEqual()` – Strict equality, every field must match exactly
- `toMatchObject()` – Partial matching, only checks that the specified fields exist
- `expect.any(Type)` – Matches any value of that type
- `expect.objectContaining()` – Matches objects with specific properties

This distinction is critical for testing APIs where responses may include timestamps, metadata, or other fields that aren't relevant to the test.

---

## Areas for Improvement

- **Add CRUD endpoints** – Currently only GET routes exist. Adding POST, PUT, DELETE would make the API functional for real use cases
- **Input validation** – The `:id` route parameter accepts any string, including non-numeric values that produce `NaN`. Should validate with `parseInt()` or a middleware
- **Error handling middleware** – No global error handler. Unhandled errors will crash the server or return raw error messages to the client
- **Move supertest to devDependencies** – It's only used for testing, not in production
- **Environment variable for port** – `server.ts` hardcodes port 3000. Should use `process.env.PORT || 3000`
- **Edge case tests** – Missing tests for empty strings, non-numeric IDs, negative numbers, and unicode characters
- **Test coverage thresholds** – No minimum coverage configured in Jest, so tests could silently miss critical paths
