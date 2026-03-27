// === LOCK SCREEN WIDTH TO LINE 1 ===
function lockScreenWidth() {
  const screen = document.querySelector('.screen');
  const activePage = screen.querySelector('.page.active');
  if (!activePage) return;
  const line1 = activePage.querySelector('.row');

  // Shrink line 1 to its natural content width
  line1.style.width = 'fit-content';
  const contentW = line1.getBoundingClientRect().width;
  line1.style.width = '';

  // Screen width = line 1 content + screen padding
  const cs = getComputedStyle(screen);
  const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  screen.style.width = (contentW + pad) + 'px';
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
  lockScreenWidth();
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

// Lock width after fonts load
document.fonts.ready.then(() => {
  lockScreenWidth();
});
lockScreenWidth();
window.addEventListener('resize', lockScreenWidth);
