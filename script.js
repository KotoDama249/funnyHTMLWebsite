// ==============================
// Loader
// ==============================
document.fonts.load("1em Azuki").then(() => {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("hidden");
});

// ==============================
// Fullscreen Gallery
// ==============================
const images = Array.from(document.querySelectorAll('.gallery img'));
const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = document.getElementById('fullscreenImg');
const imageDate = document.getElementById('imageDate');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let currentIndex = -1;

const yearColors = {
  "2022": "#b9351e",
  "2023": "#cc8a33",
  "2024": "#4eb37f",
  "2025": "#6fa5cc",
  "2026": "#845ec9ff"
};

function showImage(index) {
  if (index < 0 || index >= images.length) return;

  const img = images[index];
  fullscreenImg.src = img.src;
  fullscreenImg.className = img.className;

  const dateText = img.dataset.date || '';
  imageDate.textContent = dateText;

  const parentGroup = img.closest('.month-group');
  const year = parentGroup?.dataset?.year || '2025';
  imageDate.style.color = yearColors[year] || '#ccc';
}

// Click to open fullscreen
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    showImage(currentIndex);
    fullscreen.style.display = 'flex';
  });
});

// Click outside image closes fullscreen
fullscreen.addEventListener('click', (e) => {
  if (e.target === fullscreen) {
    fullscreen.style.display = 'none';
    fullscreenImg.src = '';
    currentIndex = -1;
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (fullscreen.style.display === 'flex') {
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    } else if (e.key === 'Escape') {
      fullscreen.style.display = 'none';
      fullscreenImg.src = '';
      currentIndex = -1;
    }
  }

  if (e.key.toLowerCase() === 'f') toggleFullscreen();
});

// Prev/Next buttons
prevBtn?.addEventListener('click', e => {
  e.stopPropagation();
  if (images.length) {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }
});

nextBtn?.addEventListener('click', e => {
  e.stopPropagation();
  if (images.length) {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }
});

// Fullscreen toggle
fullscreenBtn?.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// Sync button visual
document.addEventListener('fullscreenchange', () => {
  const isFull = !!document.fullscreenElement;
  if (fullscreenBtn) {
    fullscreenBtn.textContent = isFull ? '× Fullscreen' : '⛶ Fullscreen';
    fullscreenBtn.classList.toggle('active', isFull);
  }
});

// ==============================
// Overlay Slideshow
// ==============================
const overlayBtn = document.getElementById('overlayBtn');
const overlay = document.getElementById('overlay');
const overlayImg = document.getElementById('overlayImg');
const pauseOverlayBtn = document.getElementById('pauseOverlayBtn');

const overlayImages = [
  "covers/cook.webp",
  "covers/evil100stare.gif",
  "covers/Girlfieri.jpg",
  "covers/heightcompare miside.png",
  "covers/mandela.jpg",
  "covers/me when ai art.png",
  "covers/miside meme.jpeg",
  "covers/mods.gif",
  "covers/noire-pixel.png",
  "covers/poster_6.png",
  "covers/riyo.jpg",
  "covers/rocky-pixel.png",
  "covers/situation.png",
  "covers/skulduggery-pixel.png",
  "covers/soldier.jpg",
  "covers/sponge_out.jpg",
  "covers/tiny mita.jpeg",
  "covers/why.jpeg",
];

let currentOverlayIndex = 0;
let overlayInterval = null;
let isPaused = false;
const fadeDuration = 1000;
const displayDuration = 5000;

// Overlay open/close
if (overlayBtn && overlay) {
  overlayBtn.addEventListener('click', openOverlay);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeOverlay();
  });

  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'c') openOverlay();
    if (e.key === 'Escape' && overlay.style.display === 'flex') closeOverlay();
  });
}

pauseOverlayBtn?.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseOverlayBtn.textContent = isPaused ? '⏯ Resume' : '⏸ Pause';
});

function openOverlay() {
  showOverlayImage(currentOverlayIndex);
  overlay.style.display = 'flex';
  startOverlayRotation();
}

function closeOverlay() {
  overlay.style.display = 'none';
  stopOverlayRotation();
}

function showOverlayImage(index) {
  overlayImg.classList.remove('visible', 'pixelated');
  const imgSrc = overlayImages[index];
  overlayImg.src = imgSrc;

  if (imgSrc.includes('pixel') || imgSrc.includes('pix_')) {
    overlayImg.classList.add('pixelated');
  }

  setTimeout(() => overlayImg.classList.add('visible'), 100);
}

function startOverlayRotation() {
  stopOverlayRotation();
  overlayInterval = setInterval(() => {
    if (!isPaused) {
      overlayImg.classList.remove('visible');
      setTimeout(() => {
        currentOverlayIndex = (currentOverlayIndex + 1) % overlayImages.length;
        showOverlayImage(currentOverlayIndex);
      }, fadeDuration + 400);
    }
  }, displayDuration + fadeDuration * 2);
}

function stopOverlayRotation() {
  clearInterval(overlayInterval);
  overlayInterval = null;
}

// ==============================
// Universal Sidebar Controller
// ==============================
(function () {
  const buttons = document.querySelectorAll('[data-sidebar-target]');
  const sidebars = document.querySelectorAll('.sidebar');

  function closeAll() {
    sidebars.forEach(s => s.classList.remove('open'));
  }

  buttons.forEach(btn => {
    const target = document.getElementById(btn.dataset.sidebarTarget);
    if (!target) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = target.classList.contains('open');
      closeAll();
      if (!isOpen) target.classList.add('open');
    });
  });

  document.addEventListener('click', e => {
    sidebars.forEach(s => {
      if (s.classList.contains('open') && !s.contains(e.target)) {
        s.classList.remove('open');
      }
    });
  });
})();

// ==============================
// Lazy Loading
// ==============================
const lazyImages = document.querySelectorAll('img[data-src]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      observer.unobserve(img);
    }
  });
});
lazyImages.forEach(img => observer.observe(img));
