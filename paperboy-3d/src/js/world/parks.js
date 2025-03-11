/**
 * Park generation for Paperboy 3D game
 */

import * as THREE from 'three';
import { COLORS, getRandomNumber, getRandomInt } from '../utils.js';

/**
 * Create a park block
 * @param {THREE.Group} blockGroup - Block group to add park to
 * @param {Object} worldData - World data
 * @param {Array} obstacles - Array to add obstacle data to
 */
export function createPark(blockGroup, worldData, obstacles) {
    const blockWidth = worldData.blockWidth;
    const blockLength = worldData.blockLength;
    const streetWidth = worldData.streetWidth;
    
    // Create ground with texture variation
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(blockWidth + streetWidth * 2, blockLength),
        new THREE.MeshLambertMaterial({ color: COLORS.GRASS })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = blockLength / 2;
    ground.receiveShadow = true;
    blockGroup.add(ground);
    
    // Add texture variation with patches of different grass
    for (let i = 0; i < 20; i++) {
        const patchSize = 1.5 + Math.random() * 3;
        const patchX = (Math.random() - 0.5) * (blockWidth + streetWidth * 2 - patchSize);
        const patchZ = Math.random() * blockLength;
        
        const grassPatch = new THREE.Mesh(
            new THREE.CircleGeometry(patchSize / 2, 8),
            new THREE.MeshLambertMaterial({ 
                color: Math.random() > 0.5 ? 0x44AA44 : 0x55BB55,
                transparent: true,
                opacity: 0.8
            })
        );
        grassPatch.rotation.x = -Math.PI / 2;
        grassPatch.position.set(patchX, 0.01, patchZ);
        blockGroup.add(grassPatch);
    }
    
    // Create street/path through the park - changed to grass color
    const pathBase = new THREE.Mesh(
        new THREE.PlaneGeometry(blockWidth, blockLength),
        new THREE.MeshLambertMaterial({ color: 0x228822 }) // Light green for the path area
    );
    pathBase.rotation.x = -Math.PI / 2;
    pathBase.position.set(0, 0.04, blockLength / 2);
    pathBase.receiveShadow = true;
    blockGroup.add(pathBase);
    
    // Add path texture - crossing lines with subtler colors
    for (let i = 0; i < blockLength / 2; i++) {
        const pathLine = new THREE.Mesh(
            new THREE.PlaneGeometry(blockWidth, 0.1),
            new THREE.MeshLambertMaterial({ 
                color: 0x228822,  // Slightly darker green for path lines
                transparent: true,
                opacity: 0.7
            })
        );
        pathLine.rotation.x = -Math.PI / 2;
        pathLine.position.set(0, 0.05, i * 2);
        blockGroup.add(pathLine);
    }
    
    // Create hills - more varied
    for (let i = 0; i < 3; i++) {
        const hillZ = blockLength / 4 + i * (blockLength / 3);
        const offsetX = (i % 2 === 0) ? 2 : -2; // Alternate sides
        createHill(blockGroup, offsetX, hillZ, obstacles);
    }
    
    // Add some trees - more variety
    for (let i = 0; i < 12; i++) {
        const treeX = (Math.random() - 0.5) * (blockWidth + streetWidth * 2 - 4);
        const treeZ = Math.random() * blockLength;
        
        // Don't place trees on the path
        if (Math.abs(treeX) > 5) {
            createTree(blockGroup, treeX, treeZ, Math.floor(Math.random() * 3), obstacles);
        }
    }
    
    // Add park benches
    for (let i = 0; i < 3; i++) {
        const benchSide = i % 2 === 0 ? 1 : -1;
        const benchX = benchSide * (blockWidth / 2 - 2);
        const benchZ = blockLength / 4 + i * (blockLength / 3);
        createBench(blockGroup, benchX, benchZ, benchSide, obstacles);
    }
    
    // Add some flowers
    for (let i = 0; i < 20; i++) {
        const flowerX = (Math.random() - 0.5) * (blockWidth + streetWidth * 2 - 2);
        const flowerZ = Math.random() * blockLength;
        
        // Don't place flowers on the path
        if (Math.abs(flowerX) > 5) {
            createFlower(blockGroup, flowerX, flowerZ);
        }
    }
    
    // Add a small pond
    if (Math.random() > 0.5) {
        const pondX = (Math.random() - 0.5) * (blockWidth - 10);
        const pondZ = blockLength / 2 + (Math.random() - 0.5) * (blockLength / 2 - 5);
        createPond(blockGroup, pondX, pondZ, obstacles);
    }
}

