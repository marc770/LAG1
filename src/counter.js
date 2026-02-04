export function counterHtml() {
  const missionHtml = `  
        <h1>Inräknad!</h1>
  
        <div class="card">
          <div>
            <label>Social security number:</label>
          </div>
          <div>
            <input type="text" id="ssnInput" />
            <button id="counter" type="button">Add</button>
          </div>
          <div>
            <textarea id="debugOutput" class="debug-output" readonly></textarea>
          </div>
        </div>`
        return missionHtml;
}

export function setupCounter() {
  
  const element = document.querySelector('#counter');
  const ssnInput = document.getElementById('ssnInput');
  const debugOutput = document.getElementById('debugOutput');

  let counter = 0;
  let log = [];
  const logId = crypto.randomUUID();
  let ssn = ssnInput;
  let area = debugOutput;

  // Sanitize user input to prevent XSS
  function sanitize(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const setCount = (count) => {
    area.value += sanitize(ssn.value) + '\n';
    log.push({ ssn: sanitize(ssn.value), user: sanitize(logId) });
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
