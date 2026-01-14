document.fonts.load("1em Azuki").then(() => {
  document.getElementById("loader").classList.add("hidden");
});


const images = document.querySelectorAll('.gallery img');
const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = document.getElementById('fullscreenImg');
const imageDate = document.getElementById('imageDate');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const overlayBtn = document.getElementById('overlayBtn');
const overlay = document.getElementById('overlay');
const overlayImg = document.getElementById('overlayImg');

  let currentIndex = -1;
  let currentGallery = Array.from(document.querySelectorAll('.gallery img'));

const yearColors = {
  "2022": "#b9351e", // red-orange
  "2023": "#cc8a33", // orange
  "2024": "#4eb37f", // green
  "2025": "#6fa5cc",  // blue
  "2026": "#845ec9ff"  // blue
};

function showImage(index) {
  if (index >= 0 && index < currentGallery.length) {
    const clickedImg = currentGallery[index];
    fullscreenImg.src = currentGallery[index].src;
    fullscreenImg.className = currentGallery[index].className;

    const dateText = currentGallery[index].dataset.date || '';
    imageDate.textContent = dateText;

    // Get year from parent group’s data attribute
    const parentGroup = currentGallery[index].closest('.month-group');
    const year = parentGroup?.dataset?.year || '2025';

    imageDate.style.color = yearColors[year] || '#ccc';
  }
}



  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      showImage(currentIndex);
      fullscreen.style.display = 'flex';
    });
  });

  fullscreen.addEventListener('click', (e) => {
    // Only close if clicking outside image area
    if (e.target === fullscreen) {
      fullscreen.style.display = 'none';
      fullscreenImg.src = '';
      currentIndex = -1;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (fullscreen.style.display === 'flex') {
     if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        // Next image
        currentIndex = (currentIndex + 1) % currentGallery.length;
        showImage(currentIndex);
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        // Previous image
       currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        showImage(currentIndex);
      } else if (e.key === 'Escape') {
        // Exit fullscreen
        fullscreen.style.display = 'none';
        fullscreenImg.src = '';
        currentIndex = -1;
      }
    }
  });


  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (fullscreen.style.display === 'flex' && currentGallery.length > 0) {
      currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
      showImage(currentIndex);
    }
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (fullscreen.style.display === 'flex' && currentGallery.length > 0) {
      currentIndex = (currentIndex + 1) % currentGallery.length;
      showImage(currentIndex);
    }
  });

  // --- Fullscreen Toggle ---
  fullscreenBtn.addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

// --- Sync Button With F11 / Manual Changes ---
document.addEventListener('fullscreenchange', () => {
  const isFull = !!document.fullscreenElement;

  // You can update button text or visuals here
  fullscreenBtn.textContent = isFull ? '× Fullscreen' : '⛶ Fullscreen';

  // Optional: add a visual indicator (class toggle)
  fullscreenBtn.classList.toggle('active', isFull);
});

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
let fadeDuration = 1000; // 1s fade
let displayDuration = 5000; // 5s visible before fade out

  // --- Overlay Open/Close ---
  overlayBtn.addEventListener('click', openOverlay);

  document.addEventListener('keydown', (e) => {
   if (e.key.toLowerCase() === 'c') {
     openOverlay();
   } else if (e.key === 'Escape' && overlay.style.display === 'flex') {
      closeOverlay();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeOverlay();
    }
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


// Pause/Resume toggle
pauseOverlayBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseOverlayBtn.textContent = isPaused ? '⏯ Resume' : '⏸ Pause';
});

// Display next image smoothly
function showOverlayImage(index) {
  overlayImg.classList.remove('visible', 'pixelated');
  const imgSrc = overlayImages[index];
  overlayImg.src = imgSrc;

  // Detect pixel art (optional rule — adjust filenames or folders)
  if (imgSrc.includes('pixel') || imgSrc.includes('pix_')) {
    overlayImg.classList.add('pixelated');
  }

  // Wait a bit before fade in
  setTimeout(() => overlayImg.classList.add('visible'), 100);
}

function startOverlayRotation() {
  stopOverlayRotation(); // clear existing interval

  overlayInterval = setInterval(() => {
    if (!isPaused) {
      overlayImg.classList.remove('visible'); // fade out

      setTimeout(() => {
        currentOverlayIndex = (currentOverlayIndex + 1) % overlayImages.length;
        showOverlayImage(currentOverlayIndex);
      }, fadeDuration + 400); // longer pause between fade out/in
    }
  }, displayDuration + fadeDuration * 2);
}

function stopOverlayRotation() {
  clearInterval(overlayInterval);
  overlayInterval = null;
}

const gameSidebar = document.getElementById('gameSidebar');
const openBtn = document.getElementById('openGameSidebarBtn');

openBtn.addEventListener('click', () => {
  gameSidebar.classList.toggle('open');
});

// Close sidebar when clicking outside
document.addEventListener('click', (event) => {
  const isClickInsideSidebar = gameSidebar.contains(event.target);
  const isClickOnButton = openBtn.contains(event.target);

  // If sidebar is open, and click is NOT inside it or on its toggle button → close it
  if (gameSidebar.classList.contains('open') &&
      !isClickInsideSidebar &&
      !isClickOnButton) {
    gameSidebar.classList.remove('open');
  }
});


function launchApp(appName) {
    fetch(`http://localhost:3000/${appName}`)
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(err => console.error(err));
}

