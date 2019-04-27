import * as THREE from 'three'
import OrbitControl from 'three-orbitcontrols'
import { scene, initScene, pickables} from './mainScene.js';
import { Light } from './Light.js';                 //畫作打光類別
import Stats from 'stats-js';
import {Surveillance} from './Surveillance.js'      //監視器載入類別，注意，render function須配合
import {Painting} from './Painting.js'              //畫作載入類別
import {loadSceneData} from './SceneData.js'
import $ from 'jquery'

var camera, renderer, contorls, stats, clock;
var surveillance = [];
var secondRenderer = [];
var raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
var lights = [], paints = [];
var chooseCamera = 0;
var introduction = [
    "<刀劍神域> 桐人",
    "<海綿寶寶> 海綿寶寶",
    "<五等分的花嫁>",
    "在你哭泣時，我永遠都會幫你撐傘",
    "<Overlord> 夏提雅",
    "<楓之谷> 西格諾斯女皇"
];

init();
animate();

$('#mainScreen').click((e) => {
    let x = e.pageX - e.target.offsetLeft - window.innerWidth * 0.025;
    let y = e.pageY - e.target.offsetTop - window.innerHeight * 0.2;    

    mouse.x = (x / (window.innerWidth * 3 / 5)) * 2 - 1;
    mouse.y = -(y / (window.innerHeight * 3 / 5)) * 2 + 1;

    raycaster.setFromCamera(mouse,camera);

    let intersects = raycaster.intersectObjects(pickables);
    console.log(pickables);
    console.log(mouse);
    if(intersects.length > 0){
        document.getElementById('introduction').innerText = introduction[intersects[0].object.name];
    }
});

function init(){
    initScene();

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth * 3 / 5, window.innerHeight * 3 / 5);
    renderer.setClearColor(0x888888);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicZ;

    for(let i = 1; i <= 5; i++){
        let trenderer = new THREE.WebGLRenderer();
        if(i == 5)trenderer.setSize(200, 200);
        else trenderer.setSize(120, 120);
        trenderer.setClearColor(0x888888);
        //trenderer.shadowMap.enabled = true;
        //trenderer.shadowMap.type = THREE.BasicShadowMap;
        
        secondRenderer.push(trenderer);
    
        document.getElementById('secondScreen' + i).appendChild(trenderer.domElement);
    }

    document.getElementById('mainScreen').appendChild(renderer.domElement);

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

    
    surveillance[0] = new Surveillance(Math.PI / 4 * 3);
    surveillance[0].body.position.set(-125,72,125);

    surveillance[1] = new Surveillance(Math.PI / 4 * 5);
    surveillance[1].body.position.set(125,72,125);

    surveillance[2] = new Surveillance(Math.PI / 4);
    surveillance[2].body.position.set(-125,72,-125);

    surveillance[3] = new Surveillance(Math.PI / 4 * 7);
    surveillance[3].body.position.set(125,72,-125);

    loadSceneData();

    paints.push(new Painting('1.png','1.png',50,50,35,35,new THREE.Vector3(0,40,5.2),0,0));
    paints.push(new Painting('2.png','2.jpg',50,50,35,35,new THREE.Vector3(0,40,-5.2),0,1));
    paints.push(new Painting('1.png','3.jpg',90,50,65,35,new THREE.Vector3(124.8,40,0),-Math.PI / 2,2));
    paints.push(new Painting('3.png','4.jpg',50,80,35,55,new THREE.Vector3(0,40,124.8),0,3));
    paints.push(new Painting('1.png','5.png',90,50,65,35,new THREE.Vector3(-124.8,40,0),Math.PI / 2,4));
    paints.push(new Painting('1.png','6.jpg',90,50,65,35,new THREE.Vector3(0,40,-124.8),0,5));
    
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

    let dt = clock.getDelta();

    surveillance.forEach((e) => e.animateUpdate(dt));

    //surveillance.body.rotation.y = (move) % (Math.PI);
    //surveillance.body1.rotation.x = move % (Math.PI / 4);

    requestAnimationFrame(animate);
    render();
}

function render() {

    renderer.render(scene,camera);
    secondRenderer[0].render(scene,surveillance[0].camera);
    secondRenderer[1].render(scene,surveillance[1].camera);
    secondRenderer[2].render(scene,surveillance[2].camera);
    secondRenderer[3].render(scene,surveillance[3].camera);
    
    secondRenderer[4].render(scene,surveillance[chooseCamera].camera);
}

document.getElementById('frontCamera').onclick = () => {
    chooseCamera = (chooseCamera + 3) % 4;
    document.getElementById('textCamera').innerText = '畫面' + (chooseCamera + 1);
}

document.getElementById('nextCamera').onclick = () => {
    chooseCamera = (chooseCamera + 1) % 4;
    document.getElementById('textCamera').innerText = '畫面' + (chooseCamera + 1);
}