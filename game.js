// Optimized game.js file for better performance

// Game variables
let canvas;
let ctx;
let offscreenCanvas;
let offscreenCtx;
let animationFrame;
let gameLoop;
let gameStarted = false;
let gameOver = false;
let score = 0;
let highScore = 0;
let frameCount = 0;
let comboMultiplier = 1;
let comboTimer = 0;
let currentLevel = 1;
let currentTheme = 0;
let isMobile = false;
let lastFrameTime = 0;
let fps = 0;
let fpsUpdateTimer = 0;
let showFPS = false;
let lastTime = 0;
let titleScreenAnimation = null;
let pointStreaks = 0; // Track consecutive collectibles for bonus points
let streakTimeout = 0;

// Game objects
let obstacles = [];
let collectibles = [];
let powerups = [];
let particles = [];
let spawnTimer = 0;
let collectibleTimer = 0;
let powerupTimer = 0;
let backgroundCache = {};

// Game settings
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const DOUBLE_JUMP_FORCE = -8;
const INITIAL_OBSTACLE_SPEED = 5;
const SPAWN_RATE = 1500; // milliseconds
const GROUND_HEIGHT = 80;
const LEVEL_THRESHOLD = 500; // Reduced from 1000 to 500 - faster level progression
const THEME_CHANGE_THRESHOLD = 800; // Reduced from 1000 to 800 - faster theme changes
const MAX_LEVEL = 10; // Increased from 5 to 10 - more levels
const COMBO_DURATION = 3000; // milliseconds
const POWERUP_DURATION = 5000; // milliseconds
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;

// Game states
const GAME_STATE = {
    MENU: 0,
    PLAYING: 1,
    GAME_OVER: 2,
    PAUSED: 3
};
let currentState = GAME_STATE.MENU;

// Environment themes
const THEMES = [
    { name: 'Space Station', bgColor: '#1e3c72', groundColor: '#2a5298', detailColor: '#1e3c72', background: backgroundElements.spaceStation },
    { name: 'Alien Planet', bgColor: '#134e5e', groundColor: '#71b280', detailColor: '#134e5e', background: backgroundElements.alienPlanet },
    { name: 'Asteroid Field', bgColor: '#333333', groundColor: '#666666', detailColor: '#333333', background: backgroundElements.asteroidField },
    { name: 'Black Hole', bgColor: '#000000', groundColor: '#333333', detailColor: '#000000', background: backgroundElements.blackHole }
];

// Obstacle patterns for more variety with varying spacing
const OBSTACLE_PATTERNS = [
    // Basic single obstacles
    { obstacles: ['standard'], spacing: 300 },
    { obstacles: ['low'], spacing: 300 },
    { obstacles: ['tall'], spacing: 300 },
    { obstacles: ['floating'], spacing: 300 },
    { obstacles: ['laser'], spacing: 300 },
    { obstacles: ['spikes'], spacing: 300 },
    { obstacles: ['ceiling'], spacing: 300 }, // Ceiling obstacle
    { obstacles: ['gate'], spacing: 300 }, // New gate obstacle
    
    // Patterns with varied spacing
    { obstacles: ['standard'], spacing: 220 }, // Closer spacing
    { obstacles: ['low'], spacing: 220 },
    { obstacles: ['ceiling'], spacing: 220 },
    { obstacles: ['gate'], spacing: 220 }, // Gate with closer spacing
    { obstacles: ['standard'], spacing: 450 }, // Further apart
    { obstacles: ['ceiling'], spacing: 450 },
    { obstacles: ['gate'], spacing: 450 }, // Gate with further spacing
    
    // Double obstacles
    { obstacles: ['standard', 'standard'], spacing: 150 },
    { obstacles: ['low', 'low'], spacing: 150 },
    { obstacles: ['ceiling', 'ceiling'], spacing: 180 }, // Double ceiling obstacles
    { obstacles: ['ceiling', 'ceiling'], spacing: 220 }, // Double ceiling with more space
    { obstacles: ['gate', 'gate'], spacing: 180 }, // Double gate obstacles
    
    // Mixed obstacles
    { obstacles: ['standard', 'low'], spacing: 200 },
    { obstacles: ['low', 'tall'], spacing: 200 },
    { obstacles: ['ceiling', 'standard'], spacing: 180 }, // Ceiling then standard
    { obstacles: ['standard', 'ceiling'], spacing: 180 }, // Standard then ceiling
    { obstacles: ['ceiling', 'low'], spacing: 200 }, // Ceiling then low
    { obstacles: ['gate', 'standard'], spacing: 200 }, // Gate then standard
    { obstacles: ['standard', 'gate'], spacing: 200 }, // Standard then gate
    { obstacles: ['gate', 'ceiling'], spacing: 180 }, // Gate then ceiling (must crouch twice)
    
    // Complex patterns
    { obstacles: ['low', 'standard', 'low'], spacing: 150 },
    { obstacles: ['ceiling', 'standard', 'ceiling'], spacing: 180 }, // Ceiling pattern
    { obstacles: ['ceiling', 'low', 'ceiling'], spacing: 200 }, // Mixed ceiling pattern
    { obstacles: ['gate', 'standard', 'gate'], spacing: 180 }, // Gate pattern
    { obstacles: ['gate', 'ceiling', 'gate'], spacing: 200 }, // Alternating crouch obstacles
    
    // Advanced patterns
    { obstacles: ['ceiling', 'standard', 'low', 'ceiling'], spacing: 150 }, // Advanced mixed pattern
    { obstacles: ['ceiling', 'low', 'ceiling', 'standard'], spacing: 130 }, // Another advanced pattern
    { obstacles: ['gate', 'standard', 'gate', 'ceiling'], spacing: 150 }, // Advanced gate pattern
];

let currentPattern = null;
let patternIndex = 0;
let patternSpacing = 0;

// Power-up types
const POWERUP_TYPES = {
    SHIELD: 0,
    JETPACK: 1,
    MAGNET: 2,
    MULTIPLIER: 3,
    BLASTER: 4 // New shooting power-up
};

// Active power-ups
const activePowerups = {
    shield: { active: false, timeLeft: 0 },
    jetpack: { active: false, timeLeft: 0 },
    magnet: { active: false, timeLeft: 0 },
    multiplier: { active: false, timeLeft: 0 },
    blaster: { active: false, timeLeft: 0 } // New blaster power-up
};

// Add a projectiles array to store bullets
let projectiles = [];

// Player object
const player = {
    x: 100,
    y: 0,
    width: 50,
    height: 50,
    velocity: 0,
    jumping: false,
    doubleJumping: false,
    sliding: false,
    crouching: false, // New crouching state
    canSlide: true,
    slideTimer: 0,
    slideHeight: 25, // Height when sliding
    crouchHeight: 35, // Height when crouching
    normalHeight: 50, // Normal height
    animationFrame: 0,
    animationTimer: 0,
    jumpPressed: false,
    draw: function() {
        // Update animation frame
        this.animationTimer++;
        if (this.animationTimer > 10) {
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.animationTimer = 0;
        }
        
        if (this.sliding) {
            // Draw sliding player using sprite
            playerSprites.slide(offscreenCtx, this.x, this.y, this.width, this.normalHeight, this.slideHeight);
        } else if (this.crouching) {
            // Draw crouching player using sprite
            playerSprites.crouch(offscreenCtx, this.x, this.y, this.width, this.normalHeight, this.crouchHeight);
        } else if (this.jumping || this.doubleJumping) {
            // Draw jumping player using sprite
            playerSprites.jump(offscreenCtx, this.x, this.y, this.width, this.height);
        } else {
            // Draw running player using sprite animation
            playerSprites.run[this.animationFrame](offscreenCtx, this.x, this.y, this.width, this.height);
        }
        
        // Draw shield effect if active
        if (activePowerups.shield.active) {
            playerSprites.shield(offscreenCtx, this.x, this.y, this.width, this.height);
        }
        
        // Draw jetpack effect if active
        if (activePowerups.jetpack.active) {
            playerSprites.jetpack(offscreenCtx, this.x, this.y, this.width, this.height);
        }
    },
    update: function(deltaTime) {
        // Handle sliding
        if (this.sliding) {
            this.slideTimer -= deltaTime;
            if (this.slideTimer <= 0) {
                this.sliding = false;
                this.height = this.normalHeight;
                // Adjust y position back
                this.y -= (this.normalHeight - this.slideHeight);
            }
        }
        
        // Apply gravity with jetpack modifications
        if (activePowerups.jetpack.active) {
            // Jetpack effect - controlled hover
            // Apply reduced gravity for better control
            this.velocity += 0.15 * (deltaTime / FRAME_TIME);
            
            // Limit max fall speed with jetpack
            if (this.velocity > 2) {
                this.velocity = 2;
            }
            
            // Allow small upward boost when jump pressed
            if (this.jumpPressed) {
                this.velocity = -3;
                this.jumpPressed = false;
            }
        } else {
            // Normal gravity
            this.velocity += GRAVITY * (deltaTime / FRAME_TIME);
        }
        
        this.y += this.velocity * (deltaTime / FRAME_TIME);
        
        // Ground collision
        const groundY = canvas.height - GROUND_HEIGHT - this.height;
        if (this.y > groundY) {
            this.y = groundY;
            this.velocity = 0;
            this.jumping = false;
            this.doubleJumping = false;
        }
        
        // Ceiling collision
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 1;
        }
        
        // Handle crouching timer
        if (this.crouching && this.crouchTimer > 0) {
            this.crouchTimer -= deltaTime;
            if (this.crouchTimer <= 0) {
                // Auto stand up after timer expires
                this.standUp();
            }
        }
    },
    jump: function() {
        if (activePowerups.jetpack.active) {
            // When jetpack is active, mark jump as pressed for next update
            this.jumpPressed = true;
        } else if (!this.jumping) {
            // Exit crouching state if jumping
            if (this.crouching) {
                this.crouching = false;
                this.height = this.normalHeight;
            }
            
            this.velocity = JUMP_FORCE;
            this.jumping = true;
            this.sliding = false;
            this.height = this.normalHeight;
        } else if (!this.doubleJumping) {
            this.velocity = DOUBLE_JUMP_FORCE;
            this.doubleJumping = true;
        }
    },
    slide: function() {
        if (this.canSlide && !this.sliding && !this.jumping && !this.doubleJumping) {
            this.sliding = true;
            this.crouching = false;
            // Save current height and adjust
            const oldHeight = this.height;
            this.height = this.slideHeight;
            this.y += (oldHeight - this.slideHeight); // Adjust y position
            this.slideTimer = 900; // Increased from 500 to 900ms (almost 1000ms)
            this.canSlide = false;
            
            // Add cooldown to prevent spam sliding
            setTimeout(() => {
                this.canSlide = true;
            }, 800); // Reduced from 1000 to 800ms for better responsiveness
        }
    },
    crouch: function() {
        if (!this.sliding && !this.jumping && !this.doubleJumping && !this.crouching) {
            this.crouching = true;
            this.crouchTimer = this.crouchDuration; // Set crouch timer
            // Save current height and adjust
            const oldHeight = this.height;
            this.height = this.crouchHeight;
            this.y += (oldHeight - this.crouchHeight); // Adjust y position
        }
    },
    standUp: function() {
        if (this.crouching) {
            this.crouching = false;
            // Adjust height and position back
            this.y -= (this.normalHeight - this.crouchHeight);
            this.height = this.normalHeight;
        }
    },
    reset: function() {
        this.y = 0;
        this.velocity = 0;
        this.jumping = false;
        this.doubleJumping = false;
        this.sliding = false;
        this.crouching = false;
        this.height = this.normalHeight;
        this.jumpPressed = false;
    },
    crouchTimer: 0, // Add crouching timer
    crouchDuration: 1000 // 1000ms crouch duration
};

