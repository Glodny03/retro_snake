(function () {
    // Load assets
    const foodSound = new Audio('../assets/sounds/beep.mp3');
    const gameOverSound = new Audio('../assets/sounds/over.mp3');

    const foodSvg = new Image();
    foodSvg.src = '../assets/food.svg';
    // Initialize the game canvas, event listeners, and main loop
    function startGame() {

    }

    document.querySelector(".play-button").addEventListener("click", startGame);
    window.onload = startGame; // Start the game when the window loads
})();