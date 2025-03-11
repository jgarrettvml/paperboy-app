/**
 * Utility functions for Paperboy 3D game
 */

// Game colors
export const COLORS = {
    STREET: 0x888888,
    SIDEWALK: 0xcccccc,
    GRASS: 0x228822,
    HOUSE_WALL: 0x666666,
    HOUSE_ROOF: 0x333333,
    PORCH: 0xffffff,
    MAILBOX: 0xff0000,
    CAR: 0xff0000,
    PLAYER: 0x0000ff,
    NEWSPAPER: 0xffff00,
    HILL: 0x228822,
    DRAIN: 0x444444
};

// Get random number between min and max
export function getRandomNumber(min, max) {
    return min + Math.random() * (max - min);
}

// Get random integer between min and max
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Check if two objects are colliding (simple AABB collision)
export function checkCollision(obj1, obj2) {
    const dx = Math.abs(obj1.position.x - obj2.position.x);
    const dz = Math.abs(obj1.position.z - obj2.position.z);
    
    return (
        dx < (obj1.width / 2 + obj2.width / 2) * 0.7 &&
        dz < (obj1.depth / 2 + obj2.depth / 2) * 0.7
    );
}

// Get DOM element by ID with error handling
export function getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with ID "${id}" not found`);
    }
    return element;
}