// Initialize the game
function initGame() {
    // Get the canvas element
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    const container = document.querySelector('.game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Create offscreen canvas for better performance
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenCtx = offscreenCanvas.getContext('2d');
    
    // Touch tracking variables
    window.touchStartY = null;
    window.touchStartTime = null;
    
    // Check if on mobile device
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Load high score from local storage
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
        highScore = parseInt(savedHighScore);
        // Removed high score display update since element was removed from UI
    }
    
    // Load high scores
    loadHighScores();
    
    // Cache backgrounds for better performance
    cacheBackground(0);
    
    // Event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Initialize touch controls
    if (isMobile) {
        initTouchControls();
    }
    
    // Initial titlescreen animation
    drawTitleScreen();
    
    // Start button event
    document.getElementById('startButton').addEventListener('click', startGame);
    
    // Restart button event
    document.getElementById('restartButton').addEventListener('click', restartGame);
    
    // Setup event listeners for high score features
    document.getElementById('submitScore').addEventListener('click', function() {
        // Prevent multiple submissions by disabling the button
        const submitButton = document.getElementById('submitScore');
        if (submitButton.disabled) return;
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#7f8c8d';
        submitButton.textContent = 'SUBMITTED';
        
        const nameInput = document.getElementById('playerName');
        let playerName = nameInput.value.trim().toUpperCase();
        
        if (!playerName) {
            playerName = 'AAA';
        }
        
        // Filter offensive content
        if (containsOffensiveWord(playerName)) {
            playerName = 'AAA';
        }
        
        // Add high score
        addHighScore(playerName, lastGameScore);
        
        // Show leaderboard
        showLeaderboard();
    });
    
    // View leaderboard button
    document.getElementById('viewLeaderboardButton').addEventListener('click', function() {
        showLeaderboard();
    });
    
    // Close leaderboard button
    document.getElementById('closeLeaderboard').addEventListener('click', function() {
        document.querySelector('.leaderboard-screen').style.display = 'none';
        document.querySelector('.game-over-screen').style.display = 'block';
    });
}

// Create offscreen canvas for double buffering
function createOffscreenCanvas() {
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenCtx = offscreenCanvas.getContext('2d');
}

// Handle window resize
function handleResize() {
    // Debounce resize events
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(function() {
        resizeCanvas();
        createOffscreenCanvas();
        clearBackgroundCache();
    }, 200);
}

// Check if device is mobile
function checkMobileDevice() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 800;
    
    // Show mobile controls if on mobile device
    if (isMobile) {
        document.querySelector('.mobile-controls').style.display = 'flex';
    }
}

// Resize canvas to fit container
function resizeCanvas() {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    
    // Adjust player position if needed
    if (player.y > 0) {
        player.y = canvas.height - GROUND_HEIGHT - player.height;
    }
}

// Preload and cache assets
function preloadAssets() {
    // Prerender background elements for each theme
    for (let i = 0; i < THEMES.length; i++) {
        cacheBackground(i);
    }
}

// Cache background for a specific theme
function cacheBackground(themeIndex) {
    const theme = THEMES[themeIndex];
    const cacheCanvas = document.createElement('canvas');
    cacheCanvas.width = canvas.width;
    cacheCanvas.height = canvas.height;
    const cacheCtx = cacheCanvas.getContext('2d');
    
    // Draw gradient background
    const gradient = cacheCtx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, theme.bgColor);
    gradient.addColorStop(1, theme.groundColor);
    cacheCtx.fillStyle = gradient;
    cacheCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    cacheCtx.fillStyle = theme.groundColor;
    cacheCtx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
    
    // Draw ground details
    cacheCtx.fillStyle = theme.detailColor;
    cacheCtx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, 2);
    
    // Store in cache
    backgroundCache[themeIndex] = cacheCanvas;
}

// Clear background cache (e.g., after resize)
function clearBackgroundCache() {
    backgroundCache = {};
    for (let i = 0; i < THEMES.length; i++) {
        cacheBackground(i);
    }
}

// Handle keyboard input
function handleKeyDown(event) {
    // Check if player is entering name in high score form or password in reset modal
    if (document.activeElement === document.getElementById('playerName') || 
        document.activeElement === document.getElementById('resetPassword')) {
        // Allow natural typing in the input field
        return;
    }
    
    if (currentState === GAME_STATE.MENU) {
        if (event.code === 'Space' || event.code === 'Enter' || event.code === 'ArrowUp' || event.code === 'KeyW') {
            startGame();
            event.preventDefault();
        }
    } else if (currentState === GAME_STATE.PLAYING) {
        // Jump controls
        if (event.code === 'ArrowUp' || event.code === 'KeyW' || event.code === 'Space') {
            player.jump();
            event.preventDefault();
        }
        
        // Slide controls
        if (event.code === 'ArrowDown' || event.code === 'KeyS') {
            // If key is held down, keep crouching, otherwise slide
            if (event.repeat) {
                player.crouch();
            } else {
                player.slide();
            }
            event.preventDefault();
        }
        
        // Shoot controls - now using Shift key (both left and right)
        if ((event.code === 'ShiftLeft' || event.code === 'ShiftRight') && activePowerups.blaster.active) {
            shootProjectile();
            event.preventDefault();
        }
        
        // Toggle pause
        if (event.code === 'KeyP') {
            togglePause();
            event.preventDefault();
        }
        
        // Toggle FPS display
        if (event.code === 'KeyF') {
            showFPS = !showFPS;
            event.preventDefault();
        }
    } else if (currentState === GAME_STATE.GAME_OVER) {
        if (event.code === 'Enter') {
            restartGame();
            event.preventDefault();
        }
    } else if (currentState === GAME_STATE.PAUSED) {
        if (event.code === 'KeyP') {
            togglePause();
            event.preventDefault();
        }
    }
}

// Handle key up events
function handleKeyUp(event) {
    if (currentState === GAME_STATE.PLAYING) {
        if (event.code === 'ArrowDown' || event.code === 'KeyS') {
            // Stand up when crouching and the key is released
            player.standUp();
            event.preventDefault();
        }
    }
}

// Handle touch input
function handleTouchStart(event) {
    // Only handle touch events if not using dedicated mobile buttons
    if (!isMobile) {
        const touch = event.touches[0];
        const touchY = touch.clientY - canvas.getBoundingClientRect().top;
        
        if (currentState === GAME_STATE.MENU) {
            startGame();
        } else if (currentState === GAME_STATE.PLAYING) {
            // If touch is in the lower half of the screen, slide; otherwise, jump
            if (touchY > canvas.height / 2) {
                // Track long touches for crouching
                touchStartY = touchY;
                touchStartTime = Date.now();
                player.slide();
            } else {
                player.jump();
            }
        } else if (currentState === GAME_STATE.GAME_OVER) {
            restartGame();
        }
        event.preventDefault();
    }
}

// Handle touch move for crouch control
function handleTouchMove(event) {
    if (!isMobile && currentState === GAME_STATE.PLAYING && touchStartY) {
        // If touch is moving down, initiate crouch after a threshold
        const touch = event.touches[0];
        const touchY = touch.clientY - canvas.getBoundingClientRect().top;
        
        if (touchY > touchStartY + 30 && Date.now() - touchStartTime > 200) {
            player.crouch();
        }
        
        event.preventDefault();
    }
}

// Handle touch end to reset crouch
function handleTouchEnd(event) {
    if (!isMobile && currentState === GAME_STATE.PLAYING) {
        player.standUp();
        touchStartY = null;
        touchStartTime = null;
    }
}

// Toggle pause state
function togglePause() {
    if (currentState === GAME_STATE.PLAYING) {
        currentState = GAME_STATE.PAUSED;
        cancelAnimationFrame(animationFrame);
        drawPauseScreen();
    } else if (currentState === GAME_STATE.PAUSED) {
        currentState = GAME_STATE.PLAYING;
        lastTime = performance.now();
        animationFrame = requestAnimationFrame(gameUpdate);
    }
}

