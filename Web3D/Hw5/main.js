import $ from 'jquery';
import io from 'socket.io-client';
import * as THREE from 'three';
import OrbitControl from 'three-orbitcontrols';
import Car from './Car.js'
import {scene,initScene} from './initScene.js';

// ---------------------- 以下是 socket.io 白版 ---------------//

var ID, cars = [],socket;

$(function() {
    var FADE_TIME = 150; // ms
    var TYPING_TIMER_LENGTH = 400; // ms
    var COLORS = [
      '#e21400', '#91580f', '#f8a700', '#f78b00',
      '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
      '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
  
    // Initialize variables
    var $window = $(window);
    var $usernameInput = $('.usernameInput'); // Input for username
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.inputMessage'); // Input message input box
  
    var $loginPage = $('.login.page'); // The login page
    var $chatPage = $('.chat.page'); // The chatroom page
    var $threeJS = $('.ThreeJS');
  
    // Prompt for setting a username
    var username;
    var connected = false;
    var typing = false;
    var lastTypingTime;
    var $currentInput = $usernameInput.focus();
  
    socket = io();
  
    const addParticipantsMessage = (data) => {
      var message = '';
      if (data.numUsers === 1) {
        message += "there's 1 participant";
      } else {
        message += "there are " + data.numUsers + " participants";
      }
      log(message);
    }
  
    // Sets the client's username
    const setUsername = () => {
      username = cleanInput($usernameInput.val().trim());
  
      // If the username is valid
      if (username) {
        $loginPage.fadeOut();
        $chatPage.show();
        $threeJS.show();
        $loginPage.off('click');
        $currentInput = $inputMessage.focus();
  
        // Tell the server your username
        socket.emit('add user', username);
      }
    }
  
    // Sends a chat message
    const sendMessage = () => {
      var message = $inputMessage.val();
      // Prevent markup from being injected into the message
      message = cleanInput(message);
      // if there is a non-empty message and a socket connection
      if (message && connected) {
        $inputMessage.val('');
        addChatMessage({
          username: username,
          message: message
        });
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', message);
      }
    }
  
    // Log a message
      const log = (message, options) => {
      var $el = $('<li>').addClass('log').text(message);
      addMessageElement($el, options);
    }
  
    // Adds the visual chat message to the message list
    const addChatMessage = (data, options) => {
      // Don't fade the message in if there is an 'X was typing'
      var $typingMessages = getTypingMessages(data);
      options = options || {};
      if ($typingMessages.length !== 0) {
        options.fade = false;
        $typingMessages.remove();
      }
  
      var $usernameDiv = $('<span class="username"/>')
        .text(data.username)
        .css('color', getUsernameColor(data.username));
      var $messageBodyDiv = $('<span class="messageBody">')
        .text(data.message);
  
      var typingClass = data.typing ? 'typing' : '';
      var $messageDiv = $('<li class="message"/>')
        .data('username', data.username)
        .addClass(typingClass)
        .append($usernameDiv, $messageBodyDiv);
  
      addMessageElement($messageDiv, options);
    }
  
    // Adds the visual chat typing message
    const addChatTyping = (data) => {
      data.typing = true;
      data.message = 'is typing';
      addChatMessage(data);
    }
  
    // Removes the visual chat typing message
    const removeChatTyping = (data) => {
      getTypingMessages(data).fadeOut(function () {
        $(this).remove();
      });
    }
  
    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
    const addMessageElement = (el, options) => {
      var $el = $(el);
  
      // Setup default options
      if (!options) {
        options = {};
      }
      if (typeof options.fade === 'undefined') {
        options.fade = true;
      }
      if (typeof options.prepend === 'undefined') {
        options.prepend = false;
      }
  
      // Apply options
      if (options.fade) {
        $el.hide().fadeIn(FADE_TIME);
      }
      if (options.prepend) {
        $messages.prepend($el);
      } else {
        $messages.append($el);
      }
      $messages[0].scrollTop = $messages[0].scrollHeight;
    }
  
    // Prevents input from having injected markup
    const cleanInput = (input) => {
      return $('<div/>').text(input).html();
    }
  
    // Updates the typing event
    const updateTyping = () => {
      if (connected) {
        if (!typing) {
          typing = true;
          socket.emit('typing');
        }
        lastTypingTime = (new Date()).getTime();
  
        setTimeout(() => {
          var typingTimer = (new Date()).getTime();
          var timeDiff = typingTimer - lastTypingTime;
          if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
            socket.emit('stop typing');
            typing = false;
          }
        }, TYPING_TIMER_LENGTH);
      }
    }
  
    // Gets the 'X is typing' messages of a user
    const getTypingMessages = (data) => {
      return $('.typing.message').filter(function (i) {
        return $(this).data('username') === data.username;
      });
    }
  
    // Gets the color of a username through our hash function
    const getUsernameColor = (username) => {
      // Compute hash code
      var hash = 7;
      for (var i = 0; i < username.length; i++) {
         hash = username.charCodeAt(i) + (hash << 5) - hash;
      }
      // Calculate color
      var index = Math.abs(hash % COLORS.length);
      return COLORS[index];
    }
  
    // Keyboard events
    $window.keydown((event) => {
      // Auto-focus the current input when a key is typed
      if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        $currentInput.focus();
      }
      // When the client hits ENTER on their keyboard
      console.log(event.which);
      if (event.which === 13) {
        if (username) {
          sendMessage();
          socket.emit('stop typing');
          typing = false;
        } else {
          setUsername();
        }
      }
    });
  
    $inputMessage.on('input', () => {
      updateTyping();
    });
  
    // Click events
  
    // Focus input when clicking anywhere on login page
    $loginPage.click(() => {
      $currentInput.focus();
    });
  
    // Focus input when clicking on the message input's border
    $inputMessage.click(() => {
      $inputMessage.focus();
    });
  
    // Socket events
  
    // Whenever the server emits 'login', log the login message
    socket.on('login', (data) => {
      connected = true;
      // Display the welcome message
      var message = "Welcome to Socket.IO Chat – ";
      log(message, {
        prepend: true
      });
      addParticipantsMessage(data);
      data.playData.forEach((e) => {

        if(e.ID === data.ID)
          cars.push(new Car(e,camera,cameraLB));
        else
          cars.push(new Car(e));
      });

      ID = data.ID;
      animate();
    });
  
    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', (data) => {
      addChatMessage(data);
    });
  
    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', (data) => {
      log(data.username + ' joined');
      addParticipantsMessage(data);
      cars.push(new Car(data.playData));
    });
  
    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', (data) => {
      log(data.username + ' left');
      addParticipantsMessage(data);
      removeChatTyping(data);
    });
  
    // Whenever the server emits 'typing', show the typing message
    socket.on('typing', (data) => {
      addChatTyping(data);
    });
  
    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', (data) => {
      removeChatTyping(data);
    });
  
    socket.on('disconnect', () => {
      log('you have been disconnected');
    });
  
    socket.on('reconnect', () => {
      log('you have been reconnected');
      if (username) {
        socket.emit('add user', username);
      }
    });
  
    socket.on('reconnect_error', () => {
      log('attempt to reconnect has failed');
    });
    

});

