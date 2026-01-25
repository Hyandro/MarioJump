
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
const useCheckpointBtn = document.getElementById("useCheckpoint");
const shareBtn = document.getElementById("shareGame");
const playerNameInput = document.getElementById("playerNameInput");
const rankingList = document.getElementById("rankingList");

const tutorialOverlay = document.getElementById("tutorialOverlay");
const startTutorialBtn = document.getElementById("startTutorial");
const pauseOverlay = document.getElementById("pauseOverlay");
const resumeBtn = document.getElementById("resumeGame");
const quitBtn = document.getElementById("quitGame");
const loadingOverlay = document.getElementById("loadingOverlay");
const pauseButton = document.getElementById("pauseButton");

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
 * 🪙 SISTEMA DE MOEDAS E PODERES
 ***********************/
let coins = 0;
let activePower = null;
let powerEndTime = 0;
let coinsArray = [];

// Carregar moedas salvas
try {
  coins = Number(localStorage.getItem("savedCoins")) || 0;
} catch (error) {
  console.error("❌ Erro ao carregar moedas:", error);
}

const coinsEl = document.getElementById("coins");
const coinsContainer = document.getElementById("coinsContainer");
const activePowerHud = document.getElementById("activePowerHud");
const activePowerIcon = document.getElementById("activePowerIcon");
const activePowerName = document.getElementById("activePowerName");
const activePowerTimer = document.getElementById("activePowerTimer");
const shieldIndicator = document.getElementById("shieldIndicator");
const reviveIndicator = document.getElementById("reviveIndicator");
const checkpointIndicator = document.getElementById("checkpointIndicator");

// Inicializar display de moedas
if (coinsEl) coinsEl.innerText = coins;

const POWER_CONFIG = {
  fly: { cost: 50, duration: 10000, icon: "🪽", name: "Voar" },
  invincible: { cost: 30, duration: 10000, icon: "✨", name: "Invencível" }
};

// Configuração dos upgrades da loja
const SHOP_UPGRADES = {
  highJump: { cost: 10, name: "Pulo Mais Alto", type: "permanent", multiplier: 1.3 },
  starPower: { cost: 25, name: "Estrela Invencível", type: "consumable", duration: 5000 },
  wingPower: { cost: 22, name: "Asas de Voo", type: "consumable", duration: 7000 },
  shield: { cost: 18, name: "Escudo Protetor", type: "consumable" },
  checkpoint: { cost: 35, name: "Checkpoint Portátil", type: "consumable" },
  revive: { cost: 50, name: "Reviver Instantâneo", type: "consumable" }
};

// Estado dos upgrades
let ownedUpgrades = {
  highJump: false,
  starPower: 0,
  wingPower: 0,
  shield: 0,
  checkpoint: 0,
  revive: 0
};

let activeShield = false;
let checkpointData = null;
let hasRevive = false;

// Carregar upgrades salvos
try {
  const saved = localStorage.getItem("ownedUpgrades");
  if (saved) {
    ownedUpgrades = JSON.parse(saved);
  }
} catch (error) {
  console.error("❌ Erro ao carregar upgrades:", error);
}

// Criar moeda
const createCoin = () => {
  if (!gameStarted || gameOver || gamePaused) return;
  
  const coin = document.createElement("div");
  coin.className = "coin";
  coin.style.left = `${window.innerWidth}px`;
  coin.style.bottom = `30px`;
  coin.dataset.x = window.innerWidth;
  
  coinsContainer.appendChild(coin);
  coinsArray.push(coin);
  
  setTimeout(() => {
    if (coin.parentElement) {
      coin.remove();
      const index = coinsArray.indexOf(coin);
      if (index > -1) coinsArray.splice(index, 1);
    }
  }, 15000);
};

// Coletar moeda
const checkCoinCollision = () => {
  if (!gameStarted || gameOver) return;
  
  const marioRect = mario.getBoundingClientRect();
  
  coinsArray.forEach((coin, index) => {
    if (coin.classList.contains("collected")) return;
    
    const coinRect = coin.getBoundingClientRect();
    
    if (
      marioRect.right > coinRect.left &&
      marioRect.left < coinRect.right &&
      marioRect.bottom > coinRect.top &&
      marioRect.top < coinRect.bottom
    ) {
      collectCoin(coin, index);
    }
  });
};