/**
 * Create an improved hill with half-sphere shape
 * @param {THREE.Group} blockGroup - Block group to add hill to
 * @param {number} x - X position
 * @param {number} z - Z position
 * @param {Array} obstacles - Array to add obstacle data to
 */
function createHill(blockGroup, x, z, obstacles) {
    const hillWidth = 10;
    const hillHeight = 2;
    
    // Random hill size variation (reduced by 50%)
    const sizeVariation = 0.25 + Math.random() * 0.3; // Reduced variation
    const actualWidth = hillWidth * sizeVariation;
    const actualHeight = hillHeight * sizeVariation;
    
    // Create hill geometry using half-sphere for more realistic shape
    const hillGeometry = new THREE.SphereGeometry(
        actualWidth / 2,  // radius
        16,               // widthSegments
        16,               // heightSegments
        0,                // phiStart
        Math.PI * 2,      // phiLength
        0,                // thetaStart
        Math.PI / 2       // thetaLength (half sphere)
    );
    
    // Hill color variation
    const hillColor = Math.random() > 0.5 ? 0x228822 : 0x2A9D2A;
    
    const hill = new THREE.Mesh(
        hillGeometry,
        new THREE.MeshLambertMaterial({ color: hillColor })
    );
    hill.position.set(x, 0, z);
    hill.castShadow = true;
    hill.receiveShadow = true;
    blockGroup.add(hill);
    
    // Add grass texture details to make it more realistic
    const detailsGroup = new THREE.Group();
    
    // Add some details to the hill - grass tufts
    for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (actualWidth / 2);
        const tuftX = Math.cos(angle) * distance;
        const tuftZ = Math.sin(angle) * distance;
        // Calculate Y based on sphere equation to place tuft on surface
        const tuftY = Math.sqrt(Math.pow(actualWidth/2, 2) - Math.pow(distance, 2));
        
        const grassTuft = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 0.4, 4),
            new THREE.MeshLambertMaterial({ color: 0x33AA33 })
        );
        grassTuft.position.set(tuftX, tuftY, tuftZ);
        // Tilt the grass tuft to follow hill curvature
        grassTuft.lookAt(x, actualWidth, z);
        grassTuft.rotateX(Math.PI / 2);
        detailsGroup.add(grassTuft);
    }
    
    // Add some small rocks
    for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (actualWidth / 2);
        const rockX = Math.cos(angle) * distance;
        const rockZ = Math.sin(angle) * distance;
        // Calculate Y based on sphere equation to place rock on surface
        const rockY = Math.sqrt(Math.pow(actualWidth/2, 2) - Math.pow(distance, 2));
        
        const rock = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.1 + Math.random() * 0.15, 0),
            new THREE.MeshLambertMaterial({ color: 0x888888 })
        );
        rock.position.set(rockX, rockY - 0.05, rockZ);
        detailsGroup.add(rock);
    }
    
    // Position the details group at the same location as the hill
    detailsGroup.position.set(x, 0, z);
    blockGroup.add(detailsGroup);
    
    // Register hill for collision and jumping
    obstacles.push({
        position: new THREE.Vector3(x, 0, z).add(blockGroup.position),
        width: actualWidth,
        height: actualHeight,
        depth: actualWidth,
        type: 'hill'
    });
}

/**
 * Create a tree with different styles
 * @param {THREE.Group} blockGroup - Block group to add tree to
 * @param {number} x - X position
 * @param {number} z - Z position
 * @param {number} style - Tree style (0-2)
 * @param {Array} obstacles - Array to add obstacle data to
 */
