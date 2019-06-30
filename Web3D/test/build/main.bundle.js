!function(t){var e={};function i(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=3)}([function(t,e,i){t.exports=i(1)(0)},function(t,e){t.exports=vendor_99ce509b92924a7ce61e},function(t,e,i){t.exports=i(1)(2)},function(t,e,i){"use strict";i.r(e);var n,o=i(0);i(2);function r(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}var s,a,h,l,p=function(){function t(e,i,n,o,r){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.m=e,this.n=i,this.width=n,this.thickness=o,this.wallHeight=r,this.row=[],this.col=[],this.wall=[],this.graph=[],this.initMaze(e,i,n,o,r),console.log(this.graph)}var e,i,s;return e=t,(i=[{key:"initMaze",value:function(t,e,i,r,s){this.initData(t,e);new o.Mesh(new o.BoxGeometry(i,s,r),new o.MeshNormalMaterial);var a,h=new o.Mesh(new o.BoxGeometry(e*i,s,r),new o.MeshNormalMaterial),l=new o.Mesh(new o.BoxGeometry(e*i,s,r),new o.MeshNormalMaterial),p=new o.Mesh(new o.BoxGeometry(r,s,t*i),new o.MeshNormalMaterial),u=new o.Mesh(new o.BoxGeometry(r,s,t*i),new o.MeshNormalMaterial);for(h.position.set(e*i/2,s/2,0),l.position.set(e*i/2,s/2,t*i),p.position.set(0,s/2,t*i/2),u.position.set(e*i,s/2,t*i/2),n.add(h,l,p,u),this.wall.push(h,l,p,u),a=0;a<t*e;a++){var w=[];a-e>=0&&w.push(a-e),a%e!=0&&w.push(a-1),(a+1)%e!=0&&w.push(a+1),a+e<t*e&&w.push(a+e),this.graph.push(w)}for(a=0;a<this.row.length;a++){var c=new o.Mesh(new o.BoxGeometry(i,s,r),new o.MeshNormalMaterial);c.position.x=this.row[a][1]*i,c.position.z=this.row[a][0]*i+i/2,c.position.y=s/2,c.rotation.y=Math.PI/2;var f=this.row[a][1]-1+e*this.row[a][0],d=this.row[a][1]+e*this.row[a][0];c.mazeData={isRow:!0,frontPoint:f,nextPoint:d},this.wall.push(c),n.add(c),this.graph[f].splice(this.graph[f].indexOf(d),1),this.graph[d].splice(this.graph[d].indexOf(f),1)}for(a=0;a<this.col.length;a++){var v=new o.Mesh(new o.BoxGeometry(i,s,r),new o.MeshNormalMaterial);v.position.z=this.col[a][1]*i,v.position.x=this.col[a][0]*i+i/2,v.position.y=s/2;var g=(this.col[a][1]-1)*e+this.col[a][0],m=this.col[a][1]*e+this.col[a][0];v.mazeData={isRow:!1,frontPoint:g,nextPoint:m},this.wall.push(v),n.add(v),this.graph[g].splice(this.graph[g].indexOf(m),1),this.graph[m].splice(this.graph[m].indexOf(g),1)}}},{key:"initData",value:function(t,e){for(var i=[],n=[],o=0;o<t*e;o++)i.push(o);for(var r=0;r<t;r++)for(var s=1;s<e;s++)n.push([0,r,s]);for(var a=0;a<e;a++)for(var h=1;h<t;h++)n.push([1,a,h]);for(;n.length>0;){var l=Math.floor(n.length*Math.random()),p=void 0,u=void 0;0===n[l][0]?(p=n[l][1]*e+n[l][2]-1,u=n[l][1]*e+n[l][2]):(p=(n[l][2]-1)*e+n[l][1],u=n[l][2]*e+n[l][1]),-1!==i[p]&&-1!==i[u]&&c(p,u)||(0===n[l][0]?this.row.push([n[l][1],n[l][2]]):this.col.push([n[l][1],n[l][2]]));var w=n[l];n[l]=n[n.length-1],n[n.length-1]=w,n.pop()}function c(t,e){var n=f(t),o=f(e);return n!==o&&(i[o]=n,!0)}function f(t){return t==i[t]?t:i[t]=f(i[t])}}},{key:"removeWall",value:function(t){var e=t.frontPoint,i=t.nextPoint,r=Math.floor(e/this.n),s=e%this.n+1;if(i-e==1){var a;for(a=0;a<this.row.length&&(this.row[a][0]!==r||this.row[a][1]!==s);a++);this.row.splice(a,1)}else{var h;for(h=0;h<this.col.length&&(this.col[h][0]!==r||this.col[h][1]!==s);h++);this.col.splice(h,1)}this.graph[e].push(i),this.graph[i].push(e);for(var l=e,p=[],u=0;u<this.graph[e].length;u++){var w=y(this.graph,e,this.graph[e][u]);if(-1!==w){p.push(w);break}}var c=Math.floor(p.length*Math.random());if(c+1===p.length?(e=p[c],i=p[0]):(e=p[c],i=p[c+1]),e>i){var f=e;e=i,i=f}this.graph[e].splice(this.graph[e].indexOf(i),1),this.graph[i].splice(this.graph[i].indexOf(e),1);var d=new o.Mesh(new o.BoxGeometry(this.width,this.wallHeight,this.thickness),new o.MeshNormalMaterial);if(i-e==1){var v=Math.floor(e/this.n),g=e%this.n+1;this.row.push([v,g]),d.position.x=g*this.width,d.position.z=v*this.width+this.width/2,d.position.y=this.wallHeight/2,d.rotation.y=Math.PI/2,d.mazeData={isRow:!0,frontPoint:e,nextPoint:i}}else{var m=e%this.n,M=Math.floor(e/this.n)+1;this.col.push([m,M]),d.position.z=M*this.width,d.position.x=m*this.width+this.width/2,d.position.y=this.wallHeight/2,d.mazeData={isRow:!1,frontPoint:e,nextPoint:i}}function y(t,e,i){if(i===l)return i;for(var n=0;n<t[i].length;n++)if(t[i][n]!==e){var o=y(t,i,t[i][n]);if(-1!==o)return p.push(o),i}return-1}n.add(d),this.wall.push(d)}}])&&r(e.prototype,i),s&&r(e,s),t}(),u=new o.Raycaster,w=new o.Vector2,c=[];window.addEventListener("resize",function(){var t=window.innerWidth,e=window.innerHeight;s.aspect=t/e,s.updateProjectionMatrix(),a.setSize(t,e)},!1),document.addEventListener("mousedown",function(t){t.preventDefault(),w.x=t.clientX/window.innerWidth*2-1,w.y=-t.clientY/window.innerHeight*2+1,u.setFromCamera(w,s);var e=u.intersectObjects(c);e.length>0&&(console.log(e[0]),"mazeData"in e[0].object&&(n.remove(e[0].object),l.removeWall(e[0].object.mazeData)))},!1),n=new o.Scene,h=new o.Clock,(s=new o.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,1e4)).position.set(250,750,250),s.lookAt(new o.Vector3(250,0,250)),n.add(s),new o.GridHelper(500,10,"red","white").position.set(250,0,250),n.add(new o.AxisHelper(50)),(a=new o.WebGLRenderer).setSize(window.innerWidth,window.innerHeight),a.setClearColor(8947848),document.body.appendChild(a.domElement),(l=new p(10,10,50,5,50)).wall.forEach(function(t){c.push(t)}),function t(){h.getDelta();requestAnimationFrame(t);a.render(n,s)}()}]);
//# sourceMappingURL=main.bundle.js.map