// Draw title screen
function drawTitleScreen() {
    // Clear any existing animation
    if (titleScreenAnimation) {
        cancelAnimationFrame(titleScreenAnimation);
    }
    
    // Animation function
    function animate() {
        // Draw to offscreen canvas first
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        
        // Draw background
        THEMES[0].background.draw(offscreenCtx, offscreenCanvas, frameCount);
        
        // Semi-transparent overlay
        offscreenCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        
        // Title text
        offscreenCtx.fillStyle = '#ffffff';
        offscreenCtx.font = 'bold 48px Arial';
        offscreenCtx.textAlign = 'center';
        offscreenCtx.fillText('COSMO RUNNER', offscreenCanvas.width / 2, offscreenCanvas.height / 2 - 50);
        
        // Subtitle
        offscreenCtx.font = '24px Arial';
        offscreenCtx.fillText('Press ENTER or tap to start', offscreenCanvas.width / 2, offscreenCanvas.height / 2 + 20);
        
        // Controls
        offscreenCtx.font = '18px Arial';
        if (isMobile) {
            offscreenCtx.fillText('TAP: Jump | SLIDE: Slide | BUTTONS: Controls', offscreenCanvas.width / 2, offscreenCanvas.height / 2 + 60);
        } else {
            offscreenCtx.fillText('SPACE/UP: Jump | DOWN: Slide | P: Pause', offscreenCanvas.width / 2, offscreenCanvas.height / 2 + 60);
        }
        
        // Copy to main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreenCanvas, 0, 0);
        
        // Animate title screen
        frameCount++;
        titleScreenAnimation = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}

// Draw pause screen
function drawPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '24px Arial';
    ctx.fillText('Press P to resume', canvas.width / 2, canvas.height / 2 + 30);
}

// Start the game
function startGame() {
    if (currentState === GAME_STATE.PLAYING) return;
    
    // Cancel title screen animation if running
    if (titleScreenAnimation) {
        cancelAnimationFrame(titleScreenAnimation);
        titleScreenAnimation = null;
    }
    
    currentState = GAME_STATE.PLAYING;
    gameStarted = true;
    gameOver = false;
    score = 0;
    comboMultiplier = 1;
    comboTimer = 0;
    currentLevel = 1;
    currentTheme = 0;
    obstacles = [];
    collectibles = [];
    powerups = [];
    particles = [];
    projectiles = []; // Clear projectiles
    
    // Reset pattern variables
    currentPattern = null;
    patternIndex = 0;
    patternSpacing = 0;
    
    // Reset all powerups
    for (const powerup in activePowerups) {
        activePowerups[powerup].active = false;
        activePowerups[powerup].timeLeft = 0;
    }
    
    player.reset();
    player.y = canvas.height - GROUND_HEIGHT - player.height;
    
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('score').textContent = '0';
    
    lastTime = performance.now();
    animationFrame = requestAnimationFrame(gameUpdate);
}

// Game update loop
function gameUpdate(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Calculate FPS
    if (showFPS) {
        const frameTime = timestamp - lastFrameTime;
        lastFrameTime = timestamp;
        
        fpsUpdateTimer += deltaTime;
        if (fpsUpdateTimer > 500) { // Update FPS display every 500ms
            fps = Math.round(1000 / frameTime);
            fpsUpdateTimer = 0;
        }
    }
    
    // Limit delta time to prevent huge jumps after tab switch
    const cappedDeltaTime = Math.min(deltaTime, 50);
    
    // Increment frame counter
    frameCount++;
    
    // Clear offscreen canvas
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // Draw background based on current theme
    drawOptimizedBackground(offscreenCtx);
    
    // Update combo timer
    if (comboTimer > 0) {
        comboTimer -= cappedDeltaTime;
        if (comboTimer <= 0) {
            comboMultiplier = 1;
        }
    }
    
    // Update powerup timers
    updatePowerups(cappedDeltaTime);
    
    // Update and draw player
    player.update(cappedDeltaTime);
    player.draw();
    
    // Calculate current obstacle speed based on level - more gradual progression
    const obstacleSpeed = INITIAL_OBSTACLE_SPEED + (currentLevel - 1) * 0.3;
    
    // Spawn obstacles
    spawnTimer += cappedDeltaTime;
    const currentSpawnRate = SPAWN_RATE - (currentLevel - 1) * 75; // Less aggressive reduction
    if (spawnTimer > currentSpawnRate) {
        spawnPatternedObstacles();
        spawnTimer = 0;
    }
    
    // Spawn collectibles - more frequent at higher levels
    collectibleTimer += cappedDeltaTime;
    if (collectibleTimer > 2000 - (currentLevel * 100)) { // Faster spawn rate at higher levels
        if (Math.random() < 0.3 + (currentLevel * 0.03)) { // Higher chance at higher levels
            spawnCollectible();
        }
        collectibleTimer = 0;
    }
    
    // Spawn powerups - slightly more frequent at higher levels
    powerupTimer += cappedDeltaTime;
    if (powerupTimer > 10000 - (currentLevel * 300)) { // Faster spawn rate at higher levels
        if (Math.random() < 0.2 + (currentLevel * 0.02)) { // Higher chance at higher levels
            spawnPowerup();
        }
        powerupTimer = 0;
    }
    
    // Update and draw obstacles
    updateObstacles(obstacleSpeed, cappedDeltaTime);
    
    // Update and draw collectibles
    updateCollectibles(obstacleSpeed, cappedDeltaTime);
    
    // Update and draw powerups
    updatePowerupItems(obstacleSpeed, cappedDeltaTime);
    
    // Update and draw particles
    updateParticles(cappedDeltaTime);
    
    // Update and draw projectiles
    if (activePowerups.blaster.active) {
        updateProjectiles(cappedDeltaTime);
    }
    
    // Check collisions
    if (!activePowerups.shield.active && checkCollisions()) {
        endGame();
        return;
    }
    
    // Check collectible collisions
    checkCollectibleCollisions();
    
    // Check powerup collisions
    checkPowerupCollisions();
    
    // Update score - progressive scoring that increases with level
    const scoreIncrease = Math.round((cappedDeltaTime / 100) * (1 + (currentLevel * 0.1)) * (activePowerups.multiplier.active ? 2 : 1));
    score += scoreIncrease;
    document.getElementById('score').textContent = score;
    
    // Check for level up
    if (score >= currentLevel * LEVEL_THRESHOLD && currentLevel < MAX_LEVEL) {
        levelUp();
    }
    
    // Check for theme change
    if (score >= (currentTheme + 1) * THEME_CHANGE_THRESHOLD && currentTheme < THEMES.length - 1) {
        currentTheme++;
        // Cache new background
        if (!backgroundCache[currentTheme]) {
            cacheBackground(currentTheme);
        }
        
        // Add visual effect for theme change
        createThemeChangeEffect();
    }
    
    // Update streak timeout
    if (streakTimeout > 0) {
        streakTimeout -= cappedDeltaTime;
        if (streakTimeout <= 0) {
            pointStreaks = 0;
            streakTimeout = 0;
        }
    }
    
    // Draw UI elements
    drawUI(offscreenCtx);
    
    // Draw level up text if active
    drawLevelUpText();
    
    // Draw FPS counter if enabled
    if (showFPS) {
        offscreenCtx.fillStyle = 'white';
        offscreenCtx.font = '14px Arial';
        offscreenCtx.textAlign = 'right';
        offscreenCtx.fillText(`FPS: ${fps}`, offscreenCanvas.width - 10, 80);
    }
    
    // Update and draw floating texts
    updateFloatingTexts(cappedDeltaTime);
    
    // Copy from offscreen canvas to main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreenCanvas, 0, 0);
    
    // Continue game loop
    animationFrame = requestAnimationFrame(gameUpdate);
}

// Draw background with optimized performance
function drawOptimizedBackground(targetCtx) {
    const theme = THEMES[currentTheme];
    
    // Draw cached static background
    if (backgroundCache[currentTheme]) {
        targetCtx.drawImage(backgroundCache[currentTheme], 0, 0);
    } else {
        cacheBackground(currentTheme);
        targetCtx.drawImage(backgroundCache[currentTheme], 0, 0);
    }
    
    // Draw animated background elements
    theme.background.draw(targetCtx, canvas, frameCount);
}

