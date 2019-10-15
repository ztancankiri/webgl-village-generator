function randomBinary() {
    return Math.round(Math.random());
}

function generateRandomNumber(min, max) {
    const rand = Math.random() * (max - min) + min;
    return rand;
}

function hex2rgb(hex) {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16) / 255.0;
    const g = parseInt(hex.substring(2, 4), 16) / 255.0;
    const b = parseInt(hex.substring(4, 6), 16) / 255.0;

    return { r, g, b };
}

function polygonArray(cX, cY, a = 1, b = 1, r, edges = 100, rotation = 0, aspect = 1) {
    const angle = 360 / edges;
    const vertices = [];

    const radians = degree => {
        return degree * (Math.PI / 180);
    };

    const x = (r, t) => {
        return cX + a * r * Math.cos(radians(t + rotation));
    };

    const y = (r, t) => {
        return ( cY + b * r * Math.sin(radians(t + rotation)) ) * aspect;
    };

    for (let i = 0; i < 360; i += angle) {
        vertices.push(vec2(x(r, i), y(r, i)));
    }

    return vertices;
}

function randomPolygonArray(cX, cY, r, edges = 5, rotation = 0, aspect = 1) {
    const radians = degree => {
        return degree * (Math.PI / 180);
    };

    const x = (r, t) => {
        return cX + r * Math.cos(radians(t + rotation));
    };

    const y = (r, t) => {
        return ( cY + r * Math.sin(radians(t + rotation)) ) * aspect;
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

function rockArray(cX, cY, a = 1, b = 1, r, edges = 100, rotation = 0, aspect = 1) {
    const angle = 360 / edges;
    const vertices = [];

    const radians = degree => {
        return degree * (Math.PI / 180);
    }

    const x = (r, t) => {
        return cX + a * r * Math.cos(radians(t + rotation));
    };

    const y = (r, t) => {
        return ( cY + b * r * Math.sin(radians(t + rotation)) ) * aspect;
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

function rotate(x, y, angle) {
    const x2 = x * Math.cos(radians(angle)) - y * Math.sin(radians(angle));
    const y2 = y * Math.cos(radians(angle)) + x * Math.sin(radians(angle));

    return { x: x2, y: y2 };
}

function draw(gl, program, mode, vertices, color) {
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

    // Render
    gl.drawArrays( mode, 0, vertices.length );
}

function drawHouse(gl, program, cX, cY, p, r, rotation = 0, aspect = 1) {
    const circle = polygonArray( cX, cY, 1, 1, r, 50, 0, aspect );
    draw(gl, program, gl.LINE_LOOP, circle, hex2rgb('#477992'));
    r -= 0.01;

    const a = Math.sqrt( Math.pow(r * 2, 2) / (Math.pow(p, 2) + 1) ) / 2;
    const b = p * a;

    const r_v1 = rotate(a, b, rotation);
    const r_v2 = rotate(0, b, rotation);
    const r_v3 = rotate(0, -b, rotation);
    const r_v4 = rotate(a, -b, rotation);

    const vR = [];
    vR.push(vec2(cX + r_v1.x, (cY + r_v1.y) * aspect));
    vR.push(vec2(cX + r_v2.x, (cY + r_v2.y) * aspect));
    vR.push(vec2(cX + r_v3.x, (cY + r_v3.y) * aspect));
    vR.push(vec2(cX + r_v4.x, (cY + r_v4.y) * aspect));

    draw(gl, program, gl.TRIANGLE_FAN, vR, hex2rgb('#c55a11'));

    const l_v1 = rotate(0, b, rotation);
    const l_v2 = rotate(-a, b, rotation);
    const l_v3 = rotate(-a, -b, rotation);
    const l_v4 = rotate(0, -b, rotation);

    const vL = [];
    vL.push(vec2(cX + l_v1.x, (cY + l_v1.y) * aspect));
    vL.push(vec2(cX + l_v2.x, (cY + l_v2.y) * aspect));
    vL.push(vec2(cX + l_v3.x, (cY + l_v3.y) * aspect));
    vL.push(vec2(cX + l_v4.x, (cY + l_v4.y) * aspect));

    draw(gl, program, gl.TRIANGLE_FAN, vL, hex2rgb('#ed7d31'));

    const s_v1 = rotate(-0.25 * a, -0.25 * b, rotation);
    const s_v2 = rotate(-0.75 * a, -0.25 * b, rotation);
    const s_v3 = rotate(-0.75 * a, -0.75 * b, rotation);
    const s_v4 = rotate(-0.25 * a, -0.75 * b, rotation);

    const vS = [];
    vS.push(vec2(cX + s_v1.x, (cY + s_v1.y) * aspect));
    vS.push(vec2(cX + s_v2.x, (cY + s_v2.y) * aspect));
    vS.push(vec2(cX + s_v3.x, (cY + s_v3.y) * aspect));
    vS.push(vec2(cX + s_v4.x, (cY + s_v4.y) * aspect));

    draw(gl, program, gl.TRIANGLE_FAN, vS, hex2rgb('#000000'));
}

function drawTree(gl, program, cX, cY, r, rotation = 0, aspect = 1) {
    const circle = polygonArray( cX, cY, 1, 1, r, 50, 0, aspect );
    draw(gl, program, gl.LINE_LOOP, circle, hex2rgb('#477992'));

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

function drawRock(gl, program, cX, cY, r, rotation = 0, aspect = 1) {
    const circle = polygonArray( cX, cY, 1, 1, r, 50, 0, aspect );
    draw(gl, program, gl.LINE_LOOP, circle, hex2rgb('#477992'));

    const rock = rockArray( cX, cY, 1, 1, r / 1.5, 5, rotation, aspect );
    draw(gl, program, gl.TRIANGLE_FAN, rock, hex2rgb('#a5a5a5'));
}

function drawRiver(gl, program, width, aspect = 1) {
    const river = [];

    river.push(vec2(width / 2, aspect));
    river.push(vec2(-width / 2, aspect));
    river.push(vec2(-width / 2, -aspect));
    river.push(vec2(width / 2, -aspect));

    draw(gl, program, gl.TRIANGLE_FAN, river, hex2rgb('#5b9bd5'));
}

function randomPosition(posArray, radius, riverWidth, LorR) {
    const randX = LorR ? generateRandomNumber(-1.0 + radius, -riverWidth / 2 - radius) : generateRandomNumber(riverWidth / 2 + radius, 1.0 - radius);
    const randY = generateRandomNumber(-1.0 + radius, 1.0 - radius);

    for (let i = 0; i < posArray.length; i++) {
        const d = Math.sqrt(Math.pow(randX - posArray[i].x, 2) + Math.pow(randY - posArray[i].y, 2)); 
        if (d < radius * 2) {
            return randomPosition(posArray, radius, riverWidth, LorR);
        }
    }

    return { x: randX, y: randY };
}

window.onload = () => {
    const canvas = document.querySelector( 'canvas' );
    const aspect = canvas.width / canvas.height;
    const gl = WebGLUtils.setupWebGL( canvas );

    if (!gl) return alert( "WebGL isn't available" );
    
    gl.viewport( 0, 0, canvas.width, canvas.height );

    const terrainColor = hex2rgb('#70ad47');
    gl.clearColor( terrainColor.r, terrainColor.g, terrainColor.b, 1.0 );   
     
    const program = initShaders( gl, 'vertex-shader', 'fragment-shader' );
    gl.useProgram( program );

    gl.clear( gl.COLOR_BUFFER_BIT );

    const riverWidth = Math.random() * 0.5 + 0.1;
    drawRiver(gl, program, riverWidth, aspect);

    const radius = 0.05;
    const posArray = [];

    for (let i = 0; i < 3; i++) {
        const pos = randomPosition(posArray, radius, riverWidth, randomBinary());
        const rot = Math.floor(Math.random() * 360);
        drawHouse(gl, program, pos.x, pos.y, 1.5, radius, rot, aspect);
        posArray.push(pos);
    }

    for (let i = 0; i < 2; i++) {
        const pos = randomPosition(posArray, radius, riverWidth, randomBinary());
        const rot = Math.floor(Math.random() * 360);
        drawRock(gl, program, pos.x, pos.y, radius, rot, aspect);
        posArray.push(pos);
    }

    for (let i = 0; i < 5; i++) {
        const pos = randomPosition(posArray, radius, riverWidth, randomBinary());
        const rot = Math.floor(Math.random() * 360);
        drawTree(gl, program, pos.x, pos.y, radius, rot, aspect);
        posArray.push(pos);
    }


    // const randPen = randomPolygonArray(0.0, 0.0, 0.1, 8, 0.0, aspect);
    // draw(gl, program, gl.LINE_LOOP, randPen, hex2rgb('#477992'));
};