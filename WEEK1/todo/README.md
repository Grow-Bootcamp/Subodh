# Todo App — GrowBootcamp Week 1

A simple todo application built with vanilla HTML, CSS, and JavaScript.
No frameworks, no libraries — just pure JS fundamentals.

---

## Live Demo

Open `index.html` in any browser to run the app.

---

## Features

| Feature           | Description                                    |
|-------------------|------------------------------------------------|
| Add Todo          | Type a task, press Enter or click Add          |
| Toggle Complete   | Click checkbox to mark done or undone          |
| Delete Todo       | Click Delete button to remove                  |
| Filter            | View All, Active, or Completed todos           |
| Clear Completed   | Remove all finished todos at once              |
| Persistence       | Todos survive page refresh via localStorage    |

---

## Project Structure

```
WEEK1/todo/
├── index.html    → HTML structure
├── style.css     → Styling
└── main.js       → All logic
```

---

## JS Concepts Used

| Concept            | Location        | Purpose                               |
|--------------------|-----------------|---------------------------------------|
| IIFE               | Line 2, 204     | Private scope for module              |
| Closures           | Line 3-6        | Keep state private                    |
| Arrow Functions    | Throughout      | Concise callbacks and handlers        |
| Spread Operator    | Line 81, 96     | Immutable array and object updates    |
| Array.map()        | Line 95, 162    | Transform todos into HTML strings     |
| Array.filter()     | Line 111, 122   | Remove or filter todos by condition   |
| Array.reduce()     | Line 180        | Count active todos                    |
| Map                | Line 9, 84      | Fast O(1) lookup by todo ID           |
| localStorage       | Line 18, 27     | Persist data across page refreshes    |
| try/catch          | Line 16-21      | Handle storage errors gracefully      |
| JSON.stringify     | Line 18         | Convert objects to storage strings    |
| JSON.parse         | Line 30         | Convert stored strings back           |
| console.table      | Line 189        | Debug output in tabular format        |

---

## How It Works — Step by Step

### 1. App Starts

```
Browser loads index.html + main.js
        │
        ▼
IIFE executes → creates TodoApp object
        │
        ▼
Event listeners are wired up
        │
        ▼
loadFromLocalStorage() → loads saved data
        │
        ▼
render() → displays todos on screen
        │
        ▼
App is now IDLE, waiting for user
```

### 2. User Adds a Todo

```
User types "Buy milk" → presses Enter
        │
        ▼
createTodo() reads input value
        │
        ▼
Creates todo object with id, text, completed, createdAt
        │
        ▼
Adds to todos array and todoMap
        │
        ▼
Saves to localStorage → renders HTML → logs to console
```

### 3. User Toggles a Todo

```
User clicks checkbox on todo #2
        │
        ▼
toggleTodo(2) loops through todos with .map()
        │
        ├─ ID !== 2 → keep as-is
        │
        └─ ID === 2 → spread and flip completed
        │
        ▼
New array replaces old → save → render → debug
```

### 4. User Deletes a Todo

```
User clicks Delete on todo #3
        │
        ▼
deleteTodo(3) uses .filter() to remove it
        │
        ▼
todos.filter(t => t.id !== 3) → keeps others
        │
        ▼
Removes from Map → save → render → debug
```

### 5. User Filters Todos

```
User clicks "Active" button
        │
        ▼
setFilter("active") updates currentFilter
        │
        ▼
Highlight active button with classList.toggle()
        │
        ▼
render() calls getFilteredTodos()
        │
        ▼
filters: todos.filter(t => !t.completed)
        │
        ▼
Only active todos shown on screen
```

---

## Dependency Chain

Each layer builds on the one below it.
Remove any layer and the layers above break.

### Layer 1 → Layer 2 → Layer 3,4,5 → Layer 6 → Layer 7,8,9,10 → Layer 11 → Layer 12 → Layer 13 → Layer 14

| Layer | Name                | What It Does                          | Depends On      |
|-------|---------------------|---------------------------------------|-----------------|
| 1     | IIFE                | Creates private scope                 | Nothing         |
| 2     | Private State       | todos, currentFilter, nextId          | Layer 1         |
| 3     | Todo Object         | Data structure: id, text, completed   | Layer 2         |
| 4     | Map                 | Fast O(1) lookup by todo ID           | Layer 2         |
| 5     | localStorage        | Persists data across refreshes        | Layer 2         |
| 6     | DOM References      | Cached HTML element references        | Layer 1         |
| 7     | Create Todo         | Reads input, adds to array and map    | 2, 3, 4, 5, 6  |
| 8     | Toggle Todo         | Flips completed status                | 2, 4, 5, 6     |
| 9     | Delete Todo         | Removes from array and map            | 2, 4, 5, 6     |
| 10    | Filter              | Filters todos by status               | 2, 6            |
| 11    | Render              | Converts data to HTML                 | 6, 10, 12       |
| 12    | Update Count        | Counts active todos with reduce       | 2, 6            |
| 13    | Event Listeners     | Connects UI clicks to methods         | 1               |
| 14    | Initialization      | Loads data and renders on startup     | 5, 11           |

### Visual Flow

```
Layer 1: IIFE
    │
Layer 2: Private State
    │
    ├──→ Layer 3: Todo Object
    ├──→ Layer 4: Map
    └──→ Layer 5: localStorage
              │
Layer 6: DOM References
    │
    ├──→ Layer 7:  Create Todo
    ├──→ Layer 8:  Toggle Todo
    ├──→ Layer 9:  Delete Todo
    └──→ Layer 10: Filter
              │
Layer 11: Render
    │
Layer 12: Update Count
    │
Layer 13: Event Listeners
    │
Layer 14: Initialization
```

---

## Quick Reference

| Action        | Method Called          | Array Method           |
|---------------|------------------------|------------------------|
| Add todo      | createTodo()           | Spread [...]           |
| Toggle        | toggleTodo(id)         | .map() + spread {...}  |
| Delete        | deleteTodo(id)         | .filter()              |
| Filter        | setFilter(filter)      | .filter()              |
| Clear done    | clearCompleted()       | .filter()              |
| Count         | updateCount()          | .reduce()              |
| Display       | render()               | .map() + .join("")     |
| Save          | saveToLocalStorage()   | JSON.stringify()       |
| Load          | loadFromLocalStorage() | JSON.parse()           |
