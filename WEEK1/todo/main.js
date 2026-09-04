// IIFE Module Pattern — creates private scope, returns public API
const TodoApp = (() => {
    // Closure — private state, inaccessible from outside
    let todos = [];
    let currentFilter = "all";
    let nextId = 1;

    // Set — tracks unique tags across all todos
    const tagRegistry = new Set();

    // Map — quick lookup of todo by ID
    const todoMap = new Map();

    // DOM Elements
    const todoInput = document.getElementById("todoInput");
    const addBtn = document.getElementById("addBtn");
    const todoList = document.getElementById("todoList");
    const todoCount = document.getElementById("todoCount");
    const clearCompletedBtn = document.getElementById("clearCompleted");
    const filterBtns = document.querySelectorAll(".filterBtn");

    // --- Rest Parameters — flexible tag input ---
    const createTodo = (...tags) => {
        const text = todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: nextId++,
            text,
            completed: false,
            tags: [...tags], // Spread — copy tags array immutably
            createdAt: new Date().toISOString(),
        };

        // Spread — add new todo without mutating original array
        todos = [...todos, todo];

        // Update Map and Set
        todoMap.set(todo.id, todo);
        tags.forEach((tag) => tagRegistry.add(tag));

        todoInput.value = "";
        render();
        debugLog();
    };

    // --- Arrow function for toggling ---
    const toggleTodo = (id) => {
        // Spread + map — immutable update
        todos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );

        // Update Map
        const updated = todoMap.get(id);
        if (updated) updated.completed = !updated.completed;

        render();
        debugLog();
    };

    // --- Arrow function for deleting ---
    const deleteTodo = (id) => {
        // Spread + filter — immutable removal
        todos = todos.filter((todo) => todo.id !== id);
        todoMap.delete(id);

        render();
        debugLog();
    };

    // --- Array.filter() — filter todos by status ---
    const getFilteredTodos = () => {
        if (currentFilter === "active") {
            return todos.filter((todo) => !todo.completed);
        }
        if (currentFilter === "completed") {
            return todos.filter((todo) => todo.completed);
        }
        return [...todos]; // Spread — return copy, not reference
    };

    // --- Set filter and re-render ---
    const setFilter = (filter) => {
        currentFilter = filter;

        // Update active button class
        filterBtns.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.filter === filter);
        });

        render();
    };

    // --- Clear completed todos ---
    const clearCompleted = () => {
        // Keep only active todos
        const activeTodos = todos.filter((todo) => !todo.completed);

        // Rebuild Map with only active todos
        todoMap.clear();
        activeTodos.forEach((todo) => todoMap.set(todo.id, todo));

        todos = activeTodos;
        render();
        debugLog();
    };

    // --- Render using Array.map() ---
    const render = () => {
        const filteredTodos = getFilteredTodos();

        todoList.innerHTML = filteredTodos
            .map(
                (todo) => `
            <li class="todoItem ${todo.completed ? "completed" : ""}">
                <input type="checkbox" class="todoCheckbox"
                    ${todo.completed ? "checked" : ""}
                    onchange="TodoApp.toggleTodo(${todo.id})">
                <span class="todoText">${todo.text}</span>
                ${todo.tags.map((tag) => `<span class="todoTag">${tag}</span>`).join("")}
                <button class="deleteBtn" onclick="TodoApp.deleteTodo(${todo.id})">Delete</button>
            </li>
        `
            )
            .join("");

        updateCount();
    };

    // --- Array.reduce() — count active todos ---
    const updateCount = () => {
        const activeCount = todos.reduce(
            (acc, todo) => (todo.completed ? acc : acc + 1),
            0
        );
        todoCount.textContent = `${activeCount} item${activeCount !== 1 ? "s" : ""} left`;
    };

    // --- console.table() for debugging ---
    const debugLog = () => {
        console.table(todos);
        console.log("Tag Registry (Set):", [...tagRegistry]);
        console.log("Todo Map size:", todoMap.size);
    };

    // Public API — returned from IIFE
    return {
        createTodo,
        toggleTodo,
        deleteTodo,
        setFilter,
        clearCompleted,
        render,
        debugLog,
    };
})();

// --- Event Listeners using Arrow Functions ---
document.getElementById("addBtn").addEventListener("click", () => {
    TodoApp.createTodo("general");
});

document.getElementById("todoInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") TodoApp.createTodo("general");
});

// --- Filter button event listeners ---
document.querySelectorAll(".filterBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
        TodoApp.setFilter(btn.dataset.filter);
    });
});

// --- Clear completed event listener ---
document.getElementById("clearCompleted").addEventListener("click", () => {
    TodoApp.clearCompleted();
});

// Initial render
TodoApp.render();
