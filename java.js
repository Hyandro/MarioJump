const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');


let loop;

const restartGame = () => {
    mario.style.bottom = '0';
    mario.src = './MARIO PNG/mario.gif';
    mario.style.width = '40px';
    mario.style.marginLeft = '0';

    pipe.style.animationPlayState = 'running';

    restartButton.style.display = 'none';

    clearInterval(loop);
    startLoop();
};

const jump = () => {
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 600);
};

const checkCollision = () => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px','');

    if (pipePosition <= 100 && pipePosition > 0 && marioPosition < 80) {
        clearInterval(loop);

        pipe.style.animationPlayState = 'paused';
        pipe.style.left = `${pipePosition}px`;

        const marioNewPosition = 65; 
        mario.style.bottom = `${marioNewPosition}px`;

        mario.src = './MARIO PNG/game-over.png';
        mario.style.width = '70px';
        mario.style.marginLeft = '50px';

        restartButton.style.display = 'block';
    }
};


const startLoop = () => {
    loop = setInterval(() => {
        checkCollision();
    }, 10);
};

startLoop();

document.addEventListener('keydown', jump);

restartButton.addEventListener('click', restartGame);


const meuBotao = document.getElementById('meuBotao');

meuBotao.addEventListener('click', function() {
    realizarAcao();
});

meuBotao.addEventListener('touchstart', function() {
    realizarAcao();
});

function realizarAcao() {
    // Coloque aqui o código que você deseja executar quando o botão for clicado ou tocado.
    console.log('Ação realizada!');
}
