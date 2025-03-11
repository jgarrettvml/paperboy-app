/**
 * Player character for Paperboy 3D game
 */

import * as THREE from 'three';
import { COLORS } from './utils.js';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.object = null;
        this.width = 1;
        this.height = 2;
        this.depth = 1.5;
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.speed = 0.10;
        this.canJump = true;
        this.isJumping = false;
        this.jumpSpeed = 0.2;
        this.playerHeight = 1;
        this.isInvincible = false;
        this.invincibleTime = 0;
        this.blinkTime = 0;
        this.isVisible = true;
    }
    
    /**
     * Create player character
     */
    create() {
        // Create player group
        this.object = new THREE.Group();
        
        // Create bicycle
        const bikeFrame = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 1.5),
            new THREE.MeshLambertMaterial({ color: 0x333333 })
        );
        bikeFrame.position.y = 0.5;
        this.object.add(bikeFrame);

        // Wheels - rotated to be vertical
        const wheelGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 16);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        frontWheel.position.set(0, 0.5, -0.6);
        frontWheel.rotation.y = Math.PI / 2;
        this.object.add(frontWheel);
        
        const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        backWheel.position.set(0, 0.5, 0.6);
        backWheel.rotation.y = Math.PI / 2;
        this.object.add(backWheel);

        // Rider
        const riderBody = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.8, 0.4),
            new THREE.MeshLambertMaterial({ color: COLORS.PLAYER })
        );
        riderBody.position.set(0, 1.2, 0);
        this.object.add(riderBody);

        const riderHead = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 16, 16),
            new THREE.MeshLambertMaterial({ color: 0xFFCCAA })
        );
        riderHead.position.set(0, 1.7, 0);
        this.object.add(riderHead);

        // Newspaper bag
        const newspaperBag = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.4, 0.6),
            new THREE.MeshLambertMaterial({ color: 0xBB5500 })
        );
        newspaperBag.position.set(0, 1.2, 0.5);
        this.object.add(newspaperBag);

        // Add helmet
        const helmet = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshLambertMaterial({ color: 0x0055AA })
        );
        helmet.position.set(0, 1.8, 0);
        helmet.rotation.x = 0.2;
        this.object.add(helmet);

        // Set position
        this.position.set(0, this.playerHeight, 0);
        this.object.position.copy(this.position);
        
        // Add shadows
        this.object.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        // Add to scene
        this.scene.add(this.object);
    }
    
    /**
     * Update player state
     * @param {number} deltaTime - Time since last update in seconds
     */
    update(deltaTime) {
        // Update position based on velocity
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;
        
        // Limit player to road area
        this.position.x = Math.max(-15, Math.min(15, this.position.x));
        
        // Handle jumping
        if (this.isJumping) {
            this.position.y += this.velocity.y;
            this.velocity.y -= 0.01;
            
            if (this.position.y <= this.playerHeight) {
                this.position.y = this.playerHeight;
                this.isJumping = false;
                this.velocity.y = 0;
                this.canJump = true;
            }
        }
        
        // Update player object position
        this.object.position.copy(this.position);
        
        // Update player rotation based on movement direction
        if (this.velocity.x !== 0 || this.velocity.z !== 0) {
            const angle = Math.atan2(this.velocity.x, this.velocity.z);
            this.object.rotation.y = angle;
        }
        
        // Handle invincibility
        if (this.isInvincible) {
            this.invincibleTime += deltaTime;
            this.blinkTime += deltaTime;
            
            // Blink effect
            if (this.blinkTime > 0.1) {
                this.blinkTime = 0;
                this.isVisible = !this.isVisible;
                this.object.visible = this.isVisible;
            }
            
            // End invincibility after 2 seconds
            if (this.invincibleTime > 2) {
                this.isInvincible = false;
                this.object.visible = true;
            }
        }
    }
    
    /**
     * Start jump
     */
    startJump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocity.y = this.jumpSpeed;
            this.canJump = false;
        }
    }
    
    /**
     * Make player invincible for a short time
     */
    makeInvincible() {
        this.isInvincible = true;
        this.invincibleTime = 0;
        this.blinkTime = 0;
    }
    
    /**
     * Reset player state
     */
    reset() {
        this.position.set(0, this.playerHeight, 0);
        this.velocity.set(0, 0, 0);
        this.isJumping = false;
        this.canJump = true;
        this.isInvincible = false;
        this.object.position.copy(this.position);
        this.object.visible = true;
    }
}