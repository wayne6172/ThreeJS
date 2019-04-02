import * as THREE from 'three'
import {scene} from './mainScene.js'
import { DoubleSide, BackSide } from 'three';

class Light{
    constructor(){
        this.body = this.createBody();
        scene.add(this.body);


    }

    createBody(){
        let body = new THREE.Object3D();
        let target = new THREE.Object3D();
        let OutLayer = new THREE.Mesh(new THREE.CylinderGeometry(3,3.5,10,64,1,true), new THREE.MeshPhongMaterial({color: 0xffffff}));
        let bottom = new THREE.Mesh(new THREE.CircleGeometry(3,64), new THREE.MeshPhongMaterial({side: DoubleSide, color: 0xffffff}));
        bottom.position.y = 5;
        bottom.rotation.x = Math.PI / 2;

        let InLayer = new THREE.Mesh(new THREE.CylinderGeometry(1,3.5,6,64,1,true), new THREE.MeshPhongMaterial({side: BackSide}));
        InLayer.position.y = -2;
        let bottom2 = new THREE.Mesh(new THREE.CircleGeometry(1,64), new THREE.MeshPhongMaterial({side: DoubleSide}));
        bottom2.position.y = 1;
        bottom2.rotation.x = Math.PI / 2;

        target.position.y = -5;
        body.add(OutLayer,bottom,InLayer,bottom2,target);
        

        // -------------- light ------------------- //

        let light = new THREE.SpotLight(0xffffff,0.7,200,0.5,0.5);
        light.position.y = 1;
        light.castShadow = true;
        light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 5;
        light.shadow.camera.far = 200;
        light.shadow.camera.fov = light.angle / Math.PI * 180 * 2;
        light.shadow.bias = -0.01;
        light.target = target;
        this.light = light;

        let light2 = new THREE.PointLight(0xffffff,1,5);
        light2.position.y = -1;

        body.add(light,light2);
        return body;
    }
}

export {Light}