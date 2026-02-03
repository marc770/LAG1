export function setupCounter(element, ssnInput, debugOutput) {
  let counter = 0;
  let log = [];
  const logId = crypto.randomUUID();
  let ssn = ssnInput;
  let area = debugOutput;

  const setCount = (count) => {
    area.value += ssn.value + '\n';
    log.push({ ssn: ssn.value, user: logId });
  };

   const setLog = (newLog) => {
    log = newLog;
  };

  element.addEventListener('click', () => setCount(counter + 1));

  return {
    getCount: () => counter,
    setCount,
    getLog: () => [...log],
    setLog,
  };
}
