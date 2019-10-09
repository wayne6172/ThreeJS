import * as THREE from 'three'
import {scene,initScene} from './initScene.js'
import OrbitControls from 'three-orbitcontrols'

var renderer,camera,controls,car,ground,light,plane;
var clock,speed = 10;

init();
animate();

function init(){
    initScene();
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor(0x888888);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50,window.innerWidth / window.innerHeight,10,1000);
    camera.position.set(50,50,50);

    controls = new OrbitControls(camera,renderer.domElement);

    scene.add(new THREE.GridHelper(500,50,'red','white'));

    car = buildBody();
    car.add(new THREE.AxesHelper(10));
    scene.add(car);


    ground = buildGround();
    scene.add(ground);

    plane = new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshPhongMaterial({color: 0x995a00}));
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    scene.add(plane);
    /*
        shadow
    */

   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFShadowMap;

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(50,50,50);
    light.castShadow = true;
    light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;
    light.shadow.camera.left = -180;
    light.shadow.camera.top = -180;
    light.shadow.camera.right = 180;
    light.shadow.camera.bottom = 180;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 400;
    light.shadow.bias = -0.01;
    scene.add(light,new THREE.DirectionalLightHelper(light));
    scene.add(new THREE.CameraHelper(light.shadow.camera));
/*
var light2 = new THREE.DirectionalLight(0xffffff);
  light2.position.set(-80, 160, 80);
  light2.castShadow = true;
  light2.shadow.camera.left = -180;
  light2.shadow.camera.top = -180;
  light2.shadow.camera.right = 180;
  light2.shadow.camera.bottom = 180;
  light2.shadow.camera.near = 1;
  light2.shadow.camera.far = 300;
  //light2.target = mesh2;
  light2.shadow.mapSize.width = light2.shadow.mapSize.height = 1024;
  scene.add(light2);
  light2.shadow.bias = -.01*/

    plane.receiveShadow = true;

    ground.traverse(function(e){
        if(e instanceof THREE.Mesh)
            e.castShadow = e.receiveShadow = true;
    });

    car.traverse(function(e){
        if(e instanceof THREE.Mesh)
            e.castShadow = e.receiveShadow = true;
    });

}

function buildBody(){
    let geo = new THREE.Geometry();
    geo.vertices.push(
        new THREE.Vector3(5,0,-5),
        new THREE.Vector3(5,0,5),
        new THREE.Vector3(5,5,0),
        new THREE.Vector3(-5,0,0)
    );

    let face3 = new THREE.Face3(0,2,1);
    geo.faces.push(face3);
    face3 = new THREE.Face3(1,2,3);
    geo.faces.push(face3);
    face3 = new THREE.Face3(0,3,2);
    geo.faces.push(face3);
    face3 = new THREE.Face3(0,1,3);
    geo.faces.push(face3);

    geo.computeBoundingSphere();
    geo.computeFaceNormals();
    //geo.computeVertexNormals();

    var mesh = new THREE.Mesh(geo,new THREE.MeshPhongMaterial({color: 0xff0000}));


    return mesh;
}

function buildGround(){
    let ground = new THREE.Object3D();
    let mat = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
    let g1 = new THREE.Mesh(new THREE.PlaneGeometry(20,30),mat);
    let g11 = g1.clone();
    let g12 = g1.clone();
    let g2 = new THREE.Mesh(new THREE.PlaneGeometry(Math.sqrt(20*20+10*10),30),mat);
    let g3 = new THREE.Mesh(new THREE.PlaneGeometry(Math.sqrt(10*10+10*10),30),mat);

    g1.position.set(-10,0,0);
    g11.position.set(-40,10,0);
    g12.position.set(-80,0,0);
    g2.position.set(-60,5,0);
    g3.position.set(-25,5,0);

    g1.rotation.x = g11.rotation.x = g12.rotation.x = 
        g2.rotation.x = g3.rotation.x = -Math.PI / 2;
    g2.rotation.y = -Math.atan2(10,20);
    g3.rotation.y = +Math.atan2(10,10);

    ground.add(g1,g11,g12,g2,g3);
    return ground;
}

function animate(){
    let dt = clock.getDelta();
    let val = new THREE.Vector3(-1,0,0).multiplyScalar(speed * dt);
    car.position.add(val);

    if(car.position.x <= -20 && car.position.x >= -30){
        car.position.y = -1 * car.position.x - 20;
        car.rotation.z = -Math.atan2(10,10) * (speed > 0 ? 1 : -1);
    }
    else if(car.position.x <= -50 && car.position.x >= -70){
        car.position.y = 0.5 * car.position.x + 35;
        car.rotation.z = Math.atan2(10,20) * (speed > 0 ? 1 : -1);;
    }
    else if(car.position.x < -90 || car.position.x > 0){
        if(car.position.x < -90)
            car.position.x = -90;
        else
            car.position.x = 0;
        speed *= -1;
        car.rotation.y += Math.PI;
    }
    else car.rotation.z = 0;

    requestAnimationFrame(animate);
    render();
}

function render(){
    renderer.render(scene,camera);
}