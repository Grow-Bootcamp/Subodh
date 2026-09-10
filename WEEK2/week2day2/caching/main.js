const memoization = function (fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    // Start the timer using the argument key as the unique label
    console.time(`Execution Time for args ${key}`);

    if (cache.has(key)) {
      console.log(`[Cache Hit] Fetching result from memory...`);
      const cachedResult = cache.get(key);
      console.timeEnd(`Execution Time for args ${key}`); //Stop timer
      return cachedResult;
    }

    console.log(`[Cache Missed] Running expensive calculation...`);
    const result = fn(...args);
    cache.set(key, result);
    console.timeEnd(`Execution Time for args ${key}`); //Stop timer
    return result;
  };
};

const slowProcess = (n) => {
  for (let i = 0; i < 1e12; i++); // Artificial delay
  return n * n;
};
const fastProcess = memoization(slowProcess);
console.log("Result:", fastProcess(1000));
console.log("Result:", fastProcess(1000));
