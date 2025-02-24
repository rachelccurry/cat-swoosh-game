// Rachel Curry
// Cat Swoosh Game Logic
// February 4th, 2025

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let restartButton = document.getElementById("restartButton");
let gameOver = false;
let gameOverMessage = false;

canvas.width = 400;
canvas.height = 300;

let groundY = canvas.height - 30;

const radius = 12.5;
let x = 50;
let y = groundY - radius;
let velocity = 0;
const gravity = 0.5;
const jumpPower = -10;
let isJumping = false;
let isSpaceHeld = false;

let obstacles = [
    {
        x: canvas.width,
        y: groundY - 30,
        width: 30,
        height: 30,
        speed: Math.random()*3+3,
        color: "red",
        active: false
    },
    {
        x: canvas.width,
        y: groundY - 40,
        width: 20,
        height: 40,
        speed: Math.random()*3+3,
        color: "blue",
        active: false
    },
    {
        x: canvas.width,
        y: groundY - 50,
        width: 40,
        height: 50,
        speed: Math.random()*3+3,
        color: "purple",
        active: false
    }
];

let currentObstacle = null;
let obstacleDelay = true;

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !isJumping) {
        velocity = jumpPower;
        isJumping = true;
        isSpaceHeld = true;
    }
});

let startButton = document.getElementById("startButton");

startButton.addEventListener("click", function() {
    startButton.style.display = "none";
    switchObstacle();
    update();

    setTimeout(() => {
        obstacleDelay = false;
    }, 1200);
});

restartButton.addEventListener("click", function() {
    gameOver = false;
    restartButton.style.display = "none";
    resetGame();
    update();

    setTimeout(() => {
        obstacleDelay = false;
    }, 1200);
});

function update() {
    if (gameOver) return;
    
    velocity += gravity;
    y += velocity;

    if (y >= groundY - radius) {
        y = groundY - radius;
        velocity = 0;
        isJumping = false;
        isHovering = false;
    }

    if (currentObstacle && !obstacleDelay) {
        currentObstacle.x -= currentObstacle.speed;

        if (currentObstacle.x + currentObstacle.width < 0) {
            switchObstacle();
        }
    }

    if (
        currentObstacle &&
        x + radius > currentObstacle.x &&
        x - radius < currentObstacle.x + currentObstacle.width &&
        y + radius > currentObstacle.y
    ) {
        gameOver = true;
        gameOverMessage = true;
        restartButton.style.display = "block";
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOverMessage) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(50, 80, 300, 100);

        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width / 2, 120);

        ctx.font = "16px Arial";
        ctx.fillText("Click Restart to try again", canvas.width / 2, 150);
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, groundY, canvas.width, 5);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "pink";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    if (currentObstacle) {
        ctx.fillStyle = currentObstacle.color;
        ctx.fillRect(currentObstacle.x, currentObstacle.y, currentObstacle.width, currentObstacle.height);
    }

    requestAnimationFrame(update);
}

function switchObstacle() {
    let nextObstacle;
    
    do {
        nextObstacle = obstacles[Math.floor(Math.random()*obstacles.length)];
    } while (nextObstacle === currentObstacle);

    nextObstacle.x = canvas.width;
    nextObstacle.speed = Math.random()*3+3;
    
    currentObstacle = nextObstacle;
}

function resetGame() {
    x = 50;
    y = groundY - radius;
    velocity = 0;
    isJumping = false;
    isHovering = false;
    obstacleDelay = true;

    obstacles.forEach(obstacle => {
        obstacle.x = canvas.width;
    });

    gameOver = false;
    gameOverMessage = false;
    restartButton.style.display = "none";
    switchObstacle();
}