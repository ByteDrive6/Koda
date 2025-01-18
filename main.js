import * as THREE from './node_modules/three';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { setupScene } from './sceneSetup.js';
import { loadSounds } from './audioManager.js';
//import { loadScenario, loadVehicleModel } from './sceneManager.js';

const { scene, camera, renderer } = setupScene();

const container = document.getElementById('canvas');
const width = container.offsetWidth;
const height = container.offsetHeight;
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.target.set(0, 0, 0);
controls.update();

window.addEventListener('resize', () => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

/*const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer = null;

// Funkcija za nalaganje zvočnega posnetka
function loadAudioFile(url) {
    console.log("Nalaganje posnetka z:", url); 
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(buffer => {
            audioBuffer = buffer;
            console.log('Posnetek uspešno naložen');
            playAudio();
        })
        .catch(error => {
            console.error('Error loading audio:', error);
        });
}
// Funkcija za predvajanje zvočnega ponsetka
function playAudio() {
    if (audioBuffer) {
        const audioSource = audioContext.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.connect(audioContext.destination);
        audioSource.start();
        console.log('Zvočni posnetek se predvaja');
    } else {
        console.error('Zvočni posnetek še ni naložen');
    }
}

// Funkcija za nalaganje zvokov
function loadSounds() {
    if (dezEnabled === true && selectedScenario === "avtocesta" && selectedVehicle === "resevalec") {
        // Nalagaj zvok dežja in avtoceste
        loadAudioFile('/Zvočni posnetki/Resevalne_sirene/posnetek5_2024_6_4_16_13_34.wav');
        console.log("Nalagam zvok dežja na avtocesti...");
    } 
    else if (dezEnabled === true && selectedScenario === "avtocesta" && selectedVehicle === "gasilci") {
        // Nalagaj zvok dežja in avtoceste
        loadAudioFile('/Zvočni posnetki/Gasilske_sirene/posnetek5_2024_05_04_14_49_04.wav')
        console.log("Nalagam zvok dežja na avtocesti...");
    } 
    else if (dezEnabled === true && selectedScenario === "avtocesta" && selectedVehicle === "policija") {
        // Nalagaj zvok dežja in avtoceste
        loadAudioFile('/Zvočni posnetki/Policijske_sirene/posnetek5_2024_7_4_19_52_51.wav')
        console.log("Nalagam zvok dežja na avtocesti...");
    } 
    else  if (dezEnabled === false && selectedScenario === "avtocesta" && selectedVehicle === "resevalec") {
        // Nalagaj avtocesto brez dežje
        loadAudioFile('/Zvočni posnetki/Resevalne_sirene/posnetek2_2024_4_4_19_19_33.wav')
        console.log("Nalagam zvok avtoceste...");
    } 
    else  if (dezEnabled === false && selectedScenario === "avtocesta" && selectedVehicle === "gasilci") {
        // Nalagaj avtocesto brez dežje
        loadAudioFile('/Zvočni posnetki/Gasilske_sirene/posnetek2_2024_05_04_14_22_18.wav')
        console.log("Nalagam zvok avtoceste...");
    } 
    else  if (dezEnabled === false && selectedScenario === "avtocesta" && selectedVehicle === "policija") {
        // Nalagaj avtocesto brez dežje
        loadAudioFile('/Zvočni posnetki/Policijske_sirene/posnetek2_2024_7_4_19_18_55.wav')
        console.log("Nalagam zvok avtoceste...");
    } 
    else if (dezEnabled === true && selectedScenario === "prazna" && selectedVehicle === "resevalec") {
        // Nalagaj zvok dežja in vožnje po samotni cesti
        loadAudioFile('/Zvočni posnetki/Resevalne_sirene/posnetek6_2024_6_4_16_21_42.wav')
        console.log("Nalagam zvok dežja in vožnje po samotni cesti...");
    }
    else if (dezEnabled === true && selectedScenario === "prazna" && selectedVehicle === "gasilci") {
        // Nalagaj zvok dežja in vožnje po samotni cesti
        loadAudioFile('/Zvočni posnetki/Gasilske_sirene/posnetek6_2024_05_04_14_59_34.wav')
        console.log("Nalagam zvok dežja in vožnje po samotni cesti...");
    }
    else if (dezEnabled === true && selectedScenario === "prazna" && selectedVehicle === "policija") {
        // Nalagaj zvok dežja in vožnje po samotni cesti
        loadAudioFile('/Zvočni posnetki/Policijske_sirene/posnetek6_2024_7_4_20_01_02.wav')
        console.log("Nalagam zvok dežja in vožnje po samotni cesti...");
    }
    else if (dezEnabled === false && selectedScenario === "prazna" && selectedVehicle === "resevalec") {
        // Nalagaj zvok vožnje po samotni cesti
        loadAudioFile('/Zvočni posnetki/Resevalne_sirene/posnetek3_2024_4_4_19_30_45.wav')
        console.log("Nalagam zvok vožnje po samotni cesti...");
    }
    else if (dezEnabled === false && selectedScenario === "prazna" && selectedVehicle === "gasilci") {
        // Nalagaj zvok vožnje po samotni cesti
        loadAudioFile('/Zvočni posnetki/Gasilske_sirene/posnetek3_2024_05_04_14_30_11.wav')
        console.log("Nalagam zvok vožnje po samotni cesti...");
    }
    else if (dezEnabled === false && selectedScenario === "prazna" && selectedVehicle === "policija") {
        // Nalagaj zvok vožnje po samotni cesti
        loadAudioFile('/Zvočni posnetki/Policijske_sirene/posnetek3_2024_7_4_19_25_34.wav')
        console.log("Nalagam zvok vožnje po samotni cesti...");
    }
    else if (dezEnabled === true && selectedScenario === "mesto" && selectedVehicle === "resevalec") {
        // Naloži zvok dežja in vožnje po mestu
        loadAudioFile('/Zvočni posnetki/Resevalne_sirene/posnetek4_2024_4_4_19_40_05.wav')
        console.log("Nalagam zvok dežja in vožnje po mestu...");
    }
    else if (dezEnabled === true && selectedScenario === "mesto" && selectedVehicle === "gasilci") {
        // Naloži zvok dežja in vožnje po mestu
        loadAudioFile('/Zvočni posnetki/Gasilske_sirene/posnetek4_2024_05_04_14_41_19.wav')
        console.log("Nalagam zvok dežja in vožnje po mestu...");
    }
    else if (dezEnabled === true && selectedScenario === "mesto" && selectedVehicle === "policija") {
        // Naloži zvok dežja in vožnje po mestu
        loadAudioFile('/Zvočni posnetki/Policijske_sirene/posnetek4_2024_7_4_19_38_25.wav')
        console.log("Nalagam zvok dežja in vožnje po mestu...");
    }
    else if (dezEnabled === false && selectedScenario === "mesto" && selectedVehicle === "resevalec") {
        // Naloži zvok vožnje po mestu
        loadAudioFile('/Zvočni posnetki/Resevalne_sirene/posnetek1_2024_4_4_19_13_45.wav')
        console.log("Nalagam zvok vožnje po mestu...");
    }
    else if (dezEnabled === false && selectedScenario === "mesto" && selectedVehicle === "gasilci") {
        // Naloži zvok vožnje po mestu
        loadAudioFile('/Zvočni posnetki/Gasilske_sirene/posnetek1_2024_05_04_14_13_33.wav')
        console.log("Nalagam zvok vožnje po mestu...");
    }
    else if (dezEnabled === false && selectedScenario === "mesto" && selectedVehicle === "policija") {
        // Naloži zvok vožnje po mestu
        loadAudioFile('/Zvočni posnetki/Policijske_sirene/posnetek1_2024_7_4_19_11_23.wav')
        console.log("Nalagam zvok vožnje po mestu...");
    }
} */


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

    loadScenario(selectedScenario);
    loadSounds(dezEnabled, selectedScenario, selectedVehicle);
    loadVehicleModel(selectedVehicle);
    hideMenu();

    simulationRunning = true;
    console.log("Simulacija je začela teči.");
}

