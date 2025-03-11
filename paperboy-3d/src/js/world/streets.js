/**
 * Street generation for Paperboy 3D game
 */

import * as THREE from 'three';
import { COLORS } from '../utils.js';

/**
 * Create a cross-street
 * @param {THREE.Group} blockGroup - Block group to add street to
 * @param {number} zOffset - Z position offset
 * @param {number} blockWidth - Width of the block
 * @param {Array} obstacles - Array to add obstacle data to
 */
export function createCrossStreet(blockGroup, zOffset, blockWidth, obstacles) {
    // Street
    const street = new THREE.Mesh(
        new THREE.PlaneGeometry(blockWidth * 3, 10),
        new THREE.MeshLambertMaterial({ color: COLORS.STREET })
    );
    street.rotation.x = -Math.PI / 2;
    street.position.set(0, 0.06, zOffset);
    street.receiveShadow = true;
    blockGroup.add(street);
    
    // White lines on the street
    const lineWidth = 0.3;
    const lineMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    
    // Center line
    const centerLine = new THREE.Mesh(
        new THREE.PlaneGeometry(lineWidth, 9),
        lineMaterial
    );
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.set(0, 0.07, zOffset);
    centerLine.receiveShadow = true;
    blockGroup.add(centerLine);
    
    // Side lines
    for (let i = -1; i <= 1; i += 2) {
        const sideLine = new THREE.Mesh(
            new THREE.PlaneGeometry(lineWidth, 9),
            lineMaterial
        );
        sideLine.rotation.x = -Math.PI / 2;
        sideLine.position.set(blockWidth * 0.5 * i, 0.07, zOffset);
        sideLine.receiveShadow = true;
        blockGroup.add(sideLine);
    }
    
    // Add street props
    addStreetProps(blockGroup, zOffset, blockWidth, obstacles);
}

/**
 * Add props to the cross-street
 * @param {THREE.Group} blockGroup - Block group to add props to
 * @param {number} zOffset - Z position offset
 * @param {number} blockWidth - Width of the block
 * @param {Array} obstacles - Array to add obstacle data to
 */
function addStreetProps(blockGroup, zOffset, blockWidth, obstacles) {
    // Street lights
    for (let i = -1; i <= 1; i += 2) {
        const lightPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 4, 8),
            new THREE.MeshLambertMaterial({ color: 0x333333 })
        );
        lightPole.position.set(blockWidth * 0.7 * i, 2, zOffset);
        lightPole.castShadow = true;
        blockGroup.add(lightPole);
        
        const lightHead = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.3, 0.8),
            new THREE.MeshLambertMaterial({ color: 0x555555 })
        );
        lightHead.position.set(blockWidth * 0.7 * i, 4, zOffset);
        lightHead.castShadow = true;
        blockGroup.add(lightHead);
        
        // Light cone
        const light = new THREE.PointLight(0xFFFF99, 0.5, 10);
        light.position.set(blockWidth * 0.7 * i, 4, zOffset);
        blockGroup.add(light);
    }
    
    // Add stop signs at intersections
    for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
            if (Math.random() > 0.5) {
                createStopSign(
                    blockGroup,
                    blockWidth * 0.5 * i,
                    zOffset + 4 * j,
                    obstacles
                );
            }
        }
    }
}

/**
 * Create a stop sign
 * @param {THREE.Group} blockGroup - Block group to add sign to
 * @param {number} x - X position
 * @param {number} z - Z position
 * @param {Array} obstacles - Array to add obstacle data to
 */
function createStopSign(blockGroup, x, z, obstacles) {
    const signGroup = new THREE.Group();
    
    // Pole
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 2, 8),
        new THREE.MeshLambertMaterial({ color: 0x888888 })
    );
    pole.position.y = 1;
    pole.castShadow = true;
    signGroup.add(pole);
    
    // Sign
    const sign = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.05, 8),
        new THREE.MeshLambertMaterial({ color: 0xFF0000 })
    );
    sign.position.y = 2;
    sign.rotation.x = Math.PI / 2;
    sign.castShadow = true;
    signGroup.add(sign);
    
    // Add to block
    signGroup.position.set(x, 0, z);
    blockGroup.add(signGroup);
    
    // Register for collision
    obstacles.push({
        position: new THREE.Vector3(x, 0, z + blockGroup.position.z),
        width: 0.3,
        height: 2,
        depth: 0.3,
        type: 'sign'
    });
}