/**
 * Main entry point for Paperboy 3D game
 */

import * as THREE from 'three';
import { Game } from './game.js';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Paperboy 3D game...');
    
    // Create the game instance
    const game = new Game();
    
    // Initialize the game
    game.init();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        game.onWindowResize();
    });
    
    // Start the animation loop
    game.animate();
});