const collectCoin = (coin, index) => {
  coin.classList.add("collected");
  coins++;
  coinsEl.innerText = coins;
  
  // Salvar moedas no localStorage
  try {
    localStorage.setItem("savedCoins", coins);
  } catch (error) {
    console.error("❌ Erro ao salvar moedas:", error);
  }
  
  // Som de moeda (pode adicionar depois)
  // const coinSound = new Audio('coin.mp3');
  // coinSound.play();
  
  setTimeout(() => {
    if (coin.parentElement) {
      coin.remove();
    }
    const coinIndex = coinsArray.indexOf(coin);
    if (coinIndex > -1) {
      coinsArray.splice(coinIndex, 1);
    }
  }, 500);
};

// Sistema de spawn de moedas
let coinSpawner;

const startCoinSpawner = () => {
  createCoin();
  coinSpawner = setInterval(() => {
    if (!gameStarted || gameOver || gamePaused) return;
    if (Math.random() < 0.3) {
      createCoin();
    }
  }, 3000);
};

const stopCoinSpawner = () => {
  if (coinSpawner) {
    clearInterval(coinSpawner);
    coinSpawner = null;
  }
};

const clearCoins = () => {
  coinsArray.forEach(coin => coin.remove());
  coinsArray = [];
};

// Event listeners dos poderes (removidos - agora só via loja)

// Atualizar timer do poder
const updatePowerTimer = () => {
  if (!activePower) return;
  
  const remaining = Math.max(0, Math.ceil((powerEndTime - Date.now()) / 1000));
  activePowerTimer.innerText = `${remaining}s`;
  
  if (remaining <= 0) {
    deactivatePower();
  }
};

// Desativar poder
const deactivatePower = () => {
  if (!activePower) return;
  
  mario.classList.remove("flying", "invincible");
  activePower = null;
  powerEndTime = 0;
  activePowerHud.classList.remove("active");
};

// Event listeners dos poderes (removidos - agora só via loja)

/***********************
 * 🛒 SISTEMA DE LOJA
 ***********************/
const shopMenu = document.getElementById("shopMenu");
const shopMenuGameOver = document.getElementById("shopMenuGameOver");
const openShopBtn = document.getElementById("openShop");
const openShopGameOverBtn = document.getElementById("openShopGameOver");
const closeShopBtn = document.getElementById("closeShop");
const closeShopGameOverBtn = document.getElementById("closeShopGameOver");
const shopCoinsDisplay = document.getElementById("shopCoinsDisplay");
const shopCoinsDisplayGameOver = document.getElementById("shopCoinsDisplayGameOver");
const pauseContent = document.querySelector(".pause-content");
const gameOverModalContent = document.querySelector("#gameOverModal .modal-content");

// Abrir loja no pause
if (openShopBtn) {
  openShopBtn.addEventListener("click", () => {
    pauseContent.style.display = "none";
    shopMenu.style.display = "block";
    updateShopDisplay("pause");
  });
}

// Abrir loja no game over
if (openShopGameOverBtn) {
  openShopGameOverBtn.addEventListener("click", () => {
    gameOverModalContent.style.display = "none";
    shopMenuGameOver.style.display = "block";
    updateShopDisplay("gameover");
  });
}

// Fechar loja no pause
if (closeShopBtn) {
  closeShopBtn.addEventListener("click", () => {
    shopMenu.style.display = "none";
    pauseContent.style.display = "block";
  });
}

// Fechar loja no game over
if (closeShopGameOverBtn) {
  closeShopGameOverBtn.addEventListener("click", () => {
    shopMenuGameOver.style.display = "none";
    gameOverModalContent.style.display = "block";
  });
}

