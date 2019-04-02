import * as THREE from 'three';
import OrbitControl from 'three-orbitcontrols';

var renderer, camera, scene, controls;
var raycaster = new THREE.Raycaster();
var Choose = undefined;
var allWall = [];


class Wall{
    constructor(index){
        this.pos = new THREE.Vector3();
        this.rot = new THREE.Vector3();
        this.scale = new THREE.Vector3();
        this.body = new THREE.Mesh(new THREE.BoxGeometry(20,20,20),new THREE.MeshNormalMaterial({transparent: true}));
        this.body.name = '' + index;
        scene.add(this.body);

    }
    
}

init();
animate();

function init() {
    let div = document.getElementById("threeJS");

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(div.offsetWidth, div.offsetHeight);
    renderer.setClearColor(0x888888);
    div.appendChild(renderer.domElement)


    camera = new THREE.PerspectiveCamera(35,div.offsetWidth/ div.offsetHeight, 1, 1000);
    camera.position.set(100,100,100);
    
    controls = new OrbitControl(camera, renderer.domElement);
    controls.enableKey = false;
500
    scene = new THREE.Scene();
    
    scene.add(new THREE.GridHelper(500,50,'red','white'));
    scene.add(new THREE.AxesHelper(30));

    document.getElementById("posX").setAttribute("readonly",'true');

    //let a = new Wall();
}

function animate() {
    
    render();
    requestAnimationFrame(animate);
}

function render(){
    renderer.render(scene,camera);
}

document.getElementById("Create").onclick = () => {
    allWall.push(new Wall(allWall.length));
}