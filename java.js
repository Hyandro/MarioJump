
/***********************
 * 🎮 CONSTANTES DO JOGO
 ***********************/
const GAME_CONFIG = {
  baseSpeed: 7,
  speedStep: 0.8,
  maxSpeed: 14,
  speedIncreaseInterval: 10,
  jumpDuration: 600,
  jumpHeight: 180,
  scoreInterval: 100,
  pipeStartX: window.innerWidth + 300,
};

const HITBOX = {
  marioMarginX: 40,
  marioMarginTop: 35,
  pipeMarginX: 15,
};

const AUDIO_VOLUMES = {
  jump: 0.5,
  gameOver: 0.5,
  background: 0.03,
};

/***********************
 * 🔥 FIREBASE CONFIG
 ***********************/
const firebaseConfig = {
  apiKey: "AIzaSyC0AL_7lBKpRho1DyUuEzohNcuADRLWqs4",
  authDomain: "mario-jump-38904.firebaseapp.com",
  projectId: "mario-jump-38904",
  storageBucket: "mario-jump-38904.appspot.com",
  messagingSenderId: "461240691122",
  appId: "1:461240691122:web:a17e6742e3462c53eb9cab",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/***********************
 * 🎵 SONS E EFEITOS
 ***********************/
const audioJump = new Audio('cartoon-jump-6462.mp3'); 
const audioGameOver = new Audio('negative_beeps-6008.mp3');
const backgroundMusic = new Audio('musica de fundo.mp3');

backgroundMusic.loop = true;
backgroundMusic.volume = AUDIO_VOLUMES.background;
audioJump.volume = AUDIO_VOLUMES.jump;
audioGameOver.volume = AUDIO_VOLUMES.gameOver;

const createDust = () => {
  const marioPos = mario.getBoundingClientRect();
  for (let i = 0; i < 3; i++) {
    const dust = document.createElement("div");
    dust.classList.add("dust");
    dust.style.left = `${marioPos.left + 30 + (i * 10)}px`;
    dust.style.bottom = `15px`;
    document.querySelector(".game-board").appendChild(dust);
    setTimeout(() => dust.remove(), 500);
  }
};

/***********************
 * 🌳 SISTEMA DE FUNDO PROCEDURAL
 ***********************/
const backgroundElements = {
  mountains: [],
  trees: [],
  bushes: [],
};

const createMountain = () => {
  const mountain = document.createElement('div');
  mountain.className = 'mountain';
  mountain.style.left = `${window.innerWidth}px`;
  mountain.style.transform = `scale(${0.6 + Math.random() * 0.6})`;
  mountain.style.animationDuration = `${35 + Math.random() * 15}s`;
  
  const container = document.querySelector('.mountains-container');
  if (!container) return;
  container.appendChild(mountain);
  backgroundElements.mountains.push(mountain);
  
  setTimeout(() => {
    mountain.remove();
    const index = backgroundElements.mountains.indexOf(mountain);
    if (index > -1) backgroundElements.mountains.splice(index, 1);
  }, 50000);
};

const createTree = () => {
  const tree = document.createElement('div');
  tree.className = 'tree';
  tree.style.left = `${window.innerWidth}px`;
  
  const scale = 0.5 + Math.random() * 0.8;
  tree.style.transform = `scale(${scale})`;
  tree.style.animationDuration = `${20 + Math.random() * 10}s`;
  
  const trunk = document.createElement('div');
  trunk.className = 'tree-trunk';
  
  const foliage = document.createElement('div');
  foliage.className = 'tree-foliage';
  
  tree.appendChild(trunk);
  tree.appendChild(foliage);
  
  const container = document.querySelector('.trees-container');
  if (!container) return;
  container.appendChild(tree);
  backgroundElements.trees.push(tree);
  
  setTimeout(() => {
    tree.remove();
    const index = backgroundElements.trees.indexOf(tree);
    if (index > -1) backgroundElements.trees.splice(index, 1);
  }, 35000);
};

const createBush = () => {
  const bush = document.createElement('div');
  bush.className = 'bush';
  bush.style.left = `${window.innerWidth}px`;
  bush.style.animationDuration = `${15 + Math.random() * 8}s`;
  
  for (let i = 0; i < 3; i++) {
    const part = document.createElement('div');
    part.className = 'bush-part';
    bush.appendChild(part);
  }
  
  const container = document.querySelector('.bushes-container');
  if (!container) return;
  container.appendChild(bush);
  backgroundElements.bushes.push(bush);
  
  setTimeout(() => {
    bush.remove();
    const index = backgroundElements.bushes.indexOf(bush);
    if (index > -1) backgroundElements.bushes.splice(index, 1);
  }, 25000);
};

const spawnBackgroundElements = () => {
  if (!gameStarted || gameOver) return;
  
  const rand = Math.random();
  
  if (rand < 0.2) {
    createMountain();
  } else if (rand < 0.5) {
    createTree();
  } else if (rand < 0.75) {
    createBush();
  }
};

let backgroundSpawner;

const startBackgroundSystem = () => {
  createMountain();
  setTimeout(() => createMountain(), 3000);
  createTree();
  createBush();
  
  backgroundSpawner = setInterval(spawnBackgroundElements, 2000);
};

const stopBackgroundSystem = () => {
  if (backgroundSpawner) {
    clearInterval(backgroundSpawner);
    backgroundSpawner = null;
  }
};

const clearBackgroundElements = () => {
  Object.keys(backgroundElements).forEach(key => {
    backgroundElements[key].forEach(el => el.remove());
    backgroundElements[key] = [];
  });
};

/***********************
 * 👁️ CONTADOR DE VISITAS
 ***********************/
(function countVisitOnce() {
  const visited = localStorage.getItem("mario_visited");
  if (!visited) {
    const visitRef = db.collection("stats").doc("visits");
    visitRef.set(
      { count: firebase.firestore.FieldValue.increment(1) },
      { merge: true }
    )
    .then(() => {
      localStorage.setItem("mario_visited", "true");
      console.log("✅ Visita registrada");
    })
    .catch((err) => console.error("❌ Erro ao contar visita:", err));
  }
})();

/***********************
 * 🔧 ELEMENTOS
 ***********************/
const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const touchZone = document.querySelector(".touch-zone");

const scoreEl = document.getElementById("score");
const conesEl = document.getElementById("cones");
const highScoreEl = document.getElementById("highScore");

const nameModal = document.getElementById("nameModal");
const gameOverModal = document.getElementById("gameOverModal");
const finalScoreEl = document.getElementById("finalScore");
const finalConesEl = document.getElementById("finalCones");
const finalHighScoreEl = document.getElementById("finalHighScore");

const confirmNameBtn = document.getElementById("confirmName");
const restartBtn = document.getElementById("restartGame");
const shareBtn = document.getElementById("shareGame");
const playerNameInput = document.getElementById("playerNameInput");
const rankingList = document.getElementById("rankingList");

const tutorialOverlay = document.getElementById("tutorialOverlay");
const startTutorialBtn = document.getElementById("startTutorial");
const pauseOverlay = document.getElementById("pauseOverlay");
const resumeBtn = document.getElementById("resumeGame");
const quitBtn = document.getElementById("quitGame");
const loadingOverlay = document.getElementById("loadingOverlay");

/***********************
 * 🎮 ESTADO
 ***********************/
let playerName = "";
let gameStarted = false;
let gameOver = false;
let gamePaused = false;
let score = 0;
let cones = 0;
let startTime = 0;
let pausedTime = 0;

let pipeX = GAME_CONFIG.pipeStartX;
let pipeSpeed = GAME_CONFIG.baseSpeed;

let highScore = 0;
try {
  highScore = Number(localStorage.getItem("highScore")) || 0;
  highScoreEl.innerText = highScore;
} catch (error) {
  console.error("❌ Erro ao carregar dados:", error);
}

/***********************
 * 🏃‍♂️ PULO
 ***********************/
const jump = () => {
  if (!gameStarted || gameOver || gamePaused || mario.classList.contains("jump")) return;

  audioJump.currentTime = 0;
  audioJump.play().catch(e => console.error("Erro ao tocar som:", e));
  createDust();

  mario.classList.add("jump");
  setTimeout(() => {
    mario.classList.remove("jump");
  }, GAME_CONFIG.jumpDuration);
};

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    jump();
  } else if (e.code === "KeyP" && gameStarted && !gameOver) {
    togglePause();
  } else if (e.code === "Escape" && gamePaused) {
    togglePause();
  }
});

