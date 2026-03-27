// === SCALE FONT TO FILL VIEWPORT WIDTH ===
function scaleToViewport() {
  const screen = document.querySelector('.screen');
  const activePage = screen.querySelector('.page.active');
  if (!activePage) return;
  const line1 = activePage.querySelector('.row');
  if (!line1) return;

  // Reference font size for measuring
  const refSize = 22;
  document.body.style.fontSize = refSize + 'px';

  // Measure line 1 natural content width
  line1.style.width = 'fit-content';
  const contentW = line1.getBoundingClientRect().width;
  line1.style.width = '';

  // Available width = viewport (capped at 480px) minus screen padding
  const cs = getComputedStyle(screen);
  const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const availW = Math.min(window.innerWidth, 480) - pad;

  // Scale font so line 1 fills the viewport exactly
  const newSize = refSize * (availW / contentW);
  document.body.style.fontSize = newSize + 'px';
}

// === CLOCK ===
function updateClocks() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const time = `${h}:${m}:${s}`;

  document.querySelectorAll('.clock').forEach(el => {
    el.textContent = time;
  });
}

setInterval(updateClocks, 1000);
updateClocks();

// === SPA NAVIGATION ===
function navigateTo(hash) {
  const target = hash.replace('#', '') || 'home';

  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  const targetPage = document.getElementById(target);
  if (targetPage) {
    targetPage.classList.add('active');
  } else {
    document.getElementById('home').classList.add('active');
  }

  window.scrollTo(0, 0);
  scaleToViewport();
}

window.addEventListener('hashchange', () => {
  navigateTo(location.hash);
});

if (location.hash) {
  navigateTo(location.hash);
}

// === +1 TOGGLE ===
document.querySelectorAll('input[name="plus1"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const nameRow = document.querySelector('.plus1-name');
    if (nameRow) {
      nameRow.style.display = radio.value === 'si' ? 'flex' : 'none';
    }
  });
});

// === FORM SUBMIT → Google Sheets ===
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbz-TXxtLFzW0cHayfhovsgjCv3EKLIHquJ61c-GLMqVZijVD34UVDppkWKs-0BDWW1L/exec';

const form = document.getElementById('tuinfo-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.tt-btn');
    const msg = form.querySelector('.tt-msg');
    const origText = btn.textContent;
    btn.textContent = 'ENVIANDO...';
    btn.style.color = '#F1EA00'; // amarillo on tap
    btn.disabled = true;

    const fd = new FormData(form);
    const data = {
      nombre: fd.get('nombre') || '',
      alergias: fd.get('alergias') || '',
      plan: fd.get('plan') || '',
      comentarios: fd.get('comentarios') || ''
    };

    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      btn.textContent = '>> ENVIADO \u2713 <<';
      btn.style.color = '#23D947'; // verde
    } catch (err) {
      btn.textContent = 'ERROR ✗';
      btn.style.color = '#C9000A';
      if (msg) {
        msg.style.display = 'flex';
        msg.innerHTML = '<span class="rojo">Error al enviar, inténtalo de nuevo</span>';
      }
      setTimeout(() => {
        btn.textContent = origText;
        btn.style.color = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

// Scale after fonts load
document.fonts.ready.then(() => {
  scaleToViewport();
});
scaleToViewport();
window.addEventListener('resize', scaleToViewport);
