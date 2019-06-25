import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import {scene, initScene} from './initScene.js'
import {Maze} from './Maze.js'

var camera, renderer, stats, clock, controls, maze;
var i;
window.addEventListener('resize', onWindowResize, false);


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
}

function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    var dt = clock.getDelta();

    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}
