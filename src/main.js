import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import QRCode from 'qrcode'
import { BrowserQRCodeReader } from '@zxing/browser'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>

    <h1>Hello Vite!</h1>

    <div class="card">
      <button id="counter" type="button"></button>
    </div>


    <div class="card qr-card">
      <div class="qr-actions">
        <button id="btnGenerate" type="button">Generate QR</button>
        <button id="btnDecode" type="button">Decode QR</button>

        <!-- ✅ ADD THIS -->
        <button id="btnCameraScan" type="button">Scan with camera</button>

        <button id="btnClear" type="button">Clear</button>
      </div>

      <!-- ✅ OPTIONAL: where video preview will go -->
      <div id="qrPreview"></div>

      <img id="qrImg" alt="QR Code" class="qr-img" />
      <pre id="qrOutput" class="qr-output"></pre>
    </div>


    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

const counterApi = setupCounter(document.querySelector('#counter'))


const btnGenerate = document.getElementById('btnGenerate')
const btnDecode = document.getElementById('btnDecode')
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

    counter: counterApi.getCount(),

    settings: { darkMode: true, volume: 0.8 },
    tags: ['pwa', 'vite', 'qrcode'],
  }
}

btnGenerate.addEventListener('click', async () => {
  const payload = buildPayload()

  // Add a prefix so we can validate it's ours
  const text = `HELLOPWA:${JSON.stringify(payload)}`

  // EASY INSPECTION: show what we are encoding
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

btnDecode.addEventListener('click', async () => {
  if (!qrImg.src) return

  try {
    const reader = new BrowserQRCodeReader()

    // Decode from the <img> element:
    const result = await reader.decodeFromImageElement(qrImg)
    const decodedText = result.getText()

    // Show raw decoded text
    qrOutput.textContent = decodedText
    qrOutput.style.display = 'block'

    // If it has our prefix, parse as JSON:
    const prefix = 'HELLOPWA:'
    if (decodedText.startsWith(prefix)) {
      const jsonText = decodedText.slice(prefix.length)
      const obj = JSON.parse(jsonText)

      // Prettify JSON for inspection:
      qrOutput.textContent = JSON.stringify(obj, null, 2)
    }
  } catch (err) {
    console.error('Decode failed:', err)
    qrOutput.textContent = `Decode failed: ${String(err)}`
    qrOutput.style.display = 'block'
  }
})

btnClear.addEventListener('click', () => {
  qrImg.src = ''
  qrImg.style.display = 'none'
  qrOutput.textContent = ''
  qrOutput.style.display = 'none'
})

// --- CAMERA SCAN ---
const btnCameraScan = document.getElementById('btnCameraScan')
const qrPreview = document.getElementById('qrPreview')

btnCameraScan?.addEventListener('click', async () => {
  let stream = null
  let videoEl = null

  try {
    const reader = new BrowserQRCodeReader()

    // Create and mount a video element in the card (not body)
    videoEl = document.createElement('video')
    videoEl.setAttribute('playsinline', 'true') // helps on iOS
    videoEl.style.width = '240px'
    videoEl.style.marginTop = '10px'
    qrPreview.appendChild(videoEl)

    // Ask for camera and attach stream manually so we can stop it
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    videoEl.srcObject = stream
    await videoEl.play()

    // Decode once from the video element
    const result = await reader.decodeOnceFromVideoElement(videoEl)
    const decodedText = result.getText()

    console.log('QR scanned:', decodedText)
    handleDecodedQR(decodedText)
  } catch (err) {
    console.error('Camera scan failed:', err)
    qrOutput.textContent = `Camera scan failed: ${String(err)}`
    qrOutput.style.display = 'block'
  } finally {
    // Stop camera
    if (stream) stream.getTracks().forEach(t => t.stop())
    if (videoEl) videoEl.remove()
  }
})

// --- PASTE QR IMAGE HANDLER ---
// Paste a QR image anywhere in the page (Ctrl+V / Cmd+V)
window.addEventListener('paste', (event) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (!item.type.startsWith('image/')) continue

    const blob = item.getAsFile()
    if (!blob) return

    const img = new Image()
    img.onload = async () => {
      try {
        const reader = new BrowserQRCodeReader()

        // ✅ robust: decode from an <img> element
        const result = await reader.decodeFromImageElement(img)
        const decodedText = result.getText()

        console.log('Pasted QR:', decodedText)
        handleDecodedQR(decodedText)
      } catch (err) {
        console.error('Failed to decode pasted QR:', err)
        qrOutput.textContent = `Paste decode failed: ${String(err)}`
        qrOutput.style.display = 'block'
      } finally {
        URL.revokeObjectURL(img.src)
      }
    }

    img.src = URL.createObjectURL(blob)
    return
  }
})

// --- COMMON HANDLER FOR ANY DECODE ---
function handleDecodedQR(decodedText) {
  const prefix = 'HELLOPWA:'
  qrOutput.style.display = 'block'

  // Always show the raw value somewhere first (optional)
  // qrOutput.textContent = decodedText

  if (decodedText.startsWith(prefix)) {
    const jsonText = decodedText.slice(prefix.length)
    try {
      const obj = JSON.parse(jsonText)
      console.log('Decoded JSON:', obj) // ✅ this is what you wanted

      counterApi.setCount(obj.counter || counterApi.getCount()  )
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