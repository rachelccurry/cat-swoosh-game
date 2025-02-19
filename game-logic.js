// Rachel Curry
// Cat Swoosh Game Logic
// February 4th, 2025

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let restartButton = document.getElementById("restartButton");
let gameOver = false;
let gameOverMessage = false;

// canvas size
canvas.width = 400;
canvas.height = 300;

// ground position
let groundY = canvas.height - 30;

// cat properties
const radius = 12.5;
let x = 50;
let y = groundY - radius;
let velocity = 0;
const gravity = 0.5;
const jumpPower = -10;
let isJumping = false;

// obstacles
let obstacles = [
    {
        x: canvas.width,
        y: groundY - 30,
        width: 30,
        height: 30,
        speed: Math.random() * 3 + 3,
        color: "red",
        active: false
    },
    {
        x: canvas.width,
        y: groundY - 40,
        width: 20,
        height: 40,
        speed: Math.random() * 3 + 3,
        color: "blue",
        active: false
    }
];

let currentObstacle = null;
let obstacleDelay = true;

// method to do a normal jump
document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !isJumping) {
        velocity = jumpPower;
        isJumping = true;
    }
});

// start button
let startButton = document.getElementById("startButton");

startButton.addEventListener("click", function() {
    startButton.style.display = "none"; // Hide the start button
    switchObstacle();
    update(); // Start the game loop

    // Enable obstacle1 movement after 1.5 seconds
    setTimeout(() => {
        obstacleDelay = false;
    }, 1200);
});


// restart game button
restartButton.addEventListener("click", function() {
    gameOver = false;
    restartButton.style.display = "none";
    resetGame();
    update();

    // Enable obstacle1 movement after 1.5 seconds
    setTimeout(() => {
        obstacleDelay = false;
    }, 1200);
});

// main game going
function update() {
    if (gameOver) return;

    // Apply gravity
    velocity += gravity;
    y += velocity;

    // Stop at the ground
    if (y >= groundY - radius) {
        y = groundY - radius;
        velocity = 0;
        isJumping = false;
    }

    // Move the active obstacle
    if (currentObstacle && !obstacleDelay) {
        currentObstacle.x -= currentObstacle.speed;

        // Reset when it goes off-screen
        if (currentObstacle.x + currentObstacle.width < 0) {
            switchObstacle(); // Choose a new obstacle
        }
    }

    // Collision detection
    if (
        currentObstacle &&
        x + radius > currentObstacle.x &&
        x - radius < currentObstacle.x + currentObstacle.width &&
        y + radius > currentObstacle.y
    ) {
        // switch for actual popup, not browser popup
        gameOver = true;
        gameOverMessage = true;
        restartButton.style.display = "block";
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the "Game Over" popup if game is over
    if (gameOverMessage) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
        ctx.fillRect(50, 80, 300, 100); // Popup box

        ctx.fillStyle = "white"; // Text color
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width / 2, 120);

        ctx.font = "16px Arial";
        ctx.fillText("Click Restart to try again", canvas.width / 2, 150);
    }

    // Draw ground
    ctx.fillStyle = "black";
    ctx.fillRect(0, groundY, canvas.width, 5);

    // Draw cat
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "pink";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Draw active obstacle
    if (currentObstacle) {
        ctx.fillStyle = currentObstacle.color;
        ctx.fillRect(currentObstacle.x, currentObstacle.y, currentObstacle.width, currentObstacle.height);
    }

    requestAnimationFrame(update);
}

// switching between random obstacles
function switchObstacle() {
    let nextObstacle = Math.random() < 0.5 ? obstacles[0] : obstacles[1]; // 50/50 chance

    // Ensure it's different from the last one
    if (currentObstacle === nextObstacle) {
        nextObstacle = obstacles[0] === currentObstacle ? obstacles[1] : obstacles[0];
    }

    nextObstacle.x = canvas.width; // Reset position
    nextObstacle.speed = Math.random() * 3 + 3; // Randomize speed
    currentObstacle = nextObstacle;
}

// reset game
function resetGame() {
    x = 50;
    y = groundY - radius;
    velocity = 0;
    isJumping = false;
    obstacleDelay = true;

    obstacles.forEach(obstacle => {
        obstacle.x = canvas.width;
    });

    gameOver = false;
    gameOverMessage = false;
    restartButton.style.display = "none";
    switchObstacle(); // Start with a random obstacle
}