# TypeScript Demo

Basic TypeScript project demonstrating the four pillars: **Types**, **Interfaces**, **Functions**, and **Generics**.

## Setup

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Run the project
npm start

# Or do both at once
npm run dev
```

## Project Structure

```
typescript-demo/
├── src/
│   ├── types.ts        # Basic type annotations
│   ├── interfaces.ts   # Interface definitions
│   ├── functions.ts    # Function types
│   ├── generics.ts     # Generic components
│   └── main.ts         # Entry point
├── dist/               # Compiled JavaScript (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## What You'll Learn

### 1. Types (`src/types.ts`)
- Primitive types (string, number, boolean)
- Array types
- Tuple types
- Enum types
- Union types
- Type aliases

### 2. Interfaces (`src/interfaces.ts`)
- Basic interfaces
- Optional properties
- Readonly properties
- Extending interfaces
- Function type interfaces

### 3. Functions (`src/functions.ts`)
- Function declarations with types
- Arrow functions
- Optional and default parameters
- Rest parameters
- Type annotations

### 4. Generics (`src/generics.ts`)
- Generic functions
- Generic classes
- Generic interfaces
- Type constraints

## Quick Reference

```typescript
// Types
let name: string = "John";
let numbers: number[] = [1, 2, 3];
let id: string | number = "abc";

// Interfaces
interface User {
  name: string;
  age: number;
  email?: string;  // Optional
}

// Functions
function add(a: number, b: number): number {
  return a + b;
}

// Generics
function identity<T>(value: T): T {
  return value;
}
```
