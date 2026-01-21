
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
// Configuração da música de fundo
const backgroundMusic = new Audio('musica de fundo.mp3'); // O nome tem que ser igual ao arquivo na pasta
backgroundMusic.loop = true;      // Faz a música tocar infinitamente
backgroundMusic.volume = 0.03;    // Define o volume em 3%

// Ajuste de volume
audioJump.volume = 0.5;
audioGameOver.volume = 0.5;

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
    })
    .catch((err) => console.error("Erro ao contar visita:", err));
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

/***********************
 * 🎮 ESTADO
 ***********************/
const stars = document.querySelectorAll(".star");
const feedbackText = document.getElementById("feedbackText");
let selectedRating = 0;

let playerName = "";
let gameStarted = false;
let gameOver = false;
let score = 0;
let cones = 0;

let pipeX = window.innerWidth + 300;
let pipeSpeed = 7;
const baseSpeed = 7;
const speedStep = 0.8;
const maxSpeed = 14;

let highScore = Number(localStorage.getItem("highScore")) || 0;
highScoreEl.innerText = highScore;

/***********************
 * 🏃‍♂️ PULO
 ***********************/
const jump = () => {
  if (!gameStarted || gameOver || mario.classList.contains("jump")) return;

  // Som e Partículas
  audioJump.currentTime = 0;
  audioJump.play();
  createDust();

  mario.classList.add("jump");
  setTimeout(() => {
    mario.classList.remove("jump");
  }, 600);
};

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

touchZone.addEventListener("touchstart", (e) => {
  e.preventDefault();
  jump();
}, { passive: false });

/***********************
 * ⏱ SCORE
 ***********************/
setInterval(() => {
  if (gameStarted && !gameOver) {
    score++;
    scoreEl.innerText = score;
  }
}, 100);

/***********************
 * 🔁 GAME LOOP (HITBOX JUSTA)
 ***********************/
let lastTime = 0;

const gameLoop = (timestamp) => {
  if (!gameStarted || gameOver) return;

  // Calcula o tempo que passou desde o último quadro (Delta Time)
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  // Se o deltaTime for muito grande (ex: mudou de aba), ignoramos para o cano não "teleportar"
  if (deltaTime > 100) {
    requestAnimationFrame(gameLoop);
    return;
  }

  // Ajustamos a velocidade baseada no tempo (usamos 0.01 como multiplicador de ajuste)
  // Agora pipeSpeed não é mais "pixels por frame", mas sim uma escala de velocidade
  const moveAmount = pipeSpeed * (deltaTime / 10); 

  pipeX -= moveAmount;
  pipe.style.left = `${pipeX}px`;

  // --- O RESTANTE DA LÓGICA DE COLISÃO CONTINUA IGUAL ---
  const pipeRect = pipe.getBoundingClientRect();
  const marioRect = mario.getBoundingClientRect();
  const marginX = 40;     
  const marginTop = 35;   

  const marioHitbox = {
    left: marioRect.left + marginX,
    right: marioRect.right - marginX,
    top: marioRect.top + marginTop,
    bottom: marioRect.bottom
  };

  const pipeHitbox = {
    left: pipeRect.left + 15,
    right: pipeRect.right - 15,
    top: pipeRect.top
  };

  if (marioHitbox.right > pipeHitbox.left && marioHitbox.left < pipeHitbox.right && marioHitbox.bottom > pipeHitbox.top) {
    endGame();
    return;
  }

  if (pipeX + pipe.offsetWidth < 0) {
    pipeX = window.innerWidth + 300;
    cones++;
    conesEl.innerText = cones;
    if (cones % 10 === 0) {
      pipeSpeed = Math.min(pipeSpeed + speedStep, maxSpeed);
    }
  }

  requestAnimationFrame(gameLoop);
};

/***********************
 * ☠️ GAME OVER
 ***********************/
