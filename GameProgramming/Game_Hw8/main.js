import {sceneFromJSON} from "./scene.js";
import {Agent as KillerADO} from "./agent.js";
import {Agent as thespecialisme} from "./agent2.js";
import {scene, initThree} from "./threemain.js";

var camera, renderer;
var agent,agent2;

// program starts here ...
init();
animate();

function init() {

  initThree();
  
  //scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.z = 500;
  camera.position.y = 400;


  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x888888);

  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  document.body.appendChild(renderer.domElement);

  /////////////////////////////////////////////////////////////////////

  
  // scene grid [-400,400]x[-400,400]
  var gridXZ = new THREE.GridHelper(800, 80, 'red', 'white');
  scene.add(gridXZ);

  // in scene.js
  sceneFromJSON ( );  // using LevelDesigner
  
  //////////////////////////////////////////////////////////////////////////	
  	let size = 10; // halfsize of agent
//    agent = new Agent(new THREE.Vector3(-400 + 400 * Math.random(), 0, -400 + 400 * Math.random()), mesh);
    agent = new KillerADO(randomStart(), size);
    agent2 = new thespecialisme(randomStart(), size);

    agent.setEnemy(agent2);
    agent2.setEnemy(agent);
}

function randomStart() {
    var pos = new THREE.Vector3();
    var done = false;

    do{
        pos.x = -400 + Math.random() * 800; pos.y = 0;
        pos.z = -400 + Math.random() * 800;
        for(var i = 0; i < scene.obstacles.length; i++){
            if(scene.obstacles[i].center.distanceTo(pos) < scene.obstacles[i].size)
                break;
        }

        if(i === scene.obstacles.length)
            done = true;
    }while(!done);
    return pos;
}


function animate() {

  agent.update(0.01);
  agent2.update(0.01);

  // check agent crossing obstacles ...
  scene.obstacles.forEach ( function (obs) { obs.checkCollision (agent)} );

  if (scene.targets.length > 0)
  	requestAnimationFrame(animate);
  else {
      alert('game over');
  }

  let display = document.querySelector("#score");
  display.textContent = `${agent.name} : ${agent.score} VS ${agent2.name} : ${agent2.score}`;

  render();
}

function render() {
  renderer.render(scene, camera);
}
