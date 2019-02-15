import * as THREE from 'three'
import {scene,keyboard} from './scene.js'
import {SpriteText2D, textAlign} from 'three-text2d'

class Car{
    constructor(name,pos = {x: 0, y: 0, z: 0},angle = 0.0){
        this.name = name;
        this.pos = new THREE.Vector3(pos.x,pos.y,pos.z);
        this.angle = angle;
        this.speed = 0.0;
        this.body = this.buildBody(name);

        this.text = new SpriteText2D(name,{align: textAlign.center, font:'40px Arial', fillStyle: '#ff0000'});
        this.text.scale.set(0.2,0.2,0.2);
        this.text.position.y = 10;

        this.body.add(this.text);

        this.body.position.copy(this.pos);
        this.body.rotation.y = angle;
    }

    buildBody(){
        var body = new THREE.Object3D();
        var circle = new THREE.Mesh(new THREE.CylinderGeometry(10,10,6,64),new THREE.MeshNormalMaterial());
        var gun = new THREE.Mesh(new THREE.BoxGeometry(10,6,3),new THREE.MeshNormalMaterial());

        gun.position.set(10,0,0);
        body.add(circle,gun);

        return body;
    }

    update(dt){
        if(keyboard.pressed("W"))
            this.speed += 0.5;
        if(keyboard.pressed("S"))
            this.speed -= 0.5;
        if(keyboard.pressed("A"))
            this.angle += 0.1;
        if(keyboard.pressed("D"))
            this.angle -= 0.1;

        this.speed = Math.max(0,Math.min(this.speed,70));

        this.pos.add(new THREE.Vector3(this.speed * dt,0,0).applyAxisAngle(new THREE.Vector3(0,1,0),this.angle));
    }

    updateByServer(pos,angle){
        this.angle = angle;
        this.pos.set(pos.x,pos.y,pos.z);

        this.body.position.copy(this.pos);
        this.body.rotation.y = this.angle;
    }

    addToScene(){
        scene.add(this.body);
    }

    removeToScene(){
        scene.remove(this.body);
    }
}

export {Car}