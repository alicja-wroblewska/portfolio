import { DATA } from './data.js';

const $ = s => document.querySelector(s);
const ring = $('#ring');
const st = $('#st');

let rot = 0, tgt = 0, act = -1, moved = 0, down = 0, lx = 0, lock = 0;

if (ring) {
  DATA.forEach((w, i) => {
    const c = document.createElement('div');
    c.className = 'c';
    c.dataset.i = i;
    
    const bgImg = (w.items[0] && w.items[0].src && !w.video) ? `url('${w.items[0].src}')` : 'none';
    c.style.background = `${bgImg}, linear-gradient(155deg, ${w.h})`;
    c.style.transform = `rotateY(${i * 72}deg) translateZ(var(--R))`;
    c.innerHTML = `<small>0${i + 1}</small><b>${w.n}</b>`;
    ring.appendChild(c);
  });
}

function updateDimensions() {
  const isMobile = window.innerWidth < 640;
  const radius = isMobile ? 180 : 320;
  if (ring) ring.style.setProperty('--R', radius + 'px');
}

updateDimensions();
window.addEventListener('resize', updateDimensions);

(function render() {
  rot += (tgt - rot) * 0.12;
  if (ring) ring.style.transform = `rotateY(${rot}deg)`;
  
  const actIndex = ((Math.round(-rot / 72) % 5) + 5) % 5;
  if (actIndex !== act) {
    act = actIndex;
    if (ring) {
      [...ring.children].forEach((c, j) => c.classList.toggle('f', j === act));
    }
    const lab = $('#lab');
    const cnt = $('#cnt');
    if (lab) lab.textContent = DATA[act].n;
    if (cnt) {
      const len = DATA[act].items.length;
      cnt.textContent = len === 1 ? (DATA[act].video ? '1 Wideo' : '1 Projekt') : `${len} Projekty`;
    }
  }
  requestAnimationFrame(render);
})();

const snap = () => Math.round(tgt / 72) * 72;
function go(dir) { tgt = snap() - dir * 72; }

function rotateTo(i) {
  const cur = Math.round(-tgt / 72);
  let diff = ((i - cur) % 5 + 5) % 5;
  if (diff > 2) diff -= 5;
  tgt = snap() - diff * 72;
}

if ($('#pv')) $('#pv').onclick = () => go(-1);
if ($('#nx')) $('#nx').onclick = () => go(1);
if ($('#gb')) $('#gb').onclick = () => openCategory(act);

if (st) {
  st.addEventListener('pointerdown', e => { down = 1; moved = 0; lx = e.clientX; });
}

window.addEventListener('pointermove', e => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  [['#a1', -30], ['#a2', 40], ['#a3', -18]].forEach(([selector, k]) => {
    const el = $(selector);
    if (el) el.style.transform = `translate(${(x - 0.5) * k}px, ${(y - 0.5) * k}px)`;
  });

  if (!down) return;
  const dx = e.clientX - lx;
  lx = e.clientX;
  moved += Math.abs(dx);
  tgt += dx * 0.45;
});

window.addEventListener('pointerup', e => {
  if (!down) return;
  down = 0;
  if (moved < 6) {
    const card = e.target.closest('.c');
    if (card) {
      const idx = +card.dataset.i;
      idx === act ? openCategory(idx) : rotateTo(idx);
    }
  } else {
    tgt = snap();
  }
});

window.addEventListener('wheel', e => {
  if (document.querySelector('.open') || lock || Math.abs(e.deltaY) < 15) return;
  lock = 1;
  setTimeout(() => lock = 0, 400);
  go(e.deltaY > 0 ? 1 : -1);
}, { passive: true });

window.addEventListener('keydown', e => {
  const isOpen = document.querySelector('#lb.open') || document.querySelector('#ab.open') || document.querySelector('#cat.open');
  if (e.key === 'Escape') {
    if ($('#lb.open')) $('#lb').classList.remove('open');
    else if ($('#ab.open')) $('#ab').classList.remove('open');
    else if ($('#cat.open')) $('#cat').classList.remove('open');
  } else if (!isOpen) {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'Enter') openCategory(act);
  }
});

function renderTile(it, w) {
  if (it.src) {
    const media = w.video 
      ? `<video src="${it.src}" muted loop playsinline></video>` 
      : `<img src="${it.src}" alt="${it.t}">`;
    return media + `<div class="t-overlay"><b>${it.t}</b></div>`;
  }
  return `<div class="ph" style="background: linear-gradient(155deg, ${w.h})">
    <b>${it.t}</b>
    <small>${w.video ? '▶ miejsce na film' : 'miejsce na pracę'}</small>
  </div>`;
}