touchZone.addEventListener("touchstart", (e) => {
  e.preventDefault();
  jump();
}, { passive: false });

touchZone.addEventListener("click", (e) => {
  e.preventDefault();
  jump();
});

touchZone.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "Enter") {
    e.preventDefault();
    jump();
  }
});

/***********************
 * ⏱ SCORE
 ***********************/
const updateScore = () => {
  if (!gameStarted || gameOver || gamePaused) return;
  const currentTime = Date.now();
  const elapsed = currentTime - startTime - pausedTime;
  score = Math.floor(elapsed / GAME_CONFIG.scoreInterval);
  scoreEl.innerText = score;
};

/***********************
 * 🔁 GAME LOOP
 ***********************/ 
let lastTime = 0;

const gameLoop = (timestamp) => {
  if (!gameStarted || gameOver) return;
  if (gamePaused) {
    lastTime = timestamp;
    requestAnimationFrame(gameLoop);
    return;
  }

  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (deltaTime > 100) {
    requestAnimationFrame(gameLoop);
    return;
  }

  updateScore();

  const moveAmount = pipeSpeed * (deltaTime / 10);
  pipeX -= moveAmount;
  pipe.style.left = `${pipeX}px`;

  const pipeRect = pipe.getBoundingClientRect();
  const marioRect = mario.getBoundingClientRect();

  const marioHitbox = {
    left: marioRect.left + HITBOX.marioMarginX,
    right: marioRect.right - HITBOX.marioMarginX,
    top: marioRect.top + HITBOX.marioMarginTop,
    bottom: marioRect.bottom
  };

  const pipeHitbox = {
    left: pipeRect.left + HITBOX.pipeMarginX,
    right: pipeRect.right - HITBOX.pipeMarginX,
    top: pipeRect.top
  };

  if (marioHitbox.right > pipeHitbox.left && marioHitbox.left < pipeHitbox.right && marioHitbox.bottom > pipeHitbox.top) {
    endGame();
    return;
  }

  if (pipeX + pipe.offsetWidth < 0) {
    pipeX = GAME_CONFIG.pipeStartX;
    cones++;
    conesEl.innerText = cones;
    if (cones % GAME_CONFIG.speedIncreaseInterval === 0) {
      pipeSpeed = Math.min(pipeSpeed + GAME_CONFIG.speedStep, GAME_CONFIG.maxSpeed);
      showSpeedNotification();
    }
  }

  requestAnimationFrame(gameLoop);
};

