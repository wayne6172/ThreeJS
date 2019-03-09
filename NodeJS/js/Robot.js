import * as THREE from 'three'
import {scene,keyboard} from './scene.js'
import {SpriteText2D, textAlign} from 'three-text2d'

class Robot{
    constructor(modelGLTF,needText,camera) {
        this.angle = 0.0;
        this.pos = new THREE.Vector3(0,0,0);
        this.body = modelGLTF.scene;


        if(needText !== ''){
            this.text = new SpriteText2D(needText,{align: textAlign.center, font:'40px Arial', fillStyle: '#ff0000'});
            this.text.scale.set(0.01,0.01,0.01);
            this.text.position.y = 5;
            this.body.add(this.text);
        }


        if(camera){
            camera.position.set(0,5,-20);
            camera.lookAt(new THREE.Vector3());
            this.body.add(camera);
        }

        this.actions = {};
        this.mixer = new THREE.AnimationMixer(modelGLTF.scene);

        this.states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
        this.emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

        for(let i = 0; i < modelGLTF.animations.length; i++){
            let clip = modelGLTF.animations[i];
            let action = this.mixer.clipAction(clip);
            this.actions[clip.name] =  action;

            if(this.emotes.indexOf(clip.name) >= 0 || this.states.indexOf(clip.name) >= 4){
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
        }

        this.activeAction = this.actions['Idle'];
        this.activeAction.play();

        //this.body.add(new THREE.AxisHelper(15));
        this.body.scale.set(5,5,5);
        this.body.traverse((child) => {
            if(child instanceof THREE.Mesh){
                child.castShadow = true;
            }
        });

        scene.add(this.body);
    }

    update(dt){
        this.mixer.update(dt);

        this.body.position.copy(this.pos);
        this.body.rotation.y = this.angle;
    }

    updateByServer(pos,angle,actionName){
        if(this.previousAction !== this.actions[actionName])
            this.fadeToAction(actionName,0.5);
        this.pos.set(pos.x,pos.y,pos.z);
        this.angle = angle;
    }

    fadeToAction(name,duration){
        this.previousAction = this.activeAction;
        this.activeAction = this.actions[ name ];
        this.previousAction.fadeOut( duration );

        this.activeAction
            .reset()
            .setEffectiveTimeScale( 1 )
            .setEffectiveWeight( 1 )
            .fadeIn( duration )
            .play();
    }
}

export {Robot}