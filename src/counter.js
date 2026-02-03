export function setupCounter(element, ssnInput, debugOutput) {
  let counter = 0;
  let log = [];
  const logId = crypto.randomUUID();
  let ssn = ssnInput;
  let area = debugOutput;

  const setCount = (count) => {
    element.innerHTML = `add`;
    // if (prev === 0 && counter === 0) return; // Skip logging initial state
    area.value += ssn.value + '\n';
    log.push({ ssn: ssn.value, user: logId });
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
