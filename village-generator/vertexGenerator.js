/**
 * This file handles the geometric representations of the entities.
 */

import { generateRandomNumber } from './toolkit.js';

/**
 * This function generates an array which has vertices of the desired polygon.
 * @param {Float} cX The X coordinate of the center.
 * @param {Float} cY The Y coordinate of the center.
 * @param {Float} a The constant multiplier of X.
 * @param {Float} b The constant multiplier of Y.
 * @param {Float} r The radius.
 * @param {Int} edges The number of edges.
 * @param {Float} rotation The rotation angle.
 * @param {Float} aspect The aspect of the canvas edges.
 */
export function polygonArray(cX, cY, a = 1, b = 1, r, edges = 100, rotation = 0, aspect = 1) {
    const angle = 360 / edges;
    const vertices = [];

    const x = (r, t) => {
        return cX + a * r * Math.cos(radians(t + rotation));
    };

    const y = (r, t) => {
        return cY + ( b * r * Math.sin(radians(t + rotation)) ) * aspect;
    };

    for (let i = 0; i < 360; i += angle) {
        vertices.push(vec2(x(r, i), y(r, i)));
    }

    return vertices;
}

/**
 * This function generates a random array which has vertices of the desired polygon.
 * @param {Float} cX The X coordinate of the center.
 * @param {Float} cY The Y coordinate of the center.
 * @param {Float} r The radius.
 * @param {Int} edges The number of edges.
 * @param {Float} rotation The rotation angle.
 * @param {Float} aspect The aspect of the canvas edges.
 */
export function randomPolygonArray(cX, cY, r, edges = 5, rotation = 0, aspect = 1) {
    const x = (r, t) => {
        return cX + r * Math.cos(radians(t + rotation));
    };

    const y = (r, t) => {
        return cY + ( r * Math.sin(radians(t + rotation)) ) * aspect;
    };

    let totalAngle = 0;
    let maxAngleInc = 360 / edges;

    const vertices = [];

    for (let i = 0; i < edges; i++) {
        let angle = 0;

        if (i === edges - 1) {
            angle = 360 - totalAngle;
        }
        else {
            angle = generateRandomNumber(maxAngleInc / 2, maxAngleInc);
        }

        totalAngle += angle;
        vertices.push(vec2(x(r, totalAngle), y(r, totalAngle)));
    }

    return vertices;
}

/**
 * This function generates an array which has vertices of a rock entity.
 * @param {Float} cX The X coordinate of the center.
 * @param {Float} cY The Y coordinate of the center.
 * @param {Float} a The constant multiplier of X.
 * @param {Float} b The constant multiplier of Y.
 * @param {Float} r The radius.
 * @param {Int} edges The number of edges.
 * @param {Float} rotation The rotation angle.
 * @param {Float} aspect The aspect of the canvas edges.
 */
export function rockArray(cX, cY, a = 1, b = 1, r, edges = 100, rotation = 0, aspect = 1) {
    const angle = 360 / edges;
    const vertices = [];

    const x = (r, t) => {
        return cX + a * r * Math.cos(radians(t + rotation));
    };

    const y = (r, t) => {
        return cY + ( b * r * Math.sin(radians(t + rotation)) ) * aspect;
    };

    for (let i = 0; i < 360; i += angle) {
        if (i > 180)
            vertices.push(vec2(x(r, i + 20), y(r, i + 20)));
        else if (i < 180 && i > 70)
            vertices.push(vec2(x(r, i), y(r, i)));
        else
        vertices.push(vec2(x(r, i - 10), y(r, i + 20)));
    }

    return vertices;
}