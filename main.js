import * as THREE from './node_modules/three';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { setupScene } from './sceneSetup.js';
import { loadSounds } from './audioManager.js';
import { loadScenario, loadVehicleModel } from './sceneManager.js';
import { setupControls } from './controls.js';


const { scene, camera, renderer } = setupScene();

const container = document.getElementById('canvas');
const width = container.offsetWidth;
const height = container.offsetHeight;
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

/*// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.target.set(0, 0, 0);
controls.update();
*/

const controls = setupControls(camera, renderer);

window.addEventListener('resize', () => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Simulacija - spremljamo, ali je aktivna
let simulationRunning = false; // Simulacija je privzeto ustavljena
// Parametri, ki so potrebni za simulacijo
let selectedVehicle = null;
let selectedDirection = null;
let selectedScenario = null;
let dezEnabled = false;

let mainMenuVisible = false;

window.toggleMainMenu = toggleMainMenu;
document.addEventListener('keydown', (event) => {
    if (event.key === "Escape" || event.key === "m") {
        toggleMainMenu();
    }
    // Dodajanje možnosti za začetek simulacije ob pritisku na tipko P ali SPACE
    if ((event.key === "P" || event.key === " ") && !simulationRunning) {
        startSimulation();
    }
});

function toggleMainMenu() {
    mainMenuVisible = !mainMenuVisible;
    const menu = document.getElementById("popupMenu");
    menu.style.display = mainMenuVisible ? "block" : "none";
}

window.toggleRain = toggleRain;
function toggleRain() {
    dezEnabled = !dezEnabled;
    console.log(`Dež je ${dezEnabled ? 'vklopljen' : 'izklopljen'}`);
}


// tukaj je za vsako kategorijo da zberes en scenarij trenutno
window.selectVehicle = selectVehicle;
function selectVehicle(vehicleType) {
    console.log(`Izbrano intervencijsko vozilo: ${vehicleType}`);
    selectedVehicle = vehicleType;

    const vehicleButtons = document.querySelectorAll("#popupMenu .vehicle-button");
    vehicleButtons.forEach(button => button.classList.remove("selected"));

    const currentButton = event.target;
    currentButton.classList.add("selected");
}

window.setDirection = setDirection;
function setDirection(direction) {
    console.log(`Intervencijsko vozilo se približuje s strani: ${direction}`);
    selectedDirection = direction;

    const directionButtons = document.querySelectorAll("#popupMenu .direction-button");
    directionButtons.forEach(button => button.classList.remove("selected"));

    const currentButton = event.target;
    currentButton.classList.add("selected");
}

window.setScenario = setScenario;
function setScenario(scenario) {
    console.log(`Izbrani scenarij: ${scenario}`);
    selectedScenario = scenario;

    const scenarioButtons = document.querySelectorAll("#popupMenu .scenario-button");
    scenarioButtons.forEach(button => button.classList.remove("selected"));

    const currentButton = event.target;
    currentButton.classList.add("selected");
}

// dodala sem submit button
window.submit = submit;
function submit() {
    if (!selectedVehicle || !selectedDirection || !selectedScenario) {
        alert("Prosimo, izberi vozilo, smer in scenarij, preden pritisneš Submit.");
        return;
    }

    console.log(`Izbrano vozilo: ${selectedVehicle}`);
    console.log(`Izbrana smer: ${selectedDirection}`);
    console.log(`Izbrani scenarij: ${selectedScenario}`);

    loadSounds(dezEnabled, selectedScenario, selectedVehicle);
    loadScenario(selectedScenario, scene);
    loadVehicleModel(selectedVehicle, scene);

    hideMenu();

    simulationRunning = true;
    console.log("Simulacija je začela teči.");
}

function hideMenu() {
    const menu = document.getElementById("popupMenu");
    menu.style.display = "none";
    mainMenuVisible = false;
}

window.setVehicle = function (vehicleType) {
    console.log(`Izbrano vozilo: ${vehicleType}`);
    selectedVehicle = vehicleType;

    const vehicleButtons = document.querySelectorAll("#popupMenu .vehicle-button");
    vehicleButtons.forEach(button => button.classList.remove("selected"));

    const currentButton = event.target;
    currentButton.classList.add("selected");

    loadVehicleModel(vehicleType);
};


window.showHelp = showHelp;
function showHelp() {
    document.getElementById("popupMenu").style.display = "none";
    document.getElementById("help").style.display = "block";
}

window.closeHelp = closeHelp;
function closeHelp() {
    document.getElementById("help").style.display = "none";
    document.getElementById("popupMenu").style.display = "block";
}

const loader = new GLTFLoader();

let modelPlosca; // to kar naj tu ostane
loader.load('armaturna_plosca.glb', function (gltf) {
    modelPlosca = gltf.scene;
    modelPlosca.scale.set(19, 10, 10);
    modelPlosca.position.set(-1.9, -1.7, 0.3);
    modelPlosca.renderOrder = 1;
    scene.add(modelPlosca);
}, undefined, function (error) {
    console.error(error);
});

function animate() {
    if (!simulationRunning) return; // Pavza

    // Animacija dreves za samotno cesto
    if (scene.userData.animateTrees) {
        scene.userData.animateTrees(); 
    }

    // Animacija mesta (križišča in zgradbe)
    if (scene.userData.animateCity) {
        scene.userData.animateCity();
    }

    // Animacija avtoceste
    if (scene.userData.animateHighway) {
        scene.userData.animateHighway();
    }

    const vehicleModel = scene.userData.currentVehicleModel;
    if (vehicleModel) {
        vehicleModel.position.z -= 0.05; 
    }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

//function animate() {
    // Tukaj lahko dodamo svojo logiko za animacijo, ki se bo izvajala, ko je simulacija aktivna
//    renderer.render(scene, camera);
//}

// function animate() {

// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;

// 	renderer.render( scene, camera );

// }