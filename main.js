import * as THREE from './node_modules/three';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { setupScene } from './sceneSetup.js';
import { loadSounds, pauseAudio, resumeAudio, resetAll } from './audioManager.js';
import { loadScenario, loadVehicleModel } from './sceneManager.js';
import { setupControls } from './controls.js';
import { createRain, animateRain } from './rainAnimation.js';
import { addSunlight, addLight } from './blescanjeAnimation.js';
import { onMouseClick } from './onClick';

const { scene, camera, renderer } = setupScene();

const container = document.getElementById('canvas');
const width = container.offsetWidth;
const height = container.offsetHeight;
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const controls = setupControls(camera, renderer);
let sounds = [];

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

let oldSelectedVehicle = null;
let oldSelectedDirection = null;
let oldSelectedScenario = null;
let oldDezEnabled = false;

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

export function toggleMainMenu() {
    if (mainMenuVisible) {
        pauseSimulation();  // Ustavi simulacijo, če odpreš meni
        pauseAudio();
    } else if (!mainMenuVisible) {
        continueSimulation();
        resumeAudio();
    }
}
function pauseSimulation() {
    simulationRunning = false;
    console.log("Pavza")
}
export function stopSimulation() {
    simulationRunning = false;
    console.log("Prekinjena simulacija")
    // Odstranimo vse elemente razen osnovnih
    while (scene.children.length > 0) {
        const object = scene.children.pop();
        if (object !== camera && object !== renderer.domElement) {
            scene.remove(object);
        }
    }
    
    // Ponastavi parametre
    oldSelectedVehicle = null;
    oldSelectedDirection = null;
    oldSelectedScenario = null;
    oldDezEnabled = false;
}
function continueSimulation() {
    simulationRunning = true;
    renderer.setAnimationLoop(animate);
    console.log("Simulacija se nadaljuje");

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

// submit button
window.submit = submit;
function submit() {
    if (!selectedVehicle || !selectedDirection || !selectedScenario) {
        alert("Prosimo, izberi vozilo, smer in scenarij, preden pritisneš Submit.");
        return;
    }   

    resetAll(); 

    stopSimulation(); // Prekini prejšnjo simulacijo in ponastavi sceno

    // Shranimo prejšnje nastavitve pred ponastavitvijo
    oldSelectedVehicle = selectedVehicle;
    oldSelectedDirection = selectedDirection;
    oldSelectedScenario = selectedScenario;
    oldDezEnabled = dezEnabled;

    console.log(`Izbrano vozilo: ${oldSelectedVehicle}`);
    console.log(`Izbrana smer: ${oldSelectedDirection}`);
    console.log(`Izbrani scenarij: ${oldSelectedScenario}`);

    loadOsebniAvtomobil();
    sounds = loadSounds(oldDezEnabled, oldSelectedScenario, oldSelectedVehicle);
    console.log("Sounds: ", sounds);
    loadScenario(oldSelectedScenario, scene);
    loadVehicleModel(oldSelectedVehicle, scene, oldSelectedDirection, mixer, oldDezEnabled);
    addSunlight(scene, oldSelectedScenario);
    addLight(scene);

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
let mixer;

let counter = 1;
setInterval(() => {
    counter++;
    //console.log(`Counter: ${counter}`);
}, 100);

let modelPlosca; // to kar naj tu ostane
let osebniAvtomobil;

let avto1;
let avto2;

function loadOsebniAvtomobil() {
    loader.load('./scenariji/glb_objects/armaturna_plosca.glb', function (gltf) {
        modelPlosca = gltf.scene;
        modelPlosca.scale.set(19, 9, 9);
        modelPlosca.position.set(-1.9, -1.0, 0.3);
        modelPlosca.renderOrder = 1;
        scene.add(modelPlosca);
    }, undefined, function (error) {
        console.error(error);
    });
    loader.load('./scenariji/glb_objects/osebniavto.glb', function (gltf) {
        osebniAvtomobil = gltf.scene;
        osebniAvtomobil.scale.set(3.5, 3.5, 4); 
        osebniAvtomobil.position.set(0, -5.6, 3.2);
        osebniAvtomobil.rotation.set(0, Math.PI / 2, 0); 
        scene.add(osebniAvtomobil);
        // Kamere nisem nastavla... 
        // lahko preverimo, če je potrebno al je okej če jo uporabnik malo prilagodi sam z miško
        camera.position.set(0,2,6); // npr.   
    }, undefined, function (error) {
        console.error('Napaka pri nalaganju modela vozila:', error);
    });

    loader.load('./scenariji/glb_objects/osebniavto.glb', function (gltf) {
        avto1 = gltf.scene;
        avto1.scale.set(3.5, 3.5, 4);
        avto1.position.set(25, -5.6, 7.2);
        avto1.rotation.set(0, Math.PI / 2, 0);
        scene.add(avto1);
    }, undefined, function (error) {
        console.error('Napaka pri nalaganju modela vozila:', error);
    });

    loader.load('./scenariji/glb_objects/osebniavto.glb', function (gltf) {
        avto2 = gltf.scene;
        avto2.scale.set(3.5, 3.5, 4);
        avto2.position.set(25, -5.6, -80.2);
        avto2.rotation.set(0, Math.PI / 2, 0);
        scene.add(avto2);
    }, undefined, function (error) {
        console.error('Napaka pri nalaganju modela vozila:', error);
    });
}
loadOsebniAvtomobil(); 


// interaktivni prikaz zaslona
const raycaster = new THREE.Raycaster();

window.addEventListener('click', (event) => {
    onMouseClick(event, container, raycaster, camera, modelPlosca, selectedVehicle, selectedDirection);
});



let rainCreated = false;
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
    if (vehicleModel) { //smer premikanja
        switch (selectedDirection) {
            case "levo":
                vehicleModel.position.x += 10; 
                break;
            case "desno":
                vehicleModel.position.x -= 10; 
                break;
            case "spredaj":
                vehicleModel.position.z += 2; 
                break;
            case "zadaj":
                vehicleModel.position.z -= 1.5; 
                break;
        }
    }
    if (vehicleModel) {
        vehicleModel.traverse(function (child) {
            if (child.isMesh && child.name === "Lucka" || ["Lucka1", "Lucka2", "Lucka3", "Lucka4"].includes(child.name)) { // dodatek za luci pri resevalnem vozilu
                if (counter % 2 === 0) {
                    // child.material = new THREE.MeshStandardMaterial({ color: 0x0005A0 });
                    child.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                    child.userData.bloom = true; // Mark mesh for bloom
                } else {
                    child.material = new THREE.MeshStandardMaterial({ color: 0x115990 });
                    child.userData.bloom = false; // Remove bloom effect
                }
            }
        });
    }

    if (!rainCreated && dezEnabled) {
        createRain(scene, osebniAvtomobil);
        rainCreated = true;
    }

    if (dezEnabled) {
        //console.log("dez bo padal");
        animateRain();
    }


    if (avto1 && avto2 && selectedScenario === 'avtocesta') {
        avto1.position.z += -0.5;
        avto2.position.z += -1; }
    else if (selectedScenario === 'mesto' || selectedScenario === 'prazna'){
        avto1.visible = false;
        avto2.visible = false;
        
    }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
