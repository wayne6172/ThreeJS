import {sceneFromJSON} from "./scene.js";
import {Agent as KillerADO} from "./agent.js";
import {Agent as millieyan} from "./agent2.js";

var camera, renderer;
var agent,agent2;
var countUp;

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
    agent = new KillerADO(new THREE.Vector3(50,0,-50), size);
    agent2 = new millieyan(new THREE.Vector3(50,0,-50), size);
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
  display.textContent = agent.name + ' : ' + agent.score + ' VS ' + agent2.name + ' : ' + agent2.score;

  render();
}

function render() {
  renderer.render(scene, camera);
}
