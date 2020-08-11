import * as THREE from 'three'
import {scene,initScene} from './initScene.js'
import OrbitControls from 'three-orbitcontrols'

var camera, renderer, controls;

init();
animate();

function readModel(modelName, targetSize = 40){
    var onProgress = function (xhr) {
        if(xhr.lengthComputable){
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete,2) + '% downloaded');
        }
    };

    var onError = function (xhr) {};

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.crossOrigin = '';
    mtlLoader.setPath('../OBJ/');
    mtlLoader.load(modelName + '.mtl',function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('../model/');
        objLoader.load(modelName + '.obj',function (object) {
            let theObject = unitize(object,targetSize);
            theObject.name = 'OBJ';
            theObject.rotation.y = -Math.PI / 2;
            theObject.position.y = 11;

            train.add(theObject);
            scene.add(train);

        },onProgress,onError);
    })
}

function init(){
    initScene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor(0x888888);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50,window.innerWidth / window.innerHeight,10,1000);
    camera.position.set(50,50,50);

    controls = new OrbitControls(camera,renderer.domElement);

    scene.add(new THREE.GridHelper(500,50,'red','white'));
}

function animate(){


    requestAnimationFrame(animate);
    render();
}

function render(){
    renderer.render(scene,camera);
}