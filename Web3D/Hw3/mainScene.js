import * as THREE from 'three'

var scene, sceneHUD, pickables;

function initScene() {
    scene = new THREE.Scene();
    pickables = [];
}

export {scene,initScene,pickables}