// ------------------------- 以下是 ThreeJS --------------------//

var renderer, camera, controls, cameraHUD, cameraLB, sceneRTT, cameraRTT;
var ThreeDOM = document.getElementById('ThreeJS');
var renderTarget;

init();

function init(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(ThreeDOM.offsetWidth,ThreeDOM.offsetHeight);
    //console.log(ThreeDOM.offsetHeight);
    renderer.setClearColor(0x888888);
    renderer.autoClear = false;

    document.getElementById('ThreeJS').appendChild(renderer.domElement);

    initScene();
    sceneRTT = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(35,ThreeDOM.offsetWidth / ThreeDOM.offsetHeight, 1, 1000);
    camera.position.set(-50,15,0);
    camera.lookAt(new THREE.Vector3());

    let aspect = ThreeDOM.offsetWidth / ThreeDOM.offsetHeight;
    cameraHUD = new THREE.OrthographicCamera(aspect * -90, aspect * 90, 90, -90, 1, 1000);
    cameraHUD.position.set(0,50,0);
    cameraHUD.lookAt(new THREE.Vector3());

    cameraRTT = new THREE.OrthographicCamera(aspect * -90, aspect * 90, 90, -90, 1, 1000);

    renderTarget = new THREE.WebGLRenderTarget(ThreeDOM.offsetWidth * 0.25, ThreeDOM.offsetHeight * 0.25, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat
    });

    cameraLB = new THREE.PerspectiveCamera(35, aspect, 1, 1000);
    let plane = new THREE.Mesh(new THREE.PlaneGeometry(aspect * 60, 60), new THREE.MeshBasicMaterial({
      map: renderTarget.texture,
      side: THREE.DoubleSide
    }))
    plane.rotation.y = Math.PI;
    sceneRTT.add(plane);
    

    scene.add(new THREE.GridHelper(500,50,'red','white'));

    controls = new OrbitControl(camera,renderer.domElement);

    scene.add(new THREE.AmbientLight(0x888888));
}

function animate(){
    cars[ID - 1].update(0);
    socket.emit('update',{
      ID: ID,
      pos: {
        x: cars[ID - 1].body.position.x,
        y: cars[ID - 1].body.position.y,
        z: cars[ID - 1].body.position.z
      },
      rot: cars[ID - 1].body.rotation.y,
      frontRot: cars[ID - 1].turn.rotation.y
    }
    ,(data) => {
      data.forEach((e) => {
        if(e.ID !== ID){
          //console.log(e.ID - 1 + ' ' + cars[e.ID - 1].turn.rotation.y);
          cars[e.ID - 1].body.position.x = e.pos.x;
          cars[e.ID - 1].body.position.y = e.pos.y;
          cars[e.ID - 1].body.position.z = e.pos.z;
          cars[e.ID - 1].body.rotation.y = e.rot;
          cars[e.ID - 1].turn.rotation.y = e.frontRot;
        }
      })
    });

    requestAnimationFrame(animate);
    render();
}


function render(){
  var ww = ThreeDOM.offsetWidth;
  var hh = ThreeDOM.offsetHeight;

  renderer.setScissorTest(true);
  renderer.setViewport(0, 0, ww, hh);
  renderer.setScissor(0, 0, ww, hh);
  renderer.clear();
  renderer.render(scene, camera);

  renderer.setViewport(ww / 4 * 3, hh / 4 * 3, ww / 4, hh / 4);
  renderer.setScissor(ww / 4 * 3, hh / 4 * 3, ww / 4, hh / 4);
  renderer.clear();

  renderer.render(scene,cameraHUD);

  renderer.setViewport(0, 0, ww / 4, hh / 4);
  renderer.setScissor(0, 0, ww / 4, hh / 4);
  renderer.clear();

  renderer.setRenderTarget(renderTarget);
  renderer.render(scene,cameraLB);
  renderer.setRenderTarget(null);
  renderer.render(sceneRTT,cameraRTT);

  renderer.setScissorTest(false);
}
  