// Draw UI elements
function drawUI(targetCtx) {
    // Draw combo multiplier
    if (comboMultiplier > 1) {
        targetCtx.fillStyle = '#ffd700';
        targetCtx.font = 'bold 24px Arial';
        targetCtx.textAlign = 'left';
        targetCtx.fillText(`Combo: ${comboMultiplier}x`, 10, 80);
        
        // Draw combo timer bar
        const maxWidth = 100;
        const currentWidth = (comboTimer / COMBO_DURATION) * maxWidth;
        targetCtx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        targetCtx.fillRect(10, 85, maxWidth, 5);
        targetCtx.fillStyle = '#ffd700';
        targetCtx.fillRect(10, 85, currentWidth, 5);
    }
    
    // Draw powerup indicators
    let powerupY = 120;
    
    // Draw active powerups
    targetCtx.textAlign = 'left';
    for (const [name, powerup] of Object.entries(activePowerups)) {
        if (powerup.active) {
            let color, text;
            
            switch (name) {
                case 'shield':
                    color = '#3498db';
                    text = 'Shield';
                    break;
                case 'jetpack':
                    color = '#e74c3c';
                    text = 'Jetpack';
                    break;
                case 'magnet':
                    color = '#9b59b6';
                    text = 'Magnet';
                    break;
                case 'multiplier':
                    color = '#f39c12';
                    text = '2x Score';
                    break;
            }
            
            // Draw powerup text
            targetCtx.fillStyle = color;
            targetCtx.font = 'bold 16px Arial';
            targetCtx.fillText(text, 10, powerupY);
            
            // Draw timer bar
            const maxWidth = 80;
            const currentWidth = (powerup.timeLeft / POWERUP_DURATION) * maxWidth;
            targetCtx.fillStyle = `${color}33`;
            targetCtx.fillRect(10, powerupY + 5, maxWidth, 3);
            targetCtx.fillStyle = color;
            targetCtx.fillRect(10, powerupY + 5, currentWidth, 3);
            
            powerupY += 25;
        }
    }
    
    // Draw level indicator
    targetCtx.fillStyle = '#ffffff';
    targetCtx.font = '14px Arial';
    targetCtx.textAlign = 'right';
    targetCtx.fillText(`Level: ${currentLevel}`, canvas.width - 10, 50);
    
    // Draw theme name
    targetCtx.fillText(`Theme: ${THEMES[currentTheme].name}`, canvas.width - 10, 30);
    
    // Draw streak counter if active
    if (pointStreaks >= 3) {
        targetCtx.fillStyle = '#e74c3c';
        targetCtx.font = 'bold 20px Arial';
        targetCtx.textAlign = 'left';
        targetCtx.fillText(`Streak: ${pointStreaks}x`, 10, 110);
        
        // Draw streak timer bar
        const maxWidth = 100;
        const currentWidth = (streakTimeout / 2000) * maxWidth;
        targetCtx.fillStyle = 'rgba(231, 76, 60, 0.3)';
        targetCtx.fillRect(10, 115, maxWidth, 5);
        targetCtx.fillStyle = '#e74c3c';
        targetCtx.fillRect(10, 115, currentWidth, 5);
    }
}

// Spawn obstacles using patterns for more variety
function spawnPatternedObstacles() {
    // If we don't have a current pattern or we've completed the current pattern
    if (!currentPattern || patternIndex >= currentPattern.obstacles.length) {
        // Choose a pattern based on current level
        let availablePatterns = OBSTACLE_PATTERNS.filter(pattern => {
            // Basic patterns for level 1
            if (currentLevel === 1) {
                return pattern.obstacles.length === 1 && pattern.obstacles[0] !== 'moving';
            }
            // Add double patterns for level 2
            else if (currentLevel === 2) {
                return pattern.obstacles.length <= 2 && !pattern.obstacles.includes('moving');
            }
            // Add complex patterns for level 3
            else if (currentLevel === 3) {
                return !pattern.obstacles.includes('moving');
            }
            // All patterns for levels 4+
            else {
                return true;
            }
        });
        
        currentPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
        patternIndex = 0;
        patternSpacing = 0;
    }
    
    // Get the current obstacle type from the pattern
    const obstacleType = currentPattern.obstacles[patternIndex];
    
    // Spawn the obstacle
    spawnObstacle(obstacleType);
    
    // Move to the next obstacle in the pattern
    patternIndex++;
    
    // If we still have obstacles in the pattern, adjust the spawn timer to create the pattern
    if (patternIndex < currentPattern.obstacles.length) {
        spawnTimer = SPAWN_RATE - currentPattern.spacing;
    }
}

// Spawn an obstacle
function spawnObstacle(type = null) {
    // If no specific type provided, determine based on level
    if (!type) {
        let typeIndex;
        
        if (currentLevel === 1) {
            typeIndex = 0; // Only standard obstacles in level 1
        } else if (currentLevel === 2) {
            typeIndex = Math.floor(Math.random() * 2); // Standard and low obstacles in level 2
        } else {
            // Higher levels get all obstacle types
            typeIndex = Math.floor(Math.random() * 3);
        }
        
        const obstacleTypes = ['standard', 'low', 'tall'];
        type = obstacleTypes[typeIndex];
    }
    
    // Create the obstacle object
    let obstacle;
    
    // Handle special obstacle types
    if (type === 'ceiling') {
        const ceilingHeight = 60; // Much lower ceiling to force crouching (was 85)
        obstacle = {
            x: canvas.width,
            y: ceilingHeight, // This represents the bottom of the stalactite
            width: 60,
            height: ceilingHeight, // Full height from top of screen
            type: type,
            passed: false,
            isCeiling: true // Flag to identify it's a ceiling obstacle
        };
    } else if (type === 'gate') {
        const gateHeight = 110; // Increased from 70 to 110 to prevent jumping over
        const openingHeight = 40; // Height of the opening (player must crouch)
        
        obstacle = {
            x: canvas.width,
            y: canvas.height - GROUND_HEIGHT - gateHeight, // Place gate on the ground
            width: 60,
            height: gateHeight,
            openingY: canvas.height - GROUND_HEIGHT - openingHeight, // Calculate opening position
            openingHeight: openingHeight,
            type: 'gate',
            passed: false,
            isGate: true // Flag to identify it's a gate obstacle
        };
    } else {
        // Standard obstacle setup
        obstacle = {
            x: canvas.width,
            y: canvas.height - GROUND_HEIGHT - (type === 'low' ? 20 : 50),
            width: type === 'tall' ? 30 : 40,
            height: type === 'low' ? 20 : (type === 'tall' ? 80 : 50),
            type: type,
            passed: false
        };
        
        // For moving obstacles
        if (type === 'moving' || (currentLevel >= 4 && Math.random() < 0.2 && type !== 'low')) {
            obstacle.type = 'moving';
            obstacle.moveDirection = Math.random() > 0.5 ? 1 : -1;
            obstacle.moveSpeed = 2;
            obstacle.moveRange = 30;
            obstacle.startY = obstacle.y;
        }
    }
    
    obstacles.push(obstacle);
}

// Collectible types
const COLLECTIBLE_TYPES = {
    COIN: 0,
    GEM: 1,
    STAR: 2,
    COIN_SHOWER: 3 // Special collectible that creates a shower of coins
};

// Spawn a collectible
function spawnCollectible() {
    // Choose a collectible type based on rarity
    let typeIndex;
    const rarity = Math.random();
    
    if (rarity < 0.05 && currentLevel > 2) { // Very rare, only in higher levels
        typeIndex = COLLECTIBLE_TYPES.COIN_SHOWER;
    } else if (rarity < 0.2) { // Rare
        typeIndex = COLLECTIBLE_TYPES.STAR;
    } else if (rarity < 0.4) { // Uncommon
        typeIndex = COLLECTIBLE_TYPES.GEM;
    } else { // Common
        typeIndex = COLLECTIBLE_TYPES.COIN;
    }
    
    // Set properties based on type
    let value, color, size;
    
    switch (typeIndex) {
        case COLLECTIBLE_TYPES.COIN:
            value = 10;
            color = '#f1c40f'; // Gold
            size = 30;
            break;
        case COLLECTIBLE_TYPES.GEM:
            value = 25;
            color = '#9b59b6'; // Purple
            size = 25;
            break;
        case COLLECTIBLE_TYPES.STAR:
            value = 50;
            color = '#e74c3c'; // Red
            size = 35;
            break;
        case COLLECTIBLE_TYPES.COIN_SHOWER:
            value = 100;
            color = '#3498db'; // Blue
            size = 40;
            break;
    }
    
    const collectible = {
        x: canvas.width,
        y: canvas.height - GROUND_HEIGHT - 100 - Math.random() * 100, // Random height
        width: size,
        height: size,
        value: value,
        color: color,
        type: typeIndex
    };
    
    collectibles.push(collectible);
}

// Create coin shower effect
function createCoinShower(x, y) {
    // Create multiple coins in a shower pattern
    const coinCount = 15 + Math.floor(Math.random() * 10); // 15-25 coins
    
    for (let i = 0; i < coinCount; i++) {
        setTimeout(() => {
            const coin = {
                x: x + Math.random() * 200 - 100, // Random spread
                y: y - Math.random() * 100, // Start above origin
                width: 25,
                height: 25,
                value: 5,
                color: '#f1c40f', // Gold
                type: COLLECTIBLE_TYPES.COIN,
                vx: (Math.random() - 0.5) * 5, // Random horizontal velocity
                vy: -5 - Math.random() * 5, // Initial upward velocity
                gravity: 0.2,
                collected: false
            };
            
            collectibles.push(coin);
        }, i * 100); // Stagger the coins spawning
    }
    
    // Create a visual burst effect
    createParticles(x, y, '#3498db', 30, 2);
}

