import { hex2rgb, randomPosition, typeSelector, downloadObjectAsJson } from './toolkit.js';
import { drawRiver, drawHouse, drawRock, drawTree } from './drawer.js';

let entityData = {};
let attractorData = [];
let debug = true;
let currentAttractor = null;
let riverMin = null;
let riverMax = null;

function generateEntityData(count, aspect) {
    entityData = {};
    const posArray = [];
    const radius = 0.05;

    const riverWidth = Math.random() * riverMin + riverMax;
    entityData.riverWidth = riverWidth;

    entityData.houses = [];
    entityData.rocks = [];
    entityData.trees = [];

    if (attractorData.length > 0) {
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
}

function render(gl, program, aspect) {
    gl.clear( gl.COLOR_BUFFER_BIT );

    drawRiver(gl, program, entityData.riverWidth, aspect);

    for (let i = 0; i < entityData.houses.length; i++) {
        drawHouse(gl, program, entityData.houses[i].pos.x, entityData.houses[i].pos.y, 1.5, entityData.houses[i].radius, entityData.houses[i].rot, aspect, debug);
    }

    for (let i = 0; i < entityData.rocks.length; i++) {
        drawRock(gl, program, entityData.rocks[i].pos.x, entityData.rocks[i].pos.y, entityData.rocks[i].radius, entityData.rocks[i].rot, aspect, debug);
    }

    for (let i = 0; i < entityData.trees.length; i++) {
        drawTree(gl, program, entityData.trees[i].pos.x, entityData.trees[i].pos.y, entityData.trees[i].radius, entityData.trees[i].rot, aspect, debug);
    }
}

function bindEvents(gl, program, canvas, aspect) {
    $('#jsonFile').bind('change', () => {
        const file = jsonFile.files[0];
        const fileType = /json.*/;

        if (file.type.match(fileType)) {
            const reader = new FileReader();
            
            reader.onload = () => {
                const content = reader.result;
                const data = JSON.parse(content);
                entityData = data.entityData;
                attractorData = data.attractorData;
                
                debug = data.debug;
                debugButton.textContent = debug ? "Debug: ON" : "Debug: OFF";
                render(gl, program, aspect);
            }
            
            reader.readAsText(file);	
        } else {
            alert ("File not supported!");
        }           
    });

    $('#saveButton').click(() => {
        downloadObjectAsJson({entityData, attractorData, debug}, "data");
    });

    $('#loadButton').click(() => {
        $('#jsonFile').click();
    });

    $('canvas').click(event => {
        const x = -1 + 2 * event.clientX / canvas.width;
        const y = -1 + 2 * (canvas.height - event.clientY) / canvas.height;

        attractorData.push({type: currentAttractor, pos: {x, y}});

        console.log(attractorData);

        generateEntityData(entityCount.value, aspect);
        render(gl, program, aspect);
    });

    $('#debugButton').click(event => {
        if ($('#debugButton').hasClass('green')) {
            $('#debugButton').removeClass('green');
            $('#debugButton').addClass('red');
            debug = false;
        }
        else {
            $('#debugButton').removeClass('red');
            $('#debugButton').addClass('green');
            debug = true;
        }
        render(gl, program, aspect);
    });

    $('#entityCount').bind('keyup mouseup', event => {
        if (currentAttractor !== null) {
            generateEntityData(event.target.value, aspect);
            render(gl, program, aspect);
        }     
    });
    
    currentAttractor = 'house';
    $('#houseAttractor').addClass("active");

    $('#houseAttractor').click(() => {
        currentAttractor = 'house';
        $('#houseAttractor').addClass("active");
        $('#rockAttractor').removeClass("active");
        $('#treeAttractor').removeClass("active");
    });

    $('#rockAttractor').click(() => {
        currentAttractor = 'rock';
        $('#houseAttractor').removeClass("active");
        $('#rockAttractor').addClass("active");
        $('#treeAttractor').removeClass("active");
    });

    $('#treeAttractor').click(() => {
        currentAttractor = 'tree';
        $('#houseAttractor').removeClass("active");
        $('#rockAttractor').removeClass("active");
        $('#treeAttractor').addClass("active");
    });

    $('#river-range').slider({
        range: true,
        min: 0,
        max: canvas.width,
        values: [ canvas.width / 2 - (canvas.width / 5), canvas.width / 2 + (canvas.width / 5) ],
        slide: function( event, ui ) {
            riverMin = ui.values[0] / canvas.width;
            riverMax = ui.values[1] / canvas.width;
            $('#riverText').text('River Width Range: [' + ui.values[0] + ', ' + ui.values[1] + ']');
        }
    });
    $('#riverText').text('River Width Range: [' + $('#river-range').slider('values', 0) + ', ' + $('#river-range').slider('values', 1) + ']');

    $('#river-range').bind('mouseup', () => {
        if (currentAttractor !== null) {
            generateEntityData(event.target.value, aspect);
            render(gl, program, aspect);
        }
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