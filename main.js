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

// === Lucky (Origami) Star Factory ===
function makeLuckyStar({
                           outer = 5,        // tip radius
                           inner = 2.6,      // inner radius (between tips)
                           depth = 1.2,      // thickness of the star
                           bevelSize = 0.8,  // how rounded the edges feel
                           bevelThickness = 0.9,
                           bevelSegments = 6,
                           color = 0xffd1dc  // pastel pink default
                       } = {}) {

    // 1) Build a 2D 5-point star shape
    const shape = new THREE.Shape();
    const spikes = 5;
    for (let i = 0; i < spikes * 2; i++) {
        const r = (i % 2 === 0) ? outer : inner;
        const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2; // start “up”
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        (i === 0) ? shape.moveTo(x, y) : shape.lineTo(x, y);
    }
    shape.closePath();

    // 2) Extrude with bevels for the “puffy paper” edge
    const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelSize,
        bevelThickness,
        bevelSegments,
        curveSegments: 24
    });

    // 3) Paper-like material: pastel color + flat shading
    const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: true
    });

    const star = new THREE.Mesh(geo, mat);

    // 4) Gentle center “puff”: nudge vertices along normal (subtle)
    geo.computeVertexNormals();
    const pos = geo.attributes.position;
    const norm = geo.attributes.normal;
    for (let i = 0; i < pos.count; i++) {
        // push a tiny bit based on how close the vertex is to the center
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const radial = Math.sqrt(x*x + y*y);
        const push = 0.12 * Math.exp(-radial * 0.12); // softer in the middle
        pos.setXYZ(
            i,
            x + norm.getX(i) * push,
            y + norm.getY(i) * push,
            z + norm.getZ(i) * push
        );
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    // nice size to match your scene
    star.scale.set(1.3, 1.3, 1.3);
    return star;
}

const lucky = makeLuckyStar({ color: 0xffd1dc }); // pastel pink
lucky.position.set(0, 20, 0);
scene.add(lucky);


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

    // paper star
    lucky.rotation.y += 0.015;
    lucky.scale.setScalar(1 + 0.04 * Math.sin(Date.now() * 0.006));


}

animate();