/**
 * Controls handling for Paperboy 3D game
 */

export class Controls {
    constructor(game) {
        this.game = game;
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            w: false,
            a: false,
            s: false,
            d: false,
            ' ': false
        };
        
        // Bind event listeners
        this.setupEventListeners();
        
        // Set update interval
        this.updateInterval = setInterval(() => this.update(), 16);
    }
    
    /**
     * Set up event listeners for keyboard controls
     */
    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    /**
     * Handle key down events
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        if (this.keys.hasOwnProperty(e.key)) {
            this.keys[e.key] = true;
            
            // Handle special key actions
            this.handleSpecialKeyActions(e.key);
        }
    }
    
    /**
     * Handle key up events
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyUp(e) {
        if (this.keys.hasOwnProperty(e.key)) {
            this.keys[e.key] = false;
        }
    }
    
    /**
     * Handle special key actions
     * @param {string} key - Key that was pressed
     */
    handleSpecialKeyActions(key) {
        // Only process actions if game is active
        if (!this.game.isActive) return;
        
        // Jump when going over a hill
        if ((key === 'ArrowUp' || key === 'w') && 
            this.game.player.canJump && 
            this.game.isPlayerOnHill()) {
            this.game.player.startJump();
            this.game.score += 20;
            this.game.ui.update();
        }
        
        // Throw newspaper with space bar
        if (key === ' ' && this.game.papers > 0) {
            console.log('Spacebar pressed, calling throwNewspaper');
            this.game.throwNewspaper();
        }
    }
    
    /**
     * Update player movement based on key states
     */
    update() {
        if (!this.game.isActive) return;
        
        // Reset lateral velocity only
        this.game.player.velocity.x = 0;
        
        // Always move forward automatically
        this.game.player.velocity.z = this.game.player.speed;
        
        // Apply controls for left and right movement only (reversed as requested)
        if (this.keys.ArrowLeft || this.keys.a) {
            this.game.player.velocity.x = this.game.player.speed; // Right movement (reversed)
        }
        if (this.keys.ArrowRight || this.keys.d) {
            this.game.player.velocity.x = -this.game.player.speed; // Left movement (reversed)
        }
    }
    
    /**
     * Clean up event listeners and intervals
     */
    cleanup() {
        clearInterval(this.updateInterval);
    }
}