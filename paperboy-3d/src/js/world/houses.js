/**
 * House generation for Paperboy 3D game
 */

import * as THREE from 'three';
import { COLORS, getRandomInt } from '../utils.js';
import { createMailbox } from './obstacles.js';

/**
 * Create a block with houses
 * @param {THREE.Group} blockGroup - Block group to add houses to
 * @param {Object} worldData - World data
 * @param {Array} obstacles - Array to add obstacle data to
 * @param {Array} mailboxes - Array to add mailbox data to
 * @param {Array} porches - Array to add porch data to
 */
export function createHousesBlock(blockGroup, worldData, obstacles, mailboxes, porches) {
    const blockWidth = worldData.blockWidth;
    const blockLength = worldData.blockLength;
    
    // Create single large grass base plane
    const grassBase = new THREE.Mesh(
        new THREE.PlaneGeometry(blockWidth * 2, blockLength),
        new THREE.MeshLambertMaterial({ color: COLORS.GRASS })
    );
    grassBase.rotation.x = -Math.PI / 2;
    grassBase.position.set(0, -0.02, blockLength / 2);
    grassBase.receiveShadow = true;
    blockGroup.add(grassBase);
    
    // Create street on top of grass
    const street = new THREE.Mesh(
        new THREE.PlaneGeometry(blockWidth/2, blockLength),
        new THREE.MeshLambertMaterial({ color: COLORS.STREET })
    );
    street.rotation.x = -Math.PI / 2;
    street.position.set(0, 0, blockLength / 2);
    street.receiveShadow = true;
    blockGroup.add(street);
    
    // Create sidewalks on top of grass
    const leftSidewalk = new THREE.Mesh(
        new THREE.PlaneGeometry(3, blockLength),
        new THREE.MeshLambertMaterial({ color: COLORS.SIDEWALK })
    );
    leftSidewalk.rotation.x = -Math.PI / 2;
    leftSidewalk.position.set(-(blockWidth / 4) - 1.5, 0.01, blockLength / 2);
    leftSidewalk.receiveShadow = true;
    blockGroup.add(leftSidewalk);
    
    const rightSidewalk = new THREE.Mesh(
        new THREE.PlaneGeometry(3, blockLength),
        new THREE.MeshLambertMaterial({ color: COLORS.SIDEWALK })
    );
    rightSidewalk.rotation.x = -Math.PI / 2;
    rightSidewalk.position.set((blockWidth / 4) + 1.5, 0.01, blockLength / 2);
    rightSidewalk.receiveShadow = true;
    blockGroup.add(rightSidewalk);
    
    // Create houses (4 on each side)
    const houseWidth = 6;
    const houseLength = 8;
    const houseSpacing = (blockLength - (houseLength * 4)) / 5;
    
    // Fixed x-positions for houses to align precisely with the blue guidelines
    // Further reduced from ±8 to ±6 to match blue guidelines in screenshot
    const leftHouseX = -(blockWidth / 2) - 6; // Original was -12, moved inward by 6
    const rightHouseX = (blockWidth / 2) + 6; // Original was +12, moved inward by 6
    
    // Shift the entire sequence of houses by moving the starting z-position
    // Adjusted zOffset from 3 to 4 for better alignment with blue guidelines
    const zOffset = 4;
    
    for (let i = 0; i < 4; i++) {
        const houseZ = (houseSpacing + zOffset) + i * (houseLength + houseSpacing);
        
        // Left side house
        createHouse(
            blockGroup, 
            leftHouseX,
            houseZ,
            houseWidth,
            houseLength,
            true,
            mailboxes,
            porches
        );
        
        // Right side house
        createHouse(
            blockGroup, 
            rightHouseX,
            houseZ,
            houseWidth,
            houseLength,
            false,
            mailboxes,
            porches
        );
    }
    
    // Add obstacles
    addObstacles(blockGroup, blockWidth, blockLength, obstacles);
}

