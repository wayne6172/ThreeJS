import * as THREE from 'three'
import KeyboardState from './keyboard.js'

var scene,keyboard;

function initScene() {
    scene = new THREE.Scene();
    keyboard = new KeyboardState();
}

export {scene,initScene,keyboard}