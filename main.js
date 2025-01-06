import * as THREE from './node_modules/three';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { CSS3DRenderer } from './node_modules/three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';  // Add this line


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

/*
// OrbitControls - za kamero
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.minDistance = 1; 
controls.maxDistance = 50; 
controls.target.set(0, 0, 0); 
controls.update();

const loader = new GLTFLoader(); 

// ozadje
let backgroundModel;
loader.load('ozadje.glb', function (gltf) {
    backgroundModel = gltf.scene;
    backgroundModel.scale.set(4, 2, -1);
    backgroundModel.position.set(-18, -3, -400);
    scene.add(backgroundModel);
}, undefined, function (error) {
    console.error(error);
});


let treeModel; // iz spleta model
loader.load('tree.glb', function (gltf) {
    treeModel = gltf.scene;
    treeModel.scale.set(7, 3, -1);
    treeModel.position.set(60, 3, -100);
    scene.add(treeModel);
}, undefined, function (error) {
    console.error(error);
});

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
    if (treeModel) {
        treeModel.position.z += 0.5; 
    }

    if (modelGasilski) {
        modelGasilski.position.x += 0.04;
        modelGasilski.position.z -= 0.07;
        modelGasilski.scale.multiplyScalar(0.995);

        if (modelGasilski.scale.x < 0.15) {
            scene.remove(modelGasilski);
            modelGasilski = null;
        }
    }
    controls.update(); // OrbitControls
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Lahko bi uporabile to kot eno funkcijo za nalaganje modelov intervencijskih vozil:
function loadModels() {
    const loader = new GLTFLoader();
    
    if (selectedVehicle === "resevalec") {
        // Nalaganje modela reševalnega vozila
        loader.load('resevalec.glb', function (gltf) {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            scene.add(model);
        });
    } else if (selectedVehicle === "gasilci") {
        // Nalaganje modela gasilskega vozila
        loader.load('gasilci.glb', function (gltf) {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            scene.add(model);
        });
        
    } else if (selectedVehicle === "policija") {
        // Nalaganje modela policijskega vozila
        loader.load('policija.glb', function (gltf) {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            scene.add(model);
        });
    }
}*/

// Funkcija za nastavitev scenarija
function setScenarioEnvironment() {
    if (selectedScenario === "avtocesta") {
        // Nastavi avtocesto
        console.log("Nastavljena avtocesta.");
        // Dodadamo okolje avtoceste
    } else if (selectedScenario === "prazna") {
        // Nastavi samotno cesto
        console.log("Nastavljena samotna cesta.");
        // Dodaj modele dreves in prazno cesto - ubistvu že imamo to
    } else if (selectedScenario === "mesto") {
        // Nastavi mesto - pomojem lahko tisto z interneta
        console.log("Nastavljeno mesto.");
    }

    if (dezEnabled === true) {
        // Dodaj simulacijo dežnih kapljic na izbran scenarij
        console.log("Dodana simulacija dežnih kapljic.");
        // Lahko dodamo padanje dežnih kapljic na vetrobransko steklo - eni sošolci imajo to implementacijo
    }
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
}



window.addEventListener('resize', () => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Simulacija - spremljamo, ali je aktivna
let simulationRunning = false;
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
    if (mainMenuVisible) {
        document.getElementById("help").style.display = "none";
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

window.selectVehicle = selectVehicle;
// Izberi vozilo
function selectVehicle(vehicleType) {
    console.log(`Izbrano intervencijsko vozilo: ${vehicleType}`);
    selectedVehicle = vehicleType;
}

window.setDirection = setDirection;
// Izberi smer s katere se približuje intervencijsko vozilo
function setDirection(direction) {
    console.log(`Intervencijsko vozilo se približuje s strani: ${direction}`);
    selectedDirection = direction;
}

window.setScenario = setScenario;
// Nastavi scenarij (npr. dež, avtocesta, prazna/samotna cesta...)
function setScenario(scenario) {
    console.log(`Izbrani scenarij: ${scenario}`);
    selectedScenario = scenario;
}

window.closeMenu = closeMenu;
function closeMenu() {
    document.getElementById("popupMenu").style.display = "none";
}

window.toggleRain = toggleRain;
function toggleRain() {
    dezEnabled = !dezEnabled;
    console.log(`Dež je ${dezEnabled ? 'vklopljen' : 'izklopljen'}`);
}


// Funkcija za začetek simulacije
function startSimulation() {
    // Preveri, ali so vsi parametri nastavljeni
    if (!selectedVehicle || !selectedDirection || !selectedScenario) {
        alert("Prosimo, nastavi vse parametre (vozilo, smer, scenarij) v Main Menu ('esc' ali 'M') pred začetkom simulacije.");
        return;  // Prekini začetek simulacije, če niso vsi parametri nastavljeni
    }

    simulationRunning = true;
    console.log("Simulacija se je začela!");

    // Nalaganje modelov
    setScenarioEnvironment();
    loadSounds(); // Naloži in predvajaj

    // Tukaj lahko damo dodatno kodo za zagon simulacije, kot so premikanje modelov, zagon animacij itd.
    //animate();
}


//function animate() {
    // Tukaj lahko dodamo svojo logiko za animacijo, ki se bo izvajala, ko je simulacija aktivna
//    renderer.render(scene, camera);
//}

// function animate() {

// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;

// 	renderer.render( scene, camera );

// }