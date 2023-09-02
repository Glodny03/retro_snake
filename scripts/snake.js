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


    // Initialize the game canvas, event listeners, and main loop
    function startGame() {

    }

    document.querySelector(".play-button").addEventListener("click", startGame);
    window.onload = startGame; // Start the game when the window loads
})();