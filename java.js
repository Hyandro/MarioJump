const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');

/* HUD */
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const conesEl = document.getElementById('cones');

/* MODAL */
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreEl = document.getElementById('finalScore');
const finalConesEl = document.getElementById('finalCones');
const finalHighScoreEl = document.getElementById('finalHighScore');

const restartBtn = document.getElementById('restartGame');
const shareBtn = document.getElementById('shareGame');

/* ESTADO */
let score = 0;
let cones = 0;
let gameOver = false;

/* CANO – ENGINE REAL */
let pipeX = window.innerWidth + 300;
let pipeSpeed = 7;
const baseSpeed = 7;
const speedStep = 0.8;   // 🔥 acelera a cada 10 canos
const maxSpeed = 14;

/* RECORD */
let highScore = Number(localStorage.getItem('highScore')) || 0;
highScoreEl.innerText = highScore;

/* ================= PULO ================= */
const jump = () => {
    if (gameOver) return;

    mario.classList.add('jump');
    setTimeout(() => mario.classList.remove('jump'), 600);
};

/* ================= SCORE ================= */
setInterval(() => {
    if (!gameOver) {
        score++;
        scoreEl.innerText = score;
    }
}, 100);

/* ================= GAME LOOP ================= */
const gameLoop = () => {
    if (gameOver) return;

    pipeX -= pipeSpeed;
    pipe.style.left = `${pipeX}px`;

    const pipeRect = pipe.getBoundingClientRect();
    const marioRect = mario.getBoundingClientRect();

    /* 🎯 HITBOX AJUSTADA */
    const marioHitbox = {
        left: marioRect.left + 20,
        right: marioRect.right - 20,
        top: marioRect.top + 10,
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

    /* 🧱 CANO SAIU DA TELA */
    if (pipeX + pipe.offsetWidth < 0) {
        pipeX = window.innerWidth + 300;
        cones++;
        conesEl.innerText = cones;

        /* 🚀 ACELERA A CADA 10 CANOS */
        if (cones % 10 === 0) {
            pipeSpeed = Math.min(pipeSpeed + speedStep, maxSpeed);
        }
    }

    requestAnimationFrame(gameLoop);
};

/* ================= GAME OVER ================= */
const endGame = () => {
    gameOver = true;

    /* PARA PULO */
    mario.classList.remove('jump');

    /* SPRITE GAME OVER */
    mario.src = 'game-over.png';
    mario.style.width = '70px';
    mario.style.marginLeft = '50px';

    /* RECORD */
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreEl.innerText = highScore;
    }

    /* MODAL */
    finalScoreEl.innerText = score;
    finalConesEl.innerText = cones;
    finalHighScoreEl.innerText = highScore;

    gameOverModal.style.display = 'flex';
};

/* ================= REINICIAR ================= */
const startGame = () => {
    gameOver = false;
    score = 0;
    cones = 0;
    pipeSpeed = baseSpeed;

    scoreEl.innerText = score;
    conesEl.innerText = cones;

    pipeX = window.innerWidth + 300;
    pipe.style.left = `${pipeX}px`;

    /* RESTAURA MARIO */
    mario.src = 'mario.gif';
    mario.style.width = '140px';
    mario.style.marginLeft = '0';
    mario.style.bottom = '0';

    gameOverModal.style.display = 'none';

    requestAnimationFrame(gameLoop);
};

/* ================= BOTÕES ================= */
restartBtn.addEventListener('click', startGame);

shareBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(
`Olha meu recorde no Mario Jump 😎
🏃‍♂️ Score: ${score}
🧱 Canos: ${cones}
🏆 Recorde: ${highScore}`
    );
    alert('Mensagem copiada!');
});

document.addEventListener('keydown', jump);

startGame();
