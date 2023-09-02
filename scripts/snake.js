(function () {
    // Load assets
    const foodSound = new Audio('../assets/sounds/beep.mp3');
    const gameOverSound = new Audio('../assets/sounds/over.mp3');

    const foodSvg = new Image();
    foodSvg.src = '../assets/food.svg';

    // Initialize global variables
    const snakeElementSize = 25;
    const initialSnakeLength = 5;
    const gameLoopIntervalMs = 120;

    // Game state variables
    let isSoundEnabled = true;
    let canvas;
    let context2d;
    let snake = [];
    let snakeVelocityX = 0;
    let snakeVelocityY = 0;
    let pauseGame = true;
    let food = {
        x: 0,
        y: 0,
        color: "white"
    };
    let points = 0;
    let bestScore = 0;
    let currentRound = 0;
    let foodRotationAngle = 0;

    // Function to clear the canvas area
    function clearGameCanvas() {
        context2d.fillStyle = "#91C04C";
        context2d.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines
        context2d.strokeStyle = "#81a945";
        context2d.lineWidth = 0.5;

        // Draw vertical grid lines
        for (let x = 0; x <= canvas.width; x += snakeElementSize) {
            context2d.beginPath();
            context2d.moveTo(x, 0);
            context2d.lineTo(x, canvas.height);
            context2d.stroke();
        };

        // Draw horizontal grid lines
        for (let y = 0; y <= canvas.height; y += snakeElementSize) {
            context2d.beginPath();
            context2d.moveTo(0, y);
            context2d.lineTo(canvas.width, y);
            context2d.stroke();
        };
    };

    // Create the initial snake with a given length
    function createInitialSnake(snakeLength) {
        const startX = canvas.width / 2;
        const startY = canvas.height / 2;

        for (let i = 0; i < snakeLength; i++) {
            snake.push({
                x: startX + i * snakeElementSize,
                y: startY
            });
        };
    };

    // Draw the snake on the canvas
    function drawSnake() {
        context2d.strokeStyle = "#243013";
        context2d.lineWidth = 3;

        // Determine the rounding of corners
        const cornerRadius = 7.5;
        context2d.fillStyle = "#243013";

        snake.forEach(el => {
            context2d.beginPath();
            roundedRect(context2d, el.x, el.y, snakeElementSize, snakeElementSize, cornerRadius);
            context2d.fill();
            context2d.stroke();
            context2d.closePath();
        });
    };

    // Function for drawing a square with rounded corners
    function roundedRect(context, x, y, width, height, radius) {
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
    };

    // Reset the game to its initial state
    function resetGame() {
        const menu = document.getElementById("menu");
        if (!menu || menu.style.display === "none") {
            if (points >= bestScore) {
                bestScore = points;
                document.querySelector(".best_score").innerHTML = `Record ${bestScore}`;
            };
        };

        snake = [];
        currentRound = 0;
        snakeVelocityX = 0;
        snakeVelocityY = 0;
        points = 0;
        createInitialSnake(initialSnakeLength);
        generateRandomFood();
        pauseGame = true;
        gameOverSound.play();
    };

    // Initialize the game canvas, event listeners, and main loop
    function startGame() {

    }

    document.querySelector(".play-button").addEventListener("click", startGame);
    window.onload = startGame; // Start the game when the window loads
})();