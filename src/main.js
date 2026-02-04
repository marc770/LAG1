import './style.css'
import klirrLogo from '/klirr.png'
import { counterHtml, setupCounter } from './counter.js'
import { noMissionHtml, setupNoMission } from './noMission.js'
import QRCode from 'qrcode'
import { BrowserQRCodeReader } from '@zxing/browser'


function missionHtml() {
    if (window.location.pathname === '/app.html') {    
        return counterHtml();
    } else {
        return noMissionHtml();
    }
}

document.querySelector('#app').innerHTML = `
  <div>
    <div class="tabs">
      <button class="tab-button active" data-tab="mission">Mission</button>
      <button id="log-tab" class="tab-button" data-tab="log">Log</button>
    </div>
      <div class="tab-content" id="tab-mission">
        <img src="${klirrLogo}" class="logo" alt="Klirr logo" />
        ${missionHtml()}
    </div>
    <div class="tab-content" id="tab-log" style="display:none;">
      <div class="card">
        <h2>Log</h2>
        <div id="logOutput">No log entries yet.</div>
      </div>
    </div>
    <div class="card qr-card">
      <div class="qr-actions">
        <button id="btnGenerate" type="button">Generate QR</button>
        <button id="btnCameraScan" type="button">Scan QR</button>
        <button id="btnClear" type="button">Clear</button>
      </div>
      <div id="qrPreview"></div>
      <img id="qrImg" alt="QR Code" class="qr-img" />
      <pre id="qrOutput" class="qr-output"></pre>
    </div>
  </div>
`

let missionApi;

if (window.location.pathname === '/app.html') {    
    missionApi = setupCounter();
} else {
    missionApi = setupNoMission();
}

// Tab switching logic
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('tab-button')) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    const tab = e.target.getAttribute('data-tab');
    document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
    document.getElementById('tab-' + tab).style.display = '';
  }
});

document.getElementById("log-tab").onclick = function(event) {
    renderClickLog();
}


// Helper to render the click log in the log tab
function renderClickLog() {
  const logDiv = document.getElementById('logOutput');
  const log = missionApi.getLog();
  if (!log.length) {
    logDiv.textContent = 'No log entries yet.';
    return;
  }
  logDiv.innerHTML = log.map((entry, i) => `#${i + 1}: ssn: ${entry.ssn}, user: ${entry.user}`).join('<br>');
}

const btnGenerate = document.getElementById('btnGenerate')
const btnClear = document.getElementById('btnClear')
const qrImg = document.getElementById('qrImg')
const qrOutput = document.getElementById('qrOutput')

qrImg.style.display = 'none'
qrOutput.style.display = 'none'

function buildPayload() {
  return {
    type: 'HelloPWA',
    version: 1,
    createdAt: new Date().toISOString(),
    url: window.location.href,

    counter: missionApi.getCount(),
    log: missionApi.getLog(),

    settings: { darkMode: true, volume: 0.8 },
    tags: ['pwa', 'vite', 'qrcode'],
  };
}

btnGenerate.addEventListener('click', async () => {
  stopCameraScan()
  const payload = buildPayload()
  const text = `HELLOPWA:${JSON.stringify(payload)}`
  // show what we are encoding
  qrOutput.textContent = text
  qrOutput.style.display = 'block'

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 240,
    })

    qrImg.src = dataUrl
    qrImg.style.display = 'block'
  } catch (err) {
    console.error(err)
  }
})

btnClear.addEventListener('click', () => {
  stopCameraScan()
  qrImg.src = ''
  qrImg.style.display = 'none'
  qrOutput.textContent = ''
  qrOutput.style.display = 'none'
})

// --- CAMERA SCAN (auto-stop + reuse handleDecodedQR) ---
const btnCameraScan = document.getElementById('btnCameraScan')
const qrPreview = document.getElementById('qrPreview')

let cameraReader = null
let cameraStream = null
let cameraVideoEl = null
let cameraActive = false

function stopCameraScan() {
  cameraActive = false
  try { cameraReader?.reset?.() } catch (_) {}

  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop())
    cameraStream = null
  }

  if (cameraVideoEl) {
    cameraVideoEl.pause?.()
    cameraVideoEl.srcObject = null
    cameraVideoEl.remove()
    cameraVideoEl = null
  }
  qrPreview.innerHTML = ''
  btnCameraScan.textContent = 'Scan QR'
}


async function startCameraScan() {

  qrImg.style.display = 'none'
  qrOutput.style.display = 'none'

  if (cameraActive) return
  cameraActive = true
  btnCameraScan.textContent = 'Stop scanning'

  try {
    cameraReader = new BrowserQRCodeReader()

    // Create video element inside preview area
    cameraVideoEl = document.createElement('video')
    cameraVideoEl.setAttribute('playsinline', 'true')
    cameraVideoEl.style.width = '240px'
    cameraVideoEl.style.marginTop = '10px'
    qrPreview.innerHTML = ''
    qrPreview.appendChild(cameraVideoEl)

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    })
    cameraVideoEl.srcObject = cameraStream
    await cameraVideoEl.play()

    const result = await cameraReader.decodeOnceFromVideoElement(cameraVideoEl)
    const decodedText = result.getText()

    console.log('QR scanned:', decodedText)
    handleDecodedQR(decodedText)

    stopCameraScan()
  } catch (err) {
    console.error('Camera scan failed:', err)
    qrOutput.textContent = `Camera scan failed: ${String(err)}`
    qrOutput.style.display = 'block'
    stopCameraScan()
  }
}

btnCameraScan?.addEventListener('click', () => {
  if (cameraActive) stopCameraScan()
  else startCameraScan()
})

function handleDecodedQR(decodedText) {
  const prefix = 'HELLOPWA:'
  qrOutput.style.display = 'block'

  if (decodedText.startsWith(prefix)) {
    const jsonText = decodedText.slice(prefix.length)
    try {
      const obj = JSON.parse(jsonText)
      console.log('Decoded JSON:', obj)

      missionApi.setCount(obj.counter || missionApi.getCount())
      missionApi.setLog(obj.log || missionApi.getLog())
      renderClickLog();
      qrOutput.textContent = JSON.stringify(obj, null, 2)
      return
    } catch (err) {
      console.error('JSON parse error:', err)
    }
  }

  // fallback raw
  console.log('Decoded text:', decodedText)
  qrOutput.textContent = decodedText
}