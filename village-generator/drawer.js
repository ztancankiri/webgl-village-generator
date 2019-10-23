import { hex2rgb, rotate } from './toolkit.js';
import { polygonArray, rockArray, randomPolygonArray } from './vertexGenerator.js';

export function draw(gl, program, mode, vertices, color) {
    const colors = [];
    for (let i = 0; i < vertices.length; i++) {
        colors.push(vec3(color.r, color.g, color.b));
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	
    const vColor = gl.getAttribLocation( program, 'vColor' );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    const vPosition = gl.getAttribLocation( program, 'vPosition' );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Draw Arrays
    gl.drawArrays( mode, 0, vertices.length );
}

export function drawRiver(gl, program, width, aspect = 1) {
    const river = [];

    river.push(vec2(width / 2, aspect));
    river.push(vec2(-width / 2, aspect));
    river.push(vec2(-width / 2, -aspect));
    river.push(vec2(width / 2, -aspect));

    draw(gl, program, gl.TRIANGLE_FAN, river, hex2rgb('#5b9bd5'));
}

export function drawHouse(gl, program, cX, cY, p, r, rotation = 0, aspect = 1, debug) {
    if (debug) {
        const circle = polygonArray( cX, cY, 1, 1, r, 50, 0, aspect );
        draw(gl, program, gl.LINE_LOOP, circle, hex2rgb('#477992'));
    }
    r -= 0.01;

    const a = Math.sqrt( Math.pow(r * 2, 2) / (Math.pow(p, 2) + 1) ) / 2;
    const b = p * a;

    const r_v1 = rotate(a, b, rotation);
    const r_v2 = rotate(0, b, rotation);
    const r_v3 = rotate(0, -b, rotation);
    const r_v4 = rotate(a, -b, rotation);

    const vR = [];
    vR.push(vec2(cX + r_v1.x, cY + r_v1.y * aspect));
    vR.push(vec2(cX + r_v2.x, cY + r_v2.y * aspect));
    vR.push(vec2(cX + r_v3.x, cY + r_v3.y * aspect));
    vR.push(vec2(cX + r_v4.x, cY + r_v4.y * aspect));

    draw(gl, program, gl.TRIANGLE_FAN, vR, hex2rgb('#c55a11'));

    const l_v1 = rotate(0, b, rotation);
    const l_v2 = rotate(-a, b, rotation);
    const l_v3 = rotate(-a, -b, rotation);
    const l_v4 = rotate(0, -b, rotation);

    const vL = [];
    vL.push(vec2(cX + l_v1.x, cY + l_v1.y * aspect));
    vL.push(vec2(cX + l_v2.x, cY + l_v2.y * aspect));
    vL.push(vec2(cX + l_v3.x, cY + l_v3.y * aspect));
    vL.push(vec2(cX + l_v4.x, cY + l_v4.y * aspect));

    draw(gl, program, gl.TRIANGLE_FAN, vL, hex2rgb('#ed7d31'));

    const s_v1 = rotate(-0.25 * a, -0.25 * b, rotation);
    const s_v2 = rotate(-0.75 * a, -0.25 * b, rotation);
    const s_v3 = rotate(-0.75 * a, -0.75 * b, rotation);
    const s_v4 = rotate(-0.25 * a, -0.75 * b, rotation);

    const vS = [];
    vS.push(vec2(cX + s_v1.x, cY + s_v1.y * aspect));
    vS.push(vec2(cX + s_v2.x, cY + s_v2.y * aspect));
    vS.push(vec2(cX + s_v3.x, cY + s_v3.y * aspect));
    vS.push(vec2(cX + s_v4.x, cY + s_v4.y * aspect));

    draw(gl, program, gl.TRIANGLE_FAN, vS, hex2rgb('#000000'));
}

export function drawTree(gl, program, cX, cY, r, rotation = 0, aspect = 1, debug) {
    if (debug) {
        const circle = polygonArray( cX, cY, 1, 1, r, 50, 0, aspect );
        draw(gl, program, gl.LINE_LOOP, circle, hex2rgb('#477992'));
    }

    const leaves = polygonArray( cX, cY, 1, 1, r / 1.5, 50, 0, aspect );
    draw(gl, program, gl.TRIANGLE_FAN, leaves, hex2rgb('#548235'));

    const f_r = r / 15;
    const step = f_r / 2;

    const r_f1 = rotate(1 * step, 1 * step, rotation);
    const f1 = polygonArray( cX + r_f1.x, cY + r_f1.y, 1, 1, f_r, 50, 0, aspect );
    draw(gl, program, gl.TRIANGLE_FAN, f1, hex2rgb('#ff0000'));

    const r_f2 = rotate(-3 * step, 10 * step, rotation);
    const f2 = polygonArray( cX + r_f2.x, cY + r_f2.y, 1, 1, f_r, 50, 0, aspect );
    draw(gl, program, gl.TRIANGLE_FAN, f2, hex2rgb('#ff0000'));

    const r_f3 = rotate(-10 * step, -3 * step, rotation);
    const f3 = polygonArray( cX  + r_f3.x, cY + r_f3.y, 1, 1, f_r, 50, 0, aspect );
    draw(gl, program, gl.TRIANGLE_FAN, f3, hex2rgb('#ff0000'));

    const r_f4 = rotate(-3 * step, -10 * step, rotation);
    const f4 = polygonArray( cX + r_f4.x, cY + r_f4.y, 1, 1, f_r, 50, 0, aspect );
    draw(gl, program, gl.TRIANGLE_FAN, f4, hex2rgb('#ff0000'));

    const r_f5 = rotate(7 * step, -10 * step, rotation);
    const f5 = polygonArray( cX + r_f5.x, cY + r_f5.y, 1, 1, f_r, 50, 0, aspect );
    draw(gl, program, gl.TRIANGLE_FAN, f5, hex2rgb('#ff0000'));

    const r_f6 = rotate(10 * step, 1 * step, rotation);
    const f6 = polygonArray( cX + r_f6.x, cY + r_f6.y, 1, 1, f_r, 50, 0, aspect );
    draw(gl, program, gl.TRIANGLE_FAN, f6, hex2rgb('#ff0000'));
}

export function drawRock(gl, program, cX, cY, r, corners, aspect = 1, debug) {
    if (debug) {
        const circle = polygonArray( cX, cY, 1, 1, r, 50, 0, aspect );
        draw(gl, program, gl.LINE_LOOP, circle, hex2rgb('#477992'));
    }

    draw(gl, program, gl.TRIANGLE_FAN, corners, hex2rgb('#a5a5a5'));
}