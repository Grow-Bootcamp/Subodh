# Week 7 Day 5 — React Forms and Performance

## Topics studied

- Controlled forms and custom validation
- Multi-step forms and state retention
- Memoization with React.memo
- Lazy loading, Suspense, and code splitting

## Project implemented

Workshop Registration Wizard using React + TypeScript + Vite.

## Key learnings

- Controlled inputs use state as the source of truth.
- Validation can be scoped to the current step and show field-specific errors.
- Keeping form data in a parent component preserves it as steps switch.
- React.memo can skip renders when props are unchanged; it is an optimization, not a guarantee.
- lazy() and Suspense load the review component on demand.
- Optimization should be guided by measurement rather than added everywhere.
