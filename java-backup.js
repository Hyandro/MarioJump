
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
  flowers: [],
};

const createMountain = () => {
  const mountain = document.createElement('div');
  mountain.className = 'mountain';
  mountain.style.left = `${window.innerWidth}px`;
  mountain.style.transform = `scale(${0.6 + Math.random() * 0.6})`;
  mountain.style.animationDuration = `${35 + Math.random() * 15}s`;
  
  const container = document.querySelector('.mountains-container');
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
  container.appendChild(bush);
  backgroundElements.bushes.push(bush);
  
  setTimeout(() => {
    bush.remove();
    const index = backgroundElements.bushes.indexOf(bush);
    if (index > -1) backgroundElements.bushes.splice(index, 1);
  }, 25000);
};

const createFlower = () => {
  const flower = document.createElement('div');
  flower.className = 'flower';
  flower.style.left = `${window.innerWidth + Math.random() * 100}px`;
  flower.style.animationDuration = `${25 + Math.random() * 10}s`;
  
  const colors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FFA500', '#FF4500'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const stem = document.createElement('div');
  stem.className = 'flower-stem';
  
  const petals = document.createElement('div');
  petals.className = 'flower-petals';
  petals.style.background = color;
  
  const center = document.createElement('div');
  center.className = 'flower-center';
  
  flower.appendChild(stem);
  flower.appendChild(petals);
  flower.appendChild(center);
  
  const container = document.querySelector('.bushes-container');
  container.appendChild(flower);
  backgroundElements.flowers.push(flower);
  
  setTimeout(() => {
    flower.remove();
    const index = backgroundElements.flowers.indexOf(flower);
    if (index > -1) backgroundElements.flowers.splice(index, 1);
  }, 40000);
};

const spawnBackgroundElements = () => {
  if (!gameStarted || gameOver) return;
  
  const rand = Math.random();
  
  if (rand < 0.15) {
    createMountain();
  } else if (rand < 0.4) {
    createTree();
  } else if (rand < 0.65) {
    createBush();
  } else if (rand < 0.8) {
    createFlower();
  }
};

let backgroundSpawner;

