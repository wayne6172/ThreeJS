import {scene} from "./threemain.js"

function agentMesh (size, colorName='red') {
	// mesh facing +x
	let geometry = new THREE.Geometry();
	  geometry.vertices.push (new THREE.Vector3(3*size,0,0))
	  geometry.vertices.push (new THREE.Vector3(0,0,-size))
	  geometry.vertices.push (new THREE.Vector3(0,0,size))
	  geometry.vertices.push (new THREE.Vector3(0,size,0))
  
	  geometry.faces.push(new THREE.Face3(0, 3, 2));
	  geometry.faces.push(new THREE.Face3(0, 2, 1));
	  geometry.faces.push(new THREE.Face3(1, 3, 0));
	  geometry.faces.push(new THREE.Face3(1, 2, 3));
	  geometry.computeFaceNormals()
	
	return new THREE.Mesh (geometry, 
	     new THREE.MeshBasicMaterial({color:colorName, wireframe:true}))  
}

class Agent {
  constructor(pos, halfSize) {
  	this.name = "Killer ADO";
    this.pos = pos.clone();
    this.vel = new THREE.Vector3();
    this.force = new THREE.Vector3();
    this.target = null;
    this.halfSize = halfSize;  // half width
    this.mesh = agentMesh (this.halfSize, 'blue');
    this.MAXSPEED = 2500;
    this.ARRIVAL_R = 10;
    
    this.score = 0;
    
    // for orientable agent
    this.angle = 0;
    scene.add (this.mesh);
  }
  
  update(dt) {
  
  	// about target ...
  	if (this.target === null || this.target.found === true) {  // no more target OR target found by other agent
  	  console.log ('find target');
  		this.findTarget();
  		return;  // wait for next turn ...
  	}

    this.accumulateForce();
    
    // collision
    // for all obstacles in the scene
    let obs = scene.obstacles;

    // pick the most threatening one
    // apply the repulsive force
    // ----------------------------------(write your code here)----------------------------------

	
      let projMin = Infinity, danger = 0;
      for(let i = 0; i < scene.obstacles.length; i++){
          let vhat = this.vel.clone().normalize();
          let point = scene.obstacles[i].center.clone().sub(this.pos);// c-p
          let proj = point.dot(vhat);
          const REACH = Math.max(this.vel.length() * 0.2,20);

          if (proj > 0 && proj < REACH) {
              let perp = new THREE.Vector3();
              perp.subVectors(point, vhat.clone().setLength(proj));
              let overlap = scene.obstacles[i].size + this.halfSize - perp.length();
              console.log(i + ' :' + overlap);
              if (overlap > 0) {
                  if(projMin > proj) {
                      console.log('get');
                      projMin = proj;
                      danger = i;
                  }
              }
          }
      }

      let vhat = this.vel.clone().normalize();
      let point = scene.obstacles[danger].center.clone().sub (this.pos); // c-p
      let proj  = point.dot(vhat);
      const REACH = Math.max(this.vel.length() * 0.2,20);
      const K = Math.max(this.vel.length() * 0.5,100);

      if (proj > 0 && proj < REACH) {
          let perp = new THREE.Vector3();
          perp.subVectors (point, vhat.clone().setLength(proj));
          let overlap = scene.obstacles[danger].size + this.halfSize - perp.length();
          if (overlap > 0) {
              perp.setLength (K*overlap);
              perp.negate();
              this.force.add (perp);
              console.log ("hit:", perp);
          }
      }





	// Euler's method       
    this.vel.add(this.force.clone().multiplyScalar(dt));

	this.ARRIVAL_R = Math.max(10, this.vel.length() * 0.175);
    // velocity modulation
    let diff = this.target.pos.clone().sub(this.pos)
    let dst = diff.length();
    if (dst < this.ARRIVAL_R) {
      this.vel.setLength(Math.max(dst,15));
      const REACH_TARGET = 5;
      if (dst < REACH_TARGET) {// target reached
      	console.log ('target reached');
         this.target.setFound (this);
         this.target = null;
      }
    }
    
    // Euler
    this.pos.add(this.vel.clone().multiplyScalar(dt))
    this.mesh.position.copy(this.pos)
    
    // for orientable agent
    // non PD version
    if (this.vel.length() > 0.1) {
	    	this.angle = Math.atan2 (-this.vel.z, this.vel.x)
    		this.mesh.rotation.y = this.angle
   	}
  }

  findTarget () {
  	console.log ('total: ' + scene.targets.length)
  	let allTargets = scene.targets;
  	let minD = 1e10;
  	let d;
  	for (let i = 0; i < allTargets.length; i++) {
  		d = this.pos.distanceTo (allTargets[i].pos)
  		if (d < minD) {
  			minD = d;
  			this.setTarget (allTargets[i])
  		}
  	}
  }
  
  setTarget(target) {
    this.target = target;
  }
  targetInducedForce(targetPos) {
    return targetPos.clone().sub(this.pos).normalize().multiplyScalar(this.MAXSPEED).sub(this.vel)
  }
  setEnemy(otherAgent){
      this.enemy = otherAgent;
  }

  accumulateForce() {
      // seek
      this.force.copy(this.targetInducedForce(this.target.pos));

      let push = new THREE.Vector3();
      let point = this.pos.clone().sub(this.enemy.pos);
      let d = point.length();
      if(d < 50){
          push.add(point.setLength(250 / d));
          this.force.add(push);
      }
  }

}
export {Agent}