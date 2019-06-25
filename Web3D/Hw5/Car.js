import * as THREE from 'three'
import {scene} from './initScene.js'

class Car{
    constructor(data,camera = undefined, cameraLB = undefined){
        this.body = this.buildBody();
        
        this.turn = new THREE.Object3D();
        this.turn.position.set(19,0,0);
        this.turn.add(this.tireBody3, new THREE.AxesHelper(18));

        if(camera){
            this.body.add(camera, cameraLB);
            cameraLB.position.set(19,5,-10);
            cameraLB.add(new THREE.AxesHelper(15));
            cameraLB.lookAt(new THREE.Vector3(0,0,-14));
        }
        this.body.add(this.turn);

        this.body.position.set(
            data.pos.x,
            data.pos.y,
            data.pos.z
        )

        this.turn.rotation.y = data.frontRot;
        this.body.rotation.y = data.rot;

        this.body.position.y = 5;

        scene.add(this.body);
    }


    update(dt){
        /*this.tireBody.rotation.z += 0.05;
        this.tireBody2.rotation.z += 0.05;
        this.tireBody3.rotation.z += 0.05;
        this.body.rotation.y += 0.05;*/
        this.turn.rotation.y += 0.05;
    }

    buildBody(){
        let geometry = new THREE.Geometry();
        let face;

        geometry.vertices.push(
            new THREE.Vector3(0,10,0),
            new THREE.Vector3(-5,0,-7.5),
            new THREE.Vector3(-5,0,7.5),
            new THREE.Vector3(19,0,0)
        );

        face = new THREE.Face3(0,1,2);
        geometry.faces.push(face);
        face = new THREE.Face3(0,3,1);
        geometry.faces.push(face);
        face = new THREE.Face3(0,2,3);
        geometry.faces.push(face);
        face = new THREE.Face3(1,3,2);
        geometry.faces.push(face);

        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        let body = new THREE.Mesh(geometry,new THREE.MeshNormalMaterial({color: 0x0000ff}));
        body.add(new THREE.AxesHelper(10));
        
        var loader = new THREE.TextureLoader();
        loader.crossOrigin = '';
        var tireTexture = loader.load('https://i.imgur.com/jPX4y1n.png?1');    //輪胎
        var tireSideTexture = loader.load('https://i.imgur.com/21rKfjX.jpg?2'); //胎痕
        tireSideTexture.wrapS = THREE.RepeatWrapping;
        tireSideTexture.repeat.set(6,1);

        this.tireBody = new THREE.Object3D();
        var tire = new THREE.Mesh(new THREE.CircleGeometry(5,64),new THREE.MeshPhongMaterial({map: tireTexture, transparent: true, side: THREE.DoubleSide}));
        var tire2 = new THREE.Mesh(new THREE.CircleGeometry(5,64),new THREE.MeshPhongMaterial({map: tireTexture, transparent: true, side: THREE.DoubleSide}));
        var tireSide = new THREE.Mesh(new THREE.CylinderGeometry(5,5,4,64,1,true),new THREE.MeshPhongMaterial({map: tireSideTexture, side: THREE.DoubleSide}));

        tire.position.set(0,0,2);
        tire2.position.set(0,0,-2);
        tireSide.rotation.x = Math.PI / 2;
        this.tireBody.add(tire,tire2,tireSide,new THREE.AxesHelper(10));
        this.tireBody.position.set(-5,0,-7.5);
        
        this.tireBody2 = this.tireBody.clone();
        this.tireBody2.position.set(-5,0,7.5);

        this.tireBody3 = this.tireBody.clone();
        this.tireBody3.position.set(0,0,0);

        body.add(this.tireBody,this.tireBody2);

        return body;
    }
}

export default Car;