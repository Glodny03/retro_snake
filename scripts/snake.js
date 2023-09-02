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

    // Move the snake by updating its position
    function moveSnake(snakeVelocityX, snakeVelocityY) {
        const newHead = {
            x: snake[0].x + snakeVelocityX,
            y: snake[0].y + snakeVelocityY
        };

        snake.unshift(newHead);
        snake.pop();
    };

    // Handling the speaker button click
    const soundToggle = document.getElementById("soundToggle");
    soundToggle.addEventListener("click", toggleSound);

    // Function for toggling sound and speaker icon
    function toggleSound() {
        isSoundEnabled = !isSoundEnabled; // Odwracamy stan dźwięku

        if (isSoundEnabled) {
            soundToggle.innerHTML = '<img src="./assets/speaker1.png" alt="sound">';
            // Enable sounds
            foodSound.muted = false;
            gameOverSound.muted = false;
        } else {
            soundToggle.innerHTML = '<img src="./assets/speaker2.png" alt="sound">';
            // Disable sounds
            foodSound.muted = true;
            gameOverSound.muted = true;
        };
    };

    // Add a variable to store the last used key
    let lastPressedKey = null;

    // Handling keyboard input for controlling the snake's movement
    function handleKeyDown(event) {
        const keyCodes = {
            leftArrow: 37,
            A: 65,
            upArrow: 38,
            W: 87,
            rightArrow: 39,
            D: 68,
            downArrow: 40,
            S: 83,
        };

        const directions = {
            left: {
                x: -snakeElementSize,
                y: 0
            },
            up: {
                x: 0,
                y: -snakeElementSize
            },
            right: {
                x: snakeElementSize,
                y: 0
            },
            down: {
                x: 0,
                y: snakeElementSize
            },
        };

        const directionKeys = Object.fromEntries(
            Object.entries(keyCodes).map(([key, code]) => [
                code,
                directions[key.slice(0, -5).toLowerCase()],
            ])
        );

        if (Object.values(keyCodes).includes(event.keyCode)) {
            pauseGame = false;
        };

        if (!pauseGame) {
            currentRound++;

            const newDirection = directionKeys[event.keyCode];

            if (newDirection) {
                // Check if another key is already pressed
                if (lastPressedKey !== null && lastPressedKey !== event.keyCode) {
                    return; // Ignore the new key if another one is already pressed
                };

                lastPressedKey = event.keyCode; // Update the last pressed key

                const canChangeDirection =
                    (newDirection.x !== 0 && snakeVelocityX === 0) ||
                    (newDirection.y !== 0 && snakeVelocityY === 0);

                if (canChangeDirection) {
                    snakeVelocityX = newDirection.x;
                    snakeVelocityY = newDirection.y;
                };
            };
        };
    };

    document.addEventListener("keyup", function (event) {
        lastPressedKey = null;
    });

    // Touch event handling
    let touchStartX = null;
    let touchStartY = null;

    document.addEventListener("touchstart", function (event) {
        // Store the initial touch coordinates
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });

    document.addEventListener("touchend", function (event) {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal movement
            if (deltaX > 0) {
                // Right movement
                snakeVelocityX = snakeElementSize;
                snakeVelocityY = 0;
            } else {
                // Left movement
                snakeVelocityX = -snakeElementSize;
                snakeVelocityY = 0;
            };
        } else {
            // Vertical movement
            if (deltaY > 0) {
                // Down movement
                snakeVelocityX = 0;
                snakeVelocityY = snakeElementSize;
            } else {
                // Up movement
                snakeVelocityX = 0;
                snakeVelocityY = -snakeElementSize;
            };
        };

        pauseGame = false;
    });

    // Canvas scaling
    function resizeCanvas() {
        const canvasContainer = document.querySelector(".game_wrapper");
        canvas.width = canvasContainer.clientWidth;
        canvas.height = canvasContainer.clientHeight;
    };

    // Call the resizeCanvas() function when the window size changes
    window.addEventListener("resize", resizeCanvas);

    // Generate random food position within canvas boundaries
    function generateRandomFood() {

        const minDistanceFromEdge = 20;

        // Helper function to get a random coordinate within a range and snapped to snakeElementSize
        function getRandomCoordinateInRange(min, max) {
            return Math.floor((Math.random() * (max - min) + min) / snakeElementSize) * snakeElementSize;
        };


        // Generate a set of coordinates for the food
        let foodPosition = {
            x: getRandomCoordinateInRange(minDistanceFromEdge, canvas.width - minDistanceFromEdge),
            y: getRandomCoordinateInRange(minDistanceFromEdge, canvas.height - minDistanceFromEdge)
        };

        // Check if the generated food position is inside the snake
        while (isFoodInsideSnake(foodPosition)) {
            foodPosition = {
                x: getRandomCoordinateInRange(minDistanceFromEdge, canvas.width - minDistanceFromEdge),
                y: getRandomCoordinateInRange(minDistanceFromEdge, canvas.height - minDistanceFromEdge)
            };
        };

        food.x = foodPosition.x;
        food.y = foodPosition.y;
        foodSound.play(); // Odtwarzaj dźwięk przy generowaniu nowego jedzenia
    };

    // Helper function to check if food position is inside the snake
    function isFoodInsideSnake(foodPosition) {
        for (let i = 0; i < snake.length; i++) {
            if (foodPosition.x === snake[i].x && foodPosition.y === snake[i].y) {
                return true;
            };
        };
        return false;
    };

    // Draw the food on the canvas
    function drawFood() {
        foodRotationAngle += 10 * Math.PI / 180;
        context2d.save();
        context2d.translate(food.x + snakeElementSize / 2, food.y + snakeElementSize / 2);
        context2d.rotate(foodRotationAngle);

        if (foodSvg.complete) {
            context2d.drawImage(foodSvg, -snakeElementSize / 2, -snakeElementSize / 2, snakeElementSize, snakeElementSize);
        } else {
            foodSvg.onload = function () {
                context2d.drawImage(foodSvg, -snakeElementSize / 2, -snakeElementSize / 2, snakeElementSize, snakeElementSize);
            };
        };

        context2d.restore();
    };

    // Check if the snake collides with the walls
    function checkWallsCollision() {
        const head = snake[0];
        // Check if the snake's head hits the canvas boundaries
        if (head.x > canvas.width - snakeElementSize || head.x < 0 || head.y > canvas.height - snakeElementSize || head.y < 0) {
            resetGame();
        };
    };

    // Check if the snake collides with itself
    function checkSelfCollision() {
        // Skip collision check in the first round
        if (currentRound <= 4) return;

        // Check collision with the rest of the snake's body
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                resetGame();
                break;
            };
        };
    };

    // Check for snake and food collision
    function checkFoodCollision() {
        if (food.x === snake[0].x && food.y === snake[0].y) {
            snake.push({
                ...snake[snake.length - 1]
            }); // Extend the snake
            generateRandomFood(); // Generate new food
            points += 5; // Increase points
        };
    };

    // Draw current points on the canvas
    function drawScore() {
        document.querySelector(".score").innerHTML = `Score ${points}`;
    };

    // Initialize the game canvas, event listeners, and main loop
    function startGame() {
        canvas = document.getElementById("canvas");
        context2d = canvas.getContext("2d");
        document.addEventListener("keydown", handleKeyDown); // Listen for key events
        resetGame(); // Set up initial game state
        const menu = document.getElementById("menu");

        if (menu.style.display === "none" || menu.style.display === "") {
            menu.style.display = "block";
            canvas.style.display = "none";
        } else {
            menu.style.display = "none";
            canvas.style.display = "block";
            setInterval(() => {
                clearGameCanvas();
                checkWallsCollision();
                checkSelfCollision();
                checkFoodCollision();
                if (!pauseGame) moveSnake(snakeVelocityX, snakeVelocityY);
                drawScore();
                drawFood();
                drawSnake();
            }, gameLoopIntervalMs);

            resetGame();
        }
    }

    document.querySelector(".play-button").addEventListener("click", startGame);
    window.onload = startGame; // Start the game when the window loads
})();