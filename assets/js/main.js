// button aura

const inkEffect = (function () {
    let canvas, ctx, button, inkParticles, animationId;

    function init(buttonId) {
        button = document.getElementById(buttonId);
        if (!button) return;

        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        button.appendChild(canvas);

        canvas.width = button.offsetWidth;
        canvas.height = button.offsetHeight;

        inkParticles = [];

        button.addEventListener('mouseenter', startEffect);
        button.addEventListener('mouseleave', stopEffect);
    }

    function startEffect() {
        button.classList.add('hovered');
        createInkEffect();
        addInkParticles();
    }

    function stopEffect() {
        button.classList.remove('hovered');
        inkParticles = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
    }

    function createInkEffect() {
        for (let i = 0; i < 20; i++) {
            inkParticles.push(createParticle());
        }
        animateInk();
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: canvas.height,
            size: Math.random() * 10 + 5,
            speedX: (Math.random() - 0.5) * 2,
            speedY: -Math.random() * 2 - 1,
            opacity: 1
        };
    }

    function animateInk() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'darken';

        inkParticles.forEach((p, index) => {
            ctx.beginPath();
            let gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, `rgba(0, 0, 50, ${p.opacity})`);
            gradient.addColorStop(1, `rgba(0, 0, 50, 0)`);
            ctx.fillStyle = gradient;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            p.x += p.speedX;
            p.y += p.speedY;
            p.size += 0.2;
            p.opacity -= 0.01;

            if (p.opacity <= 0) {
                inkParticles.splice(index, 1);
            }
        });

        if (button.classList.contains('hovered')) {
            animationId = requestAnimationFrame(animateInk);
        }
    }

    function addInkParticles() {
        if (button.classList.contains('hovered')) {
            for (let i = 0; i < 2; i++) {
                inkParticles.push(createParticle());
            }
            setTimeout(addInkParticles, 100);
        }
    }

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    inkEffect.init('start');
});

// button aura

const play = document.querySelector('#start');
const container = document.querySelector('#morpion');
const replay = document.querySelector("#replay");
const message = document.getElementById(`message`);
const pve = document.getElementById(`pve`);
const pvp = document.getElementById(`pvp`);
const toggle = document.querySelector("#toggle");
const gameTitle = document.getElementById('game-title');
let playerOne = "X";
let playerTwo = "O";
let counter = 0;
let gameOver = false;
let vsrobot = false;
let morpion = true;
let tabGame = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
];
let connect = [
    ['', '', '', '', '', '',],
    ['', '', '', '', '', '',],
    ['', '', '', '', '', '',],
    ['', '', '', '', '', '',],
    ['', '', '', '', '', '',],
    ['', '', '', '', '', '',],
    ['', '', '', '', '', '',]
];

function createTab(tab) {
    container.innerHTML = '';
    let grid = document.createElement('div');
    grid.classList.add('grid');
    container.appendChild(grid);
    grid.classList.add(morpion ? `tic-tac-toe` : `connect-four`)
    tab.forEach((row, rowIndex) => {
        let line = document.createElement('div');
        line.classList.add('line');
        row.forEach((column, columnIndex) => {
            let cell = document.createElement('div');
            cell.addEventListener('click', () => {
                choicePlayer(rowIndex, columnIndex);
            });
            switch (column) {
                case playerOne:
                    cell.innerHTML = playerOne;
                    cell.setAttribute(`data-player`, playerOne)
                    break;

                case playerTwo:
                    cell.innerHTML = playerTwo;
                    cell.setAttribute(`data-player`, playerTwo)
                    break;
            }
            cell.classList.add('cell');
            line.appendChild(cell);
        });
        grid.appendChild(line);
    });
}

function choicePlayer(row, column) {
    if (morpion) {
        if (tabGame[row][column] === "" && !gameOver) {
            if (counter % 2 === 0) {
                tabGame[row][column] = playerOne;
                if (vsrobot) {
                   setTimeout(()=>{
                    robot(tabGame);
                    winner(tabGame);
                   },1000)
                }
            } else {
                tabGame[row][column] = playerTwo;
            }
            counter++;
            winner(tabGame);
            createTab(tabGame);
        }
    } else {
        if (connect[0][column] === "" && !gameOver) {
            let dispoRow = checkRow(column);
            if (dispoRow !== -1) {
                if (counter % 2 === 0) {
                    connect[dispoRow][column] = playerOne;
                    if (vsrobot) {
                        setTimeout(()=>{
                         robot(connect);
                         winner(connect);
                        },1000)
                     }
                } else {
                    connect[dispoRow][column] = playerTwo;
                }
                counter++;
                winnerConnect(connect);
                createTab(connect);
            }
        }
    }
}

