export function setupCounter(element) {
  let counter = 0;
  let log = [];
  const logId = crypto.randomUUID();

  const setCount = (count) => {
    const prev = counter;
    counter = count;
    element.innerHTML = `count is ${counter}`;
    if (prev === 0 && counter === 0) return; // Skip logging initial state
    log.push({ prev, next: counter, user: logId });
  };

   const setLog = (newLog) => {
    log = newLog;
  };

  element.addEventListener('click', () => setCount(counter + 1));
  setCount(0);

  return {
    getCount: () => counter,
    setCount,
    getLog: () => [...log],
    setLog,
  };
}
