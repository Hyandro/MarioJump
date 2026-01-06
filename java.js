/***********************
 * 🔥 FIREBASE CONFIG
 ***********************/
const firebaseConfig = {
  apiKey: "AIzaSyC0AL_7lBKpRho1DyUuEzohNcuADRLWqs4",
  authDomain: "mario-jump-38904.firebaseapp.com",
  projectId: "mario-jump-38904",
  storageBucket: "mario-jump-38904.appspot.com",
  messagingSenderId: "461240691122",
  appId: "1:461240691122:web:a17e6742e3462c53eb9cab"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/***********************
 * 🔧 ELEMENTOS
 ***********************/
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');

/* HUD */
const scoreEl = document.getElementById('score');
const conesEl = document.getElementById('cones');
const highScoreEl = document.getElementById('highScore');

/* MODAIS */
const nameModal = document.getElementById('nameModal');
const gameOverModal = document.getElementById('gameOverModal');

const finalScoreEl = document.getElementById('finalScore');
const finalConesEl = document.getElementById('finalCones');
const finalHighScoreEl = document.getElementById('finalHighScore');

const confirmNameBtn = document.getElementById('confirmName');
const restartBtn = document.getElementById('restartGame');
const shareBtn = document.getElementById('shareGame');

/* INPUT */
const playerNameInput = document.getElementById('playerNameInput');

/* RANKING */
const rankingList = document.getElementById('rankingList');

/***********************
 * 🎮 ESTADO
 ***********************/
let playerName = '';
let gameStarted = false;
let gameOver = false;

let score = 0;
let cones = 0;

/* PIPE ENGINE */
let pipeX = window.innerWidth + 300;
let pipeSpeed = 7;
const baseSpeed = 7;
const speedStep = 0.8;
const maxSpeed = 14;

/* RECORD LOCAL */
let highScore = Number(localStorage.getItem('highScore')) || 0;
highScoreEl.innerText = highScore;

/***********************
 * 🏃‍♂️ PULO
 ***********************/
const jump = () => {
  if (!gameStarted || gameOver) return;

  mario.classList.add('jump');
  setTimeout(() => mario.classList.remove('jump'), 600);
};

document.addEventListener('keydown', jump);

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
 * 🔁 GAME LOOP
 ***********************/
const gameLoop = () => {
  if (!gameStarted || gameOver) return;

  pipeX -= pipeSpeed;
  pipe.style.left = `${pipeX}px`;

  const pipeRect = pipe.getBoundingClientRect();
  const marioRect = mario.getBoundingClientRect();

  /* HITBOX AJUSTADA */
  const marioHitbox = {
    left: marioRect.left + 20,
    right: marioRect.right - 20,
    bottom: marioRect.bottom
  };

  const pipeHitbox = {
    left: pipeRect.left + 10,
    right: pipeRect.right - 10,
    top: pipeRect.top
  };

  if (
    pipeHitbox.left < marioHitbox.right &&
    pipeHitbox.right > marioHitbox.left &&
    marioHitbox.bottom > pipeHitbox.top
  ) {
    endGame();
    return;
  }

  /* CANO PASSOU */
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

  mario.classList.remove('jump');
  mario.src = 'game-over.png';
  mario.style.width = '70px';
  mario.style.marginLeft = '50px';

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreEl.innerText = highScore;
  }

  finalScoreEl.innerText = score;
  finalConesEl.innerText = cones;
  finalHighScoreEl.innerText = highScore;

  gameOverModal.style.display = 'flex';

  await saveScoreOnline();
};

/***********************
 * 💾 SALVAR SCORE ONLINE
 ***********************/
const saveScoreOnline = async () => {
  if (!playerName) return;

  await db.collection('ranking').add({
    name: playerName,
    score: score,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
};

/***********************
 * 🏆 CARREGAR RANKING
 ***********************/
const loadRanking = () => {
  db.collection('ranking')
    .orderBy('score', 'desc')
    .limit(5)
    .onSnapshot(snapshot => {
      rankingList.innerHTML = '';

      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement('li');
        li.textContent = `${data.name} - ${data.score}`;
        rankingList.appendChild(li);
      });
    });
};

/***********************
 * ▶️ START GAME
 ***********************/
const startGame = () => {
  gameStarted = true;
  gameOver = false;

  score = 0;
  cones = 0;
  pipeSpeed = baseSpeed;

  scoreEl.innerText = 0;
  conesEl.innerText = 0;

  pipeX = window.innerWidth + 300;
  pipe.style.left = `${pipeX}px`;

  mario.src = 'mario.gif';
  mario.style.width = '140px';
  mario.style.marginLeft = '0';
  mario.style.bottom = '0';

  gameOverModal.style.display = 'none';

  requestAnimationFrame(gameLoop);
};

/***********************
 * 👤 CONFIRMAR NOME
 ***********************/
confirmNameBtn.addEventListener('click', () => {
  const name = playerNameInput.value.trim();

  if (!name) {
    alert('Digite um nome!');
    return;
  }

  playerName = name;
  nameModal.style.display = 'none';

  startGame();
});

/***********************
 * 🔁 BOTÕES
 ***********************/
restartBtn.addEventListener('click', startGame);

shareBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(
`Olha meu recorde no Mario Jump 😎

👤 ${playerName}
🏃‍♂️ Score: ${score}
🧱 Canos: ${cones}

👉 https://hyandro.github.io/MarioJump/`
  );

  alert('Mensagem copiada!');
});

/***********************
 * 🚀 INIT
 ***********************/
loadRanking();
