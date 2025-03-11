/**
 * Obstacles for Paperboy 3D game
 */

import * as THREE from 'three';
import { COLORS } from '../utils.js';

/**
 * Create a mailbox with detailed styling
 * @param {THREE.Group} blockGroup - Block group to add mailbox to
 * @param {number} x - X position
 * @param {number} z - Z position
 * @param {number} style - Mailbox style (0-2)
 * @param {Array} mailboxes - Array to add mailbox data to
 */
export function createMailbox(blockGroup, x, z, style, mailboxes) {
    const mailboxGroup = new THREE.Group();
    
    // Create collision box for mailbox
    const mailboxCollision = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),  // Larger collision box
        new THREE.MeshBasicMaterial({ visible: false })
    );
    mailboxCollision.position.set(0, 1.2, 0);
    mailboxCollision.userData.type = 'mailbox';
    mailboxGroup.add(mailboxCollision);
    
    // Use passed style or random if not provided
    const mailboxStyle = style !== undefined ? style : Math.floor(Math.random() * 3);
    let mailboxColor;
    
    switch(mailboxStyle) {
        case 0: // Classic red
            mailboxColor = 0xCC0000;
            break;
        case 1: // Black
            mailboxColor = 0x222222;
            break;
        case 2: // Blue
            mailboxColor = 0x0033AA;
            break;
    }
    
    // Post
    const postMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    
    if (mailboxStyle === 0) { // Wooden post
        const post = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 1.2, 0.2),
            postMaterial
        );
        post.position.y = 0.6;
        post.castShadow = true;
        mailboxGroup.add(post);
    } else if (mailboxStyle === 1) { // Metal pole
        const post = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8),
            new THREE.MeshLambertMaterial({ color: 0x888888 })
        );
        post.position.y = 0.6;
        post.castShadow = true;
        mailboxGroup.add(post);
        
        // Base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.1, 8),
            new THREE.MeshLambertMaterial({ color: 0x666666 })
        );
        base.position.y = 0.05;
        base.castShadow = true;
        mailboxGroup.add(base);
    } else { // Stone base
        const post = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.9, 0.3),
            new THREE.MeshLambertMaterial({ color: 0x999999 })
        );
        post.position.y = 0.45;
        post.castShadow = true;
        mailboxGroup.add(post);
        
        // Stone texture
        for (let i = 0; i < 5; i++) {
            const stone = new THREE.Mesh(
                new THREE.BoxGeometry(0.05 + Math.random() * 0.1, 0.05 + Math.random() * 0.1, 0.05),
                new THREE.MeshLambertMaterial({ color: 0x888888 })
            );
            stone.position.set(
                (Math.random() - 0.5) * 0.2,
                Math.random() * 0.8,
                0.17
            );
            post.add(stone);
        }
    }
    
    // Box style based on mailbox type
    let boxGeometry;
    if (mailboxStyle === 0) { // Classic curved top
        boxGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.4);
        
        // Curved top
        const topCurve = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16, 1, false, 0, Math.PI),
            new THREE.MeshLambertMaterial({ color: mailboxColor })
        );
        topCurve.rotation.z = Math.PI / 2;
        topCurve.position.set(0, 0.25, 0);
        
        const box = new THREE.Mesh(
            boxGeometry,
            new THREE.MeshLambertMaterial({ color: mailboxColor })
        );
        
        const boxWrapper = new THREE.Group();
        boxWrapper.add(box);
        boxWrapper.add(topCurve);
        boxWrapper.position.y = 1.2;
        boxWrapper.castShadow = true;
        mailboxGroup.add(boxWrapper);
        
        // Flag
        const flag = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.3, 0.2),
            new THREE.MeshLambertMaterial({ color: 0xFF0000 })
        );
        flag.position.set(0.425, 1.3, 0);
        flag.castShadow = true;
        mailboxGroup.add(flag);
        
    } else if (mailboxStyle === 1) { // Modern box with slot
        boxGeometry = new THREE.BoxGeometry(0.8, 0.7, 0.4);
        
        const box = new THREE.Mesh(
            boxGeometry,
            new THREE.MeshLambertMaterial({ color: mailboxColor })
        );
        box.position.y = 1.2;
        box.castShadow = true;
        mailboxGroup.add(box);
        
        // Mail slot
        const slot = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.08, 0.05),
            new THREE.MeshLambertMaterial({ color: 0x000000 })
        );
        slot.position.set(0, 1.3, 0.225);
        mailboxGroup.add(slot);
        
    } else { // Decorative box
        boxGeometry = new THREE.BoxGeometry(0.9, 0.6, 0.5);
        
        const box = new THREE.Mesh(
            boxGeometry,
            new THREE.MeshLambertMaterial({ color: mailboxColor })
        );
        box.position.y = 1.1;
        box.castShadow = true;
        mailboxGroup.add(box);
        
        // Decorative trim
        const trim = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.05, 0.6),
            new THREE.MeshLambertMaterial({ color: 0xDDDDDD })
        );
        trim.position.y = 1.4;
        mailboxGroup.add(trim);
        
        // House number
        const numberPlate = new THREE.Mesh(
            new THREE.PlaneGeometry(0.3, 0.15),
            new THREE.MeshLambertMaterial({ color: 0xEEEEEE })
        );
        numberPlate.position.set(0, 1.25, 0.26);
        mailboxGroup.add(numberPlate);
    }
    
    // Add to block
    mailboxGroup.position.set(x, 0, z);
    mailboxGroup.userData.type = 'mailbox';  // Mark the entire group
    blockGroup.add(mailboxGroup);
    
    // Register for collision
    mailboxes.push({
        position: new THREE.Vector3(x, 0, z).add(blockGroup.position),
        width: 1,
        length: 0.5
    });
}

/**
 * Create a newspaper with simple physics
 * @param {THREE.Scene} scene - Scene to add newspaper to
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} z - Z position
 * @param {number} velocityX - X velocity
 * @param {number} velocityZ - Z velocity
 * @returns {Object} Newspaper object
 */
export function createNewspaper(scene, x, y, z, velocityX, velocityZ) {
    console.log('Creating newspaper in scene at', x, y, z);
    
    // Create the newspaper mesh
    const newspaper = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.1, 0.3),
        new THREE.MeshLambertMaterial({ color: COLORS.NEWSPAPER })
    );
    newspaper.position.set(x, y, z);
    newspaper.castShadow = true;
    scene.add(newspaper);
    
    // Create a raycaster for collision detection
    const raycaster = new THREE.Raycaster();
    
    // Return the newspaper object with physics properties
    return {
        object: newspaper,
        velocity: new THREE.Vector3(velocityX, 0.2, velocityZ),
        position: newspaper.position.clone(),
        raycaster: raycaster,
        thrown: true,
        delivered: false
    };
}