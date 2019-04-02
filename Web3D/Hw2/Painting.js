import * as THREE from 'three'
import {scene} from './mainScene.js'

class Painting{
    constructor(frameFileName, paintFileName, frameWidth,frameHeight,paintWidth,paintHeight,pos,rot){
        this.body = undefined;
        this.createBody(frameFileName, paintFileName, frameWidth,frameHeight,paintWidth,paintHeight,pos,rot);
        
        //scene.add(this.body);
    }

    createBody(frameFileName, paintFileName, frameWidth,frameHeight,paintWidth,paintHeight,pos,rot){
        let textureLoader = new THREE.TextureLoader();
        let self = this;
        textureLoader.crossOrigin = '';
        
        let promiseToFrame = new Promise((resolve, reject) => {
            textureLoader.load('./Material/Frame/' + frameFileName,(texture) => {
                let mat = new THREE.MeshBasicMaterial({map: texture, transparent: true, side: THREE.DoubleSide});
                resolve(mat);
            }
            ,undefined
            ,(error) => {
                console.log(error);
            });
        });

        let promiseToPaint = new Promise((resolve, reject) => {
            textureLoader.load('./Material/Paint/' + paintFileName,(texture) => {
                let mat = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
                resolve(mat);
            }
            ,undefined
            ,(error) => {
                console.log(error);
            });
        });

        Promise.all([promiseToFrame,promiseToPaint]).then((values) => {
            let body = new THREE.Object3D();
            let paint = new THREE.Mesh(new THREE.PlaneGeometry(paintWidth,paintHeight),values[1]);
            paint.rotation.x = -Math.PI;

            body.add(new THREE.Mesh(new THREE.PlaneGeometry(frameWidth,frameHeight),values[0]));
            body.add(paint);
            self.body = body;
            self.body.position.copy(pos);
            self.body.rotation.y = rot;

            scene.add(self.body);
        }).catch((error) => {
            console.log(error);
        })
        

    }
}

export {Painting}