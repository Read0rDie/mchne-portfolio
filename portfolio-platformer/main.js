import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const debugMode = true;
const movementSpeedFactor = 0.1;

var shiftLeft = false;
var shiftRight = false;
var shiftUp = false;
var shiftDown = false;

document.addEventListener('keydown', (e) => {
  moveSphere(e);
});

document.addEventListener('keyup', (e) => {
  stopSphere(e);
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 5000);
camera.position.y += 10;
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#platform-bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window. innerHeight);
camera.position.setZ(30);
renderer.render(scene,camera);

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100)
const material = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh( geometry, material);
scene.add(torus);

const sphereGeo = new THREE.SphereGeometry(3)
const sphere = new THREE.Mesh( sphereGeo, material);
scene.add(sphere);

const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(10,10,10);
const ambientLight =  new THREE.AmbientLight(0x404040,100);
scene.add(pointLight, ambientLight);



if(debugMode){
  const lightHelper = new THREE.PointLightHelper(pointLight);
  const gridhelper = new THREE.GridHelper(200, 50);
  scene.add(lightHelper, gridhelper);
}

const controls = new OrbitControls(camera, renderer.domElement)

function moveSphere(e){
  switch(e.code) {
    case 'ArrowUp':
      shiftUp = true
      break;
    case 'ArrowDown':
      shiftDown = true
      break;
    case 'ArrowLeft':
      shiftLeft = true
      break;
    case 'ArrowRight':
      shiftRight = true
      break;
  }
}

function stopSphere(e){
  switch(e.code) {
    case 'ArrowUp':
      shiftUp = false
      break;
    case 'ArrowDown':
      shiftDown = false
      break;
    case 'ArrowLeft':
      shiftLeft = false
      break;
    case 'ArrowRight':
      shiftRight = false
      break;
  }
}

function animate(){
  requestAnimationFrame( animate );
  controls.update();
  renderer.render(scene, camera);

  if(shiftUp){
    scene.position.z += (1 * movementSpeedFactor);
    sphere.position.z -= (1 * movementSpeedFactor);
  }

  if(shiftDown){
    scene.position.z -= (1 * movementSpeedFactor);
    sphere.position.z += (1 * movementSpeedFactor);
  }

  if(shiftLeft){
    scene.position.x += (1 * movementSpeedFactor);
    sphere.position.x -= (1 * movementSpeedFactor);
  }

  if(shiftRight){
    scene.position.x -= (1 * movementSpeedFactor);
    sphere.position.x += (1 * movementSpeedFactor);
  }
}

animate();


