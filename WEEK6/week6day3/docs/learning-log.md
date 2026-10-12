# React Fundamentals Learning Log

Week 6, Day 3 — Student Profile Card exercise. All notes reference the code in
this project.

## JSX

JSX is a syntax extension that looks like HTML but is transformed into
JavaScript function calls before the code runs. For example, in
`src/components/StudentCard.tsx`:

```tsx
<h2 className="card__name">{name}</h2>
```

The build toolchain transforms this into a call to the JSX runtime provided by
React — conceptually:

```js
jsx('h2', { className: 'card__name', children: name });
```

The result is a plain JavaScript object (a "React element") describing what
should appear on screen. Note that JSX uses `className` instead of `class`,
because `class` is a reserved word in JavaScript.

## Functional components

Each component in this app is a function that returns JSX:

- `App` (`src/App.tsx`) — the top-level page. It composes everything else:
  the heading, `<StudentCard />`, and `<Counter />`.
- `StudentCard` (`src/components/StudentCard.tsx`) — receives props and
  renders the student's name and role.
- `Counter` (`src/components/Counter.tsx`) — holds a `useState` counter and
  three buttons.

React renders a component by calling the function and using the returned JSX
as the description of that part of the UI.

## Props

Props are the inputs a parent component passes to a child. In `App`:

```tsx
<StudentCard name="Aarav Sharma" role="Frontend Development Intern" />
```

`StudentCard` declares and reads them:

```tsx
type StudentCardProps = {
  name: string;
  role: string;
};

function StudentCard({ name, role }: StudentCardProps) { ... }
```

`name` and `role` are ordinary function parameters, so the card is reusable —
change the values in `App` and the rendered card changes, while
`StudentCard` itself stays the same.

## State

State is data a component owns and can change over time. In `Counter`:

```tsx
const [count, setCount] = useState(0);
```

`useState(0)` returns the current value (`count`) and a function to update it
(`setCount`). The buttons update it:

```tsx
<button onClick={() => setCount(count + 1)}>Increment</button>
<button onClick={() => setCount(count - 1)}>Decrement</button>
<button onClick={() => setCount(0)}>Reset</button>
```

Calling `setCount` with a new value schedules a re-render: React calls
`Counter` again with the new `count`, and the updated JSX is reflected in the
DOM. The state is local to `Counter` — nothing outside it needs to know about
the count.

## Props vs State

| | Props | State |
| --- | --- | --- |
| Who controls it | The parent component | The component itself |
| Can the owner change it? | No — props are read-only for the child | Yes, through the setter from `useState` |
| Used for | Passing data down (e.g. `name`, `role`) | Data that changes over time (e.g. `count`) |
| In this project | `StudentCard` receives `name` and `role` | `Counter` owns `count` |

## Key takeaways

- JSX compiles to JavaScript function calls that return React elements.
- Functional components are plain functions: `App` composes `StudentCard`
  and `Counter`.
- Props make components reusable — `StudentCard` renders whatever the parent
  passes in.
- `useState` gives a component local state; updating it triggers a re-render
  with the new value.
- Props flow down from parent to child; state stays inside the component that
  owns it.
