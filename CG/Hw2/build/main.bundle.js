!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=3)}([function(e,n,t){e.exports=t(1)(0)},function(e,n){e.exports=vendor_4dfd63c730cb4831af84},function(e,n,t){e.exports=t(1)(2)},function(e,n,t){"use strict";t.r(n);var r,o=t(0);var i,u,d=t(2),c=t.n(d);r=new o.Scene,(u=new o.WebGLRenderer).setSize(window.innerWidth,window.innerHeight),u.setClearColor(8947848),document.body.appendChild(u.domElement),(i=new o.PerspectiveCamera(50,window.innerWidth/window.innerHeight,10,1e3)).position.set(50,50,50),new c.a(i,u.domElement),r.add(new o.GridHelper(500,50,"red","white")),function e(){requestAnimationFrame(e);u.render(r,i)}()}]);
//# sourceMappingURL=main.bundle.js.map