const endGame = async () => {
  gameOver = true;
  backgroundMusic.pause();        // Para a música
  backgroundMusic.currentTime = 0; // Reseta para o início
  audioGameOver.play();

  // Efeito de tremer a tela
  const board = document.querySelector(".game-board");
  board.classList.add("shake");
  setTimeout(() => board.classList.remove("shake"), 300);

  mario.classList.remove("jump");
  mario.src = "game-over.png";
  mario.style.width = "70px";
  mario.style.marginLeft = "50px";

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreEl.innerText = highScore;
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
  if (!playerName) return;
  await db.collection("ranking").add({
    name: playerName,
    score: score,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

const loadRanking = () => {
  db.collection("ranking")
    .orderBy("score", "desc")
    .limit(5)
    .onSnapshot((snapshot) => {
      rankingList.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement("li");
        li.textContent = `${data.name} - ${data.score}`;
        rankingList.appendChild(li);
      });
    });
};

const startGame = () => {
  gameStarted = true;
  gameOver = false;
  backgroundMusic.play();
  score = 0;
  cones = 0;
  pipeSpeed = baseSpeed;
  scoreEl.innerText = 0;
  conesEl.innerText = 0;
  pipeX = window.innerWidth + 300;
  pipe.style.left = `${pipeX}px`;
  mario.src = "mario.gif";
  mario.style.width = "140px";
  mario.style.marginLeft = "0";
  mario.style.bottom = "0";
  gameOverModal.style.display = "none";
  requestAnimationFrame(gameLoop);
};


confirmNameBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (!name) { alert("Digite um nome!"); return; }
  playerName = name;
  nameModal.style.display = "none";
  startGame();
});

restartBtn.addEventListener("click", startGame);

shareBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(`Olha meu recorde no Mario Jump 😎\n👤 ${playerName}\n🏃‍♂️ Score: ${score}\n👉 https://hyandro.github.io/mariojumpcelularteste/`);
  alert("Mensagem copiada!");
});

loadRanking();

// === SISTEMA DE FEEDBACK OBRIGATÓRIO ===
const feedbackStars = document.querySelectorAll(".star-btn");
const feedbackMsg = document.getElementById("feedbackMsg");
let userRating = 0;

// Função que checa se os botões podem ser liberados
function checkRequirements() {
  const text = feedbackMsg.value.trim();
  if (userRating > 0 && text.length >= 3) {
    // Libera os botões
    restartBtn.disabled = false;
    shareBtn.disabled = false;
    restartBtn.style.opacity = "1";
    restartBtn.style.cursor = "pointer";
    shareBtn.style.opacity = "1";
    shareBtn.style.cursor = "pointer";
  } else {
    // Mantém travado
    restartBtn.disabled = true;
    shareBtn.disabled = true;
    restartBtn.style.opacity = "0.4";
    shareBtn.style.opacity = "0.4";
  }
}

// Lógica das estrelas
feedbackStars.forEach(star => {
  star.addEventListener("click", () => {
    userRating = star.getAttribute("data-val");
    
    // Pinta as estrelas de amarelo
    feedbackStars.forEach(s => {
      if (s.getAttribute("data-val") <= userRating) {
        s.style.color = "#f1c40f";
      } else {
        s.style.color = "#ccc";
      }
    });
    checkRequirements();
  });
});

// Lógica do texto
feedbackMsg.addEventListener("input", checkRequirements);

// Botão Reiniciar (Reseta o feedback e volta o jogo)
restartBtn.addEventListener("click", () => {
  // Limpa o feedback para a próxima morte
  userRating = 0;
  feedbackMsg.value = "";
  feedbackStars.forEach(s => s.style.color = "#ccc");
  restartBtn.disabled = true;
  shareBtn.disabled = true;
  
  startGame(); // Chama sua função existente
});

// Botão Compartilhar
shareBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(`Olha meu recorde no Mario Jump 😎\n👤 ${playerName}\n🏃‍♂️ Score: ${score}\n👉 https://hyandro.github.io/mariojumpcelularteste/`);
  alert("Mensagem copiada!");
});