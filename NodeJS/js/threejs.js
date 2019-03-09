import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import Stats from 'stats-js'
import {scene, initScene, keyboard} from './scene.js'
import {Car} from './Car.js'
import GLTFLoader from 'three-gltf-loader'
import {Robot} from "./Robot.js";

var socket = parent.socket, stats, modelGLTF = [],allUser,id = parent.ID;

//-----------------------three js-------------------------

var renderer,camera,controls,clock,sun,allModel = [],model;
window.addEventListener('resize', onWindowResize, false);
let getInitDataPromise = () => {
    return new Promise(resolve => {
        socket.emit('initClient',{},(msg) => {
            console.log('socket init complete');
            allUser = msg;
            resolve();
        });
    });
};

let AllLoaderPromise = [];
for(let i = 0; i < 10; i++){
    AllLoaderPromise.push(
        new Promise((resolve, reject) => {
            var loader = new GLTFLoader();
            loader.load('/model/RobotExpressive.glb', (gltf) => {
                console.log('complete loader');
                resolve(gltf);
            }, (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            }, (error) => {
                reject(error);
            });
        })
    );
}

Promise.all(AllLoaderPromise).then(getInitDataPromise()).then((response) => {
    modelGLTF = response;
    init();
    animate();
}).catch((error) => console.log(error));

function init() {
    initScene();

    scene.background = new THREE.Color(0x888888);
    clock = new THREE.Clock();

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';

    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);

    renderer = new THREE.WebGLRenderer({ambient: true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.GridHelper(500,50,'red','white'));


    camera = new THREE.PerspectiveCamera(35,window.innerWidth/window.innerHeight,1,1000);

    sun = new THREE.DirectionalLight(0xffffff);
    sun.position.set(500,300,500);
    sun.castShadow = true;
    sun.shadow.mapSize.width = sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.left = sun.shadow.camera.bottom = -500;
    sun.shadow.camera.right = sun.shadow.camera.top = 500;
    sun.shadow.camera.far = 3000;
    sun.shadow.bias = 0.5;

    scene.add(sun,new THREE.AmbientLight(0x222222));

    let plane = new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshPhongMaterial());
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;

    scene.add(plane);
/*
    controls = new OrbitControls(camera,renderer.domElement);
    controls.enableKeys = false;*/

    for(let i = 0, j = 0; i < allUser.allPlayerData.length; i++){
        console.log(allUser.allPlayerData.length);
        if(allUser.allPlayerData[i] !== undefined) {
            console.log(allUser);
            if(i !== id)
                allModel[i] = new Robot(modelGLTF[j],allUser.allPlayerData[i].name,undefined);
            else
                allModel[i] = new Robot(modelGLTF[j],'',camera);
            j++;
        }
    }

    //model = new Robot(modelGLTF[0]);
}

function animate() {
    keyboard.update();
    stats.update();

    var dt = clock.getDelta();

    if(keyboard.pressed('W'))
        socket.emit('Client_pressed_W',{ID: id});
    if(keyboard.pressed('A'))
        socket.emit('Client_pressed_A',{ID: id});
    if(keyboard.pressed('S'))
        socket.emit('Client_pressed_S',{ID: id});
    if(keyboard.pressed('D'))
        socket.emit('Client_pressed_D',{ID: id});
    if(keyboard.down('Q'))
        socket.emit('Client_down_Q',{ID: id});

    if(keyboard.down('shift'))
        socket.emit('Client_down_shift',{ID: id});
    if(keyboard.up('shift'))
        socket.emit('Client_up_shift',{ID: id});

    socket.emit('Client_update',{ID: id},(msg) => {
        for(let i = 0; i < msg.allPlayerData.length ; i++){
            console.log(msg);
            if(allModel[i] && msg.allPlayerData[i])
                allModel[i].updateByServer(msg.allGameData[i].pos,msg.allGameData[i].angle,msg.allGameData[i].actionName);
            else if(msg.allPlayerData[i] && allModel[i] === undefined){          //新玩家加入
                allModel[i] = new Robot(modelGLTF[parent.userNum++],msg.allPlayerData[i].name,undefined);
                allModel[i].updateByServer(msg.allGameData[i].pos,msg.allGameData[i].angle,msg.allGameData[i].actionName);
            }
            else if(msg.allPlayerData[i] === null && allModel[i]){           //玩家離開
                scene.remove(allModel[i].body);
                allModel[i] = undefined;
            }
        }
    });



    allModel.forEach((e) => {
        if(e) e.update(dt);
    });

    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene,camera);
}

function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}