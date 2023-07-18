import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer(
  {
    canvas: document.querySelector('#bg'),
  }
);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(60);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 2, 36, 100);

// create a object to import a blender model
// how to import a blender model
// https://threejs.org/docs/#manual/en/introduction/Loading-3D-models

const loader = new GLTFLoader();
const obb = loader.load('GettingTheHangOFIT.blend');
// loader.position.z = -10;
// obb.position.x = 20;
scene.add(obb);


// the MeshBasicMaterial is a material that is not affected by light
// const material = new THREE.MeshBasicMaterial({ color: 0xFF6347,wireframe: true });

const material = new THREE.MeshStandardMaterial({ color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

const pointlight = new THREE.PointLight(0xffffff);
pointlight.position.set(-0.50, 10, 10);
scene.add(pointlight);

const ambientlight = new THREE.AmbientLight(0xffffff);
scene.add(ambientlight);

const lighthelper = new THREE.PointLightHelper(pointlight);
scene.add(lighthelper);

const gridhelper = new THREE.GridHelper(200, 50);
scene.add(gridhelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar()
{
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star);
}

Array(500).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('h7.png');
scene.background = spaceTexture;

const exitText = new THREE.TextureLoader().load('exit.png');

const jeff = new THREE.Mesh(
  // new THREE.BoxGeometry(9,9,9), // for a cube
  new THREE.SphereGeometry(7,32,32), // for a sphere
  // new THREE.MeshBasicMaterial({color: 0xff9000})  // its adding a color to the box
  new THREE.MeshStandardMaterial({map: exitText})
)
jeff.rotateY(5.1);
scene.add(jeff)

torus.position.z = -10;
jeff.position.z = -10;

torus.position.x = 20;
jeff.position.x = 20;

torus.position.y  = 20;
jeff.position.y  = 20;

function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  jeff.rotation.x += 0.05;
  jeff.rotation.y += 0.075;
  jeff.rotation.z += 0.05;

  camera.position.z = t * 0.1;
  camera.position.x = t * 0.02;
  camera.position.y = t * 0.02;

}

document.body.onscroll = moveCamera;

scene.add(torus)
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

animate();