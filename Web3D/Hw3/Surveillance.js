import * as THREE from 'three'
import {scene} from './mainScene.js'

//請注意，鏡頭的控制上下請以body1的x做旋轉，左右則以整身body的y做旋轉

class Surveillance{
    constructor(rot){
        this.body1 = this.createBody();
        this.body2 = this.createBody2();
        this.body = new THREE.Object3D();

        this.camera = new THREE.PerspectiveCamera(35, 1, 1, 1000);
        this.camera.position.z = 15;
        this.camera.rotation.y = Math.PI;

        this.body1.rotation.x = Math.PI / 6;

        this.body1.add(this.camera);
        this.body.add(this.body1,this.body2);

        this.constRot = rot;
        this.rot = Math.PI / 6;
        this.body.rotation.y = rot + this.rot;
        scene.add(this.body);

        this.state = 0; // 0,2=>idle, 3=>right, 1=>left;
        this.wait = 1;
    }
    createBody(){
        let body = new THREE.Object3D();
        let body2 = new THREE.Object3D();

        let layout = new THREE.Mesh(new THREE.CylinderGeometry(3,3,8,64), new THREE.MeshNormalMaterial());
        let layout2 = new THREE.Mesh(new THREE.CylinderGeometry(3,3,2,64,1,true,0,Math.PI),new THREE.MeshNormalMaterial({side: THREE.DoubleSide}));
        layout.rotation.x = Math.PI / 2;

        layout2.rotation.x = Math.PI / 2;
        layout2.rotation.y = Math.PI / 2;
        layout2.position.z = 5;

        let layout3 = new THREE.Mesh(new THREE.SphereGeometry(1,16,16,0,Math.PI), new THREE.MeshNormalMaterial());
        layout3.position.z = 4;

        body.add(layout,layout2,layout3);
        
        // ----以下為支架

        let bone1 = new THREE.Mesh(new THREE.CylinderGeometry(1,1,6,64), new THREE.MeshNormalMaterial());
        bone1.rotation.x = Math.PI / 2;
        bone1.position.z = -7;
        let bone2 = new THREE.Mesh(new THREE.SphereGeometry(1,16,16),new THREE.MeshNormalMaterial());
        bone2.position.z = -10;

        body.add(bone1,bone2);
        body.position.z = 10;
        body2.add(body);

        return body2;
    }
    createBody2(){
        let body = new THREE.Object3D();

        let bone = new THREE.Mesh(new THREE.CylinderGeometry(1,1,8,64), new THREE.MeshNormalMaterial());
        bone.position.y = 4;

        body.add(bone);

        return body;
    }
    animateUpdate(dt){
        //console.log(this.state);
        if(this.state == 0 || this.state == 2){
            this.wait -= dt;
            if(this.wait <= 0){
                this.wait = 1;
                this.state++;
            }
        }
        else if(this.state == 1){
            this.rot -= 0.03;
            if(this.rot <= -Math.PI / 6){
                this.rot = -Math.PI / 6;
                this.state++;
            }
        }
        else {
            this.rot += 0.03;
            if(this.rot >= Math.PI / 6){
                this.rot = Math.PI / 6;
                this.state = 0;
            }
        }

        this.body.rotation.y = this.constRot + this.rot;
    }
}

export {Surveillance}