import * as THREE from 'three'
import {scene} from './mainScene.js'

let wallData = [
    {pos: {x: 0, y: 40, z: 0}, rot: {x: 0, y: 0, z: 0}, scale: {x: 10, y: 8, z: 1}},
    {pos: {x: 130, y: 40, z: 0}, rot: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 8, z: 25}},
    {pos: {x: 0, y: 40, z: 130}, rot: {x: 0, y: 0, z: 0}, scale: {x: 15, y: 8, z: 1}},
    {pos: {x: -130, y: 40, z: 0}, rot: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 8, z: 25}},
    {pos: {x: 0, y: 40, z: -130}, rot: {x: 0, y: 0, z: 0}, scale: {x: 27, y: 8, z: 1}},
];

function loadSceneData(){
    wallData.forEach((e) => {
        let wall = new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshPhongMaterial({color: 0xb76924}));
        wall.position.set(e.pos.x,e.pos.y,e.pos.z);
        wall.rotation.set(e.rot.x,e.rot.y,e.rot.z);
        wall.scale.set(e.scale.x,e.scale.y,e.scale.z);
        wall.castShadow = true;

        scene.add(wall);
    });
}

export {loadSceneData}