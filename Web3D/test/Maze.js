import * as THREE from 'three'
import {scene} from './initScene.js'

class Maze{
    // 製作一個M X N的迷宮，每個寬度為width，牆壁厚度為thickness，其高度為wallHeight
    constructor(m,n,width,thickness,wallHeight){
        this.row = [];
        this.col = [];
        this.wall = [];

        this.initMaze(m,n,width,thickness,wallHeight);
    }

    initMaze(m,n,width,thickness,wallHeight){
        this.initData(m,n);

        var totalinWall = new THREE.Object3D();
        var mat = new THREE.MeshNormalMaterial();
        var insideWall = new THREE.Mesh(new THREE.BoxGeometry(width, wallHeight, thickness), mat);
        
        var topWall = new THREE.Mesh(new THREE.BoxGeometry(n * width,wallHeight,thickness),mat);
        var bottomWall = topWall.clone();
        var leftWall = new THREE.Mesh(new THREE.BoxGeometry(thickness,wallHeight,m * width),mat);
        var rightWall = leftWall.clone();

        topWall.position.set(n * width / 2,wallHeight / 2,0);
        bottomWall.position.set(n * width / 2,wallHeight / 2,m * width);
        leftWall.position.set(0,wallHeight / 2,m * width / 2);
        rightWall.position.set(n * width, wallHeight / 2, m * width / 2);

        scene.add(topWall,bottomWall,leftWall,rightWall);
        this.wall.push(topWall,bottomWall,leftWall,rightWall);

        var i;
        ///////////row/////////////
        for (i = 0; i < this.row.length; i++) {
            let wallclone = insideWall.clone();
            wallclone.position.x = (this.row[i][1]) * width;
            wallclone.position.z = this.row[i][0] * width + (width / 2);
            wallclone.position.y = wallHeight / 2;
            wallclone.rotation.y = Math.PI / 2;
            this.wall.push(wallclone);
            scene.add(wallclone);
        }
        ////////////////col/////////////////////  
        for (i = 0; i < this.col.length; i++) {
            let wallclone = insideWall.clone();
            wallclone.position.z = (this.col[i][1]) * width;
            wallclone.position.x = this.col[i][0] * width + (width / 2);
            wallclone.position.y = wallHeight / 2;
            //wallclone.rotation.y = Math.PI/2;
            this.wall.push(wallclone);
            scene.add(wallclone);
        }
    }

    // use kruskal's algorithm
    initData(m,n){
        var sets = [];
        var walls = [];

        for(let i = 0; i < m * n; i++)
            sets.push(i);
        
        for(let i = 0; i < m; i++){
            for(let j = 1; j < n; j++){
                walls.push([0,i,j]);
            }
        }

        for(let i = 0; i < n; i++){
            for(let j = 1; j < m; j++){
                walls.push([1,i,j]);
            }
        }

        while(walls.length > 0){
            let choose = Math.floor((walls.length * Math.random()));
            let a,b;

            //console.log('walls length: ' + walls.length);
            //console.log('choose:' + choose);
            if(walls[choose][0] === 0){
                a = walls[choose][1] * n + walls[choose][2] - 1;
                b = walls[choose][1] * n + walls[choose][2];
            }
            else {
                a = (walls[choose][2] - 1) * n + walls[choose][1];
                b = walls[choose][2] * n + walls[choose][1];
            }

            if(!Union_set(a,b)){
                if(walls[choose][0] === 0)
                    this.row.push([walls[choose][1],walls[choose][2]]);
                else
                    this.col.push([walls[choose][1],walls[choose][2]]);
            }
            
            let temp = walls[choose];
            walls[choose] = walls[walls.length - 1];
            walls[walls.length - 1] = temp;

            walls.pop();
        }


        function Union_set(x,y){
            var a = find(x);
            var b = find(y);

            if(a !== b){
                sets[b] = a;
                return true;
            }
            else return false;
        }

        function find(n){
            if(n == sets[n])
                return n;
            return sets[n] = find(sets[n]);
        }
    }
}

export {Maze}