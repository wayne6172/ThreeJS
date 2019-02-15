import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import Stats from 'stats-js'
import {scene, initScene, keyboard} from './scene.js'
import {Car} from './Car.js'

var socket,allCar = [],myCar, stats;
//-----------------------three js-------------------------

var renderer,camera,controls,clock,gyro;
window.addEventListener('resize', onWindowResize, false);

init();
animate();

function init() {
    initScene();
    socket = parent.socket;

    clock = new THREE.Clock();

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';

    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor(0x888888);
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.GridHelper(500,50,'red','white'));

    myCar = new Car(parent.account);

    camera = new THREE.PerspectiveCamera(35,window.innerWidth/window.innerHeight,1,1000);
    camera.position.set(-50,10,0);
    camera.lookAt(new THREE.Vector3());

/*
    controls = new OrbitControls(camera,renderer.domElement);
    controls.enableKeys = false;*/


    socket.emit('init',{account: parent.account,pos: myCar.pos, angle: myCar.angle},(allCarState) => {
        var i = 0;
        allCarState.forEach((e) => {
            if(e) {
                allCar[i] = new Car(e.name, e.state.pos, e.state.angle);
                allCar[i].addToScene();
                if (allCar[i].name === parent.account) {
                    allCar[i].body.remove(allCar[i].text);
                    allCar[i].body.add(camera);
                }
            }
            else allCar[i] = undefined;
            i++;
        });
    });
}

function animate() {
    keyboard.update();
    stats.update();

    var dt = clock.getDelta();

    myCar.update(dt);

    var i = 0;
    socket.emit('clientUpdate',{account: parent.account,pos: myCar.pos, angle: myCar.angle},(allCarState) => {
        allCarState.forEach((e) => {
            if(e) {
                if(allCar[i] === undefined) {
                    allCar[i] = new Car(e.name, e.state.pos, e.state.angle);
                    allCar[i].addToScene();
                }
                else allCar[i].updateByServer(e.state.pos,e.state.angle);
            }
            else {
                if(allCar[i]) {
                    allCar[i].removeToScene();
                    allCar[i] = undefined;
                }
            }
            i++;
        });
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