/**
 * Create a house
 * @param {THREE.Group} blockGroup - Block group to add house to
 * @param {number} x - X position
 * @param {number} z - Z position
 * @param {number} width - House width
 * @param {number} length - House length
 * @param {boolean} isLeftSide - Whether house is on left side
 * @param {Array} mailboxes - Array to add mailbox data to
 * @param {Array} porches - Array to add porch data to
 */
function createHouse(blockGroup, x, z, width, length, isLeftSide, mailboxes, porches) {
    const houseGroup = new THREE.Group();
    
    // Base house dimensions
    const baseWidth = width;
    const baseLength = length - 3;

    // Choose house color to match mailbox colors
    const houseStyle = getRandomInt(0, 2);
    let houseColor;
    switch(houseStyle) {
        case 0: // Classic red
            houseColor = 0xCC0000;
            break;
        case 1: // Black
            houseColor = 0x222222;
            break;
        case 2: // Blue
            houseColor = 0x0033AA;
            break;
    }
    
    // House base with selected color
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(baseWidth, 2, baseLength),
        new THREE.MeshLambertMaterial({ color: houseColor })
    );
    base.position.set(0, 1, -1.5);
    base.castShadow = true;
    
    // Roof - keeping black
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(baseWidth * 0.7, 1.5, 4),
        new THREE.MeshLambertMaterial({ color: COLORS.HOUSE_ROOF }) // Keep black
    );
    roof.position.set(0, 2.75, -1.5);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    
    // Front porch
    const porch = new THREE.Mesh(
        new THREE.BoxGeometry(baseWidth, 0.2, 3),
        new THREE.MeshLambertMaterial({ color: COLORS.PORCH })
    );
    porch.position.set(0, 0.1, baseLength/2);
    porch.receiveShadow = true;
    porch.userData.type = 'porch';
    
    // Porch steps
    const steps = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.4, 1),
        new THREE.MeshLambertMaterial({ color: COLORS.PORCH })
    );
    steps.position.set(0, 0.2, baseLength/2 + 1.5);
    steps.receiveShadow = true;
    
    // Add all parts to house group
    houseGroup.add(base);
    houseGroup.add(roof);
    houseGroup.add(porch);
    houseGroup.add(steps);
    
    // Position and rotate house
    houseGroup.position.set(x, 0, z);
    houseGroup.rotation.y = isLeftSide ? Math.PI/2 : -Math.PI/2;
    blockGroup.add(houseGroup);

    // Add driveway strip from between houses to sidewalk
    const driveWidth = 4;  // Width of gap between houses
    const driveLength = 15;  // Length to reach sidewalk
    
    const driveway = new THREE.Mesh(
        new THREE.PlaneGeometry(driveWidth, driveLength),
        new THREE.MeshLambertMaterial({ color: 0x999999 })
    );
    driveway.rotation.x = -Math.PI / 2;  // Keep flat like sidewalk
    
    // Position from between houses to sidewalk
    const driveZ = z + (isLeftSide ? driveLength/2 : -driveLength/2);
    driveway.position.set(x, 0.01, driveZ);
    driveway.receiveShadow = true;
    blockGroup.add(driveway);
    
    // Add mailbox at side of porch with matching color
    const mailboxX = isLeftSide ? x + baseWidth/2 : x - baseWidth/2;
    const mailboxZ = z + (isLeftSide ? baseLength/2 : -baseLength/2);
    createMailbox(blockGroup, mailboxX, mailboxZ, houseStyle, mailboxes); // Pass the style to match house color
    
    // Add collision meshes for house and porch
    const wallCollision = new THREE.Mesh(
        new THREE.BoxGeometry(baseWidth, 3, 0.5),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    wallCollision.position.set(
        x + (isLeftSide ? baseLength/2 : -baseLength/2),
        1.5,
        z
    );
    wallCollision.rotation.y = isLeftSide ? Math.PI/2 : -Math.PI/2;
    wallCollision.userData.type = 'wall';
    blockGroup.add(wallCollision);
    
    // Register porch for delivery
    const porchPos = new THREE.Vector3(
        x,
        0.2,
        isLeftSide ? z + baseLength/2 + 1 : z - baseLength/2 - 1
    );
    porches.push({
        position: porchPos.clone().add(blockGroup.position),
        width: baseWidth,
        length: 3
    });
}

