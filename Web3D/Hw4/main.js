import * as THREE from 'three'
import $ from 'jquery'

var renderer, camera, scene, clock;
var divDOM = document.getElementById('mainScreen');
var circle, R = 5, circleVel, Rec, RecWidth = 35, RecHeight = 25;
var resDOM = $('#res');
var start = true;
var pickable = [], raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
var audio = document.getElementById('collisionsound');
var soundOpen = false;

$('#mainScreen').click((e) => {
    let dom = $('#mainScreen');
    let x = e.pageX - dom.position().left;
    let y = e.pageY - dom.position().top;

    mouse.x = (x / dom.width()) * 2 - 1;
    mouse.y = -(y / dom.height()) * 2 + 1;

    raycaster.setFromCamera(mouse,camera);

    let intersects = raycaster.intersectObjects(pickable);
    if(intersects.length > 0){
        Rec.position.copy(intersects[0].point);
    }
});
$('#intensity').click((e) => {
    R = parseInt($('#intensity').val());

    circle.scale.set(R,R,1);
});
$('#tuggle').click((e) => {
    if(start){
        $('#tuggle').html('start');
        clock.stop();
    }
    else{
        $('#tuggle').html('pause');
        clock.start();
    }
    start = !start;
});
$('#sound').click((e) => {
    soundOpen = !soundOpen;
})

init();
animate();

function init() {
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(divDOM.offsetWidth,divDOM.offsetHeight);
    renderer.setClearColor(0);
    divDOM.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    let x = divDOM.offsetWidth / divDOM.offsetHeight;
    camera = new THREE.OrthographicCamera(-(x * divDOM.offsetHeight * 0.1),(x * divDOM.offsetHeight * 0.1),
        divDOM.offsetHeight * 0.1,-(divDOM.offsetHeight * 0.1),1,1000);
    camera.position.set(0,0,10);

    initScene();

}

function initScene(){
    let walls = [];
    
    for(let i = 0; i < 4; i++)
        walls.push(new THREE.Mesh(new THREE.BoxGeometry(120,1,1), new THREE.MeshBasicMaterial({color: 0x0000ff})));
    walls[0].position.set(0,-60,0);
    walls[1].position.set(60,0,0);
    walls[2].position.set(0,60,0);
    walls[3].position.set(-60,0,0);
    
    walls[1].rotation.z = Math.PI / 2;
    walls[3].rotation.z = Math.PI / 2;
    
    walls.forEach((e) => scene.add(e));


    // ---------------- circle ---------------------

    circle = new THREE.Mesh(new THREE.CircleGeometry(1,32), new THREE.MeshBasicMaterial({color: 0xff0000}));
    circle.scale.set(R,R,1);
    circleVel = new THREE.Vector3(35,37,0);

    scene.add(circle);

    // ------------------ Rec -------------------------
    Rec = new THREE.Mesh(new THREE.BoxGeometry(RecWidth,RecHeight,1), new THREE.MeshBasicMaterial({color: 0x00ff00}));
    Rec.position.set(5,5,0);

    scene.add(Rec);

    // ------------------- plane -------------------------
    let plane = new THREE.Mesh(new THREE.PlaneGeometry(120,120), new THREE.MeshBasicMaterial({opacity: 0.0,transparent: true}));
    scene.add(plane);

    pickable.push(plane);
}

function checkWall(){
    let wallHalfLength = 60;
    let wallScale = 0.5;
    let position = circle.position.clone();

    //console.log(-wallHalfLength + wallScale + R);
    
    if (position.x >= wallHalfLength - wallScale - R && circleVel.x > 0) {
        position.x = wallHalfLength - wallScale - R;
        circleVel.x *= -1;
    }
    if (position.y >= wallHalfLength - wallScale - R && circleVel.y > 0) {
        position.y = wallHalfLength - wallScale - R;
        circleVel.y *= -1;
    }
    if (position.x <= -wallHalfLength + wallScale + R && circleVel.x < 0) {
        position.x = -wallHalfLength + wallScale + R;
        circleVel.x *= -1;
    }
    if (position.y <= -wallHalfLength + wallScale + R && circleVel.y < 0) {
        position.y = -wallHalfLength + wallScale + R;
        circleVel.y *= -1;
    }
}

function animate() {

    if(start){
        let dt = clock.getDelta();

        checkWall();
        circle.position.add(circleVel.clone().multiplyScalar(dt));

        let data = {
            circleR: R,
            circleX: circle.position.x,
            circleY: circle.position.y,
            RecWidth: RecWidth,
            RecHeight: RecHeight,
            RecPosX: Rec.position.x,
            RecPosY: Rec.position.y,
        };

        let param = $.param(data);

        $.get("http://127.0.0.1:1337/api?" + param, (data) => {
            if(data.output == 1){
                resDOM.html('Collision');
                circle.material.color.setHex(0xffff00);
                if(soundOpen)audio.play();
            }
            else {
                resDOM.html('');
                circle.material.color.setHex(0xff0000);
            }
        });
    }
    requestAnimationFrame(animate);
    render();
}

function render(){
    renderer.render(scene,camera);
}