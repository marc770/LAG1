import './style.css'
import klirrLogo from '/klirr.png'

document.querySelector('#app').innerHTML = `
  <div>
    <img src="${klirrLogo}" class="logo" alt="Klirr logo" />
    <h1>Meny</h1>

    <div class="card">
      <button id="btnStart" type="button">Inräkna</button>
    </div>

    <p style="opacity:.7">More buttons will go here later.</p>
  </div>
`

document.getElementById('btnStart').addEventListener('click', () => {
  window.location.href = '/app.html'
})