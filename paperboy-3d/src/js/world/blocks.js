/**
 * Block generation for Paperboy 3D game
 */

import * as THREE from 'three';
import { createHousesBlock } from './houses.js';
import { createPark } from './parks.js';
import { createCrossStreet } from './streets.js';

export class WorldGenerator {
    constructor(scene) {
        this.scene = scene;
        this.gameBlocks = [];
        this.obstacles = [];
        this.houses = [];
        this.mailboxes = [];
        this.porches = [];
        this.blockLength = 30;
        this.blockWidth = 20;
        this.streetWidth = 10;
        this.totalBlocks = 20;
    }
    
    /**
     * Generate the complete game world
     */
    generateWorld() {
        for (let i = 0; i < this.totalBlocks; i++) {
            const isPark = i > 0 && i % 3 === 0;
            this.createBlock(i, isPark);
        }
        
        return {
            obstacles: this.obstacles,
            mailboxes: this.mailboxes,
            porches: this.porches
        };
    }
    
    /**
     * Create a block of houses or a park
     * @param {number} blockIndex - Index of the block
     * @param {boolean} isPark - Whether this block should be a park
     */
    createBlock(blockIndex, isPark) {
        const blockZ = blockIndex * (this.blockLength + this.streetWidth);
        const block = new THREE.Group();
        block.position.z = blockZ;
        
        if (isPark) {
            createPark(block, this, this.obstacles);
        } else {
            createHousesBlock(block, this, this.obstacles, this.mailboxes, this.porches);
        }
        
        // Add cross-street at the end of each block
        if (blockIndex > 0) {
            createCrossStreet(block, -this.streetWidth/2, this.blockWidth, this.obstacles);
        }
        
        this.scene.add(block);
        this.gameBlocks.push(block);
    }
    
    /**
     * Clean up the world when restarting
     */
    cleanup() {
        // Remove all blocks from the scene
        for (const block of this.gameBlocks) {
            this.scene.remove(block);
        }
        
        // Clear arrays
        this.gameBlocks = [];
        this.obstacles = [];
        this.houses = [];
        this.mailboxes = [];
        this.porches = [];
    }
}