function createTree(blockGroup, x, z, style = 0, obstacles) {
    const treeGroup = new THREE.Group();
    
    // Different tree styles
    if (style === 0) { // Pine tree
        // Trunk
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.3, 2, 8),
            new THREE.MeshLambertMaterial({ color: 0x8B4513 })
        );
        trunk.position.y = 1;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Leaves - multiple layers of cones
        for (let i = 0; i < 3; i++) {
            const coneSize = 1.5 - i * 0.3;
            const coneHeight = 1.5 - i * 0.2;
            const coneY = 2 + i * 0.8;
            
            const leaves = new THREE.Mesh(
                new THREE.ConeGeometry(coneSize, coneHeight, 8),
                new THREE.MeshLambertMaterial({ color: 0x228822 })
            );
            leaves.position.y = coneY;
            leaves.castShadow = true;
            treeGroup.add(leaves);
        }
    } else if (style === 1) { // Oak tree
        // Thicker trunk
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.5, 2.5, 8),
            new THREE.MeshLambertMaterial({ color: 0x6B4423 })
        );
        trunk.position.y = 1.25;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Spherical foliage
        const leaves = new THREE.Mesh(
            new THREE.SphereGeometry(2, 8, 8),
            new THREE.MeshLambertMaterial({ color: 0x4D8C57 })
        );
        leaves.position.y = 3.5;
        leaves.castShadow = true;
        treeGroup.add(leaves);
        
        // Add some branch details
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const branch = new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.2, 1.5, 4),
                new THREE.MeshLambertMaterial({ color: 0x6B4423 })
            );
            branch.position.set(
                Math.cos(angle) * 0.7,
                2,
                Math.sin(angle) * 0.7
            );
            branch.rotation.z = Math.PI / 3;
            branch.rotation.y = angle;
            treeGroup.add(branch);
        }
    } else { // Maple tree
        // Thin trunk
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.35, 3, 8),
            new THREE.MeshLambertMaterial({ color: 0x8B4513 })
        );
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Colorful foliage - multiple spheres
        const colors = [0xE27D60, 0xE8A87C, 0xC38D9E, 0xE8D2AE]; // Fall colors
        
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const distance = 0.7 + Math.random() * 0.5;
            
            const leafCluster = new THREE.Mesh(
                new THREE.SphereGeometry(0.8 + Math.random() * 0.4, 8, 8),
                new THREE.MeshLambertMaterial({ color: colors[Math.floor(Math.random() * colors.length)] })
            );
            leafCluster.position.set(
                Math.cos(angle) * distance,
                3 + Math.random() * 0.5,
                Math.sin(angle) * distance
            );
            leafCluster.castShadow = true;
            treeGroup.add(leafCluster);
        }
    }
    
    // Add to block
    treeGroup.position.set(x, 0, z);
    blockGroup.add(treeGroup);
    
    // Register for collision
    obstacles.push({
        position: new THREE.Vector3(x, 0, z).add(blockGroup.position),
        width: 1,
        height: style === 1 ? 4.5 : 4,
        depth: 1,
        type: 'tree'
    });
}

/**
 * Create a park bench
 * @param {THREE.Group} blockGroup - Block group to add bench to
 * @param {number} x - X position
 * @param {number} z - Z position
 * @param {number} facing - Direction bench is facing (1 or -1)
 * @param {Array} obstacles - Array to add obstacle data to
 */
function createBench(blockGroup, x, z, facing = 1, obstacles) {
    const benchGroup = new THREE.Group();
    
    // Bench seat
    const seat = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.1, 0.7),
        new THREE.MeshLambertMaterial({ color: 0x8B4513 })
    );
    seat.position.y = 0.5;
    benchGroup.add(seat);
    
    // Bench back
    const back = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.7, 0.1),
        new THREE.MeshLambertMaterial({ color: 0x8B4513 })
    );
    back.position.set(0, 0.8, -0.3 * facing);
    benchGroup.add(back);
    
    // Bench legs
    for (let i = -1; i <= 1; i += 2) {
        const leg = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.5, 0.7),
            new THREE.MeshLambertMaterial({ color: 0x666666 })
        );
        leg.position.set(i * 0.9, 0.25, 0);
        benchGroup.add(leg);
        
        // Back support
        const backSupport = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.7, 0.1),
            new THREE.MeshLambertMaterial({ color: 0x666666 })
        );
        backSupport.position.set(i * 0.9, 0.8, -0.3 * facing);
        benchGroup.add(backSupport);
    }
    
    // Add to block
    benchGroup.position.set(x, 0, z);
    benchGroup.rotation.y = facing > 0 ? Math.PI : 0;
    blockGroup.add(benchGroup);
    
    // Register for collision
    obstacles.push({
        position: new THREE.Vector3(x, 0, z).add(blockGroup.position),
        width: 2,
        height: 1,
        depth: 0.7,
        type: 'bench'
    });
}

