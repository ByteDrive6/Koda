import * as THREE from './node_modules/three';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { setupScene } from './sceneSetup.js';
import { loadSounds } from './audioManager.js';
import { loadScenario, loadVehicleModel } from './sceneManager.js';
import { setupControls } from './controls.js';
import { createRain, animateRain } from './rainAnimation.js';
import { addSunlight, addLight } from './blescanjeAnimation.js';


const { scene, camera, renderer } = setupScene();

const container = document.getElementById('canvas');
const width = container.offsetWidth;
const height = container.offsetHeight;
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

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

const loader = new GLTFLoader();
let mixer;

let counter = 1;
setInterval(() => {
    counter++;
    //console.log(`Counter: ${counter}`);
}, 100);


let modelPlosca; // to kar naj tu ostane
loader.load('./scenariji/glb_objects/armaturna_plosca.glb', function (gltf) {
    modelPlosca = gltf.scene;
    modelPlosca.scale.set(19, 9, 9);
    modelPlosca.position.set(-1.9, -1.0, 0.3);
    modelPlosca.renderOrder = 1;
    scene.add(modelPlosca);
    // modelPlosca.traverse(child => {
    //     console.log("Child object:", child.name); 
    // });
}, undefined, function (error) {
    console.error(error);
});

window.submit = submit;
function submit() {
    if (!selectedVehicle || !selectedDirection || !selectedScenario) {
        alert("Prosimo, izberi vozilo, smer in scenarij, preden pritisneš Submit.");
        return;
    }

    console.log(`Izbrano vozilo: ${selectedVehicle}`);
    console.log(`Izbrana smer: ${selectedDirection}`);
    console.log(`Izbrani scenarij: ${selectedScenario}`);

    //ODKOMENTIRAJ ZA ZVOK!!!!!!!!
    loadSounds(dezEnabled, selectedScenario, selectedVehicle);
    loadScenario(selectedScenario, scene);
    loadVehicleModel(selectedVehicle, scene, selectedDirection, mixer, dezEnabled, modelPlosca);
    addSunlight(scene, selectedScenario);
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

let osebniAvtomobil;
// Nalaganje modela vozila
loader.load('./scenariji/glb_objects/osebniavto.glb', function (gltf) {
    osebniAvtomobil = gltf.scene;
    osebniAvtomobil.scale.set(3.5, 3.5, 4);
    osebniAvtomobil.position.set(0, -5.6, 3.2);
    osebniAvtomobil.rotation.set(0, Math.PI / 2, 0);
    scene.add(osebniAvtomobil);
    // Kamere nisem nastavla... 
    // lahko preverimo, če je potrebno al je okej če jo uporabnik malo prilagodi sam z miško
    // camera.position.set(0,2,6); // npr.   
}, undefined, function (error) {
    console.error('Napaka pri nalaganju modela vozila:', error);
});

// interaktivni prikaz zaslona
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {

    const rect = container.getBoundingClientRect(); // da se bo samo container gledal

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (modelPlosca) {
        const intersects = raycaster.intersectObject(modelPlosca, true);

        if (intersects.length > 0) {
            console.log("Clicked object:", intersects[0].object.name);

            if (intersects[0].object.name === 'Cube') {
                console.log("Pravi zaslon");
                if (selectedVehicle === "gasilci" && selectedDirection === 'spredaj' || selectedVehicle === "gasilci" && selectedDirection === 'zadaj') {
                    window.open(
                        "gasilci.html",
                        "POZOR",
                        "width=600,height=600,resizable=no,scrollbars=no"
                    );
                } 
                else if (selectedVehicle === "gasilci" && selectedDirection === 'levo' || selectedVehicle === "gasilci" && selectedDirection === 'desno') {
                    var popupWindow = window.open(
                        "", 
                        "POZOR", 
                        "width=600,height=600,resizable=no,scrollbars=no"
                    );

                    var message = '';
                    if (selectedDirection === 'levo') {
                        message = 'UMAKNITE SE NA DESNO!';
                    } else if (selectedDirection === 'desno') {
                        message = 'UMAKNITE SE NA LEVO!';
                    }
                    popupWindow.document.write(`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="utf-8">
                            <title>POZOR GASILSKO VOZILO!!!!</title>
                            <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                            <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                            <script src="spin.js" defer></script>
                            <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    background: linear-gradient(135deg, #ff4d4d, #ff9999);
                                    font-family: 'Arial', sans-serif;
                                    color: #ffffff;
                                    text-align: center;
                                }
                                h1 {
                                    font-size: 3rem;
                                    font-weight: bold;
                                    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
                                    animation: pulse 1.5s infinite;
                                }
                                @keyframes pulse {
                                    0%, 100% {
                                        transform: scale(1);
                                        color: #ffffff;
                                    }
                                    50% {
                                        transform: scale(1.1);
                                        color: #ffe6e6;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <div id="map" style="height: 400px;"></div>
                            <h1>${message}</h1>
                        </body>
                        </html>
                    `);
                
                    popupWindow.document.close(); 
                }             
                else if (selectedVehicle === 'resevalec' && selectedDirection === 'spredaj' || selectedVehicle === "resevalec" && selectedDirection === 'zadaj') {
                    window.open(
                        "resevalec.html",
                        "POZOR",
                        "width=500,height=500,resizable=no,scrollbars=no"
                    );
                }
                else if (selectedVehicle === 'policija' && selectedDirection === 'spredaj' || selectedVehicle === "policija" && selectedDirection === 'zadaj') {
                    window.open(
                        "policija.html",
                        "POZOR",
                        "width=500,height=500,resizable=no,scrollbars=no"
                    );
                }
                else if (selectedVehicle === "gasilci" && selectedDirection === 'levo' || selectedVehicle === "gasilci" && selectedDirection === 'levo') {
                    var popupWindow = window.open(
                        "gasilci.html",
                        "POZOR",
                        "width=700,height=600,resizable=no,scrollbars=no"
                    );

                    popupWindow.onload = function () {
                        popupWindow.document.body.innerHTML = "<h1>Halo</h1>";
                    };
                }
                else if (selectedVehicle === "resevalec" && selectedDirection === 'levo' || selectedVehicle === "resevalec" && selectedDirection === 'desno') {
                    var popupWindow = window.open(
                        "resevalec.html",
                        "POZOR",
                        "width=700,height=600,resizable=no,scrollbars=no"
                    );

                    popupWindow.onload = function () {
                        if (selectedDirection === 'levo') {
                            popupWindow.document.body.innerHTML = "<h1>UMAKNITE SE NA DESNO!</h1>";
                        }
                        else {
                            popupWindow.document.body.innerHTML = "<h1>UMAKNITE SE NA LEVO!</h1>";
                        }

                    };
                }
                else if (selectedVehicle === "policija" && selectedDirection === 'levo' || selectedVehicle === "policija" && selectedDirection === 'desno') {
                    var popupWindow = window.open(
                        "policija.html",
                        "POZOR",
                        "width=700,height=600,resizable=no,scrollbars=no"
                    );

                    popupWindow.onload = function () {
                        if (selectedDirection === 'levo') {
                            popupWindow.document.body.innerHTML = "<h1>UMAKNITE SE NA DESNO!</h1>";
                        }
                        else {
                            popupWindow.document.body.innerHTML = "<h1>UMAKNITE SE NA LEVO!</h1>";
                        }

                    };
                }

            }
        } else {
            console.log("Ni intersekcij.");
        }
    }
}

window.addEventListener('click', onMouseClick);

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
                vehicleModel.position.x += 0.5;
                break;
            case "desno":
                vehicleModel.position.x -= 0.5;
                break;
            case "spredaj":
                vehicleModel.position.z += 0.5;
                break;
            case "zadaj":
                vehicleModel.position.z -= 0.5;
                break;
        }
    }
    if (vehicleModel) {
        vehicleModel.traverse(function (child) {
            if (child.isMesh && child.name === "Lucka") {
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
        console.log("dez bo padal");
        animateRain();
    }




    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