function openCategory(i) {
  const category = DATA[i];
  const grid = $('#gr');
  if ($('#ct')) $('#ct').textContent = category.n;
  if (grid) {
    grid.innerHTML = '';
    category.items.forEach((item, j) => {
      const tile = document.createElement('div');
      tile.className = 't';
      tile.style.aspectRatio = category.a;
      tile.style.animationDelay = `${j * 100}ms`;
      tile.innerHTML = renderTile(item, category);
      tile.onclick = () => openLightbox(category, item);
      grid.appendChild(tile);
    });
  }

  if ($('#cat')) {
    $('#cat').scrollTop = 0;
    $('#cat').classList.add('open');
  }
}

function openLightbox(category, item) {
  const content = $('#lbcnt');
  if ($('#lbt')) $('#lbt').textContent = item.t;
  if ($('#lbd')) $('#lbd').textContent = item.desc || 'Kliknij poza obrazem, aby zamknąć podgląd';
  
  if (content) {
    if (item.src) {
      content.innerHTML = category.video 
        ? `<video src="${item.src}" controls autoplay loop playsinline></video>` 
        : `<img src="${item.src}" alt="${item.t}">`;
    } else {
      content.innerHTML = `<div class="ph" style="background: linear-gradient(155deg, ${category.h}); width: 300px; height: 300px;"><b>${item.t}</b></div>`;
    }
  }
    
  if ($('#lb')) $('#lb').classList.add('open');
}

if ($('#lbc')) $('#lbc').onclick = () => $('#lb').classList.remove('open');
if ($('#lb')) $('#lb').onclick = e => { if (e.target.id === 'lb') $('#lb').classList.remove('open'); };
if ($('#bk')) $('#bk').onclick = () => $('#cat').classList.remove('open');
if ($('#bo')) $('#bo').onclick = () => $('#ab').classList.add('open');
if ($('#cx')) $('#cx').onclick = () => $('#ab').classList.remove('open');

// Obsługa kopiowania adresu e-mail do schowka
const copyEmailBtn = $('#copy-email');
const toast = $('#toast');

if (copyEmailBtn && toast) {
  copyEmailBtn.onclick = () => {
    const email = copyEmailBtn.textContent.trim();
    navigator.clipboard.writeText(email).then(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }).catch(err => {
      console.error('Błąd kopiowania do schowka: ', err);
    });
  };
}

// --- SIATKA KREŚLARSKA / FIGMA VIBE (INTERAKTYWNA) ---
(function initBlueprintGrid() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const gridSize = 48; // Odległość między liniami siatki
  let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('pointermove', e => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  function drawGrid() {
    // Płynne podążanie pozycji kursoru (lerp)
    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;

    ctx.clearRect(0, 0, width, height);

    // 1. Tło bazowe
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // 2. Poświata od kursoru myszy
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.07)');
    gradient.addColorStop(1, 'rgba(248, 250, 252, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 3. Linie siatki kreślarskiej
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';

    ctx.beginPath();
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 4. Interaktywne punkty / węzły siatki z reakcją na kursor
    for (let x = 0; x <= width; x += gridSize) {
      for (let y = 0; y <= height; y += gridSize) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 180;

        let offsetX = 0;
        let offsetY = 0;
        let pointAlpha = 0.25;
        let pointSize = 1.5;

        if (dist < maxDist) {
          const factor = (1 - dist / maxDist);
          offsetX = -dx * factor * 0.12;
          offsetY = -dy * factor * 0.12;
          pointAlpha = 0.25 + factor * 0.65;
          pointSize = 1.5 + factor * 2;
        }

        const px = x + offsetX;
        const py = y + offsetY;

        // Rysowanie delikatnych punktów węzłowych
        ctx.fillStyle = `rgba(37, 99, 235, ${pointAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, pointSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(drawGrid);
  }

  drawGrid();
})();

// --- DTP PRELOADER LOGIC WITH PROGRESS BAR ---
(function handlePreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-bar');
  if (!preloader) return;

  let progress = 0;
  
  // Płynny przyrost paska postępu
  const interval = setInterval(() => {
    progress += Math.random() * 25 + 15;
    if (progressBar) progressBar.style.width = `${Math.min(progress, 90)}%`;
    if (progress >= 90) clearInterval(interval);
  }, 60);

  window.addEventListener('load', () => {
    clearInterval(interval);
    if (progressBar) progressBar.style.width = '100%';

    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 350);
  });
})();