/***********************
 * ☠️ GAME OVER
 ***********************/
const endGame = async () => {
  gameOver = true;
  stopBackgroundSystem();
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  audioGameOver.play().catch(e => console.error("❌ Erro ao tocar som:", e));

  const board = document.querySelector(".game-board");
  board.classList.add("shake");
  setTimeout(() => board.classList.remove("shake"), 300);

  mario.classList.remove("jump");
  mario.src = "game-over.png";
  mario.style.width = "70px";
  mario.style.marginLeft = "50px";

  if (score > highScore) {
    highScore = score;
    try {
      localStorage.setItem("highScore", highScore);
      highScoreEl.innerText = highScore;
    } catch (error) {
      console.error("Erro ao salvar highScore:", error);
    }
  }

  finalScoreEl.innerText = score;
  finalConesEl.innerText = cones;
  finalHighScoreEl.innerText = highScore;
  gameOverModal.style.display = "flex";

  await saveScoreOnline();
};

/***********************
 * 💾 FIREBASE FUNCTIONS
 ***********************/
const saveScoreOnline = async () => {
  if (!playerName || score < 1) return;
  
  if (score > cones * 100) {
    console.warn("Score suspeito detectado");
    return;
  }
  
  try {
    await db.collection("ranking").add({
      name: playerName.substring(0, 12),
      score: score,
      cones: cones,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Erro ao salvar score:", error);
  }
};

const loadRanking = () => {
  loadingOverlay.style.display = "flex";
  
  db.collection("ranking")
    .orderBy("score", "desc")
    .limit(5)
    .onSnapshot(
      (snapshot) => {
        rankingList.innerHTML = "";
        if (snapshot.empty) {
          rankingList.innerHTML = "<li>Nenhum registro ainda</li>";
        } else {
          snapshot.forEach((doc) => {
            const data = doc.data();
            const li = document.createElement("li");
            li.textContent = `${data.name} - ${data.score}`;
            rankingList.appendChild(li);
          });
        }
        loadingOverlay.style.display = "none";
      },
      (error) => {
        console.error("Erro ao carregar ranking:", error);
        rankingList.innerHTML = "<li>Erro ao carregar</li>";
        loadingOverlay.style.display = "none";
      }
    );
};

const startGame = () => {
  gameStarted = true;
  gameOver = false;
  gamePaused = false;
  score = 0;
  cones = 0;
  startTime = Date.now();
  pausedTime = 0;
  pipeSpeed = GAME_CONFIG.baseSpeed;
  
  backgroundMusic.play().catch(e => console.error("❌ Erro ao tocar música:", e));
  
  scoreEl.innerText = 0;
  conesEl.innerText = 0;
  pipeX = GAME_CONFIG.pipeStartX;
  pipe.style.left = `${pipeX}px`;
  mario.src = "mario.gif";
  mario.style.width = "140px";
  mario.style.marginLeft = "0";
  mario.style.bottom = "0";
  gameOverModal.style.display = "none";
  tutorialOverlay.style.display = "none";
  
  clearBackgroundElements();
  startBackgroundSystem();
  
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
};

confirmNameBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (!name) { 
    alert("⚠️ Digite um nome!"); 
    playerNameInput.focus();
    return; 
  }
  playerName = name;
  nameModal.style.display = "none";
  tutorialOverlay.style.display = "flex";
});

