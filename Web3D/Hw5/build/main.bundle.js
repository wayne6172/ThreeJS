!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=5)}([function(e,t,n){e.exports=n(2)(12)},function(e,t,n){e.exports=n(2)(54)},function(e,t){e.exports=vendor_ce05ef063212faaa23e1},function(e,t,n){e.exports=n(2)(28)},function(e,t,n){e.exports=n(2)(27)},function(e,t,n){"use strict";n.r(t);var o,r=n(1),i=n.n(r),s=n(3),a=n.n(s),c=n(0),u=n(4),d=n.n(u);function p(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var f,l,h,y,m,w,g,v,b=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.body=this.buildBody(),this.turn=new c.Object3D,this.turn.position.set(19,0,0),this.turn.add(this.tireBody3,new c.AxesHelper(18)),n&&(this.body.add(n,r),r.position.set(19,5,-10),r.add(new c.AxesHelper(15)),r.lookAt(new c.Vector3(0,0,-14))),this.body.add(this.turn),this.body.position.set(t.pos.x,t.pos.y,t.pos.z),this.turn.rotation.y=t.frontRot,this.body.rotation.y=t.rot,this.body.position.y=5,o.add(this.body)}var t,n,r;return t=e,(n=[{key:"update",value:function(e){this.turn.rotation.y+=.05}},{key:"buildBody",value:function(){var e,t=new c.Geometry;t.vertices.push(new c.Vector3(0,10,0),new c.Vector3(-5,0,-7.5),new c.Vector3(-5,0,7.5),new c.Vector3(19,0,0)),e=new c.Face3(0,1,2),t.faces.push(e),e=new c.Face3(0,3,1),t.faces.push(e),e=new c.Face3(0,2,3),t.faces.push(e),e=new c.Face3(1,3,2),t.faces.push(e),t.computeBoundingSphere(),t.computeFaceNormals(),t.computeVertexNormals();var n=new c.Mesh(t,new c.MeshNormalMaterial({color:255}));n.add(new c.AxesHelper(10));var o=new c.TextureLoader;o.crossOrigin="";var r=o.load("https://i.imgur.com/jPX4y1n.png?1"),i=o.load("https://i.imgur.com/21rKfjX.jpg?2");i.wrapS=c.RepeatWrapping,i.repeat.set(6,1),this.tireBody=new c.Object3D;var s=new c.Mesh(new c.CircleGeometry(5,64),new c.MeshPhongMaterial({map:r,transparent:!0,side:c.DoubleSide})),a=new c.Mesh(new c.CircleGeometry(5,64),new c.MeshPhongMaterial({map:r,transparent:!0,side:c.DoubleSide})),u=new c.Mesh(new c.CylinderGeometry(5,5,4,64,1,!0),new c.MeshPhongMaterial({map:i,side:c.DoubleSide}));return s.position.set(0,0,2),a.position.set(0,0,-2),u.rotation.x=Math.PI/2,this.tireBody.add(s,a,u,new c.AxesHelper(10)),this.tireBody.position.set(-5,0,-7.5),this.tireBody2=this.tireBody.clone(),this.tireBody2.position.set(-5,0,7.5),this.tireBody3=this.tireBody.clone(),this.tireBody3.position.set(0,0,0),n.add(this.tireBody,this.tireBody2),n}}])&&p(t.prototype,n),r&&p(t,r),e}(),x=[];i()(function(){var e,t,n=["#e21400","#91580f","#f8a700","#f78b00","#58dc00","#287b00","#a8f07a","#4ae8c4","#3b88eb","#3824aa","#a700ff","#d300e7"],o=i()(window),r=i()(".usernameInput"),s=i()(".messages"),c=i()(".inputMessage"),u=i()(".login.page"),d=i()(".chat.page"),p=i()(".ThreeJS"),h=!1,m=!1,g=r.focus();l=a()();var v=function(e){var t="";1===e.numUsers?t+="there's 1 participant":t+="there are "+e.numUsers+" participants",M(t)},M=function(e,t){var n=i()("<li>").addClass("log").text(e);I(n,t)},S=function(e,t){var n=O(e);t=t||{},0!==n.length&&(t.fade=!1,n.remove());var o=i()('<span class="username"/>').text(e.username).css("color",T(e.username)),r=i()('<span class="messageBody">').text(e.message),s=e.typing?"typing":"",a=i()('<li class="message"/>').data("username",e.username).addClass(s).append(o,r);I(a,t)},D=function(e){O(e).fadeOut(function(){i()(this).remove()})},I=function(e,t){var n=i()(e);t||(t={}),void 0===t.fade&&(t.fade=!0),void 0===t.prepend&&(t.prepend=!1),t.fade&&n.hide().fadeIn(150),t.prepend?s.prepend(n):s.append(n),s[0].scrollTop=s[0].scrollHeight},C=function(e){return i()("<div/>").text(e).html()},O=function(e){return i()(".typing.message").filter(function(t){return i()(this).data("username")===e.username})},T=function(e){for(var t=7,o=0;o<e.length;o++)t=e.charCodeAt(o)+(t<<5)-t;var r=Math.abs(t%n.length);return n[r]};o.keydown(function(t){var n;t.ctrlKey||t.metaKey||t.altKey||g.focus(),console.log(t.which),13===t.which&&(e?(n=c.val(),(n=C(n))&&h&&(c.val(""),S({username:e,message:n}),l.emit("new message",n)),l.emit("stop typing"),m=!1):(e=C(r.val().trim()))&&(u.fadeOut(),d.show(),p.show(),u.off("click"),g=c.focus(),l.emit("add user",e)))}),c.on("input",function(){h&&(m||(m=!0,l.emit("typing")),t=(new Date).getTime(),setTimeout(function(){(new Date).getTime()-t>=400&&m&&(l.emit("stop typing"),m=!1)},400))}),u.click(function(){g.focus()}),c.click(function(){c.focus()}),l.on("login",function(e){h=!0;M("Welcome to Socket.IO Chat – ",{prepend:!0}),v(e),e.playData.forEach(function(t){t.ID===e.ID?x.push(new b(t,y,w)):x.push(new b(t))}),f=e.ID,B()}),l.on("new message",function(e){S(e)}),l.on("user joined",function(e){M(e.username+" joined"),v(e),x.push(new b(e.playData))}),l.on("user left",function(e){M(e.username+" left"),v(e),D(e)}),l.on("typing",function(e){!function(e){e.typing=!0,e.message="is typing",S(e)}(e)}),l.on("stop typing",function(e){D(e)}),l.on("disconnect",function(){M("you have been disconnected")}),l.on("reconnect",function(){M("you have been reconnected"),e&&l.emit("add user",e)}),l.on("reconnect_error",function(){M("attempt to reconnect has failed")})});var M,S=document.getElementById("ThreeJS");function B(){var e,t;x[f-1].update(0),l.emit("update",{ID:f,pos:{x:x[f-1].body.position.x,y:x[f-1].body.position.y,z:x[f-1].body.position.z},rot:x[f-1].body.rotation.y,frontRot:x[f-1].turn.rotation.y},function(e){e.forEach(function(e){e.ID!==f&&(x[e.ID-1].body.position.x=e.pos.x,x[e.ID-1].body.position.y=e.pos.y,x[e.ID-1].body.position.z=e.pos.z,x[e.ID-1].body.rotation.y=e.rot,x[e.ID-1].turn.rotation.y=e.frontRot)})}),requestAnimationFrame(B),e=S.offsetWidth,t=S.offsetHeight,h.setScissorTest(!0),h.setViewport(0,0,e,t),h.setScissor(0,0,e,t),h.clear(),h.render(o,y),h.setViewport(e/4*3,t/4*3,e/4,t/4),h.setScissor(e/4*3,t/4*3,e/4,t/4),h.clear(),h.render(o,m),h.setViewport(0,0,e/4,t/4),h.setScissor(0,0,e/4,t/4),h.clear(),h.setRenderTarget(M),h.render(o,w),h.setRenderTarget(null),h.render(g,v),h.setScissorTest(!1)}!function(){(h=new c.WebGLRenderer).setSize(S.offsetWidth,S.offsetHeight),h.setClearColor(8947848),h.autoClear=!1,document.getElementById("ThreeJS").appendChild(h.domElement),o=new c.Scene,g=new c.Scene,(y=new c.PerspectiveCamera(35,S.offsetWidth/S.offsetHeight,1,1e3)).position.set(-50,15,0),y.lookAt(new c.Vector3);var e=S.offsetWidth/S.offsetHeight;(m=new c.OrthographicCamera(-90*e,90*e,90,-90,1,1e3)).position.set(0,50,0),m.lookAt(new c.Vector3),v=new c.OrthographicCamera(-90*e,90*e,90,-90,1,1e3),M=new c.WebGLRenderTarget(.25*S.offsetWidth,.25*S.offsetHeight,{minFilter:c.LinearFilter,magFilter:c.NearestFilter,format:c.RGBFormat}),w=new c.PerspectiveCamera(35,e,1,1e3);var t=new c.Mesh(new c.PlaneGeometry(60*e,60),new c.MeshBasicMaterial({map:M.texture,side:c.DoubleSide}));t.rotation.y=Math.PI,g.add(t),o.add(new c.GridHelper(500,50,"red","white")),new d.a(y,h.domElement),o.add(new c.AmbientLight(8947848))}()}]);
//# sourceMappingURL=main.bundle.js.map