function checkRow(column) {
    for (let i = connect.length - 1; i >= 0; i--) {
        if (connect[i][column] === "") {
            return i;
        }
    }
    return -1;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function winner(tab) {
    let winner = null;
    for (let i = 0; i < tab.length; i++) {
        if (tab[i][0] && tab[i][0] === tab[i][1] && tab[i][0] === tab[i][2]) {
            winner = tab[i][0];
            break;
        }
    }
    if (!winner) {
        for (let j = 0; j < tab[0].length; j++) {
            if (tab[0][j] && tab[0][j] === tab[1][j] && tab[0][j] === tab[2][j]) {
                winner = tab[0][j];
                break;
            }
        }
    }
    if (!winner) {
        if (tab[0][0] && tab[0][0] === tab[1][1] && tab[0][0] === tab[2][2]) {
            winner = tab[0][0];
        } else if (tab[0][2] && tab[0][2] === tab[1][1] && tab[0][2] === tab[2][0]) {
            winner = tab[0][2];
        }
    }
    if (winner) {
        message.innerHTML = `${winner} Winner !!`;
        gameOver = true;
    } else if (tab.flat().every(cell => cell !== '')) {
        message.innerHTML = "Match Nul !!";
        gameOver = true;
    }
}

function winnerConnect(tab) {
    let winner = null;

    for (let row = 0; row < tab.length; row++) {
        for (let col = 0; col < tab[row].length - 3; col++) {
            if (tab[row][col] && tab[row][col] === tab[row][col + 1] && tab[row][col] === tab[row][col + 2] && tab[row][col] === tab[row][col + 3]) {
                winner = tab[row][col];
                break;
            }
        }
    }
    for (let col = 0; col < tab[0].length; col++) {
        for (let row = 0; row < tab.length - 3; row++) {
            if (tab[row][col] && tab[row][col] === tab[row + 1][col] && tab[row][col] === tab[row + 2][col] && tab[row][col] === tab[row + 3][col]) {
                winner = tab[row][col];
                break;
            }
        }
    }
    for (let row = 3; row < tab.length; row++) {
        for (let col = 0; col < tab[row].length - 3; col++) {
            if (tab[row][col] && tab[row][col] === tab[row - 1][col + 1] && tab[row][col] === tab[row - 2][col + 2] && tab[row][col] === tab[row - 3][col + 3]) {
                winner = tab[row][col];
                break;
            }
        }
    }

    for (let row = 0; row < tab.length - 3; row++) {
        for (let col = 0; col < tab[row].length - 3; col++) {
            if (tab[row][col] && tab[row][col] === tab[row + 1][col + 1] && tab[row][col] === tab[row + 2][col + 2] && tab[row][col] === tab[row + 3][col + 3]) {
                winner = tab[row][col];
                break;
            }
        }
    }
    if (winner) {
        message.innerHTML = `${winner} Winner !!`;
        gameOver = true;
    } else if (tab.flat().every(cell => cell !== '')) {
        message.innerHTML = "Match Nul !!";
        gameOver = true;
    }
}

function reset(tab) {
    tab.forEach((row, i) => {
        row.forEach((column, j) => {
            tab[i][j] = "";
        });
    });
    counter = 0;
    gameOver = false;
    createTab(tab);
    message.innerHTML = ``
}

function robot(tab) {
    if (counter < 8 && morpion == true || counter < 42 && morpion == false) {
        let randomplayerX = random(0, tab.length - 1);
        let randomplayerY = random(0, tab[0].length - 1);
        while (tab[randomplayerX][randomplayerY] != "") {
            randomplayerX = random(0, tab.length - 1);
            randomplayerY = random(0, tab[0].length - 1);
        }
        if (morpion) {
            tab[randomplayerX][randomplayerY] = playerTwo;
        } else {
            let dispoRow = checkRow(randomplayerY);
            if (dispoRow !== -1) {

                connect[dispoRow][randomplayerY] = playerTwo;
            }
        }
        counter++;
        createTab(tab);
    }
} 

function startGame() {
    play.style.display = `none`
    pvp.style.position = `absolute`
    pvp.style.top = `15vh`
    pvp.style.left = `50%`
    pve.style.position = `absolute`
    pve.style.top = `15vh`
    pve.style.left = `47%`
    if (morpion) {
        gameTitle.textContent = "TIC TAC TOE";
        reset(tabGame);
    } else {
        gameTitle.textContent = "CONNECT-4";
        reset(connect);
    }
}

play.addEventListener('click', startGame);
replay.addEventListener('click', () => reset(morpion ? tabGame : connect));
pvp.addEventListener('click', () => {
    vsrobot = false;
    startGame();
});
pve.addEventListener('click', () => {
    vsrobot = true; 
    startGame();
});

toggle.addEventListener('change', () => {
    morpion = !toggle.checked;
    if (morpion) {
        gameTitle.textContent = "TIC TAC TOE";
    } else {
        gameTitle.textContent = "CONNECT-4";
    }
    startGame();
});