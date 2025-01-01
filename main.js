import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; 
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

const scene = new THREE.Scene();
scene.background = null; 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0.7, 5);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 1); 
light.position.set(0, 0, 10);
light.castShadow = true;
scene.add(light);

const renderer = new THREE.WebGLRenderer({ alpha: true }); 

renderer.setClearColor(0x0000ff, 0);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const container = document.getElementById('canvas');
const width = container.offsetWidth;
const height = container.offsetHeight;
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const loader = new GLTFLoader(); 

let modelPlosca;
loader.load('armaturna_plosca.glb', function (gltf) {
    modelPlosca = gltf.scene;
    modelPlosca.scale.set(19, 10, 10); 
    modelPlosca.position.set(-1.9, -1.7, 0.3); 
    modelPlosca.renderOrder = 1;
    scene.add(modelPlosca);
}, undefined, function (error) {
    console.error(error);
});


let modelGasilski;
loader.load('gasilskiAvto.glb', function (gltf) {
    modelGasilski = gltf.scene;
    modelGasilski.scale.set(1, 1, 1); 
    modelGasilski.position.set(-20, 1, 0); 
    modelGasilski.renderOrder = 2;
    scene.add(modelGasilski);
}, undefined, function (error) {
    console.error(error);
});


function animate() {
    if (modelGasilski) {
        modelGasilski.position.x += 0.05; 
        modelGasilski.position.z -= 0.07;
        modelGasilski.scale.multiplyScalar(0.995); 

        if (modelGasilski.scale.x < 0.15) {
            scene.remove(modelGasilski); 
            modelGasilski = null;
        }
    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);


window.addEventListener('resize', () => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});






// function animate() {

// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;

// 	renderer.render( scene, camera );

// }