// Atualizar display da loja
const updateShopDisplay = (context = "pause") => {
  const displayEl = context === "gameover" ? shopCoinsDisplayGameOver : shopCoinsDisplay;
  displayEl.innerText = coins;
  
  const selector = context === "gameover" ? '[data-context="gameover"]' : '[data-context="pause"]';
  
  Object.keys(SHOP_UPGRADES).forEach(upgradeId => {
    const item = document.querySelector(`${selector}[data-upgrade="${upgradeId}"]`);
    if (!item) return;
    
    const btn = item.querySelector(".buy-btn");
    const config = SHOP_UPGRADES[upgradeId];
    
    if (config.type === "permanent") {
      if (ownedUpgrades[upgradeId]) {
        item.classList.add("owned");
        btn.innerText = "Ativo";
        btn.disabled = true;
      } else {
        item.classList.remove("owned");
        btn.innerText = "Comprar";
        btn.disabled = coins < config.cost;
      }
    } else {
      // Consumível
      const quantity = ownedUpgrades[upgradeId] || 0;
      if (quantity > 0) {
        item.classList.add("owned");
        btn.innerText = `Usar (${quantity})`;
        btn.classList.add("use-btn");
        btn.disabled = false;
      } else {
        item.classList.remove("owned");
        btn.innerText = "Comprar";
        btn.classList.remove("use-btn");
        btn.disabled = coins < config.cost;
      }
    }
  });
};

// Comprar/Usar upgrade
document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const upgradeId = e.target.dataset.upgrade;
    const context = e.target.dataset.context;
    const config = SHOP_UPGRADES[upgradeId];
    
    if (config.type === "permanent") {
      if (!ownedUpgrades[upgradeId] && coins >= config.cost) {
        coins -= config.cost;
        ownedUpgrades[upgradeId] = true;
        saveUpgrades();
        saveCoins();
        updateShopDisplay(context);
        showNotification(`✓ ${config.name} comprado!`);
      }
    } else {
      // Consumível
      const quantity = ownedUpgrades[upgradeId] || 0;
      if (quantity > 0) {
        // Usar
        useUpgrade(upgradeId, context);
      } else if (coins >= config.cost) {
        // Comprar
        coins -= config.cost;
        ownedUpgrades[upgradeId] = (ownedUpgrades[upgradeId] || 0) + 1;
        saveUpgrades();
        saveCoins();
        updateShopDisplay(context);
        showNotification(`✓ ${config.name} comprado!`);
        
        // Auto-usar e voltar ao jogo se comprado durante o pause
        if (context === "pause") {
          setTimeout(() => {
            useUpgrade(upgradeId, context);
          }, 100);
        }
        
        // Se for reviver no game over, perguntar se quer usar agora
        if (upgradeId === "revive" && context === "gameover") {
          if (confirm("💚 Deseja usar o Reviver agora e continuar jogando?")) {
            useUpgrade("revive", context);
          }
        }
      }
    }
  });
});

// Usar upgrade
const useUpgrade = (upgradeId, context = "pause") => {
  const config = SHOP_UPGRADES[upgradeId];
  
  switch(upgradeId) {
    case "starPower":
      if (!gameStarted || gameOver) return;
      activateShopPower("invencível", config.duration, "⭐");
      break;
    case "wingPower":
      if (!gameStarted || gameOver) return;
      activateShopPower("voando", config.duration, "🪽");
      break;
    case "shield":
      if (!gameStarted || gameOver) return;
      activeShield = true;
      showNotification("🛡️ Escudo ativado!");
      mario.classList.add("shielded");
      if (shieldIndicator) shieldIndicator.style.display = "flex";
      break;
    case "checkpoint":
      if (!gameStarted || gameOver) return;
      checkpointData = { score, cones, pipeSpeed };
      showNotification("💾 Checkpoint salvo!");
      if (checkpointIndicator) checkpointIndicator.style.display = "flex";
      break;
    case "revive":
      if (context === "gameover") {
        // Reviver do game over
        ownedUpgrades[upgradeId]--;
        saveUpgrades();
        reviveFromGameOver();
        return;
      } else {
        // Ativar para usar quando morrer
        hasRevive = true;
        showNotification("💚 Reviver pronto!");
        if (reviveIndicator) reviveIndicator.style.display = "flex";
      }
      break;
  }
  
  ownedUpgrades[upgradeId]--;
  saveUpgrades();
  updateShopDisplay(context);
  
  // Fechar loja e despausar se for do pause
  if (context === "pause") {
    shopMenu.style.display = "none";
    pauseContent.style.display = "block";
    togglePause();
  }
};

