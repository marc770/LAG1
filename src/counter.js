export function setupCounter(element) {
  let counter = 0;
  let log = [];

  const setCount = (count) => {
    const prev = counter;
    counter = count;
    log.push({ prev, next: counter });
    element.innerHTML = `count is ${counter}`;
  };

  element.addEventListener('click', () => setCount(counter + 1));
  setCount(0);

  return {
    getCount: () => counter,
    setCount,
    getLog: () => [...log],
    clearLog: () => { log = []; },
  };
}
