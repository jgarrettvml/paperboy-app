/**
 * Main game logic for Paperboy 3D
 */

import * as THREE from 'three';
import { Player } from './player.js';
import { Controls } from './controls.js';
import { UI } from './ui.js';
import { WorldGenerator } from './world/blocks.js';
import { createNewspaper } from './world/obstacles.js';
import { checkCollision } from './utils.js';

export class Game {
    constructor() {
        // Game variables
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.controls = null;
        this.ui = null;
        this.worldGenerator = null;
        this.clock = new THREE.Clock();
        this.deltaTime = 0;
        
        // Game state
        this.isActive = false;
        this.score = 0;
        this.papers = 100;
        this.lives = 3;
        
        // Game world data
        this.obstacles = [];
        this.mailboxes = [];
        this.porches = [];
        this.newspapers = [];
        this.gameTime = 0;
    }
    
    /**
     * Initialize the game
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background

        // Create camera
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 20, -15);
        this.camera.lookAt(0, 0, 10);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.getElementById('game-container').appendChild(this.renderer.domElement);

        // Add lighting
        this.setupLighting();
        
        // Create player
        this.player = new Player(this.scene);
        this.player.create();
        
        // Generate world
        this.worldGenerator = new WorldGenerator(this.scene);
        const worldData = this.worldGenerator.generateWorld();
        this.obstacles = worldData.obstacles;
        this.mailboxes = worldData.mailboxes;
        this.porches = worldData.porches;
        
        // Set up user interface
        this.ui = new UI(this);
        
        // Set up controls
        this.controls = new Controls(this);
    }
    
    /**
     * Set up scene lighting
     */
    setupLighting() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Add directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 20);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        this.scene.add(directionalLight);
    }
    
    /**
     * Start the game
     */
    startGame() {
        console.log('Game started!');
        this.isActive = true;
        this.ui.hideStartScreen();
        this.score = 0;
        this.papers = 100;
        this.lives = 3;
        this.ui.update();
        this.clock.start();
        
        // Add a debug listener for spacebar
        document.addEventListener('keydown', (event) => {
            if (event.key === ' ' && this.isActive) {
                console.log('Spacebar pressed in active game');
            }
        });
    }
    
    /**
     * Restart the game
     */
    restartGame() {
        this.player.reset();
        this.isActive = true;
        this.score = 0;
        this.papers = 100;
        this.lives = 3;
        this.gameTime = 0;
        
        // Clear newspapers
        for (const newspaper of this.newspapers) {
            this.scene.remove(newspaper.object);
        }
        this.newspapers = [];
        
        this.ui.update();
        this.ui.hideGameOverScreen();
        this.clock.start();
    }
    
    /**
     * End the game
     */
    endGame() {
        this.isActive = false;
        this.ui.showGameOverScreen();
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Throw newspaper in the appropriate direction
     */
    throwNewspaper() {
        console.log('Game.throwNewspaper called');
        
        // Calculate direction - either left or right based on player rotation
        const throwDirection = new THREE.Vector3();
        const playerDirection = new THREE.Vector3(0, 0, 1)
            .applyQuaternion(this.player.object.quaternion);
        
        // Cross product to get perpendicular direction (left or right)
        // We'll use the current player direction to determine which side to throw
        const throwSide = Math.sin(this.player.object.rotation.y) > 0 ? -1 : 1; // Left or right
        
        throwDirection.x = playerDirection.z * throwSide;
        throwDirection.z = -playerDirection.x * throwSide;

        console.log('Throwing direction:', throwDirection);
        
        this.createNewspaper(
            this.player.position.x + throwDirection.x * 0.5,
            this.player.position.y + 1,
            this.player.position.z + throwDirection.z * 0.5,
            throwDirection.x * 0.5,
            throwDirection.z * 0.5
        );
    }
    
    /**
     * Create a newspaper
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @param {number} velocityX - X velocity
     * @param {number} velocityZ - Z velocity
     */
    createNewspaper(x, y, z, velocityX, velocityZ) {
        if (this.papers <= 0) return;
        
        console.log('Creating newspaper at', x, y, z);
        
        this.papers--;
        this.ui.update();
        
        const newspaper = createNewspaper(this.scene, x, y, z, velocityX, velocityZ);
        this.newspapers.push(newspaper);
    }
    
    /**
     * Check if player is on a hill
     * @returns {boolean} Whether player is on a hill
     */
    isPlayerOnHill() {
        for (const obstacle of this.obstacles) {
            if (obstacle.type === 'hill') {
                const dx = Math.abs(this.player.position.x - obstacle.position.x);
                const dz = Math.abs(this.player.position.z - obstacle.position.z);
                
                if (dx < obstacle.width / 2 && dz < obstacle.depth / 2) {
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
     * Check collisions between player and obstacles
     * @returns {boolean} Whether a collision occurred
     */
    checkObstacleCollisions() {
        if (this.player.isInvincible) return false;
        
        for (const obstacle of this.obstacles) {
            if (obstacle.type === 'hill') continue; // Hills are not obstacles
            
            const dx = Math.abs(this.player.position.x - obstacle.position.x);
            const dz = Math.abs(this.player.position.z - obstacle.position.z);
            
            if (dx < (this.player.width / 2 + obstacle.width / 2) * 0.7 &&
                dz < (this.player.depth / 2 + obstacle.depth / 2) * 0.7) {
                
                // Collision detected
                this.score -= 5;
                this.lives--;
                this.ui.update();
                
                // Make player invincible for a short time
                this.player.makeInvincible();
                
                // Check game over
                if (this.lives <= 0) {
                    this.endGame();
                }
                
                return true;
            }
        }
        return false;
    }
    
    /**
     * Update newspapers with improved collision detection
     */
    updateNewspapers() {
        // Skip if no newspapers
        if (this.newspapers.length === 0) return;
        
        console.log(`Updating ${this.newspapers.length} newspapers`);
        
        for (let i = this.newspapers.length - 1; i >= 0; i--) {
            const newspaper = this.newspapers[i];
            
            if (newspaper.thrown && !newspaper.delivered) {
                // Store previous position for collision detection
                const prevPos = newspaper.position.clone();
                
                // Apply gravity and update position
                newspaper.velocity.y -= 0.015;
                newspaper.position.add(newspaper.velocity);
                
                // Check wall collisions
                const walls = this.scene.children.filter(obj => 
                    obj.userData && obj.userData.type === 'wall');
                for (const wall of walls) {
                    const bbox = new THREE.Box3().setFromObject(wall);
                    if (bbox.containsPoint(newspaper.position)) {
                        newspaper.position.copy(prevPos);
                        newspaper.thrown = false;
                        break;
                    }
                }
                
                // Check mailbox deliveries with more generous bounds
                for (const mailbox of this.mailboxes) {
                    const dx = Math.abs(newspaper.position.x - mailbox.position.x);
                    const dz = Math.abs(newspaper.position.z - mailbox.position.z);
                    const dy = Math.abs(newspaper.position.y - 1.2);
                    
                    if (dx < 0.75 && dz < 0.75 && dy < 1.0) {
                        newspaper.delivered = true;
                        newspaper.thrown = false;
                        newspaper.velocity.set(0, 0, 0);
                        newspaper.position.y = 1.2;
                        this.score += 20;
                        this.ui.update();
                        break;
                    }
                }
                
                // Check porch deliveries with more generous bounds
                for (const porch of this.porches) {
                    const dx = Math.abs(newspaper.position.x - porch.position.x);
                    const dz = Math.abs(newspaper.position.z - porch.position.z);
                    
                    if (dx < porch.width && dz < porch.length && 
                        newspaper.position.y < 0.5) {
                        newspaper.delivered = true;
                        newspaper.thrown = false;
                        newspaper.velocity.set(0, 0, 0);
                        newspaper.position.y = 0.2;
                        this.score += 10;
                        this.ui.update();
                        break;
                    }
                }
                
                // Ground collision
                if (newspaper.position.y <= 0.05) {
                    newspaper.position.y = 0.05;
                    newspaper.thrown = false;
                    newspaper.velocity.set(0, 0, 0);
                }
                
                // Update the visual object position
                newspaper.object.position.copy(newspaper.position);
            }
            
            // Remove old undelivered papers
            if (!newspaper.thrown && !newspaper.delivered && this.gameTime > 30) {
                this.scene.remove(newspaper.object);
                this.newspapers.splice(i, 1);
            }
        }
    }
    
    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.deltaTime = this.clock.getDelta();
        
        if (this.isActive) {
            this.gameTime += this.deltaTime;
            
            // Update player position if no collision
            if (!this.checkObstacleCollisions()) {
                this.player.update(this.deltaTime);
            }
            
            // Update camera position to follow player
            this.camera.position.x = this.player.position.x * 0.5;
            this.camera.position.z = this.player.position.z - 15;
            this.camera.lookAt(this.player.position.x, this.player.position.y, this.player.position.z + 10);
            
            // Update newspapers
            this.updateNewspapers();
            
            // End game if out of papers and no newspapers left
            if (this.papers <= 0 && this.newspapers.length === 0 && this.lives > 0) {
                this.endGame();
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        this.controls.cleanup();
        
        // Remove all scene objects
        while(this.scene.children.length > 0) { 
            this.scene.remove(this.scene.children[0]); 
        }
        
        // Remove renderer from DOM
        if (this.renderer && this.renderer.domElement) {
            document.getElementById('game-container').removeChild(this.renderer.domElement);
        }
        
        // Dispose of geometry and materials
        this.renderer.dispose();
    }
}