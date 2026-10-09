# Student Profile Card

A minimal React + TypeScript exercise demonstrating the React fundamentals:
JSX, functional components, props, and state (`useState`).

## Setup

```bash
npm install
```

## Run

```bash
npm run dev        # start dev server (http://localhost:5173)
npm run build      # typecheck + production build
npm run preview    # serve the production build
npm run typecheck  # TypeScript check only
```

## Components

| Component | File | Purpose |
| --- | --- | --- |
| `App` | `src/App.tsx` | Renders the page heading, a `StudentCard` with sample data, and the `Counter`. |
| `StudentCard` | `src/components/StudentCard.tsx` | Reusable card that displays the `name` and `role` props it receives. |
| `Counter` | `src/components/Counter.tsx` | Local counter with Increment, Decrement, and Reset buttons, powered by `useState`. |

## React concepts demonstrated

- **JSX** — HTML-like syntax used to describe UI in `App`, `StudentCard`, and `Counter`.
- **Functional components** — each component is a plain function that returns JSX.
- **Props** — `App` passes `name` and `role` into `StudentCard`; the card renders whatever it receives.
- **State** — `Counter` keeps a `count` value with `useState`; clicking a button updates it and re-renders the component.

See `docs/learning-log.md` for detailed notes on each concept.
