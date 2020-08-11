import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import {scene, initScene} from './initScene.js'
import {Maze} from './Maze.js'

var camera, renderer, stats, clock, controls, maze;
var i, raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2(),pickables = [];
var x = 0;

window.addEventListener('resize', onWindowResize, false);

document.addEventListener('mousedown',onMouseDown,false);

init();
animate();

function init() {
	initScene();
	
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(250,750,250);
    camera.lookAt(new THREE.Vector3(250,0,250));
    scene.add(camera);

    var gridXZ = new THREE.GridHelper(500, 10, 'red', 'white');
    //scene.add(gridXZ);
    gridXZ.position.set(250, 0, 250);
    //gridXZ.rotation.x = Math.PI / 2;
    scene.add(new THREE.AxisHelper(50));


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x888888);

    //controls = new OrbitControls(camera, renderer.domElement);

    document.body.appendChild(renderer.domElement);
    

    maze = new Maze(10,10,50,5,50);
    
    maze.wall.forEach(function(e){
        pickables.push(e);
    });

    console.log(maze.wall.length);

    for(let i = maze.notWall.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));

        let tmp = maze.notWall[i];
        maze.notWall[i] = maze.notWall[j];
        maze.notWall[j] = tmp;
        
    }

}

// 10*10 85 per    wall = 200-10-10 = 180 - 95 = 85; 47.22%
// 15*15 200 per   wall = 450-15-15 = 420 - 220 = 200; 47.61%
// 20*20 365 per   wall = 800-20-20 = 760 - 395 = 365; 48.02%
// 

//
//

function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}


function animate() {
    var dt = clock.getDelta();

    x += dt;


    if(x >= 0.25 && maze.notWall.length > 0){
        scene.remove(maze.notWall[0]);
        maze.notWall.shift();
        
        x = 0;
    }

    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

function onMouseDown(e){
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(pickables);
    if(intersects.length > 0){
        console.log(intersects[0]);
        
        if('mazeData' in intersects[0].object){
            scene.remove(intersects[0].object);
            maze.removeWall(intersects[0].object.mazeData);
        }
        
    }

}