/**
 * Add obstacles to a block
 * @param {THREE.Group} blockGroup - Block group to add obstacles to
 * @param {number} blockWidth - Width of the block
 * @param {number} blockLength - Length of the block
 * @param {Array} obstacles - Array to add obstacle data to
 */
function addObstacles(blockGroup, blockWidth, blockLength, obstacles) {
    // Add cars
    for (let i = 0; i < 2; i++) {
        const carX = (Math.random() - 0.5) * (blockWidth - 4);
        const carZ = Math.random() * blockLength;
        createCar(blockGroup, carX, carZ, obstacles);
    }
    
    // Add street drains
    for (let i = 0; i < 3; i++) {
        const drainX = (Math.random() - 0.5) * blockWidth;
        const drainZ = i * (blockLength / 3) + Math.random() * (blockLength / 6);
        createDrain(blockGroup, drainX, drainZ, obstacles);
    }
}

/**
 * Create a car
 * @param {THREE.Group} blockGroup - Block group to add car to
 * @param {number} x - X position
 * @param {number} z - Z position
 * @param {Array} obstacles - Array to add obstacle data to
 */
function createCar(blockGroup, x, z, obstacles) {
    const carGroup = new THREE.Group();
    
    // Car body
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 4),
        new THREE.MeshLambertMaterial({ color: COLORS.CAR })
    );
    body.position.y = 0.75;
    body.castShadow = true;
    carGroup.add(body);
    
    // Car top
    const top = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.8, 2),
        new THREE.MeshLambertMaterial({ color: COLORS.CAR })
    );
    top.position.set(0, 1.7, -0.5);
    top.castShadow = true;
    carGroup.add(top);
    
    // Windows
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x88CCFF });
    
    // Windshield
    const windshield = new THREE.Mesh(
        new THREE.PlaneGeometry(1.7, 0.7),
        windowMaterial
    );
    windshield.position.set(0, 1.7, 0.51);
    windshield.rotation.x = Math.PI / 2;
    carGroup.add(windshield);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    wheelGeometry.rotateZ(Math.PI / 2);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });
    
    const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFL.position.set(-1.1, 0.4, -1.5);
    carGroup.add(wheelFL);
    
    const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFR.position.set(1.1, 0.4, -1.5);
    carGroup.add(wheelFR);
    
    const wheelBL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelBL.position.set(-1.1, 0.4, 1.5);
    carGroup.add(wheelBL);
    
    const wheelBR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelBR.position.set(1.1, 0.4, 1.5);
    carGroup.add(wheelBR);
    
    // Add to block
    carGroup.position.set(x, 0, z);
    
    // Set rotation based on which side of the street the car is on
    carGroup.rotation.y = x > 0 ? 0 : Math.PI; // Cars on right face forward, left face backward
    
    blockGroup.add(carGroup);
    
    // Register for collision
    obstacles.push({
        position: new THREE.Vector3(x, 0, z).add(blockGroup.position),
        width: 2,
        height: 1.7,
        depth: 4,
        type: 'car'
    });
}

/**
 * Create a drain
 * @param {THREE.Group} blockGroup - Block group to add drain to
 * @param {number} x - X position
 * @param {number} z - Z position
 * @param {Array} obstacles - Array to add obstacle data to
 */
function createDrain(blockGroup, x, z, obstacles) {
    const drain = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.1, 1),
        new THREE.MeshLambertMaterial({ color: COLORS.DRAIN })
    );
    drain.position.set(x, 0.05, z);
    drain.rotation.x = -Math.PI / 2;
    drain.receiveShadow = true;
    blockGroup.add(drain);
    
    // Register for collision
    obstacles.push({
        position: new THREE.Vector3(x, 0, z).add(blockGroup.position),
        width: 1,
        height: 0.1,
        depth: 1,
        type: 'drain'
    });
}