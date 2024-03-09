document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const playerSize = 40;
    const playerImage = new Image();
    playerImage.onload = function() {
        draw(); // This call will ensure that the drawing is done after the image is loaded.
    };
    playerImage.src = 'player.png';
    const layerWidth = 80; // Width of the openings for barrels to fall through
    const ladderXOffset = 200; // Distance from the right or left side for ladder positioning
    const ladderWidth = layerWidth / 2; // Half the width of the layer
    const ladderHeight = 80; // Height of the ladder
    const playerSpeed = 10; // Player's movement speed
    let playerX = 0; // Start the player all the way to the left
    let playerY = canvas.height - playerSize - 50; // Initial player bottom position
    let isJumping = false;
    let canMove = false; // Flag to control player movement
    let jumpsLeft = 2; // Number of jumps left before landing
    let currentLayer = 0; // Track the current layer the player is on
    const ladderPositions = []; // Array to store ladder positions
    let isOnLadder = false; // Track if the player is on a ladder
    let greenRectangles = []; // Array to store green rectangles
    let lives = 3; // Number of lives
    let level = 1; // Current level
    let previousPlayerY = playerY; // Variable to store the player's previous Y position
    let countdown = -15; // Initial countdown value
    let purpleSquareX = 333; // X coordinate of the purple square
    let purpleSquareY = 333; // Y coordinate of the purple square
    let purpleSquareSize = 40; // Size of the purple square
    let blueSquareX = 100; // X coordinate of the blue square
    let blueSquareY = 100; // Y coordinate of the blue square
    let blueSquareSize = 40; // Size of the blue square
    let pinkSquare = {
        x: 0, // Initial x position
        y: canvas.height - playerSize - 50, // Initial y position
        size: playerSize, // Size of the pink square
        isInvincible: false, // Invincibility state
        invincibilityTimer: 0, // Invincibility timer
        // Add any other properties or methods specific to the pink square
    };
    let isInvincible = false; // Track if the player is invincible
    let invincibilityTimer = 0; // Timer for invincibility
    let score = 0; // Player's score
// Add a flag to control the visibility of the pink square
let isPinkSquareVisible = true;
let isDonkeyKongVisible = true;
// Variable to store the last console log message
let lastConsoleLogMessage = "";


const dkImage = new Image();
dkImage.src = 'file:///C:/Donkey Kong/dk.png';
// Function to log a message and store it

function logAndStore(message) {
    console.log(message);
    lastConsoleLogMessage = message;
}

function drawDonkeyKong() {
    if (isDonkeyKongVisible) {
        // Draw Donkey Kong only if he is visible
        ctx.drawImage(dkImage, playerX + playerSize - 60, playerY - 60, 60, 60);
    }
}




// Set the flag to false after 10 seconds
setTimeout(() => {
    isPinkSquareVisible = false;
}, 10000); // 10 seconds delay
    // Generate ladder positions for each layer
    for (let i = 0; i < 5; i++) {
        let x;
        if (i % 2 === 0) { // Even index, place ladder on the right side
            x = canvas.width - ladderXOffset - ladderWidth;
        } else { // Odd index, place ladder on the left side
            x = ladderXOffset;
        }
        const y = canvas.height - 50 - (i + 1) * 100 + 10; // Place the ladder in the middle of each layer
        ladderPositions.push({ x, y });
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        // Move the score text over 100 pixels
        ctx.fillText(`Score: ${score}`, canvas.width - 60 - 100, 20); // Adjusted x-coordinate
    }