// Update collectibles
function updateCollectibles(speed, deltaTime) {
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const collectible = collectibles[i];
        
        // Check for magnet powerup to attract collectibles
        if (activePowerups.magnet.active) {
            const dx = player.x + player.width / 2 - (collectible.x + collectible.width / 2);
            const dy = player.y + player.height / 2 - (collectible.y + collectible.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Attract if within range
            if (distance < 200) {
                const attractionSpeed = 5 * (1 - distance / 200);
                collectible.x += dx * attractionSpeed * (deltaTime / FRAME_TIME) / distance;
                collectible.y += dy * attractionSpeed * (deltaTime / FRAME_TIME) / distance;
            } else {
                // Regular movement
                collectible.x -= speed * (deltaTime / FRAME_TIME);
            }
        } else {
            // Regular movement
            collectible.x -= speed * (deltaTime / FRAME_TIME);
        }
        
        // Apply physics for coin shower coins
        if (collectible.vx !== undefined) {
            collectible.x += collectible.vx * (deltaTime / FRAME_TIME);
            collectible.y += collectible.vy * (deltaTime / FRAME_TIME);
            collectible.vy += collectible.gravity * (deltaTime / FRAME_TIME);
            
            // Bounce off ground
            if (collectible.y > canvas.height - GROUND_HEIGHT - collectible.height) {
                collectible.y = canvas.height - GROUND_HEIGHT - collectible.height;
                collectible.vy = -collectible.vy * 0.6; // Reduce bounce height
                
                // Stop bouncing if too slow
                if (Math.abs(collectible.vy) < 0.5) {
                    collectible.vy = 0;
                }
            }
        }
        
        // Remove if off screen
        if (collectible.x + collectible.width < 0) {
            collectibles.splice(i, 1);
            continue;
        }
        
        // Draw the collectible based on type
        switch (collectible.type) {
            case COLLECTIBLE_TYPES.COIN:
                // Draw a spinning coin
                const coinAnimation = (frameCount % 30) / 30;
                const coinWidth = collectible.width * (0.5 + 0.5 * Math.abs(Math.cos(coinAnimation * Math.PI * 2)));
                
                // Shadow
                offscreenCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                offscreenCtx.beginPath();
                offscreenCtx.ellipse(collectible.x + collectible.width/2, collectible.y + collectible.height + 3, 
                                   collectible.width/2 * 0.8, collectible.height/6, 0, 0, Math.PI * 2);
                offscreenCtx.fill();
                
                // Coin body
                offscreenCtx.fillStyle = collectible.color;
                offscreenCtx.beginPath();
                offscreenCtx.ellipse(collectible.x + collectible.width/2, collectible.y + collectible.height/2, 
                                   coinWidth/2, collectible.height/2, 0, 0, Math.PI * 2);
                offscreenCtx.fill();
                
                // Coin edge highlight
                offscreenCtx.strokeStyle = '#f39c12';
                offscreenCtx.lineWidth = 2;
                offscreenCtx.beginPath();
                offscreenCtx.ellipse(collectible.x + collectible.width/2, collectible.y + collectible.height/2, 
                                   coinWidth/2, collectible.height/2, 0, 0, Math.PI * 2);
                offscreenCtx.stroke();
                
                // Coin inner detail
                offscreenCtx.strokeStyle = '#f39c12';
                offscreenCtx.lineWidth = 1;
                offscreenCtx.beginPath();
                offscreenCtx.ellipse(collectible.x + collectible.width/2, collectible.y + collectible.height/2, 
                                   coinWidth/2 * 0.7, collectible.height/2 * 0.7, 0, 0, Math.PI * 2);
                offscreenCtx.stroke();
                break;
                
            case COLLECTIBLE_TYPES.GEM:
                // Draw a gem with glow
                // Shadow
                offscreenCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                offscreenCtx.beginPath();
                offscreenCtx.ellipse(collectible.x + collectible.width/2, collectible.y + collectible.height + 3, 
                                   collectible.width/2 * 0.8, collectible.height/6, 0, 0, Math.PI * 2);
                offscreenCtx.fill();
                
                // Gem body
                offscreenCtx.fillStyle = collectible.color;
                offscreenCtx.beginPath();
                offscreenCtx.moveTo(collectible.x + collectible.width/2, collectible.y);
                offscreenCtx.lineTo(collectible.x + collectible.width, collectible.y + collectible.height/2);
                offscreenCtx.lineTo(collectible.x + collectible.width/2, collectible.y + collectible.height);
                offscreenCtx.lineTo(collectible.x, collectible.y + collectible.height/2);
                offscreenCtx.closePath();
                offscreenCtx.fill();
                
                // Gem glow
                offscreenCtx.shadowColor = collectible.color;
                offscreenCtx.shadowBlur = 10;
                offscreenCtx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                offscreenCtx.lineWidth = 2;
                offscreenCtx.stroke();
                offscreenCtx.shadowBlur = 0;
                
                // Gem sparkle
                if (frameCount % 15 < 5) {
                    offscreenCtx.fillStyle = 'white';
                    offscreenCtx.beginPath();
                    offscreenCtx.arc(collectible.x + collectible.width/4, collectible.y + collectible.height/4, 2, 0, Math.PI * 2);
                    offscreenCtx.fill();
                }
                break;
                
            case COLLECTIBLE_TYPES.STAR:
                // Draw a star with glow
                // Shadow
                offscreenCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                offscreenCtx.beginPath();
                offscreenCtx.ellipse(collectible.x + collectible.width/2, collectible.y + collectible.height + 3, 
                                   collectible.width/2 * 0.8, collectible.height/6, 0, 0, Math.PI * 2);
                offscreenCtx.fill();
                
                // Draw star shape
                const cx = collectible.x + collectible.width/2;
                const cy = collectible.y + collectible.height/2;
                const spikes = 5;
                const outerRadius = collectible.width/2;
                const innerRadius = collectible.width/4;
                
                offscreenCtx.beginPath();
                for (let i = 0; i < spikes * 2; i++) {
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const angle = Math.PI * i / spikes - Math.PI / 2;
                    const x = cx + radius * Math.cos(angle);
                    const y = cy + radius * Math.sin(angle);
                    
                    if (i === 0) {
                        offscreenCtx.moveTo(x, y);
                    } else {
                        offscreenCtx.lineTo(x, y);
                    }
                }
                offscreenCtx.closePath();
                
                // Star glow
                offscreenCtx.shadowColor = collectible.color;
                offscreenCtx.shadowBlur = 15;
                offscreenCtx.fillStyle = collectible.color;
                offscreenCtx.fill();
                offscreenCtx.shadowBlur = 0;
                
                // Star inner glow
                const starGradient = offscreenCtx.createRadialGradient(cx, cy, innerRadius/2, cx, cy, outerRadius);
                starGradient.addColorStop(0, '#f1c40f');
                starGradient.addColorStop(1, collectible.color);
                
                offscreenCtx.fillStyle = starGradient;
                offscreenCtx.fill();
                break;
                
            case COLLECTIBLE_TYPES.COIN_SHOWER:
                // Draw a special coin with animation and glow
                const pulseSize = 1 + 0.1 * Math.sin(frameCount * 0.1);
                
                // Glow effect
                offscreenCtx.shadowColor = collectible.color;
                offscreenCtx.shadowBlur = 20;
                
                // Shadow
                offscreenCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                offscreenCtx.beginPath();
                offscreenCtx.ellipse(collectible.x + collectible.width/2, collectible.y + collectible.height + 3, 
                                   collectible.width/2 * 0.8, collectible.height/6, 0, 0, Math.PI * 2);
                offscreenCtx.fill();
                
                // Draw outer glow
                offscreenCtx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
                offscreenCtx.lineWidth = 4;
                offscreenCtx.beginPath();
                offscreenCtx.arc(collectible.x + collectible.width/2, collectible.y + collectible.height/2, 
                               collectible.width/2 * pulseSize + 5, 0, Math.PI * 2);
                offscreenCtx.stroke();
                
                // Draw special coin body
                offscreenCtx.fillStyle = collectible.color;
                offscreenCtx.beginPath();
                offscreenCtx.arc(collectible.x + collectible.width/2, collectible.y + collectible.height/2, 
                               collectible.width/2 * pulseSize, 0, Math.PI * 2);
                offscreenCtx.fill();
                
                // Draw $ symbol
                offscreenCtx.fillStyle = 'white';
                offscreenCtx.font = 'bold 24px Arial';
                offscreenCtx.textAlign = 'center';
                offscreenCtx.textBaseline = 'middle';
                offscreenCtx.fillText('$', collectible.x + collectible.width/2, collectible.y + collectible.height/2);
                
                offscreenCtx.shadowBlur = 0;
                break;
        }
    }
}

// Check for collisions with collectibles
function checkCollectibleCollisions() {
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const collectible = collectibles[i];
        
        // Skip if already collected
        if (collectible.collected) continue;
        
        if (
            player.x < collectible.x + collectible.width &&
            player.x + player.width > collectible.x &&
            player.y < collectible.y + collectible.height &&
            player.y + player.height > collectible.y
        ) {
            // Mark as collected
            collectible.collected = true;
            
            // Remove regular collectibles immediately
            if (collectible.type !== COLLECTIBLE_TYPES.COIN_SHOWER) {
                collectibles.splice(i, 1);
            }
            
            // Increase streak
            pointStreaks++;
            streakTimeout = 2000; // Reset streak timeout
            
            // Increase combo
            comboMultiplier = Math.min(comboMultiplier + 1, 5);
            comboTimer = COMBO_DURATION;
            
            // Calculate bonus based on streak
            let streakBonus = 0;
            if (pointStreaks >= 3) {
                streakBonus = pointStreaks * 5; // 5 points per item in streak
            }
            
            // Add score
            let basePoints = collectible.value;
            let totalPoints = (basePoints + streakBonus) * comboMultiplier * (activePowerups.multiplier.active ? 2 : 1);
            score += totalPoints;
            document.getElementById('score').textContent = score;
            
            // Special handling for coin shower
            if (collectible.type === COLLECTIBLE_TYPES.COIN_SHOWER) {
                createCoinShower(collectible.x, collectible.y);
                collectibles.splice(i, 1);
                playSound('powerup'); // Play special sound for coin shower
            } else {
                // Play normal collect sound
                playSound('collect');
            }
            
            // Create particle effect
            createParticles(collectible.x, collectible.y, collectible.color, 10);
            
            // Show points text
            let pointText = `+${totalPoints}`;
            if (streakBonus > 0) {
                pointText += ` STREAK x${pointStreaks}!`;
            }
            showFloatingText(pointText, collectible.x, collectible.y, collectible.color);
        }
    }
}

// Spawn a powerup
function spawnPowerup() {
    const typeIndex = Math.floor(Math.random() * 5); // Update to include 5 powerup types
    let color;
    
    switch (typeIndex) {
        case POWERUP_TYPES.SHIELD:
            color = '#3498db';
            break;
        case POWERUP_TYPES.JETPACK:
            color = '#e74c3c';
            break;
        case POWERUP_TYPES.MAGNET:
            color = '#9b59b6';
            break;
        case POWERUP_TYPES.MULTIPLIER:
            color = '#f39c12';
            break;
        case POWERUP_TYPES.BLASTER:
            color = '#2ecc71'; // Green for blaster
            break;
    }
    
    const powerup = {
        x: canvas.width,
        y: canvas.height - GROUND_HEIGHT - 150 - Math.random() * 50, // Random height
        width: 40,
        height: 40,
        type: typeIndex,
        color: color
    };
    
    powerups.push(powerup);
}