/**
 * Create flowers
 * @param {THREE.Group} blockGroup - Block group to add flowers to
 * @param {number} x - X position
 * @param {number} z - Z position
 */
function createFlower(blockGroup, x, z) {
    const flowerGroup = new THREE.Group();
    
    // Stem
    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8),
        new THREE.MeshLambertMaterial({ color: 0x228822 })
    );
    stem.position.y = 0.15;
    flowerGroup.add(stem);
    
    // Flower head - random color
    const colors = [0xFF5555, 0xFFFF55, 0xFF55FF, 0x55FFFF, 0xFFAA55, 0xAA55FF];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const flowerType = Math.floor(Math.random() * 2);
    
    if (flowerType === 0) { // Daisy-like flower
        // Petals
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const petal = new THREE.Mesh(
                new THREE.PlaneGeometry(0.1, 0.1),
                new THREE.MeshLambertMaterial({ 
                    color: color,
                    side: THREE.DoubleSide
                })
            );
            petal.position.set(
                Math.cos(angle) * 0.08,
                0.3,
                Math.sin(angle) * 0.08
            );
            petal.rotation.x = Math.PI / 2;
            petal.rotation.y = angle;
            flowerGroup.add(petal);
        }
        
        // Center
        const center = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 8, 8),
            new THREE.MeshLambertMaterial({ color: 0xFFFF00 })
        );
        center.position.y = 0.3;
        flowerGroup.add(center);
    } else { // Tulip-like flower
        const flower = new THREE.Mesh(
            new THREE.ConeGeometry(0.08, 0.15, 6, 1, true),
            new THREE.MeshLambertMaterial({ color: color })
        );
        flower.position.y = 0.35;
        flower.rotation.x = Math.PI;
        flowerGroup.add(flower);
    }
    
    // Add to block
    flowerGroup.position.set(x, 0, z);
    blockGroup.add(flowerGroup);
}

/**
 * Create a small pond
 * @param {THREE.Group} blockGroup - Block group to add pond to
 * @param {number} x - X position
 * @param {number} z - Z position
 * @param {Array} obstacles - Array to add obstacle data to
 */
function createPond(blockGroup, x, z, obstacles) {
    // Pond base - slightly depressed into ground
    const pondSize = 3 + Math.random() * 2;
    const pondDepth = 0.3;
    
    // Dig out pond area
    const pondHole = new THREE.Mesh(
        new THREE.CylinderGeometry(pondSize/2, pondSize/2, pondDepth, 24),
        new THREE.MeshLambertMaterial({ color: 0x667788 })
    );
    pondHole.position.set(x, -pondDepth/2 + 0.01, z);
    pondHole.rotation.x = Math.PI / 2;
    blockGroup.add(pondHole);
    
    // Water surface
    const waterSurface = new THREE.Mesh(
        new THREE.CircleGeometry(pondSize/2 - 0.1, 24),
        new THREE.MeshLambertMaterial({ 
            color: 0x3399CC,
            transparent: true,
            opacity: 0.7
        })
    );
    waterSurface.position.set(x, 0.03, z);
    waterSurface.rotation.x = -Math.PI / 2;
    blockGroup.add(waterSurface);
    
    // Add rocks around the edge
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const distance = pondSize/2 - 0.2 + Math.random() * 0.4;
        
        const rock = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.15 + Math.random() * 0.15, 0),
            new THREE.MeshLambertMaterial({ color: 0x888888 })
        );
        rock.position.set(
            x + Math.cos(angle) * distance,
            0.1,
            z + Math.sin(angle) * distance
        );
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        blockGroup.add(rock);
    }
    
    // Register pond for collision
    obstacles.push({
        position: new THREE.Vector3(x, 0, z).add(blockGroup.position),
        width: pondSize,
        height: 0.1,
        depth: pondSize,
        type: 'pond'
    });
}