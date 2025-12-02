const menuScreen = document.querySelector("#menuScreen");
const gameScreen = document.querySelector("#gameScreen");
const menuStartBtn = document.querySelector("#menuStart");

const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const button = document.querySelector("#start");
const difficultySelect = document.querySelector("#difficulty");
const durationRange = document.querySelector("#durationRange");
const durationValue = document.querySelector("#durationValue");
const shuffleRange = document.querySelector("#shuffleRange");
const shuffleValue = document.querySelector("#shuffleValue");
const resultOverlay = document.querySelector("#resultOverlay");
const finalScoreEl = document.querySelector("#finalScore");
const restartBtn = document.querySelector("#restartGame");
const closeResultBtn = document.querySelector("#closeResult");
const timeBarFill = document.querySelector("#timeBarFill");

let lastHole;
let timeUp = false;
let score = 0;
let shuffleIntervalId = null;
let gameDuration = 10000; // ms
let shuffleDelay = 1500; // ms
let minPeep = 200;
let maxPeep = 1000;
let activeHoles = Array.from(holes);
let timeBarIntervalId = null;

const difficultySettings = {
  easy: {
    duration: 12000,
    shuffleDelay: 2000,
    holeCount: 6,
    minPeep: 400,
    maxPeep: 1100,
  },
  normal: {
    duration: 10000,
    shuffleDelay: 1500,
    holeCount: 9,
    minPeep: 250,
    maxPeep: 900,
  },
  hard: {
    duration: 8000,
    shuffleDelay: 800,
    holeCount: 9,
    minPeep: 180,
    maxPeep: 700,
  },
};

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];

  if (hole === lastHole) {
    console.log("Same one");
    return randomHole(holes);
  }

  lastHole = hole;
  return hole;
}

function peep() {
  const time = randomTime(minPeep, maxPeep);
  const hole = randomHole(activeHoles);
  hole.classList.add("up");
  setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp) peep();
  }, time);
}

function shuffleHoles() {
  // Artık deliklerin yerini değiştirmiyoruz
}

function applyDifficulty(level) {
  const settings = difficultySettings[level];
  if (!settings) return;

  gameDuration = settings.duration;
  shuffleDelay = settings.shuffleDelay;
  minPeep = settings.minPeep;
  maxPeep = settings.maxPeep;
  activeHoles = Array.from(holes).slice(0, settings.holeCount);

  // Delik görünürlüğünü zorluk ayarına göre düzenle
  holes.forEach((hole, index) => {
    hole.style.visibility = index < settings.holeCount ? "visible" : "hidden";
  });

  // Slider değerlerini güncelle
  const seconds = Math.round(gameDuration / 1000);
  durationRange.value = seconds;
  durationValue.textContent = seconds;

  const shuffleSeconds = (shuffleDelay / 1000).toFixed(1);
  shuffleRange.value = shuffleSeconds;
  shuffleValue.textContent = shuffleSeconds;
}

function startGame() {
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  button.style.visibility = "hidden";
  resultOverlay.classList.remove("active");

  // süre barını resetle
  if (timeBarIntervalId) {
    clearInterval(timeBarIntervalId);
    timeBarIntervalId = null;
  }
  if (timeBarFill) {
    timeBarFill.style.width = "100%";
  }

  // Deliklerin yerlerini artık rastgele değiştirmiyoruz
  if (shuffleIntervalId) {
    clearInterval(shuffleIntervalId);
    shuffleIntervalId = null;
  }

  const startTime = Date.now();

  if (timeBarFill) {
    timeBarIntervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, 1 - elapsed / gameDuration);
      timeBarFill.style.width = `${progress * 100}%`;
      if (elapsed >= gameDuration) {
        clearInterval(timeBarIntervalId);
        timeBarIntervalId = null;
      }
    }, 50);
  }

  peep();
  setTimeout(() => {
    timeUp = true;
    button.innerHTML = "Tekrar dener misin?";
    button.style.visibility = "visible";
    if (shuffleIntervalId) {
      clearInterval(shuffleIntervalId);
      shuffleIntervalId = null;
    }

    if (timeBarIntervalId) {
      clearInterval(timeBarIntervalId);
      timeBarIntervalId = null;
    }

    // Özel sonuç kartını göster
    finalScoreEl.textContent = score;
    resultOverlay.classList.add("active");
  }, gameDuration);
}

function bonk(e) {
  if (!e.isTrusted) return;

  const hole = this.parentNode;

  // Sadece köstebek gerçekten dışarıdaysa (hole.up) puan ver
  if (!hole.classList.contains("up")) return;

  score++;
  hole.classList.remove("up");
  scoreBoard.textContent = score;
}

moles.forEach((mole) => mole.addEventListener("click", bonk));

// Zorluk seçimi değiştiğinde ayarları uygula
difficultySelect.addEventListener("change", () => {
  applyDifficulty(difficultySelect.value);
});

// Süre slider'ı değiştiğinde oyunun süresini güncelle
durationRange.addEventListener("input", () => {
  const seconds = Number(durationRange.value);
  gameDuration = seconds * 1000;
  durationValue.textContent = seconds;
});

// Karıştırma hızı slider'ı değiştiğinde güncelle
shuffleRange.addEventListener("input", () => {
  const seconds = Number(shuffleRange.value);
  shuffleDelay = seconds * 1000;
  shuffleValue.textContent = seconds.toFixed(1);
});

// Varsayılan olarak orta zorluk ayarlarını uygula
applyDifficulty("normal");

// Sonuç kartı butonları
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    resultOverlay.classList.remove("active");
    startGame();
  });
}

if (closeResultBtn) {
  closeResultBtn.addEventListener("click", () => {
    resultOverlay.classList.remove("active");
  });
}

// Ana menüden oyuna başlat (global fonksiyon, HTML onclick ile çağrılıyor)
function enterGame() {
  if (menuScreen) menuScreen.classList.add("hidden");
  if (gameScreen) gameScreen.classList.remove("hidden");
  startGame();
}