// Create a particle effect
function createParticles(x, y, color, count, size = 1) {
    for (let i = 0; i < count; i++) {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            size: Math.random() * 3 * size + 2,
            color: color,
            life: 60
        };
        particles.push(particle);
    }
}

// Level up function with rewards
function levelUp() {
    currentLevel++;
    
    // Create particles
    createParticles(canvas.width / 2, canvas.height / 2, '#ffd700', 40, 2);
    
    // Add level up text
    const levelText = {
        text: `LEVEL ${currentLevel}`,
        x: canvas.width / 2,
        y: canvas.height / 2,
        alpha: 1,
        scale: 3,
        life: 90 // Longer display
    };
    
    // Level-up rewards
    let rewardText = "";
    
    // Different rewards based on level
    switch(currentLevel) {
        case 2:
            // Bonus points
            score += 100;
            rewardText = "+100 POINTS!";
            break;
        case 3:
            // Give shield powerup
            activatePowerup(POWERUP_TYPES.SHIELD);
            rewardText = "SHIELD ACTIVATED!";
            break;
        case 4:
            // Bonus points
            score += 200;
            rewardText = "+200 POINTS!";
            break;
        case 5:
            // Give jetpack powerup
            activatePowerup(POWERUP_TYPES.JETPACK);
            rewardText = "JETPACK ACTIVATED!";
            break;
        case 6:
            // Bonus points
            score += 300;
            rewardText = "+300 POINTS!";
            break;
        case 7:
            // Give multiplier powerup
            activatePowerup(POWERUP_TYPES.MULTIPLIER);
            rewardText = "2X SCORE ACTIVATED!";
            break;
        case 8:
            // Bonus points
            score += 400;
            rewardText = "+400 POINTS!";
            break;
        case 9:
            // Give magnet powerup
            activatePowerup(POWERUP_TYPES.MAGNET);
            rewardText = "MAGNET ACTIVATED!";
            break;
        case 10:
            // Ultimate reward
            score += 1000;
            activatePowerup(POWERUP_TYPES.SHIELD);
            rewardText = "MASTER LEVEL: +1000 POINTS & SHIELD!";
            break;
    }
    
    // Store the level up text
    window.levelUpEffect = levelText;
    
    // Store reward text if there is one
    if (rewardText) {
        window.rewardEffect = {
            text: rewardText,
            x: canvas.width / 2,
            y: canvas.height / 2 + 60,
            alpha: 1,
            scale: 1.5,
            life: 90
        };
    }
    
    // Play level up sound (if implemented)
    // playSound('levelUp');
}

// Function to draw level up text during game loop
function drawLevelUpText() {
    // Draw level up effect
    if (window.levelUpEffect && window.levelUpEffect.life > 0) {
        const levelText = window.levelUpEffect;
        
        // Draw text
        offscreenCtx.save();
        offscreenCtx.globalAlpha = levelText.alpha;
        offscreenCtx.fillStyle = '#ffd700';
        offscreenCtx.font = `bold ${Math.round(48 * levelText.scale)}px Arial`;
        offscreenCtx.textAlign = 'center';
        offscreenCtx.fillText(levelText.text, levelText.x, levelText.y);
        offscreenCtx.restore();
        
        // Update properties
        levelText.alpha -= 0.01;
        levelText.scale -= 0.02;
        levelText.life--;
        
        if (levelText.life <= 0) {
            window.levelUpEffect = null;
        }
    }
    
    // Draw reward effect
    if (window.rewardEffect && window.rewardEffect.life > 0) {
        const rewardText = window.rewardEffect;
        
        // Draw text
        offscreenCtx.save();
        offscreenCtx.globalAlpha = rewardText.alpha;
        offscreenCtx.fillStyle = '#f39c12'; // Orange color for rewards
        offscreenCtx.font = `bold ${Math.round(24 * rewardText.scale)}px Arial`;
        offscreenCtx.textAlign = 'center';
        offscreenCtx.fillText(rewardText.text, rewardText.x, rewardText.y);
        offscreenCtx.restore();
        
        // Update properties
        rewardText.alpha -= 0.01;
        rewardText.scale -= 0.01;
        rewardText.life--;
        
        if (rewardText.life <= 0) {
            window.rewardEffect = null;
        }
    }
}

// Create theme change effect
function createThemeChangeEffect() {
    // Create particles for theme change
    for (let i = 0; i < canvas.width; i += 30) {
        for (let j = 0; j < canvas.height; j += 30) {
            if (Math.random() < 0.3) {
                const color = THEMES[currentTheme].groundColor;
                createParticles(i, j, color, 3, 1.5);
            }
        }
    }
    
    // Add theme change text effect
    window.themeChangeEffect = {
        text: `NEW THEME: ${THEMES[currentTheme].name}`,
        x: canvas.width / 2,
        y: canvas.height / 2 - 80,
        alpha: 1,
        scale: 2,
        life: 80
    };
}

