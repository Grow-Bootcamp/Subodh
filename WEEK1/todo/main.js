// IIFE Module Pattern — creates private scope, returns public API
const TodoApp = (() => {
    // Closure — private state, inaccessible from outside
    let todos = [];
    let currentFilter = "all";
    let nextId = 1;

    // --- localStorage key ---
    const STORAGE_KEY = "todoAppData";

    // --- Save to localStorage ---
    const saveToLocalStorage = () => {
        try {
            const data = { todos, nextId };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save to localStorage:", e.message);
        }
    };

    // --- Load from localStorage with try/catch error handling ---
    const loadFromLocalStorage = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;

            const data = JSON.parse(raw);

            // Validate loaded data
            if (!Array.isArray(data.todos)) {
                throw new TypeError("Invalid todos data in localStorage");
            }

            todos = data.todos;
            nextId = data.nextId || 1;

            console.log("Loaded from localStorage:", todos.length, "todos");
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.error("JSON parse error:", e.message);
            } else if (e instanceof TypeError) {
                console.error("Type error:", e.message);
            } else {
                console.error("Error loading from localStorage:", e.message);
            }
            // Reset corrupted data
            todos = [];
            nextId = 1;
        }
    };

    // DOM Elements
    const todoInput = document.getElementById("todoInput");
    const addBtn = document.getElementById("addBtn");
    const todoList = document.getElementById("todoList");
    const todoCount = document.getElementById("todoCount");
    const clearCompletedBtn = document.getElementById("clearCompleted");
    const filterBtns = document.querySelectorAll(".filterBtn");

    // --- Create a new todo ---
    const createTodo = () => {
        const text = todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: nextId++,
            text,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        // Spread — add new todo without mutating original array
        todos = [...todos, todo];

        todoInput.value = "";
        saveToLocalStorage();
        render();
        debugLog();
    };

    // --- Arrow function for toggling ---
    const toggleTodo = (id) => {
        // Spread + map — immutable update
        todos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );

        saveToLocalStorage(); // Persist after toggle
        render();
        debugLog();
    };

    // --- Arrow function for deleting ---
    const deleteTodo = (id) => {
        // Spread + filter — immutable removal
        todos = todos.filter((todo) => todo.id !== id);

        saveToLocalStorage(); // Persist after delete
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
        todos = todos.filter((todo) => !todo.completed);

        saveToLocalStorage(); // Persist after clear completed
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
    };

    // Public API — returned from IIFE
    return {
        createTodo,
        toggleTodo,
        deleteTodo,
        setFilter,
        clearCompleted,
        loadFromLocalStorage,
        render,
        debugLog,
    };
})();

// --- Event Listeners using Arrow Functions ---
document.getElementById("addBtn").addEventListener("click", () => {
    TodoApp.createTodo();
});

document.getElementById("todoInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") TodoApp.createTodo();
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

// --- Load saved data and initial render ---
TodoApp.loadFromLocalStorage();
TodoApp.render();
