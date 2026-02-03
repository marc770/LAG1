import './style.css'
import './menu.css'
import klirrLogo from '/klirr.png'

document.querySelector('#app').innerHTML = `
  <div class="page">
    <img src="${klirrLogo}" class="logo" alt="Klirr logo" />
    <h1>Meny</h1>

    <div class="menu">
      <button id="btnStart" class="menu-btn" type="button">
        <span>Inräkna</span>
        <span class="chev">›</span>
      </button>

    <button id="btnIsstorm" class="menu-btn" type="button" disabled aria-disabled="true" title="Kommer snart">
        <span>Isstorm <small class="tag">(Kommer snart)</small></span>
        <span class="chev">›</span>
    </button>
    </div>

    <p class="muted">More buttons will go here later.</p>
  </div>
`

document.getElementById('btnStart').addEventListener('click', () => {
  window.location.href = '/app.html'
})

document.getElementById('btnIsstorm').addEventListener('click', () => {
  window.location.href = '/isstorm.html'
})