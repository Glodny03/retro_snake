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

    // Initialize the game canvas, event listeners, and main loop
    function startGame() {

    }

    document.querySelector(".play-button").addEventListener("click", startGame);
    window.onload = startGame; // Start the game when the window loads
})();