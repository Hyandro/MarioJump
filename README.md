# 🎮 Mario Jump

Mario Jump é um jogo simples inspirado no estilo *endless runner*, desenvolvido com **HTML, CSS e JavaScript**.  
O objetivo é pular os obstáculos, evitar colisões e alcançar a maior pontuação possível.

---

## 🚀 Demonstração

👉 Jogue online:  
https://hyandro.github.io/MarioJump/

---

## 🕹️ Como jogar

- 🖱️ Pressione **Espaço** ou **clique/toque na tela** para pular
- 🧱 Desvie dos canos para sobreviver
- ⚡ A velocidade aumenta a cada 10 canos
- ⏸️ Pressione **P** para pausar o jogo
- 🏆 Quanto mais tempo sobreviver, maior a pontuação
- ☠️ Ao colidir, o jogo termina e seu score é enviado ao ranking

---

## ✨ Funcionalidades

### 🎮 Gameplay
- Sistema de pulo responsivo e preciso
- Velocidade progressiva (aumenta a cada 10 canos)
- Detecção de colisão otimizada com hitbox justa
- Efeitos de partículas ao pular
- Notificações visuais de aumento de velocidade

### 🎵 Áudio
- Música de fundo ambiente
- Efeitos sonoros de pulo e game over
- Controle automático de volume

### 📊 Sistema de Ranking
- Top 5 jogadores em tempo real
- Sincronização com Firebase Firestore
- Validação básica anti-cheat
- Contador de visitas único

### ♿ Acessibilidade
- Navegação completa por teclado
- Atributos ARIA para leitores de tela
- Focus trap nos modais
- Suporte a tecnologias assistivas

### 📱 Responsividade
- Totalmente otimizado para mobile
- Bloqueio de orientação landscape
- Touch controls intuitivos
- Adaptável a diferentes tamanhos de tela

### 🎨 Interface
- Tutorial inicial interativo
- Sistema de pause funcional
- Loading states com animações
- Modais elegantes com animações
- Design moderno e clean

---

## 🛠️ Tecnologias utilizadas

- HTML5 (Semântica e acessibilidade)
- CSS3 (Animações, Flexbox, Media Queries)
- JavaScript ES6+ (Vanilla, sem frameworks)
- Firebase Firestore (Backend e ranking)
- GitHub Pages (Deploy e hospedagem)

---

## 📂 Estrutura do projeto

```
📁 MarioJump
├── index.html              # Estrutura HTML com modais e ARIA
├── style.css               # Estilos responsivos e animações
├── java.js                 # Lógica do jogo e Firebase
├── CHANGELOG.md            # Histórico de melhorias
├── README.md               # Documentação do projeto
├── mario.gif               # Sprite do personagem
├── pipe.png                # Obstáculo (cano)
├── clouds.png              # Elementos decorativos
├── game-over.png           # Sprite de game over
├── musica de fundo.mp3     # Música ambiente
├── cartoon-jump-6462.mp3   # Som de pulo
└── negative_beeps-6008.mp3 # Som de game over
```

---

## 🎹 Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `ESPAÇO` | Pular |
| `P` | Pausar/Despausar |
| `ESC` | Fechar pause |
| `ENTER` | Confirmar em modais |
| `TAB` | Navegar entre elementos |

---

## ⚙️ Configuração Personalizada

O jogo possui constantes configuráveis em `java.js` para fácil customização:

```javascript
const GAME_CONFIG = {
  baseSpeed: 7,              // Velocidade inicial
  speedStep: 0.8,            // Incremento de velocidade
  maxSpeed: 14,              // Velocidade máxima
  speedIncreaseInterval: 10, // Canos até aumentar velocidade
  jumpDuration: 600,         // Duração do pulo (ms)
  jumpHeight: 180,           // Altura do pulo (px)
  scoreInterval: 100,        // Pontuação por segundo
};
```

---

## ▶️ Como executar localmente

1. Clone o repositório:
```bash
git clone https://github.com/Hyandro/MarioJump.git
````

2. Abra o arquivo `index.html` no navegador

---

## 👤 Autor

Desenvolvido por **Hyandro Phillipe**
📍 Brasil
💻 Estudante de Análise e Desenvolvimento de Sistemas

---

## 📜 Licença

Este projeto é livre para fins de estudo e aprendizado.
