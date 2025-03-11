/**
 * UI management for Paperboy 3D game
 */

import { getElementById } from './utils.js';

export class UI {
    constructor(game) {
        this.game = game;
        
        // Get DOM elements
        this.scoreElement = getElementById('score');
        this.papersElement = getElementById('papers');
        this.livesElement = getElementById('lives');
        this.startScreen = getElementById('start-screen');
        this.startButton = getElementById('start-button');
        this.gameOverScreen = getElementById('game-over');
        this.finalScoreElement = getElementById('final-score');
        this.restartButton = getElementById('restart-button');
        
        // Attach event listeners
        this.startButton.addEventListener('click', () => this.game.startGame());
        this.restartButton.addEventListener('click', () => this.game.restartGame());
    }
    
    /**
     * Update UI elements with current game state
     */
    update() {
        this.scoreElement.textContent = this.game.score;
        this.papersElement.textContent = this.game.papers;
        this.livesElement.textContent = this.game.lives;
    }
    
    /**
     * Show start screen
     */
    showStartScreen() {
        this.startScreen.style.display = 'flex';
        this.gameOverScreen.style.display = 'none';
    }
    
    /**
     * Hide start screen
     */
    hideStartScreen() {
        this.startScreen.style.display = 'none';
    }
    
    /**
     * Show game over screen
     */
    showGameOverScreen() {
        this.gameOverScreen.style.display = 'flex';
        this.finalScoreElement.textContent = this.game.score;
    }
    
    /**
     * Hide game over screen
     */
    hideGameOverScreen() {
        this.gameOverScreen.style.display = 'none';
    }
}