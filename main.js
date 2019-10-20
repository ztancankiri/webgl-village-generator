import { hex2rgb, randomPosition, typeSelector, downloadObjectAsJson } from './village-generator/toolkit.js';
import { drawRiver, drawHouse, drawRock, drawTree } from './village-generator/drawer.js';

let entityData = {};
let attractorData = [];

function generateEntityData(count, aspect) {
    entityData = {};
    const posArray = [];
    const radius = 0.05;

    const riverWidth = Math.random() * 0.5 + 0.1;
    entityData.riverWidth = riverWidth;

    entityData.houses = [];
    entityData.rocks = [];
    entityData.trees = [];

    for (let i = 0; i < count; i++) {
        const pos = randomPosition(posArray, radius, riverWidth, aspect);
        const rot = Math.floor(Math.random() * 360);

        if (pos !== null) {
            posArray.push(pos);

            const type = typeSelector(attractorData, pos.x, pos.y);

            if (type === 'house') {
                entityData.houses.push({pos: pos, rot: rot, radius: radius});
            }
            else if (type === 'rock') {
                entityData.rocks.push({pos: pos, rot: rot, radius: radius});
            }
            else if (type === 'tree') {
                entityData.trees.push({pos: pos, rot: rot, radius: radius});
            }
        }
    }
}

function render(gl, program, aspect) {
    gl.clear( gl.COLOR_BUFFER_BIT );

    drawRiver(gl, program, entityData.riverWidth, aspect);

    for (let i = 0; i < entityData.houses.length; i++) {
        drawHouse(gl, program, entityData.houses[i].pos.x, entityData.houses[i].pos.y, 1.5, entityData.houses[i].radius, entityData.houses[i].rot, aspect);
    }

    for (let i = 0; i < entityData.rocks.length; i++) {
        drawRock(gl, program, entityData.rocks[i].pos.x, entityData.rocks[i].pos.y, entityData.rocks[i].radius, entityData.rocks[i].rot, aspect);
    }

    for (let i = 0; i < entityData.trees.length; i++) {
        drawTree(gl, program, entityData.trees[i].pos.x, entityData.trees[i].pos.y, entityData.trees[i].radius, entityData.trees[i].rot, aspect);
    }
}

function bindEvents(gl, program, canvas, aspect) {
    const jsonFile = document.querySelector( '#jsonFile' );
    jsonFile.addEventListener("change", () => {
        const file = jsonFile.files[0];
        const fileType = /json.*/;

        if (file.type.match(fileType)) {
            const reader = new FileReader();
            
            reader.onload = () => {
                const content = reader.result;
                const data = JSON.parse(content);
                entityData = data.entityData;
                attractorData = data.attractorData;
                render(gl, program, aspect);
            }
            
            reader.readAsText(file);	
        } else {
            alert ("File not supported!");
        }
    });

    const saveButton = document.querySelector( '#saveButton' );
    saveButton.addEventListener("click", () => {
        downloadObjectAsJson({entityData, attractorData}, "data");
    });

    const loadButton = document.querySelector( '#loadButton' );
    loadButton.addEventListener("click", event => {
        jsonFile.click();
    });

    const entityCount = document.querySelector( '#entityCount' );
    entityCount.addEventListener("keyup", () => {
        generateEntityData(entityCount.value, aspect);
        render(gl, program, aspect);
    });

    canvas.addEventListener("click", event => {
        const attractor = document.querySelector( '#attractorType' ).value;

        const x = -1 + 2 * event.clientX / canvas.width;
        const y = -1 + 2 * (canvas.height - event.clientY) / canvas.height;

        attractorData.push({type: attractor, pos: {x, y}});

        generateEntityData(entityCount.value, aspect);
        render(gl, program, aspect);
    });
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

    bindEvents(gl, program, canvas, aspect);

    // Empty Canvas
    gl.clear( gl.COLOR_BUFFER_BIT );
};