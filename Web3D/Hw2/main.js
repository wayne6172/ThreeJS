import * as THREE from 'three'
import OrbitControl from 'three-orbitcontrols'
import { scene, initScene } from './mainScene.js';
import { Light } from './Light.js';                 //畫作打光類別
import Stats from 'stats-js';
import {Surveillance} from './Surveillance.js'      //監視器載入類別，注意，render function須配合
import {Painting} from './Painting.js'              //畫作載入類別
import {loadSceneData} from './SceneData.js'
import $ from 'jquery'

var camera, renderer, contorls, surveillance, surveillance2, stats, cameraHUD;
var sceneHUD, sceneHUD2, paint;
var raycaster = new THREE.Raycaster(), pickables = [];
var lights = [], paints = [];
var lightsOff = false;

//document.addEventListener('mousedown',hudButtonPick,false);

$('#intensity').change ( function() {
    lights.forEach((e) => {
        e.light.intensity = $(this).val();
    });
})

$('#tView').click(function() {
    lightsOff = !lightsOff;

    if (lightsOff) {
        lights.forEach((e) => {
            e.light.intensity = 0;
        })
    } else {
        lights.forEach((e) => {
            e.light.intensity = 0.7;
        })
    }
});

init();
animate();

function initHUD(){
    sceneHUD = new THREE.Scene();

    cameraHUD = new THREE.OrthographicCamera(-10.01,10.01,10.01,-10.01,-50,50);
    cameraHUD.position.z = 20;

    let geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-10,-10,0),
        new THREE.Vector3(10,-10,0),
        new THREE.Vector3(10,10,0),
        new THREE.Vector3(-10,10,0),
        new THREE.Vector3(-10,-10,0)
    );

    let line = new THREE.Line(geometry,new THREE.LineBasicMaterial({color: 0, depthTest: false}));

    sceneHUD.add(line);

    // left
    geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(-1,0,0),
        new THREE.Vector3(0,1,0),
        new THREE.Vector3(0,-1,0)
    );

    geometry.faces.push(new THREE.Face3(0,2,1));

    let tri, tri2;
    tri = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color: 0xff0000}));
    tri.position.set(-1,-5,0);
    tri.name = 'HUDLeft';

    sceneHUD.add(tri);
    pickables.push(tri);

    //right
    geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(1,0,0),
        new THREE.Vector3(0,1,0),
        new THREE.Vector3(0,-1,0)
    );

    geometry.faces.push(new THREE.Face3(0,1,2));

    tri = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color: 0xff0000}));
    tri.position.set(1,-5,0);
    tri.name = 'HUDRight';

    sceneHUD.add(tri);
    pickables.push(tri);

    //top

    geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(-0.6,0,0),
        new THREE.Vector3(0,2,0),
        new THREE.Vector3(0.6,0,0)
    );

    geometry.faces.push(new THREE.Face3(0,2,1));

    tri = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color: 0xff0000}));
    tri.position.set(0,-3.9,0);
    tri.name = 'HUDTop';

    sceneHUD.add(tri);
    pickables.push(tri);

    //down

    geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(-0.6,0,0),
        new THREE.Vector3(0,-2,0),
        new THREE.Vector3(0.6,0,0)
    );

    geometry.faces.push(new THREE.Face3(0,1,2));

    tri = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color: 0xff0000}));
    tri.position.set(0,-6.1,0);
    tri.name = 'HUDDown';

    sceneHUD.add(tri);
    pickables.push(tri);

}

