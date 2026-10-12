import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section className="counter">
      <p className="counter__value">Count: {count}</p>
      <div className="counter__buttons">
        <button type="button" onClick={() => setCount(count + 1)}>
          Increment
        </button>
        <button type="button" onClick={() => setCount(count - 1)}>
          Decrement
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </section>
  );
}

export default Counter;