startTutorialBtn.addEventListener("click", () => {
  startGame();
});

restartBtn.addEventListener("click", startGame);

shareBtn.addEventListener("click", () => {
  const shareText = `Olha meu recorde no Mario Jump 😎\n👤 ${playerName}\n🏃‍♂️ Score: ${score}\n🧱 Canos: ${cones}\n👉 https://hyandro.github.io/MarioJump/`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Mario Jump',
      text: shareText,
    }).catch(err => console.log('Erro ao compartilhar:', err));
  } else {
    navigator.clipboard.writeText(shareText)
      .then(() => alert("✅ Mensagem copiada!"))
      .catch(() => alert("❌ Erro ao copiar"));
  }
});

/***********************
 * ⏸️ SISTEMA DE PAUSE
 ***********************/
const togglePause = () => {
  if (!gameStarted || gameOver) return;
  
  gamePaused = !gamePaused;
  
  if (gamePaused) {
    const pauseStartTime = Date.now();
    backgroundMusic.pause();
    pauseOverlay.style.display = "flex";
    pauseOverlay.dataset.pauseStart = pauseStartTime;
    
    document.querySelectorAll('.mountain, .tree, .bush').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    const pauseStart = parseInt(pauseOverlay.dataset.pauseStart);
    pausedTime += Date.now() - pauseStart;
    backgroundMusic.play().catch(e => console.error("❌ Erro ao tocar música:", e));
    pauseOverlay.style.display = "none";
    lastTime = performance.now();
    
    document.querySelectorAll('.mountain, .tree, .bush').forEach(el => {
      el.style.animationPlayState = 'running';
    });
    
    requestAnimationFrame(gameLoop);
  }
};

resumeBtn.addEventListener("click", togglePause);
quitBtn.addEventListener("click", () => {
  gamePaused = false;
  pauseOverlay.style.display = "none";
  endGame();
});

/***********************
 * 📢 NOTIFICAÇÕES
 ***********************/
const showSpeedNotification = () => {
  const notification = document.createElement("div");
  notification.className = "speed-notification";
  notification.textContent = "⚡ Velocidade Aumentou!";
  document.querySelector(".game-board").appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
};

/***********************
 * ♿ ACESSIBILIDADE
 ***********************/
nameModal.addEventListener("keydown", (e) => {
  if (e.key === "Enter") confirmNameBtn.click();
});

gameOverModal.addEventListener("keydown", (e) => {
  if (e.key === "Enter") restartBtn.click();
});

const trapFocus = (modal) => {
  const focusableElements = modal.querySelectorAll('button, input, textarea');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
};

trapFocus(nameModal);
trapFocus(gameOverModal);

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.style.display === "flex") {
      const input = mutation.target.querySelector("input, button");
      if (input) setTimeout(() => input.focus(), 100);
    }
  });
});

observer.observe(nameModal, { attributes: true, attributeFilter: ["style"] });
observer.observe(gameOverModal, { attributes: true, attributeFilter: ["style"] });

/***********************
 * 🚀 INICIALIZAÇÃO
 ***********************/
loadRanking();
