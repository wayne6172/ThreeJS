import {scene,postMessage} from "./threemain.js";

class Target {
	constructor (id, pos) {
		this.id = id;
		this.pos = pos.clone();
		this.mesh = new THREE.Mesh (new THREE.CylinderGeometry (8,8,3,20), 
		    new THREE.MeshBasicMaterial ({color:'yellow'}));
		this.found = false;  // default: not found yet
		this.mesh.position.copy (pos)
		scene.add (this.mesh);
	}
	setFound (agent) {
		this.found = true;
		this.mesh.material.visible = false;
		postMessage (agent, 'TARGET reached');
		
		agent.score += 10;			
		
		// remove from scene.targets
		for (let i = 0; i < scene.targets.length; i++) {
			if (scene.targets[i].id === this.id) scene.targets.splice (i, 1)
		}
		
	}
	
}

export {Target}