const startBackgroundSystem = () => {
  // Cria elementos iniciais
  createMountain();
  setTimeout(() => createMountain(), 3000);
  createTree();
  createBush();
  
  // Sistema procedural contínuo
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
 * 🪙 SISTEMA DE MOEDAS
 ***********************/
let coinSpawner;

const createCoin = () => {
  if (!coinsContainer) return;
  
  const coin = document.createElement('div');
  coin.className = 'coin';
  coin.style.left = `${window.innerWidth}px`;
  coin.style.top = `${Math.random() * (window.innerHeight - 200) + 50}px`;
  
  coinsContainer.appendChild(coin);
  
  coin.addEventListener('click', () => collectCoin(coin));
  
  setTimeout(() => {
    if (coin.parentElement) {
      coin.remove();
    }
  }, 15000);
};

const collectCoin = (coin) => {
  if (coin.classList.contains('collected')) return;
  
  coin.classList.add('collected');
  coins++;
  totalCoins++;
  if (coinsEl) coinsEl.innerText = totalCoins;
  
  try {
    localStorage.setItem('totalCoins', totalCoins);
  } catch (error) {
    console.error('❌ Erro ao salvar moedas:', error);
  }
  
  setTimeout(() => coin.remove(), 500);
};

const checkCoinCollisions = () => {
  if (!gameStarted || gameOver) return;
  
  const marioRect = mario.getBoundingClientRect();
  const allCoins = document.querySelectorAll('.coin:not(.collected)');
  
  allCoins.forEach(coin => {
    const coinRect = coin.getBoundingClientRect();
    
    // Ímã de moedas
    if (activePowerups.magnet.active) {
      const distance = Math.sqrt(
        Math.pow(coinRect.left - marioRect.left, 2) + 
        Math.pow(coinRect.top - marioRect.top, 2)
      );
      
      if (distance < 150) {
        collectCoin(coin);
        return;
      }
    }
    
    // Colisão normal
    if (
      marioRect.right > coinRect.left &&
      marioRect.left < coinRect.right &&
      marioRect.bottom > coinRect.top &&
      marioRect.top < coinRect.bottom
    ) {
      collectCoin(coin);
    }
  });
};

const startCoinSystem = () => {
  coinSpawner = setInterval(() => {
    if (gameStarted && !gameOver && !gamePaused) {
      if (Math.random() < 0.4) {
        createCoin();
      }
    }
  }, 2000);
};

const stopCoinSystem = () => {
  if (coinSpawner) {
    clearInterval(coinSpawner);
    coinSpawner = null;
  }
  document.querySelectorAll('.coin').forEach(coin => coin.remove());
};

/***********************
 * 💪 SISTEMA DE POWER-UPS
 ***********************/
const activatePowerup = (type) => {
  const config = powerupConfig[type];
  const now = Date.now();
  
  if (type === 'shield') {
    activePowerups.shield.active = true;
    activePowerups.shield.uses = config.uses;
    showPowerupIndicator(`${config.name} Ativo!`);
  } else if (config.duration) {
    activePowerups[type].active = true;
    activePowerups[type].endTime = now + config.duration;
    showPowerupIndicator(`${config.name} Ativo!`, config.duration);
  }
};

const checkPowerupExpiration = () => {
  const now = Date.now();
  
  Object.keys(activePowerups).forEach(type => {
    const powerup = activePowerups[type];
    if (powerup.active && powerup.endTime && now >= powerup.endTime) {
      powerup.active = false;
      powerup.endTime = 0;
      hidePowerupIndicator();
    }
  });
  
  if (activePowerups.shield.active && activePowerups.shield.uses <= 0) {
    activePowerups.shield.active = false;
    hidePowerupIndicator();
  }
};

const showPowerupIndicator = (text, duration = null) => {
  if (!powerupIndicator) return;
  
  powerupIndicator.textContent = text;
  powerupIndicator.classList.add('active');
  
  if (duration) {
    const endTime = Date.now() + duration;
    const updateTimer = setInterval(() => {
      if (!activePowerups.fly.active && !activePowerups.slowmo.active && !activePowerups.magnet.active) {
        clearInterval(updateTimer);
        return;
      }
      
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      if (remaining > 0) {
        powerupIndicator.textContent = `${text.split('!')[0]} (${remaining}s)`;
      } else {
        clearInterval(updateTimer);
      }
    }, 1000);
  }
};

const hidePowerupIndicator = () => {
  if (!powerupIndicator) return;
  powerupIndicator.classList.remove('active');
};

const updateShopDisplay = () => {
  if (!shopCoinsDisplay) return;
  shopCoinsDisplay.textContent = totalCoins;
  
  document.querySelectorAll('.shop-item-buy').forEach(btn => {
    const price = parseInt(btn.dataset.price);
    const powerup = btn.dataset.powerup;
    
    btn.disabled = totalCoins < price;
    
    const item = btn.closest('.shop-item');
    item.classList.toggle('active', activePowerups[powerup].active);
  });
};

/***********************
 * 🛒 EVENTOS DA LOJA
 ***********************/
if (shopButton) {
  shopButton.addEventListener('click', () => {
    updateShopDisplay();
    if (shopOverlay) shopOverlay.style.display = 'flex';
  });
}

if (shopClose) {
  shopClose.addEventListener('click', () => {
    if (shopOverlay) shopOverlay.style.display = 'none';
  });
}

if (shopOverlay) {
  shopOverlay.addEventListener('click', (e) => {
    if (e.target === shopOverlay) {
      shopOverlay.style.display = 'none';
    }
  });
}

document.querySelectorAll('.shop-item-buy').forEach(btn => {
  btn.addEventListener('click', () => {
    const powerup = btn.dataset.powerup;
    const price = parseInt(btn.dataset.price);
    
    if (totalCoins >= price) {
      totalCoins -= price;
      coinsEl.innerText = totalCoins;
      
      try {
        localStorage.setItem('totalCoins', totalCoins);
      } catch (error) {
        console.error('❌ Erro ao salvar moedas:', error);
      }
      
      activatePowerup(powerup);
      updateShopDisplay();
      
      if (!gameStarted || gameOver) {
        shopOverlay.style.display = 'none';
      }
    }
  });
});

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

const shopButton = document.getElementById("shopButton");
const shopOverlay = document.getElementById("shopOverlay");
const shopClose = document.getElementById("shopClose");
const shopCoinsDisplay = document.getElementById("shopCoinsDisplay");
const coinsEl = document.getElementById("coins");
const powerupIndicator = document.getElementById("powerupIndicator");
const coinsContainer = document.querySelector(".coins-container");

/***********************
 * 🎮 ESTADO
 ***********************/
let playerName = "";
let gameStarted = false;
let gameOver = false;
let gamePaused = false;
let score = 0;
let cones = 0;
let coins = 0;
let totalCoins = 0;
let startTime = 0;
let pausedTime = 0;

let pipeX = GAME_CONFIG.pipeStartX;
let pipeSpeed = GAME_CONFIG.baseSpeed;

// Power-ups
let activePowerups = {
  fly: { active: false, endTime: 0 },
  shield: { active: false, uses: 0 },
  slowmo: { active: false, endTime: 0 },
  magnet: { active: false, endTime: 0 },
};

const powerupConfig = {
  fly: { duration: 60000, name: '👩‍🚀 Modo Voo', price: 50 },
  shield: { uses: 1, name: '🛡️ Escudo', price: 30 },
  slowmo: { duration: 30000, name: '⏱️ Câmera Lenta', price: 40 },
  magnet: { duration: 45000, name: '🧲 Ímã de Moedas', price: 35 },
};

let highScore = 0;
try {
  highScore = Number(localStorage.getItem("highScore")) || 0;
  highScoreEl.innerText = highScore;
  totalCoins = Number(localStorage.getItem("totalCoins")) || 0;
  if (coinsEl) coinsEl.innerText = totalCoins;
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

// Suporte para Enter/Space na touch-zone
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
 * 🔁 GAME LOOP (HITBOX JUSTA)
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
  checkPowerupExpiration();

  // Aplicar efeito de câmera lenta
  const speedMultiplier = activePowerups.slowmo.active ? 0.5 : 1;
  const moveAmount = pipeSpeed * speedMultiplier * (deltaTime / 10);
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

  // Verifica colisão (com proteção de power-ups)
  if (marioHitbox.right > pipeHitbox.left && marioHitbox.left < pipeHitbox.right && marioHitbox.bottom > pipeHitbox.top) {
    // Modo voo - não colide
    if (activePowerups.fly.active) {
      // Não faz nada, passa pelo obstáculo
    }
    // Escudo - absorve uma colisão
    else if (activePowerups.shield.active && activePowerups.shield.uses > 0) {
      activePowerups.shield.uses--;
      if (activePowerups.shield.uses <= 0) {
        activePowerups.shield.active = false;
        hidePowerupIndicator();
      } else {
        showPowerupIndicator(`🛡️ Escudo (${activePowerups.shield.uses} restante)`);
      }
      // Reseta posição do cano para dar uma chance
      pipeX = GAME_CONFIG.pipeStartX;
      cones++;
      conesEl.innerText = cones;
    }
    // Sem proteção - game over
    else {
      endGame();
      return;
    }
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
  stopBackgroundSystem();  stopCoinSystem();  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  audioGameOver.play().catch(e => console.error("Erro ao tocar som:", e));

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
  
  // Validação básica de score (anti-cheat simples)
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
  coins = 0;
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
  shopOverlay.style.display = "none";
  
  clearBackgroundElements();
  startBackgroundSystem();
  
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
};

confirmNameBtn.addEventListener("click", () => {
  alert("Botão funcionando!"); // TESTE
  const name = playerNameInput.value.trim();
  if (!name) { 
    alert("⚠️ Digite um nome!"); 
    playerNameInput.focus();
    return; 
  }
  playerName = name;
  nameModal.style.display = "none";
  if (tutorialOverlay) {
    tutorialOverlay.style.display = "flex";
  } else {
    startGame();
  }
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
    
    // Pausar animações do fundo
    document.querySelectorAll('.mountain, .tree, .bush, .flower').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    const pauseStart = parseInt(pauseOverlay.dataset.pauseStart);
    pausedTime += Date.now() - pauseStart;
    backgroundMusic.play().catch(e => console.error("Erro ao tocar música:", e));
    pauseOverlay.style.display = "none";
    lastTime = performance.now();
    
    // Retomar animações do fundo
    document.querySelectorAll('.mountain, .tree, .bush, .flower').forEach(el => {
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
// Navegação por teclado nos modais
nameModal.addEventListener("keydown", (e) => {
  if (e.key === "Enter") confirmNameBtn.click();
});

gameOverModal.addEventListener("keydown", (e) => {
  if (e.key === "Enter") restartBtn.click();
});

// Focus trap nos modais
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

// Focar automaticamente nos inputs quando modais abrem
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