function init(){
    initScene();
    initHUD();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x888888);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.autoClear = false;

    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);

    camera = new THREE.PerspectiveCamera(35,window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(200,100,200);
    camera.lookAt(new THREE.Vector3());
    
    contorls = new OrbitControl(camera, renderer.domElement);
    contorls.enableKey = false;

    let grid = new THREE.GridHelper(500,50,'red','white');
    let axes = new THREE.AxesHelper(30);

    scene.add(axes,new THREE.AmbientLight(0x777777));

    /*
    surveillance = new Surveillance();
    surveillance.body.position.y = 50;

    surveillance2 = new Surveillance();
    surveillance2.body.position.set(50,50,0);*/

    loadSceneData();

    paints.push(new Painting('1.png','1.png',50,50,35,35,new THREE.Vector3(0,40,5.2),0));
    paints.push(new Painting('2.png','2.jpg',50,50,35,35,new THREE.Vector3(0,40,-5.2),0));
    paints.push(new Painting('1.png','3.jpg',90,50,65,35,new THREE.Vector3(124.8,40,0),-Math.PI / 2));
    paints.push(new Painting('3.png','4.jpg',50,80,35,55,new THREE.Vector3(0,40,124.8),0));
    paints.push(new Painting('1.png','5.png',90,50,65,35,new THREE.Vector3(-124.8,40,0),Math.PI / 2));
    paints.push(new Painting('1.png','6.jpg',90,50,65,35,new THREE.Vector3(0,40,-124.8),0));
    

    let light = new Light();
    light.body.position.set(0,80,65);
    light.body.rotation.x = -Math.PI / 3;

    lights.push(light);

    light = new Light();
    light.body.position.set(0,80,55);
    light.body.rotation.x = Math.PI / 3;

    lights.push(light);

    light = new Light();
    light.body.position.set(0,80,-65);
    light.body.rotation.x = Math.PI / 3;

    lights.push(light);

    light = new Light();
    light.body.position.set(0,80,-55);
    light.body.rotation.x = -Math.PI / 3;

    lights.push(light);

    light = new Light();
    light.body.position.set(50,80,0);
    light.body.rotation.z = Math.PI / 3;

    lights.push(light);

    light = new Light();
    light.body.position.set(-50,80,0);
    light.body.rotation.z = -Math.PI / 3;

    lights.push(light);

    //let box = new THREE.Mesh

    let loader = new THREE.TextureLoader();
    loader.crossOrigin = '';

    loader.load('./Material/99.jpg',(mat) => {
        //mat.repeat.set(3,3);
        mat.wrapS = THREE.RepeatWrapping;
        mat.wrapT = THREE.RepeatWrapping;
        let plane = new THREE.Mesh(new THREE.PlaneGeometry(260,260),new THREE.MeshPhongMaterial({map: mat}));
        plane.rotation.x = -Math.PI / 2;
        plane.castShadow = plane.receiveShadow = true;
        scene.add(plane);
    },undefined,(error) => console.log(error));

    loader.load('./Material/leather.jpg',(mat) => {
        let chair = new THREE.Mesh(new THREE.BoxGeometry(50,20,20),new THREE.MeshPhongMaterial({map: mat}));
        chair.position.set(0,10,65);
        chair.castShadow = true;

        scene.add(chair);

        chair = new THREE.Mesh(new THREE.BoxGeometry(50,20,20),new THREE.MeshPhongMaterial({map: mat}));
        chair.position.set(0,10,-65);
        chair.castShadow = true;

        scene.add(chair);
    },undefined,(error) => console.log(error));
}

function animate(){
    stats.update();

    //surveillance.body.rotation.y = (move) % (Math.PI);
    //surveillance.body1.rotation.x = move % (Math.PI / 4);

    requestAnimationFrame(animate);
    render();
}

function render() {
    var WW = window.innerWidth;
    var HH = window.innerHeight;

    renderer.setScissorTest(true);
    
    renderer.setViewport(0,0,WW,HH);
    renderer.setScissor(0,0,WW,HH);
    renderer.clear();

    renderer.render(scene,camera);

    /*
    // 第一監視器

    renderer.setViewport(0,0,WW / 3, HH / 3);
    renderer.setScissor(0,0,WW / 3, HH / 3);
    renderer.clear();

    renderer.render(scene,surveillance.camera);
    renderer.render(sceneHUD,cameraHUD);

    // 第二監視器

    renderer.setViewport(WW / 3,0,WW / 3, HH / 3);
    renderer.setScissor(WW / 3,0,WW / 3, HH / 3);
    renderer.clear();

    renderer.render(scene,surveillance2.camera);
    renderer.render(sceneHUD,cameraHUD);*/

    renderer.setScissorTest(false);
}

function hudButtonPick(event){
    event.preventDefault();

    let WW = window.innerWidth;
    let HH = window.innerHeight;
    
    let vw = WW / 3;
    let vh = HH / 3;

    // 針對左下角攝影機

    let mouse = new THREE.Vector2();
    mouse.x = 2 * (event.clientX) / vw - 1;
    mouse.y = 1 - 2 * (event.clientY - window.innerHeight + vh) / vh;

    if(Math.abs(mouse.x) <= 1 && Math.abs(mouse.y) <= 1){
        raycaster.setFromCamera(mouse,cameraHUD);

        let intersects = raycaster.intersectObjects(pickables);
        if(intersects.length > 0){
            surveillance.update(intersects[0].object.name);
        }
    }

    // 針對中下角攝影機

    mouse = new THREE.Vector2();
    mouse.x = 2 * (event.clientX - vw) / vw - 1;
    mouse.y = 1 - 2 * (event.clientY - window.innerHeight + vh) / vh;

    if(Math.abs(mouse.x) <= 1 && Math.abs(mouse.y) <= 1){
        raycaster.setFromCamera(mouse,cameraHUD);

        let intersects = raycaster.intersectObjects(pickables);
        if(intersects.length > 0){
            surveillance2.update(intersects[0].object.name);
        }
    }
}


document.getElementById('tView').onclick = () => {

};

document.getElementById('intensity').onchange = () => {
    document.getElementById()
}