// Ativar poder da loja
const activateShopPower = (type, duration, icon) => {
  if (activePower) return;
  
  activePower = type;
  powerEndTime = Date.now() + duration;
  
  if (type === "voando") {
    mario.classList.add("flying");
  } else if (type === "invencível") {
    mario.classList.add("invincible");
  }
  
  activePowerIcon.innerText = icon;
  activePowerName.innerText = type.charAt(0).toUpperCase() + type.slice(1);
  activePowerHud.classList.add("active");
};

// Salvar upgrades
const saveUpgrades = () => {
  try {
    localStorage.setItem("ownedUpgrades", JSON.stringify(ownedUpgrades));
  } catch (error) {
    console.error("❌ Erro ao salvar upgrades:", error);
  }
};

const saveCoins = () => {
  try {
    localStorage.setItem("savedCoins", coins);
    coinsEl.innerText = coins;
  } catch (error) {
    console.error("❌ Erro ao salvar moedas:", error);
  }
};

// Mostrar notificação
const showNotification = (message) => {
  const notification = document.createElement("div");
  notification.className = "shop-notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};

// Reviver do game over
const reviveFromGameOver = () => {
  // Fechar loja e modal
  shopMenuGameOver.style.display = "none";
  gameOverModal.style.display = "none";
  
  // Resetar estado do jogo
  gameOver = false;
  gameStarted = true;
  
  // Restaurar Mario
  mario.src = "mario.gif";
  mario.style.width = "140px";
  mario.style.marginLeft = "0";
  mario.classList.remove("jump");
  
  // Dar invencibilidade temporária
  activateShopPower("invencível", 3000, "💚");
  
  // Reiniciar música
  backgroundMusic.currentTime = 0;
  backgroundMusic.play().catch(e => console.error("❌ Erro ao tocar música:", e));
  
  // Continuar o jogo
  startTime = Date.now() - (score * GAME_CONFIG.scoreInterval);
  pausedTime = 0;
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
  
  showNotification("💚 Revivido! Continue jogando!");
};

/***********************
 * 🏃‍♂️ PULO
 ***********************/
const jump = () => {
  if (!gameStarted || gameOver || gamePaused) return;
  
  // Se estiver voando, não precisa pular
  if (activePower === "fly" || activePower === "voando") return;
  
  if (mario.classList.contains("jump")) return;

  audioJump.currentTime = 0;
  audioJump.play().catch(e => console.error("Erro ao tocar som:", e));
  createDust();

  mario.classList.add("jump");
  
  // Aplicar altura aumentada se tiver upgrade
  if (ownedUpgrades.highJump) {
    mario.style.setProperty('--jump-height', '234px'); // 180 * 1.3
  }
  
  setTimeout(() => {
    mario.classList.remove("jump");
    if (ownedUpgrades.highJump) {
      mario.style.removeProperty('--jump-height');
    }
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

// Botão de pause para dispositivos móveis
pauseButton.addEventListener("click", () => {
  if (gameStarted && !gameOver) {
    togglePause();
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
  checkCoinCollision();
  updatePowerTimer();
  updateCoinsPosition(deltaTime);

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

  // Verificar colisão apenas se não estiver invencível
  if (activePower !== "invincible" && activePower !== "invencível") {
    if (marioHitbox.right > pipeHitbox.left && marioHitbox.left < pipeHitbox.right && marioHitbox.bottom > pipeHitbox.top) {
      // Verificar se tem escudo
      if (activeShield) {
        activeShield = false;
        mario.classList.remove("shielded");
        if (shieldIndicator) shieldIndicator.style.display = "none";
        showNotification("🛡️ Escudo absorveu o dano!");
        
        // Dar invencibilidade temporária de 2 segundos após usar o escudo
        activateShopPower("invencível", 2000, "🛡️");
        
        // Piscar Mario
        mario.style.opacity = "0.5";
        setTimeout(() => { mario.style.opacity = "1"; }, 200);
      } else {
        endGame();
        return;
      }
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
  // Verificar se tem reviver
  if (hasRevive) {
    hasRevive = false;
    ownedUpgrades.revive = Math.max(0, (ownedUpgrades.revive || 1) - 1);
    saveUpgrades();
    if (reviveIndicator) reviveIndicator.style.display = "none";
    showNotification("💚 Revivido! Continue jogando!");
    
    // Mover o cano para longe para evitar colisão imediata
    pipeX = GAME_CONFIG.pipeStartX;
    pipe.style.left = `${pipeX}px`;
    
    // Dar um boost temporário de invencibilidade
    activateShopPower("invencível", 5000, "💚");
    
    return; // Não termina o jogo
  }
  
  gameOver = true;
  pauseButton.classList.remove("visible"); // Esconder botão de pause
  stopBackgroundSystem();
  stopCoinSpawner();
  deactivatePower();
  activeShield = false;
  mario.classList.remove("shielded");
  if (shieldIndicator) shieldIndicator.style.display = "none";
  if (reviveIndicator) reviveIndicator.style.display = "none";
  if (checkpointIndicator) checkpointIndicator.style.display = "none";
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
  
  // Mostrar botão de checkpoint se houver um salvo
  if (useCheckpointBtn) {
    if (checkpointData) {
      useCheckpointBtn.style.display = "inline-block";
    } else {
      useCheckpointBtn.style.display = "none";
    }
  }
  
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
  
  // Restaurar checkpoint se existir
  const hasCheckpoint = checkpointData !== null;
  if (checkpointData) {
    score = checkpointData.score;
    cones = checkpointData.cones;
    pipeSpeed = checkpointData.pipeSpeed;
    startTime = Date.now() - (score * GAME_CONFIG.scoreInterval);
    checkpointData = null;
    showNotification("💾 Checkpoint restaurado!");
  } else {
    score = 0;
    cones = 0;
    pipeSpeed = GAME_CONFIG.baseSpeed;
    startTime = Date.now();
  }
  
  pausedTime = 0;
  activePower = null;
  powerEndTime = 0;
  activeShield = false;
  hasRevive = ownedUpgrades.revive > 0;
  
  backgroundMusic.play().catch(e => console.error("❌ Erro ao tocar música:", e));
  
  scoreEl.innerText = score;
  conesEl.innerText = cones;
  coinsEl.innerText = coins; // Mantém as moedas acumuladas
  pipeX = GAME_CONFIG.pipeStartX;
  pipe.style.left = `${pipeX}px`;
  mario.src = "mario.gif";
  mario.style.width = "140px";
  mario.style.marginLeft = "0";
  mario.style.bottom = "0";
  mario.classList.remove("flying", "invincible", "shielded");
  gameOverModal.style.display = "none";
  tutorialOverlay.style.display = "none";
  activePowerHud.classList.remove("active");
  
  // Mostrar botão de pause
  pauseButton.classList.add("visible");
  
  // Atualizar indicadores de benefícios
  if (shieldIndicator) shieldIndicator.style.display = "none";
  if (reviveIndicator) reviveIndicator.style.display = hasRevive ? "flex" : "none";
  if (checkpointIndicator) checkpointIndicator.style.display = "none"; // Checkpoint é consumido ao ser usado
  
  clearBackgroundElements();
  clearCoins();
  startBackgroundSystem();
  startCoinSpawner();
  
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
};

// Atualizar posição das moedas
const updateCoinsPosition = (deltaTime) => {
  const moveAmount = pipeSpeed * (deltaTime / 10);
  coinsArray.forEach(coin => {
    const currentX = parseFloat(coin.dataset.x);
    const newX = currentX - moveAmount;
    coin.dataset.x = newX;
    coin.style.left = `${newX}px`;
  });
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

restartBtn.addEventListener("click", () => {
  checkpointData = null; // Limpar checkpoint ao reiniciar normalmente
  startGame();
});

// Usar checkpoint
if (useCheckpointBtn) {
  useCheckpointBtn.addEventListener("click", () => {
    if (checkpointData) {
      startGame(); // startGame vai usar o checkpoint automaticamente
    }
  });
}

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
