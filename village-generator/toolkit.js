/**
 * This file handles the required toolkit for the game.
 * It has required functions to generate RGB colors, generate random values, rotate entities and type selectors.
 */

 /**
  * This function converts hex color code to 0.0 - 1.0 scaled RGB array.
  * @param {String} hex Hex color code like '#FF00FF'.
  */
export function hex2rgb(hex) {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16) / 255.0;
    const g = parseInt(hex.substring(2, 4), 16) / 255.0;
    const b = parseInt(hex.substring(4, 6), 16) / 255.0;

    return { r, g, b };
}

/**
 * This function flips a coin.
 */
export function randomBinary() {
    return Math.round(Math.random());
}

/**
 * This function generates a random Float number in desired range.
 * @param {Float} min The lower bound of the desired range.
 * @param {Float} max The upper bound of the desired range.
 */
export function generateRandomNumber(min, max) {
    const rand = Math.random() * (max - min) + min;
    return rand;
}

/**
 * This function creates a new 'a' DOM element and it maps the data json to its href attribute as base64encoded data.
 * @param {JSON} exportObj The data object which is going to be downloaded.
 * @param {String} exportName The name of the target file.
 */
export function downloadObjectAsJson(exportObj, exportName) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

/**
 * This function rotates the given point around the origin.
 * @param {Float} x The X coordinate of the point.
 * @param {Float} y The Y coordinate of the point.
 * @param {Float} angle The desired angle.
 */
export function rotate(x, y, angle) {
    const radians = degree => {
        return degree * (Math.PI / 180);
    };

    const x2 = x * Math.cos(radians(angle)) - y * Math.sin(radians(angle));
    const y2 = y * Math.cos(radians(angle)) + x * Math.sin(radians(angle));

    return { x: x2, y: y2 };
}

/**
 * This function generates a random position for an entity with the check of overlap.
 * @param {Float32Array} posArray The vertices array of the entity.
 * @param {Float} radius The radius.
 * @param {Float} riverWidth The width of the river.
 * @param {Float} aspect The aspect of the canvas edges.
 */
export function randomPosition(posArray, radius, riverWidth, aspect) {

    const posControl = (posArray, x, y, radius, aspect) => {
        for (let i = 0; i < posArray.length; i++) {
            const d = Math.sqrt(Math.pow(x - posArray[i].x, 2) + Math.pow( (y - posArray[i].y) / aspect, 2)); 
            if (d < radius * 2) {
                return false;
            }
        }
        return true;
    }

    const margin = 0.05;

    let iteration = 0;
    let randX = null;
    let randY = null;

    do {
        randX = randomBinary() ? generateRandomNumber(-1.0 + radius + margin, -riverWidth / 2 - radius - margin) : generateRandomNumber(riverWidth / 2 + radius + margin, 1.0 - radius - margin);
        randY = generateRandomNumber(-1.0 + radius + margin, 1.0 - radius - margin);

        iteration++;
    } while (!posControl(posArray, randX, randY, radius, aspect) && iteration < 1000);

    if (iteration < 1000)
        return { x: randX, y: randY };
    else
        return null;
}

/**
 * This function selects a type for the entity by using the attractor data.
 * @param {JSONArray} attractors The list of attractors.
 * @param {Float} x The X coordinate of the center of the entity.
 * @param {Float} y The Y coordinate of the center of the entity.
 */
export function typeSelector(attractors, x, y) {
    let houseScore = 0;
    let rockScore = 0;
    let treeScore = 0;

    for (let i = 0; i < attractors.length; i++) {
        const score = 1.0 / Math.sqrt(Math.pow(attractors[i].pos.x - x, 2) + Math.pow(attractors[i].pos.y - y, 2));

        if (attractors[i].type === 'house') {
            houseScore += score;
        }
        else if (attractors[i].type === 'rock') {
            rockScore += score;
        }
        else if (attractors[i].type === 'tree') {
            treeScore += score;
        }
    }

    let houseEnd = houseScore;
    let rockEnd = houseEnd + rockScore;
    let treeEnd = rockEnd + treeScore;

    const typeRand = generateRandomNumber(0, treeEnd);

    if (typeRand >= 0 && typeRand < houseEnd)
        return 'house';
    else if (typeRand >= houseEnd && typeRand < rockEnd)
        return 'rock';
    else if (typeRand >= rockEnd && typeRand <= treeEnd)
        return 'tree';
}