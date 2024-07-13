const board = document.getElementById("game-board");
const instrText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const levelDiv = document.getElementById('level');;
let snake = [{
    x: 10,
    y: 10,
}];
let isGameStart = false;
let gameSpeed = 200;
let gridSize = 20;
let food = generateFood();
let block = generateBlock();
let direction = "up";
let highScore = 0;
let gameIntervalId;
let sound = new Audio("./sounds/p.mp3");
let sound1 = new Audio("./sounds/mm.mp3");
let sound2 = new Audio("./sounds/dd.mp3");

function draw() {
    board.innerHTML = "";
    drawSnake();
    drawFood();
    levelTwo();
    updateScore();
    drawBlock();
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createElement("div", "snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement)

    });
}

function createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawFood() {
    let foodElement = createElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement)

}

function generateFood() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

function move() {
    let head = { ...snake[0] }

    switch (direction) {
        case "up":
            head.y--
            break;
        case "down":
            head.y++
            break;
        case "left":
            head.x--
            break;
        case "right":
            head.x++
            break;
    }
    snake.unshift(head);
    sound1.play();
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        sound.play();
        clearInterval(gameIntervalId)
        gameIntervalId = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeed);
    } else {
        snake.pop();
    }
}

document.addEventListener("keydown", handKeyPress);

function handKeyPress(event) {
    if ((!isGameStart && event.code === "Space") ||
        (!isGameStart && event.key === " ")) {
        startGame();
    } else {
        switch (event.key) {
            case "ArrowUp":
                direction = "up"
                break;
            case "ArrowDown":
                direction = "down"
                break;
            case "ArrowLeft":
                direction = "left"
                break;
            case "ArrowRight":
                direction = "right"
                break;

        }
    }
}

function startGame() {
    isGameStart = true;

    logo.style.display = "none";

    gameIntervalId = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeed);

}


function checkCollision() {

    let head = { ...snake[0] };

    if (head.x > gridSize || head.x < 1 || head.y > gridSize || head.y < 1) {
        resetGame();
    }



    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            break;

        }

    }

    for (let i = 1; i < block.length; i++) {
        if (head.x === block[i].x && head.y === block[i].y) {
            resetGame();
            break;

        }

    }



}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = "right";
    gameSpeed = 200;
    updateScore();
    levelTwo();
}

function stopGame() {
    clearInterval(gameIntervalId);
    isGameStart = false;

    logo.style.display = "block";

    sound2.play();
}


function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, "0");
}


function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
    }

    highScoreText.textContent = highScore.toString().padStart(3, "0");
    highScoreText.style.display = "block";
}


function levelTwo() {
    const currentScore = snake.length - 1;
    if (currentScore >= 2) {
        levelDiv.textContent = "Level 2";
    }

}



let blocksAdded = false;

function drawBlock() {
    const currentScore = snake.length - 1;
    if (currentScore >= 2 && !blocksAdded) {
        for (let i = 0; i < block.length; i++) {
            let blockElement = createElement("div", "block");
            setPosition(blockElement, block[i]);
            board.appendChild(blockElement);
        }
    }

}



function generateBlock() {
    let arr = [];

    for (let i = 0; i < 10; i++) {
        let x = Math.floor(Math.random() * gridSize) + 1;
        let y = Math.floor(Math.random() * gridSize) + 1;
        arr.push({ x, y })

    }
    return arr;
}

