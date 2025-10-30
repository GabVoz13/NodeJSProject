import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);
camera.position.setX(-3);

// === Create Cube with Phong Material to Accept Lights ===
// This cube demonstrates basic object creation with lighting.
const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.z = -15;
cube.position.x = -15;
cube.rotation.x = 2;
cube.rotation.y = 0.5;
scene.add(cube);

const icoGeometry = new THREE.IcosahedronGeometry(10);
const icoMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
icoMesh.position.z = -15;
icoMesh.position.x = 15;
scene.add(icoMesh);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, -10, 10);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.position.set(25, -15, -400);

scene.add(pointLight);
scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const spaceTexture = new THREE.TextureLoader().load('images/night_sky.jpg');
scene.background = spaceTexture;

const smileTexture = new THREE.TextureLoader().load('images/smile.jpg');
const sphereGeometry = new THREE.SphereGeometry(10, 22, 10);
const smileMaterial = new THREE.MeshBasicMaterial({ map: smileTexture });
const smileMesh = new THREE.Mesh(sphereGeometry, smileMaterial);
scene.add(smileMesh);

const normalTexture = new THREE.TextureLoader().load('images/normals/textureNormal.png');
const torusGeo = new THREE.TorusKnotGeometry(5, 1, 250, 5, 9, 15);
const torusMaterial = new THREE.MeshStandardMaterial({
    normalMap: normalTexture,
    roughness: 0,
    metalness: 0.8
});
const torusKnot = new THREE.Mesh(torusGeo, torusMaterial);
torusKnot.position.y = 20;
scene.add(torusKnot);

function animate() {
    requestAnimationFrame(animate);

    // Rotate cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Rotate icosahedron
    icoMesh.rotation.z += -0.03;
    icoMesh.rotation.y += -0.03;

    // Rotate smiley sphere
    smileMesh.rotation.y += 0.05;

    // Update orbit controls
    controls.update();

    renderer.render(scene, camera);

}

animate();