// Update all obstacles
function updateObstacles(speed, deltaTime) {
    const scaledSpeed = speed * (deltaTime / FRAME_TIME);
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        
        // Move obstacle
        obstacle.x -= scaledSpeed;
        
        // Update moving obstacles
        if (obstacle.type === 'moving') {
            obstacle.y = obstacle.startY + Math.sin(frameCount * 0.05) * obstacle.moveRange;
        }
        
        // Animate laser obstacle
        if (obstacle.type === 'laser' && !obstacle.laserTimer) {
            obstacle.laserTimer = 0;
        }
        if (obstacle.type === 'laser') {
            obstacle.laserTimer += deltaTime;
            // Blink laser every 500ms for advanced levels
            if (currentLevel >= 4 && obstacle.laserTimer > 500) {
                obstacle.laserActive = !obstacle.laserActive;
                obstacle.laserTimer = 0;
            }
        }
        
        // Remove if off screen
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            continue;
        }
        
        // Draw obstacle based on type
        if (obstacle.type === 'standard') {
            obstacleSprites.standard(offscreenCtx, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === 'low') {
            obstacleSprites.low(offscreenCtx, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === 'tall') {
            obstacleSprites.tall(offscreenCtx, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === 'moving') {
            obstacleSprites.moving(offscreenCtx, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === 'floating') {
            obstacleSprites.floating(offscreenCtx, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === 'spikes') {
            obstacleSprites.spikes(offscreenCtx, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === 'laser') {
            // For blinking lasers in higher levels
            if (currentLevel < 4 || !obstacle.laserActive) {
                obstacleSprites.laser(offscreenCtx, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
        } else if (obstacle.type === 'ceiling') {
            obstacleSprites.ceiling(offscreenCtx, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === 'gate') {
            obstacleSprites.gate(offscreenCtx, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    }
}

// Update all powerup items
function updatePowerupItems(speed, deltaTime) {
    const scaledSpeed = speed * (deltaTime / FRAME_TIME);
    
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        
        // Move powerup
        powerup.x -= scaledSpeed;
        
        // Floating animation
        powerup.y += Math.sin(frameCount * 0.05) * 1;
        
        // Remove if off screen
        if (powerup.x + powerup.width < 0) {
            powerups.splice(i, 1);
            continue;
        }
        
        // Draw powerup based on type
        switch (powerup.type) {
            case POWERUP_TYPES.SHIELD:
                itemSprites.shield(offscreenCtx, powerup.x, powerup.y, powerup.width, powerup.height, frameCount);
                break;
            case POWERUP_TYPES.JETPACK:
                itemSprites.jetpack(offscreenCtx, powerup.x, powerup.y, powerup.width, powerup.height, frameCount);
                break;
            case POWERUP_TYPES.MAGNET:
                itemSprites.magnet(offscreenCtx, powerup.x, powerup.y, powerup.width, powerup.height, frameCount);
                break;
            case POWERUP_TYPES.MULTIPLIER:
                itemSprites.multiplier(offscreenCtx, powerup.x, powerup.y, powerup.width, powerup.height, frameCount);
                break;
        }
    }
}

// Update all particles
function updateParticles(deltaTime) {
    const scaledDelta = deltaTime / FRAME_TIME;
    
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update position
        particle.x += particle.vx * scaledDelta;
        particle.y += particle.vy * scaledDelta;
        
        // Apply gravity
        particle.vy += 0.1 * scaledDelta;
        
        // Update life
        particle.life -= scaledDelta;
        
        // Remove if dead
        if (particle.life <= 0) {
            particles.splice(i, 1);
            continue;
        }
        
        // Draw particle
        offscreenCtx.globalAlpha = particle.life / 60;
        offscreenCtx.fillStyle = particle.color;
        offscreenCtx.beginPath();
        offscreenCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        offscreenCtx.fill();
        offscreenCtx.globalAlpha = 1;
    }
}

// Update all active powerups
function updatePowerups(deltaTime) {
    for (const [name, powerup] of Object.entries(activePowerups)) {
        if (powerup.active) {
            powerup.timeLeft -= deltaTime;
            
            // Deactivate powerup when time is up
            if (powerup.timeLeft <= 0) {
                powerup.active = false;
            }
        }
    }
}

// Activate a powerup
function activatePowerup(type) {
    let powerupName = '';
    
    switch (type) {
        case POWERUP_TYPES.SHIELD:
            activePowerups.shield.active = true;
            activePowerups.shield.timeLeft = POWERUP_DURATION;
            powerupName = 'Shield';
            break;
        case POWERUP_TYPES.JETPACK:
            activePowerups.jetpack.active = true;
            activePowerups.jetpack.timeLeft = POWERUP_DURATION;
            powerupName = 'Jetpack';
            break;
        case POWERUP_TYPES.MAGNET:
            activePowerups.magnet.active = true;
            activePowerups.magnet.timeLeft = POWERUP_DURATION;
            powerupName = 'Coin Magnet';
            break;
        case POWERUP_TYPES.MULTIPLIER:
            activePowerups.multiplier.active = true;
            activePowerups.multiplier.timeLeft = POWERUP_DURATION;
            powerupName = 'Score Multiplier';
            break;
        case POWERUP_TYPES.BLASTER:
            activePowerups.blaster.active = true;
            activePowerups.blaster.timeLeft = POWERUP_DURATION;
            powerupName = 'Blaster';
            break;
    }
    
    // Show powerup text
    console.log(`${powerupName} activated!`);
}

// Check for collisions with obstacles
function checkCollisions() {
    for (const obstacle of obstacles) {
        // Skip collision check if sliding under low obstacles
        if (player.sliding && obstacle.type === 'low') {
            continue;
        }
        
        // Skip collision check for laser obstacles that are blinking and currently off
        if (obstacle.type === 'laser' && obstacle.laserActive === false && currentLevel >= 4) {
            continue;
        }
        
        // Skip collision check if crouching or sliding under ceiling obstacles
        if ((player.crouching || player.sliding) && obstacle.type === 'ceiling') {
            continue;
        }
        
        // Skip collision check if crouching or sliding under gate obstacles
        if ((player.crouching || player.sliding) && obstacle.type === 'gate') {
            continue;
        }
        
        // Adjust hitboxes based on obstacle type for more accurate collision detection
        let hitboxX = obstacle.x;
        let hitboxWidth = obstacle.width;
        let hitboxY, hitboxHeight;
        
        if (obstacle.type === 'ceiling') {
            // Ceiling obstacles hang from the top, so the hitbox is from y=0 to obstacle.y
            hitboxX = obstacle.x + 5;
            hitboxWidth = obstacle.width - 10;
            hitboxY = 0;
            hitboxHeight = obstacle.y;
        } else if (obstacle.type === 'gate') {
            // Gate obstacles have a top beam and posts - check collision with these parts
            // If the player is crouching/sliding, they can pass through the opening
            hitboxX = obstacle.x + 5;
            hitboxWidth = obstacle.width - 10;
            
            // The top beam is the danger area
            const openingHeight = obstacle.openingHeight || 40; // Use the stored value or default
            
            // Create a hitbox that only includes the top beam and above
            hitboxY = obstacle.y;
            hitboxHeight = obstacle.height - openingHeight; // This includes everything above the opening
        } else if (obstacle.type === 'standard') {
            // Standard obstacle has an irregular shape
            hitboxX = obstacle.x + obstacle.width * 0.1;
            hitboxWidth = obstacle.width * 0.8;
            hitboxY = obstacle.y + obstacle.height * 0.3;
            hitboxHeight = obstacle.height * 0.7;
        } else if (obstacle.type === 'laser') {
            // Laser hitbox is only the beam
            hitboxX = obstacle.x + obstacle.width/5;
            hitboxWidth = obstacle.width*3/5;
            hitboxY = obstacle.y + obstacle.height/3;
            hitboxHeight = obstacle.height/3;
        } else if (obstacle.type === 'spikes') {
            // Spikes have a triangular shape
            hitboxX = obstacle.x + obstacle.width * 0.1;
            hitboxWidth = obstacle.width * 0.8;
            hitboxY = obstacle.y + obstacle.height * 0.3;
            hitboxHeight = obstacle.height * 0.7;
        } else if (obstacle.type === 'floating') {
            // Floating obstacles have a hexagonal shape
            hitboxX = obstacle.x + obstacle.width * 0.1;
            hitboxWidth = obstacle.width * 0.8;
            hitboxY = obstacle.y + obstacle.height * 0.1;
            hitboxHeight = obstacle.height * 0.8;
        } else if (obstacle.type === 'moving') {
            // Moving obstacles have an oval shape
            hitboxX = obstacle.x + obstacle.width * 0.1;
            hitboxWidth = obstacle.width * 0.8;
            hitboxY = obstacle.y + obstacle.height * 0.1;
            hitboxHeight = obstacle.height * 0.8;
        } else {
            // Default hitbox
            hitboxY = obstacle.y;
            hitboxHeight = obstacle.height;
        }
        
        if (
            player.x < hitboxX + hitboxWidth &&
            player.x + player.width > hitboxX &&
            player.y < hitboxY + hitboxHeight &&
            player.y + player.height > hitboxY
        ) {
            createParticles(player.x + player.width/2, player.y + player.height/2, '#3498db', 20);
            return true; // Collision detected
        }
    }
    return false;
}

// Shoot a projectile
function shootProjectile() {
    if (activePowerups.blaster.active) {
        const projectile = {
            x: player.x + player.width,
            y: player.y + player.height / 2,
            width: 15,
            height: 8,
            speed: 12,
            damage: 1
        };
        
        projectiles.push(projectile);
        
        // Create particle effect for muzzle flash
        createParticles(player.x + player.width, player.y + player.height / 2, '#2ecc71', 5, 1);
        
        // Play shoot sound
        playSound('shoot');
    }
}

// Update projectiles
function updateProjectiles(deltaTime) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        
        // Move projectile
        projectile.x += projectile.speed * (deltaTime / FRAME_TIME);
        
        // Check if projectile is off-screen
        if (projectile.x > canvas.width) {
            projectiles.splice(i, 1);
            continue;
        }
        
        // Draw the projectile
        offscreenCtx.fillStyle = '#2ecc71';
        offscreenCtx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
        
        // Add glow effect
        offscreenCtx.shadowColor = '#2ecc71';
        offscreenCtx.shadowBlur = 10;
        offscreenCtx.fillStyle = 'rgba(46, 204, 113, 0.7)';
        offscreenCtx.fillRect(projectile.x - 2, projectile.y - 2, projectile.width + 4, projectile.height + 4);
        offscreenCtx.shadowBlur = 0;
        
        // Create trail particles
        if (frameCount % 3 === 0) {
            createParticles(projectile.x, projectile.y + projectile.height / 2, '#2ecc71', 1, 0.5);
        }
        
        // Check for collision with obstacles
        for (let j = obstacles.length - 1; j >= 0; j--) {
            const obstacle = obstacles[j];
            
            if (
                projectile.x < obstacle.x + obstacle.width &&
                projectile.x + projectile.width > obstacle.x &&
                projectile.y < obstacle.y + obstacle.height &&
                projectile.y + projectile.height > obstacle.y
            ) {
                // Remove the projectile
                projectiles.splice(i, 1);
                
                // Remove the obstacle and add score
                obstacles.splice(j, 1);
                
                // Create explosion particles
                createParticles(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, '#e74c3c', 20, 2);
                
                // Award bonus points
                const bonusPoints = 25 * comboMultiplier * (activePowerups.multiplier.active ? 2 : 1);
                score += bonusPoints;
                document.getElementById('score').textContent = score;
                
                // Increase combo
                comboMultiplier = Math.min(comboMultiplier + 1, 5);
                comboTimer = COMBO_DURATION;
                
                // Show floating text
                showFloatingText(`+${bonusPoints}`, obstacle.x, obstacle.y, '#2ecc71');
                
                // Play explosion sound
                playSound('explosion');
                
                break;
            }
        }
    }
}

// New function to show floating text
function showFloatingText(text, x, y, color) {
    const floatingText = {
        text: text,
        x: x,
        y: y,
        color: color,
        life: 60,
        velocity: -2
    };
    
    floatingTexts.push(floatingText);
}

// Add a new array for floating texts
let floatingTexts = [];

// Update and draw floating texts
function updateFloatingTexts(deltaTime) {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const text = floatingTexts[i];
        
        // Update position
        text.y += text.velocity * (deltaTime / FRAME_TIME);
        
        // Decrease life
        text.life -= deltaTime / 10;
        
        // Remove if expired
        if (text.life <= 0) {
            floatingTexts.splice(i, 1);
            continue;
        }
        
        // Draw the text with fade-out effect
        const alpha = text.life / 60;
        offscreenCtx.fillStyle = color_with_alpha(text.color, alpha);
        offscreenCtx.font = 'bold 20px Arial';
        offscreenCtx.textAlign = 'center';
        offscreenCtx.fillText(text.text, text.x, text.y);
    }
}

// Helper function to add alpha to a color
function color_with_alpha(color, alpha) {
    if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
}

// End the game
function endGame() {
    currentState = GAME_STATE.GAME_OVER;
    gameStarted = false;
    gameOver = true;
    lastGameScore = score;
    
    cancelAnimationFrame(animationFrame);
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        // Removed high score display update since element was removed from UI
    }
    
    // Check for high score
    isNewHighScore = checkForHighScore(score);
    
    // Show appropriate UI elements
    const gameOverScreen = document.querySelector('.game-over-screen');
    const nameEntry = document.querySelector('.name-entry');
    const finalScoreDisplay = document.getElementById('finalScore');
    
    finalScoreDisplay.textContent = score;
    gameOverScreen.style.display = 'block';
    
    // Show or hide name entry based on high score
    if (isNewHighScore) {
        nameEntry.style.display = 'block';
        document.getElementById('playerName').focus();
    } else {
        nameEntry.style.display = 'none';
    }
    
    document.getElementById('restartButton').style.display = 'inline-block';
}

// Restart the game
function restartGame() {
    // Hide the game over screen and leaderboard screen
    document.querySelector('.game-over-screen').style.display = 'none';
    document.querySelector('.leaderboard-screen').style.display = 'none';
    
    // Remove the hidden class from the restart button instead of adding it
    document.getElementById('restartButton').classList.remove('hidden');
    
    // Reset the submit button for next game
    const submitButton = document.getElementById('submitScore');
    submitButton.disabled = false;
    submitButton.style.backgroundColor = '#2ecc71';
    submitButton.textContent = 'SUBMIT';
    
    // Make sure the game canvas is visible
    canvas.style.display = 'block';
    
    // Reset game state and start
    currentState = GAME_STATE.MENU;
    startGame();
}

// Initialize game when page loads
window.addEventListener('load', initGame);

// Handle window resize
window.addEventListener('resize', function() {
    // Update canvas size
    const container = document.querySelector('.game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Update offscreen canvas
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    
    // Recache backgrounds
    for (let i = 0; i <= currentTheme; i++) {
        cacheBackground(i);
    }
    
    // Redraw current screen
    if (currentState === GAME_STATE.MENU) {
            drawTitleScreen();
    } else if (currentState === GAME_STATE.PAUSED) {
        drawPauseScreen();
    }
});

// Check for collisions with powerups
function checkPowerupCollisions() {
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        
        if (
            player.x < powerup.x + powerup.width &&
            player.x + player.width > powerup.x &&
            player.y < powerup.y + powerup.height &&
            player.y + player.height > powerup.y
        ) {
            // Collect the powerup
            powerups.splice(i, 1);
            
            // Activate the powerup
            activatePowerup(powerup.type);
            
            // Create particle effect
            createParticles(powerup.x, powerup.y, powerup.color, 15);
            
            // Show floating text
            let powerupName = '';
            switch (powerup.type) {
                case POWERUP_TYPES.SHIELD: powerupName = 'SHIELD'; break;
                case POWERUP_TYPES.JETPACK: powerupName = 'JETPACK'; break;
                case POWERUP_TYPES.MAGNET: powerupName = 'MAGNET'; break;
                case POWERUP_TYPES.MULTIPLIER: powerupName = 'MULTIPLIER'; break;
                case POWERUP_TYPES.BLASTER: powerupName = 'BLASTER'; break;
            }
            
            showFloatingText(powerupName + ' ACTIVATED!', powerup.x, powerup.y, powerup.color);
        }
    }
}

// Sounds dictionary
const sounds = {
    jump: new Audio('assets/sounds/jump.mp3'),
    collect: new Audio('assets/sounds/collect.mp3'),
    hit: new Audio('assets/sounds/hit.mp3'),
    powerup: new Audio('assets/sounds/powerup.mp3'),
    levelUp: new Audio('assets/sounds/level_up.mp3'),
    gameOver: new Audio('assets/sounds/game_over.mp3'),
    shoot: new Audio('assets/sounds/shoot.mp3'),
    explosion: new Audio('assets/sounds/explosion.mp3')
};

// Play sound function
function playSound(soundName) {
    // Create a clone to allow overlapping sounds
    if (sounds[soundName]) {
        sounds[soundName].cloneNode(true).play().catch(e => console.log("Sound play prevented:", e));
    }
}

// Add high score functionality

// After other global variables, add this
let highScores = [];
const MAX_HIGH_SCORES = 100;
const HIGH_SCORES_KEY = 'cosmoRunnerHighScores';
let playerRank = -1;
let isNewHighScore = false;

// Add function to load high scores
function loadHighScores() {
    const savedScores = localStorage.getItem(HIGH_SCORES_KEY);
    if (savedScores) {
        try {
            highScores = JSON.parse(savedScores);
        } catch (e) {
            console.error('Error loading high scores:', e);
            highScores = [];
        }
    }
}

// Add function to save high scores
function saveHighScores() {
    try {
        localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
    } catch (e) {
        console.error('Error saving high scores:', e);
    }
}

// Add function to check if score qualifies for high scores
function checkForHighScore(score) {
    if (highScores.length < MAX_HIGH_SCORES) {
        return true;
    }
    return score > highScores[highScores.length - 1].score;
}

// Add function to add score to high scores
function addHighScore(name, score) {
    const newScore = { name, score, date: new Date().toISOString() };
    highScores.push(newScore);
    
    // Sort high scores in descending order
    highScores.sort((a, b) => b.score - a.score);
    
    // Trim to max length
    if (highScores.length > MAX_HIGH_SCORES) {
        highScores = highScores.slice(0, MAX_HIGH_SCORES);
    }
    
    // Find player rank
    playerRank = highScores.findIndex(entry => entry === newScore) + 1;
    
    saveHighScores();
}

// Add function to check for offensive words
function containsOffensiveWord(name) {
    // List of offensive words to filter
    const offensiveWords = [
        'ass', 'sex', 'fuck', 'shit', 'dick', 'cunt', 'bitch',
        'nig', 'fag', 'gay', 'nazi', 'kill'
    ];
    
    const nameLower = name.toLowerCase();
    return offensiveWords.some(word => nameLower.includes(word));
}

// Add function to display leaderboard
function showLeaderboard() {
    const leaderboardScreen = document.querySelector('.leaderboard-screen');
    const leaderboardEntries = document.querySelector('.leaderboard-entries');
    
    // Clear previous entries
    leaderboardEntries.innerHTML = '';
    
    // Add entries
    highScores.forEach((score, index) => {
        const entry = document.createElement('div');
        entry.className = 'leaderboard-entry';
        if (index + 1 === playerRank) {
            entry.classList.add('highlight');
        }
        
        const rank = document.createElement('span');
        rank.className = 'rank';
        rank.textContent = `${index + 1}.`;
        
        const name = document.createElement('span');
        name.className = 'player-name';
        name.textContent = score.name;
        
        const scoreEl = document.createElement('span');
        scoreEl.className = 'score';
        scoreEl.textContent = score.score;
        
        entry.appendChild(rank);
        entry.appendChild(name);
        entry.appendChild(scoreEl);
        
        leaderboardEntries.appendChild(entry);
    });
    
    // Show leaderboard
    leaderboardScreen.style.display = 'block';
    
    // Hide other screens
    document.querySelector('.game-over-screen').style.display = 'none';
    document.getElementById('gameUI').style.display = 'none';
}

// Add initialization of high scores at game start
// Find the init function and add loadHighScores() to it
// ... existing code ...
function init() {
    // ... existing init code ...
    
    // Load high scores
    loadHighScores();
    
    // ... rest of existing init code ...
}

// Modify the endGame function to handle high scores
// ... existing endGame code ...
function endGame() {
    gameState = 'gameOver';
    lastGameScore = score;
    
    // Check for high score
    isNewHighScore = checkForHighScore(score);
    
    // Show appropriate UI elements
    const gameOverScreen = document.querySelector('.game-over-screen');
    const nameEntry = document.querySelector('.name-entry');
    const finalScoreDisplay = document.getElementById('finalScore');
    
    finalScoreDisplay.textContent = score;
    gameOverScreen.style.display = 'block';
    
    // Show or hide name entry based on high score
    if (isNewHighScore) {
        nameEntry.style.display = 'block';
        document.getElementById('playerName').focus();
    } else {
        nameEntry.style.display = 'none';
    }
    
    // ... existing code for play again button ...
}

// Add event listeners for high score functionality
document.addEventListener('DOMContentLoaded', function() {
    // ... existing event listeners ...
    
    // Remove duplicate Submit score button event listener
    // The submitScore button event listener is already defined in initGame()
    
    // View leaderboard button
    document.getElementById('viewLeaderboardButton').addEventListener('click', function() {
        showLeaderboard();
    });
    
    // Close leaderboard button
    document.getElementById('closeLeaderboard').addEventListener('click', function() {
        document.querySelector('.leaderboard-screen').style.display = 'none';
        document.querySelector('.game-over-screen').style.display = 'block';
    });
    
    // Setup hidden reset trigger
    document.getElementById('resetTrigger').addEventListener('click', function() {
        // Show password modal
        document.getElementById('passwordModal').classList.remove('hidden');
    });
    
    // Setup password confirmation button
    document.getElementById('confirmReset').addEventListener('click', function() {
        const password = document.getElementById('resetPassword').value;
        
        // Check if password is correct (cosmic1234)
        if (password === 'cosmic1234') {
            clearHighScores();
        } else {
            alert('Incorrect password!');
        }
        
        // Clear password field
        document.getElementById('resetPassword').value = '';
    });
    
    // Setup cancel button
    document.getElementById('cancelReset').addEventListener('click', function() {
        // Hide password modal
        document.getElementById('passwordModal').classList.add('hidden');
        
        // Clear password field
        document.getElementById('resetPassword').value = '';
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !document.getElementById('passwordModal').classList.contains('hidden')) {
            document.getElementById('passwordModal').classList.add('hidden');
            document.getElementById('resetPassword').value = '';
        }
    });
    
    // ... existing code ...
});

// ... existing code ...

// Function to handle high score reset
function clearHighScores() {
    // Reset high scores array
    highScores = [];
    
    // Save empty high scores to local storage
    saveHighScores();
    
    // Update high score value
    highScore = 0;
    localStorage.setItem('highScore', 0);
    // Removed high score display update since element was removed from UI
    
    // Hide password modal
    document.getElementById('passwordModal').classList.add('hidden');
    
    // Show confirmation
    alert('High scores cleared successfully!');
}

// ... existing code ...

// Add function to initialize touch controls
function initTouchControls() {
    // Add touch event listeners
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Mobile control buttons
    const jumpButton = document.getElementById('jumpButton');
    const slideButton = document.getElementById('slideButton');
    const shootButton = document.getElementById('shootButton'); // New shoot button
    
    if (jumpButton && slideButton) {
        jumpButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (currentState === GAME_STATE.PLAYING) {
                player.jump();
            }
        });
        
        slideButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (currentState === GAME_STATE.PLAYING) {
                player.slide();
            }
        });
    }
    
    if (shootButton) {
        shootButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (currentState === GAME_STATE.PLAYING && activePowerups.blaster.active) {
                shootProjectile();
            }
        });
    }
    
    // Show mobile controls
    document.querySelector('.mobile-controls').style.display = 'flex';
}