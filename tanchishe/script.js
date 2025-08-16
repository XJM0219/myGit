// Terminal animation
const terminalBody = document.querySelector('.terminal-body');
let commandIndex = 0;
const commands = [
    '> git status',
    'On branch main',
    'Your branch is up to date with \'origin/main\'',
    'nothing to commit, working tree clean',
    '> npm test',
    'PASS src/utils.test.js',
    'PASS src/components.test.js',
    'Test Suites: 2 passed, 2 total',
    'Tests: 15 passed, 15 total',
    '> '
];

function addCommand() {
    if (commandIndex < commands.length) {
        const p = document.createElement('p');
        p.textContent = commands[commandIndex];
        terminalBody.appendChild(p);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        commandIndex = (commandIndex + 1) % commands.length;
    }
}

setInterval(addCommand, 2000);

// Game logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container');
const fakeTerminal = document.getElementById('fake-terminal');

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
}

let score = 0;
let d;
let gameLoop;

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        event.preventDefault();
        toggleView();
        return;
    }

    if (gameContainer.classList.contains('hidden')) {
        return;
    }

    if (event.keyCode == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (event.keyCode == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode == 40 && d != 'UP') {
        d = 'DOWN';
    }
});

function toggleView() {
    gameContainer.classList.toggle('hidden');
    fakeTerminal.classList.toggle('hidden');
    
    if (!gameContainer.classList.contains('hidden')) {
        if (!gameLoop) {
            gameLoop = setInterval(draw, 100);
        }
    } else {
        clearInterval(gameLoop);
        gameLoop = null;
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? '#27c93f' : '#fff';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = '#444';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = '#ff5f56';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        }
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(gameLoop);
        gameLoop = null;
        score = 0;
        snake = [{ x: 9 * box, y: 10 * box }];
        d = undefined;
        setTimeout(() => {
            if (!gameContainer.classList.contains('hidden')) {
                gameLoop = setInterval(draw, 100);
            }
        }, 1000);
    }

    snake.unshift(newHead);

    ctx.fillStyle = '#fff';
    ctx.font = '20px Consolas';
    ctx.fillText(`Score: ${score}`, 10, 30);
}