function hideMenu() {
    const menu = document.getElementById("popupMenu");
    menu.style.display = "none";
    mainMenuVisible = false;
}

function loadVehicleModel(vehicleType) {
    const vehiclePaths = {
        resevalec: 'resevalnoVozilo.glb',
        gasilci: 'gasilskiAvto.glb', 
        policija: 'policijskiAvto.glb',
    };

    // pot do datoteke
    const modelPath = vehiclePaths[vehicleType];
    if (!modelPath) {
        console.error("Neznano vozilo:", vehicleType);
        return;
    }

    if (scene.userData.currentVehicleModel) {
        scene.remove(scene.userData.currentVehicleModel);
        scene.userData.currentVehicleModel = null;
    }

    // nov model
    const loader = new GLTFLoader();
    loader.load(modelPath, function (gltf) {
        const vehicleModel = gltf.scene;
        vehicleModel.scale.set(1, 1, 1);
        vehicleModel.position.set(0, 0, 0); // to je acetna pozicija, pol jo moramo urejat glede an smer
        scene.add(vehicleModel);

        // shranimo, da g alahko odstranimo potem
        scene.userData.currentVehicleModel = vehicleModel;

        console.log(`Model za ${vehicleType} uspešno naložen.`);
    }, undefined, function (error) {
        console.error("Napaka pri nalaganju modela vozila:", error);
    });
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



// Funkcija za nastavitev scenarija
async function loadScenario(scenario) {
    try {
        console.log(`Nalagam scenarij: ${scenario}`);
        switch (scenario) {
            case "avtocesta":
                const { setupHighwayScene } = await import('./scenariji/avtocesta.js');
                setupHighwayScene(scene);
                break;
            case "prazna":
                const { setupEmptyRoadScene } = await import('./scenariji/samotna_cesta.js');
                setupEmptyRoadScene(scene);
                break;
            case "mesto":
                const { setupCityScene } = await import('./scenariji/mesto.js');
                setupCityScene(scene);
                break;
            default:
                console.error("Neznan scenarij!");
        }
    } catch (error) {
        console.error("Napaka pri nalaganju scenarija:", error);
    }
}

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

let modelGasilski; // ta se zdaj privzeto prikazuje, mormo se uredit za vozila
loader.load('gasilskiAvto.glb', function (gltf) {
    modelGasilski = gltf.scene;
    modelGasilski.scale.set(1, 1, 1);
    modelGasilski.position.set(-20, 1, -7);
    modelGasilski.renderOrder = 2;
    scene.add(modelGasilski);
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

    // Animacija modela gasilskega vozila
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

//function animate() {
    // Tukaj lahko dodamo svojo logiko za animacijo, ki se bo izvajala, ko je simulacija aktivna
//    renderer.render(scene, camera);
//}

// function animate() {

// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;

// 	renderer.render( scene, camera );

// }