// Function to draw "HAMMERTIME" in red letters when the pink square is on the screen
function drawHammerTime() {
    if (isPinkSquareVisible) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        // Position "HAMMERTIME" on the same level as the level one text, which is moved 100 pixels to the right
        ctx.fillText("HAMMERTIME", canvas.width - 500, 595); // Adjusted y-coordinate to match level one text
    }
}

    function drawPlayer() {
        if (isInvincible) {
            // Draw the pink square
            ctx.fillStyle = 'pink';
            ctx.fillRect(pinkSquare.x, pinkSquare.y, pinkSquare.size, pinkSquare.size);
        } else {
            // Draw the white square
            ctx.fillStyle = '#fff';
            ctx.fillRect(playerX, playerY, playerSize, playerSize);
        }
        
    }
    

    function drawSolidObjects() {
        ctx.fillStyle = '#8B4513'; // Brown color
        let yPos = canvas.height - 50;
        let openingSide = 'right';
    
        for (let i = 0; i < canvas.height; i += 100) {
            if (i === playerY) { // Check if the current layer is the player's layer
                ctx.fillRect(0, yPos, canvas.width, 20); // Full brown bar for player's layer with height 20px
            } else {
                // For both levels, maintain the original logic for opening sides
                if (openingSide === 'left') {
                    ctx.fillRect(0, yPos, canvas.width - layerWidth, 20); // Brown blocks on the left side
                    openingSide = 'right';
                } else {
                    ctx.fillRect(layerWidth, yPos, canvas.width - layerWidth, 20); // Brown blocks on the right side
                    openingSide = 'left';
                }
            }
            yPos -= 100;
        }
    
        // Draw ladders
        ctx.fillStyle = '#008000'; // Green color for ladders
        ladderPositions.forEach(ladder => {
            let adjustedX = ladder.x; // Initialize adjusted X position
    
            // Adjust ladder positions for level 2 and level 3
            if (level === 2 || level === 3) {
                // Flip ladder positions opposite
                adjustedX = canvas.width - ladder.x - ladderWidth;
            }
    
            ctx.fillRect(adjustedX, ladder.y, ladderWidth, ladderHeight); // Ladder size
        });
    }

    // Function to draw Donkey Kong
    function drawDonkeyKong() {
        greenRectangles.forEach(rectangle => {
            const image = new Image();
            image.src = 'file:///C:/Donkey Kong/wp.png'; // Use wp.png for all rectangles
            ctx.drawImage(image, rectangle.x, rectangle.y, 40, 40);
        });


        // Adjust position for level 2 and level 3
        if (level === 2 || level === 3) {
            // Position the Donkey Kong square 666 pixels from the right side
            ctx.fillRect(canvas.width - 100 - 60, 90, 60, 60); // Adjusted position for level 2 and level 3
        } else {
            ctx.fillRect(canvas.width - 100 - 60, 90, 60, 60); // Original position
        }
    }

    // Function to draw the level indicator
    function drawLevel() {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Level: ${level}`, 10, canvas.height - 10);
    }

    // Function to draw the countdown timer
    function drawCountdown() {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Countdown: ${countdown}`, canvas.width / 2 - 50, 30);
    }

    // Function to draw the lives counter
    function drawLives() {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Lives: ${lives}`, 10, 30);
    }

// Modify the movePlayer function to adjust the pink square's position
function movePlayer(direction) {
    if (direction === 'left') {
        // Move the player to the left and attach the pink square to the left side
        playerX -= playerSpeed;
        pinkSquare.x = playerX - pinkSquare.size; // Attach to the left side
    } else if (direction === 'right') {
        // Move the player to the right and attach the pink square to the right side
        playerX += playerSpeed;
        pinkSquare.x = playerX + playerSize; // Attach to the right side
    }
    draw();
}

// Update the keydown event listener to correctly call movePlayer
document.addEventListener('keydown', function(event) {
    if (!canMove) return; // If canMove is false, exit the function early
    if (!isJumping) {
        if (event.key === 'ArrowLeft' && playerX > 0) {
            movePlayer('left'); // Move left and attach pink square to the left
        } else if (event.key === 'ArrowRight' && playerX + playerSize < canvas.width) {
            movePlayer('right'); // Move right and attach pink square to the right
        } else if (event.key === 'ArrowUp') {
            climbUp();
        } else if (event.key === 'ArrowDown') {
            climbDown();
        }
    }
    if (event.key === ' ') {
        jump();
    }
    checkCollisions();
    checkLevelTransition(); // Check for level transition after every key press
    draw();
});

    // Function to draw the purple square
function drawPurpleSquare() {
    ctx.fillStyle = 'purple';
    purpleSquareY = 10; // Set the Y coordinate of the purple square to 10 pixels from the top
    ctx.fillRect(purpleSquareX, purpleSquareY, purpleSquareSize, purpleSquareSize);
}

    function drawBlueSquare() {
        ctx.fillStyle = 'blue'; // Set the fill color to blue
        ctx.fillRect(blueSquareX, blueSquareY, blueSquareSize, blueSquareSize); // Draw the blue square
    }
    // Function to clear the canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
        clearCanvas();
        drawDonkeyKong();
        drawPlayer(); // This will now correctly draw the pink square when the player is invincible
        drawSolidObjects();
        drawLives();
        drawLevel();
        drawCountdown();
        drawPurpleSquare();
        drawHammerTime();
        
    
    // Adjust blue square position based on the level
    if (level === 2) {
        blueSquareX = 200; // Example adjustment for level 2
        blueSquareY = 200; // Example adjustment for level 2
    } else if (level === 3) {
        blueSquareX = 300; // Example adjustment for level 3
        blueSquareY = 300; // Example adjustment for level 3
    } else if (level === 4) {
        blueSquareX = 400; // Example adjustment for level 3
        blueSquareY = 400; // Example adjustment for level 3    
    }
    
    drawBlueSquare(); // Draw the blue square with the adjusted position
    drawScore();
}
    
function drawPinkSquare() {
    ctx.fillStyle = 'pink'; // Ensure the fill color is set to pink
    ctx.fillRect(pinkSquare.x, pinkSquare.y, pinkSquare.size, pinkSquare.size);
}
    // Function to handle player jumping
    function jump() {
        if (!isJumping && jumpsLeft > 0 && !isOnLadder) {
            isJumping = true;
            previousPlayerY = playerY; // Store the player's current Y position before the jump
            playerY -= 50; // Move the player up 50 pixels
            jumpsLeft--;
            setTimeout(() => {
                isJumping = false;
                applyGravity();
                checkJumpCompletion(); // Call checkJumpCompletion after applying gravity
            }, 700); // Reduced jump duration to 700 milliseconds
        }
    }

    // Function to apply gravity to the player
    function applyGravity() {
        const groundLevel = canvas.height - playerSize - 50 - (currentLayer * 100);
        if (playerY < groundLevel) {
            playerY += 10;
            draw();
            requestAnimationFrame(applyGravity);
        } else {
            playerY = groundLevel;
            jumpsLeft = 2;
            draw();
        }
    }

// Function to handle player climbing up
function climbUp() {
    for (const ladder of ladderPositions) {
        let adjustedX = ladder.x; // Initialize adjusted X position

        // Adjust ladder positions for level 2 and level 3
        if (level === 2 || level === 3) {
            // Flip ladder positions opposite
            adjustedX = canvas.width - ladder.x - ladderWidth;
        }

        // Check if the player is on a ladder
        if (
            playerX + playerSize >= adjustedX &&
            playerX <= adjustedX + ladderWidth &&
            playerY + playerSize >= ladder.y &&
            playerY <= ladder.y + ladderHeight
        ) {
            playerY -= 100;
            currentLayer++;
            draw();
            return;
        }

      
        
    }
}

    // Function to handle player climbing down
    function climbDown() {
        for (const ladder of ladderPositions) {
            if (
                playerX + playerSize >= ladder.x &&
                playerX <= ladder.x + ladderWidth &&
                playerY + playerSize >= ladder.y &&
                playerY <= ladder.y + ladderHeight
            ) {
                if (!isOnLadder) {
                    playerY += 50;
                    currentLayer--;
                }
                isOnLadder = true;
                draw();
                return;
            }
        }
    }

    function moveGreenRectangle(rectangle) {
        // Adjust the movement direction based on the level and the initial direction
        if (rectangle.direction === 'left' && level === 1 || rectangle.direction === 'right' && level === 2) {
            rectangle.x -= rectangle.speed;
        } else {
            rectangle.x += rectangle.speed;
        }
        // The rest of the function remains the same
        const solidObjectsY = canvas.height - 90;
        if (rectangle.y + 40 >= solidObjectsY) {
            if (rectangle.x < canvas.width - layerWidth && rectangle.x + 40 > layerWidth) {
                rectangle.speed *= -1;
                rectangle.y = solidObjectsY - 40;
            }
        }
        if (rectangle.x <= 39 || rectangle.x >= canvas.width - 79) {
            rectangle.y += 100;
            rectangle.speed *= -1;
        }
        if (currentLayer === 0 && rectangle.y >= canvas.height - 90 - 20) {
            rectangle.speed = -5;
            rectangle.y = canvas.height - 90 - 20;
        }
        if (rectangle.y >= canvas.height - 90 - 50) {
            rectangle.speed = 5;
        }
    }

    // Function to generate a green rectangle (barrel)
    function generateGreenRectangle() {
        // Determine the initial X position based on the level
        let initialX = level === 1 ? canvas.width - 160 : canvas.width - 60 - 40; // Adjust for level 2
        const randomY = 110;
        let speed = 5; // Default speed

         // Increase speed by 0.2 on level 2, 0.4 on level 3, and 0.6 on level 4
    if (level === 2) {
        speed += 0.1;
    } else if (level === 3) {
        speed += 0.3;
    } else if (level === 4) {
        speed += 0.6;
    }

        const direction = level === 1 ? 'left' : 'right'; // Adjust direction based on the level
        greenRectangles.push({ x: initialX, y: randomY, speed, direction });
    }

    // Function to check if a jump is completed
    function checkJumpCompletion() {
        // Check if the player's Y position is higher than their previous Y position and if they jumped over a green rectangle
        if (playerY < previousPlayerY) {
            for (let i = 0; i < greenRectangles.length; i++) {
                const rectangle = greenRectangles[i];
                // Check if the player is above the rectangle and within a certain range of its top edge
                if (
                    playerX < rectangle.x + 40 &&
                    playerX + playerSize > rectangle.x &&
                    previousPlayerY + playerSize <= rectangle.y && // Check if the previous Y position was below the green rectangle
                    playerY + playerSize >= rectangle.y - 15 // Check if the current Y position is within 15 pixels of the rectangle's top edge
                ) {
                    // Calculate the score based on the player's proximity to the center of the rectangle
                    // This is a simplified example; you might need to adjust the formula to match the scoring mechanism of Donkey Kong
                    const proximityScore = Math.max(0, 100 - Math.abs(playerX + playerSize / 2 - (rectangle.x + 20)));
                    score += proximityScore;
                    console.log(`Score: ${score}`);
                }
            }
        }
        previousPlayerY = playerY; // Update the player's previous Y position for the next jump
    }

    function checkCollisions() {
        
        if (
            playerX < blueSquareX + blueSquareSize &&
            playerX + playerSize > blueSquareX &&
            playerY < blueSquareY + blueSquareSize &&
            playerY + playerSize > blueSquareY
        ) {
            // Player collided with the blue square
            pinkSquare.x = playerX; // Set the pink square's x position to the player's current x position
            pinkSquare.y = playerY; // Set the pink square's y position to the player's current y position
            pinkSquare.isInvincible = true;
            pinkSquare.invincibilityTimer = 10; // Set invincibility timer to 10 seconds
            // Remove the blue square from the game (make it disappear)
            blueSquareX = -100; // Move it off-screen or set it to an invalid position
            blueSquareY = -100; // Move it off-screen or set it to an invalid position
        
            // Transition the player to the pink square
            playerX = pinkSquare.x;
            playerY = pinkSquare.y;
            isInvincible = true; // Update the player's invincibility state
        
            draw(); // Ensure the draw function is called to update the canvas
        }
        const donkeyKongX = canvas.width - 100 - 60; // Adjusted position for level 2 and level 3
        const donkeyKongY = 90;
        if (
            pinkSquare.x < donkeyKongX + 60 &&
            pinkSquare.x + pinkSquare.size > donkeyKongX &&
            pinkSquare.y < donkeyKongY + 60 &&
            pinkSquare.y + pinkSquare.size > donkeyKongY
        ) {
            // Collision detected between pink square and Donkey Kong
            if (level === 1) {
                // Move Donkey Kong off-screen for level 1
                isDonkeyKongVisible = false; // Don't draw Donkey Kong
                console.log("Donkey Kong has been defeated!");
            } else if (level >= 2) {
                // Allow Donkey Kong to reappear for level 2 and above
                isDonkeyKongVisible = true; // Draw Donkey Kong
                console.log("Donkey Kong has reappeared!");
            }
        }
    
    
        // Existing logic for handling collisions with green rectangles...
    
// Check for collision with green rectangles
for (let i = 0; i < greenRectangles.length; i++) {
    const rectangle = greenRectangles[i];
    if (
        playerX < rectangle.x + 40 &&
        playerX + playerSize > rectangle.x &&
        playerY < rectangle.y + 40 &&
        playerY + playerSize > rectangle.y
    ) {
        // Collision detected
        if (isInvincible) {
            // Player is invincible, so remove the green rectangle and add to score
            score += 100; // Increase the player's score by 100 points
            greenRectangles.splice(i, 1); // Remove the green rectangle from the array
            i--; // Decrement the index to account for the removed rectangle
        } else {
            // Player is not invincible, so handle the collision normally
            lives--;
            if (lives <= 0) {
                // Game over
                resetGame();
            } else {
                resetPlayerPosition();
            }
        }
        break; // Only allow one collision per frame
    }
}
    }

    // Function to reset the player's position
    function resetPlayerPosition() {
        playerX = 0;
        playerY = canvas.height - playerSize - 50;
        currentLayer = 0;
        isOnLadder = false;
        jumpsLeft = 2;
        if (level === 2 || level === 3 || level === 4) {
            // Adjust player position for level 2, level 3, and level 4
            playerX = canvas.width - playerSize - 80; // Set player X position to 40 pixels from the right wall for level 2
            playerY = canvas.height - playerSize - 50; // Set player Y position to 40 pixels from the bottom
        }
    }

    // Function to reset the game
    function resetGame() {
        // Reset player position, lives, level, and any other necessary game state
        resetPlayerPosition();
        lives = 3;
        level = 1;
        // You may add additional reset logic here as needed
    }

    // Countdown timer function
    function startCountdown() {
        const countdownInterval = setInterval(() => {
            countdown++;
            draw();
            if (gameOver) {
                clearInterval(countdownInterval);
                            }
        }, 1000); // Update countdown every second
    }

    startCountdown(); // Start the countdown timer

    // Delay arrow key event listeners for 10 seconds
    setTimeout(() => {
        document.addEventListener('keydown', function(event) {
            if (!isJumping) {
                if (event.key === 'ArrowLeft' && playerX > 0) {
                    movePlayer('left'); // Move left and attach pink square to the left
                } else if (event.key === 'ArrowRight' && playerX + playerSize < canvas.width) {
                    movePlayer('right'); // Move right and attach pink square to the right
                } else if (event.key === 'ArrowUp') {
                    climbUp(); // Move up
                } else if (event.key === 'ArrowDown') {
                    climbDown(); // Move down
                }
            }
            if (event.key === ' ') {
                jump();
            }
            checkCollisions();
            checkLevelTransition(); // Check for level transition after every key press
            draw();
        });
    }, 15); // 10 seconds delay

    // Function to generate a random spawn time for green rectangles (barrels)
    function randomSpawnTime(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to spawn green rectangles (barrels) at random intervals
    function spawnGreenRectangle() {
        // Determine the minimum and maximum spawn intervals based on the current level
        let minInterval, maxInterval;
        if (level === 1) {
            minInterval = 1500; // Minimum interval for level 1
            maxInterval = 4500; // Maximum interval for level 1
        } else if (level === 2 || level === 3 || level === 4) {
            minInterval = 999; // Minimum interval for level 2, level 3, and level 4
            maxInterval = 1999; // Maximum interval for level 2, level 3, and level 4
        }

        // Generate a random spawn interval within the specified range for the current level
        const randomInterval = randomSpawnTime(minInterval, maxInterval);

        // Generate a green rectangle and draw it
        generateGreenRectangle();
        draw();

        // Schedule the next spawn after the random interval
        setTimeout(spawnGreenRectangle, randomInterval);
    }

    spawnGreenRectangle(); // Start the spawning process

// Function to handle the game loop
setInterval(() => {
    greenRectangles.forEach(moveGreenRectangle);
    checkCollisions(); // Check collisions every frame
    draw();

    // Decrement the invincibility timer if the player is invincible
    if (isInvincible && invincibilityTimer > 0) {
        invincibilityTimer--;
        // Check if the invincibility timer has expired
        if (invincibilityTimer === 0) {
            // Revert the player back to the white square
            isInvincible = false;
            // Reset the player's position to the default (white square)
            playerX = 0;
            playerY = canvas.height - playerSize - 50;
            // Reset other necessary states
            isOnLadder = false;
            jumpsLeft = 2;
            currentLayer = 0;
            // Redraw the canvas to reflect the changes
            draw();
        }
    }
    function hidePinkSquareAfterDelay() {
        setTimeout(() => {
            isPinkSquareVisible = false;
        }, 10000); // 10 seconds delay
    }
    // Check if the player is on level 1 and the score has reached or exceeded 500
    if (level === 1 && score >= 300) {
        // Deactivate the pink square
        isPinkSquareVisible = false;

        // Revert the player back to the white square
        isInvincible = false;

        // Prevent any further score additions by setting the score to 500
        score = 300;
    }
}, 30); // Move green rectangles every 1 second

    // Array of image paths
    if (score >= 300) {
        // Deactivate the pink square
        isPinkSquareVisible = false;

        // Revert the player back to the white square
        isInvincible = false;
    }
    
    // Function to check for level transition
    function checkLevelTransition() {
        // Check for collision with the purple square for both the white square and the pink square
        if (
            (playerX < purpleSquareX + purpleSquareSize &&
            playerX + playerSize > purpleSquareX &&
            playerY < purpleSquareY + purpleSquareSize &&
            playerY + playerSize > purpleSquareY) ||
            (pinkSquare.x < purpleSquareX + purpleSquareSize &&
            pinkSquare.x + pinkSquare.size > purpleSquareX &&
            pinkSquare.y < purpleSquareY + purpleSquareSize &&
            pinkSquare.y + pinkSquare.size > purpleSquareY)
        ) {
            // Collision detected with the purple square
            // Increment the level
            level++;
    
            // Reset necessary game states
            resetGameStatesForNextLevel();
    
            // Log a message and store it
            logAndStore(`After level ${level - 1}`);
        }
// Define the maximum scores for each level
const maxScores = [300, 600, 800, 1200]; // Maximum scores for levels 1 to 4

function checkLevelTransition() {
    // Check for collision with the purple square for both the white square and the pink square
    if (
        (playerX < purpleSquareX + purpleSquareSize &&
        playerX + playerSize > purpleSquareX &&
        playerY < purpleSquareY + purpleSquareSize &&
        playerY + playerSize > purpleSquareY) ||
        (pinkSquare.x < purpleSquareX + purpleSquareSize &&
        pinkSquare.x + pinkSquare.size > purpleSquareX &&
        pinkSquare.y < purpleSquareY + purpleSquareSize &&
        pinkSquare.y + pinkSquare.size > purpleSquareY)
    ) {
        // Collision detected with the purple square
        // Increment the level
        level++;

        // Reset necessary game states
        resetGameStatesForNextLevel();

        // Log a message and store it
        logAndStore(`Transitioned to level ${level} after reaching the purple square.`);
    }

    // Specific conditions for each level based on score
    if (level === 1 && score >= 300) {
        // Deactivate the pink square
        isPinkSquareVisible = false;

        // Revert the player back to the white square
        isInvincible = false;

        // Prevent any further score additions by setting the score to 300
        score = 300;
    } else if (level === 2 && score >= 600) {
        // Deactivate the pink square
        isPinkSquareVisible = false;

        // Revert the player back to the white square
        isInvincible = false;

        // Prevent any further score additions by setting the score to 600
        score = 600;
    } else if (level === 3 && score >= 900) {
        // Deactivate the pink square
        isPinkSquareVisible = false;

        // Revert the player back to the white square
        isInvincible = false;

        // Prevent any further score additions by setting the score to 900
        score = 900;
    } else if (level === 4 && score >= 1200) {
        // Deactivate the pink square
        isPinkSquareVisible = false;

        // Revert the player back to the white square
        isInvincible = false;

        // Prevent any further score additions by setting the score to 1200
        score = 1200;
    }
}

// Ensure the checkLevelTransition function is called continuously during the game
setInterval(checkLevelTransition, 1000 / 60); // 60 FPS
    }
    
    function resetGameStatesForNextLevel() {
        // Reset player position, score, and any other necessary game states
        resetPlayerPosition();
        isPinkSquareVisible = true; // Ensure the pink square is visible for the next level
        isInvincible = false; // Reset invincibility state
        // Add any other necessary resets for the next level
    }
    
    function resetPlayerPosition() {
        // Reset the player's position to the default for the new level
        if (level === 1) {
            playerX = 0; // Default position for level 1
            playerY = canvas.height - playerSize - 50; // Default position for level 1
        } else if (level === 2) {
            // Adjusted position for level 2
            playerX = canvas.width - playerSize - 80; // Set player X position to 40 pixels from the right wall for level 2
            playerY = canvas.height - playerSize - 50; // Set player Y position to 40 pixels from the bottom
        } else if (level === 3 || level === 4) {
            // Additional adjustments for level 3 and level 4 if necessary
            // Example:
            playerX = canvas.width - playerSize - 80; // Example position for level 3 and 4
            playerY = canvas.height - playerSize - 50; // Example position for level 3 and 4
        }
        // Add any other necessary resets for the player's position
        currentLayer = 0;
        isOnLadder = false;
        jumpsLeft = 2;
    }
 
});
